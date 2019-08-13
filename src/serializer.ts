import { Payment } from "../generated/Payment_pb";
import { Transaction } from "../generated/Transaction_pb";
import { FiatAmount } from "../generated/FiatAmount_pb";
import { XRPAmount } from "../generated/XRPAmount_pb";
import { Currency, CurrencyMap } from "../generated/Currency_pb";
import * as jspb from "google-protobuf";

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
  static transactionToJSON(transaction: Transaction): Object | undefined {
    // Serialize the protocol buffer to a JSON representation.
    var object: any = transaction.toObject()

    // Convert fields to upper case.
    this.convertPropertyName("account", "Account", object);
    this.convertPropertyName("sequence", "Sequence", object);

    // Convert XRP denominated fee field.
    const txFee = transaction.getFee();
    if (txFee == undefined) {
      return undefined;
    }
    object["Fee"] = this.xrpAmountToJSON(txFee);
    delete object.fee;

    // Delete all fields from the transaction data one of before they get rewritten below.
    delete object.payment;

    // Convert additional transaction data.
    const transactionDataCase = transaction.getTransactionDataCase();
    switch (transactionDataCase) {
    case Transaction.TransactionDataCase.PAYMENT:
      const payment = transaction.getPayment();
      if (payment == undefined) {
        return undefined;
      }
      Object.assign(object, this.paymentToJSON(payment));
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
  static paymentToJSON(payment: Payment): object | undefined {
    const json = {
      TransactionType: "Payment",
      Destination: payment.getDestination(),
      Amount: {}
    };

    const amountCase = payment.getAmountCase();
    switch (amountCase) {
    case Payment.AmountCase.FIAT_AMOUNT:
      const fiatAmount = payment.getFiatAmount();
      if (fiatAmount == undefined) {
        return undefined;
      }

      const jsonFiatAmount = this.fiatAmountToJSON(fiatAmount);
      if (jsonFiatAmount == undefined) {
        return undefined;
      }
      json.Amount = jsonFiatAmount;
      break;
    case Payment.AmountCase.XRP_AMOUNT:
      const xrpAmount = payment.getXrpAmount();
      if (xrpAmount == undefined) {
        return undefined;
      }
      json.Amount = this.xrpAmountToJSON(xrpAmount);
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
  static fiatAmountToJSON(fiatAmount: FiatAmount): object | undefined {
    const json: any = fiatAmount.toObject();

    const currency = fiatAmount.getCurrency();
    if (currency == undefined) {
      return undefined;
    }

    json.currency = this.currencyToJSON(currency);
    return json;
  }

  /**
   * Convert a Currency enum to a JSON representation.
   *
   * @param {proto.FiatAmount.Currency} currency The Currency to convert.
   * @returns {String} The Currency as JSON.
   */
  static currencyToJSON(currency: CurrencyMap[keyof CurrencyMap]): string {
    switch (currency) {
      case Currency.USD:
        return "USD"
    }
  }

  /**
   * Convert an XRPAmount to a JSON representation.
   *
   * @param {proto.XRPAmount} xrpAmount The XRPAmount to convert.
   * @return {String} The XRPAmount as JSON.
   */
  static xrpAmountToJSON(xrpAmount: XRPAmount): string {
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
  static convertPropertyName(oldPropertyName: string, newPropertyName: string, object: any): void {
    object[newPropertyName] = object[oldPropertyName];
    delete object[oldPropertyName];
  }
}

export default Serializer;
