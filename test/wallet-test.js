const { assert } = require('chai')
const { Wallet } = require('../wallet.js')

describe('wallet', () => {
    it('generateWallet', () => {
        // WHEN a new wallet is generated.
        const walletGenerationResult = Wallet.generateWallet();

        // THEN the result has a mnemonic and a wallet.
        assert(walletGenerationResult.getMnemonic());
        assert(walletGenerationResult.getWallet());
    })
    it('walletFromMnemonic', () => {
        // GIVEN a menmonic and a set of corresponding keys and address.
        const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
        const expectedPrivateKey = "003280340E0F49CB8AA4CC2203C566B39B6F1372B06173E4AB41753AB96863D832"
        const expectedPublicKey = "034BB7C1E50FE8B02CAB3FFA722CF9955CE7EA44C2AC1A8CC98DE38FA884369F5F"
        const expectedAddresss = "rJq5ce8cdbWBsysXx32rvLMV6DUxMwruMT"

        // WHEN a wallet is generated from the mnemonic. 
        const wallet = Wallet.walletFromMnemonic(mnemonic)

        // THEN the generated wallet has the expected properties.
        assert.equal(wallet.getPrivateKey(), expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), expectedPublicKey);
        assert.equal(wallet.getAddress(), expectedAddresss);

        console.log(wallet.getMnemonic())
    })

    it('walletFromMnemonic  - invalid mnemonic', () => {
        // GIVEN an invalid mnemonic.
        const mnemonic = "xrp xrp xpr xpr xrp xrp xpr xpr xrp xrp xpr xpr"

        // WHEN a wallet is generated from the mnemonic.
        const wallet = Wallet.walletFromMnemonic(mnemonic);

        // THEN the wallet is undefined.
        assert.isUndefined(wallet)
    })
})