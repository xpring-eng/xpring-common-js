import FakeWallet from "./fakes/fake-wallet";
import { Payment } from "../generated/payment_pb";
import Signer from "../src/signer";
import { Transaction } from "../generated/transaction_pb";
import { XRPAmount } from "../generated/xrp_amount_pb";
import { assert } from "chai";
import "mocha";

const isHex = require("is-hex");

/* eslint-disable @typescript-eslint/no-non-null-assertion */

describe("signer", function(): void {
  it("sign", function(): void {
    // GIVEN an transaction and a wallet and expected signing artifacts.
    const fakeSignature = "DEADBEEF";
    const wallet = new FakeWallet(fakeSignature);

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

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(transaction, wallet);

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction);

    assert.isTrue(isHex(signedTransaction!.getTransactionSignatureHex()));

    assert.equal(
      signedTransaction!.getTransactionSignatureHex(),
      fakeSignature
    );

    assert.deepEqual(
      signedTransaction!.getTransaction()!.toObject(),
      transaction.toObject()
    );
  });
});
