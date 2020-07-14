/* eslint-disable  max-lines --
 * Allow many lines of tests.
 * TODO(keefertaylor): Remove this if hbergren@ agrees to disable this rule for tests globally.
 */

import 'mocha'
import { assert } from 'chai'

import Utils from '../../src/Common/utils'
import { AccountAddress } from '../../src/XRP/generated/org/xrpl/rpc/v1/account_pb'
import {
  CurrencyAmount,
  XRPDropsAmount,
} from '../../src/XRP/generated/org/xrpl/rpc/v1/amount_pb'
import {
  Account,
  Amount,
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
} from '../../src/XRP/generated/org/xrpl/rpc/v1/common_pb'
import {
  Memo,
  Payment,
  Transaction,
  DepositPreauth,
  AccountSet,
} from '../../src/XRP/generated/org/xrpl/rpc/v1/transaction_pb'
import Serializer from '../../src/XRP/serializer'
import XrpUtils from '../../src/XRP/xrp-utils'

/** Constants for transactions. */
const value = '1000'
const destinationClassicAddress = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
const destinationXAddressWithoutTag =
  'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc'
const destinationXAddressWithTag =
  'XVPcpSm47b1CZkf5AkKM9a84dQHe3mTAxgxfLw2qYoe7Boa'
const tag = 12345
const sequence = 1
const lastLedgerSequence = 20
const publicKey =
  '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE'
const fee = '10'
const accountClassicAddress = 'r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ'
const accountXAddress = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'
const dataForMemo = Utils.toBytes('I forgot to pick up Carl...')
const typeForMemo = Utils.toBytes('meme')
const formatForMemo = Utils.toBytes('jaypeg')

// TODO(keefertaylor): Helper functions are becoming unweildy. Refactor to an external helper file.

/* eslint-disable no-shadow, max-params --
 * The values we are shadowing are only used as inputs for this function,
 * and it's fine to have a ton of parameters because this function is only used for testing purposes.
 */
/**
 * Create a new `Transaction` object with the given inputs.
 *
 * @param value - The amount of XRP to send, in drops.
 * @param destinationAddress - The destination address.
 * @param fee - The amount of XRP to use as a fee, in drops.
 * @param lastLedgerSequenceNumber - The last ledger sequence the transaction will be valid in.
 * @param sequenceNumber - The sequence number for the sending account.
 * @param senderAddress - The address of the sending account.
 * @param publicKey - The public key of the sending account, encoded as a hexadecimal string.
 *
 * @returns A new `Transaction` object comprised of the provided Transaction properties.
 */
function makePaymentTransaction(
  value: string,
  destinationAddress: string,
  fee: string,
  lastLedgerSequenceNumber: number,
  sequenceNumber: number,
  senderAddress: string | undefined,
  publicKey: string,
): Transaction {
  const paymentAmount = new XRPDropsAmount()
  paymentAmount.setDrops(value)

  const currencyAmount = new CurrencyAmount()
  currencyAmount.setXrpAmount(paymentAmount)

  const amount = new Amount()
  amount.setValue(currencyAmount)

  const destinationAccountAddress = new AccountAddress()
  destinationAccountAddress.setAddress(destinationAddress)

  const destination = new Destination()
  destination.setValue(destinationAccountAddress)

  const payment = new Payment()
  payment.setDestination(destination)
  payment.setAmount(amount)

  const transaction = makeBaseTransaction(
    fee,
    lastLedgerSequenceNumber,
    sequenceNumber,
    senderAddress,
    publicKey,
  )
  transaction.setPayment(payment)

  return transaction
}

/**
 * Create a new `DepositPreauth` object with the given inputs.
 *
 * Note: Either the `authorizeAddress` or `unauthorizeAddress`, but not both, must be set to get a
 * valid output. This precondition is not enforced by the function.
 *
 * @param authorizeAddress - The address to authorize.
 * @param unauthorizeAddress - The address to unauthorize.
 * @param fee - The amount of XRP to use as a fee, in drops.
 * @param lastLedgerSequenceNumber - The last ledger sequence the transaction will be valid in.
 * @param sequenceNumber - The sequence number for the sending account.
 * @param senderAddress - The address of the sending account.
 * @param publicKey - The public key of the sending account, encoded as a hexadecimal string.
 *
 * @returns A new `Transaction` object comprised of the provided properties.
 */
function makeDepositPreauth(
  authorizeAddress: string | undefined,
  unauthorizeAddress: string | undefined,
  fee: string,
  lastLedgerSequenceNumber: number,
  sequenceNumber: number,
  senderAddress: string | undefined,
  publicKey: string,
): Transaction {
  const depositPreauth = new DepositPreauth()
  if (authorizeAddress) {
    const accountAddress = new AccountAddress()
    accountAddress.setAddress(authorizeAddress)

    const authorize = new Authorize()
    authorize.setValue(accountAddress)

    depositPreauth.setAuthorize(authorize)
  } else if (unauthorizeAddress) {
    const accountAddress = new AccountAddress()
    accountAddress.setAddress(unauthorizeAddress)

    const unauthorize = new Unauthorize()
    unauthorize.setValue(accountAddress)

    depositPreauth.setUnauthorize(unauthorize)
  }

  const transaction = makeBaseTransaction(
    fee,
    lastLedgerSequenceNumber,
    sequenceNumber,
    senderAddress,
    publicKey,
  )
  transaction.setDepositPreauth(depositPreauth)

  return transaction
}

/**
 * Make a Transaction representing an AccountSet operation.
 *
 * @param clearFlagValue - The ClearFlag value to use for the AccountSet.
 * @param domainValue - The Domain value to use for the AccountSet.
 * @param emailHashValue - The EmailHash value to use for the AccountSet.
 * @param messageKeyValue - The MesssageKey value to use for AccountSet.
 * @param setFlagValue - The SetFlag value to use for the AccountSet.
 * @param transferRateValue - The TransferRate value to use for the Accountset.
 * @param tickSizeValue - The TickSize value to use for the AccountSet.
 * @param fee - The amount of XRP to use as a fee, in drops.
 * @param lastLedgerSequenceNumber - The last ledger sequence the transaction will be valid in.
 * @param sequenceNumber - The sequence number for the sending account.
 * @param senderAddress - The address of the sending account.
 * @param publicKey - The public key of the sending account, encoded as a hexadecimal string.
 * @returns A new `Transaction` object comprised of the provided properties.
 */
function makeAccountSetTransaction(
  clearFlagValue: number | undefined,
  domainValue: string | undefined,
  emailHashValue: Uint8Array | undefined,
  messageKeyValue: Uint8Array | undefined,
  setFlagValue: number | undefined,
  transferRateValue: number | undefined,
  tickSizeValue: number | undefined,
  fee: string,
  lastLedgerSequenceNumber: number,
  sequenceNumber: number,
  senderAddress: string | undefined,
  publicKey: string,
): Transaction {
  const accountSet = makeAccountSet(
    clearFlagValue,
    domainValue,
    emailHashValue,
    messageKeyValue,
    setFlagValue,
    transferRateValue,
    tickSizeValue,
  )
  const transaction = makeBaseTransaction(
    fee,
    lastLedgerSequenceNumber,
    sequenceNumber,
    senderAddress,
    publicKey,
  )
  transaction.setAccountSet(accountSet)

  return transaction
}

/**
 * Make an AccountSet protocol buffer from the given inputs.
 *
 * @param clearFlagValue - The ClearFlag value to use for the AccountSet.
 * @param domainValue - The Domain value to use for the AccountSet.
 * @param emailHashValue - The EmailHash value to use for the AccountSet.
 * @param messageKeyValue - The MesssageKey value to use for AccountSet.
 * @param setFlagValue - The SetFlag value to use for the AccountSet.
 * @param transferRateValue - The TransferRate value to use for the Accountset.
 * @param tickSizeValue - The TickSize value to use for the AccountSet.
 * @returns An AccountSet protocol buffer from the given inputs.
 */
function makeAccountSet(
  clearFlagValue: number | undefined,
  domainValue: string | undefined,
  emailHashValue: Uint8Array | undefined,
  messageKeyValue: Uint8Array | undefined,
  setFlagValue: number | undefined,
  transferRateValue: number | undefined,
  tickSizeValue: number | undefined,
): AccountSet {
  const accountSet = new AccountSet()
  accountSet.setClearFlag()

  if (clearFlagValue !== undefined) {
    const clearFlag = new ClearFlag()
    clearFlag.setValue(clearFlagValue)
    accountSet.setClearFlag(clearFlag)
  }

  if (domainValue !== undefined) {
    const domain = new Domain()
    domain.setValue(domainValue)
    accountSet.setDomain(domain)
  }

  if (emailHashValue !== undefined) {
    const emailHash = new EmailHash()
    emailHash.setValue(emailHashValue)
    accountSet.setEmailHash(emailHash)
  }

  if (messageKeyValue !== undefined) {
    const messageKey = new MessageKey()
    messageKey.setValue(messageKeyValue)
    accountSet.setMessageKey(messageKey)
  }

  if (setFlagValue !== undefined) {
    const setFlag = new SetFlag()
    setFlag.setValue(setFlagValue)
    accountSet.setSetFlag(setFlag)
  }

  if (transferRateValue !== undefined) {
    const transferRate = new TransferRate()
    transferRate.setValue(transferRateValue)
    accountSet.setTransferRate(transferRate)
  }

  if (tickSizeValue !== undefined) {
    const tickSize = new TickSize()
    tickSize.setValue(tickSizeValue)
    accountSet.setTickSize(tickSize)
  }

  return accountSet
}

/**
 * Make a transaction protocol buffer containing all the common fields.
 *
 * @param fee - The amount of XRP to use as a fee, in drops.
 * @param lastLedgerSequenceNumber - The last ledger sequence the transaction will be valid in.
 * @param sequenceNumber - The sequence number for the sending account.
 * @param senderAddress - The address of the sending account.
 * @param publicKey - The public key of the sending account, encoded as a hexadecimal string.
 *
 * @returns A transaction with common fields set.
 */
function makeBaseTransaction(
  fee: string,
  lastLedgerSequenceNumber: number,
  sequenceNumber: number,
  senderAddress: string | undefined,
  publicKey: string,
): Transaction {
  const transactionFee = new XRPDropsAmount()
  transactionFee.setDrops(fee)

  const sequence = new Sequence()
  sequence.setValue(sequenceNumber)

  const lastLedgerSequence = new Sequence()
  lastLedgerSequence.setValue(lastLedgerSequenceNumber)

  const signingPublicKey = new SigningPublicKey()
  signingPublicKey.setValue(Utils.toBytes(publicKey))

  const transaction = new Transaction()
  transaction.setFee(transactionFee)
  transaction.setSequence(sequence)
  transaction.setSigningPublicKey(signingPublicKey)
  transaction.setLastLedgerSequence(lastLedgerSequence)

  // Account is an optional input so that malformed transaction serialization can be tested.
  if (senderAddress) {
    const senderAccountAddress = new AccountAddress()
    senderAccountAddress.setAddress(senderAddress)

    const senderAccount = new Account()
    senderAccount.setValue(senderAccountAddress)

    transaction.setAccount(senderAccount)
  }

  return transaction
}
/* eslint-enable no-shadow, max-params */

describe('serializer', function (): void {
  it('serializes a payment in XRP from a classic address', function (): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = makePaymentTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes a payment in XRP from an X-Address with no tag', function (): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = makePaymentTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      accountXAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: XrpUtils.decodeXAddress(accountXAddress)!.address,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('fails to serializes a payment in XRP from an X-Address with a tag', function (): void {
    // GIVEN a transaction which represents a payment denominated in XRP from a sender with a tag.
    const account = XrpUtils.encodeXAddress(accountClassicAddress, tag)
    const transaction = makePaymentTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      account,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('fails to serializes a payment in XRP when account is undefined', function (): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = makePaymentTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      undefined,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('serializes a payment to an X-address with a tag in XRP', function (): void {
    // GIVEN a transaction which represents a payment to a destination and tag, denominated in XRP.
    const transaction = makePaymentTransaction(
      value,
      destinationXAddressWithTag,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      DestinationTag: tag,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes a payment to an X-address without a tag in XRP', function (): void {
    // GIVEN a transaction which represents a payment to a destination without a tag, denominated in XRP.
    const transaction = makePaymentTransaction(
      value,
      destinationXAddressWithoutTag,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes a payment with a memo', function (): void {
    // GIVEN a transaction which represents a payment to a destination without a tag, denominated in XRP, with a dank
    // meme for a memo
    const transaction = makePaymentTransaction(
      value,
      destinationXAddressWithoutTag,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
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
    const expectedJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
      Memos: [
        {
          Memo: {
            MemoData: dataForMemo,
            MemoType: typeForMemo,
            MemoFormat: formatForMemo,
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
        MemoData: dataForMemo,
        MemoType: typeForMemo,
        MemoFormat: formatForMemo,
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

    const expectedJSON = {
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

    const expectedJSON = {
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
    const transaction = makeDepositPreauth(
      address,
      undefined,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized THEN the result exists.
    assert.exists(Serializer.transactionToJSON(transaction))
  })

  it('serializes a transaction representing a malformed DepositPreAuth', function (): void {
    // GIVEN a transaction representing a malformed DepositPreauth.
    // Neither `authorizeAddress` or `unauthorizeAddress` are defined which creates a malformed transaction.
    const transaction = makeDepositPreauth(
      undefined,
      undefined,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized THEN the result is undefined.
    assert.isUndefined(Serializer.transactionToJSON(transaction))
  })

  it('serializes an AccountSet with no fields set', function (): void {
    // GIVEN an AccountSet with no fields set.
    const accountSet = makeAccountSet(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    )
    const expectedJSON = {
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
    const accountSet = makeAccountSet(
      clearFlagValue,
      domainValue,
      emailHashValue,
      messageKeyValue,
      setFlagValue,
      transferRateValue,
      tickSizeValue,
    )

    const expectedJSON = {
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
    // GIVEN an AccountAet with no fields set.
    const transaction = makeAccountSetTransaction(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized THEN the result exists.
    assert.exists(Serializer.transactionToJSON(transaction))
  })
})
