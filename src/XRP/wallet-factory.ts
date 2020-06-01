import * as rippleKeyPair from 'ripple-keypairs'
import * as bip32 from 'bip32'
import Wallet from './wallet'
import Utils from '../Common/utils'

/**
 * Encapsulates various methods for generating Wallets.
 */
export default class WalletFactory {
  /**
   * Initialize a new WalletFactory.
   *
   * @param isTest Whether the wallet factory will generate wallets for a test network.
   */
  public constructor(public readonly isTest: boolean) {}

  /**
   * Generate a new hierarchical deterministic wallet from a seed and derivation path.
   *
   * @param seed - A hex encoded seed string.
   * @param derivationPath - The given derivation path to use. If undefined, the default path is used.
   * @returns A new wallet from the given mnemonic if the mnemonic was valid, otherwise undefined.
   */
  public walletFromSeedAndDerivationPath(
    seed: string,
    derivationPath = Wallet.getDefaultDerivationPath(),
  ): Wallet | undefined {
    const seedBytes = Utils.toBytes(seed)
    const seedBuffer = Buffer.from(seedBytes)
    const masterNode = bip32.fromSeed(seedBuffer)
    const node = masterNode.derivePath(derivationPath)
    if (node.privateKey === undefined) {
      return undefined
    }

    const publicKey = Utils.hexFromBuffer(node.publicKey)
    const privateKey = Utils.hexFromBuffer(node.privateKey)
    return new Wallet(publicKey, `00${privateKey}`, this.isTest)
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
