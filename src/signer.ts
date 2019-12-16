"use strict";

import Serializer from "./serializer";
import { Transaction } from "../generated/transaction_pb";
import Wallet from "./wallet";

const rippleCodec = require("ripple-binary-codec");

/**
 * Abstracts the details of signing.
 */
class Signer {
  /**
   * Encode the given object to hex and sign it.
   *
   * @param {Transaction} transaction The transaction to sign.
   * @param {Wallet} wallet The wallet to sign the transaction with.
   * @returns {SignedTransaction} A signed transaction.
   */
  public static signTransaction(
    transaction: Transaction,
    wallet: Wallet
  ): string | undefined {
    if (transaction === undefined || wallet === undefined) {
      return undefined;
    }

    var transactionJSON = Serializer.transactionToJSON(transaction);
    if (transactionJSON === undefined) {
      return undefined;
    }
    const transactionHex = rippleCodec.encodeForSigning(transactionJSON);

    const signatureHex = wallet.sign(transactionHex);
    return signatureHex;
  }
}

export default Signer;
