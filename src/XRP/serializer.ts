/* eslint-disable  max-lines --
 * gRPC is verbose. Playing code golf with this file would decrease clarity for little readability gain.
 */
import Utils from '../Common/utils'

import { AccountAddress } from './generated/org/xrpl/rpc/v1/account_pb'
import {
  XRPDropsAmount,
  Currency,
  IssuedCurrencyAmount,
  CurrencyAmount,
} from './generated/org/xrpl/rpc/v1/amount_pb'
import {
  Authorize,
  CheckID,
  ClearFlag,
  DestinationTag,
  Domain,
  EmailHash,
  InvoiceID,
  LastLedgerSequence,
  MessageKey,
  SetFlag,
  Sequence,
  TransferRate,
  TickSize,
  Amount,
  MemoData,
  MemoFormat,
  MemoType,
  Unauthorize,
  Destination,
  DeliverMin,
  SendMax,
  TransactionSignature,
  SigningPublicKey,
  Expiration,
  Account,
  TakerGets,
  OfferSequence,
  Owner,
} from './generated/org/xrpl/rpc/v1/common_pb'
import {
  AccountSet,
  Memo,
  Payment,
  Transaction,
  DepositPreauth,
  CheckCancel,
  EscrowCancel,
} from './generated/org/xrpl/rpc/v1/transaction_pb'
import XrpUtils from './xrp-utils'

/**
 * Common fields on a transaction.
 */
interface BaseTransactionJSON {
  Account: string
  Fee: XRPDropsAmountJSON
  LastLedgerSequence: LastLedgerSequenceJSON
  Sequence: number
  SigningPubKey: string
  TxnSignature?: string
  Memos?: MemoJSON[]
}

/**
 * Transaction Specific Fields.
 */
export interface AccountSetJSON {
  ClearFlag?: ClearFlagJSON
  Domain?: DomainJSON
  EmailHash?: EmailHashJSON
  MessageKey?: MessageKeyJSON
  SetFlag?: SetFlagJSON
  TransferRate?: TransferRateJSON
  TickSize?: TickSizeJSON
  TransactionType: 'AccountSet'
}

export interface DepositPreauthJSON {
  Authorize?: AuthorizeJSON
  Unauthorize?: UnauthorizeJSON
  TransactionType: 'DepositPreauth'
}

export interface EscrowCancelJSON {
  OfferSequence: OfferSequenceJSON
  Owner: OwnerJSON
  TransactionType: 'EscrowCancel'
}

export interface PaymentJSON {
  Amount: AmountJSON
  Destination: string
  DestinationTag?: DestinationTagJSON
  TransactionType: 'Payment'
}

interface CheckCancelJSON {
  CheckID: CheckIDJSON
}

// Generic field representing an OR of all above fields.
type TransactionDataJSON =
  | AccountSetJSON
  | CheckCancelJSON
  | DepositPreauthJSON
  | EscrowCancelJSON
  | PaymentJSON

/**
 * Individual Transaction Types.
 */
type AccountSetTransactionJSON = BaseTransactionJSON & AccountSetJSON
type CheckCancelTransactionJSON = BaseTransactionJSON & CheckCancelJSON
type DepositPreauthTransactionJSON = BaseTransactionJSON & DepositPreauthJSON
type EscrowCancelTransactionJSON = BaseTransactionJSON & EscrowCancelJSON
type PaymentTransactionJSON = BaseTransactionJSON & PaymentJSON

/**
 * All Transactions.
 */
export type TransactionJSON =
  | AccountSetTransactionJSON
  | CheckCancelTransactionJSON
  | DepositPreauthTransactionJSON
  | EscrowCancelTransactionJSON
  | PaymentTransactionJSON

/**
 * Types for serialized sub-objects.
 */
interface MemoJSON {
  Memo?: MemoDetailsJSON
}

interface MemoDetailsJSON {
  MemoData?: MemoDataJSON
  MemoType?: MemoDataJSON
  MemoFormat?: MemoDataJSON
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

type DeliverMinJSON = CurrencyAmountJSON
type DestinationJSON = AccountAddressJSON
type AccountAddressJSON = string
type CheckIDJSON = string
type SendMaxJSON = CurrencyAmountJSON
type TransactionSignatureJSON = string
type SigningPublicKeyJSON = string
type ExpirationJSON = number
type AccountJSON = string
type AmountJSON = CurrencyAmountJSON
type MemoDataJSON = string
type MemoTypeJSON = string
type MemoFormatJSON = string
type UnauthorizeJSON = string
type SequenceJSON = number
type LastLedgerSequenceJSON = number
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
type TakerGetsJSON = CurrencyAmountJSON
type OfferSequenceJSON = number
type OwnerJSON = string

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
    const object: BaseTransactionJSON = {
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
    const sequence = transaction.getSequence()
    object.Sequence = sequence !== undefined ? this.sequenceToJSON(sequence) : 0

    const lastLedgerSequence = transaction.getLastLedgerSequence()
    object.LastLedgerSequence =
      lastLedgerSequence !== undefined
        ? this.lastLedgerSequenceToJSON(lastLedgerSequence)
        : 0

    const signingPubKeyBytes = transaction
      .getSigningPublicKey()
      ?.getValue_asU8()
    if (signingPubKeyBytes) {
      object.SigningPubKey = Utils.toHex(signingPubKeyBytes)
    }

    if (signature) {
      object.TxnSignature = signature
    }

    Object.assign(object, this.memosToJSON(transaction.getMemosList()))

    const additionalTransactionData = getAdditionalTransactionData(transaction)
    if (additionalTransactionData === undefined) {
      return undefined
    }

    const transactionJSON: TransactionJSON = {
      ...object,
      ...additionalTransactionData,
    }
    return transactionJSON
  },

  /**
   * Convert a Payment to a JSON representation.
   *
   * @param payment - The Payment to convert.
   * @returns The Payment as JSON.
   */
  paymentToJSON(payment: Payment): PaymentJSON | undefined {
    // Process required fields.
    const amount = payment.getAmount()
    const destination = payment.getDestination()
    if (amount === undefined || destination === undefined) {
      return undefined
    }

    const amountJson = this.amountToJSON(amount)
    const destinationJson = this.destinationToJSON(destination)
    if (amountJson === undefined || destinationJson === undefined) {
      return undefined
    }

    const json: PaymentJSON = {
      Amount: amountJson,
      Destination: destinationJson,
      TransactionType: 'Payment',
    }

    // Process optional fields.
    // TODO(keefertaylor): Add support for additional optional fields here.
    const destinationTag = payment.getDestinationTag()
    if (destinationTag !== undefined) {
      json.DestinationTag = this.destinationTagToJSON(destinationTag)
    }

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
        const unauthorize = depositPreauth.getUnauthorize()
        if (unauthorize === undefined) {
          return undefined
        }
        const unauthorizeJSON = this.unauthorizeToJSON(unauthorize)

        json.Unauthorize = unauthorizeJSON
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
   * Convert an OfferSequence to a JSON representation.
   *
   * @param offerSequence - The OfferSequence to convert.
   * @returns The OfferSequence as JSON.
   */
  offerSequenceToJSON(offerSequence: OfferSequence): OfferSequenceJSON {
    return offerSequence.getValue()
  },

  /**
   * Convert an Owner to a JSON representation.
   *
   * @param owner - The Owner to convert.
   * @returns The Owner as JSON.
   */
  ownerToJSON(owner: Owner): OwnerJSON | undefined {
    const accountAddress = owner.getValue()
    if (accountAddress === undefined) {
      return undefined
    }

    return this.accountAddressToJSON(accountAddress)
  },

  /**
   * Convert an EscrowCancel to a JSON representation.
   *
   * @param escrowCancel - The EscrowCancel to convert.
   * @returns The EscrowCancel as JSON.
   */
  escrowCancelToJSON(escrowCancel: EscrowCancel): EscrowCancelJSON | undefined {
    const offerSequence = escrowCancel.getOfferSequence()
    const owner = escrowCancel.getOwner()
    if (offerSequence === undefined || owner === undefined) {
      return undefined
    }

    const offerSequenceJSON = this.offerSequenceToJSON(offerSequence)
    const ownerJSON = this.ownerToJSON(owner)
    if (!ownerJSON) {
      return undefined
    }

    return {
      OfferSequence: offerSequenceJSON,
      Owner: ownerJSON,
      TransactionType: 'EscrowCancel',
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
    const memoData = memo.getMemoData()
    const memoFormat = memo.getMemoFormat()
    const memoType = memo.getMemoType()

    const jsonMemo: MemoDetailsJSON = {
      MemoData: undefined,
      MemoFormat: undefined,
      MemoType: undefined,
    }

    if (memoData !== undefined) {
      jsonMemo.MemoData = this.memoDataToJSON(memoData)
    }

    if (memoFormat !== undefined) {
      jsonMemo.MemoFormat = this.memoFormatToJSON(memoFormat)
    }

    if (memoType !== undefined) {
      jsonMemo.MemoType = this.memoTypeToJSON(memoType)
    }

    return {
      Memo: jsonMemo,
    }
  },

  /**
   * Convert a MemoData to a JSON representation.
   *
   * @param memoData - The MemoData to convert.
   * @returns The MemoData as JSON.
   */
  memoDataToJSON(memoData: MemoData): MemoDataJSON {
    return Utils.toHex(memoData.getValue_asU8())
  },

  /**
   * Convert a MemoFormat to a JSON representation.
   *
   * @param memoFormat - The MemoFormat to convert.
   * @returns The MemoFormat as JSON.
   */
  memoFormatToJSON(memoFormat: MemoFormat): MemoFormatJSON {
    return Utils.toHex(memoFormat.getValue_asU8())
  },

  /**
   * Convert a MemoType to a JSON representation.
   *
   * @param memoType - The MemoType to convert.
   * @returns The MemoType as JSON.
   */
  memoTypeToJSON(memoType: MemoType): MemoTypeJSON {
    return Utils.toHex(memoType.getValue_asU8())
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

    const issuer = issuedCurrencyAmount.getIssuer()
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
      issuer: this.accountAddressToJSON(issuer),
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
   * Convert an Account Address to a JSON representation.
   *
   * @param accountAddress - The AccountAddress to convert.
   * @returns The AccountAddress as JSON.
   */
  accountAddressToJSON(accountAddress: AccountAddress): AccountAddressJSON {
    return accountAddress.getAddress()
  },

  /**
   * Convert an Unauthorize to a JSON representation.
   *
   * @param unauthorize - The Unauthorize to convert.
   * @returns The Unauthorize as JSON.
   */
  unauthorizeToJSON(unauthorize: Unauthorize): UnauthorizeJSON | undefined {
    const accountAddress = unauthorize.getValue()
    if (accountAddress === undefined) {
      return undefined
    }

    return this.accountAddressToJSON(accountAddress)
  },

  /**
   * Convert a Sequence to a JSON representation.
   *
   * @param sequence - The Sequence to convert.
   * @returns The Sequence as JSON.
   */
  sequenceToJSON(sequence: Sequence): SequenceJSON {
    return sequence.getValue()
  },

  /**
   * Convert a LastLedgerSequence to a JSON representation.
   *
   * @param lastLedgerSequence - The LastLedgerSequence to convert.
   * @returns The LastLedgerSequence as JSON.
   */
  lastLedgerSequenceToJSON(
    lastLedgerSequence: LastLedgerSequence,
  ): LastLedgerSequenceJSON {
    return lastLedgerSequence.getValue()
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
    if (accountAddress === undefined) {
      return undefined
    }

    return this.accountAddressToJSON(accountAddress)
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
   * Convert an Amount to a JSON representation.
   *
   * @param amount - The Amount to convert.
   * @returns The Amount as JSON.
   */
  amountToJSON(amount: Amount): AmountJSON | undefined {
    const currencyAmount = amount.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }

    return this.currencyAmountToJSON(currencyAmount)
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

  /**
   * Convert a Destination to a JSON representation.
   *
   * @param destination - The Destination to convert.
   * @returns The Destination as JSON.
   */
  destinationToJSON(destination: Destination): DestinationJSON | undefined {
    const accountAddress = destination.getValue()
    if (accountAddress === undefined) {
      return undefined
    }
    return this.accountAddressToJSON(accountAddress)
  },

  /**
   * Convert a DeliverMin to a JSON respresentation.
   *
   * @param deliverMin - The DeliverMin to convert.
   * @returns The DeliverMin as JSON.
   */
  deliverMinToJSON(deliverMin: DeliverMin): DeliverMinJSON | undefined {
    const currencyAmount = deliverMin.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }
    return this.currencyAmountToJSON(currencyAmount)
  },

  /**
   * Convert a CheckID to a JSON representation.
   *
   * @param checkId - The CheckID to convert.
   * @returns The CheckID as JSON.
   */
  checkIDToJSON(checkId: CheckID): CheckIDJSON {
    return Utils.toHex(checkId.getValue_asU8())
  },

  /**
   * Convert a CheckCancel to a JSON representation.
   *
   * @param checkCancel - The CheckCancel to convert.
   * @returns The CheckCancel as JSON.
   */
  checkCancelToJSON(checkCancel: CheckCancel): CheckCancelJSON | undefined {
    const checkId = checkCancel.getCheckId()
    if (checkId === undefined) {
      return undefined
    }

    return {
      CheckID: this.checkIDToJSON(checkId),
    }
  },

  /**
   * Convert a SendMax to a JSON respresentation.
   *
   * @param sendMax - The SendMax to convert.
   * @returns The SendMax as JSON.
   */
  sendMaxToJSON(sendMax: SendMax): SendMaxJSON | undefined {
    const currencyAmount = sendMax.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }
    return this.currencyAmountToJSON(currencyAmount)
  },

  /**
   * Convert an TransactionSignature to a JSON representation.
   *
   * @param transactionSignature - The TransactionSignature to convert.
   * @returns The TransactionSignature as JSON.
   */
  transactionSignatureToJSON(
    transactionSignature: TransactionSignature,
  ): TransactionSignatureJSON {
    return Utils.toHex(transactionSignature.getValue_asU8())
  },

  /**
   * Convert a SigningPublicKey to a JSON representation.
   *
   * @param signingPublicKey - The SigningPublicKey to convert.
   * @returns The SigningPublicKey as JSON.
   */
  signingPublicKeyToJSON(
    signingPublicKey: SigningPublicKey,
  ): SigningPublicKeyJSON {
    return Utils.toHex(signingPublicKey.getValue_asU8())
  },

  /**
   * Convert an Expiration to a JSON representation.
   *
   * @param expiration - The Expiration to convert.
   * @returns The Expiration as JSON.
   */
  expirationToJSON(expiration: Expiration): ExpirationJSON {
    return expiration.getValue()
  },

  /**
   * Convert a TakerGets to a JSON representation.
   *
   * @param takerGets - The TakerGets to convert.
   * @returns The TakerGets as JSON.
   */
  takerGetsToJSON(takerGets: TakerGets): TakerGetsJSON | undefined {
    const currencyAmount = takerGets.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }

    return this.currencyAmountToJSON(currencyAmount)
  },

  /**
   * Convert an Account to a JSON representation.
   *
   * @param account - The Account to convert.
   * @returns The Account as JSON.
   */
  accountToJSON(account: Account): AccountJSON | undefined {
    const accountAddress = account.getValue()
    if (accountAddress === undefined) {
      return undefined
    }

    return this.accountAddressToJSON(accountAddress)
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
