/* eslint-disable  max-lines --
 * gRPC is verbose. Playing code golf with this file would decrease clarity for little readability gain.
 */
import Utils from '../Common/utils'

import { XRPDropsAmount, Currency } from './generated/org/xrpl/rpc/v1/amount_pb'
import { MessageKey } from './generated/org/xrpl/rpc/v1/common_pb'
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
  ClearFlag?: number
  Domain?: string
  EmailHash?: string
  MessageKey?: MessageKeyJSON
  SetFlag?: number
  TransactionType: string
  TransferRate?: number
  TickSize?: number
}

interface DepositPreauthJSON {
  Authorize?: string
  TransactionType: string
  Unauthorize?: string
}

interface PaymentJSON {
  Amount: Record<string, unknown> | string
  Destination: string
  DestinationTag?: number
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
  Fee: string
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
  currencyCode?: string
}

type MessageKeyJSON = string
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
      Amount: {},
      Destination: '',
      TransactionType: 'Payment',
    }

    // If an x-address was able to be decoded, add the components to the json.
    const destination = payment.getDestination()?.getValue()?.getAddress()
    if (!destination) {
      return undefined
    }

    const decodedXAddress = XrpUtils.decodeXAddress(destination)
    json.Destination = decodedXAddress?.address ?? destination
    if (decodedXAddress?.tag !== undefined) {
      json.DestinationTag = decodedXAddress.tag
    }

    const xrpAmount = payment.getAmount()?.getValue()?.getXrpAmount()
    if (!xrpAmount) {
      return undefined
    }
    json.Amount = this.xrpAmountToJSON(xrpAmount)

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
        const authorize = depositPreauth
          .getAuthorize()
          ?.getValue()
          ?.getAddress()
        json.Authorize = authorize
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

    const clearFlag = accountSet.getClearFlag()?.getValue()
    if (clearFlag !== undefined) {
      json.ClearFlag = clearFlag
    }

    const domain = accountSet.getDomain()?.getValue()
    if (domain !== undefined) {
      json.Domain = domain
    }

    const emailHashBytes = accountSet.getEmailHash()?.getValue_asU8()
    if (emailHashBytes !== undefined) {
      json.EmailHash = Utils.toHex(emailHashBytes)
    }

    const messageKey = accountSet.getMessageKey()
    if (messageKey !== undefined) {
      json.MessageKey = this.messageKeyToJSON(messageKey)
    }

    const setFlag = accountSet.getSetFlag()?.getValue()
    if (setFlag !== undefined) {
      json.SetFlag = setFlag
    }

    const transferRate = accountSet.getTransferRate()?.getValue()
    if (transferRate !== undefined) {
      json.TransferRate = transferRate
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

    const currencyCodeBytes = pathElement.getCurrency()?.getCode_asU8()
    if (currencyCodeBytes) {
      json.currencyCode = Utils.toHex(currencyCodeBytes)
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
   * Convert a MessageKey to a JSON representation.
   *
   * @param messageKey - The MessageKey to convert.
   * @returns The MessageKey as JSON.
   */
  messageKeyToJSON(messageKey: MessageKey): MessageKeyJSON {
    const messageKeyBytes = messageKey.getValue_asU8()
    return Utils.toHex(messageKeyBytes)
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
