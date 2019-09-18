import Wallet from "../../src/wallet";

/**
 * A keypair to default to.
 */
const defaultKeyPair = {
  publicKey:
    "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE",
  privateKey:
    "0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4"
};

/**
 * A mnemonic to default to.
 */
const defaultMnemonic =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

/**
 * A fake wallet which always produces the given signature.
 */
class FakeWallet extends Wallet {
  /**
   * Initialize a wallet which will always produce the same signature when asked to sign a string.
   *
   * @param {String} signature The signature this wallet will produce.
   */
  constructor(private signature: string, keyPair = defaultKeyPair) {
    super(keyPair);
  }

  /**
   * Return a fake signature for any input.
   *
   * @param {String} hex The hex to sign.
   */
  sign(_hex: string): string {
    return this.signature;
  }
}

export default FakeWallet;
