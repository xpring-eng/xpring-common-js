/* eslint-disable import/max-dependencies -- Protocol buffer construction is verbose */
import { assert } from 'chai'
import * as rippleCodec from 'ripple-binary-codec'

import 'mocha'
import Utils from '../../src/Common/utils'
import { AccountAddress } from '../../src/XRP/generated/org/xrpl/rpc/v1/account_pb'
import {
  CurrencyAmount,
  XRPDropsAmount,
} from '../../src/XRP/generated/org/xrpl/rpc/v1/amount_pb'
import {
  Destination,
  Sequence,
  Account,
  Amount,
} from '../../src/XRP/generated/org/xrpl/rpc/v1/common_pb'
import {
  Payment,
  Transaction,
} from '../../src/XRP/generated/org/xrpl/rpc/v1/transaction_pb'
import Serializer, { TransactionJSON } from '../../src/XRP/serializer'
import Signer from '../../src/XRP/signer'
import XrpUtils from '../../src/XRP/xrp-utils'

import FakeWallet from './fakes/fake-wallet'

describe('signer', function (): void {
  it('sign', function (): void {
    // GIVEN an transaction and a wallet and expected signing artifacts.
    const fakeSignature = 'DEADBEEF'
    const wallet = new FakeWallet(fakeSignature)

    const value = '1000'
    const destinationAddress = 'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc'
    const fee = '10'
    const sequenceNumber = 1
    const account = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'

    const paymentAmount = new XRPDropsAmount()
    paymentAmount.setDrops(value)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(paymentAmount)

    const destinationAccountAddress = new AccountAddress()
    destinationAccountAddress.setAddress(destinationAddress)

    const destination = new Destination()
    destination.setValue(destinationAccountAddress)

    const amount = new Amount()
    amount.setValue(currencyAmount)

    const payment = new Payment()
    payment.setDestination(destination)
    payment.setAmount(amount)

    const transactionFee = new XRPDropsAmount()
    transactionFee.setDrops(fee)

    const senderAccountAddress = new AccountAddress()
    senderAccountAddress.setAddress(account)

    const sender = new Account()
    sender.setValue(senderAccountAddress)

    const sequence = new Sequence()
    sequence.setValue(sequenceNumber)

    const transaction = new Transaction()
    transaction.setAccount(sender)
    transaction.setFee(transactionFee)
    transaction.setSequence(sequence)
    transaction.setPayment(payment)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      transaction,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(transaction, wallet)

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('sign from JSON', function (): void {
    // GIVEN an transaction and a wallet and expected signing artifacts.
    const fakeSignature = 'DEADBEEF'
    const wallet = new FakeWallet(fakeSignature)
    const destinationAddress = XrpUtils.decodeXAddress(
      'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc',
    )
    const sourceAddress = XrpUtils.decodeXAddress(
      'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4',
    )

    const transactionJSON: TransactionJSON = {
      Account: sourceAddress!.address,
      Fee: '10',
      Sequence: 1,
      LastLedgerSequence: 0,
      SigningPubKey: 'BEEFDEAD',
      Amount: '1000',
      Destination: destinationAddress!.address,
      TransactionType: 'Payment',
    }

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = {
      ...transactionJSON,
      TxnSignature: fakeSignature,
    }

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransactionFromJSON(
      transactionJSON,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })
})
