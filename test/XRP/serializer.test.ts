/* eslint-disable max-statements --
 * Allow many statements per test function.
 */
/* eslint-disable  max-lines --
 * Allow many lines of tests.
 * TODO(amiecorso): Remove these if hbergren@ agrees to disable this rule for tests globally.
 */

import 'mocha'

import { assert } from 'chai'

import Utils from '../../src/Common/utils'
import { AccountAddress } from '../../src/XRP/generated/org/xrpl/rpc/v1/account_pb'
import {
  CurrencyAmount,
  Currency,
  IssuedCurrencyAmount,
} from '../../src/XRP/generated/org/xrpl/rpc/v1/amount_pb'
import {
  Account,
  Amount,
  CheckID,
  DeliverMin,
  Destination,
  Domain,
  MemoData,
  MemoFormat,
  MemoType,
  Sequence,
  SigningPublicKey,
  Authorize,
  Unauthorize,
  ClearFlag,
  EmailHash,
  MessageKey,
  SetFlag,
  TransferRate,
  TickSize,
  LastLedgerSequence,
  DestinationTag,
  InvoiceID,
  SendMax,
  TransactionSignature,
  Expiration,
  TakerGets,
  TakerPays,
  OfferSequence,
  Owner,
  Condition,
  CancelAfter,
  FinishAfter,
  Channel,
  SignerQuorum,
  RegularKey,
  SettleDelay,
  PaymentChannelSignature,
  PublicKey,
  Balance,
  Fulfillment,
  SignerWeight,
  QualityIn,
  QualityOut,
  LimitAmount,
  SignerEntry,
} from '../../src/XRP/generated/org/xrpl/rpc/v1/common_pb'
import {
  Memo,
  Payment,
  DepositPreauth,
  AccountDelete,
  CheckCancel,
  CheckCash,
  CheckCreate,
  OfferCreate,
  EscrowCancel,
  EscrowCreate,
  EscrowFinish,
  OfferCancel,
  SignerListSet,
  PaymentChannelClaim,
  PaymentChannelCreate,
  PaymentChannelFund,
  SetRegularKey,
  TrustSet,
} from '../../src/XRP/generated/org/xrpl/rpc/v1/transaction_pb'
import Serializer, {
  CheckCreateJSON,
  EscrowCancelJSON,
  EscrowCreateJSON,
  EscrowFinishJSON,
  AccountSetJSON,
  DepositPreauthJSON,
  TransactionJSON,
  OfferCreateJSON,
  PaymentJSON,
  SignerListSetJSON,
  PaymentChannelClaimJSON,
  PaymentChannelCreateJSON,
  PaymentChannelFundJSON,
  AccountDeleteJSON,
  CheckCancelJSON,
  CheckCashJSON,
  OfferCancelJSON,
  SetRegularKeyJSON,
  TrustSetJSON,
} from '../../src/XRP/serializer'
import XrpUtils from '../../src/XRP/xrp-utils'

import xrpTestUtils from './helpers/xrp-test-utils'

/** Constants for transactions. */
const value = '1000'
const destinationClassicAddress = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
const destinationXAddressWithoutTag =
  'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc'
const destinationXAddressWithTag =
  'XVPcpSm47b1CZkf5AkKM9a84dQHe3mTAxgxfLw2qYoe7Boa'
const tag = 12345
const sequenceValue = 1
const lastLedgerSequenceValue = 20
const publicKeyHex =
  '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE'
const fee = '10'
const accountClassicAddress = 'r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ'
const accountXAddress = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'
const dataForMemo = Utils.toBytes('I forgot to pick up Carl...')
const typeForMemo = Utils.toBytes('meme')
const formatForMemo = Utils.toBytes('jaypeg')
const offerSequenceNumber = 1234

const testAccountAddress = xrpTestUtils.makeAccountAddress(
  destinationClassicAddress,
)

describe('serializer', function (): void {
  it('serializes a payment in XRP from a classic address', function (): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = xrpTestUtils.makePaymentTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
      accountClassicAddress,
      publicKeyHex,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON: TransactionJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequenceValue,
      Sequence: sequenceValue,
      TransactionType: 'Payment',
      SigningPubKey: publicKeyHex,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes a payment in XRP from an X-Address with no tag', function (): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = xrpTestUtils.makePaymentTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
      accountXAddress,
      publicKeyHex,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON: TransactionJSON = {
      Account: XrpUtils.decodeXAddress(accountXAddress)!.address,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequenceValue,
      Sequence: sequenceValue,
      TransactionType: 'Payment',
      SigningPubKey: publicKeyHex,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('fails to serializes a payment in XRP from an X-Address with a tag', function (): void {
    // GIVEN a transaction which represents a payment denominated in XRP from a sender with a tag.
    const account = XrpUtils.encodeXAddress(accountClassicAddress, tag)
    const transaction = xrpTestUtils.makePaymentTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
      account,
      publicKeyHex,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('fails to serializes a payment in XRP when account is undefined', function (): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = xrpTestUtils.makePaymentTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
      undefined,
      publicKeyHex,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('serializes a payment to an X-address with a tag in XRP', function (): void {
    // GIVEN a transaction which represents a payment to a destination and tag, denominated in XRP.
    const transaction = xrpTestUtils.makePaymentTransaction(
      value,
      destinationXAddressWithTag,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
      accountClassicAddress,
      publicKeyHex,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON: TransactionJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationXAddressWithTag,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequenceValue,
      Sequence: sequenceValue,
      TransactionType: 'Payment',
      SigningPubKey: publicKeyHex,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes a payment to an X-address without a tag in XRP', function (): void {
    // GIVEN a transaction which represents a payment to a destination without a tag, denominated in XRP.
    const transaction = xrpTestUtils.makePaymentTransaction(
      value,
      destinationXAddressWithoutTag,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
      accountClassicAddress,
      publicKeyHex,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON: TransactionJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationXAddressWithoutTag,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequenceValue,
      Sequence: sequenceValue,
      TransactionType: 'Payment',
      SigningPubKey: publicKeyHex,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes a payment with a memo', function (): void {
    // GIVEN a transaction which represents a payment to a destination without a tag, denominated in XRP, with a dank
    // meme for a memo
    const transaction = xrpTestUtils.makePaymentTransaction(
      value,
      destinationXAddressWithoutTag,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
      accountClassicAddress,
      publicKeyHex,
    )

    const memo = new Memo()
    const memoData = new MemoData()
    memoData.setValue(dataForMemo)
    memo.setMemoData(memoData)
    const memoType = new MemoType()
    memoType.setValue(typeForMemo)
    memo.setMemoType(memoType)
    const memoFormat = new MemoFormat()
    memoFormat.setValue(formatForMemo)
    memo.setMemoFormat(memoFormat)

    transaction.setMemosList([memo])

    // WHEN the meme'd transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result still has the meme as expected.
    const expectedJSON: TransactionJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationXAddressWithoutTag,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequenceValue,
      Sequence: sequenceValue,
      TransactionType: 'Payment',
      SigningPubKey: publicKeyHex,
      Memos: [
        {
          Memo: {
            MemoData: Utils.toHex(dataForMemo),
            MemoType: Utils.toHex(typeForMemo),
            MemoFormat: Utils.toHex(formatForMemo),
          },
        },
      ],
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes empty or blank memo arrays or objects to undefined', function (): void {
    assert.isUndefined(Serializer.memosToJSON([]))
  })

  it('serializes both memos with empty fields and complete fields correctly', function (): void {
    const memo = new Memo()
    const memoData = new MemoData()
    memoData.setValue(dataForMemo)
    memo.setMemoData(memoData)
    const memoType = new MemoType()
    memoType.setValue(typeForMemo)
    memo.setMemoType(memoType)
    const memoFormat = new MemoFormat()
    memoFormat.setValue(formatForMemo)
    memo.setMemoFormat(memoFormat)

    const expectedJSON = {
      Memo: {
        MemoData: Utils.toHex(dataForMemo),
        MemoType: Utils.toHex(typeForMemo),
        MemoFormat: Utils.toHex(formatForMemo),
      },
    }

    assert.deepEqual(Serializer.memoToJSON(memo), expectedJSON)

    const emptyMemo = new Memo()

    const expectedEmptyJSON = {
      Memo: {
        MemoData: undefined,
        MemoType: undefined,
        MemoFormat: undefined,
      },
    }

    assert.deepEqual(Serializer.memoToJSON(emptyMemo), expectedEmptyJSON)
  })

  it('serializes an authorize DepositPreauth correctly', function (): void {
    // GIVEN a DepositPreauth protocol buffer representing an authorization.
    const address = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'

    const accountAddress = new AccountAddress()
    accountAddress.setAddress(address)

    const authorize = new Authorize()
    authorize.setValue(accountAddress)

    const depositPreauth = new DepositPreauth()
    depositPreauth.setAuthorize(authorize)

    const expectedJSON: DepositPreauthJSON = {
      Authorize: address,
      TransactionType: 'DepositPreauth',
    }

    // WHEN it is serialized.
    const serialized = Serializer.depositPreauthToJSON(depositPreauth)

    // THEN the protocol buffer is serialized as expected.
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes an unauthorize DepositPreauth correctly', function (): void {
    // GIVEN a DepositPreauth protocol buffer representing an unauthorization.
    const address = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'

    const accountAddress = new AccountAddress()
    accountAddress.setAddress(address)

    const unauthorize = new Unauthorize()
    unauthorize.setValue(accountAddress)

    const depositPreauth = new DepositPreauth()
    depositPreauth.setUnauthorize(unauthorize)

    const expectedJSON: DepositPreauthJSON = {
      TransactionType: 'DepositPreauth',
      Unauthorize: address,
    }

    // WHEN it is serialized.
    const serialized = Serializer.depositPreauthToJSON(depositPreauth)

    // THEN the protocol buffer is serialized as expected.
    assert.deepEqual(serialized, expectedJSON)
  })

  it('fails to serialize a malformed DepositPreauth', function (): void {
    // GIVEN a DepositPreauth protocol buffer which has no operation set
    const depositPreauth = new DepositPreauth()

    // WHEN it is serialized.
    const serialized = Serializer.depositPreauthToJSON(depositPreauth)

    // THEN the result is undefined
    assert.isUndefined(serialized)
  })

  it('serializes a transaction representing a well formed DepositPreAuth', function (): void {
    // GIVEN a transaction representing a well formed DepositPreauth.
    const address = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
    const transaction = xrpTestUtils.makeDepositPreauth(
      address,
      undefined,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
      accountClassicAddress,
      publicKeyHex,
    )

    // WHEN the transaction is serialized THEN the result exists.
    assert.exists(Serializer.transactionToJSON(transaction))
  })

  it('serializes a transaction representing a malformed DepositPreAuth', function (): void {
    // GIVEN a transaction representing a malformed DepositPreauth.
    // Neither `authorizeAddress` or `unauthorizeAddress` are defined which creates a malformed transaction.
    const transaction = xrpTestUtils.makeDepositPreauth(
      undefined,
      undefined,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
      accountClassicAddress,
      publicKeyHex,
    )

    // WHEN the transaction is serialized THEN the result is undefined.
    assert.isUndefined(Serializer.transactionToJSON(transaction))
  })

  it('serializes an AccountSet with no fields set', function (): void {
    // GIVEN an AccountSet with no fields set.
    const accountSet = xrpTestUtils.makeAccountSet(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    )
    const expectedJSON: AccountSetJSON = {
      TransactionType: 'AccountSet',
    }

    // WHEN it is serialized.
    const serialized = Serializer.accountSetToJSON(accountSet)

    // THEN the result is as expected.
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes an AccountSet with all fields set', function (): void {
    // GIVEN an AccountSet with no fields set.
    // Note: All constants are arbitrarily chosen but unique.
    const clearFlagValue = 0
    const domainValue = 'domain'
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Magic numbers are an arbitrary byte array. */
    const emailHashValue = new Uint8Array([0, 1, 2, 3])
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Magic numbers are an arbitrary byte array. */
    const messageKeyValue = new Uint8Array([4, 5, 6, 7])
    const setFlagValue = 1
    const transferRateValue = 2
    const tickSizeValue = 3
    const accountSet = xrpTestUtils.makeAccountSet(
      clearFlagValue,
      domainValue,
      emailHashValue,
      messageKeyValue,
      setFlagValue,
      transferRateValue,
      tickSizeValue,
    )

    const expectedJSON: AccountSetJSON = {
      ClearFlag: clearFlagValue,
      Domain: domainValue,
      EmailHash: Utils.toHex(emailHashValue),
      MessageKey: Utils.toHex(messageKeyValue),
      SetFlag: setFlagValue,
      TransactionType: 'AccountSet',
      TransferRate: transferRateValue,
      TickSize: tickSizeValue,
    }

    // WHEN it is serialized.
    const serialized = Serializer.accountSetToJSON(accountSet)

    // THEN the result is as expected.
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes an AccountSet Transaction', function (): void {
    // GIVEN an AccountSet with no fields set.
    const transaction = xrpTestUtils.makeAccountSetTransaction(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
      accountClassicAddress,
      publicKeyHex,
    )

    // WHEN the transaction is serialized THEN the result exists.
    assert.exists(Serializer.transactionToJSON(transaction))
  })

  it('serializes a PathElement with account', function (): void {
    // GIVEN a PathElement with an account set.
    const pathElement = xrpTestUtils.makePathElement(
      testAccountAddress,
      undefined,
      undefined,
    )

    // WHEN the PathElement is serialized.
    const serialized = Serializer.pathElementToJSON(pathElement)

    // THEN the account is set.
    assert.equal(serialized.account, testAccountAddress.getAddress())

    // AND the currency and issuer fields are undefined.
    assert.isUndefined(serialized.currencyCode)
    assert.isUndefined(serialized.issuer)
  })

  it('serializes a PathElement with issued currency', function (): void {
    // GIVEN a PathElement with a currency code and an issuer.
    const currencyCode = new Uint8Array([0, 1, 2, 3])
    const pathElement = xrpTestUtils.makePathElement(
      undefined,
      currencyCode,
      testAccountAddress,
    )

    // WHEN the PathElement is serialized.
    const serialized = Serializer.pathElementToJSON(pathElement)

    // THEN the currency and issuer fields are set.
    assert.deepEqual(serialized.currencyCode, Utils.toHex(currencyCode))
    assert.equal(serialized.issuer, testAccountAddress.getAddress())

    // AND the account is undefined.
    assert.isUndefined(serialized.account)
  })

  it('serializes a Path with no elements.', function (): void {
    // GIVEN a Path with no elements.
    const path = new Payment.Path()

    // WHEN it is serialized.
    const serialized = Serializer.pathToJSON(path)

    // THEN the result is an empty JSON array.
    assert.deepEqual(serialized, [])
  })

  it('serializes a Path with multiple elements.', function (): void {
    // GIVEN a Path with two elements.
    const pathElement1 = xrpTestUtils.makePathElement(
      testAccountAddress,
      undefined,
      undefined,
    )

    const currencyCode = new Uint8Array([0, 1, 2, 3])
    const pathElement2 = xrpTestUtils.makePathElement(
      undefined,
      currencyCode,
      testAccountAddress,
    )

    const path = new Payment.Path()
    path.addElements(pathElement1)
    path.addElements(pathElement2)

    // WHEN it is serialized.
    const serialized = Serializer.pathToJSON(path)

    // THEN the result is the serialized array of the input elements.
    assert.equal(serialized.length, 2)
    assert.deepEqual(serialized[0], Serializer.pathElementToJSON(pathElement1))
    assert.deepEqual(serialized[1], Serializer.pathElementToJSON(pathElement2))
  })

  it('serializes an Issued Currency - valid currency', function (): void {
    // GIVEN an IssuedCurrencyAmount.
    const currency = new Currency()
    currency.setName('USD')

    const issuedCurrency = xrpTestUtils.makeIssuedCurrencyAmount(
      testAccountAddress,
      value,
      currency,
    )

    // WHEN it is serialized.
    const serialized = Serializer.issuedCurrencyAmountToJSON(issuedCurrency)

    // THEN the issuer and the value are the same as the inputs.
    assert.equal(serialized?.issuer, testAccountAddress.getAddress())
    assert.equal(serialized?.value, value)

    // AND the currency is the serialized version of the input.
    assert.deepEqual(serialized?.currency, Serializer.currencyToJSON(currency))
  })

  it('serializes an Issued Currency - missing inputs', function (): void {
    // GIVEN an IssuedCurrencyAmount with missing inputs.
    const issuedCurrency = new IssuedCurrencyAmount()

    // WHEN it is serialized.
    const serialized = Serializer.issuedCurrencyAmountToJSON(issuedCurrency)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('serializes an Issued Currency - malformed currency', function (): void {
    // GIVEN an IssuedCurrencyAmount with a malformed Currency.
    const currency = new Currency()

    const issuedCurrency = xrpTestUtils.makeIssuedCurrencyAmount(
      testAccountAddress,
      value,
      currency,
    )

    // WHEN it is serialized.
    const serialized = Serializer.issuedCurrencyAmountToJSON(issuedCurrency)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('serializes an Issued Currency - no value', function (): void {
    // GIVEN an IssuedCurrencyAmount with no value set.
    const currency = new Currency()
    currency.setName('USD')

    const issuedCurrency = new IssuedCurrencyAmount()
    issuedCurrency.setIssuer(testAccountAddress)
    issuedCurrency.setCurrency(currency)

    // WHEN it is serialized.
    const serialized = Serializer.issuedCurrencyAmountToJSON(issuedCurrency)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a Currency with a name field set', function (): void {
    // GIVEN a Currency with a name field set.
    const currencyName = 'USD'
    const currency = new Currency()
    currency.setName(currencyName)

    // WHEN it is serialized.
    const serialized = Serializer.currencyToJSON(currency)

    // THEN the outputs are the inputs.
    assert.equal(serialized, currencyName)
  })

  it('Serializes a Currency with a code field set', function (): void {
    // GIVEN a Currency with a code field set.
    const currencyCode = new Uint8Array([1, 2, 3, 4])

    const currency = new Currency()
    currency.setCode(currencyCode)

    // WHEN it is serialized.
    const serialized = Serializer.currencyToJSON(currency)

    // THEN the outputs are the inputs.
    assert.equal(serialized, Utils.toHex(currencyCode))
  })

  it('Serializes a Currency with no fields set', function (): void {
    // GIVEN a Currency with no fields set.
    const currency = new Currency()

    // WHEN it is serialized THEN the result is undefined.
    assert.isUndefined(Serializer.currencyToJSON(currency))
  })

  it('Serializes an AccountAddress', function (): void {
    // GIVEN an AccountAddress.
    const address = 'r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ'
    const accountAddress = new AccountAddress()
    accountAddress.setAddress(address)

    // WHEN it is serialized.
    const serialized = Serializer.accountAddressToJSON(accountAddress)

    // THEN the serialized representation is the same as the input.
    assert.equal(serialized, address)
  })

  it('Serializes a Sequence', function (): void {
    // GIVEN a Sequence.
    const sequence = new Sequence()
    sequence.setValue(sequenceValue)

    // WHEN it is serialized
    const serialized = Serializer.sequenceToJSON(sequence)

    // THEN the result is the same as the input.
    assert.deepEqual(serialized, sequenceValue)
  })

  it('Serializes a LastLedgerSequence', function (): void {
    // GIVEN a LastLedgerSequence.
    const lastLedgerSequence = new LastLedgerSequence()
    lastLedgerSequence.setValue(lastLedgerSequenceValue)

    // WHEN it is serialized
    const serialized = Serializer.lastLedgerSequenceToJSON(lastLedgerSequence)

    // THEN the result is the same as the input.
    assert.deepEqual(serialized, lastLedgerSequenceValue)
  })

  it('Serializes a ClearFlag', function (): void {
    // GIVEN a ClearFlag.
    const flagValues = 1

    const clearFlag = new ClearFlag()
    clearFlag.setValue(flagValues)

    // WHEN it is serialized
    const serialized = Serializer.clearFlagToJSON(clearFlag)

    // THEN the result is the input.
    assert.equal(serialized, flagValues)
  })

  it('Serializes an EmailHash', function (): void {
    // GIVEN an EmailHash.
    const emailHashBytes = new Uint8Array([1, 2, 3, 4])

    const emailHash = new EmailHash()
    emailHash.setValue(emailHashBytes)

    // WHEN it is serialized.
    const serialized = Serializer.emailHashToJSON(emailHash)

    // THEN the result is the same as the input bytes encoded to hex.
    assert.deepEqual(serialized, Utils.toHex(emailHashBytes))
  })

  it('Serializes a SetFlag', function (): void {
    // GIVEN a SetFlag.
    const setFlagValue = 1

    const setFlag = new SetFlag()
    setFlag.setValue(setFlagValue)

    // WHEN it is serialized
    const serialized = Serializer.setFlagToJSON(setFlag)

    // THEN the result is the same as the input.
    assert.deepEqual(serialized, setFlagValue)
  })

  it('Serializes a TickSize', function (): void {
    // GIVEN a TickSize.
    const tickSizeValue = 1

    const tickSize = new TickSize()
    tickSize.setValue(tickSizeValue)

    // WHEN it is serialized
    const serialized = Serializer.tickSizeToJSON(tickSize)

    // THEN the result is the same as the input.
    assert.deepEqual(serialized, tickSizeValue)
  })

  it('Serializes a DestinationTag', function (): void {
    // GIVEN a DestinationTag.
    const destinationTagValue = 123

    const destinationTag = new DestinationTag()
    destinationTag.setValue(destinationTagValue)

    // WHEN it is serialized.
    const serialized = Serializer.destinationTagToJSON(destinationTag)

    // THEN the result is the same as the input.
    assert.equal(serialized, destinationTagValue)
  })

  it('Serializes a TransferRate', function (): void {
    // GIVEN a TransferRate.
    const transferRateValue = 1

    const transferRate = new TransferRate()
    transferRate.setValue(transferRateValue)

    // WHEN it is serialized
    const serialized = Serializer.transferRateToJSON(transferRate)

    // THEN the result is the same as the input.
    assert.deepEqual(serialized, transferRateValue)
  })

  it('Serializes a Domain', function (): void {
    // GIVEN a Domain
    const domainValue = 'https://xpring.io'

    const domain = new Domain()
    domain.setValue(domainValue)

    // WHEN it is serialized
    const serialized = Serializer.domainToJSON(domain)

    // THEN the result is the same as the inputs.
    assert.equal(serialized, domainValue)
  })

  it('Serializes a MessageKey', function (): void {
    // GIVEN a MessageKey.
    const messageKeyBytes = new Uint8Array([1, 2, 3, 4])

    const messageKey = new MessageKey()
    messageKey.setValue(messageKeyBytes)

    // WHEN it is serialized
    const serialized = Serializer.messageKeyToJSON(messageKey)

    // THEN the result is the same as the input bytes encoded to hex.
    assert.deepEqual(serialized, Utils.toHex(messageKeyBytes))
  })

  it('Serializes an InvoiceId', function (): void {
    // GIVEN a InvoiceId with some bytes
    const invoiceIdBytes = new Uint8Array([0, 1, 2, 3])

    const invoiceId = new InvoiceID()
    invoiceId.setValue(invoiceIdBytes)

    // WHEN it is serialized
    const serialized = Serializer.invoiceIdToJSON(invoiceId)

    // THEN the result is the hex representation of the invoiceId.
    assert.equal(serialized, Utils.toHex(invoiceIdBytes))
  })

  it('Serializes a CurrencyAmount with an XRPDropsAmount', function (): void {
    // GIVEN an CurrencyAmount with an XRPDropsAmount.
    const dropsValue = '123'
    const xrpDropsAmount = xrpTestUtils.makeXrpDropsAmount(dropsValue)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    // WHEN it is serialized.
    const serialized = Serializer.currencyAmountToJSON(currencyAmount)

    // THEN the result is the drops.
    assert.equal(serialized, dropsValue)
  })

  it('Serializes a CurrencyAmount with an IssuedCurrencyAmount', function (): void {
    // GIVEN an CurrencyAmount with an IssuedCurrencyAmount.
    const currency = new Currency()
    currency.setName('USD')

    const issuedCurrencyAmount = xrpTestUtils.makeIssuedCurrencyAmount(
      testAccountAddress,
      value,
      currency,
    )

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setIssuedCurrencyAmount(issuedCurrencyAmount)

    // WHEN it is serialized.
    const serialized = Serializer.currencyAmountToJSON(currencyAmount)

    // THEN the result is the serialized value of the input.
    assert.deepEqual(
      serialized,
      Serializer.issuedCurrencyAmountToJSON(issuedCurrencyAmount),
    )
  })

  it('Fails to serialize a malformed CurrencyAmount', function (): void {
    // GIVEN an CurrencyAmount with no fields set.
    const currencyAmount = new CurrencyAmount()

    // WHEN it is serialized.
    const serialized = Serializer.currencyAmountToJSON(currencyAmount)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a TransactionSignature', function (): void {
    // GIVEN a TransactionSignature with some bytes
    const transactionSignatureBytes = new Uint8Array([0, 1, 2, 3])

    const transactionSignature = new TransactionSignature()
    transactionSignature.setValue(transactionSignatureBytes)

    // WHEN it is serialized
    const serialized = Serializer.transactionSignatureToJSON(
      transactionSignature,
    )

    // THEN the result is the hex representation of the invoiceId.
    assert.equal(serialized, Utils.toHex(transactionSignatureBytes))
  })

  it('Serializes a SigningPublicKey', function (): void {
    // GIVEN a SigningPublicKey with some bytes
    const signingPublicKeyBytes = new Uint8Array([0, 1, 2, 3])

    const signingPublicKey = new SigningPublicKey()
    signingPublicKey.setValue(signingPublicKeyBytes)

    // WHEN it is serialized
    const serialized = Serializer.signingPublicKeyToJSON(signingPublicKey)

    // THEN the result is the hex representation of the bytes.
    assert.equal(serialized, Utils.toHex(signingPublicKeyBytes))
  })

  it('Serializes an Account', function (): void {
    // GIVEN an Account wrapping an address
    const account = new Account()
    account.setValue(testAccountAddress)

    // WHEN it is serialized.
    const serialized = Serializer.accountToJSON(account)

    // THEN the result is the address
    assert.equal(serialized, testAccountAddress.getAddress())
  })

  it('Fails to serialize an  Account with no AccountAddress', function (): void {
    // GIVEN an empty Account.
    const account = new Account()

    // WHEN it is serialized.
    const serialized = Serializer.accountToJSON(account)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes an Amount with a CurrencyAmount', function (): void {
    // GIVEN an Amount wrapping a CurrencyAmount.
    const dropsValue = '123'
    const xrpDropsAmount = xrpTestUtils.makeXrpDropsAmount(dropsValue)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    const amount = new Amount()
    amount.setValue(currencyAmount)

    // WHEN it is serialized.
    const serialized = Serializer.amountToJSON(amount)

    // THEN the result is the serialized CurrencyAmount.
    assert.equal(serialized, Serializer.currencyAmountToJSON(currencyAmount))
  })

  it('Serializes a MemoData', function (): void {
    // GIVEN a MemoData with some bytes
    const memoDataBytes = new Uint8Array([0, 1, 2, 3])

    const memoData = new MemoData()
    memoData.setValue(memoDataBytes)

    // WHEN it is serialized
    const serialized = Serializer.memoDataToJSON(memoData)

    // THEN the result is the hex representation of the bytes.
    assert.equal(serialized, Utils.toHex(memoDataBytes))
  })

  it('Serializes an MemoType', function (): void {
    // GIVEN a MemoType with some bytes
    const memoTypeBytes = new Uint8Array([0, 1, 2, 3])

    const memoType = new MemoType()
    memoType.setValue(memoTypeBytes)

    // WHEN it is serialized
    const serialized = Serializer.memoDataToJSON(memoType)

    // THEN the result is the hex representation of the bytes.
    assert.equal(serialized, Utils.toHex(memoTypeBytes))
  })

  it('Serializes an MemoFormat', function (): void {
    // GIVEN a MemoFormat with some bytes
    const memoFormatBytes = new Uint8Array([0, 1, 2, 3])

    const memoFormat = new MemoFormat()
    memoFormat.setValue(memoFormatBytes)

    // WHEN it is serialized
    const serialized = Serializer.memoDataToJSON(memoFormat)

    // THEN the result is the hex representation of the bytes.
    assert.equal(serialized, Utils.toHex(memoFormatBytes))
  })

  it('Serializes a Destination', function (): void {
    // GIVEN a Destination
    const destination = new Destination()
    destination.setValue(testAccountAddress)

    // WHEN it is serialized
    const serialized = Serializer.destinationToJSON(destination)

    // THEN the result is the serialized representation of the input.
    assert.equal(
      serialized,
      Serializer.accountAddressToJSON(testAccountAddress),
    )
  })

  it('Fails to serialize a malformed Destination', function (): void {
    // GIVEN a Destination with no address
    const destination = new Destination()

    // WHEN it is serialized
    const serialized = Serializer.destinationToJSON(destination)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a DeliverMin', function (): void {
    // GIVEN a DeliverMin.
    const xrpDropsAmount = xrpTestUtils.makeXrpDropsAmount('10')

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    const deliverMin = new DeliverMin()
    deliverMin.setValue(currencyAmount)

    // WHEN it is serialized
    const serialized = Serializer.deliverMinToJSON(deliverMin)

    // THEN the result is the serialized representation of the input.
    assert.equal(serialized, Serializer.currencyAmountToJSON(currencyAmount))
  })

  it('Fails to serialize a malformed DeliverMin', function (): void {
    // GIVEN a DeliverMin with no value
    const destination = new DeliverMin()

    // WHEN it is serialized
    const serialized = Serializer.deliverMinToJSON(destination)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a CheckID', function (): void {
    // GIVEN a CheckID.
    const checkIdValue = new Uint8Array([1, 2, 3, 4])

    const checkId = new CheckID()
    checkId.setValue(checkIdValue)

    // WHEN it is serialized.
    const serialized = Serializer.checkIDToJSON(checkId)

    // THEN the output is the input encoded as hex.
    assert.equal(serialized, Utils.toHex(checkIdValue))
  })

  it('Serializes a CheckCancel', function (): void {
    // GIVEN a CheckCancel.
    const checkIdValue = new Uint8Array([1, 2, 3, 4])

    const checkId = new CheckID()
    checkId.setValue(checkIdValue)

    const checkCancel = new CheckCancel()
    checkCancel.setCheckId(checkId)

    // WHEN it is serialized.
    const serialized = Serializer.checkCancelToJSON(checkCancel)

    // THEN the output is in the expected form.
    const expected: CheckCancelJSON = {
      CheckID: Serializer.checkIDToJSON(checkId),
      TransactionType: 'CheckCancel',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize a malformed CheckCancel', function (): void {
    // GIVEN a CheckCancel with no data..
    const checkCancel = new CheckCancel()

    // WHEN it is serialized.
    const serialized = Serializer.checkCancelToJSON(checkCancel)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a SendMax', function (): void {
    // GIVEN a SendMax.
    const xrpDropsAmount = xrpTestUtils.makeXrpDropsAmount('10')

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    const sendMax = new SendMax()
    sendMax.setValue(currencyAmount)

    // WHEN it is serialized.
    const serialized = Serializer.sendMaxToJSON(sendMax)

    // THEN the result is the serialized representation of the input.
    assert.equal(serialized, Serializer.currencyAmountToJSON(currencyAmount))
  })

  it('Fails to serialize a malformed SendMax', function (): void {
    // GIVEN a DeliverMin with no value.
    const destination = new SendMax()

    // WHEN it is serialized
    const serialized = Serializer.sendMaxToJSON(destination)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes an Expiration', function (): void {
    // GIVEN an Expiration with an expiration time.
    const expirationTime = 12

    const expiration = new Expiration()
    expiration.setValue(expirationTime)

    // WHEN it is serialized.
    const serialized = Serializer.expirationToJSON(expiration)

    // THEN the result is the expiration time.
    assert.equal(serialized, expirationTime)
  })

  it('Serializes an AccountDelete with mandatory fields', function (): void {
    // GIVEN an AccountDelete with only mandatory fields.
    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const accountDelete = new AccountDelete()
    accountDelete.setDestination(destination)

    // WHEN it is serialized.
    const serialized = Serializer.accountDeleteToJSON(accountDelete)

    // THEN the result is in the expected form.
    const expected: AccountDeleteJSON = {
      Destination: Serializer.destinationToJSON(destination)!,
      TransactionType: 'AccountDelete',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Serializes an AccountDelete with all fields', function (): void {
    // GIVEN an AccountDelete with only mandatory fields.
    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const destinationTag = new DestinationTag()
    destinationTag.setValue(12)

    const accountDelete = new AccountDelete()
    accountDelete.setDestination(destination)
    accountDelete.setDestinationTag(destinationTag)

    // WHEN it is serialized.
    const serialized = Serializer.accountDeleteToJSON(accountDelete)

    // THEN the result is in the expected from
    const expected: AccountDeleteJSON = {
      Destination: Serializer.destinationToJSON(destination)!,
      DestinationTag: Serializer.destinationTagToJSON(destinationTag),
      TransactionType: 'AccountDelete',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize an AccountDelete with missing mandatory fields', function (): void {
    // GIVEN an AccountDelete which is missing a destination.
    const accountDelete = new AccountDelete()

    // WHEN it is serialized.
    const serialized = Serializer.accountDeleteToJSON(accountDelete)

    // THEN the result is undefined
    assert.isUndefined(serialized)
  })

  it('Fails to serialize an AccountDelete with malformed mandatory fields', function (): void {
    // GIVEN an AccountDelete which constains a malformed destination.
    const destination = new Destination()

    const accountDelete = new AccountDelete()
    accountDelete.setDestination(destination)

    // WHEN it is serialized.
    const serialized = Serializer.accountDeleteToJSON(accountDelete)

    // THEN the result is undefined
    assert.isUndefined(serialized)
  })

  it('Serializes a TakerGets', function (): void {
    // GIVEN an TakerGets with a CurrencyAmount.
    const currency = new Currency()
    currency.setCode('USD')

    const issuedCurrencyAmount = xrpTestUtils.makeIssuedCurrencyAmount(
      testAccountAddress,
      '123',
      currency,
    )

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setIssuedCurrencyAmount(issuedCurrencyAmount)

    const takerGets = new TakerGets()
    takerGets.setValue(currencyAmount)

    // WHEN it is serialized.
    const serialized = Serializer.takerGetsToJSON(takerGets)

    // THEN the result is the serialized CurrencyAmount.
    assert.deepEqual(
      serialized,
      Serializer.currencyAmountToJSON(currencyAmount),
    )
  })

  it('Fails to serialze a malformed TakerGets', function (): void {
    // GIVEN an TakerGets without a CurrencyAmount.
    const takerGets = new TakerGets()

    // WHEN it is serialized.
    const serialized = Serializer.takerGetsToJSON(takerGets)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a TakerPays', function (): void {
    // GIVEN an TakerPays with a CurrencyAmount.
    const currency = new Currency()
    currency.setCode('USD')

    const issuedCurrencyAmount = xrpTestUtils.makeIssuedCurrencyAmount(
      testAccountAddress,
      '123',
      currency,
    )

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setIssuedCurrencyAmount(issuedCurrencyAmount)

    const takerPays = new TakerPays()
    takerPays.setValue(currencyAmount)

    // WHEN it is serialized.
    const serialized = Serializer.takerPaysToJSON(takerPays)

    // THEN the result is the serialized CurrencyAmount.
    assert.deepEqual(
      serialized,
      Serializer.currencyAmountToJSON(currencyAmount),
    )
  })

  it('Fails to serialze a malformed TakerPays', function (): void {
    // GIVEN an TakerPays without a CurrencyAmount.
    const takerPays = new TakerPays()

    // WHEN it is serialized.
    const serialized = Serializer.takerPaysToJSON(takerPays)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes an OfferSequence', function (): void {
    // GIVEN an OfferSequence with an offer sequence.
    const offerSequence = new OfferSequence()
    offerSequence.setValue(offerSequenceNumber)

    // WHEN it is serialized.
    const serialized = Serializer.offerSequenceToJSON(offerSequence)

    // THEN the result is the offserSequence value.
    assert.equal(serialized, offerSequenceNumber)
  })

  it('Serializes an Owner', function (): void {
    // GIVEN an Owner wrapping an address.
    const owner = new Owner()
    owner.setValue(testAccountAddress)

    // WHEN it is serialized.
    const serialized = Serializer.accountToJSON(owner)

    // THEN the result is the address
    assert.equal(serialized, testAccountAddress.getAddress())
  })

  it('Fails to serialize an Owner with no AccountAddress', function (): void {
    // GIVEN an empty Owner.
    const owner = new Owner()

    // WHEN it is serialized.
    const serialized = Serializer.ownerToJSON(owner)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes an EscrowCancel with all fields set', function (): void {
    // GIVEN an EscrowCancel with all fields set.
    const offerSequence = new OfferSequence()
    offerSequence.setValue(offerSequenceNumber)

    const owner = new Owner()
    owner.setValue(testAccountAddress)

    const escrowCancel = new EscrowCancel()
    escrowCancel.setOfferSequence(offerSequence)
    escrowCancel.setOwner(owner)

    // WHEN it is serialized.
    const serialized = Serializer.escrowCancelToJSON(escrowCancel)

    const expectedJSON: EscrowCancelJSON = {
      OfferSequence: offerSequenceNumber,
      Owner: testAccountAddress.toString(),
      TransactionType: 'EscrowCancel',
    }

    // THEN the result is as expected.
    assert.deepEqual(serialized, expectedJSON)
  })

  it('Fails to serialize an EscrowCancel missing an offerSequence', function (): void {
    // GIVEN an EscrowCancel that's missing an offerSequence.
    const owner = new Owner()
    owner.setValue(testAccountAddress)

    const escrowCancel = new EscrowCancel()
    escrowCancel.setOwner(owner)

    // WHEN it is serialized.
    const serialized = Serializer.escrowCancelToJSON(escrowCancel)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize an EscrowCancel missing an owner', function (): void {
    // GIVEN an EscrowCancel that's missing an owner.
    const offerSequence = new OfferSequence()
    offerSequence.setValue(offerSequenceNumber)

    const escrowCancel = new EscrowCancel()
    escrowCancel.setOfferSequence(offerSequence)

    // WHEN it is serialized.
    const serialized = Serializer.escrowCancelToJSON(escrowCancel)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize an EscrowCancel with a malformed owner', function (): void {
    // GIVEN an EscrowCancel with a malformed owner.
    const owner = new Owner()

    const escrowCancel = new EscrowCancel()
    escrowCancel.setOfferSequence()
    escrowCancel.setOwner(owner)

    // WHEN it is serialized.
    const serialized = Serializer.escrowCancelToJSON(escrowCancel)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes an OfferCancel', function (): void {
    // GIVEN a OfferCancel.
    const offerSequence = new OfferSequence()
    offerSequence.setValue(offerSequenceNumber)

    const offerCancel = new OfferCancel()
    offerCancel.setOfferSequence(offerSequence)

    // WHEN it is serialized.
    const serialized = Serializer.offerCancelToJSON(offerCancel)

    // THEN the output is in the expected form.
    const expected: OfferCancelJSON = {
      OfferSequence: Serializer.offerSequenceToJSON(offerSequence),
      TransactionType: 'OfferCancel',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Serializes a Condition', function (): void {
    // GIVEN a Condition with some bytes.
    const conditionBytes = new Uint8Array([0, 1, 2, 3])
    const condition = new Condition()
    condition.setValue(conditionBytes)

    // WHEN it is serialized.
    const serialized = Serializer.conditionToJSON(condition)

    // THEN the result is as expected.
    assert.equal(serialized, Utils.toHex(conditionBytes))
  })

  it('Serializes a Payment with only mandatory fields set', function (): void {
    // GIVEN a Payment with only mandatory fields.
    const xrpAmount = xrpTestUtils.makeXrpDropsAmount('10')

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpAmount)

    const amount = new Amount()
    amount.setValue(currencyAmount)

    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const payment = new Payment()
    payment.setAmount(amount)
    payment.setDestination(destination)

    // WHEN it is serialized.
    const serialized = Serializer.paymentToJSON(payment)

    // THEN the result is in the expected form.
    const expected: PaymentJSON = {
      Amount: Serializer.amountToJSON(amount)!,
      Destination: Serializer.destinationToJSON(destination)!,
      TransactionType: 'Payment',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Serializes a Payment with all fields set', function (): void {
    // GIVEN a Payment with all fields.
    const transactionAmount = xrpTestUtils.makeXrpCurrencyAmount('10')

    const amount = new Amount()
    amount.setValue(transactionAmount)

    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const destinationTag = new DestinationTag()
    destinationTag.setValue(11)

    const invoiceId = new InvoiceID()
    invoiceId.setValue(new Uint8Array([1, 2, 3, 4]))

    const deliverMinAmount = xrpTestUtils.makeXrpCurrencyAmount('12')

    const deliverMin = new DeliverMin()
    deliverMin.setValue(deliverMinAmount)

    const sendMaxAmount = xrpTestUtils.makeXrpCurrencyAmount('13')

    const sendMax = new SendMax()
    sendMax.setValue(sendMaxAmount)

    const path1Element1 = xrpTestUtils.makePathElement(
      xrpTestUtils.makeAccountAddress('r1'),
      new Uint8Array([1, 2, 3]),
      xrpTestUtils.makeAccountAddress('r2'),
    )
    const path1Element2 = xrpTestUtils.makePathElement(
      xrpTestUtils.makeAccountAddress('r3'),
      new Uint8Array([4, 5, 6]),
      xrpTestUtils.makeAccountAddress('r4'),
    )

    const path1 = new Payment.Path()
    path1.addElements(path1Element1)
    path1.addElements(path1Element2)

    const path2Element1 = xrpTestUtils.makePathElement(
      xrpTestUtils.makeAccountAddress('r5'),
      new Uint8Array([7, 8, 9]),
      xrpTestUtils.makeAccountAddress('r6'),
    )

    const path2 = new Payment.Path()
    path2.addElements(path2Element1)

    const pathList = [path1, path2]

    const payment = new Payment()
    payment.setAmount(amount)
    payment.setDeliverMin(deliverMin)
    payment.setDestination(destination)
    payment.setDestinationTag(destinationTag)
    payment.setInvoiceId(invoiceId)
    payment.setSendMax(sendMax)
    payment.setPathsList(pathList)

    // WHEN it is serialized.
    const serialized = Serializer.paymentToJSON(payment)

    // THEN the result is in the expected form.
    const expected: PaymentJSON = {
      Amount: Serializer.amountToJSON(amount)!,
      DeliverMin: Serializer.deliverMinToJSON(deliverMin),
      Destination: Serializer.destinationToJSON(destination)!,
      DestinationTag: Serializer.destinationTagToJSON(destinationTag),
      InvoiceID: Serializer.invoiceIdToJSON(invoiceId),
      Paths: Serializer.pathListToJSON(pathList),
      SendMax: Serializer.sendMaxToJSON(sendMax),
      TransactionType: 'Payment',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize a malformed OfferCancel', function (): void {
    // GIVEN a OfferCancel with no data.
    const offerCancel = new OfferCancel()

    // WHEN it is serialized.
    const serialized = Serializer.offerCancelToJSON(offerCancel)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize a malformed Payment', function (): void {
    // GIVEN a malformed Payment.
    const payment = new Payment()

    // WHEN it is serialized.
    const serialized = Serializer.paymentToJSON(payment)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize a payment with a malformed mandatory field', function (): void {
    // GIVEN a Payment with a malformed amount field.
    const amount = new Amount()

    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const payment = new Payment()
    payment.setAmount(amount)
    payment.setDestination(destination)

    // WHEN it is serialized.
    const serialized = Serializer.paymentToJSON(payment)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a CancelAfter', function (): void {
    // GIVEN a CancelAfter.
    const cancelAfterTime = 533257958
    const cancelAfter = new CancelAfter()
    cancelAfter.setValue(cancelAfterTime)

    // WHEN it is serialized.
    const serialized = Serializer.cancelAfterToJSON(cancelAfter)

    // THEN the result is as expected.
    assert.equal(serialized, cancelAfterTime)
  })

  it('Serializes a QualityIn', function (): void {
    // GIVEN a QualityIn.
    const qualityInValue = 6
    const qualityIn = new QualityIn()
    qualityIn.setValue(qualityInValue)

    // WHEN it is serialized.
    const serialized = Serializer.qualityInToJSON(qualityIn)

    // THEN the result is as expected.
    assert.equal(serialized, qualityInValue)
  })

  it('Serializes a QualityOut', function (): void {
    // GIVEN a QualityOut.
    const qualityOutValue = 7
    const qualityOut = new QualityOut()
    qualityOut.setValue(qualityOutValue)

    // WHEN it is serialized.
    const serialized = Serializer.qualityOutToJSON(qualityOut)

    // THEN the result is as expected.
    assert.equal(serialized, qualityOutValue)
  })

  it('Serializes a FinishAfter', function (): void {
    // GIVEN a FinishAfter.
    const finishAfterTime = 5331715585
    const finishAfter = new FinishAfter()
    finishAfter.setValue(finishAfterTime)

    // WHEN it is serialized.
    const serialized = Serializer.finishAfterToJSON(finishAfter)

    // THEN the result is as expected.
    assert.equal(serialized, finishAfterTime)
  })

  it('Serializes a CheckCash with an Amount', function (): void {
    // GIVEN a CheckCash with an Amount
    const xrpDropsAmount = xrpTestUtils.makeXrpDropsAmount('10')

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)
    const amount = new Amount()
    amount.setValue(currencyAmount)

    const checkIdValue = new Uint8Array([1, 2, 3, 4])
    const checkId = new CheckID()
    checkId.setValue(checkIdValue)

    const checkCash = new CheckCash()
    checkCash.setCheckId(checkId)
    checkCash.setAmount(amount)

    // WHEN it is serialized
    const serialized = Serializer.checkCashToJSON(checkCash)

    // THEN the result is in the expected form.
    const expected: CheckCashJSON = {
      CheckID: Serializer.checkIDToJSON(checkId),
      Amount: Serializer.amountToJSON(amount),
      TransactionType: 'CheckCash',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Serializes a CheckCash with a DeliverMin', function (): void {
    // GIVEN a CheckCash with all fields set.
    const xrpDropsAmount = xrpTestUtils.makeXrpDropsAmount('10')

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    const deliverMin = new DeliverMin()
    deliverMin.setValue(currencyAmount)

    const checkIdValue = new Uint8Array([1, 2, 3, 4])
    const checkId = new CheckID()
    checkId.setValue(checkIdValue)

    const checkCash = new CheckCash()
    checkCash.setCheckId(checkId)
    checkCash.setDeliverMin(deliverMin)

    // WHEN it is serialized
    const serialized = Serializer.checkCashToJSON(checkCash)

    // THEN the result is in the expected form.
    const expected: CheckCashJSON = {
      CheckID: Serializer.checkIDToJSON(checkId),
      DeliverMin: Serializer.deliverMinToJSON(deliverMin),
      TransactionType: 'CheckCash',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize a malformed CheckCash with only a CheckId', function (): void {
    // GIVEN a CheckCash with only a CheckID set.
    const checkIdValue = new Uint8Array([1, 2, 3, 4])
    const checkId = new CheckID()
    checkId.setValue(checkIdValue)

    const checkCash = new CheckCash()
    checkCash.setCheckId(checkId)

    // WHEN it is serialized
    const serialized = Serializer.checkCashToJSON(checkCash)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize a malformed CheckCash without a CheckID', function (): void {
    // GIVEN a CheckCash missing the mandatory CheckID field.
    const checkCash = new CheckCash()

    // WHEN it is serialized
    const serialized = Serializer.checkCashToJSON(checkCash)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a CheckCreate with only mandatory fields', function (): void {
    // GIVEN a CheckCreate with mandatory fields set.
    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const xrpDropsAmount = xrpTestUtils.makeXrpDropsAmount('10')
    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    const sendMax = new SendMax()
    sendMax.setValue(currencyAmount)

    const checkCreate = new CheckCreate()
    checkCreate.setDestination(destination)
    checkCreate.setSendMax(sendMax)

    // WHEN it is serialized
    const serialized = Serializer.checkCreateToJSON(checkCreate)

    // THEN the result is in the expected form.
    const expected: CheckCreateJSON = {
      Destination: Serializer.destinationToJSON(destination)!,
      SendMax: Serializer.sendMaxToJSON(sendMax)!,
      TransactionType: 'CheckCreate',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Serializes a CheckCreate with all fields', function (): void {
    // GIVEN a CheckCreate with all fields fields set.
    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const xrpDropsAmount = xrpTestUtils.makeXrpDropsAmount('10')
    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    const sendMax = new SendMax()
    sendMax.setValue(currencyAmount)

    const invoiceId = new InvoiceID()
    invoiceId.setValue(new Uint8Array([1, 2, 3, 4]))

    const destinationTag = new DestinationTag()
    destinationTag.setValue(5)

    const expiration = new Expiration()
    expiration.setValue(6)

    const checkCreate = new CheckCreate()
    checkCreate.setDestination(destination)
    checkCreate.setSendMax(sendMax)
    checkCreate.setInvoiceId(invoiceId)
    checkCreate.setDestinationTag(destinationTag)
    checkCreate.setExpiration(expiration)

    // WHEN it is serialized
    const serialized = Serializer.checkCreateToJSON(checkCreate)

    // THEN the result is in the expected form.
    const expected: CheckCreateJSON = {
      Destination: Serializer.destinationToJSON(destination)!,
      SendMax: Serializer.sendMaxToJSON(sendMax)!,
      InvoiceID: Serializer.invoiceIdToJSON(invoiceId),
      DestinationTag: Serializer.destinationTagToJSON(destinationTag),
      Expiration: Serializer.expirationToJSON(expiration),
      TransactionType: 'CheckCreate',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Fails to Serialize a CheckCreate without a Destination', function (): void {
    // GIVEN a CheckCreate without a destination.
    const xrpDropsAmount = xrpTestUtils.makeXrpDropsAmount('10')
    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    const sendMax = new SendMax()
    sendMax.setValue(currencyAmount)

    const checkCreate = new CheckCreate()
    checkCreate.setSendMax(sendMax)

    // WHEN it is serialized
    const serialized = Serializer.checkCreateToJSON(checkCreate)

    // THEN the result is undefined
    assert.isUndefined(serialized)
  })

  it('Fails to Serialize a CheckCreate without a SendMax', function (): void {
    // GIVEN a CheckCreate with mandatory fields set.
    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const checkCreate = new CheckCreate()
    checkCreate.setDestination(destination)

    // WHEN it is serialized
    const serialized = Serializer.checkCreateToJSON(checkCreate)

    // THEN the result is undefined
    assert.isUndefined(serialized)
  })

  it('Serializes a Channel', function (): void {
    // GIVEN a Channel.
    const channelValue = new Uint8Array([1, 2, 3, 4])

    const channel = new Channel()
    channel.setValue(channelValue)

    // WHEN it is serialized.
    const serialized = Serializer.channelToJSON(channel)

    // THEN the output is the input encoded as hex.
    assert.equal(serialized, Utils.toHex(channelValue))
  })

  it('Serializes an OfferCreate with only mandatory fields', function (): void {
    // GIVEN a OfferCreate with mandatory fields set.
    const takerPays = new TakerPays()
    takerPays.setValue(xrpTestUtils.makeXrpCurrencyAmount('1'))

    const takerGets = new TakerGets()
    takerGets.setValue(xrpTestUtils.makeXrpCurrencyAmount('2'))

    const offerCreate = new OfferCreate()
    offerCreate.setTakerGets(takerGets)
    offerCreate.setTakerPays(takerPays)

    // WHEN it is serialized
    const serialized = Serializer.offerCreateToJSON(offerCreate)

    // THEN the result is in the expected form.
    const expected: OfferCreateJSON = {
      TakerGets: Serializer.takerGetsToJSON(takerGets)!,
      TakerPays: Serializer.takerPaysToJSON(takerPays)!,
    }
    assert.deepEqual(serialized, expected)
  })

  it('Serializes an OfferCreate with all fields', function (): void {
    // GIVEN a OfferCreate with all fields set.
    const takerPays = new TakerPays()
    takerPays.setValue(xrpTestUtils.makeXrpCurrencyAmount('1'))

    const takerGets = new TakerGets()
    takerGets.setValue(xrpTestUtils.makeXrpCurrencyAmount('2'))

    const expiration = new Expiration()
    expiration.setValue(3)

    const offerSequence = new OfferSequence()
    offerSequence.setValue(4)

    const offerCreate = new OfferCreate()
    offerCreate.setTakerGets(takerGets)
    offerCreate.setTakerPays(takerPays)
    offerCreate.setExpiration(expiration)
    offerCreate.setOfferSequence(offerSequence)

    // WHEN it is serialized
    const serialized = Serializer.offerCreateToJSON(offerCreate)

    // THEN the result is in the expected form.
    const expected: OfferCreateJSON = {
      TakerGets: Serializer.takerGetsToJSON(takerGets)!,
      TakerPays: Serializer.takerPaysToJSON(takerPays)!,
      Expiration: Serializer.expirationToJSON(expiration),
      OfferSequence: Serializer.offerSequenceToJSON(offerSequence),
    }
    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize an OfferCreate with malformed mandatory fields.', function (): void {
    // GIVEN a OfferCreate with a malformed TakerPays
    const takerPays = new TakerPays()

    const takerGets = new TakerGets()
    takerGets.setValue(xrpTestUtils.makeXrpCurrencyAmount('2'))

    const expiration = new Expiration()
    expiration.setValue(3)

    const offerSequence = new OfferSequence()
    offerSequence.setValue(4)

    const offerCreate = new OfferCreate()
    offerCreate.setTakerGets(takerGets)
    offerCreate.setTakerPays(takerPays)
    offerCreate.setExpiration(expiration)
    offerCreate.setOfferSequence(offerSequence)

    // WHEN it is serialized
    const serialized = Serializer.offerCreateToJSON(offerCreate)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a PublicKey', function (): void {
    // GIVEN a PublicKey.
    const publicKeyValue = new Uint8Array([1, 2, 3, 4])

    const publicKey = new PublicKey()
    publicKey.setValue(publicKeyValue)

    // WHEN it is serialized.
    const serialized = Serializer.publicKeyToJSON(publicKey)

    // THEN the output is the input encoded as hex.
    assert.equal(serialized, Utils.toHex(publicKeyValue))
  })

  it('Serializes a Balance', function (): void {
    // GIVEN a Balance.
    const currencyAmount = xrpTestUtils.makeXrpCurrencyAmount('10')

    const balance = new Balance()
    balance.setValue(currencyAmount)

    // WHEN it is serialized.
    const serialized = Serializer.balanceToJSON(balance)

    // THEN the output is the serialized versions of the input.
    assert.equal(serialized, Serializer.currencyAmountToJSON(currencyAmount))
  })

  it('Fails to serialize a malformed Balance', function (): void {
    // GIVEN a malformed Balance.
    const balance = new Balance()

    // WHEN it is serialized.
    const serialized = Serializer.balanceToJSON(balance)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Converts a PathList', function (): void {
    // GIVEN a Path list with two paths.
    const path1Element1 = xrpTestUtils.makePathElement(
      xrpTestUtils.makeAccountAddress('r1'),
      new Uint8Array([1, 2, 3]),
      xrpTestUtils.makeAccountAddress('r2'),
    )
    const path1Element2 = xrpTestUtils.makePathElement(
      xrpTestUtils.makeAccountAddress('r3'),
      new Uint8Array([4, 5, 6]),
      xrpTestUtils.makeAccountAddress('r4'),
    )

    const path1 = new Payment.Path()
    path1.addElements(path1Element1)
    path1.addElements(path1Element2)

    const path2Element1 = xrpTestUtils.makePathElement(
      xrpTestUtils.makeAccountAddress('r5'),
      new Uint8Array([7, 8, 9]),
      xrpTestUtils.makeAccountAddress('r6'),
    )

    const path2 = new Payment.Path()
    path2.addElements(path2Element1)

    const pathList = [path1, path2]

    // WHEN it is serialized
    const serialized = Serializer.pathListToJSON(pathList)

    // THEN the result is a list of the serialized paths.
    const expectedPath1 = Serializer.pathToJSON(path1)
    const expectedPath2 = Serializer.pathToJSON(path2)
    const expected = [expectedPath1, expectedPath2]
    assert.deepEqual(serialized, expected)
  })

  it('Serializes an EscrowCreate with required fields', function (): void {
    // GIVEN an EscrowCreate with required fields set.
    const xrpAmount = xrpTestUtils.makeXrpDropsAmount('10')

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpAmount)

    const amount = new Amount()
    amount.setValue(currencyAmount)

    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const escrowCreate = new EscrowCreate()
    escrowCreate.setAmount(amount)
    escrowCreate.setDestination(destination)

    // WHEN it is serialized.
    const serialized = Serializer.escrowCreateToJSON(escrowCreate)

    const expected: EscrowCreateJSON = {
      Amount: Serializer.amountToJSON(amount)!,
      Destination: Serializer.destinationToJSON(destination)!,
      TransactionType: 'EscrowCreate',
    }

    // THEN the result is as expected.
    assert.deepEqual(serialized, expected)
  })

  it('Serializes an EscrowCreate with all fields', function (): void {
    // GIVEN an EscrowCreate with all fields set.
    const xrpAmount = xrpTestUtils.makeXrpDropsAmount('10')

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpAmount)

    const amount = new Amount()
    amount.setValue(currencyAmount)

    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const destinationTag = new DestinationTag()
    destinationTag.setValue(11)

    const cancelAfter = new CancelAfter()
    cancelAfter.setValue(1)

    const conditionBytes = new Uint8Array([0, 1, 2, 3])
    const condition = new Condition()
    condition.setValue(conditionBytes)

    const finishAfter = new FinishAfter()
    finishAfter.setValue(2)

    const escrowCreate = new EscrowCreate()
    escrowCreate.setAmount(amount)
    escrowCreate.setDestination(destination)
    escrowCreate.setDestinationTag(destinationTag)
    escrowCreate.setCancelAfter(cancelAfter)
    escrowCreate.setCondition(condition)
    escrowCreate.setFinishAfter(finishAfter)

    // WHEN it is serialized.
    const serialized = Serializer.escrowCreateToJSON(escrowCreate)

    const expected: EscrowCreateJSON = {
      Amount: Serializer.amountToJSON(amount)!,
      Destination: Serializer.destinationToJSON(destination)!,
      DestinationTag: Serializer.destinationTagToJSON(destinationTag),
      CancelAfter: Serializer.cancelAfterToJSON(cancelAfter),
      Condition: Serializer.conditionToJSON(condition),
      FinishAfter: Serializer.finishAfterToJSON(finishAfter),
      TransactionType: 'EscrowCreate',
    }

    // THEN the result is as expected.
    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize an EscrowCreate missing an amount', function (): void {
    // GIVEN an EscrowCreate that's missing an amount.
    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const escrowCreate = new EscrowCreate()
    escrowCreate.setDestination(destination)

    // WHEN the EscrowCreate is serialized.
    const serialized = Serializer.escrowCreateToJSON(escrowCreate)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize an EscrowCreate missing a destination', function (): void {
    // GIVEN an EscrowCreat that's missing a destination.
    const xrpAmount = xrpTestUtils.makeXrpDropsAmount('10')

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpAmount)

    const amount = new Amount()
    amount.setValue(currencyAmount)

    const escrowCreate = new EscrowCreate()
    escrowCreate.setAmount(amount)

    // WHEN the EscrowCreate is serialized.
    const serialized = Serializer.escrowCreateToJSON(escrowCreate)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize an EscrowCreate with a malformed amount and destination', function (): void {
    // GIVEN an EscrowCreate that has a malformed amount and destination.
    const amount = new Amount()
    const destination = new Destination()

    const escrowCreate = new EscrowCreate()
    escrowCreate.setAmount(amount)
    escrowCreate.setDestination(destination)

    // WHEN the EscrowCreate is serialized.
    const serialized = Serializer.escrowCreateToJSON(escrowCreate)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a SignerQuorum', function (): void {
    // GIVEN a SignerQuorum.
    const signerQuorumValue = 2

    const signerQuorum = new SignerQuorum()
    signerQuorum.setValue(signerQuorumValue)

    // WHEN it is serialized.
    const serialized = Serializer.signerQuorumToJSON(signerQuorum)

    // THEN the result is as expected.
    assert.equal(serialized, signerQuorumValue)
  })

  it('Serializes a RegularKey', function (): void {
    // GIVEN a RegularKey.
    const regularKey = new RegularKey()
    regularKey.setValue(testAccountAddress)

    // WHEN it is serialized.
    const serialized = Serializer.regularKeyToJSON(regularKey)

    // THEN the output is the serialized version of the input.
    assert.equal(
      serialized,
      Serializer.accountAddressToJSON(testAccountAddress),
    )
  })

  it('Fails to serialize a malformed RegularKey', function (): void {
    // GIVEN a malformed RegularKey.
    const regularKey = new RegularKey()

    // WHEN it is serialized.
    const serialized = Serializer.regularKeyToJSON(regularKey)

    // THEN the output is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a SettleDelay', function (): void {
    // GIVEN a SettleDelay.
    const settleDelayValue = 4

    const settleDelay = new SettleDelay()
    settleDelay.setValue(settleDelayValue)

    // WHEN it is serialized.
    const serialized = Serializer.settleDelayToJSON(settleDelay)

    // THEN the result is as expected.
    assert.equal(serialized, settleDelayValue)
  })

  it('Serializes a PaymentChannelSignature', function (): void {
    // GIVEN a PaymentChannelSignature.
    const paymentChannelSignatureValue = new Uint8Array([1, 2, 3, 4])

    const paymentChannelSignature = new PaymentChannelSignature()
    paymentChannelSignature.setValue(paymentChannelSignatureValue)

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelSignatureToJSON(
      paymentChannelSignature,
    )

    // THEN the output is the input encoded as hex.
    assert.equal(serialized, Utils.toHex(paymentChannelSignatureValue))
  })

  it('Serializes a Fulfillment', function (): void {
    // GIVEN a Fulfillment with some bytes.
    const fulfillmentBytes = new Uint8Array([0, 1, 2, 3])
    const fulfillment = new Fulfillment()
    fulfillment.setValue(fulfillmentBytes)

    // WHEN it is serialized.
    const serialized = Serializer.fulfillmentToJSON(fulfillment)

    // THEN the result is as expected.
    assert.equal(serialized, Utils.toHex(fulfillmentBytes))
  })

  it('Serializes a SignerWeight', function (): void {
    // GIVEN a SignerWeight.
    const signerWeightValue = 3

    const signerWeight = new SignerWeight()
    signerWeight.setValue(signerWeightValue)

    // WHEN it is serialized.
    const serialized = Serializer.signerWeightToJSON(signerWeight)

    // THEN the result is as expected.
    assert.equal(serialized, signerWeightValue)
  })

  it('Serializes a SetRegularKey with regular key', function (): void {
    // GIVEN a SetRegularKey with a regular key.
    const regularKey = new RegularKey()
    regularKey.setValue(testAccountAddress)

    const setRegularKey = new SetRegularKey()
    setRegularKey.setRegularKey(regularKey)

    // WHEN it is serialized.
    const serialized = Serializer.setRegularKeyToJSON(setRegularKey)

    // THEN the output is as expected.
    const expected: SetRegularKeyJSON = {
      RegularKey: Serializer.regularKeyToJSON(regularKey),
      TransactionType: 'SetRegularKey',
    }

    assert.deepEqual(serialized, expected)
  })

  it('Serializes a SetRegularKey with no regular key', function (): void {
    // GIVEN a SetRegularKey without a regular key.
    const setRegularKey = new SetRegularKey()

    // WHEN it is serialized.
    const serialized = Serializer.setRegularKeyToJSON(setRegularKey)

    // THEN the output is as expected.
    const expected: SetRegularKeyJSON = {
      TransactionType: 'SetRegularKey',
    }

    assert.deepEqual(serialized, expected)
  })

  it('Serializes an EscrowFinish with required fields', function (): void {
    // GIVEN an EscrowFinish with required fields.
    const offerSequence = new OfferSequence()
    offerSequence.setValue(offerSequenceNumber)

    const owner = new Owner()
    owner.setValue(testAccountAddress)

    const escrowFinish = new EscrowFinish()
    escrowFinish.setOfferSequence(offerSequence)
    escrowFinish.setOwner(owner)

    // WHEN it is serialized.
    const serialized = Serializer.escrowFinishToJSON(escrowFinish)

    // THEN the result is as expected.
    const expected: EscrowFinishJSON = {
      OfferSequence: Serializer.offerSequenceToJSON(offerSequence),
      Owner: Serializer.ownerToJSON(owner)!,
      TransactionType: 'EscrowFinish',
    }

    assert.deepEqual(serialized, expected)
  })

  it('Serializes an EscrowFinish with all fields', function (): void {
    // GIVEN an EscrowFinish with all fields.
    const conditionBytes = new Uint8Array([0, 1, 2, 3])
    const condition = new Condition()
    condition.setValue(conditionBytes)

    const fulfillmentBytes = new Uint8Array([0, 1, 2, 3])
    const fulfillment = new Fulfillment()
    fulfillment.setValue(fulfillmentBytes)

    const offerSequence = new OfferSequence()
    offerSequence.setValue(offerSequenceNumber)

    const owner = new Owner()
    owner.setValue(testAccountAddress)

    const escrowFinish = new EscrowFinish()
    escrowFinish.setCondition(condition)
    escrowFinish.setFulfillment(fulfillment)
    escrowFinish.setOfferSequence(offerSequence)
    escrowFinish.setOwner(owner)

    // WHEN it is serialized.
    const serialized = Serializer.escrowFinishToJSON(escrowFinish)

    // THEN the result is as expected.
    const expected: EscrowFinishJSON = {
      Condition: Serializer.conditionToJSON(condition),
      Fulfillment: Serializer.fulfillmentToJSON(fulfillment),
      OfferSequence: Serializer.offerSequenceToJSON(offerSequence),
      Owner: Serializer.ownerToJSON(owner)!,
      TransactionType: 'EscrowFinish',
    }

    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize an EscrowFinish missing required fields', function (): void {
    // GIVEN an EscrowFinish that's missing required fields.
    const escrowFinish = new EscrowFinish()

    // WHEN it is serialized.
    const serialized = Serializer.escrowFinishToJSON(escrowFinish)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize a malformed OfferCreate', function (): void {
    // GIVEN a malformed OfferCreate.
    const offerCreate = new OfferCreate()

    // WHEN it is serialized
    const serialized = Serializer.offerCreateToJSON(offerCreate)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize an EscrowFinish with a malformed owner', function (): void {
    // GIVEN an EscrowCancel with a malformed owner.
    const offerSequence = new OfferSequence()
    offerSequence.setValue(offerSequenceNumber)

    const owner = new Owner()

    const escrowFinish = new EscrowFinish()
    escrowFinish.setOfferSequence(offerSequence)
    escrowFinish.setOwner(owner)

    // WHEN it is serialized.
    const serialized = Serializer.escrowFinishToJSON(escrowFinish)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a PaymentChannelFund with mandatory fields set.', function (): void {
    // GIVEN a PaymentChannelFund with mandatory fields set.
    const amount = new Amount()
    amount.setValue(xrpTestUtils.makeXrpCurrencyAmount('10'))

    const channel = new Channel()
    channel.setValue(new Uint8Array([1, 2, 3, 4]))

    const paymentChannelFund = new PaymentChannelFund()
    paymentChannelFund.setAmount(amount)
    paymentChannelFund.setChannel(channel)

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelFundToJSON(paymentChannelFund)

    // THEN the result is in the expected form.
    const expected: PaymentChannelFundJSON = {
      Amount: Serializer.amountToJSON(amount)!,
      Channel: Serializer.channelToJSON(channel),
      TransactionType: 'PaymentChannelFund',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Serializes a PaymentChannelClaim with only mandatory fields', function (): void {
    // GIVEN a PaymentChannelClaim with only the mandatory fields set.
    const channel = new Channel()
    channel.setValue(new Uint8Array([1, 2, 3, 4]))

    const paymentChannelClaim = new PaymentChannelClaim()
    paymentChannelClaim.setChannel(channel)

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelClaimToJSON(paymentChannelClaim)

    // THEN the result is in the expected form.
    const expected: PaymentChannelClaimJSON = {
      Channel: Serializer.channelToJSON(channel),
      TransactionType: 'PaymentChannelClaim',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Serializes a PaymentChannelFund with all fields set.', function (): void {
    // GIVEN a PaymentChannelFund with all fields set.
    const amount = new Amount()
    amount.setValue(xrpTestUtils.makeXrpCurrencyAmount('10'))

    const channel = new Channel()
    channel.setValue(new Uint8Array([1, 2, 3, 4]))

    const expiration = new Expiration()
    expiration.setValue(5)

    const paymentChannelFund = new PaymentChannelFund()
    paymentChannelFund.setAmount(amount)
    paymentChannelFund.setChannel(channel)
    paymentChannelFund.setExpiration(expiration)

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelFundToJSON(paymentChannelFund)

    // THEN the result is in the expected form.
    const expected: PaymentChannelFundJSON = {
      Amount: Serializer.amountToJSON(amount)!,
      Channel: Serializer.channelToJSON(channel),
      Expiration: Serializer.expirationToJSON(expiration),
      TransactionType: 'PaymentChannelFund',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize a PaymentChannelFund with a malformed amount field.', function (): void {
    // GIVEN a PaymentChannelFund with a malformed amount field
    const amount = new Amount()

    const channel = new Channel()
    channel.setValue(new Uint8Array([1, 2, 3, 4]))

    const paymentChannelFund = new PaymentChannelFund()
    paymentChannelFund.setAmount(amount)
    paymentChannelFund.setChannel(channel)

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelFundToJSON(paymentChannelFund)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize a malformed PaymentChannelFund', function (): void {
    // GIVEN a malformed PaymentChannelFund/
    const paymentChannelFund = new PaymentChannelFund()

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelFundToJSON(paymentChannelFund)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a PaymentChannelClaim with all fields', function (): void {
    // GIVEN a PaymentChannelClaim with all fields set.
    const channel = new Channel()
    channel.setValue(new Uint8Array([1, 2, 3, 4]))

    const balance = new Balance()
    balance.setValue(xrpTestUtils.makeXrpCurrencyAmount('5'))

    const paymentChannelSignature = new PaymentChannelSignature()
    paymentChannelSignature.setValue(new Uint8Array([5, 6, 7, 8]))

    const publicKey = new PublicKey()
    publicKey.setValue(new Uint8Array([9, 10, 11, 12]))

    const amount = new Amount()
    amount.setValue(xrpTestUtils.makeXrpCurrencyAmount('6'))

    const paymentChannelClaim = new PaymentChannelClaim()
    paymentChannelClaim.setChannel(channel)
    paymentChannelClaim.setBalance(balance)
    paymentChannelClaim.setPaymentChannelSignature(paymentChannelSignature)
    paymentChannelClaim.setPublicKey(publicKey)
    paymentChannelClaim.setAmount(amount)

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelClaimToJSON(paymentChannelClaim)

    // THEN the result is in the expected form.
    const expected: PaymentChannelClaimJSON = {
      Channel: Serializer.channelToJSON(channel),
      Balance: Serializer.balanceToJSON(balance),
      Signature: Serializer.paymentChannelSignatureToJSON(
        paymentChannelSignature,
      ),
      PublicKey: Serializer.publicKeyToJSON(publicKey),
      Amount: Serializer.amountToJSON(amount),
      TransactionType: 'PaymentChannelClaim',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize a malfromed PaymentChannelClaim', function (): void {
    // GIVEN a malformed PaymentChannelClaim
    const paymentChannelClaim = new PaymentChannelClaim()

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelClaimToJSON(paymentChannelClaim)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a LimitAmount', function (): void {
    // GIVEN a LimitAmount
    const currencyAmount = xrpTestUtils.makeXrpCurrencyAmount('10')

    const limitAmount = new LimitAmount()
    limitAmount.setValue(currencyAmount)

    // WHEN the LimitAmount is serialized.
    const serialized = Serializer.limitAmountToJSON(limitAmount)

    // THEN the result is the serialized version of the inputs.
    assert.deepEqual(
      serialized,
      Serializer.currencyAmountToJSON(currencyAmount),
    )
  })

  it('Fails to serialize a malformed LimitAmount', function (): void {
    // GIVEN a malformed LimitAmount
    const limitAmount = new LimitAmount()

    // WHEN the LimitAmount is serialized.
    const serialized = Serializer.limitAmountToJSON(limitAmount)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a TrustSet with required fields', function (): void {
    // GIVEN a TrustSet with required fields.
    const currencyAmount = makeXrpCurrencyAmount('10')

    const limitAmount = new LimitAmount()
    limitAmount.setValue(currencyAmount)

    const trustSet = new TrustSet()
    trustSet.setLimitAmount(limitAmount)

    // WHEN the TrustSet is serialized.
    const serialized = Serializer.trustSetToJSON(trustSet)

    // THEN the result is as expected.
    const expected: TrustSetJSON = {
      LimitAmount: Serializer.limitAmountToJSON(limitAmount)!,
      TransactionType: 'TrustSet',
    }

    assert.deepEqual(serialized, expected)
  })

  it('Serializes a TrustSet with all fields', function (): void {
    // GIVEN a TrustSet with all fields.
    const currencyAmount = makeXrpCurrencyAmount('10')

    const limitAmount = new LimitAmount()
    limitAmount.setValue(currencyAmount)

    const qualityInValue = 6
    const qualityIn = new QualityIn()
    qualityIn.setValue(qualityInValue)

    const qualityOutValue = 7
    const qualityOut = new QualityOut()
    qualityOut.setValue(qualityOutValue)

    const trustSet = new TrustSet()
    trustSet.setLimitAmount(limitAmount)
    trustSet.setQualityIn(qualityIn)
    trustSet.setQualityOut(qualityOut)

    // WHEN the TrustSet is serialized.
    const serialized = Serializer.trustSetToJSON(trustSet)

    // THEN the result is as expected.
    const expected: TrustSetJSON = {
      LimitAmount: Serializer.limitAmountToJSON(limitAmount)!,
      QualityIn: Serializer.qualityInToJSON(qualityIn),
      QualityOut: Serializer.qualityOutToJSON(qualityOut),
      TransactionType: 'TrustSet',
    }

    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize a TrustSet missing limitAmount', function (): void {
    // GIVEN a TrustSet missing a limitAmount.
    const trustSet = new TrustSet()

    // WHEN the TrustSet is serialized.
    const serialized = Serializer.trustSetToJSON(trustSet)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize a TrustSet with malformed limitAmount', function (): void {
    // GIVEN a TrustSet with a malformed limitAmount.
    const limitAmount = new LimitAmount()

    const trustSet = new TrustSet()
    trustSet.setLimitAmount(limitAmount)

    // WHEN the TrustSet is serialized.
    const serialized = Serializer.trustSetToJSON(trustSet)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Serializes a SignerEntry', function (): void {
    // GIVEN a SignerEntry
    const account = new Account()
    account.setValue(testAccountAddress)

    const signerWeight = new SignerWeight()
    signerWeight.setValue(1)

    const signerEntry = new SignerEntry()
    signerEntry.setAccount(account)
    signerEntry.setSignerWeight(signerWeight)

    // WHEN the SignerEntry is serialized.
    const serialized = Serializer.signerEntryToJSON(signerEntry)

    // THEN the result is the expected form.
    const expected = {
      Account: Serializer.accountToJSON(account)!,
      SignerWeight: Serializer.signerWeightToJSON(signerWeight)!,
    }
    assert.deepEqual(serialized, expected)
  })

  it('Serializes a PaymentChannelCreate with mandatory fields', function (): void {
    // GIVEN a PaymentChannelCreate with only mandatory fields set.
    const amount = new Amount()
    amount.setValue(xrpTestUtils.makeXrpCurrencyAmount('11'))

    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const settleDelay = new SettleDelay()
    settleDelay.setValue(12)

    const publicKey = new PublicKey()
    publicKey.setValue(new Uint8Array([1, 2, 3, 4]))

    const paymentChannelCreate = new PaymentChannelCreate()
    paymentChannelCreate.setAmount(amount)
    paymentChannelCreate.setDestination(destination)
    paymentChannelCreate.setSettleDelay(settleDelay)
    paymentChannelCreate.setPublicKey(publicKey)

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelCreateToJSON(
      paymentChannelCreate,
    )

    // THEN the result is in the expected form.
    const expected: PaymentChannelCreateJSON = {
      Amount: Serializer.amountToJSON(amount)!,
      Destination: Serializer.destinationToJSON(destination)!,
      SettleDelay: Serializer.settleDelayToJSON(settleDelay),
      PublicKey: Serializer.publicKeyToJSON(publicKey),
      TransactionType: 'PaymentChannelCreate',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Serializes a PaymentChannelCreate with all fields', function (): void {
    // GIVEN a PaymentChannelCreate with all fields set.
    const amount = new Amount()
    amount.setValue(xrpTestUtils.makeXrpCurrencyAmount('11'))

    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const settleDelay = new SettleDelay()
    settleDelay.setValue(12)

    const publicKey = new PublicKey()
    publicKey.setValue(new Uint8Array([1, 2, 3, 4]))

    const cancelAfter = new CancelAfter()
    cancelAfter.setValue(13)

    const destinationTag = new DestinationTag()
    destinationTag.setValue(14)

    const paymentChannelCreate = new PaymentChannelCreate()
    paymentChannelCreate.setAmount(amount)
    paymentChannelCreate.setDestination(destination)
    paymentChannelCreate.setSettleDelay(settleDelay)
    paymentChannelCreate.setPublicKey(publicKey)
    paymentChannelCreate.setCancelAfter(cancelAfter)
    paymentChannelCreate.setDestinationTag(destinationTag)

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelCreateToJSON(
      paymentChannelCreate,
    )

    // THEN the result is in the expected form.
    const expected: PaymentChannelCreateJSON = {
      Amount: Serializer.amountToJSON(amount)!,
      Destination: Serializer.destinationToJSON(destination)!,
      SettleDelay: Serializer.settleDelayToJSON(settleDelay),
      PublicKey: Serializer.publicKeyToJSON(publicKey),
      CancelAfter: Serializer.cancelAfterToJSON(cancelAfter),
      DestinationTag: Serializer.destinationTagToJSON(destinationTag),
      TransactionType: 'PaymentChannelCreate',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize a SignerEntry with malformed components', function (): void {
    // GIVEN a SignerEntry with a malformed account
    const account = new Account()

    const signerWeight = new SignerWeight()
    signerWeight.setValue(1)

    const signerEntry = new SignerEntry()
    signerEntry.setAccount(account)
    signerEntry.setSignerWeight(signerWeight)

    // WHEN the SignerEntry is serialized.
    const serialized = Serializer.signerEntryToJSON(signerEntry)

    // THEN the result is undefined
    assert.isUndefined(serialized)
  })

  it('Serializes a list of signer entries', function (): void {
    // GIVEN a list of signer entries.
    const account1 = new Account()
    account1.setValue(xrpTestUtils.makeAccountAddress('r1'))

    const signerWeight1 = new SignerWeight()
    signerWeight1.setValue(1)

    const signerEntry1 = new SignerEntry()
    signerEntry1.setAccount(account1)
    signerEntry1.setSignerWeight(signerWeight1)

    const account2 = new Account()
    account2.setValue(xrpTestUtils.makeAccountAddress('r2'))

    const signerWeight2 = new SignerWeight()
    signerWeight2.setValue(2)

    const signerEntry2 = new SignerEntry()
    signerEntry2.setAccount(account2)
    signerEntry2.setSignerWeight(signerWeight2)

    const signerEntryList = [signerEntry1, signerEntry2]

    // WHEN the list is serialized.
    const serialized = Serializer.signerEntryListToJSON(signerEntryList)

    // THEN the result is the serialized versions of the list elements.
    const expected = [
      Serializer.signerEntryToJSON(signerEntry1)!,
      Serializer.signerEntryToJSON(signerEntry2)!,
    ]
    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize a list of signer entries where an entry is malformed', function (): void {
    // GIVEN a list of signer entries with a malformed second entry..
    const account1 = new Account()
    account1.setValue(xrpTestUtils.makeAccountAddress('r1'))

    const signerWeight1 = new SignerWeight()
    signerWeight1.setValue(1)

    const signerEntry1 = new SignerEntry()
    signerEntry1.setAccount(account1)
    signerEntry1.setSignerWeight(signerWeight1)

    const signerEntry2 = new SignerEntry()
    const signerEntryList = [signerEntry1, signerEntry2]

    // WHEN the list is serialized.
    const serialized = Serializer.signerEntryListToJSON(signerEntryList)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize a PaymentChannelCreate with a malformed amount', function (): void {
    // GIVEN a PaymentChannelCreate with a malformed amount field.
    const amount = new Amount()

    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const settleDelay = new SettleDelay()
    settleDelay.setValue(12)

    const publicKey = new PublicKey()
    publicKey.setValue(new Uint8Array([1, 2, 3, 4]))

    const paymentChannelCreate = new PaymentChannelCreate()
    paymentChannelCreate.setAmount(amount)
    paymentChannelCreate.setDestination(destination)
    paymentChannelCreate.setSettleDelay(settleDelay)
    paymentChannelCreate.setPublicKey(publicKey)

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelCreateToJSON(
      paymentChannelCreate,
    )

    // THEN the result is undefined
    assert.isUndefined(serialized)
  })

  it('Fails to serialize a malformed SignerEntry', function (): void {
    // GIVEN a malformed SignerEntry
    const signerEntry = new SignerEntry()

    // WHEN the SignerEntry is serialized.
    const serialized = Serializer.signerEntryToJSON(signerEntry)

    // THEN the result is undefined
    assert.isUndefined(serialized)
  })

  it('Fails to serialize a malformed PaymentChannelCreate', function (): void {
    // GIVEN a malformed PaymentChannelCreate.
    const paymentChannelCreate = new PaymentChannelCreate()

    // WHEN it is serialized.
    const serialized = Serializer.paymentChannelCreateToJSON(
      paymentChannelCreate,
    )

    // THEN the result is undefined
    assert.isUndefined(serialized)
  })

  it('Serializes a SignerListSet', function (): void {
    // GIVEN a SignerListSet
    const signerQuorum = new SignerQuorum()
    signerQuorum.setValue(1)

    const account1 = new Account()
    account1.setValue(makeAccountAddress('r1'))

    const signerWeight1 = new SignerWeight()
    signerWeight1.setValue(1)

    const signerEntry1 = new SignerEntry()
    signerEntry1.setAccount(account1)
    signerEntry1.setSignerWeight(signerWeight1)

    const account2 = new Account()
    account2.setValue(makeAccountAddress('r2'))

    const signerWeight2 = new SignerWeight()
    signerWeight2.setValue(2)

    const signerEntry2 = new SignerEntry()
    signerEntry2.setAccount(account2)
    signerEntry2.setSignerWeight(signerWeight2)

    const signerEntriesList = [signerEntry1, signerEntry2]

    const signerListSet = new SignerListSet()
    signerListSet.setSignerQuorum(signerQuorum)
    signerListSet.setSignerEntriesList(signerEntriesList)

    // WHEN it is serialized.
    const serialized = Serializer.signerListSetToJSON(signerListSet)

    // THEN the result is the expected form.
    const expected: SignerListSetJSON = {
      SignerEntries: Serializer.signerEntryListToJSON(signerEntriesList)!,
      SignerQuorum: Serializer.signerQuorumToJSON(signerQuorum)!,
      TransactionType: 'SignerListSet',
    }
    assert.deepEqual(serialized, expected)
  })

  it('Fails to serialize a SignerListSet with malformed components', function (): void {
    // GIVEN a SignerListSet with a malformed SignerEntriesList.
    const signerQuorum = new SignerQuorum()
    signerQuorum.setValue(1)

    const signerEntry = new SignerEntry()

    const signerEntriesList = [signerEntry]

    const signerListSet = new SignerListSet()
    signerListSet.setSignerQuorum(signerQuorum)
    signerListSet.setSignerEntriesList(signerEntriesList)

    // WHEN it is serialized.
    const serialized = Serializer.signerListSetToJSON(signerListSet)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('Fails to serialize a malformed SignerListSet', function (): void {
    // GIVEN a malformd SignerListSet.
    const signerListSet = new SignerListSet()

    // WHEN it is serialized.
    const serialized = Serializer.signerListSetToJSON(signerListSet)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })
})
