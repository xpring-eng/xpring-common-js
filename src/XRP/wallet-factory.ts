import * as rippleKeyPair from 'ripple-keypairs'
import Wallet from './wallet'
import Utils from '../Common/utils'

/**
 * Encapsulates various methods for generating Wallets.
 */
export default class WalletFactory {
  public readonly isTest: boolean

  /**
   * Initialize a new WalletFactory.
   *
   * @param isTest - Whether the wallet factory will generate wallets for a test network.
   */
  public constructor(isTest: boolean) {
    this.isTest = isTest
  }

  /**
   * Generate a new wallet from the given seed.
   *
   * @param seed - The given seed for the wallet.
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
