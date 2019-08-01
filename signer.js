const Wallet = require('./wallet.js');
const rippleCodec = require('ripple-binary-codec');

/**
 * Artifacts from the signing process.
 */
class SigningResult {
    /**
     * Construct a new SigningResult.
     * 
     * @param {String} operationHex The hexadecimal representation of the operation.
     * @param {String} signatureHex The hexadecimal representation of the signature.
     */
    constructor(operationHex, signatureHex) {
        this.operationHex = operationHex;
        this.signatureHex = signatureHex;
    }

    /**
     * @returns The hex representation of the operation.
     */
    getOperationHex() {
        return this.operationHex;
    }

    /**
     * @returns The hex representation of the signature.
     */
    getSignatureHex() {
        return this.signatureHex;
    }
}

/**
 * Provides abstractions around signing objects.
 */
class Signer {
    /**
     * Encode the given object to hex and sign it.
     * 
     * @param {Object} operation The object to sign.
     * @param {Terram.Wallet} wallet The wallet to sign the object with.
     * @returns
     */
    static sign(operation, wallet) {
        const operationHex = "deadbeef";
        const signatureHex = wallet.sign(operationHex);
        return new SigningResult(operationHex, signatureHex);
    }
}

module.exports = {
    Signer: Signer,
    SigningResult: SigningResult
}