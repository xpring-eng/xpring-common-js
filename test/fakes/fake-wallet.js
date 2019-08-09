"use strict";

const Wallet = require("../../src/wallet.js");

/**
 * A fake wallet which always produces the given signature.
 */
class FakeWallet extends Wallet {
  /**
   * Initialize a wallet which will always produce the same signature when asked to sign a string.
   *
   * @param {String} signature The signature this wallet will produce.
   */
  constructor(signature) {
    const mnemonic =
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
    const derivationPath = Wallet.getDefaultDerivationPath();
    const keyPair = {
      publicKey:
        "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE",
      privateKey:
        "0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4"
    };
    super(keyPair, mnemonic, derivationPath);

    this.signature = signature;
  }

  /**
   * Return a fake signature for any input.
   *
   * @param {String} hex The hex to sign.
   */
  sign(_hex) {
    return this.signature;
  }
}

module.exports = FakeWallet;
