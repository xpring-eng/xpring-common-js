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
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/common_pb'
import {
  Payment,
  Transaction,
  Memo,
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/transaction_pb'
import xrpTestUtils from '../helpers/xrp-test-utils'

// Constants
const fakeSignature = 'DEADBEEF'
const value = '1000'
const currencyName = 'BTC'
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
const currencyCode1 = new Uint8Array([1, 2, 3, 4, 5])
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
const currencyCode2 = new Uint8Array([4, 5, 6, 7, 8])
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
const testMemoData = new Uint8Array([2, 4, 6])
const sourceTagValue = 5
const lastLedgerSequenceValue = 78652515

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

// Transaction Fee
const transactionFeeProto = new XRPDropsAmount()
transactionFeeProto.setDrops(fee)

// Sequence
const sequenceProto = new Sequence()
sequenceProto.setValue(sequenceNumber)

// InvoiceID
const invoiceId = new InvoiceID()
invoiceId.setValue(invoiceIdValue)

// DeliverMin
const deliverMin = new DeliverMin()
deliverMin.setValue(xrpTestUtils.makeXrpCurrencyAmount(deliverMinValue))

// SendMax
const sendMax = new SendMax()
sendMax.setValue(xrpTestUtils.makeXrpCurrencyAmount(sendMaxValue))

// LastLedgerSequence
const lastLedgerSequence = new LastLedgerSequence()
lastLedgerSequence.setValue(lastLedgerSequenceValue)

// Memo
const memoData = new MemoData()
memoData.setValue(testMemoData)

const memo = new Memo()
memo.setMemoData(memoData)

// SourceTag
const sourceTag = new SourceTag()
sourceTag.setValue(sourceTagValue)

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

// Transaction

/**
 * Helper function to generate Transaction objects with the standard values from Payment objects.
 *
 * @param payment -Payment object to insert into the transaction.
 * @returns Payment Transaction with the included payment param.
 */
function buildStandardTransactionFromPayment(payment: Payment): Transaction {
  const transaction = new Transaction()
  transaction.setAccount(accountProto)
  transaction.setFee(transactionFeeProto)
  transaction.setSequence(sequenceProto)
  transaction.setPayment(payment)
  return transaction
}

// Payment Transactions
const testTransactionPaymentMandatoryFields = buildStandardTransactionFromPayment(
  paymentMandatoryFields,
)
const testTransactionPaymentMandatoryFieldsIssuedCurrency = buildStandardTransactionFromPayment(
  paymentMandatoryFieldsIssuedCurrency,
)
const testTransactionPaymentAllFields = buildStandardTransactionFromPayment(
  paymentAllFields,
)
testTransactionPaymentAllFields.addMemos(memo)
testTransactionPaymentAllFields.setLastLedgerSequence(lastLedgerSequence)
testTransactionPaymentAllFields.setSourceTag(sourceTag)

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

// Invalid Transactions
const testInvalidTransactionPaymentNoAmount = buildStandardTransactionFromPayment(
  testInvalidPaymentNoAmount,
)
const testInvalidTransactionPaymentNoDestination = buildStandardTransactionFromPayment(
  testInvalidPaymentNoDestination,
)
const testInvalidTransactionPaymentBadDestination = buildStandardTransactionFromPayment(
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

export {
  fakeSignature,
  testTransactionPaymentMandatoryFields,
  testTransactionPaymentMandatoryFieldsIssuedCurrency,
  testTransactionPaymentAllFields,
  testInvalidTransactionPaymentNoAmount,
  testInvalidTransactionPaymentNoDestination,
  testInvalidTransactionPaymentBadDestination,
  testInvalidTransactionPaymentNoAccount,
  testInvalidTransactionPaymentNoFee,
  testInvalidTransactionPaymentNoPayment,
}
