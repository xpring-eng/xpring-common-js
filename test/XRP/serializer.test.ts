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
  DeliverMin,
  CheckID,
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
} from '../../src/XRP/generated/org/xrpl/rpc/v1/common_pb'
import {
  Memo,
  Payment,
  Transaction,
  DepositPreauth,
  AccountSet,
  AccountDelete,
  CheckCancel,
  EscrowCancel,
  CheckCash,
  OfferCancel,
} from '../../src/XRP/generated/org/xrpl/rpc/v1/transaction_pb'
import Serializer, {
  EscrowCancelJSON,
  AccountSetJSON,
  DepositPreauthJSON,
  TransactionJSON,
  PaymentJSON,
} from '../../src/XRP/serializer'
import XrpUtils from '../../src/XRP/xrp-utils'

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
const publicKey =
  '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE'
const fee = '10'
const accountClassicAddress = 'r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ'
const accountXAddress = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'
const dataForMemo = Utils.toBytes('I forgot to pick up Carl...')
const typeForMemo = Utils.toBytes('meme')
const formatForMemo = Utils.toBytes('jaypeg')
const offerSequenceNumber = 1234

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

/**
 * Returns a CurrencyAmount representing drops of XRP.
 *
 * @param drops - The number of drops to represent.
 * @returns A CurrencyAmount representing the input.
 */
function makeXrpCurrencyAmount(drops: string): CurrencyAmount {
  const xrpDropsAmount = makeXrpDropsAmount(drops)

  const currencyAmount = new CurrencyAmount()
  currencyAmount.setXrpAmount(xrpDropsAmount)

  return currencyAmount
}

describe('serializer', function (): void {
  it('serializes a payment in XRP from a classic address', function (): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = makePaymentTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
      accountClassicAddress,
      publicKey,
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
      sequenceValue,
      accountXAddress,
      publicKey,
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
      sequenceValue,
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
      sequenceValue,
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
      sequenceValue,
      accountClassicAddress,
      publicKey,
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
      sequenceValue,
      accountClassicAddress,
      publicKey,
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
      sequenceValue,
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
    const expectedJSON: TransactionJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationXAddressWithoutTag,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequenceValue,
      Sequence: sequenceValue,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
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
    const transaction = makeDepositPreauth(
      address,
      undefined,
      fee,
      lastLedgerSequenceValue,
      sequenceValue,
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
      sequenceValue,
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
    const accountSet = makeAccountSet(
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
      sequenceValue,
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
    const xrpDropsAmount = makeXrpDropsAmount(dropsValue)

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
    const xrpDropsAmount = makeXrpDropsAmount('10')

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
    const expected = {
      CheckID: Serializer.checkIDToJSON(checkId),
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
    const xrpDropsAmount = makeXrpDropsAmount('10')

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
    const expected = {
      Destination: Serializer.destinationToJSON(destination)!,
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
    const expected = {
      Destination: Serializer.destinationToJSON(destination)!,
      DestinationTag: Serializer.destinationTagToJSON(destinationTag),
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

    const issuedCurrencyAmount = makeIssuedCurrencyAmount(
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

    const issuedCurrencyAmount = makeIssuedCurrencyAmount(
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
    const expected = {
      OfferSequence: Serializer.offerSequenceToJSON(offerSequence),
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
    const xrpAmount = makeXrpDropsAmount('10')

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
    // GIVEN a Payment with all mandatory fields.
    // TODO(keefertaylor): Add additional fields here when they are implemented.
    const transactionAmount = makeXrpCurrencyAmount('10')

    const amount = new Amount()
    amount.setValue(transactionAmount)

    const destination = new Destination()
    destination.setValue(testAccountAddress)

    const destinationTag = new DestinationTag()
    destinationTag.setValue(11)

    const invoiceId = new InvoiceID()
    invoiceId.setValue(new Uint8Array([1, 2, 3, 4]))

    const deliverMinAmount = makeXrpCurrencyAmount('12')

    const deliverMin = new DeliverMin()
    deliverMin.setValue(deliverMinAmount)

    const payment = new Payment()
    payment.setAmount(amount)
    payment.setDeliverMin(deliverMin)
    payment.setDestination(destination)
    payment.setDestinationTag(destinationTag)
    payment.setInvoiceId(invoiceId)

    // WHEN it is serialized.
    const serialized = Serializer.paymentToJSON(payment)

    // THEN the result is in the expected form.
    const expected: PaymentJSON = {
      Amount: Serializer.amountToJSON(amount)!,
      DeliverMin: Serializer.deliverMinToJSON(deliverMin),
      Destination: Serializer.destinationToJSON(destination)!,
      DestinationTag: Serializer.destinationTagToJSON(destinationTag),
      InvoiceID: Serializer.invoiceIdToJSON(invoiceId),
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
    const xrpDropsAmount = makeXrpDropsAmount('10')

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
    const expected = {
      CheckID: Serializer.checkIDToJSON(checkId),
      Amount: Serializer.amountToJSON(amount),
    }
    assert.deepEqual(serialized, expected)
  })

  it('Serializes a CheckCash with a DeliverMin', function (): void {
    // GIVEN a CheckCash with all fields set.
    const xrpDropsAmount = makeXrpDropsAmount('10')

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
    const expected = {
      CheckID: Serializer.checkIDToJSON(checkId),
      DeliverMin: Serializer.deliverMinToJSON(deliverMin),
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
})
