const FakeWallet = require('./fakes/fake-wallet.js');
const { Payment } = require('../generated/Payment_pb.js');
const Signer = require('../signer.js');
const { Transaction } = require('../generated/Transaction_pb.js');
const { XRPAmount } = require('../generated/XRPAmount_pb.js');
const { assert } = require('chai');
const isHex = require('is-hex');

describe('signer', () => {
    it('sign', () => {
        // GIVEN an transaction and a wallet and expected signing artifacts.
        const fakeSignature = "DEADBEEF";
        const wallet = new FakeWallet(fakeSignature);

        const value = 1000;
        const destination = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
        const fee = 10;
        const sequence = 1;
        const account = "r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ";

        const paymentAmount = new XRPAmount();
        paymentAmount.setDrops(value);

        const payment = new Payment();
        payment.setDestination(destination);
        payment.setXrpAmount(paymentAmount);

        const transactionFee = new XRPAmount();
        transactionFee.setDrops(fee);

        const transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setFee(transactionFee);
        transaction.setSequence(sequence);
        transaction.setPayment(payment);

        // WHEN the transaction is signed with the wallet.
        const signedTransaction = Signer.signTransaction(transaction, wallet);

        // THEN the signing artifacts are as expected.
        assert.isTrue(isHex(signedTransaction.getTransactionSignatureHex()));
        assert.isTrue(isHex(signedTransaction.getPublicKeyHex()));

        assert.equal(signedTransaction.getTransactionSignatureHex(), fakeSignature);
        assert.equal(signedTransaction.getPublicKeyHex(), wallet.getPublicKey());

        assert.deepEqual(signedTransaction.getTransaction().toObject(), transaction.toObject());
    })
})
