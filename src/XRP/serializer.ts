import Utils from '../Common/utils'

import { XRPDropsAmount } from './generated/org/xrpl/rpc/v1/amount_pb'
import { Memo, Payment, Transaction, } from './generated/org/xrpl/rpc/v1/transaction_pb'

interface PaymentJSON {
  Amount: object | string
  Destination: string
  DestinationTag?: number
  TransactionType: string
}

interface MemoJSON {
  Memo?: MemoDetailsJSON
}

interface MemoDetailsJSON {
  MemoData?: string
  MemoType?: string
  MemoFormat?: string
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
  transactionToJSON(
    transaction: Transaction,
    signature?: string,
  ): TransactionJSON | undefined {
    const object: TransactionJSON = {
      Account: '',
      Sequence: 0,
      SigningPubKey: '',
      LastLedgerSequence: 0,
      Fee: '',
    }

    const sequence = transaction.getSequence()?.getValue()
    if (sequence) {
      object.Sequence = sequence
    }

    const signingPubKeyBytes = transaction
      .getSigningPublicKey()
      ?.getValue_asU8()
    if (signingPubKeyBytes) {
      object.SigningPubKey = Utils.toHex(signingPubKeyBytes)
    }

    const lastLedgerSequence = transaction.getLastLedgerSequence()?.getValue()
    if (lastLedgerSequence) {
      object.LastLedgerSequence = lastLedgerSequence
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

    // Convert additional transaction data.
    const transactionDataCase = transaction.getTransactionDataCase()
    switch (transactionDataCase) {
      case Transaction.TransactionDataCase.PAYMENT: {
        const payment = transaction.getPayment()
        if (payment === undefined) {
          return undefined
        }
        Object.assign(object, this.paymentToJSON(payment))
        break
      }
      default:
        throw new Error('Unexpected transactionDataCase')
    }

    if (signature) {
      object.TxnSignature = signature
    }

    if (transaction.getMemosList() && transaction.getMemosList().length > 0) {
      object.Memos = transaction.getMemosList().map(this.memoToJSON)
    }

    return object
  },

  /**
   * Convert a Payment to a JSON representation.
   *
   * @param payment - The Payment to convert.
   * @returns The Payment as JSON.
   */
  paymentToJSON(payment: Payment): object | undefined {
    const json: PaymentJSON = {
      Amount: {},
      Destination: '',
      TransactionType: 'Payment',
    }

    // If an x-address was able to be decoded, add the components to the json.
    const destinationAddress = payment.getDestination()
    if (!destinationAddress) {
      return undefined
    }

    const destination = destinationAddress.getValue()?.getAddress()
    if (!destination) {
      return undefined
    }

    const decodedXAddress = Utils.decodeXAddress(destination)
    if (decodedXAddress) {
      json.Destination = decodedXAddress.address
      if (decodedXAddress.tag !== undefined) {
        json.DestinationTag = decodedXAddress.tag
      }
    } else {
      json.Destination = destination
      delete json.DestinationTag
    }

    const amount = payment.getAmount()
    if (!amount) {
      return undefined
    }
    const xrpAmount = amount.getValue()?.getXrpAmount()
    if (!xrpAmount) {
      return undefined
    }
    json.Amount = this.xrpAmountToJSON(xrpAmount)
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
   * Convert a Memo to a JSON representation.
   * @param memo - The Memo to convert.
   * @returns The Memo as JSON.
   */
  memoToJSON(memo: Memo): MemoJSON {
    const Memo: MemoDetailsJSON = {
      MemoData: memo?.getMemoData()?.getValue_asB64(),
      MemoFormat: memo?.getMemoFormat()?.getValue_asB64(),
      MemoType: memo?.getMemoType()?.getValue_asB64(),
    }

    return {
      Memo,
    }
  }
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
