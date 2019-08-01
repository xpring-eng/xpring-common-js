const { assert } = require('chai');
const { Signer } = require('../signer.js');
const FakeWallet = require('./fakes/fake-wallet.js');

const testData = {
    transactionJSON: {
        Account: 'r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ',
        Amount: '1000',
        Destination: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
        Fee: '10',
        Flags: 2147483648,
        Sequence: 1,
        TransactionType: 'Payment',
        TxnSignature: '30440220718D264EF05CAED7C781FF6DE298DCAC68D002562C9BF3A07C1' +
            'E721B420C0DAB02203A5A4779EF4D2CCC7BC3EF886676D803A9981B928D3B8ACA483B80' +
            'ECA3CD7B9B',
        Signature: '30440220718D264EF05CAED7C781FF6DE298DCAC68D002562C9BF3A07C1E72' +
            '1B420C0DAB02203A5A4779EF4D2CCC7BC3EF886676D803A9981B928D3B8ACA483B80ECA' +
            '3CD7B9B',
        SigningPubKey:
            'ED5F5AC8B98974A3CA843326D9B88CEBD0560177B973EE0B149F782CFAA06DC66A'
    },
    transactionHex: "53545800120000228000000024000000016140000000000003E868400000000000000A7321ED5F5AC8B98974A3CA843326D9B88CEBD0560177B973EE0B149F782CFAA06DC66A81145B812C9D57731E27A2DA8B1830195F88EF32A3B68314B5F762798A53D543A014CAF8B297CFF8F2F937E8"
}

describe('signer', () => {
    it('sign', () => {
        // GIVEN an operation and a wallet and expected signing artifacts.
        const fakeSignature = "FAKE_SIGNATURE";
        const wallet = new FakeWallet(fakeSignature);
        const operation = testData.transactionJSON;
        const expectedOperationHex = testData.transactionHex;

        // WHEN the operation is signed with the wallet.
        const signingResult = Signer.sign(operation, wallet);

        // THEN the signing artifacts are as expected.
        assert.equal(signingResult.getOperationHex(), expectedOperationHex);
        assert.equal(signingResult.getSignatureHex(), fakeSignature);
    })
})
