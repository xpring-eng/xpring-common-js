import Wallet from './wallet'

/** Encapsulates artifacts from generating a random Wallet via a mnemonic and derivation path. */
export default class HdWalletGenerationResult {
  /** The mnemonic used to generate the wallet. */
  public readonly mnemonic: string

  /** The derivation path used to generate the wallet. */
  public readonly derivationPath: string

  /** The newly generated Wallet. */
  public readonly wallet: Wallet

  /**
   * Create a new HdWalletGenerationResult.
   *
   * @param mnemonic - The mnemonic used to generate the wallet.
   * @param derivationPath - The derivation path used to generate the wallet.
   * @param wallet - The newly generated wallet.
   */
  public constructor(mnemonic: string, derivationPath: string, wallet: Wallet) {
    this.mnemonic = mnemonic
    this.derivationPath = derivationPath
    this.wallet = wallet
  }
}
