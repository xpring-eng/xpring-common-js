import { assert } from 'chai'

import WalletFactory from '../../src/XRP/wallet-factory'
import 'mocha'

describe('Wallet Factory', function (): void {
  // walletFromKeys()

  it('Wallet From Keys - Valid Keys', function (): void {
    // GIVEN a wallet factory and set of valid keys.
    const walletFactory = new WalletFactory(true)
    const publicKey =
      '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE'
    const privateKey =
      '0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4'

    // WHEN a wallet is generated.
    const wallet = walletFactory.walletFromKeys(publicKey, privateKey)

    // THEN the generated wallet has the correct keys.
    assert.equal(wallet.getPublicKey(), publicKey)
    assert.equal(wallet.getPrivateKey(), privateKey)
  })

  it('Wallet From Keys - Invalid Public Key', function (): void {
    // GIVEN a wallet factory and an invalid public key
    const walletFactory = new WalletFactory(true)
    const publicKey = 'xrp' // Not hex
    const privateKey =
      '0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4'

    // WHEN a wallet is generated.
    const wallet = walletFactory.walletFromKeys(publicKey, privateKey)

    // THEN the generated wallet is undefined.
    assert.isUndefined(wallet)
  })

  it('Wallet From Keys - Invalid Private Key', function (): void {
    // GIVEN a wallet factory and an invalid public key
    const walletFactory = new WalletFactory(true)
    const publicKey =
      '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE'
    const privateKey = 'xrp' // Not hex

    // WHEN a wallet is generated.
    const wallet = walletFactory.walletFromKeys(publicKey, privateKey)

    // THEN the generated wallet is undefined.
    assert.isUndefined(wallet)
  })

  // walletFromSeed

  it('walletFromSeed - MainNet', function (): void {
    // GIVEN a wallet factory and a valid seed.
    const walletFactory = new WalletFactory(true)
    const seed = 'snYP7oArxKepd3GPDcrjMsJYiJeJB'

    // WHEN a wallet is generated from the seed.
    const wallet = walletFactory.walletFromSeed(seed)

    // THEN the wallet has the expected address.
    assert.equal(
      wallet.getAddress(),
      'XVnJMYQFqA8EAijpKh5EdjEY5JqyxykMKKSbrUX8uchF6U8',
    )
  })

  it('walletFromSeed - invalid seed', function (): void {
    // GIVEN a wallet factory and an valid seed.
    const walletFactory = new WalletFactory(true)
    const seed = 'xrp'

    // WHEN a wallet is generated from the seed.
    const wallet = walletFactory.walletFromSeed(seed)

    // THEN the wallet is undefined.
    assert.isUndefined(wallet)
  })

  // walletFromSeedAndDerivationPath

  it('walletFromSeedAndDerivationPath - valid inputs - derivation path 0', function (): void {
    // GIVEN a wallet factory, a valid seed and a valid derivation path.
    const walletFactory = new WalletFactory(true)
    const seed = 'snYP7oArxKepd3GPDcrjMsJYiJeJB'
    const derivationPath = "m/44'/144'/0'/0/0"

    // WHEN a wallet is generated from the seed and derivation path.
    const wallet = walletFactory.walletFromSeedAndDerivationPath(
      seed,
      derivationPath,
    )

    // THEN the wallet has the expected address.
    assert.equal(
      wallet.getAddress(),
      'XVnJMYQFqA8EAijpKh5EdjEY5JqyxykMKKSbrUX8uchF6U8',
    )
  })

  it('walletFromSeedAndDerivationPath - valid inputs - derivation path 1', function (): void {
    // GIVEN a wallet factory, a valid seed and a valid derivation path.
    const walletFactory = new WalletFactory(true)
    const seed = 'snYP7oArxKepd3GPDcrjMsJYiJeJB'
    const derivationPath = "m/44'/144'/0'/0/1"

    // WHEN a wallet is generated from the seed and derivation path.
    const wallet = walletFactory.walletFromSeedAndDerivationPath(
      seed,
      derivationPath,
    )

    // THEN the wallet has the expected address.
    assert.equal(
      wallet.getAddress(),
      'XVnJMYQFqA8EAijpKh5EdjEY5JqyxykMKKSbrUX8uchF6U8',
    )
  })

  it('walletFromSeedAndDerivationPath - invalid derivation path', function (): void {
    // GIVEN a wallet factory and an invalid derivation path.
    const walletFactory = new WalletFactory(true)
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
    const walletFactory = new WalletFactory(true)
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
})