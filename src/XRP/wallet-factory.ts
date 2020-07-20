import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as rippleKeyPair from 'ripple-keypairs'

import Utils from '../Common/utils'

import HdWalletGenerationResult from './hd-wallet-generation-result'
import SeedWalletGenerationResult from './seed-wallet-generation-result'
import Wallet from './wallet'
import XrpUtils from './xrp-utils'
import XrplNetwork from './xrpl-network'

/**
 * Encapsulates various methods for generating Wallets.
 */
export default class WalletFactory {
  /**
   * The default derivation path to use with BIP44.
   */
  public static defaultDerivationPath = "m/44'/144'/0'/0/0"

  /** The network the WalletFactory is attached to. */
  public readonly network: XrplNetwork

  private readonly isTest

  /**
   * Initialize a new WalletFactory.
   *
   * @param network - The network the wallet factory is attached to.
   */
  public constructor(network: XrplNetwork) {
    this.network = network
    this.isTest = XrpUtils.isTestNetwork(network)
  }

  /**
   * Generate a new HD wallet with a random mnemonic and the default XRP derivation path.
   *
   * Secure random number generation is used when entropy is omitted and when the runtime environment has the necessary support.
   * Otherwise, an error is thrown.
   *
   * Runtime environments that do not have secure random number generation should pass their own buffer of entropy.
   *
   * @param entropy - A optional hex string of entropy.
   * @returns A result which contains the newly generated wallet and associated artifacts.
   */
  public async generateRandomHdWallet(
    entropy: string | undefined = undefined,
  ): Promise<HdWalletGenerationResult | undefined> {
    if (entropy && !Utils.isHex(entropy)) {
      return undefined
    }

    const mnemonic =
      entropy === undefined
        ? bip39.generateMnemonic()
        : bip39.entropyToMnemonic(entropy)
    const derivationPath = WalletFactory.defaultDerivationPath
    const wallet = await this.walletFromMnemonicAndDerivationPath(
      mnemonic,
      derivationPath,
    )
    return wallet === undefined
      ? undefined
      : new HdWalletGenerationResult(mnemonic, derivationPath, wallet)
  }

  /**
   * Generate a new wallet with a random seed.
   *
   * Secure random number generation is used when entropy is omitted and when the runtime environment has the necessary support.
   * Otherwise, an error is thrown.
   *
   * Runtime environments that do not have secure random number generation should pass their own buffer of entropy.
   *
   * @param entropy - A optional hex string of entropy.
   * @returns A result which contains the newly generated wallet and associated artifacts.
   */
  public async generateRandomWallet(
    entropy: string | undefined = undefined,
  ): Promise<SeedWalletGenerationResult | undefined> {
    if (entropy && !Utils.isHex(entropy)) {
      return undefined
    }

    const generationParameters =
      entropy === undefined ? {} : { entropy: Utils.toBytes(entropy) }
    const seed = rippleKeyPair.generateSeed(generationParameters)
    const wallet = this.walletFromSeed(seed)

    return wallet === undefined
      ? undefined
      : new SeedWalletGenerationResult(seed, wallet)
  }

  /**
   * Generate a new hierarchical deterministic wallet from a mnemonic and derivation path.
   *
   * @param mnemonic - The mnemonic to generate the wallet.
   * @param derivationPath - The given derivation path to use. If undefined, the default path is used.
   * @returns A new wallet from the given mnemonic if the mnemonic was valid, otherwise undefined.
   */
  public async walletFromMnemonicAndDerivationPath(
    mnemonic: string,
    derivationPath = WalletFactory.defaultDerivationPath,
  ): Promise<Wallet | undefined> {
    // Validate mnemonic and path are valid.
    if (!bip39.validateMnemonic(mnemonic)) {
      return undefined
    }

    const seed = await bip39.mnemonicToSeed(mnemonic)
    return Wallet.generateHDWalletFromSeed(seed, derivationPath, this.isTest)
  }

  /**
   * Generate a new hierarchical deterministic wallet from a seed and derivation path.
   *
   * @param seed - A hex encoded seed string.
   * @param derivationPath - The given derivation path to use. If undefined, the default path is used.
   * @returns A new wallet from the given seed if the seed was valid, otherwise undefined.
   */
  // eslint-disable-next-line max-statements -- This does not read as too complex a function.
  public walletFromSeedAndDerivationPath(
    seed: string,
    derivationPath = WalletFactory.defaultDerivationPath,
  ): Wallet | undefined {
    try {
      const seedBytes = Utils.toBytes(seed)
      const seedBuffer = Buffer.from(seedBytes)
      const masterNode = bip32.fromSeed(seedBuffer)
      const node = masterNode.derivePath(derivationPath)
      if (node.privateKey === undefined) {
        return undefined
      }

      const publicKey = Utils.hexFromBuffer(node.publicKey)
      const privateKey = Utils.hexFromBuffer(node.privateKey)

      // Add a 1 byte prefix to indicate that this is a secp256k1 key.
      // See: https://xrpl.org/cryptographic-keys.html#ed25519-key-derivation.
      const prefixedPrivateKey = `00${privateKey}`

      return new Wallet(publicKey, prefixedPrivateKey, this.isTest)
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  /**
   * Generate a new wallet from the given seed.
   *
   * @param seed - A base58check encoded seed string.
   * @returns A new wallet from the given seed, or undefined if the seed was invalid.
   */
  public walletFromSeed(seed: string): Wallet | undefined {
    try {
      const keyPair = rippleKeyPair.deriveKeypair(seed)
      return new Wallet(keyPair.publicKey, keyPair.privateKey, this.isTest)
    } catch {
      return undefined
    }
  }

  /**
   * Generate a new wallet with the given keys.
   *
   * @param publicKey - A hexadecimal encoded public key.
   * @param privateKey -  A hexadecimal encoded private key.
   *
   * @returns A new wallet with a given public and private key,
   *          on TESTNET or MAINNET depending on the WalletFactory instance.
   */
  public walletFromKeys(
    publicKey: string,
    privateKey: string,
  ): Wallet | undefined {
    if (!Utils.isHex(publicKey) || !Utils.isHex(privateKey)) {
      return undefined
    }
    return new Wallet(publicKey, privateKey, this.isTest)
  }
}
