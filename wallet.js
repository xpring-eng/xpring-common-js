const rippleKeyPair = require('ripple-keypairs')
const KeyPair = require('./keypair.js')

class Wallet {
    static generateWallet() {
        const seed = rippleKeyPair.generateSeed();
        return Wallet.walletFromSeed(seed);
    }

    static walletFromSeed(seed) {
        const rippleKeyPair = rippleKeyPair.deriveKeypair(seed);
        return new Wallet(new KeyPair(rippleKeyPair.privateKey, rippleKeyPair.publicKey));
    }

    // TODO: Implement Me!
    // static walletFromPrivateKey(privateKey) {
    // }

    constructor(keyPair) {
        this.keyPair = keyPair
    }

    getPublicKey() {
        return this.keyPair.publicKey
    }

    getPrivateKey() {
        return this.keyPair.privateKey
    }

    getAddress() {
        return rippleKeyPair.deriveAddress(this.getPublicKey())
    }
}

module.exports = Wallet