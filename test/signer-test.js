const { assert } = require('chai');
const { Signer } = require('../signer.js');
const Wallet = require('../wallet.js');

describe('signer', () => {
    it('sign', () => {
        // GIVEN an operation and a wallet and expected signing artifacts.
        const wallet = Wallet.generateRandomWallet();
        const operation = { "nonsense": "NONSENSE!!" };
        const expectedOperationHex = "DEADBEEF";
        const expectedSignatureHex = "DEADBEEF";

        // WHEN the operation is signed with the wallet.
        const signingResult = Signer.sign(operation, wallet);

        // THEN the signing artifacts are as expected.
        assert.equal(signingResult.getOperationHex(), expectedOperationHex);
        assert.equal(signingResult.getSignatureHex(), expectedSignatureHex);
    })
})
