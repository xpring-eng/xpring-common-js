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
   * Generate a new wallet with the given keys.
   *
   * @param publicKey - A hexadecimal encoded public key.
   * @param privateKey -  A hexadecimal encoded private key.
   */
  public walletFromKeys(publicKey: string, privateKey: string): Wallet | undefined {
    if (!Utils.isHex(publicKey) || !Utils.isHex(privateKey)) {
        return undefined;
    }
    return new Wallet(publicKey, privateKey, this.isTest)
  }
}
