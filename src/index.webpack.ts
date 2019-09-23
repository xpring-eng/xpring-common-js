import { SignedTransaction } from "../generated/signed_transaction_pb";
import Signer from "../src/signer";
import { Transaction } from "../generated/transaction_pb";
import Wallet from "./wallet";
import Utils from "./utils";

function fromHexToString() {
  return new
}
const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');


/**
 * Terram provides a JavaScript foundation for the Xpring Platform.
 */
class Terram {
  public static readonly SignedTransaction = SignedTransaction;
  public static readonly Signer = Signer;
  public static readonly Transaction = Transaction;
  public static readonly Utils = Utils;
  public static readonly Wallet = Wallet;
}

export default Terram;
