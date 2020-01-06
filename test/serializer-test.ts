import Serializer from "../src/serializer";
import { AccountAddress, CurrencyAmount, XRPDropsAmount } from "../generated/legacy/amount_pb";
import { Payment, Transaction } from "../generated/legacy/transaction_pb";

import { assert } from "chai";
import "mocha";
import Utils from "../src/utils";

/* eslint-disable @typescript-eslint/no-non-null-assertion */

describe("serializer", function(): void {
  it("serializes a payment in XRP from a classic address", function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const value = 1000;
    const destination = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
    const fee = 10;
    const lastLedgerSequence = 20;
    const sequence = 1;
    const account = "r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ";
    const publicKey =
      "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE";

    const paymentAmount = new XRPDropsAmount();
    paymentAmount.setDrops(value);

    const currencyAmount = new CurrencyAmount();
    currencyAmount.setXrpAmount(paymentAmount);

    const destinationAddress = new AccountAddress();
    destinationAddress.setAddress(destination)

    const payment = new Payment();
    payment.setDestination(destinationAddress);
    payment.setAmount(currencyAmount);

    const transactionFee = new XRPDropsAmount();
    transactionFee.setDrops(fee);

    const sender = new AccountAddress();
    sender.setAddress(account);

    const transaction = new Transaction();
    transaction.setAccount(sender);
    transaction.setFee(transactionFee);
    transaction.setSequence(sequence);
    transaction.setPayment(payment);
    transaction.setSigningPublicKey(Utils.toBytes(publicKey));
    transaction.setLastLedgerSequence(lastLedgerSequence);

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction);

    // THEN the result is as expected.
    const expectedJSON = {
      Account: account,
      Amount: value.toString(),
      Destination: destination,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: "Payment",
      SigningPubKey: publicKey
    };
    assert.deepEqual(serialized, expectedJSON);
  });

  it("serializes a payment in XRP from an X-Address with no tag", function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const value = 1000;
    const destination = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
    const fee = 10;
    const lastLedgerSequence = 20;
    const sequence = 1;
    const account = "XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc";
    const publicKey =
      "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE";

    const paymentAmount = new XRPDropsAmount();
    paymentAmount.setDrops(value);

    const destinationAddress = new AccountAddress();
    destinationAddress.setAddress(destination)

    const currencyAmount = new CurrencyAmount();
    currencyAmount.setXrpAmount(paymentAmount);

    const payment = new Payment();
    payment.setDestination(destinationAddress);
    payment.setAmount(currencyAmount);

    const transactionFee = new XRPDropsAmount();
    transactionFee.setDrops(fee);

    const sender = new AccountAddress();
    sender.setAddress(account);

    const transaction = new Transaction();
    transaction.setAccount(sender);
    transaction.setFee(transactionFee);
    transaction.setSequence(sequence);
    transaction.setPayment(payment);
    transaction.setSigningPublicKey(Utils.toBytes(publicKey));
    transaction.setLastLedgerSequence(lastLedgerSequence);

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction);

    // THEN the result is as expected.
    const expectedJSON = {
      Account: Utils.decodeXAddress(account)!.address,
      Amount: value.toString(),
      Destination: destination,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: "Payment",
      SigningPubKey: publicKey
    };
    assert.deepEqual(serialized, expectedJSON);
  });

  it("fails to serializes a payment in XRP from an X-Address with a tag", function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const value = 1000;
    const destination = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
    const fee = 10;
    const lastLedgerSequence = 20;
    const sequence = 1;
    const account = "XVPcpSm47b1CZkf5AkKM9a84dQHe3mTAxgxfLw2qYoe7Boa";
    const publicKey =
      "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE";

    const paymentAmount = new XRPDropsAmount();
    paymentAmount.setDrops(value);

    const destinationAddress = new AccountAddress();
    destinationAddress.setAddress(destination);

    const currencyAmount = new CurrencyAmount();
    currencyAmount.setXrpAmount(paymentAmount);

    const payment = new Payment();
    payment.setDestination(destinationAddress);
    payment.setAmount(currencyAmount);

    const transactionFee = new XRPDropsAmount();
    transactionFee.setDrops(fee);

    const sender = new AccountAddress();
    sender.setAddress(account)

    const transaction = new Transaction();
    transaction.setAccount(sender);
    transaction.setFee(transactionFee);
    transaction.setSequence(sequence);
    transaction.setPayment(payment);
    transaction.setSigningPublicKey(Utils.toBytes(publicKey));
    transaction.setLastLedgerSequence(lastLedgerSequence);

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction);

    // THEN the result is undefined.
    assert.isUndefined(serialized);
  });

  it("fails to serializes a payment in XRP when account is undefined", function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const value = 1000;
    const destination = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
    const fee = 10;
    const lastLedgerSequence = 20;
    const sequence = 1;
    const publicKey =
      "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE";

    const paymentAmount = new XRPDropsAmount();
    paymentAmount.setDrops(value);

    const currencyAmount = new CurrencyAmount();
    currencyAmount.setXrpAmount(paymentAmount);

    const destinationAddress = new AccountAddress();
    destinationAddress.setAddress(destination)

    const payment = new Payment();
    payment.setDestination(destinationAddress);
    payment.setAmount(currencyAmount);

    const transactionFee = new XRPDropsAmount();
    transactionFee.setDrops(fee);

    const transaction = new Transaction();
    transaction.setFee(transactionFee);
    transaction.setSequence(sequence);
    transaction.setPayment(payment);
    transaction.setSigningPublicKey(Utils.toBytes(publicKey));
    transaction.setLastLedgerSequence(lastLedgerSequence);

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction);

    // THEN the result is undefined.
    assert.isUndefined(serialized);
  });

  it("serializes a payment to an X-address with a tag in XRP", function(): void {
    // GIVEN a transaction which represents a payment to a destination and tag, denominated in XRP.
    const value = 1000;
    const destination = "XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUvtU3HnooQDgBnUpQT";
    const fee = 10;
    const lastLedgerSequence = 20;
    const sequence = 1;
    const account = "r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ";
    const publicKey =
      "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE";


      const sender = new AccountAddress();
      sender.setAddress(account);

    const paymentAmount = new XRPDropsAmount();
    paymentAmount.setDrops(value);

    const destinationAddress = new AccountAddress();
    destinationAddress.setAddress(destination)

    const currencyAmount = new CurrencyAmount();
    currencyAmount.setXrpAmount(paymentAmount);

    const payment = new Payment();
    payment.setDestination(destinationAddress);
    payment.setAmount(currencyAmount);

    const transactionFee = new XRPDropsAmount();
    transactionFee.setDrops(fee);

    const transaction = new Transaction();
    transaction.setAccount(sender);
    transaction.setFee(transactionFee);
    transaction.setSequence(sequence);
    transaction.setPayment(payment);
    transaction.setSigningPublicKey(Utils.toBytes(publicKey));
    transaction.setLastLedgerSequence(lastLedgerSequence);

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction);

    // THEN the result is as expected.
    const expectedJSON = {
      Account: account,
      Amount: value.toString(),
      Destination: "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1",
      DestinationTag: 12345,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: "Payment",
      SigningPubKey: publicKey
    };
    assert.deepEqual(serialized, expectedJSON);
  });

  it("serializes a payment to an X-address without a tag in XRP", function(): void {
    // GIVEN a transaction which represents a payment to a destination without a tag, denominated in XRP.
    const value = 1000;
    const destination = "XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUFyQVMzRrMGUZpokKH";
    const fee = 10;
    const lastLedgerSequence = 20;
    const sequence = 1;
    const account = "r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ";
    const publicKey =
      "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE";

    const paymentAmount = new XRPDropsAmount();
    paymentAmount.setDrops(value);

    const destinationAddress = new AccountAddress();
    destinationAddress.setAddress(destination)

    const currencyAmount = new CurrencyAmount();
    currencyAmount.setXrpAmount(paymentAmount);

    const payment = new Payment();
    payment.setDestination(destinationAddress);
    payment.setAmount(currencyAmount);

    const transactionFee = new XRPDropsAmount();
    transactionFee.setDrops(fee);

    const sender = new AccountAddress();
    sender.setAddress(account);

    const transaction = new Transaction();
    transaction.setAccount(sender);
    transaction.setFee(transactionFee);
    transaction.setSequence(sequence);
    transaction.setPayment(payment);
    transaction.setSigningPublicKey(Utils.toBytes(publicKey));
    transaction.setLastLedgerSequence(lastLedgerSequence);

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction);

    // THEN the result is as expected.
    const expectedJSON = {
      Account: account,
      Amount: value.toString(),
      Destination: "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1",
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: "Payment",
      SigningPubKey: publicKey
    };
    assert.deepEqual(serialized, expectedJSON);
  });
});
