const rippleKeyPair = require('ripple-keypairs')
const KeyPair = require('./keypair.js')

/**
 * A wallet object that has an address and keypair.
 */
class Wallet {
    /**
     * Generate a new wallet with a random seed.
     * 
     * @returns {Terram.Wallet} A new Wallet.
     */
    static generateWallet() {
        const seed = rippleKeyPair.generateSeed();
        return Wallet.walletFromSeed(seed);
    }

    /**
     * Generate a wallet from the given seed.
     * 
     * @param {String} seed The seed for the wallet.
     * @returns {Terram.Wallet} A new Wallet from the given seed.
     */
    static walletFromSeed(seed) {
        const kp = rippleKeyPair.deriveKeypair(seed);
        return new Wallet(new KeyPair(kp.privateKey, kp.publicKey), seed);
    }

    /**
     * Create a new Terram.Wallet object.
     * 
     * @param {Terram.KeyPair} keyPair A keypair for the wallet. 
     * @param {String} seed An optional seed.
     */
    constructor(keyPair, seed) {
        this.keyPair = keyPair
        this.seed = seed
    }

    /**
     * @returns {String} A string representing the public key for the wallet.
     */
    getPublicKey() {
        return this.keyPair.publicKey
    }

    /**
     * @returns {String} A string representing the private key for the wallet.
     */
    getPrivateKey() {
        return this.keyPair.privateKey
    }

    /**
     * @returns {String} A string representing the address of the wallet.
     */
    getAddress() {
        return rippleKeyPair.deriveAddress(this.getPublicKey())
    }

    /**
     * @returns {String|undefined} The underlying seed for the wallet if the wallet was initialized from a seed, otherwise, undefined.
     */
    getSeed() {
        return this.seed;
    }
}

module.exports = Wallet