/* eslint-disable  max-lines --
 * gRPC is verbose. Playing code golf with this file would decrease clarity for little readability gain.
 */
import Utils from '../Common/utils'


import {
  XRPDropsAmount,
  Currency,
  IssuedCurrencyAmount,
  CurrencyAmount,
} from './generated/org/xrpl/rpc/v1/amount_pb'
import {
  Authorize,
  ClearFlag,
  DestinationTag,
  Domain,
  EmailHash,
  InvoiceID,
  MessageKey,
  SetFlag,
  TransferRate,
  TickSize,
} from './generated/org/xrpl/rpc/v1/common_pb'
import {
  AccountSet,
  Memo,
  Payment,
  Transaction,
  DepositPreauth,
} from './generated/org/xrpl/rpc/v1/transaction_pb'
import XrpUtils from './xrp-utils'

type TransactionDataJSON = AccountSetJSON | DepositPreauthJSON | PaymentJSON

interface AccountSetJSON {
  ClearFlag?: ClearFlagJSON
  Domain?: DomainJSON
  EmailHash?: EmailHashJSON
  MessageKey?: MessageKeyJSON
  SetFlag?: SetFlagJSON
  TransactionType: string
  TransferRate?: TransferRateJSON
  TickSize?: TickSizeJSON
}

interface DepositPreauthJSON {
  Authorize?: AuthorizeJSON
  TransactionType: string
  Unauthorize?: string
}

interface PaymentJSON {
  Amount: CurrencyAmountJSON
  Destination: string
  DestinationTag?: DestinationTagJSON
  TransactionType: string
}

interface MemoJSON {
  Memo?: MemoDetailsJSON
}

interface MemoDetailsJSON {
  MemoData?: Uint8Array
  MemoType?: Uint8Array
  MemoFormat?: Uint8Array
}

interface BaseTransactionJSON {
  Account: string
  Fee: XRPDropsAmountJSON
  LastLedgerSequence: number
  Sequence: number
  SigningPubKey: string
  TxnSignature?: string
  Memos?: MemoJSON[]
}

interface AccountSetJSONAddition extends AccountSetJSON {
  TransactionType: 'AccountSet'
}

interface DepositPreauthJSONAddition extends DepositPreauthJSON {
  TransactionType: 'DepositPreauth'
}

interface PaymentTransactionJSONAddition extends PaymentJSON {
  TransactionType: 'Payment'
}

interface PathElementJSON {
  account?: string
  issuer?: string
  currencyCode?: CurrencyJSON
}

interface IssuedCurrencyAmountJSON {
  value: string
  currency: CurrencyJSON
  issuer: string
}

type XRPDropsAmountJSON = string
type CurrencyAmountJSON = IssuedCurrencyAmountJSON | XRPDropsAmountJSON
type ClearFlagJSON = number
type EmailHashJSON = string
type SetFlagJSON = number
type TickSizeJSON = number
type DestinationTagJSON = number
type TransferRateJSON = number
type DomainJSON = string
type MessageKeyJSON = string
type AuthorizeJSON = string
type InvoiceIdJSON = string
type PathJSON = PathElementJSON[]
type CurrencyJSON = string
type AccountSetTransactionJSON = BaseTransactionJSON & AccountSetJSONAddition

type DepositPreauthTransactionJSON = BaseTransactionJSON &
  DepositPreauthJSONAddition

type PaymentTransactionJSON = BaseTransactionJSON &
  PaymentTransactionJSONAddition

export type TransactionJSON =
  | BaseTransactionJSON
  | AccountSetTransactionJSON
  | DepositPreauthTransactionJSON
  | PaymentTransactionJSON

/**
 * Provides functionality to serialize from protocol buffers to JSON objects.
 */
const serializer = {
  /**
   * Convert a Transaction to a JSON representation.
   *
   * @param transaction - A Transaction to convert.
   * @param signature - An optional hex encoded signature to include in the transaction.
   * @returns The Transaction as JSON.
   */
  // eslint-disable-next-line max-statements, max-lines-per-function -- No clear way to refactor this because gRPC is verbose.
  transactionToJSON(
    transaction: Transaction,
    signature?: string,
  ): TransactionJSON | undefined {
    const object: TransactionJSON = {
      Account: '',
      Fee: '',
      Sequence: 0,
      LastLedgerSequence: 0,
      SigningPubKey: '',
    }

    const normalizedAccount = getNormalizedAccount(transaction)
    if (!normalizedAccount) {
      return undefined
    }
    object.Account = normalizedAccount

    // Convert XRP denominated fee field.
    const txFee = transaction.getFee()
    if (txFee === undefined) {
      return undefined
    }
    object.Fee = this.xrpAmountToJSON(txFee)

    // Set sequence numbers
    object.Sequence = transaction.getSequence()?.getValue() ?? 0
    object.LastLedgerSequence =
      transaction.getLastLedgerSequence()?.getValue() ?? 0

    const signingPubKeyBytes = transaction
      .getSigningPublicKey()
      ?.getValue_asU8()
    if (signingPubKeyBytes) {
      object.SigningPubKey = Utils.toHex(signingPubKeyBytes)
    }

    const additionalTransactionData = getAdditionalTransactionData(transaction)
    if (additionalTransactionData === undefined) {
      return undefined
    }
    Object.assign(object, additionalTransactionData)

    if (signature) {
      object.TxnSignature = signature
    }

    Object.assign(object, this.memosToJSON(transaction.getMemosList()))

    return object
  },

  /**
   * Convert a Payment to a JSON representation.
   *
   * @param payment - The Payment to convert.
   * @returns The Payment as JSON.
   */
  // eslint-disable-next-line max-statements -- No clear way to make this more succinct because gRPC is verbose
  paymentToJSON(payment: Payment): PaymentJSON | undefined {
    const json: PaymentJSON = {
      Amount: '',
      Destination: '',
      TransactionType: 'Payment',
    }

    // If an x-address was able to be decoded, add the components to the json.
    const destination = payment.getDestination()?.getValue()?.getAddress()
    if (!destination) {
      return undefined
    }

    // TODO(keefertaylor): Use `destinationTagToJSON` here when X-Addresses are supported in ripple-binary-codec.
    const decodedXAddress = XrpUtils.decodeXAddress(destination)
    json.Destination = decodedXAddress?.address ?? destination
    if (decodedXAddress?.tag !== undefined) {
      json.DestinationTag = decodedXAddress.tag
    }

    const currencyAmount = payment.getAmount()?.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }
    const currencyAmountJSON = this.currencyAmountToJSON(currencyAmount)
    if (currencyAmountJSON === undefined) {
      return undefined
    }
    json.Amount = currencyAmountJSON

    return json
  },

  /**
   * Convert a DepositPreauth to a JSON representation.
   *
   * @param depositPreauth - The DepositPreauth to convert.
   * @returns The DepositPreauth as JSON.
   */
  depositPreauthToJSON(
    depositPreauth: DepositPreauth,
  ): DepositPreauthJSON | undefined {
    const json: DepositPreauthJSON = {
      TransactionType: 'DepositPreauth',
    }
    const type = depositPreauth.getAuthorizationOneofCase()
    switch (type) {
      case DepositPreauth.AuthorizationOneofCase.AUTHORIZE: {
        const authorize = depositPreauth.getAuthorize()
        if (authorize === undefined) {
          return undefined
        }

        const authorizeJSON = this.authorizeToJSON(authorize)
        json.Authorize = authorizeJSON
        return json
      }
      case DepositPreauth.AuthorizationOneofCase.UNAUTHORIZE: {
        const unauthorize = depositPreauth
          .getUnauthorize()
          ?.getValue()
          ?.getAddress()

        json.Unauthorize = unauthorize
        return json
      }
      case DepositPreauth.AuthorizationOneofCase.AUTHORIZATION_ONEOF_NOT_SET: {
        return undefined
      }
      default: {
        return undefined
      }
    }
  },

  /**
   * Convert a AccountSet to a JSON representation.
   *
   * @param accountSet - The AccountSet to convert.
   * @returns The AccountSet as JSON.
   */
  // eslint-disable-next-line max-statements -- No clear way to make this more succinct because gRPC is verbose
  accountSetToJSON(accountSet: AccountSet): AccountSetJSON | undefined {
    const json: AccountSetJSON = { TransactionType: 'AccountSet' }

    const clearFlag = accountSet.getClearFlag()
    if (clearFlag !== undefined) {
      json.ClearFlag = this.clearFlagToJSON(clearFlag)
    }

    const domain = accountSet.getDomain()
    if (domain !== undefined) {
      json.Domain = this.domainToJSON(domain)
    }

    const emailHash = accountSet.getEmailHash()
    if (emailHash !== undefined) {
      json.EmailHash = this.emailHashToJSON(emailHash)
    }

    const messageKey = accountSet.getMessageKey()
    if (messageKey !== undefined) {
      json.MessageKey = this.messageKeyToJSON(messageKey)
    }

    const setFlag = accountSet.getSetFlag()
    if (setFlag !== undefined) {
      json.SetFlag = this.setFlagToJSON(setFlag)
    }

    const transferRate = accountSet.getTransferRate()
    if (transferRate !== undefined) {
      json.TransferRate = this.transferRateToJSON(transferRate)
    }

    const tickSize = accountSet.getTickSize()?.getValue()
    if (tickSize !== undefined) {
      json.TickSize = tickSize
    }

    return json
  },

  /**
   * Convert an XRPDropsAmount to a JSON representation.
   *
   * @param xrpDropsAmount - The XRPAmount to convert.
   * @returns The XRPAmount as JSON.
   */
  xrpAmountToJSON(xrpDropsAmount: XRPDropsAmount): string {
    return `${xrpDropsAmount.getDrops()}`
  },

  /**
   * Convert a payment's Path to a JSON representation.
   *
   * @param path - The Path to convert.
   * @returns The Path as JSON.
   */
  pathToJSON(path: Payment.Path): PathJSON {
    const elements = path.getElementsList()
    return elements.map((element) => {
      return this.pathElementToJSON(element)
    })
  },

  /**
   * Convert a payment's PathElement to a JSON representation.
   *
   * @param pathElement - The PathElement to convert.
   * @returns The PathElement as JSON.
   */
  pathElementToJSON(pathElement: Payment.PathElement): PathElementJSON {
    const json: PathElementJSON = {}

    const issuer = pathElement.getIssuer()?.getAddress()
    if (issuer) {
      json.issuer = issuer
    }

    const currency = pathElement.getCurrency()
    if (currency) {
      json.currencyCode = this.currencyToJSON(currency)
    }

    const account = pathElement.getAccount()?.getAddress()
    if (account) {
      json.account = account
    }

    return json
  },

  /**
   * Convert an array of Memo objects to a JSON representation keyed by
   * a field called 'Memos' iff the array is not empty and it contains
   * non-empty objects.
   *
   * @param memos - The Memos to convert.
   *
   * @returns An array of the Memos in JSON format, or undefined.
   */
  memosToJSON(memos: Memo[]): { Memos: MemoJSON[] } | undefined {
    if (!memos.length) {
      return undefined
    }

    const convertedMemos = memos.map((memo) => this.memoToJSON(memo))
    return { Memos: convertedMemos }
  },

  /**
   * Convert a Memo to a JSON representation.
   *
   * @param memo - The Memo to convert.
   * @returns The Memo as JSON.
   */
  memoToJSON(memo: Memo): MemoJSON {
    const jsonMemo: MemoDetailsJSON = {
      MemoData: memo.getMemoData()?.getValue_asU8(),
      MemoFormat: memo.getMemoFormat()?.getValue_asU8(),
      MemoType: memo.getMemoType()?.getValue_asU8(),
    }

    return {
      Memo: jsonMemo,
    }
  },

  /**
   * Convert a {@link IssuedCurrencyAmount} to a JSON representation.
   *
   * @param issuedCurrencyAmount - The {@link IssuedCurrencyAmount} to convert.
   * @returns A JSON representation of the input.
   */
  issuedCurrencyAmountToJSON(
    issuedCurrencyAmount: IssuedCurrencyAmount,
  ): IssuedCurrencyAmountJSON | undefined {
    const currencyWrapper = issuedCurrencyAmount.getCurrency()
    const value = issuedCurrencyAmount.getValue()
    // TODO(keefertaylor): Use accountAddressToJSON here.
    const issuer = issuedCurrencyAmount.getIssuer()?.getAddress()

    if (currencyWrapper === undefined || value === '' || issuer === undefined) {
      return undefined
    }

    const currency = this.currencyToJSON(currencyWrapper)
    if (currency === undefined) {
      return undefined
    }

    return {
      currency,
      value,
      issuer,
    }
  },

  /**
   * Convert a Currency to a JSON representation.
   *
   * @param currency - The Currency to convert.
   * @returns The Currency as JSON.
   */
  currencyToJSON(currency: Currency): CurrencyJSON | undefined {
    const currencyName = currency.getName()
    if (currencyName !== '') {
      return currencyName
    }

    const currencyCodeBytes = currency.getCode_asU8()
    if (currencyCodeBytes.length !== 0) {
      return Utils.toHex(currencyCodeBytes)
    }

    return undefined
  },

  /**
   * Convert a ClearFlag to a JSON representation.
   *
   * @param clearFlag - The ClearFlag to convert.
   * @returns The ClearFlag as JSON.
   */
  clearFlagToJSON(clearFlag: ClearFlag): ClearFlagJSON {
    return clearFlag.getValue()
  },
    
  /**
   * Convert an EmailHash to a JSON representation.
   *
   * @param emailHash - The EmailHash to convert.
   * @returns The EmailHash as JSON.
   */
  emailHashToJSON(emailHash: EmailHash): EmailHashJSON {
    const emailHashBytes = emailHash.getValue_asU8()
    return Utils.toHex(emailHashBytes)
  },

  /**
   * Convert a SetFlag to a JSON representation.
   *
   * @param setFlag - The SetFlag to convert.
   * @returns The SetFlag as JSON.
   */
  setFlagToJSON(setFlag: SetFlag): SetFlagJSON {
    return setFlag.getValue()
  },

  /**
   * Convert a TickSize to a JSON representation.
   *
   * @param tickSize - The TickSize to convert.
   * @returns The TickSize as JSON.
   */
  tickSizeToJSON(tickSize: TickSize): TickSizeJSON {
    return tickSize.getValue()
  },

  /**
   * Convert a DestinationTag to a JSON representation.
   *
   * @param destinationTag - The DestinationTag to convert.
   * @returns The DestinationTag as JSON.
   */
  destinationTagToJSON(destinationTag: DestinationTag): DestinationTagJSON {
    return destinationTag.getValue()
  },

  /**
   * Convert a TransferRate to a JSON representation.
   *
   * @param transferRate - The TransferRate to convert.
   * @returns The TransferRate as JSON.
   */
  transferRateToJSON(transferRate: TransferRate): TransferRateJSON {
    return transferRate.getValue()
  },

  /**
   * Convert a Domain to a JSON representation.
   *
   * @param domain - The Domain to convert.
   * @returns The Domain as JSON.
   */
  domainToJSON(domain: Domain): DomainJSON {
    return domain.getValue()
  },

  /**
   * Convert a MessageKey to a JSON representation.
   *
   * @param messageKey - The MessageKey to convert.
   * @returns The MessageKey as JSON.
   */
  messageKeyToJSON(messageKey: MessageKey): MessageKeyJSON {
    const messageKeyBytes = messageKey.getValue_asU8()
    return Utils.toHex(messageKeyBytes)
  },

  /**
   * Convert an Authorize to a JSON representation.
   *
   * @param authorize - The Authorize to convert.
   * @returns The Authorize as JSON.
   */
  authorizeToJSON(authorize: Authorize): AuthorizeJSON | undefined {
    const accountAddress = authorize.getValue()

    // TODO(keefertaylor): Use AccountAddress serialize function when https://github.com/xpring-eng/xpring-common-js/pull/419 lands.
    return accountAddress === undefined
      ? undefined
      : accountAddress.getAddress()
  },

  /**
   * Convert an InvoiceID to a JSON representation.
   *
   * @param invoiceId - The InvoiceID to convert.
   * @returns The InvoiceID as JSON.
   */
  invoiceIdToJSON(invoiceId: InvoiceID): InvoiceIdJSON {
    return Utils.toHex(invoiceId.getValue_asU8())
  },

  /**
   * Convert a CurrencyAmount to a JSON representation.
   *
   * @param currencyAmount - The CurrencyAmount to convert.
   * @returns The CurrencyAmount as JSON.
   */
  currencyAmountToJSON(
    currencyAmount: CurrencyAmount,
  ): CurrencyAmountJSON | undefined {
    switch (currencyAmount.getAmountCase()) {
      case CurrencyAmount.AmountCase.ISSUED_CURRENCY_AMOUNT: {
        const issuedCurrencyAmount = currencyAmount.getIssuedCurrencyAmount()
        if (issuedCurrencyAmount === undefined) {
          return undefined
        }
        return this.issuedCurrencyAmountToJSON(issuedCurrencyAmount)
      }
      case CurrencyAmount.AmountCase.XRP_AMOUNT: {
        const xrpAmount = currencyAmount.getXrpAmount()
        if (xrpAmount === undefined) {
          return undefined
        }
        return this.xrpAmountToJSON(xrpAmount)
      }
      case CurrencyAmount.AmountCase.AMOUNT_NOT_SET:
      default:
        return undefined
    }
  },
}

export default serializer

/**
 * Converts the transaction's account field, handling X-Addresses if needed.
 *
 * @param transaction - The transaction to scrape the account from.
 *
 * @returns A XRP address or undefined.
 */
function getNormalizedAccount(transaction: Transaction): string | undefined {
  const account = transaction.getAccount()?.getValue()?.getAddress()
  if (!account || !XrpUtils.isValidAddress(account)) {
    return undefined
  }

  if (XrpUtils.isValidClassicAddress(account)) {
    return account
  }

  // We already checked that we're a valid address, and if we were a classic address,
  // so we are definitely an X-Address here.
  const decodedClassicAddress = XrpUtils.decodeXAddress(account)
  if (!decodedClassicAddress || decodedClassicAddress.tag !== undefined) {
    // Accounts cannot have a tag.
    return undefined
  }

  return decodedClassicAddress.address
}

/**
 * Given a Transaction, get the JSON representation of data specific to that transaction type.
 *
 * @param transaction - A transaction to check for additional transaction-type specific data.
 *
 * @returns A JSON representation of the transaction-type specific data, or undefined.
 *
 * @throws An error if given a transaction that we do not know how to handle.
 */
// eslint-disable-next-line max-statements -- No clear way to make this more succinct because gRPC is verbose
function getAdditionalTransactionData(
  transaction: Transaction,
): TransactionDataJSON | undefined {
  const transactionDataCase = transaction.getTransactionDataCase()

  switch (transactionDataCase) {
    case Transaction.TransactionDataCase.ACCOUNT_SET: {
      const accountSet = transaction.getAccountSet()
      if (accountSet === undefined) {
        return undefined
      }
      return serializer.accountSetToJSON(accountSet)
    }
    case Transaction.TransactionDataCase.DEPOSIT_PREAUTH: {
      const depositPreauth = transaction.getDepositPreauth()
      if (depositPreauth === undefined) {
        return undefined
      }

      return serializer.depositPreauthToJSON(depositPreauth)
    }
    case Transaction.TransactionDataCase.PAYMENT: {
      const payment = transaction.getPayment()
      if (payment === undefined) {
        return undefined
      }

      return serializer.paymentToJSON(payment)
    }

    default:
      throw new Error('Unexpected transactionDataCase')
  }
}
