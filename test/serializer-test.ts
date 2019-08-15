import { Currency } from "../generated/Currency_pb";
import { FiatAmount } from "../generated/FiatAmount_pb";
import { Payment } from "../generated/Payment_pb";
import Serializer from "../src/serializer";
import { Transaction } from "../generated/Transaction_pb";
import { XRPAmount } from "../generated/XRPAmount_pb";
import { assert } from "chai";
import "mocha";

describe("serializer", function(): void {
  it("serializes a payment in XRP", function(): void {
    // GIVEN a transaction which represents a payment denominated in Fiat.
    const value = "1000";
    const destination = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
    const fee = "10";
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

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction);

    // THEN the result is as expected.
    const expectedJSON = {
      Account: account,
      Amount: value + "",
      Destination: destination,
      Fee: fee,
      Sequence: sequence,
      TransactionType: "Payment"
    };
    assert.deepEqual(serialized, expectedJSON);
  });

  it("serializes a payment in Fiat", function(): void {
    // GIVEN a transaction which represents a payment denominated in fiat.
    const issuer = "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59";
    const value = "153.75";
    const destination = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
    const fee = "10";
    const sequence = 1;
    const account = "r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ";

    const paymentAmount = new FiatAmount();
    paymentAmount.setIssuer(issuer);
    paymentAmount.setValue(value);
    paymentAmount.setCurrency(Currency.USD);

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
      Fee: fee,
      Sequence: sequence,
      TransactionType: "Payment"
    };
    assert.deepEqual(serialized, expectedJSON);
  });
});
