import { SignedTransaction } from "../generated/signed_transaction_pb";
import Signer from "../src/signer";
import { Transaction } from "../generated/transaction_pb";
import Wallet from "./wallet";
import Utils from "./utils";

function fromHexString(hexString: string): Uint8Array {
  var bytes = new Uint8Array(Math.ceil(hexString.length / 2));
  for (var i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return bytes;
}

function toHexString(bytes: Uint8Array): string {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

function makeTransaction(): Transaction {
  const hex = "180C";
  const bytes = fromHexString(hex);
  const transaction = Transaction.deserializeBinary(bytes);
  console.log("Called make Tx")
  console.log("HEX: " + hex);
  console.log("BYTES: " + bytes);
  console.log("TX: " + JSON.stringify(transaction.toObject()));
  console.log("SEQ: " + transaction.getSequence());

  return transaction;
}

/**
 * Terram provides a JavaScript foundation for the Xpring Platform.
 */
class Terram {
  public static readonly SignedTransaction = SignedTransaction;
  public static readonly Signer = Signer;
  public static readonly Transaction = Transaction;
  public static readonly Utils = Utils;
  public static readonly Wallet = Wallet;
  public static readonly fromHexString = fromHexString;
  public static readonly toHexString = toHexString;
  public static readonly makeTransaction = makeTransaction;
}

export default Terram;
