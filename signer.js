const { Transaction } = require('./generated/Transaction_pb.js');
const rippleCodec = require('ripple-binary-codec');

/**
 * Abstracts details of signing.
 */
class Signer {
    /**
     * Encode the given object to hex and sign it.
     * 
     * @param {Terram.Transaction} transaction The transaction to sign.
     * @param {Terram.Wallet} wallet The wallet to sign the object with.
     * @returns {Terram.SignedTransaction} A signed transaction.
     */
    static signTransaction(operation, wallet) {
        const operationHex = rippleCodec.encodeForSigning(operation.toObject());
        const signatureHex = wallet.sign(operationHex);
        return new SigningResult(operationHex, signatureHex);
    }
}

module.exports = Signer;