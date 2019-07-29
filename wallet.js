const rippleKeyPair = require('ripple-keypairs')
// const KeyPair = require('./keypair.js')

/**
 * A pair of assymetric cryptographic keys.
 */
class KeyPair {
    /**
     * Create a new key pair.
     * 
     * @constructor
     * 
     * @param {String} privateKey The private key.
     * @param {String} publicKey The public key.
     */
    constructor(privateKey, publicKey) {
      this.privateKey = privateKey
      this.publicKey = publicKey
    }
}

class Wallet {
    static generateWallet() {
        const seed = rippleKeyPair.generateSeed();
        return Wallet.walletFromSeed(seed);
    }

    static walletFromSeed(seed) {
        const kp = rippleKeyPair.deriveKeypair(seed);
        return new Wallet(new KeyPair(kp.privateKey, kp.publicKey));
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