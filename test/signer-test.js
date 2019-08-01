const { assert } = require('chai');
const { Signer } = require('../signer.js');
const FakeWallet = require('./fakes/fake-wallet.js');

describe('signer', () => {
    it('sign', () => {
        // GIVEN an operation and a wallet and expected signing artifacts.
        const fakeSignature = "FAKE_SIGNATURE";
        const wallet = new FakeWallet(fakeSignature)
        const operation = { "nonsense": "NONSENSE!!" };
        const expectedOperationHex = "DEADBEEF";

        // WHEN the operation is signed with the wallet.
        const signingResult = Signer.sign(operation, wallet);

        // THEN the signing artifacts are as expected.
        assert.equal(signingResult.getOperationHex(), expectedOperationHex);
        assert.equal(signingResult.getSignatureHex(), fakeSignature);
    })
})
