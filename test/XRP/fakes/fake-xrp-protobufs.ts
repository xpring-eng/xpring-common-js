import { AccountAddress } from '../../../src/XRP/generated/org/xrpl/rpc/v1/account_pb'
import {
  CurrencyAmount,
  XRPDropsAmount,
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
const destinationAddress = 'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc'
const fee = '10'
const sequenceNumber = 1
const account = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'
// invoiceId value should be either a base64 string or a 32-byte array representing 64 hex chars (256 bits)
const invoiceIdValue = 'ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0='
const deliverMinValue = '10'
const sendMaxValue = '13'

// Objects for Transactions

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

const transactionFee = new XRPDropsAmount()
transactionFee.setDrops(fee)

const senderAccountAddress = new AccountAddress()
senderAccountAddress.setAddress(account)

const sender = new Account()
sender.setValue(senderAccountAddress)

const sequence = new Sequence()
sequence.setValue(sequenceNumber)

const destinationTagValue = 4

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
paymentMandatoryFields.setAmount(amount)

const paymentAllFields = new Payment()
paymentAllFields.setDestination(destination)
paymentAllFields.setAmount(amount)
paymentAllFields.setDestinationTag(destinationTag)
paymentAllFields.setInvoiceId(invoiceId)
paymentAllFields.setDeliverMin(deliverMin)
paymentAllFields.setSendMax(sendMax)
paymentAllFields.setPathsList(pathList)

// Transactions

const testPaymentTransactionMandatoryFields = new Transaction()
testPaymentTransactionMandatoryFields.setAccount(sender)
testPaymentTransactionMandatoryFields.setFee(transactionFee)
testPaymentTransactionMandatoryFields.setSequence(sequence)
testPaymentTransactionMandatoryFields.setPayment(paymentMandatoryFields)

const testPaymentTransactionAllFields = new Transaction()
testPaymentTransactionAllFields.setAccount(sender)
testPaymentTransactionAllFields.setFee(transactionFee)
testPaymentTransactionAllFields.setSequence(sequence)
testPaymentTransactionAllFields.setPayment(paymentAllFields)

export {
  fakeSignature,
  testPaymentTransactionMandatoryFields,
  testPaymentTransactionAllFields,
}
