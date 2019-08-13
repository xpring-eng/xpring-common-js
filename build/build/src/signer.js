"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serializer_1 = __importDefault(require("./serializer"));
const SignedTransaction_pb_1 = require("../generated/SignedTransaction_pb");
const rippleCodec = require("ripple-binary-codec");
class Signer {
    static signTransaction(transaction, wallet) {
        if (transaction === undefined || wallet === undefined) {
            return undefined;
        }
        const transactionJSON = serializer_1.default.transactionToJSON(transaction);
        const transactionHex = rippleCodec.encodeForSigning(transactionJSON);
        const signatureHex = wallet.sign(transactionHex);
        if (signatureHex == undefined) {
            return undefined;
        }
        const signedTransaction = new SignedTransaction_pb_1.SignedTransaction();
        signedTransaction.setTransaction(transaction);
        signedTransaction.setTransactionSignatureHex(signatureHex);
        signedTransaction.setPublicKeyHex(wallet.getPublicKey());
        return signedTransaction;
    }
}
module.exports = Signer;
//# sourceMappingURL=signer.js.map