import Utils from '../Common/utils'

import Wallet from './wallet'
import XrpUtils from './xrp-utils'
import XrplNetwork from './xrpl-network'

/**
 * Encapsulates various methods for generating Wallets.
 */
export default class WalletFactory {
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
   * Generate a new wallet with the given keys.
   *
   * @param publicKey - A hexadencimal encoded public key.
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
