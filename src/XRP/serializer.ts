import Utils from '../Common/utils'

import {
  CurrencyAmount,
  XRPDropsAmount,
  IssuedCurrencyAmount,
} from './generated/org/xrpl/rpc/v1/amount_pb'
import {
  Memo,
  Payment,
  Transaction,
  DepositPreauth,
} from './generated/org/xrpl/rpc/v1/transaction_pb'

type TransactionDataJSON = PaymentJSON | DepositPreauthJSON

type CurrencyAmountJSON = XRPAmountJSON | IssuedCurrencyAmountJSON

type XRPAmountJSON = string

interface IssuedCurrencyAmountJSON {
  value: string
  currency: string
  issuer: string
}

interface PaymentJSON {
  Amount: CurrencyAmountJSON
  Destination: string
  DestinationTag?: number
  InvoiceID?: string
  TransactionType: string
  SendMax?: CurrencyAmountJSON
  DeliverMin?: CurrencyAmountJSON
  Paths?: Array<Array<PathJSON>>
}

interface PathJSON {
  account?: string
  issuer?: string
  currencyCode?: string
}

interface DepositPreauthJSON {
  Authorize?: string
  Unauthorize?: string
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

interface PaymentTransactionJSONAddition extends PaymentJSON {
  TransactionType: 'Payment'
}

type PaymentTransactionJSON = BaseTransactionJSON &
  PaymentTransactionJSONAddition

export type TransactionJSON = BaseTransactionJSON | PaymentTransactionJSON

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
   * Convert a {@link CurrencyAmount} to a JSON representation.
   *
   * @param currencyAmount - The {@link CurrencyAmount} to convert.
   * @returns A JSON representation of the input.
   */
  currencyAmountToJSON(
    currencyAmount: CurrencyAmount,
  ): CurrencyAmountJSON | undefined {
    switch (currencyAmount.getAmountCase()) {
      case CurrencyAmount.AmountCase.XRP_AMOUNT: {
        const xrpAmount = currencyAmount.getXrpAmount()
        if (!xrpAmount) {
          return undefined
        }

        return this.xrpAmountToJSON(xrpAmount)
      }
      case CurrencyAmount.AmountCase.ISSUED_CURRENCY_AMOUNT: {
        const issuedCurrencyAmount = currencyAmount.getIssuedCurrencyAmount()
        if (!issuedCurrencyAmount) {
          return undefined
        }

        return this.issuedCurrencyAmountToJSON(issuedCurrencyAmount)
      }

      case CurrencyAmount.AmountCase.AMOUNT_NOT_SET: {
        return undefined
      }

      default: {
        return undefined
      }
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
    const issuer = issuedCurrencyAmount.getIssuer()?.getAddress()
    if (currencyWrapper === undefined || value === '' || issuer === undefined) {
      return undefined
    }

    const currency =
      currencyWrapper.getName() === ''
        ? currencyWrapper.getName()
        : Utils.toHex(currencyWrapper.getCode_asU8())

    return {
      currency,
      value,
      issuer,
    }
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

    const decodedXAddress = Utils.decodeXAddress(destination)
    json.Destination = decodedXAddress?.address ?? destination
    if (decodedXAddress?.tag !== undefined) {
      json.DestinationTag = decodedXAddress.tag
    }

    const invoice = payment.getInvoiceId()?.getValue_asU8()
    if (invoice) {
      json.InvoiceID = Utils.toHex(invoice)
    }

    const currencyAmount = payment.getAmount()?.getValue()
    if (currencyAmount) {
      const amount = this.currencyAmountToJSON(currencyAmount)

      if (amount === undefined) {
        return undefined
      }

      json.Amount = amount
    }

    const deliverMinCurrencyAmount = payment.getDeliverMin()?.getValue()
    if (deliverMinCurrencyAmount) {
      const deliverMin = this.currencyAmountToJSON(deliverMinCurrencyAmount)
      if (deliverMin === undefined) {
        return undefined
      }

      json.DeliverMin = deliverMin
    }

    const sendMaxCurrencyAmount = payment.getSendMax()?.getValue()
    if (sendMaxCurrencyAmount) {
      const sendMax = this.currencyAmountToJSON(sendMaxCurrencyAmount)
      if (sendMax === undefined) {
        return undefined
      }

      json.SendMax = sendMax
    }

    const paths = payment.getPathsList()
    if (paths.length > 0) {
      json.Paths = paths.map((path) => { return this.pathToJSON(path) })
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
    const type = depositPreauth.getAuthorizationOneofCase()
    switch (type) {
      case DepositPreauth.AuthorizationOneofCase.AUTHORIZE: {
        const authorize = depositPreauth
          .getAuthorize()
          ?.getValue()
          ?.getAddress()

        return {
          Authorize: authorize,
        }
      }
      case DepositPreauth.AuthorizationOneofCase.UNAUTHORIZE: {
        const unauthorize = depositPreauth
          .getUnauthorize()
          ?.getValue()
          ?.getAddress()

        return {
          Unauthorize: unauthorize,
        }
      }
      case DepositPreauth.AuthorizationOneofCase.AUTHORIZATION_ONEOF_NOT_SET: {
        return undefined
      }
      default: {
        return undefined
      }
    }
  },

  pathToJSON(path: Payment.Path): Array<PathJSON> {
    const elements = path.getElementsList()
    return elements.map((element) => { return this.pathElementToJSON(element) })
  },

  pathElementToJSON(path: Payment.PathElement): PathJSON {
    const json: PathJSON = {}

    const issuer = path.getIssuer()?.getAddress()
    if (issuer) {
      json.issuer = issuer
    }

    const currencyCodeBytes = path.getCurrency()?.getCode_asU8()
    if (currencyCodeBytes) {
      json.currencyCode = Utils.toHex(currencyCodeBytes)
    }

    const account = path.getAccount()?.getAddress()
    if (account) {
      json.account = account
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
  if (!account || !Utils.isValidAddress(account)) {
    return undefined
  }

  if (Utils.isValidClassicAddress(account)) {
    return account
  }

  // We already checked that we're a valid address, and if we were a classic address,
  // so we are definitely an X-Address here.
  const decodedClassicAddress = Utils.decodeXAddress(account)
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
 * @returns A JSON representation of the transaction-type specific data, or undefined.
 */
function getAdditionalTransactionData(
  transaction: Transaction,
): TransactionDataJSON | undefined {
  const transactionDataCase = transaction.getTransactionDataCase()

  switch (transactionDataCase) {
    case Transaction.TransactionDataCase.PAYMENT: {
      const payment = transaction.getPayment()
      if (payment === undefined) {
        return undefined
      }

      return serializer.paymentToJSON(payment)
    }
    case Transaction.TransactionDataCase.DEPOSIT_PREAUTH: {
      const depositPreauth = transaction.getDepositPreauth()
      if (depositPreauth === undefined) {
        return undefined
      }

      return serializer.depositPreauthToJSON(depositPreauth)
    }

    default:
      throw new Error('Unexpected transactionDataCase')
  }
}
