import { SignedTransaction } from "../build/generated/signed_transaction_pb";
import Signer from "../src/signer";
import { Transaction } from "../build/generated/transaction_pb";
import Wallet from "./wallet";
import Utils from "./utils";

/**
 * Common classes.
 */
class XpringCommon {
  public static readonly SignedTransaction = SignedTransaction;
  public static readonly Signer = Signer;
  public static readonly Transaction = Transaction;
  public static readonly Utils = Utils;
  public static readonly Wallet = Wallet;
}

export default XpringCommon;
