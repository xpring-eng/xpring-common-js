import { Payment } from "../generated/legacy/payment_pb";
import { Transaction } from "../generated/legacy/transaction_pb";
import { XRPAmount } from "../generated/legacy/xrp_amount_pb";
import Utils from "./utils";

/* Allow `any` since this class doing progressive conversion of protocol buffers to JSON. */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface PaymentJSON {
  Amount: object | string;
  Destination: string;
  DestinationTag?: number;
  TransactionType: string;
}

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
  public static transactionToJSON(
    transaction: Transaction
  ): object | undefined {
    // Serialize the protocol buffer to a JSON representation.
    var object: any = transaction.toObject();

    // Convert fields names where direct conversion is possible.
    this.convertPropertyName("sequence", "Sequence", object);
    this.convertPropertyName("signingPublicKeyHex", "SigningPubKey", object);
    this.convertPropertyName(
      "lastLedgerSequence",
      "LastLedgerSequence",
      object
    );

    // Convert account field, handling X-Addresses if needed.
    const account = transaction.getAccount();
    if (!account || !Utils.isValidAddress(account)) {
      return undefined;
    }

    var normalizedAccount = account;
    if (Utils.isValidXAddress(account)) {
      const decodedClassicAddress = Utils.decodeXAddress(account);
      if (!decodedClassicAddress) {
        return undefined;
      }

      // Accounts cannot have a tag.
      if (decodedClassicAddress.tag !== undefined) {
        return undefined;
      }

      normalizedAccount = decodedClassicAddress.address;
    }
    object["Account"] = normalizedAccount;
    delete object.account;

    // Convert XRP denominated fee field.
    const txFee = transaction.getFee();
    if (txFee === undefined) {
      return undefined;
    }
    object["Fee"] = this.xrpAmountToJSON(txFee);
    delete object.fee;

    // Delete all fields from the transaction data one of before they get rewritten below.
    delete object.payment;

    // Convert additional transaction data.
    const transactionDataCase = transaction.getTransactionDataCase();
    switch (transactionDataCase) {
      case Transaction.TransactionDataCase.PAYMENT: {
        const payment = transaction.getPayment();
        if (payment === undefined) {
          return undefined;
        }
        Object.assign(object, this.paymentToJSON(payment));
        break;
      }
    }

    return object;
  }

  /**
   * Convert a Payment to a JSON representation.
   *
   * @param {proto.Payment} payment The Payment to convert.
   * @returns {Object} The Payment as JSON.
   */
  private static paymentToJSON(payment: Payment): object | undefined {
    const json: PaymentJSON = {
      Amount: {},
      Destination: "",
      TransactionType: "Payment"
    };

    // If an x-address was able to be decoded, add the components to the json.
    const decodedXAddress = Utils.decodeXAddress(payment.getDestination());
    if (!decodedXAddress) {
      json.Destination = payment.getDestination();
      delete json.DestinationTag;
    } else {
      json.Destination = decodedXAddress.address;
      if (decodedXAddress.tag !== undefined) {
        json.DestinationTag = decodedXAddress.tag;
      }
    }

    const amountCase = payment.getAmountCase();
    switch (amountCase) {
      case Payment.AmountCase.FIAT_AMOUNT: {
        return undefined;
      }
      case Payment.AmountCase.XRP_AMOUNT: {
        const xrpAmount = payment.getXrpAmount();
        if (xrpAmount === undefined) {
          return undefined;
        }
        json.Amount = this.xrpAmountToJSON(xrpAmount);
        break;
      }
    }
    return json;
  }


  /**
   * Convert an XRPAmount to a JSON representation.
   *
   * @param {proto.XRPAmount} xrpAmount The XRPAmount to convert.
   * @return {String} The XRPAmount as JSON.
   */
  private static xrpAmountToJSON(xrpAmount: XRPAmount): string {
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
  private static convertPropertyName(
    oldPropertyName: string,
    newPropertyName: string,
    object: any
  ): void {
    object[newPropertyName] = object[oldPropertyName];
    delete object[oldPropertyName];
  }
}

export default Serializer;
