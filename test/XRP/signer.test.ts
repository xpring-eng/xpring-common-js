import { assert } from 'chai'
import * as rippleCodec from 'ripple-binary-codec'

import 'mocha'
import Utils from '../../src/Common/utils'
import Serializer, { TransactionJSON } from '../../src/XRP/serializer'
import Signer from '../../src/XRP/signer'
import XrpUtils from '../../src/XRP/xrp-utils'

import FakeWallet from './fakes/fake-wallet'
import {
  fakeSignature,
  testPaymentTransactionMandatoryFields,
  testPaymentTransactionAllFields,
} from './fakes/fake-xrp-protobufs'

describe('Signer', function (): void {
  it('Sign Payment transaction with mandatory fields', function (): void {
    // GIVEN a Payment transaction, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)
    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testPaymentTransactionMandatoryFields,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testPaymentTransactionMandatoryFields,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign Payment transaction with all fields', function (): void {
    // GIVEN a Payment transaction, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testPaymentTransactionAllFields,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testPaymentTransactionAllFields,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('sign from JSON', function (): void {
    // GIVEN a transaction, a wallet and expected signing artifacts.
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
