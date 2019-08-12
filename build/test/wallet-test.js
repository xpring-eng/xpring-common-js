"use strict";
const { assert } = require("chai");
const { Wallet } = require("../src/index.js");
const derivationPathTestCases = {
    index0: {
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
        derivationPath: "m/44'/144'/0'/0/0",
        expectedPublicKey: "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE",
        expectedPrivateKey: "0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4",
        expectedAddress: "rHsMGQEkVNJmpGWs8XUBoTBiAAbwxZN5v3",
        messageHex: new Buffer("test message", "utf-8").toString("hex"),
        expectedSignature: "3045022100E10177E86739A9C38B485B6AA04BF2B9AA00E79189A1132E7172B70F400ED1170220566BD64AA3F01DDE8D99DFFF0523D165E7DD2B9891ABDA1944E2F3A52CCCB83A"
    },
    index1: {
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
        derivationPath: "m/44'/144'/0'/0/1",
        expectedPublicKey: "038BF420B5271ADA2D7479358FF98A29954CF18DC25155184AEAD05796DA737E89",
        expectedPrivateKey: "000974B4CFE004A2E6C4364CBF3510A36A352796728D0861F6B555ED7E54A70389",
        expectedAddress: "r3AgF9mMBFtaLhKcg96weMhbbEFLZ3mx17"
    }
};
describe("wallet", function () {
    it("generateRandomWallet", function () {
        const wallet = Wallet.generateRandomWallet();
        assert.exists(wallet);
        assert.equal(wallet.getDerivationPath(), Wallet.getDefaultDerivationPath());
    });
    it("walletFromMnemonic - derivation path index 0", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), testData.expectedPublicKey);
        assert.equal(wallet.getAddress(), testData.expectedAddress);
        assert.equal(wallet.getMnemonic(), testData.mnemonic);
        assert.equal(wallet.getDerivationPath(), testData.derivationPath);
    });
    it("walletFromMnemonic - derivation path index 1", function () {
        const testData = derivationPathTestCases.index1;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), testData.expectedPublicKey);
        assert.equal(wallet.getAddress(), testData.expectedAddress);
        assert.equal(wallet.getMnemonic(), testData.mnemonic);
        assert.equal(wallet.getDerivationPath(), testData.derivationPath);
    });
    it("walletFromMnemonic - no derivation path", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic);
        assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), testData.expectedPublicKey);
        assert.equal(wallet.getAddress(), testData.expectedAddress);
        assert.equal(wallet.getMnemonic(), testData.mnemonic);
        assert.equal(wallet.getDerivationPath(), Wallet.getDefaultDerivationPath());
    });
    it("walletFromMnemonic - invalid mnemonic", function () {
        const mnemonic = "xrp xrp xpr xpr xrp xrp xpr xpr xrp xrp xpr xpr";
        const wallet = Wallet.generateWalletFromMnemonic(mnemonic);
        assert.isUndefined(wallet);
    });
    it("sign", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        const signature = wallet.sign(testData.messageHex);
        assert.equal(signature, testData.expectedSignature);
    });
    it("sign - invalid hex", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        const message = "xrp";
        const signature = wallet.sign(message);
        assert.notExists(signature);
    });
    it("sign - undefined message", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        const signature = wallet.sign(undefined);
        assert.notExists(signature);
    });
    it("verify - valid signature", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        const message = testData.messageHex;
        const signature = testData.expectedSignature;
        const isValid = wallet.verify(message, signature);
        assert.isTrue(isValid);
    });
    it("verify - invalid signature", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        const message = testData.messageHex;
        const signature = "DEADBEEF";
        const isValid = wallet.verify(message, signature);
        assert.isFalse(isValid);
    });
    it("verify - bad signature", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        const message = testData.messageHex;
        const signature = "xrp";
        const isValid = wallet.verify(message, signature);
        assert.isFalse(isValid);
    });
    it("verify - bad message", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        const message = "xrp";
        const signature = testData.expectedSignature;
        const isValid = wallet.verify(message, signature);
        assert.isFalse(isValid);
    });
    it("verify - undefined message", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        const message = testData.messageHex;
        const isValid = wallet.verify(message, undefined);
        assert.isFalse(isValid);
    });
    it("verify - undefined signature", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        const signature = testData.expectedSignature;
        const isValid = wallet.verify(undefined, signature);
        assert.isFalse(isValid);
    });
    it("signs and verifies an empty message", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        const message = "";
        const signature = wallet.sign(message);
        const isValid = wallet.verify(message, signature);
        assert.isTrue(isValid);
    });
    it("fails to verify a bad signature on an empty string.", function () {
        const testData = derivationPathTestCases.index0;
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);
        const message = "";
        const signature = "DEADBEEF";
        const isValid = wallet.verify(message, signature);
        assert.isFalse(isValid);
    });
});
//# sourceMappingURL=wallet-test.js.map