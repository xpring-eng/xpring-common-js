const bip32 = require("ripple-bip32");
const bip39 = require("bip39");
const isHex = require("is-hex");
const rippleKeyPair = require("ripple-keypairs");

/**
 * The default derivation path to use with BIP44.
 */
const defaultDerivationPath = "m/44'/144'/0'/0/0";

/**
 * A wallet object that has an address and keypair.
 */
class Wallet {
  /**
   * @returns {String} The default derivation path.
   */
  static getDefaultDerivationPath() {
    return defaultDerivationPath;
  }

  /**
   * Generate a new wallet hierarchical deterministic wallet with a random mnemonic and
   * default derivation path.
   *
   * @returns {Terram.Wallet} The result of generating a new wallet.
   */
  static generateRandomWallet() {
    const mnemonic = bip39.generateMnemonic();
    const derivationPath = Wallet.getDefaultDerivationPath();
    return Wallet.generateWalletFromMnemonic(mnemonic, derivationPath);
  }

  /**
   * Generate a new hierarchical deterministic wallet from a mnemonic and derivation path.
   *
   * @param {String} mnemonic The mnemonic for the wallet.
   * @param {String} derivationPath The derivation path to use. If undefined, the default path is used.
   * @returns {Terram.Wallet|undefined} A new wallet from the given mnemonic if the mnemonic was valid, otherwise undefined.
   */
  static generateWalletFromMnemonic(mnemonic, derivationPath) {
    // Use default derivation path if derivation path is unspecified.
    if (derivationPath == undefined) {
      derivationPath = Wallet.getDefaultDerivationPath();
    }

    // Validate mnemonic and path are valid.
    if (!bip39.validateMnemonic(mnemonic)) {
      return undefined;
    }

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const masterNode = bip32.fromSeedBuffer(seed);
    const keyPair = masterNode.derivePath(derivationPath).keyPair.getKeyPairs();
    return new Wallet(keyPair, mnemonic, derivationPath);
  }

  /**
   * Create a new Terram.Wallet object.
   *
   * @param {Terram.KeyPair} keyPair A keypair for the wallet.
   * @param {String} mnemonic The mnemonic associated with the generated wallet.
   * @param {String} derivationPath The derivation path associated with the generated wallet.      *
   */
  constructor(keyPair, mnemonic, derivationPath) {
    this.keyPair = keyPair;
    this.mnemonic = mnemonic;
    this.derivationPath = derivationPath;
  }

  /**
   * @returns {String} A string representing the public key for the wallet.
   */
  getPublicKey() {
    return this.keyPair.publicKey;
  }

  /**
   * @returns {String} A string representing the private key for the wallet.
   */
  getPrivateKey() {
    return this.keyPair.privateKey;
  }

  /**
   * @returns {String} A string representing the address of the wallet.
   */
  getAddress() {
    return rippleKeyPair.deriveAddress(this.getPublicKey());
  }

  /**
   * @returns {String} The mnemonic associated with the generated wallet.
   */
  getMnemonic() {
    return this.mnemonic;
  }

  /**
   * @returns {String} The derivation path associated with the generated wallet.
   */
  getDerivationPath() {
    return this.derivationPath;
  }

  /**
   * Sign an arbitrary hex string.
   *
   * @param {String} hex An arbitrary hex string to sign.
   * @returns {String} A signature in hexadecimal format if the input was valid, otherwise undefined.
   */
  sign(hex) {
    if (!isHex(hex)) {
      return undefined;
    }
    return rippleKeyPair.sign(hex, this.getPrivateKey());
  }

  /**
   * Verify a signature is valid for a message.
   *
   * @param {String} message A message in hex format.
   * @param {String} signature A signature in hex format.
   * @returns {Boolean} True if the signature is valid, otherwise false.
   */
  verify(message, signature) {
    if (!isHex(signature) || !isHex(message)) {
      return false;
    }

    try {
      return rippleKeyPair.verify(message, signature, this.getPublicKey());
    } catch (error) {
      // The ripple-key-pair module may throw errors for some signatures rather than returning false.
      // If an error was thrown then the signature is definitely not valid.
      return false;
    }
  }
}

module.exports = Wallet;
