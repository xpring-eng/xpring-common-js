"use strict";

const { FiatAmount } = require("../generated/FiatAmount_pb.js");
const { Payment } = require("../generated/Payment_pb.js");
const Serializer = require("../src/serializer.js");
const { Transaction } = require("../generated/Transaction_pb.js");
const { XRPAmount } = require("../generated/XRPAmount_pb.js");
const { assert } = require("chai");

describe("serializer", function() {
  it("serializes a payment in XRP", function() {
    // GIVEN a transaction which represents a payment denominated in Fiat.
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
    transactionFee.setDrops(value);

    const transaction = new Transaction();
    transaction.setAccount(account);
    transaction.setFee(transactionFee);
    transaction.setSequence(sequence);
    transaction.setPayment(payment);

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction);

    // THEN the result is as expected.
    const expectedJSON = {
      Account: account,
      Amount: value + "",
      Destination: destination,
      Fee: fee + "",
      Sequence: sequence,
      TransactionType: "Payment"
    };
    assert.deepEqual(serialized, expectedJSON);
  });

  it("serializes a payment in Fiat", function() {
    // GIVEN a transaction which represents a payment denominated in fiat.
    const issuer = "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59";
    const value = "153.75";
    const destination = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
    const fee = 10;
    const sequence = 1;
    const account = "r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ";

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
    const serialized = Serializer.transactionToJSON(transaction);

    // THEN the result is as expected.
    const expectedJSON = {
      Account: account,
      Amount: {
        currency: "USD",
        value: value,
        issuer: issuer
      },
      Destination: destination,
      Fee: fee + "",
      Sequence: sequence,
      TransactionType: "Payment"
    };
    assert.deepEqual(serialized, expectedJSON);
  });
});
