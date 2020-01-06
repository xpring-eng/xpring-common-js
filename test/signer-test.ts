import FakeWallet from "./fakes/fake-wallet";
import Signer from "../src/signer";
import { Payment, Transaction } from "../generated/legacy/transaction_pb";
import Utils from "../src/utils";
import { assert } from "chai";
import "mocha";
import { AccountAddress, CurrencyAmount, XRPDropsAmount } from "../generated/legacy/amount_pb";


/* eslint-disable @typescript-eslint/no-non-null-assertion */

describe("signer", function(): void {
  it("sign", function(): void {
    // GIVEN an transaction and a wallet and expected signing artifacts.
    const fakeSignature = "DEADBEEF";
    const wallet = new FakeWallet(fakeSignature);

    const value = 1000;
    const destination = "XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc";
    const fee = 10;
    const sequence = 1;
    const account = "X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4";

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
    sender.setAddress(account)

    const transaction = new Transaction();
    transaction.setAccount(sender);
    transaction.setFee(transactionFee);
    transaction.setSequence(sequence);
    transaction.setPayment(payment);

    // WHEN the transaction is signed with the wallet.
    const signature = Signer.signTransaction(transaction, wallet);

    // THEN the signing artifacts are as expected.
    assert.exists(signature);
    assert.isTrue(Utils.isHex(signature!));
    assert.equal(
      signature,
      fakeSignature
    );
  });
});
