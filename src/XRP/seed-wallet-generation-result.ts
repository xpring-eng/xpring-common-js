import Wallet from './wallet'

/** Encapsulates artifacts from generating a random Wallet via a seed. */
export default class SeedWalletGenerationResult {
  /** The base58check encoded seed which can be used to restore the Wallet. */
  public readonly seed: string

  /** The newly generated Wallet. */
  public readonly wallet: Wallet

  /**
   * Creates a new SeedWalletGenerationResult.
   *
   * @param seed - The base58check encoded seed which generates the associated wallet.
   * @param wallet - The wallet generated from the associated seed.
   */
  public constructor(seed: string, wallet: Wallet) {
    this.seed = seed
    this.wallet = wallet
  }
}
