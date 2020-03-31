import { XRPDropsAmount } from './generated/org/xrpl/rpc/v1/amount_pb'
import {
  Payment,
  Transaction,
} from './generated/org/xrpl/rpc/v1/transaction_pb'
import Utils from '../Common/utils'

interface PaymentJSON {
  Amount: object | string
  Destination: string
  DestinationTag?: number
  TransactionType: string
}

interface BaseTransactionJSON {
  Account: string
  Fee: string
  LastLedgerSequence: number
  Sequence: number
  SigningPubKey: string
  TxnSignature?: string
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
class Serializer {
  /**
   * Convert a Transaction to a JSON representation.
   *
   * @param {proto.Transaction} transaction A Transaction to convert.
   * @param signature An optional hex encoded signature to include in the transaction.
   * @returns {Object} The Transaction as JSON.
   */
  public static transactionToJSON(
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

    // Convert account field, handling X-Addresses if needed.
    const accountAddress = transaction.getAccount()
    if (!accountAddress) {
      return
    }
    const account = accountAddress.getValue()?.getAddress()
    if (!account || !Utils.isValidAddress(account)) {
      return
    }

    let normalizedAccount = account
    if (Utils.isValidXAddress(account)) {
      const decodedClassicAddress = Utils.decodeXAddress(account)
      if (!decodedClassicAddress) {
        return
      }

      // Accounts cannot have a tag.
      if (decodedClassicAddress.tag !== undefined) {
        return
      }

      normalizedAccount = decodedClassicAddress.address
    }
    object.Account = normalizedAccount

    // Convert XRP denominated fee field.
    const txFee = transaction.getFee()
    if (txFee === undefined) {
      return
    }
    object.Fee = this.xrpAmountToJSON(txFee)

    // Convert additional transaction data.
    const transactionDataCase = transaction.getTransactionDataCase()
    switch (transactionDataCase) {
      case Transaction.TransactionDataCase.PAYMENT: {
        const payment = transaction.getPayment()
        if (payment === undefined) {
          return
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

    return object
  }

  /**
   * Convert a Payment to a JSON representation.
   *
   * @param {proto.Payment} payment The Payment to convert.
   * @returns {Object} The Payment as JSON.
   */
  private static paymentToJSON(payment: Payment): object | undefined {
    const json: PaymentJSON = {
      Amount: {},
      Destination: '',
      TransactionType: 'Payment',
    }

    // If an x-address was able to be decoded, add the components to the json.
    const destinationAddress = payment.getDestination()
    if (!destinationAddress) {
      return
    }

    const destination = destinationAddress.getValue()?.getAddress()
    if (!destination) {
      return
    }

    const decodedXAddress = Utils.decodeXAddress(destination)
    if (!decodedXAddress) {
      json.Destination = destination
      delete json.DestinationTag
    } else {
      json.Destination = decodedXAddress.address
      if (decodedXAddress.tag !== undefined) {
        json.DestinationTag = decodedXAddress.tag
      }
    }

    const amount = payment.getAmount()
    if (!amount) {
      return
    }
    const xrpAmount = amount.getValue()?.getXrpAmount()
    if (!xrpAmount) {
      return
    }
    json.Amount = this.xrpAmountToJSON(xrpAmount)
    return json
  }

  /**
   * Convert an XRPDropsAmount to a JSON representation.
   *
   * @param xrpDropsAmount The XRPAmount to convert.
   * @returns The XRPAmount as JSON.
   */
  private static xrpAmountToJSON(xrpDropsAmount: XRPDropsAmount): string {
    return `${xrpDropsAmount.getDrops()}`
  }
}

export default Serializer
