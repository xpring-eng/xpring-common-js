import { SignedTransaction } from "../generated/signed_transaction_pb";
import Signer from "../src/signer";
import { Transaction } from "../generated/transaction_pb";
import Wallet from "./wallet";
import Utils from "./utils";

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
