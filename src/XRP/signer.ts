import * as rippleCodec from 'ripple-binary-codec'

import Utils from '../Common/utils'

import { Transaction } from './generated/org/xrpl/rpc/v1/transaction_pb'
import Serializer, { TransactionJSON } from './serializer'
import Wallet from './wallet'

/**
 * Abstracts the details of signing.
 */
const signer = {
  /**
   * Encode the given raw JSON transaction to hex and sign it.
   *
   * @param transactionJSON - The raw transaction JSON object.
   * @param wallet - The wallet to sign the transaction with.
   * @returns A set of bytes representing the inputs and a signature.
   */
  signTransactionFromJSON(
    transactionJSON: TransactionJSON,
    wallet: Wallet,
  ): Uint8Array {
    const transactionHex = rippleCodec.encodeForSigning(transactionJSON)
    const signatureHex = wallet.sign(transactionHex)

    if (!signatureHex) {
      throw new Error('Unable to produce a signature.')
    }

    const signedTransactionJSON = {
      ...transactionJSON,
      TxnSignature: signatureHex,
    }
    const signedTransactionHex = rippleCodec.encode(signedTransactionJSON)
    return Utils.toBytes(signedTransactionHex)
  },

  /**
   * Encode the given object to hex and sign it.
   *
   * @param transaction - The transaction to sign.
   * @param wallet - The wallet to sign the transaction with.
   * @returns A set of bytes representing the inputs and a signature.
   */
  signTransaction(
    transaction: Transaction,
    wallet: Wallet,
  ): Uint8Array | undefined {
    const transactionJSON = Serializer.transactionToJSON(transaction)
    if (transactionJSON === undefined) {
      return undefined
    }
    return this.signTransactionFromJSON(transactionJSON, wallet)
  },
}

export default signer
