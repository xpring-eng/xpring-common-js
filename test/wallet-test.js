const { assert } = require('chai')
const Wallet = require('../wallet.js')

describe('wallet', () => {
    it('generateWallet', () => {
        // WHEN a new wallet is generated.
        const wallet = Wallet.generateRandomWallet();

        // THE resulting object is defined.
        assert(wallet);        
    })

    it('walletFromSeed', () => {
        // GIVEN a seed and a set of corresponding keys and address.
        const seed = "sp5fghtJtpUorTwvof1NpDXAzNwf5"
        const expectedPrivateKey = "00D78B9735C3F26501C7337B8A5727FD53A6EFDBC6AA55984F098488561F985E23"
        const expectedPublicKey = "030D58EB48B4420B1F7B9DF55087E0E29FEF0E8468F9A6825B01CA2C361042D435"
        const expectedAddresss = "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1"

        // WHEN a wallet is generated from the seed. 
        const wallet = Wallet.generateWalletFromSeed(seed)

        // THEN the generated wallet has the expected properties.
        assert.equal(wallet.getSeed(), seed)
        assert.equal(wallet.getPrivateKey(), expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), expectedPublicKey);
        assert.equal(wallet.getAddress(), expectedAddresss);
    })
})
