import Signer from "../src/signer";
import Wallet from "./wallet";
import Utils from "./utils";

/**
 * Terram provides a javascript foundation for the Xpring Platform.
 */
class Terram {
  static Signer = Signer;
  static Wallet = Wallet;
  static Utils = Utils;
}

export default Terram;