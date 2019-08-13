"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bip32 = require("ripple-bip32");
const bip39 = require("bip39");
const isHex = require("is-hex");
const rippleKeyPair = require("ripple-keypairs");
const defaultDerivationPath = "m/44'/144'/0'/0/0";
class Wallet {
    constructor(keyPair, mnemonic, derivationPath) {
        this.keyPair = keyPair;
        this.mnemonic = mnemonic;
        this.derivationPath = derivationPath;
    }
    static getDefaultDerivationPath() {
        return defaultDerivationPath;
    }
    static generateRandomWallet() {
        const mnemonic = bip39.generateMnemonic();
        const derivationPath = Wallet.getDefaultDerivationPath();
        return Wallet.generateWalletFromMnemonic(mnemonic, derivationPath);
    }
    static generateWalletFromMnemonic(mnemonic, derivationPath) {
        if (derivationPath === undefined) {
            derivationPath = Wallet.getDefaultDerivationPath();
        }
        if (!bip39.validateMnemonic(mnemonic)) {
            return undefined;
        }
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const masterNode = bip32.fromSeedBuffer(seed);
        const keyPair = masterNode.derivePath(derivationPath).keyPair.getKeyPairs();
        return new Wallet(keyPair, mnemonic, derivationPath);
    }
    getPublicKey() {
        return this.keyPair.publicKey;
    }
    getPrivateKey() {
        return this.keyPair.privateKey;
    }
    getAddress() {
        return rippleKeyPair.deriveAddress(this.getPublicKey());
    }
    getMnemonic() {
        return this.mnemonic;
    }
    getDerivationPath() {
        return this.derivationPath;
    }
    sign(hex) {
        if (!isHex(hex)) {
            return undefined;
        }
        return rippleKeyPair.sign(hex, this.getPrivateKey());
    }
    verify(message, signature) {
        if (!isHex(signature) || !isHex(message)) {
            return false;
        }
        try {
            return rippleKeyPair.verify(message, signature, this.getPublicKey());
        }
        catch (error) {
            return false;
        }
    }
}
exports.default = Wallet;
//# sourceMappingURL=wallet.js.map