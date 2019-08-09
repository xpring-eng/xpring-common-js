"use strict";

const { Payment } = require("../generated/Payment_pb.js");
const { Transaction } = require("../generated/Transaction_pb.js");
const { FiatAmount } = require("../generated/FiatAmount_pb.js");

/**
 * Provides functionality to serialize from protocol buffers to JSON objects.
 */
class Serializer {
  /**
   * Convert a Transaction to a JSON representation.
   *
   * @param {proto.Transaction} transaction A Transaction to convert.
   * @returns {Object} The Transaction as JSON.
   */
  static transactionToJSON(transaction) {
    // Serialize the protocol buffer to a JSON representation.
    var object = transaction.toObject();

    // Convert fields to upper case.
    this.convertPropertyName("account", "Account", object);
    this.convertPropertyName("sequence", "Sequence", object);

    // Convert XRP denominated fee field.
    object.Fee = this.xrpAmountToJSON(transaction.getFee());
    delete object.fee;

    // Delete all fields from the transaction data one of before they get rewritten below.
    delete object.payment;

    // Convert additional transaction data.
    const transactionDataCase = transaction.getTransactionDataCase();
    switch (transactionDataCase) {
      case Transaction.TransactionDataCase.PAYMENT:
        Object.assign(object, this.paymentToJSON(transaction.getPayment()));
        break;
      default:
        return undefined;
    }

    return object;
  }

  /**
   * Convert a Payment to a JSON representation.
   *
   * @param {proto.Payment} payment The Payment to convert.
   * @returns {Object} The Payment as JSON.
   */
  static paymentToJSON(payment) {
    const json = {
      TransactionType: "Payment",
      Destination: payment.getDestination()
    };

    const amountCase = payment.getAmountCase();
    switch (amountCase) {
      case Payment.AmountCase.FIAT_AMOUNT:
        json.Amount = this.fiatAmountToJSON(payment.getFiatAmount());
        break;
      case Payment.AmountCase.XRP_AMOUNT:
        json.Amount = this.xrpAmountToJSON(payment.getXrpAmount());
        break;
      default:
        return undefined;
    }
    return json;
  }

  /**
   * Convert a FiatAmount amount to a JSON representation.
   *
   * @param {proto.FiatAmount} fiatAmount The FiatAmount to convert.
   * @returns {Object} The FiatAmount as JSON.
   */
  static fiatAmountToJSON(fiatAmount) {
    const json = fiatAmount.toObject();
    json.currency = this.currencyToJSON(fiatAmount.getCurrency());
    return json;
  }

  /**
   * Convert a Currency enum to a JSON representation.
   *
   * @param {proto.FiatAmount.Currency} currency The Currency to convert.
   * @returns {String} The Currency as JSON.
   */
  static currencyToJSON(currency) {
    switch (currency) {
      case FiatAmount.Currency.USD:
        return "USD";
      default:
        return undefined;
    }
  }

  /**
   * Convert an XRPAmount to a JSON representation.
   *
   * @param {proto.XRPAmount} xrpAmount The XRPAmount to convert.
   * @return {String} The XRPAmount as JSON.
   */
  static xrpAmountToJSON(xrpAmount) {
    return xrpAmount.getDrops() + "";
  }

  /**
   * Change the name of a field in an object while preserving the value.
   *
   * @note This method has side effects to the `object` parameter.
   *
   * @param {String} oldPropertyName The property name to convert from.
   * @param {String} newPropertyName The new property name.
   * @param {Object} object The object on which the conversion is performed.
   */
  static convertPropertyName(oldPropertyName, newPropertyName, object) {
    object[newPropertyName] = object[oldPropertyName];
    delete object[oldPropertyName];
  }
}

module.exports = Serializer;
