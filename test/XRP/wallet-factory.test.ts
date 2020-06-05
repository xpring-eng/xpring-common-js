import { assert } from 'chai'

import WalletFactory from '../../src/XRP/wallet-factory'
import 'mocha'

describe('Wallet Factory', function (): void {
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
    assert.equal(wallet?.publicKey, publicKey)
    assert.equal(wallet?.privateKey, privateKey)
  })

  it('Wallet From Keys - Invalid Public Key', function (): void {
    // GIVEN a wallet factory and an invalid public key
    const walletFactory = new WalletFactory(true)
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
    const walletFactory = new WalletFactory(true)
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
    const walletFactory = new WalletFactory(false)
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
    const walletFactory = new WalletFactory(true)
    const seed = 'xrp'

    // WHEN a wallet is generated from the seed.
    const wallet = walletFactory.walletFromSeed(seed)

    // THEN the wallet is undefined.
    assert.isUndefined(wallet)
  })
})
