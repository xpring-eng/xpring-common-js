"use strict";
const Serializer = require("./serializer.js");
const { SignedTransaction } = require("../generated/SignedTransaction_pb.js");
const rippleCodec = require("ripple-binary-codec");
class Signer {
    static signTransaction(transaction, wallet) {
        if (transaction === undefined || wallet === undefined) {
            return undefined;
        }
        const transactionJSON = Serializer.transactionToJSON(transaction);
        const transactionHex = rippleCodec.encodeForSigning(transactionJSON);
        const signatureHex = wallet.sign(transactionHex);
        const signedTransaction = new SignedTransaction();
        signedTransaction.setTransaction(transaction);
        signedTransaction.setTransactionSignatureHex(signatureHex);
        signedTransaction.setPublicKeyHex(wallet.getPublicKey());
        return signedTransaction;
    }
}
module.exports = Signer;
//# sourceMappingURL=signer.js.map