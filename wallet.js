const bip39 = require('bip39');
const bip32 = require("ripple-bip32");
const rippleKeyPair = require('ripple-keypairs');

/**
 * The default derivation path to use with BIP44.
 */
const defaultDerivationPath = "m/44'/144'/0'/0/0"

/**
 * The result of a generating a new Wallet. This class wraps the newly generated wallet and associated mnemonic.
 */
class WalletGenerationResult {
    /**
     * @returns {String} The mnemonic associated with the generated wallet.
     */
    getMnemonic() {
        return this.mnemonic;
    }

    /**
     * @returns {String} The derivation path used. 
     */
    getDerivationPath() {
        return this.derivationPath;
    }
    
    /**
     * @returns {Terram.Wallet} The newly generated wallet.
     */
    getWallet() {
        return this.wallet;
    }

    /**
     * @param {String} mnemonic The mnemonic of the new wallet.
     * @param {String} derivationPath The derivation path used.
     * @param {Terram.Wallet} The new wallet.
     */
    constructor(mnemonic, derivationPath, wallet) {
        this.mnemonic = mnemonic;
        this.derivationPath = derivationPath;
        this.wallet = wallet;
    }
}

/**
 * A wallet object that has an address and keypair.
 */
class Wallet {
    /**
     * @returns {String} The default derivation path.
     */
    static getDefaultDerivationPath() {
        return defaultDerivationPath;
    }

    /**
     * Generate a new wallet with a random mnemonic.
     * 
     * @returns {Terram.WalletGenerationResult} The result of generating a new wallet.
     */
    static generateRandomWallet() {
        const mnemonic = bip39.generateMnemonic();
        const derivationPath = Wallet.getDefaultDerivationPath();
        const wallet = Wallet.generateWalletFromMnemonic(mnemonic, derivationPath);
        return new WalletGenerationResult(mnemonic, derivationPath, wallet);
    }

    /**
     * Generate a new wallet from a mnemonic.
     * 
     * @param {String} mnemonic The mnemonic for the wallet. 
     * @param {String} derivationPath The BIP44 derivation path to use. If undefined, the default path is used.
     * @returns {Terram.Wallet|undefined} A new wallet from the given mnemonic if the mnemonic was valid, otherwise undefined.
     */
    static generateWalletFromMnemonic(mnemonic, derivationPath) {
        // Use default derivation path if derivation path is unspecified.
        if (derivationPath == undefined) {
            derivationPath = Wallet.getDefaultDerivationPath();
        }

        // Validate mnemonic and path are valid.
        if (!bip39.validateMnemonic(mnemonic)) {
            return undefined;
        }
        
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const masterNode = bip32.fromSeedBuffer(seed)
        const keyPair = masterNode.derivePath(Wallet.getDefaultDerivationPath()).keyPair.getKeyPairs()
        return new Wallet(keyPair);
    }

    /**
     * Generate a wallet from the given seed.
     * 
     * @param {String} seed The seed for the wallet.
     * @returns {Terram.Wallet} A new Wallet from the given seed.
     */
    static generateWalletFromSeed(seed) {
        const keyPair = rippleKeyPair.deriveKeypair(seed);
        return new Wallet(keyPair);
    }

    /**
     * Create a new Terram.Wallet object.
     * 
     * @param {Terram.KeyPair} keyPair A keypair for the wallet. 
     */
    constructor(keyPair) {
        this.keyPair = keyPair
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
};