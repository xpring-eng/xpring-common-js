const { assert } = require('chai')
const Wallet = require('../wallet.js')

describe('wallet', () => {
    it('generateWallet', () => {
        const wallet = Wallet.generateWallet();
        assert(wallet);
        
    })
})