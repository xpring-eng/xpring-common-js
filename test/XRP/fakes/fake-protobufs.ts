/* eslint-disable complexity -- long functions are fine here */
/* eslint-disable max-statements -- long functions are fine here */
/* eslint-disable max-lines -- lots of test data */
/* eslint-disable max-len -- long variable names and function names */
import { AccountAddress } from '../../../src/XRP/generated/org/xrpl/rpc/v1/account_pb'
import {
  CurrencyAmount,
  XRPDropsAmount,
  IssuedCurrencyAmount,
  Currency,
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/amount_pb'
import {
  Destination,
  Sequence,
  Account,
  Amount,
  DestinationTag,
  InvoiceID,
  DeliverMin,
  SendMax,
  MemoData,
  LastLedgerSequence,
  SourceTag,
  ClearFlag,
  Domain,
  EmailHash,
  MessageKey,
  SetFlag,
  TickSize,
  TransferRate,
  LimitAmount,
  QualityIn,
  QualityOut,
  TakerGets,
  TakerPays,
  OfferSequence,
  Expiration,
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/common_pb'
import {
  AccountSet,
  Payment,
  Transaction,
  Memo,
  TrustSet,
  OfferCreate,
  OfferCancel,
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/transaction_pb'
import xrpTestUtils from '../helpers/xrp-test-utils'

// Constant generator
/**
 * Helper function for generating sample data.
 *
 * @param arrayLength - The desired array length.
 * @param startValue - The first value in the array.
 *
 * @returns A UInt8Array with random data with the given length.
 */
function generateValidUint8Array(
  arrayLength: number,
  startValue = 0,
): Uint8Array {
  const numbers = new Array(arrayLength)
  for (let index = startValue; index < arrayLength; index++) {
    numbers[index] = index + 1
  }
  return new Uint8Array(numbers)
}

// Constants
const fakeSignature = 'DEADBEEF'
const value = '1000'
const currencyName = 'BTC'
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
const currencyCode1 = generateValidUint8Array(5)
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
const currencyCode2 = generateValidUint8Array(5, 4)
const issuedCurrencyValue = '100'
const destinationAddress = 'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc'
const issuerAddress = 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'
const address1 = 'rQ3fNyLjbvcDaPNS4EAJY8aT9zR3uGk17c'
const address2 = 'r4L6ZLHkTytPqDR81H1ysCr6qGv9oJJAKi'
const address3 = 'rBM3QGATGQHRCBU8KtAvNvSHZrbJhMhWxA'
const invalidAddress = 'badAddress'
const fee = '10'
const sequenceNumber = 1
const account = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'
// invoiceId value should be either a base64 string or a 32-byte array representing 64 hex chars (256 bits)
const invoiceIdValue = 'ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0='
const deliverMinValue = '10'
const sendMaxValue = '13'
const destinationTagValue = 4
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
const testMemoData = generateValidUint8Array(3, 10)
const sourceTagValue = 5
const lastLedgerSequenceValue = 78652515
const clearFlagValue = 5
const domainValue = 'testdomain'
const HASH_LENGTH = 16
const emailHashValue = generateValidUint8Array(HASH_LENGTH)
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
const messageKeyValue = generateValidUint8Array(3)
const setFlagValue = 4
const transferRateValue = 1234567890
const transferRateValueNoFee = 0
const tickSizeValue = 7
const tickSizeValueDisable = 0
const qualityInValue = 5
const qualityInZero = 0
const qualityOutValue = 7
const qualityOutZero = 0
const offerSequenceValue = 1
const expirationValue = 1146684800 // units are seconds since the ripple epoch

// Objects for Transactions

// AccountAddress
const destinationAccountAddress = new AccountAddress()
destinationAccountAddress.setAddress(destinationAddress)

const issuerAccountAddress = new AccountAddress()
issuerAccountAddress.setAddress(issuerAddress)

const invalidAccountAddress = new AccountAddress()
invalidAccountAddress.setAddress(invalidAddress)

const senderAccountAddress = new AccountAddress()
senderAccountAddress.setAddress(account)

// Account
const accountProto = new Account()
accountProto.setValue(senderAccountAddress)

// Destination
const destination = new Destination()
destination.setValue(destinationAccountAddress)

const invalidDestination = new Destination()
invalidDestination.setValue(invalidAccountAddress)

// DestinationTag
const destinationTag = new DestinationTag()
destinationTag.setValue(destinationTagValue)

// Currency/XRP/IssuedCurrency
const testCurrencyProto = new Currency()
testCurrencyProto.setName(currencyName)

const paymentAmount = new XRPDropsAmount()
paymentAmount.setDrops(value)

const issuedCurrencyAmount = new IssuedCurrencyAmount()
issuedCurrencyAmount.setCurrency(testCurrencyProto)
issuedCurrencyAmount.setIssuer(issuerAccountAddress)
issuedCurrencyAmount.setValue(issuedCurrencyValue)

// CurrencyAmount
const currencyAmountXrp = new CurrencyAmount()
currencyAmountXrp.setXrpAmount(paymentAmount)

const currencyAmountIssuedCurrency = new CurrencyAmount()
currencyAmountIssuedCurrency.setIssuedCurrencyAmount(issuedCurrencyAmount)

// Amount
const amountXrp = new Amount()
amountXrp.setValue(currencyAmountXrp)

const amountIssuedCurrency = new Amount()
amountIssuedCurrency.setValue(currencyAmountIssuedCurrency)

// ClearFlag
const clearFlag = new ClearFlag()
clearFlag.setValue(clearFlagValue)

// DeliverMin
const deliverMin = new DeliverMin()
deliverMin.setValue(xrpTestUtils.makeXrpCurrencyAmount(deliverMinValue))

// Domain
const domain = new Domain()
domain.setValue(domainValue)

// EmailHash
const emailHash = new EmailHash()
emailHash.setValue(emailHashValue)

// InvoiceID
const invoiceId = new InvoiceID()
invoiceId.setValue(invoiceIdValue)

// SendMax
const sendMax = new SendMax()
sendMax.setValue(xrpTestUtils.makeXrpCurrencyAmount(sendMaxValue))

// Sequence
const sequenceProto = new Sequence()
sequenceProto.setValue(sequenceNumber)

// Transaction Fee
const transactionFeeProto = new XRPDropsAmount()
transactionFeeProto.setDrops(fee)

// LastLedgerSequence
const lastLedgerSequence = new LastLedgerSequence()
lastLedgerSequence.setValue(lastLedgerSequenceValue)

// LimitAmount
const limitAmount = new LimitAmount()
limitAmount.setValue(currencyAmountIssuedCurrency)

// Memo
const memoData = new MemoData()
memoData.setValue(testMemoData)

const memo = new Memo()
memo.setMemoData(memoData)

// MessageKey
const messageKey = new MessageKey()
messageKey.setValue(messageKeyValue)

// SetFlag
const setFlag = new SetFlag()
setFlag.setValue(setFlagValue)

// SourceTag
const sourceTag = new SourceTag()
sourceTag.setValue(sourceTagValue)

// TransferRate
const transferRate = new TransferRate()
transferRate.setValue(transferRateValue)

const transferRateNoFee = new TransferRate()
transferRateNoFee.setValue(transferRateValueNoFee)

// TickSize
const tickSize = new TickSize()
tickSize.setValue(tickSizeValue)

const tickSizeDisable = new TickSize()
tickSizeDisable.setValue(tickSizeValueDisable)

// Quality In/Out
const qualityIn = new QualityIn()
qualityIn.setValue(qualityInValue)

const qualityInSpecial = new QualityIn()
qualityInSpecial.setValue(qualityInZero)

const qualityOut = new QualityOut()
qualityOut.setValue(qualityOutValue)

const qualityOutSpecial = new QualityOut()
qualityOutSpecial.setValue(qualityOutZero)

// PathElements and Paths
const path1Element1 = xrpTestUtils.makePathElement(
  xrpTestUtils.makeAccountAddress(address1),
  currencyCode1,
  xrpTestUtils.makeAccountAddress(address2),
)
const path1Element2 = xrpTestUtils.makePathElement(
  xrpTestUtils.makeAccountAddress(address3),
  currencyCode2,
  xrpTestUtils.makeAccountAddress(address2),
)

const path1 = new Payment.Path()
path1.addElements(path1Element1)
path1.addElements(path1Element2)

const path2Element1 = xrpTestUtils.makePathElement(
  xrpTestUtils.makeAccountAddress(address1),
  currencyCode1,
  xrpTestUtils.makeAccountAddress(address3),
)

const path2 = new Payment.Path()
path2.addElements(path2Element1)

const pathList = [path1, path2]

// TakerGets
const takerGets = new TakerGets()
takerGets.setValue(currencyAmountIssuedCurrency)

// TakerPays
const takerPays = new TakerPays()
takerPays.setValue(currencyAmountXrp)

// OfferSequence
const offerSequence = new OfferSequence()
offerSequence.setValue(offerSequenceValue)

// Expiration
const expiration = new Expiration()
expiration.setValue(expirationValue)

// AccountSets
const accountSetAllFields = new AccountSet()
accountSetAllFields.setClearFlag(clearFlag)
accountSetAllFields.setDomain(domain)
accountSetAllFields.setEmailHash(emailHash)
accountSetAllFields.setMessageKey(messageKey)
accountSetAllFields.setSetFlag(setFlag)
accountSetAllFields.setTransferRate(transferRate)
accountSetAllFields.setTickSize(tickSize)

const accountSetOneFieldSet = new AccountSet()
accountSetOneFieldSet.setClearFlag(clearFlag)

const accountSetEmpty = new AccountSet()

const accountSetSpecialCases = new AccountSet()
accountSetSpecialCases.setTransferRate(transferRateNoFee)
accountSetSpecialCases.setTickSize(tickSizeDisable)

// OfferCancels

const offerCancelAllFields = new OfferCancel()
offerCancelAllFields.setOfferSequence(offerSequence)

// OfferCreates

const offerCreateAllFields = new OfferCreate()
offerCreateAllFields.setTakerGets(takerGets)
offerCreateAllFields.setTakerPays(takerPays)
offerCreateAllFields.setOfferSequence(offerSequence)
offerCreateAllFields.setExpiration(expiration)

// Payments
const paymentMandatoryFields = new Payment()
paymentMandatoryFields.setDestination(destination)
paymentMandatoryFields.setAmount(amountXrp)

const paymentMandatoryFieldsIssuedCurrency = new Payment()
paymentMandatoryFieldsIssuedCurrency.setDestination(destination)
paymentMandatoryFieldsIssuedCurrency.setAmount(amountIssuedCurrency)

const paymentAllFields = new Payment()
paymentAllFields.setDestination(destination)
paymentAllFields.setAmount(amountXrp)
paymentAllFields.setDestinationTag(destinationTag)
paymentAllFields.setInvoiceId(invoiceId)
paymentAllFields.setDeliverMin(deliverMin)
paymentAllFields.setSendMax(sendMax)
paymentAllFields.setPathsList(pathList)

// TrustSets
const trustSetMandatoryFields = new TrustSet()
trustSetMandatoryFields.setLimitAmount(limitAmount)

const trustSetAllFields = new TrustSet()
trustSetAllFields.setLimitAmount(limitAmount)
trustSetAllFields.setQualityIn(qualityIn)
trustSetAllFields.setQualityOut(qualityOut)

const trustSetSpecial = new TrustSet()
trustSetSpecial.setLimitAmount(limitAmount)
trustSetSpecial.setQualityIn(qualityInSpecial)
trustSetSpecial.setQualityOut(qualityOutSpecial)

// Transactions

/**
 * Helper function to generate Transaction protobuf objects.
 *
 * @param transactionType - The type of transaction that is created.
 * @param transactionData - The object to be inserted into the transaction based on the transaction type.
 * @returns Payment Transaction with the included payment param.
 * @throws Error if given bad data.
 */
function buildStandardTestTransaction(
  transactionType: Transaction.TransactionDataCase,
  transactionData: AccountSet | OfferCancel | OfferCreate | Payment | TrustSet,
): Transaction {
  const transaction = new Transaction()
  transaction.setAccount(accountProto)
  transaction.setFee(transactionFeeProto)
  transaction.setSequence(sequenceProto)
  switch (transactionType) {
    case Transaction.TransactionDataCase.ACCOUNT_SET: {
      if (!(transactionData instanceof AccountSet)) {
        throw new Error('Expected AccountSet type')
      }
      transaction.setAccountSet(transactionData)
      break
    }
    case Transaction.TransactionDataCase.OFFER_CANCEL: {
      if (!(transactionData instanceof OfferCancel)) {
        throw new Error('Expected OfferCancel type')
      }
      transaction.setOfferCancel(transactionData)
      break
    }
    case Transaction.TransactionDataCase.OFFER_CREATE: {
      if (!(transactionData instanceof OfferCreate)) {
        throw new Error('Expected OfferCreate type')
      }
      transaction.setOfferCreate(transactionData)
      break
    }
    case Transaction.TransactionDataCase.PAYMENT: {
      if (!(transactionData instanceof Payment)) {
        throw new Error('Expected Payment type')
      }
      transaction.setPayment(transactionData)
      break
    }
    case Transaction.TransactionDataCase.TRUST_SET: {
      if (!(transactionData instanceof TrustSet)) {
        throw new Error('Expected TrustSet type')
      }
      transaction.setTrustSet(transactionData)
      break
    }
    default:
      throw new Error('Unexpected transactionDataCase')
  }
  return transaction
}

// AccountSet Transactions
const testTransactionAccountSetAllFields = buildStandardTestTransaction(
  Transaction.TransactionDataCase.ACCOUNT_SET,
  accountSetAllFields,
)
const testTransactionAccountSetOneField = buildStandardTestTransaction(
  Transaction.TransactionDataCase.ACCOUNT_SET,
  accountSetOneFieldSet,
)
const testTransactionAccountSetEmpty = buildStandardTestTransaction(
  Transaction.TransactionDataCase.ACCOUNT_SET,
  accountSetEmpty,
)
const testTransactionAccountSetSpecialCases = buildStandardTestTransaction(
  Transaction.TransactionDataCase.ACCOUNT_SET,
  accountSetSpecialCases,
)

// OfferCancel Transactions
const testTransactionOfferCancelAllFields = buildStandardTestTransaction(
  Transaction.TransactionDataCase.OFFER_CANCEL,
  offerCancelAllFields,
)

// OfferCreate Transactions
const testTransactionOfferCreateAllFields = buildStandardTestTransaction(
  Transaction.TransactionDataCase.OFFER_CREATE,
  offerCreateAllFields,
)

// Payment Transactions
const testTransactionPaymentMandatoryFields = buildStandardTestTransaction(
  Transaction.TransactionDataCase.PAYMENT,
  paymentMandatoryFields,
)
const testTransactionPaymentMandatoryFieldsIssuedCurrency = buildStandardTestTransaction(
  Transaction.TransactionDataCase.PAYMENT,
  paymentMandatoryFieldsIssuedCurrency,
)
const testTransactionPaymentAllFields = buildStandardTestTransaction(
  Transaction.TransactionDataCase.PAYMENT,
  paymentAllFields,
)
testTransactionPaymentAllFields.addMemos(memo)
testTransactionPaymentAllFields.setLastLedgerSequence(lastLedgerSequence)
testTransactionPaymentAllFields.setSourceTag(sourceTag)

// TrustSet Transactions
const testTransactionTrustSetMandatoryFields = buildStandardTestTransaction(
  Transaction.TransactionDataCase.TRUST_SET,
  trustSetMandatoryFields,
)

const testTransactionTrustSetAllFields = buildStandardTestTransaction(
  Transaction.TransactionDataCase.TRUST_SET,
  trustSetAllFields,
)

const testTransactionTrustSetSpecialCases = buildStandardTestTransaction(
  Transaction.TransactionDataCase.TRUST_SET,
  trustSetSpecial,
)

// INVALID OBJECTS =============================================

// Invalid Payments
const testInvalidPaymentNoAmount = new Payment()
testInvalidPaymentNoAmount.setDestination(destination)

const testInvalidPaymentNoDestination = new Payment()
testInvalidPaymentNoDestination.setAmount(amountIssuedCurrency)

const testInvalidPaymentBadDestination = new Payment()
testInvalidPaymentBadDestination.setAmount(amountIssuedCurrency)
testInvalidPaymentBadDestination.setDestination(invalidDestination)

const testInvalidPaymentNoSendMax = new Payment()
testInvalidPaymentNoSendMax.setAmount(amountIssuedCurrency)
testInvalidPaymentNoSendMax.setDestination(destination)

// Invalid TrustSets
const testInvalidTrustSetNoLimitAmount = new TrustSet()

// Invalid Transactions

// Invalid Payment Transactions
const testInvalidTransactionPaymentNoAmount = buildStandardTestTransaction(
  Transaction.TransactionDataCase.PAYMENT,
  testInvalidPaymentNoAmount,
)
const testInvalidTransactionPaymentNoDestination = buildStandardTestTransaction(
  Transaction.TransactionDataCase.PAYMENT,
  testInvalidPaymentNoDestination,
)
const testInvalidTransactionPaymentBadDestination = buildStandardTestTransaction(
  Transaction.TransactionDataCase.PAYMENT,
  testInvalidPaymentBadDestination,
)

const testInvalidTransactionPaymentNoAccount = new Transaction()
testInvalidTransactionPaymentNoAccount.setFee(transactionFeeProto)
testInvalidTransactionPaymentNoAccount.setSequence(sequenceProto)
testInvalidTransactionPaymentNoAccount.setPayment(paymentMandatoryFields)

const testInvalidTransactionPaymentNoFee = new Transaction()
testInvalidTransactionPaymentNoFee.setAccount(accountProto)
testInvalidTransactionPaymentNoFee.setSequence(sequenceProto)
testInvalidTransactionPaymentNoFee.setPayment(paymentMandatoryFields)

const testInvalidTransactionPaymentNoPayment = new Transaction()
testInvalidTransactionPaymentNoPayment.setAccount(accountProto)
testInvalidTransactionPaymentNoPayment.setFee(transactionFeeProto)
testInvalidTransactionPaymentNoPayment.setSequence(sequenceProto)

// Invalid TrustSet Transactions
const testInvalidTransactionTrustSetNoLimitAmount = buildStandardTestTransaction(
  Transaction.TransactionDataCase.TRUST_SET,
  testInvalidTrustSetNoLimitAmount,
)

export {
  fakeSignature,
  testTransactionAccountSetAllFields,
  testTransactionAccountSetOneField,
  testTransactionAccountSetEmpty,
  testTransactionAccountSetSpecialCases,
  testTransactionOfferCancelAllFields,
  testTransactionOfferCreateAllFields,
  testTransactionPaymentMandatoryFields,
  testTransactionPaymentMandatoryFieldsIssuedCurrency,
  testTransactionPaymentAllFields,
  testTransactionTrustSetMandatoryFields,
  testTransactionTrustSetAllFields,
  testTransactionTrustSetSpecialCases,
  testInvalidTransactionPaymentNoAmount,
  testInvalidTransactionPaymentNoDestination,
  testInvalidTransactionPaymentBadDestination,
  testInvalidTransactionPaymentNoAccount,
  testInvalidTransactionPaymentNoFee,
  testInvalidTransactionPaymentNoPayment,
  testInvalidTransactionTrustSetNoLimitAmount,
}
