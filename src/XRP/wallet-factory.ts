import * as bip32 from 'bip32'
import * as rippleKeyPair from 'ripple-keypairs'

import Utils from '../Common/utils'

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
   * Generate a new hierarchical deterministic wallet from a seed and derivation path.
   *
   * @param seed - A hex encoded seed string.
   * @param derivationPath - The given derivation path to use. If undefined, the default path is used.
   * @returns A new wallet from the given mnemonic if the mnemonic was valid, otherwise undefined.
   */
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
   * @param seed - A hex encoded seed string.
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
