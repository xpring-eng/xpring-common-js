const { assert } = require('chai')
const Wallet = require('../wallet.js')

/**
 * A mapping of input and expected outputs for BIP39 and BIP44.
 * @see https://iancoleman.io/bip39/#english
 */
const derivationPathTestCases = {
    index0: {
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
        derivationPath: "m/44'/144'/0'/0/0",
        expectedPublicKey: "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE",
        expectedPrivateKey: "0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4",
        expectedAddress: "rHsMGQEkVNJmpGWs8XUBoTBiAAbwxZN5v3"
    },
    index1: {
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
        derivationPath: "m/44'/144'/0'/0/1",
        expectedPublicKey: "038BF420B5271ADA2D7479358FF98A29954CF18DC25155184AEAD05796DA737E89",
        expectedPrivateKey: "000974B4CFE004A2E6C4364CBF3510A36A352796728D0861F6B555ED7E54A70389",
        expectedAddress: "r3AgF9mMBFtaLhKcg96weMhbbEFLZ3mx17"
    }
}

describe('wallet', () => {
    it('generateRandomWallet', () => {
        // WHEN a new wallet is generated.
        const wallet = Wallet.generateRandomWallet();

        // THEN the result exists and has the default derivation path.
        assert.exists(wallet);
        assert.equal(wallet.getDerivationPath(), Wallet.getDefaultDerivationPath());
    })

    it('walletFromMnemonic - derivation path index 0', () => {
        // GIVEN a menmonic, derivation path and a set of expected outputs.
        const testData = derivationPathTestCases.index0;

        // WHEN a new wallet is generated with the mnemonic and derivation path.
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);

        // THEN the wallet has the expected address and keys.
        assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), testData.expectedPublicKey);
        assert.equal(wallet.getAddress(), testData.expectedAddress);
        assert.equal(wallet.getMnemonic(), testData.mnemonic);
        assert.equal(wallet.getDerivationPath(), testData.derivationPath);
    })
    it('walletFromMnemonic - derivation path index 1', () => {
        // GIVEN a menmonic, derivation path and a set of expected outputs.
        const testData = derivationPathTestCases.index1;

        // WHEN a new wallet is generated with the mnemonic and derivation path.
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);

        // THEN the wallet has the expected address and keys.
        assert.equal(wallet.getPrivateKey(),testData.expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), testData.expectedPublicKey);
        assert.equal(wallet.getAddress(), testData.expectedAddress);
        assert.equal(wallet.getMnemonic(), testData.mnemonic);
        assert.equal(wallet.getDerivationPath(), testData.derivationPath);
    })

    it('walletFromMnemonic - no derivation path', () => {
        // GIVEN a menmonic, derivation path and a set of expected outputs.
        const testData = derivationPathTestCases.index0;

        // WHEN a new wallet is generated with the mnemonic and an unspecified derivation path.
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic);

        // THEN the wallet has the expected address and keys from the input mnemonic at the default derivation path.
        assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), testData.expectedPublicKey);
        assert.equal(wallet.getAddress(), testData.expectedAddress);
        assert.equal(wallet.getMnemonic(), testData.mnemonic);
        assert.equal(wallet.getDerivationPath(), Wallet.getDefaultDerivationPath());
    })


    it('walletFromMnemonic - invalid mnemonic', () => {
        // GIVEN an invalid mnemonic.
        const mnemonic = "xrp xrp xpr xpr xrp xrp xpr xpr xrp xrp xpr xpr"

        // WHEN a wallet is generated from the mnemonic.
        const wallet = Wallet.generateWalletFromMnemonic(mnemonic);

        // THEN the wallet is undefined.
        assert.isUndefined(wallet)
    })
})
