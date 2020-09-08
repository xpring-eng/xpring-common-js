/* eslint-disable max-statements -- Allow many statements per test function. */
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
  DestinationTag,
  InvoiceID,
  DeliverMin,
  SendMax,
} from '../../src/XRP/generated/org/xrpl/rpc/v1/common_pb'
import {
  Payment,
  Transaction,
} from '../../src/XRP/generated/org/xrpl/rpc/v1/transaction_pb'
import Serializer, { TransactionJSON } from '../../src/XRP/serializer'
import Signer from '../../src/XRP/signer'
import XrpUtils from '../../src/XRP/xrp-utils'

import FakeWallet from './fakes/fake-wallet'
import xrpTestUtils from './helpers/xrp-test-utils'

describe('Signer', function (): void {
  it('Sign Payment transaction with mandatory fields', function (): void {
    // GIVEN a Payment transaction, a wallet and expected signing artifacts.
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

  it('Sign Payment transaction with all fields', function (): void {
    // GIVEN a Payment transaction, a wallet and expected signing artifacts.
    const fakeSignature = 'DEADBEEF'
    const wallet = new FakeWallet(fakeSignature)

    const value = '1000'
    const destinationAddress = 'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc'
    const fee = '10'
    const sequenceNumber = 1
    const account = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'
    const destinationTagValue = 4
    // invoiceId value should be either a base64 string or a 32-byte array representing 64 hex chars (256 bits)
    const invoiceIdValue = 'ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0='
    const deliverMinValue = '10'
    const sendMaxValue = '13'

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

    const destinationTag = new DestinationTag()
    destinationTag.setValue(destinationTagValue)

    const invoiceId = new InvoiceID()
    invoiceId.setValue(invoiceIdValue)

    const deliverMin = new DeliverMin()
    deliverMin.setValue(xrpTestUtils.makeXrpCurrencyAmount(deliverMinValue))

    const sendMax = new SendMax()
    sendMax.setValue(xrpTestUtils.makeXrpCurrencyAmount(sendMaxValue))

    const path1Element1 = xrpTestUtils.makePathElement(
      xrpTestUtils.makeAccountAddress('rQ3fNyLjbvcDaPNS4EAJY8aT9zR3uGk17c'),
      new Uint8Array([1, 2, 3, 4, 5]),
      xrpTestUtils.makeAccountAddress('r4L6ZLHkTytPqDR81H1ysCr6qGv9oJJAKi'),
    )
    const path1Element2 = xrpTestUtils.makePathElement(
      xrpTestUtils.makeAccountAddress('rBM3QGATGQHRCBU8KtAvNvSHZrbJhMhWxA'),
      new Uint8Array([4, 5, 6, 7, 8]),
      xrpTestUtils.makeAccountAddress('r4L6ZLHkTytPqDR81H1ysCr6qGv9oJJAKi'),
    )

    const path1 = new Payment.Path()
    path1.addElements(path1Element1)
    path1.addElements(path1Element2)

    const path2Element1 = xrpTestUtils.makePathElement(
      xrpTestUtils.makeAccountAddress('rQ3fNyLjbvcDaPNS4EAJY8aT9zR3uGk17c'),
      new Uint8Array([7, 8, 9, 10, 11]),
      xrpTestUtils.makeAccountAddress('rBM3QGATGQHRCBU8KtAvNvSHZrbJhMhWxA'),
    )

    const path2 = new Payment.Path()
    path2.addElements(path2Element1)

    const pathList = [path1, path2]
    const payment = new Payment()
    payment.setDestination(destination)
    payment.setAmount(amount)
    payment.setDestinationTag(destinationTag)
    payment.setInvoiceId(invoiceId)
    payment.setDeliverMin(deliverMin)
    payment.setSendMax(sendMax)
    payment.setPathsList(pathList)

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
    // GIVEN a transaction, a wallet and expected signing artifacts.
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
