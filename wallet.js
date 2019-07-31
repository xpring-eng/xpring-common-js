const isHex = require('is-hex')
const rippleKeyPair = require('ripple-keypairs')

/**
 * A wallet object that has an address and keypair.
 */
class Wallet {
    /**
     * Generate a new wallet with a random seed.
     * 
     * @returns {Terram.Wallet} A new Wallet.
     */
    static generateRandomWallet() {
        const seed = rippleKeyPair.generateSeed();
        return Wallet.generateWalletFromSeed(seed);
    }

    /**
     * Generate a wallet from the given seed.
     * 
     * @param {String} seed The seed for the wallet.
     * @returns {Terram.Wallet} A new Wallet from the given seed.
     */
    static generateWalletFromSeed(seed) {
        const keyPair = rippleKeyPair.deriveKeypair(seed);
        return new Wallet(keyPair, seed);
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

    /**
     * Sign an arbitrary hex string.
     * 
     * @param {String} hex An arbitrary hex string to sign.
     * @returns {String} A signed hex string if the input is valid, otherwise undefined.
     */
    sign(hex) {
        if (!isHex(hex)) {
            return undefined;
        }
        return rippleKeyPair.sign(hex, this.getPrivateKey());
    }
}

module.exports = Wallet
