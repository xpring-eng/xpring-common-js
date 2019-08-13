const isHex = require("is-hex");

import FakeWallet from "./fakes/fake-wallet"
import { Payment } from "../generated/Payment_pb"
import Signer from "../src/signer"
import { Transaction } from "../generated/Transaction_pb"
import { XRPAmount } from "../generated/XRPAmount_pb"
import { assert } from 'chai';
import 'mocha';
import { SignedTransaction } from "../generated/SignedTransaction_pb";

describe("signer", function() {
  it("sign", function() {
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
    assert.exists(signedTransaction);

    assert.isTrue(isHex(signedTransaction!.getTransactionSignatureHex()));
    assert.isTrue(isHex(signedTransaction!.getPublicKeyHex()));

    assert.equal(signedTransaction!.getTransactionSignatureHex(), fakeSignature);
    assert.equal(signedTransaction!.getPublicKeyHex(), wallet.getPublicKey());

    assert.deepEqual(
      signedTransaction!.getTransaction()!.toObject(),
      transaction.toObject()
    );
  });
});
