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
  Currency,
  IssuedCurrencyAmount,
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
  LastLedgerSequence,
  DestinationTag,
  InvoiceID,
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
const lastLedgerSequenceValue = 20
const publicKey =
  '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE'
const fee = '10'
const accountClassicAddress = 'r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ'
const accountXAddress = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'
const dataForMemo = Utils.toBytes('I forgot to pick up Carl...')
const typeForMemo = Utils.toBytes('meme')
const formatForMemo = Utils.toBytes('jaypeg')

const testAccountAddress = new AccountAddress()
testAccountAddress.setAddress(destinationClassicAddress)

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

/**
 * Make a PathElement.
 *
 * Note: A valid path element should have either an account OR a currency and issuer but never both.
 *
 * @param account - The account to ripple through. Must not be provided if currency and issuer are provided.
 * @param currencyCode - The currency code of the new currency on the path. Must not be provided if account is provided.
 * @param issuer - The issuer of the new currency. Must not be provided if account is provided.
 * @returns A PathElement with the given properties.
 */
function makePathElement(
  account: AccountAddress | undefined,
  currencyCode: Uint8Array | undefined,
  issuer: AccountAddress | undefined,
) {
  const pathElement = new Payment.PathElement()

  if (account !== undefined) {
    pathElement.setAccount(account)
  }

  if (currencyCode !== undefined) {
    const currency = new Currency()
    currency.setCode(currencyCode)
    pathElement.setCurrency(currency)
  }

  if (issuer !== undefined) {
    pathElement.setIssuer(issuer)
  }

  return pathElement
}

/**
 * Make an XRPDropsAmount.
 *
 * @param drops - A numeric string representing the number of drops.
 * @returns A new XRPDropsAmount.
 */
function makeXrpDropsAmount(drops: string) {
  const xrpDropsAmount = new XRPDropsAmount()
  xrpDropsAmount.setDrops(drops)

  return xrpDropsAmount
}

/**
 * Make an IssuedCurrencyAmount.
 *
 * @param accountAddress - The account address.
 * @param issuedCurrencyValue - The value.
 * @param currency - The currency.
 * @returns A new IssuedCurrencyAmount.
 */
function makeIssuedCurrencyAmount(
  accountAddress: AccountAddress,
  issuedCurrencyValue: string,
  currency: Currency,
) {
  const issuedCurrency = new IssuedCurrencyAmount()
  issuedCurrency.setIssuer(accountAddress)
  issuedCurrency.setValue(issuedCurrencyValue)
  issuedCurrency.setCurrency(currency)

  return issuedCurrency
}

describe('serializer', function (): void {
  it('serializes a payment in XRP from a classic address', function (): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = makePaymentTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequenceValue,
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
      LastLedgerSequence: lastLedgerSequenceValue,
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
      lastLedgerSequenceValue,
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
      LastLedgerSequence: lastLedgerSequenceValue,
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
      lastLedgerSequenceValue,
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
      lastLedgerSequenceValue,
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
      lastLedgerSequenceValue,
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
      LastLedgerSequence: lastLedgerSequenceValue,
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
      lastLedgerSequenceValue,
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
      LastLedgerSequence: lastLedgerSequenceValue,
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
      lastLedgerSequenceValue,
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
      LastLedgerSequence: lastLedgerSequenceValue,
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
      lastLedgerSequenceValue,
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
      lastLedgerSequenceValue,
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
    // GIVEN an AccountSet with no fields set.
    const transaction = makeAccountSetTransaction(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      fee,
      lastLedgerSequenceValue,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized THEN the result exists.
    assert.exists(Serializer.transactionToJSON(transaction))
  })

  it('serializes a PathElement with account', function (): void {
    // GIVEN a PathElement with an account set.
    const pathElement = makePathElement(
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
    const pathElement = makePathElement(
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
    const pathElement1 = makePathElement(
      testAccountAddress,
      undefined,
      undefined,
    )

    const currencyCode = new Uint8Array([0, 1, 2, 3])
    const pathElement2 = makePathElement(
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

    const issuedCurrency = makeIssuedCurrencyAmount(
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

    const issuedCurrency = makeIssuedCurrencyAmount(
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
    const xrpDropsAmount = makeXrpDropsAmount(dropsValue)

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

    const issuedCurrencyAmount = makeIssuedCurrencyAmount(
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
})
