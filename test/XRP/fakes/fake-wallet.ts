import Wallet from '../../../src/XRP/wallet'

/**
 * A public key to default to.
 */
const defaultPublicKey =
  '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE'

/**
 * A private key to default to.
 */
const defaultPrivateKey =
  '0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4'

/**
 * A fake wallet which always produces the given signature.
 */
class FakeWallet extends Wallet {
  private readonly signature: string

  /**
   * Initialize a wallet which will always produce the same signature when asked to sign a string.
   *
   * @param signature - The signature this wallet will produce.
   * @param publicKey - The public key associated with this wallet / account.
   * @param privateKey - The private key associated with this wallet / account.
   */
  public constructor(
    signature: string,
    publicKey = defaultPublicKey,
    privateKey = defaultPrivateKey,
  ) {
    super(publicKey, privateKey)

    this.signature = signature
  }

  /**
   * Return an identical fake signature for any input.
   *
   * @param _hex - The hex to sign. (Unused - used only to maintain call signature).
   *
   * @returns A fake signature.
   */
  public sign(_hex: string): string {
    return this.signature
  }
}

export default FakeWallet
