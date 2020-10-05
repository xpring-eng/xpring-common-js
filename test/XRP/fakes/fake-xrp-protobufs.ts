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
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/common_pb'
import {
  Payment,
  Transaction,
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/transaction_pb'
import xrpTestUtils from '../helpers/xrp-test-utils'

// Constants
const fakeSignature = 'DEADBEEF'
const value = '1000'
const currencyName = 'BTC'
// const currencyCode = 'USD'
const issuedCurrencyValue = '100'
const destinationAddress = 'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc'
const issuerAddress = 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'
const invalidAddress = 'badAddress'
const fee = '10'
const sequenceNumber = 1
const account = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'
// invoiceId value should be either a base64 string or a 32-byte array representing 64 hex chars (256 bits)
const invoiceIdValue = 'ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0='
const deliverMinValue = '10'
const sendMaxValue = '13'
const destinationTagValue = 4

// Objects for Transactions
const testCurrencyProto = new Currency()
// testCurrencyProto.setCode(currencyCode)
testCurrencyProto.setName(currencyName)

const destinationAccountAddress = new AccountAddress()
destinationAccountAddress.setAddress(destinationAddress)

const issuerAccountAddress = new AccountAddress()
issuerAccountAddress.setAddress(issuerAddress)

const invalidAccountAddress = new AccountAddress()
invalidAccountAddress.setAddress(invalidAddress)

const paymentAmount = new XRPDropsAmount()
paymentAmount.setDrops(value)

const issuedCurrencyAmount = new IssuedCurrencyAmount()
issuedCurrencyAmount.setCurrency(testCurrencyProto)
issuedCurrencyAmount.setIssuer(issuerAccountAddress)
issuedCurrencyAmount.setValue(issuedCurrencyValue)

const currencyAmountXrp = new CurrencyAmount()
currencyAmountXrp.setXrpAmount(paymentAmount)

const currencyAmountIssuedCurrency = new CurrencyAmount()
currencyAmountIssuedCurrency.setIssuedCurrencyAmount(issuedCurrencyAmount)

const destination = new Destination()
destination.setValue(destinationAccountAddress)

const invalidDestination = new Destination()
invalidDestination.setValue(invalidAccountAddress)

const amountXrp = new Amount()
amountXrp.setValue(currencyAmountXrp)

const amountIssuedCurrency = new Amount()
amountIssuedCurrency.setValue(currencyAmountIssuedCurrency)

const transactionFeeProto = new XRPDropsAmount()
transactionFeeProto.setDrops(fee)

const senderAccountAddress = new AccountAddress()
senderAccountAddress.setAddress(account)

const accountProto = new Account()
accountProto.setValue(senderAccountAddress)

const sequenceProto = new Sequence()
sequenceProto.setValue(sequenceNumber)

const destinationTag = new DestinationTag()
destinationTag.setValue(destinationTagValue)

const invoiceId = new InvoiceID()
invoiceId.setValue(invoiceIdValue)

const deliverMin = new DeliverMin()
deliverMin.setValue(xrpTestUtils.makeXrpCurrencyAmount(deliverMinValue))

const sendMax = new SendMax()
sendMax.setValue(xrpTestUtils.makeXrpCurrencyAmount(sendMaxValue))

// PathElements and Paths

const path1Element1 = xrpTestUtils.makePathElement(
  xrpTestUtils.makeAccountAddress('rQ3fNyLjbvcDaPNS4EAJY8aT9zR3uGk17c'),
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
  new Uint8Array([1, 2, 3, 4, 5]),
  xrpTestUtils.makeAccountAddress('r4L6ZLHkTytPqDR81H1ysCr6qGv9oJJAKi'),
)
const path1Element2 = xrpTestUtils.makePathElement(
  xrpTestUtils.makeAccountAddress('rBM3QGATGQHRCBU8KtAvNvSHZrbJhMhWxA'),
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
  new Uint8Array([4, 5, 6, 7, 8]),
  xrpTestUtils.makeAccountAddress('r4L6ZLHkTytPqDR81H1ysCr6qGv9oJJAKi'),
)

const path1 = new Payment.Path()
path1.addElements(path1Element1)
path1.addElements(path1Element2)

const path2Element1 = xrpTestUtils.makePathElement(
  xrpTestUtils.makeAccountAddress('rQ3fNyLjbvcDaPNS4EAJY8aT9zR3uGk17c'),
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
  new Uint8Array([7, 8, 9, 10, 11]),
  xrpTestUtils.makeAccountAddress('rBM3QGATGQHRCBU8KtAvNvSHZrbJhMhWxA'),
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

export {
  fakeSignature,
  testTransactionPaymentMandatoryFields,
  testTransactionPaymentMandatoryFieldsIssuedCurrency,
  testTransactionPaymentAllFields,
  testInvalidTransactionPaymentNoAmount,
  testInvalidTransactionPaymentNoDestination,
  testInvalidTransactionPaymentBadDestination,
}
