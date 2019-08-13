const bip32 = require("ripple-bip32");
const bip39 = require("bip39");
const isHex = require("is-hex");
const rippleKeyPair = require("ripple-keypairs");

/**
 * The default derivation path to use with BIP44.
 */
const defaultDerivationPath = "m/44'/144'/0'/0/0";

/**
 * An object which holds a pair of public and private keys
 */
export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * A wallet object that has an address and keypair.
 */
class Wallet {
  /**
   * @returns {String} The default derivation path.
   */
  public static getDefaultDerivationPath(): string {
    return defaultDerivationPath;
  }

  /**
   * Generate a new wallet hierarchical deterministic wallet with a random mnemonic and
   * default derivation path.
   *
   * @returns {Terram.Wallet} The result of generating a new wallet.
   */
  public static generateRandomWallet(): Wallet | undefined {
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
  public static generateWalletFromMnemonic(
    mnemonic: string,
    derivationPath = Wallet.getDefaultDerivationPath()
  ): Wallet | undefined {
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
   * @param {String} derivationPath The derivation path associated with the generated wallet.
   */
  public constructor(
    private readonly keyPair: KeyPair,
    private readonly mnemonic: string,
    private readonly derivationPath: string
  ) {}

  /**
   * @returns {String} A string representing the public key for the wallet.
   */
  public getPublicKey(): string {
    return this.keyPair.publicKey;
  }

  /**
   * @returns {String} A string representing the private key for the wallet.
   */
  public getPrivateKey(): string {
    return this.keyPair.privateKey;
  }

  /**
   * @returns {String} A string representing the address of the wallet.
   */
  public getAddress(): string {
    return rippleKeyPair.deriveAddress(this.getPublicKey());
  }

  /**
   * @returns {String} The mnemonic associated with the generated wallet.
   */
  public getMnemonic(): string {
    return this.mnemonic;
  }

  /**
   * @returns {String} The derivation path associated with the generated wallet.
   */
  public getDerivationPath(): string {
    return this.derivationPath;
  }

  /**
   * Sign an arbitrary hex string.
   *
   * @param {String} hex An arbitrary hex string to sign.
   * @returns {String} A signature in hexadecimal format if the input was valid, otherwise undefined.
   */
  public sign(hex: string): string | undefined {
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
  public verify(message: string, signature: string): boolean {
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

export default Wallet;
