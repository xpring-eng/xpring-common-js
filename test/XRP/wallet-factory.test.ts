import { assert } from 'chai'

import WalletFactory from '../../src/XRP/wallet-factory'
import 'mocha'
import XrplNetwork from '../../src/XRP/xrpl-network'

/**
 * A mapping of input and expected outputs for BIP39 and BIP44.
 *
 * @see {@link https://iancoleman.io/bip39/#english|BIP39 - Mnemonic Code Converter}.
 */
const DERIVATION_PATH_TEST_CASES = {
  index0: {
    mnemonic:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    derivationPath: "m/44'/144'/0'/0/0",
    expectedPublicKey:
      '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE',
    expectedPrivateKey:
      '0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4',
    expectedMainNetAddress: 'XVMFQQBMhdouRqhPMuawgBMN1AVFTofPAdRsXG5RkPtUPNQ',
    expectedTestNetAddress: 'TVHLFWLKvbMv1LFzd6FA2Bf9MPpcy4mRto4VFAAxLuNpvdW',
    messageHex: Buffer.from('test message', 'utf8').toString('hex'),
    expectedSignature:
      '3045022100E10177E86739A9C38B485B6AA04BF2B9AA00E79189A1132E7172B70F400ED1170220566BD64AA3F01DDE8D99DFFF0523D165E7DD2B9891ABDA1944E2F3A52CCCB83A',
  },
  index1: {
    mnemonic:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    derivationPath: "m/44'/144'/0'/0/1",
    expectedPublicKey:
      '038BF420B5271ADA2D7479358FF98A29954CF18DC25155184AEAD05796DA737E89',
    expectedPrivateKey:
      '000974B4CFE004A2E6C4364CBF3510A36A352796728D0861F6B555ED7E54A70389',
    expectedAddress: 'X7uRz9jfzHUFEjZTZ7rMVzFuTGZTHWcmkKjvGkNqVbfMhca',
  },
}

describe('Wallet Factory', function (): void {
  it('Wallet From Keys - Valid Keys', function (): void {
    // GIVEN a wallet factory and set of valid keys.
    const walletFactory = new WalletFactory(XrplNetwork.Test)
    const publicKey =
      '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE'
    const privateKey =
      '0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4'

    // WHEN a wallet is generated.
    const wallet = walletFactory.walletFromKeys(publicKey, privateKey)

    // THEN the generated wallet has the correct keys.
    assert.equal(wallet?.publicKey, publicKey)
    assert.equal(wallet?.privateKey, privateKey)
  })

  it('Wallet From Keys - Invalid Public Key', function (): void {
    // GIVEN a wallet factory and an invalid public key
    const walletFactory = new WalletFactory(XrplNetwork.Test)
    // The publicKey is not hex
    const publicKey = 'xrp'
    const privateKey =
      '0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4'

    // WHEN a wallet is generated.
    const wallet = walletFactory.walletFromKeys(publicKey, privateKey)

    // THEN the generated wallet is undefined.
    assert.isUndefined(wallet)
  })

  it('Wallet From Keys - Invalid Private Key', function (): void {
    // GIVEN a wallet factory and an invalid private key
    const walletFactory = new WalletFactory(XrplNetwork.Test)
    const publicKey =
      '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE'
    // The privateKey is not hex
    const privateKey = 'xrp'

    // WHEN a wallet is generated.
    const wallet = walletFactory.walletFromKeys(publicKey, privateKey)

    // THEN the generated wallet is undefined.
    assert.isUndefined(wallet)
  })

  // walletFromSeed

  it('walletFromSeed - MainNet', function (): void {
    // GIVEN a wallet factory attached to mainnet and a valid seed.
    const walletFactory = new WalletFactory(XrplNetwork.Main)
    const seed = 'snYP7oArxKepd3GPDcrjMsJYiJeJB'

    // WHEN a wallet is generated from the seed.
    const wallet = walletFactory.walletFromSeed(seed)

    // THEN the wallet has the expected address.
    assert.equal(
      wallet?.getAddress(),
      'XVnJMYQFqA8EAijpKh5EdjEY5JqyxykMKKSbrUX8uchF6U8',
    )
  })

  it('walletFromSeed - invalid seed', function (): void {
    // GIVEN a wallet factory and an valid seed.
    const walletFactory = new WalletFactory(XrplNetwork.Test)
    const seed = 'xrp'

    // WHEN a wallet is generated from the seed.
    const wallet = walletFactory.walletFromSeed(seed)

    // THEN the wallet is undefined.
    assert.isUndefined(wallet)
  })

  it('walletFromSeedAndDerivationPath - valid inputs - derivation path 0', function (): void {
    // GIVEN a wallet factory, a valid seed and a valid derivation path.
    const walletFactory = new WalletFactory(XrplNetwork.Main)
    const seedHex =
      'f5dd847bd41be2deeb5f3596ab614a95e3cebb73dcd4270df9681de9e3ee5fe34ef07beb05fea610bf2cfdffb6dc3f1593fd966ab5afd30e803af66b68df32d4'
    const derivationPath = "m/44'/144'/0'/0/0"

    // WHEN a wallet is generated from the seed and derivation path.
    const wallet = walletFactory.walletFromSeedAndDerivationPath(
      seedHex,
      derivationPath,
    )

    // THEN the wallet has the expected address.
    assert.equal(
      wallet?.getAddress(),
      'XVCv9bkjjkAKrT4Xp2WtMEsrr3LP7cHUQEbQLibKk8y1n3i',
    )
  })

  it('walletFromSeedAndDerivationPath - valid inputs - derivation path 1', function (): void {
    // GIVEN a wallet factory, a valid seed and a valid derivation path.
    const walletFactory = new WalletFactory(XrplNetwork.Main)
    const seedHex =
      'f5dd847bd41be2deeb5f3596ab614a95e3cebb73dcd4270df9681de9e3ee5fe34ef07beb05fea610bf2cfdffb6dc3f1593fd966ab5afd30e803af66b68df32d4'
    const derivationPath = "m/44'/144'/0'/0/1"

    // WHEN a wallet is generated from the seed and derivation path.
    const wallet = walletFactory.walletFromSeedAndDerivationPath(
      seedHex,
      derivationPath,
    )

    // THEN the wallet has the expected address.
    assert.equal(
      wallet?.getAddress(),
      'X7Fi1EkV5VgFUbzwDdoNX8yPeYHhTWvFWaZKjULJcJpTQKo',
    )
  })

  it('walletFromSeedAndDerivationPath - invalid derivation path', function (): void {
    // GIVEN a wallet factory and an invalid derivation path.
    const walletFactory = new WalletFactory(XrplNetwork.Test)
    const seed = 'snYP7oArxKepd3GPDcrjMsJYiJeJB'
    const derivationPath = 'xrp'

    // WHEN a wallet is generated from the seed and derivation path.
    const wallet = walletFactory.walletFromSeedAndDerivationPath(
      seed,
      derivationPath,
    )

    // THEN the wallet is undefined.
    assert.isUndefined(wallet)
  })

  it('walletFromSeedAndDerivationPath - invalid seed', function (): void {
    // GIVEN a wallet factory and an invalid seed.
    const walletFactory = new WalletFactory(XrplNetwork.Test)
    const seed = 'xrp'
    const derivationPath = "m/44'/144'/0'/0/0"

    // WHEN a wallet is generated from the seed and derivation path.
    const wallet = walletFactory.walletFromSeedAndDerivationPath(
      seed,
      derivationPath,
    )

    // THEN the wallet is undefined.
    assert.isUndefined(wallet)
  })

  // walletFromMnemonicAndDerivationPath

  it('walletFromMnemonicAndDerivationPath - derivation path index 0 - MainNet', async function (): Promise<
    void
  > {
    // GIVEN a `WalletFactory`, a menmonic, derivation path and a set of expected outputs.
    const walletFactory = new WalletFactory(XrplNetwork.Main)
    const testData = DERIVATION_PATH_TEST_CASES.index0

    // WHEN a new wallet is generated on MainNet with the mnemonic and derivation path.
    const wallet = await walletFactory.walletFromMnemonicAndDerivationPath(
      testData.mnemonic,
      testData.derivationPath,
    )!

    // THEN the wallet has the expected address and keys.
    assert.equal(wallet?.privateKey, testData.expectedPrivateKey)
    assert.equal(wallet?.publicKey, testData.expectedPublicKey)
    assert.equal(wallet?.getAddress(), testData.expectedMainNetAddress)
  })

  it('walletFromMnemonicAndDerivationPath - derivation path index 0, TestNet', async function (): Promise<
    void
  > {
    // GIVEN a `WalletFactory`, a menmonic, derivation path and a set of expected outputs.
    const walletFactory = new WalletFactory(XrplNetwork.Test)
    const testData = DERIVATION_PATH_TEST_CASES.index0

    // WHEN a new wallet is generated on TestNet with the mnemonic and derivation path.
    const wallet = await walletFactory.walletFromMnemonicAndDerivationPath(
      testData.mnemonic,
      testData.derivationPath,
    )!

    // THEN the wallet has the expected address and keys.
    assert.equal(wallet?.privateKey, testData.expectedPrivateKey)
    assert.equal(wallet?.publicKey, testData.expectedPublicKey)
    assert.equal(wallet?.getAddress(), testData.expectedTestNetAddress)
  })

  it('walletFromMnemonicAndDerivationPath - derivation path index 1', async function (): Promise<
    void
  > {
    // GIVEN a `WalletFactory`, a menmonic, derivation path and a set of expected outputs.
    const walletFactory = new WalletFactory(XrplNetwork.Main)
    const testData = DERIVATION_PATH_TEST_CASES.index1

    // WHEN a new wallet is generated with the mnemonic and derivation path.
    const wallet = await walletFactory.walletFromMnemonicAndDerivationPath(
      testData.mnemonic,
      testData.derivationPath,
    )!

    // THEN the wallet has the expected address and keys.
    assert.equal(wallet?.privateKey, testData.expectedPrivateKey)
    assert.equal(wallet?.publicKey, testData.expectedPublicKey)
    assert.equal(wallet?.getAddress(), testData.expectedAddress)
  })

  it('walletFromMnemonicAndDerivationPath - no derivation path', async function (): Promise<
    void
  > {
    // GIVEN a `WalletFactory`, a menmonic, derivation path and a set of expected outputs.
    const walletFactory = new WalletFactory(XrplNetwork.Main)
    const testData = DERIVATION_PATH_TEST_CASES.index0

    // WHEN a new wallet is generated with the mnemonic and an unspecified derivation path.
    const wallet = await walletFactory.walletFromMnemonicAndDerivationPath(
      testData.mnemonic,
    )

    // THEN the wallet has the expected address and keys from the input mnemonic at the default derivation path.
    assert.equal(wallet?.privateKey, testData.expectedPrivateKey)
    assert.equal(wallet?.publicKey, testData.expectedPublicKey)
    assert.equal(wallet?.getAddress(), testData.expectedMainNetAddress)
  })

  it('walletFromMnemonicAndDerivationPath - invalid mnemonic', async function (): Promise<
    void
  > {
    // GIVEN an invalid mnemonic.
    const walletFactory = new WalletFactory(XrplNetwork.Main)
    const mnemonic = 'xrp xrp xpr xpr xrp xrp xpr xpr xrp xrp xpr xpr'

    // WHEN a wallet is generated from the mnemonic.
    const wallet = await walletFactory.walletFromMnemonicAndDerivationPath(
      mnemonic,
    )

    // THEN the wallet is undefined.
    assert.isUndefined(wallet)
  })

  // generateRandomWallet

  it('generateRandomWallet - correctly restores random wallet', async function (): Promise<
    void
  > {
    // GIVEN a randomly generated wallet.
    const walletFactory = new WalletFactory(XrplNetwork.Main)
    const walletGenerationResult = await walletFactory.generateRandomWallet()
    if (walletGenerationResult === undefined) {
      throw new Error('Precondition failed: wallet could not be generated.')
    }

    // WHEN a wallet is restored with the seed.
    const restoredWallet = walletFactory.walletFromSeed(
      walletGenerationResult.seed,
    )

    // THEN the restored wallet and generated wallet are the same.
    assert.equal(
      restoredWallet?.privateKey,
      walletGenerationResult.wallet.privateKey,
    )
  })

  it('generateRandomWallet - correctly generates wallet with entropy', async function (): Promise<
    void
  > {
    // GIVEN a some entropy
    const walletFactory = new WalletFactory(XrplNetwork.Main)
    const entropy = '00000000000000000000000000000000'

    // WHEN a wallet is generated.
    const walletGenerationResult = await walletFactory.generateRandomWallet(
      entropy,
    )

    // THEN the generated wallet exists.
    assert.exists(walletGenerationResult?.wallet)
  })

  it('generateRandomWallet - fails with bad entropy', async function (): Promise<
    void
  > {
    // GIVEN invalid entropy.
    const walletFactory = new WalletFactory(XrplNetwork.Main)
    const entropy = 'xrp'

    // WHEN a wallet is generated from the entropy.
    const wallet = await walletFactory.generateRandomWallet(entropy)

    // THEN the wallet is undefined.
    assert.isUndefined(wallet)
  })
})
