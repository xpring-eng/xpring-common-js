import FakeWallet from "./fakes/fake-wallet";
import { Payment } from "../generated/legacy/payment_pb";
import Signer from "../src/signer";
import { Transaction } from "../generated/legacy/transaction_pb";
import Utils from "../src/utils";
import { XRPAmount } from "../generated/legacy/xrp_amount_pb";
import { assert } from "chai";
import "mocha";

/* eslint-disable @typescript-eslint/no-non-null-assertion */

describe("signer", function(): void {
  it("sign legacy transaction", function(): void {
    // GIVEN an transaction and a wallet and expected signing artifacts.
    const fakeSignature = "DEADBEEF";
    const wallet = new FakeWallet(fakeSignature);

    const value = "1000";
    const destination = "XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc";
    const fee = "10";
    const sequence = 1;
    const account = "X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4";

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
    const signedTransaction = Signer.signLegacyTransaction(transaction, wallet);

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction);

    assert.isTrue(Utils.isHex(signedTransaction!.getTransactionSignatureHex()));

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
