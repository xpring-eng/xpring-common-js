const { assert } = require('chai')
const Wallet = require('../wallet.js')

describe('wallet', () => {
    it('generateWallet', () => {
        // WHEN a new wallet is generated.
        const wallet = Wallet.generateWallet();

        // THE resulting object is defined.
        assert(wallet);        
    })

    it('walletFromSeed', () => {
        // GIVEN a seed and a set of corresponding keys and address.
        const seed = "snLWQiYoYA1RYunsXLKw7cyPTWcCh"
        const expectedPrivateKey = "001AA5BE720986A9CF40EF034104E799B9F0E8864EAB5ED52C903E6F69FD362ABC"
        const expectedPublicKey = "02E2A881409C0075580E5A42E9C6023B08468DCE4817D3DF4E44194C8DB78DA579"
        const expectedAddresss = "rGXvBeBA4d3KX5P1Qz2gb6L4EoqMEtkWc"

        // WHEN a wallet is generated from the seed. 
        const wallet = Wallet.walletFromSeed(seed)

        // THEN the generated wallet has the expected properties.
        assert.equal(wallet.getSeed(), seed)
        assert.equal(wallet.getPrivateKey(), expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), expectedPublicKey);
        assert.equal(wallet.getAddress(), expectedAddresss);
    })
})