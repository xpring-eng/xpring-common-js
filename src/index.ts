const Signer = require("../src/signer");
const Wallet = require("./wallet");
const Utils = require("./utils");

/**
 * Terram provides a javascript foundation for the Xpring Platform.
 */
class Terram {
  static Signer = Signer;
  static Wallet = Wallet;
  static Utils = Utils;
}

export default Terram;