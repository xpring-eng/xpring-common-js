"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Wallet = require("../../src/wallet");
const defaultKeyPair = {
    publicKey: "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE",
    privateKey: "0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4"
};
const defaultMnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
class FakeWallet extends Wallet {
    constructor(signature, keyPair = defaultKeyPair, mnemonic = defaultMnemonic, derivationPath = Wallet.getDefaultDerivationPath()) {
        super(keyPair, mnemonic, derivationPath);
        this.signature = signature;
    }
    sign(_hex) {
        return this.signature;
    }
}
exports.default = FakeWallet;
//# sourceMappingURL=fake-wallet.js.map