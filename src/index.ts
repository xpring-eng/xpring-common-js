import Signer from "../src/signer";
import Wallet from "./wallet";
import Utils from "./utils";
import grpc from "grpc";

/**
 * Terram provides a javascript foundation for the Xpring Platform.
 */
class Terram {
  public static readonly Signer = Signer;
  public static readonly Utils = Utils;
  public static readonly Wallet = Wallet;
  public static readonly grpc = grpc;
}

export default Terram;
