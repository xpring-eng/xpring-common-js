const { assert } = require('chai')
const { Wallet } = require('../wallet.js')

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
        const walletGenerationResult = Wallet.generateRandomWallet();

        // THEN the result has a mnemonic and a wallet.
        assert.exists(walletGenerationResult.getMnemonic());
        assert.exists(walletGenerationResult.getWallet());
        assert.equal(walletGenerationResult.getDerivationPath(), Wallet.getDefaultDerivationPath());
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
    })

    it('walletFromMnemonic - derivation path index 1', () => {
        // GIVEN a menmonic, derivation path and a set of expected outputs.
        const testData = derivationPathTestCases.index0;

        // WHEN a new wallet is generated with the mnemonic and derivation path.
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic, testData.derivationPath);

        // THEN the wallet has the expected address and keys.
        assert.equal(wallet.getPrivateKey(),testData.expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), testData.expectedPublicKey);
        assert.equal(wallet.getAddress(), testData.expectedAddress);
    })

    it('walletFromMnemonic - no derivation path', () => {
        // GIVEN a menmonic, derivation path and a set of expected outputs.
        const testData = derivationPathTestCases.index0;

        // WHEN a new wallet is generated with the mnemonic and an unspecified derivation path.
        const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic);

        // THEN the wallet has the expected address and keys.
        assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), testData.expectedPublicKey);
        assert.equal(wallet.getAddress(), testData.expectedAddress);
    })


    it('walletFromMnemonic - invalid mnemonic', () => {
        // GIVEN an invalid mnemonic.
        const mnemonic = "xrp xrp xpr xpr xrp xrp xpr xpr xrp xrp xpr xpr"

        // WHEN a wallet is generated from the mnemonic.
        const wallet = Wallet.generateWalletFromMnemonic(mnemonic);

        // THEN the wallet is undefined.
        assert.isUndefined(wallet)
    })

    it('walletFromSeed', () => {
        // GIVEN a seed and a set of corresponding keys and address.
        const seed = "sp5fghtJtpUorTwvof1NpDXAzNwf5"
        const expectedPrivateKey = "00D78B9735C3F26501C7337B8A5727FD53A6EFDBC6AA55984F098488561F985E23"
        const expectedPublicKey = "030D58EB48B4420B1F7B9DF55087E0E29FEF0E8468F9A6825B01CA2C361042D435"
        const expectedAddresss = "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1"

        // WHEN a wallet is generated from the seed. 
        const wallet = Wallet.generateWalletFromSeed(seed)

        // THEN the generated wallet has the expected properties.
        assert.equal(wallet.getPrivateKey(), expectedPrivateKey);
        assert.equal(wallet.getPublicKey(), expectedPublicKey);
        assert.equal(wallet.getAddress(), expectedAddresss);
    })

})
