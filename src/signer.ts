"use strict";

import Serializer from "./serializer";
import { SignedTransaction } from "../generated/signed_transaction_pb";
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

    var transactionJSON = Serializer.transactionToJSON(transaction);
    if (transactionJSON === undefined) {
      return undefined;
    }
    // const txJSON = rippleCodec.sign(transactionJSON, wallet.keyPair);
    // console.log("New TXJSON: " + JSON.stringify(txJSON));
    const FULL_CANONICAL_SIGNATURE = 0x80000000;

    // transactionJSON.Flags |= FULL_CANONICAL_SIGNATURE;
    // transactionJSON.Flags >>>= 0;
    // transactionJSON.SigningPubKey = wallet.getPublicKey();

    console.log("DEBUG:");
    console.log("TX JSON: " + JSON.stringify(transactionJSON));

    const transactionHex = rippleCodec.encodeForSigning(transactionJSON);
    console.log("TX HEX: " + transactionHex);

    const signatureHex = wallet.sign(transactionHex);
    if (signatureHex == undefined) {
      return undefined;
    }
    console.log("SIG HEX: " + signatureHex);

    const signedTransaction = new SignedTransaction();
    signedTransaction.setTransaction(transaction);
    signedTransaction.setTransactionSignatureHex(signatureHex);
    // signedTransaction.setPublicKeyHex(wallet.getPublicKey());

    return signedTransaction;
  }
}



export default Signer;
