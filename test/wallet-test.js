const { assert } = require('chai')
const Wallet = require('../wallet.js')
const utils = require('../utils.js')

/**

 * Expected values for a wallet.
 */
const testWalletData = {
    seed: "sp5fghtJtpUorTwvof1NpDXAzNwf5",
    privateKey: "00D78B9735C3F26501C7337B8A5727FD53A6EFDBC6AA55984F098488561F985E23",
    publicKey: "030D58EB48B4420B1F7B9DF55087E0E29FEF0E8468F9A6825B01CA2C361042D435",
    address: "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1",
    messageHex: new Buffer("test message", 'utf-8').toString('hex'),
    signature: "30440220583A91C95E54E6A651C47BEC22744E0B101E2C4060E7B08F6341657DAD9BC3EE02207D1489C7395DB0188D3A56A977ECBA54B36FA9371B40319655B1B4429E33EF2D"
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

    it('walletFromSeed', () => {
        // GIVEN a seed.
        const seed = testWalletData.seed

        // WHEN a wallet is generated from the seed. 
        const wallet = Wallet.generateWalletFromSeed(seed)

        // THEN the generated wallet has the expected properties.
        assert.equal(wallet.getSeed(), seed)
        assert.equal(wallet.getPrivateKey(), testWalletData.privateKey);
        assert.equal(wallet.getPublicKey(), testWalletData.publicKey);
        assert.equal(wallet.getAddress(), testWalletData.address);
    })

    it('sign', () => {
        // GIVEN a wallet.
        const wallet = Wallet.generateWalletFromSeed(testWalletData.seed);
   
        // WHEN the wallet signs a hex message.
        const signature = wallet.sign(testWalletData.messageHex);

        // THEN the signature is as expected.
        assert.equal(signature, testWalletData.signature);
    })

    it('sign - invalid hex', () => {
        // GIVEN a wallet and a non-hexadecimal message.
        const wallet = Wallet.generateWalletFromSeed(testWalletData.seed);
        const message = "xrp";
        
        // WHEN the wallet signs a message.
        const signature = wallet.sign(message);

        // THEN the signature is undefined.
        assert.notExists(signature);
    })

    it('verify - valid signature', () => {
        // GIVEN a wallet and a message with a valid signature.
        const wallet = Wallet.generateWalletFromSeed(testWalletData.seed);
        const message = testWalletData.messageHex;
        const signature = testWalletData.signature;
        
        // WHEN a message is verified.
        const isValid = wallet.verify(message, signature);

        // THEN the signature is deemed valid.
        assert.isTrue(isValid);
    })

    it('verify - invalid signature', () => {
        // GIVEN a wallet and a invalid signature.
        const wallet = Wallet.generateWalletFromSeed(testWalletData.seed);
        const message = testWalletData.messageHex;
        const signature = "DEADBEEF"
        
        // WHEN a message is verified.
        const isValid = wallet.verify(message, signature);

        // THEN the signature is deemed invalid.
        assert.isFalse(isValid);
    })

    it('verify - bad signature', () => {
        // GIVEN a wallet and a non hex signature.
        const wallet = Wallet.generateWalletFromSeed(testWalletData.seed);
        const message = testWalletData.messageHex;
        const signature = "xrp"
        
        // WHEN a message is verified.
        const isValid = wallet.verify(message, signature);

        // THEN the signature is deemed invalid.
        assert.isFalse(isValid);
    })

    it('verify - bad message', () => {
        // GIVEN a wallet and a non hex signature.
        const wallet = Wallet.generateWalletFromSeed(testWalletData.seed);
        const message = "xrp"
        const signature = testWalletData.signature;
        
        // WHEN a message is verified.
        const isValid = wallet.verify(message, signature);

        // THEN the signature is deemed invalid.
        assert.isFalse(isValid);
    })
})
