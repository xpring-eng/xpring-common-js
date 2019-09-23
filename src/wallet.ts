const bip32 = require("bip32");
const bip39 = require("bip39");
const isHex = require("is-hex");
const rippleKeyPair = require("ripple-keypairs");

/**
 * The default derivation path to use with BIP44.
 */
const defaultDerivationPath = "m/44'/144'/0'/0/0";

/**
 * An object which contains artifacts from generating a new wallet.
 */
export interface WalletGenerationResult {
  /** The newly generated Wallet. */
  wallet: Wallet;

  /** The mnemonic used to generate the wallet. */
  mnemonic: string;

  /** The derivation path used to generate the wallet. */
  derivationPath: string;
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
   * Secure random number generation is used when entropy is ommitted and when the runtime environment has the necessary support. Otherwise, an error is thrown. Runtime environments that do not have secure random number generation should pass their own buffer of entropy.
   *
   * @param  {string|undefined} entropy A optional hex string of entropy.
   * @returns {Terram.WalletGenerationResult} Artifacts from the wallet generation..
   */
  public static generateRandomWallet(
    entropy: string | undefined = undefined
  ): WalletGenerationResult | undefined {
    if (entropy && !isHex(entropy)) {
      return undefined;
    }

    const mnemonic =
      entropy == undefined
        ? bip39.generateMnemonic()
        : bip39.entropyToMnemonic(entropy);
    const derivationPath = Wallet.getDefaultDerivationPath();
    const wallet = Wallet.generateWalletFromMnemonic(mnemonic, derivationPath);
    return wallet == undefined
      ? undefined
      : { wallet: wallet, mnemonic: mnemonic, derivationPath: derivationPath };
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
    const masterNode = bip32.fromSeed(seed);
    const node = masterNode.derivePath(derivationPath);
    const publicKey = Wallet.hexFromBuffer(node.publicKey);
    const privateKey = Wallet.hexFromBuffer(node.privateKey);
    return new Wallet(publicKey, "00" + privateKey);
  }

  public static generateWalletFromSeed(seed: string): Wallet {
    const keyPair = rippleKeyPair.deriveKeypair(seed);
    return new Wallet(keyPair.publicKey, keyPair.privateKey);
  }

  /**
   * Create a new Terram.Wallet object.
   *
   * @param {string} publicKey The public key for the wallet.
   * @param {string} privateKey The private key for the wallet.
   */
  public constructor(private readonly publicKey: string, private readonly privateKey: string) {}

  /**
   * @returns {String} A string representing the public key for the wallet.
   */
  public getPublicKey(): string {
    return this.publicKey;
  }

  /**
   * @returns {String} A string representing the private key for the wallet.
   */
  public getPrivateKey(): string {
    return this.privateKey;
  }

  /**
   * @returns {String} A string representing the address of the wallet.
   */
  public getAddress(): string {
    return rippleKeyPair.deriveAddress(this.getPublicKey());
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

  private static hexFromBuffer(buffer: Buffer): string {
    return buffer.toString("hex").toUpperCase();
  }
}

export default Wallet;
