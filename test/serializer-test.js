const { FiatAmount } = require('../generated/FiatAmount_pb.js');
const Serializer = require('../serializer.js')
const { Transaction } = require('../generated/Transaction_pb.js');
const { Payment } = require('../generated/Payment_pb.js');
const { XRPAmount } = require('../generated/XRPAmount_pb.js');
const { assert } = require('chai')


describe('serializer', () => {
    it('serializes payment in XRP', () => {
        // GIVEN a transaction which represents a payment denominated in Fiat.
        const value = 1000;
        const destination = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
        const fee = 10;
        const sequence = 1;
        const account = "r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ"

        const paymentAmount = new XRPAmount();
        paymentAmount.setDrops(value);

        const payment = new Payment();
        payment.setDestination("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh");
        payment.setXrpAmount(paymentAmount);

        const transactionFee = new XRPAmount();
        transactionFee.setDrops(10);

        const transaction = new Transaction();
        transaction.setAccount("r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ");
        transaction.setFee(transactionFee);
        transaction.setSequence(1);
        transaction.setPayment(payment);
        
        // WHEN the transaction is serialized to JSON.
        const serialized = Serializer.serializeTransaction(transaction);

        // THEN the result is as expected.
        const expectedJSON = {
            Account: account,
            Amount: value + "",
            Destination: destination,
            Fee: fee + "",
            Sequence: sequence,
            TransactionType: 'Payment'
        };
        assert.deepEqual(serialized, expectedJSON);
    });

    it('serializes payment in Fiat', () => {
        // GIVEN a transaction which represents a payment denominated in Fiat.
        const issuer = "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59";
        const value = "153.75";
        const destination = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
        const fee = 10;
        const sequence = 1;
        const account = "r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ"

        const paymentAmount = new FiatAmount();
        paymentAmount.setIssuer(issuer);
        paymentAmount.setValue(value);
        paymentAmount.setCurrency(FiatAmount.Currency.USD);

        const payment = new Payment();
        payment.setDestination(destination);
        payment.setFiatAmount(paymentAmount);

        const transactionFee = new XRPAmount();
        transactionFee.setDrops(fee);

        const transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setFee(transactionFee);
        transaction.setSequence(sequence);
        transaction.setPayment(payment);
        
        // WHEN the transaction is serialized to JSON.
        const serialized = Serializer.serializeTransaction(transaction);

        // THEN the result is as expected.
        const expectedJSON = {
            Account: account,
            Amount: {
                "currency": "USD",
                "value": value,
                "issuer": issuer
            },
            Destination: destination,
            Fee: fee + "",
            Sequence: sequence,
            TransactionType: 'Payment',
        };
        assert.deepEqual(serialized, expectedJSON);
    });
});
