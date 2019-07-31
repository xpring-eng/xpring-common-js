const bip39 = require('bip39');
const crypto = require('crypto');
const elliptic = require('elliptic')
const rippleKeyPair = require('ripple-keypairs');
const rippleAddressCodec = require('ripple-address-codec')
const KeyPair = require('./keypair.js');

/**
 * The result of a generating a new Wallet. This class wraps the newly generated 
 * wallet and associated mnemonic.
 */
class WalletGenerationResult {
    /**
     * @returns {String} The mnemonic associated with the generated wallet.
     */
    getMnemonic() {
        return this.mnemonic;
    }
    
    /**
     * @returns {Terram.Wallet} A reference to the newly generated wallet.
     */
    getWallet() {
        return this.wallet
    }

    /**
     * @param {String} mnemonic The mnemonic of the new wallet.
     * @param {Terram.Wallet} The new wallet.
     */
    constructor(mnemonic, wallet) {
        this.mnemonic = mnemonic;
        this.wallet = wallet;
    }
}

/**
 * A wallet object that has an address and keypair.
 */
class Wallet {
    /**
     * Generate a new wallet with a random mnemonic.
     * 
     * @returns {Terram.WalletGenerationResult} The result of generating a new wallet.
     */
    static generateWallet() {    
        const mnemonic = bip39.generateMnemonic();
        const wallet = Wallet.walletFromMnemonic(mnemonic);
        return new WalletGenerationResult(mnemonic, wallet);
    }

    /**
     * Generate a new wallet from a mnemonic.
     * 
     * @param {String} mnemonic The mnemonic for the wallet. 
     * @returns {Terram.Wallet|undefined} A new wallet from the given mnemonic if the mnemonic was valid, otherwise nil.
     */
    static walletFromMnemonic(mnemonic) {
        if (!bip39.validateMnemonic(mnemonic)) {
            return undefined;
        }
        
        // Generate a 16 byte seed.
        const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex').slice(0, 32);
        
        // The ripple-key-pair expects seeds to be passed as base58 encoded strings.
        // TODO: Update ripple-key-pair to take a hex encoded seed or drop use of the API and manually derive the keypair in Terram.
        rippleAddressCodec.encodeSeed(seed);
        const kp = rippleKeyPair.deriveKeypair(seed);
        return new Wallet(new KeyPair(kp.privateKey, kp.publicKey), mnemonic);
    }

    /**
     * Create a new Terram.Wallet object.
     * 
     * @param {Terram.KeyPair} keyPair A keypair for the wallet. 
     * @param {String} mnemonic An optional mnemonic for the wallet.
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
}

module.exports = {
    Wallet: Wallet,
    WalletGenerationResult: WalletGenerationResult
}