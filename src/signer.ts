"use strict";

import Serializer from "./serializer";
import { SignedTransaction } from "../generated/SignedTransaction_pb";
import { Transaction } from "../generated/Transaction_pb";
import Wallet from "wallet";

const rippleCodec = require("ripple-binary-codec");

/**
 * Abstracts the details of signing.
 */
class Signer {
  /**
   * Encode the given object to hex and sign it.
   *
   * @param {Terram.Transaction} transaction The transaction to sign.
   * @param {Terram.Wallet} wallet The wallet to sign the transaction with.
   * @returns {Terram.SignedTransaction} A signed transaction.
   */
  public static signTransaction(
    transaction: Transaction,
    wallet: Wallet
  ): SignedTransaction | undefined {
    if (transaction === undefined || wallet === undefined) {
      return undefined;
    }

    const transactionJSON = Serializer.transactionToJSON(transaction);
    const transactionHex = rippleCodec.encodeForSigning(transactionJSON);
    const signatureHex = wallet.sign(transactionHex);
    if (signatureHex == undefined) {
      return undefined;
    }

    const signedTransaction = new SignedTransaction();
    signedTransaction.setTransaction(transaction);
    signedTransaction.setTransactionSignatureHex(signatureHex);
    signedTransaction.setPublicKeyHex(wallet.getPublicKey());

    return signedTransaction;
  }
}

export default Signer;
