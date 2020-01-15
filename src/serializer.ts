import { Payment as LegacyPayment } from "./generated/legacy/payment_pb";
import { Transaction as LegacyTransaction } from "./generated/legacy/transaction_pb";
import { XRPAmount } from "./generated/legacy/xrp_amount_pb";
import { XRPDropsAmount } from "./generated/rpc/v1/amount_pb";
import { Payment, Transaction } from "./generated/rpc/v1/transaction_pb";
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
    const object: any = transaction.toObject();

    // Convert fields names where direct conversion is possible.
    this.convertPropertyName("sequence", "Sequence", object);
    this.convertPropertyName("signingPublicKey", "SigningPubKey", object);
    this.convertPropertyName(
      "lastLedgerSequence",
      "LastLedgerSequence",
      object
    );

    // Delete unsupported fields from the protocol buffer.
    [
      "memosList",
      "flags",
      "signature",
      "signersList",
      "sourceTag",
      "accountTransactionId"
    ].forEach((key): boolean => delete object[key]);

    // Encode SigningPubKey to hex, which is what ripple-binary-codec expects.
    object.SigningPubKey = Utils.toHex(transaction.getSigningPublicKey_asU8());

    // Convert account field, handling X-Addresses if needed.
    const accountAddress = transaction.getAccount();
    if (!accountAddress) {
      return;
    }
    const account = accountAddress.getAddress();
    if (!account || !Utils.isValidAddress(account)) {
      return;
    }

    let normalizedAccount = account;
    if (Utils.isValidXAddress(account)) {
      const decodedClassicAddress = Utils.decodeXAddress(account);
      if (!decodedClassicAddress) {
        return;
      }

      // Accounts cannot have a tag.
      if (decodedClassicAddress.tag !== undefined) {
        return;
      }

      normalizedAccount = decodedClassicAddress.address;
    }
    object["Account"] = normalizedAccount;
    delete object.account;

    // Convert XRP denominated fee field.
    const txFee = transaction.getFee();
    if (txFee === undefined) {
      return;
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
          return;
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
    const destinationAddress = payment.getDestination();
    if (!destinationAddress) {
      return;
    }

    const destination = destinationAddress.getAddress();
    if (!destination) {
      return;
    }

    const decodedXAddress = Utils.decodeXAddress(destination);
    if (!decodedXAddress) {
      json.Destination = destination;
      delete json.DestinationTag;
    } else {
      json.Destination = decodedXAddress.address;
      if (decodedXAddress.tag !== undefined) {
        json.DestinationTag = decodedXAddress.tag;
      }
    }

    const amount = payment.getAmount();
    if (!amount) {
      return;
    }
    const xrpAmount = amount.getXrpAmount();
    if (!xrpAmount) {
      return;
    }
    json.Amount = this.xrpAmountToJSON(xrpAmount);
    return json;
  }

  /**
   * Convert an XRPDropsAmount to a JSON representation.
   *
   * @param xrpDropsAmount The XRPAmount to convert.
   * @returns The XRPAmount as JSON.
   */
  private static xrpAmountToJSON(xrpDropsAmount: XRPDropsAmount): string {
    return xrpDropsAmount.getDrops() + "";
  }

  /**
   * Convert a Transaction to a JSON representation.
   *
   * @param {proto.Transaction} transaction A Transaction to convert.
   * @returns {Object} The Transaction as JSON.
   */
  public static legacyTransactionToJSON(
    transaction: LegacyTransaction
  ): object | undefined {
    // Serialize the protocol buffer to a JSON representation.
    const object: any = transaction.toObject();

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
      return;
    }

    let normalizedAccount = account;
    if (Utils.isValidXAddress(account)) {
      const decodedClassicAddress = Utils.decodeXAddress(account);
      if (!decodedClassicAddress) {
        return;
      }

      // Accounts cannot have a tag.
      if (decodedClassicAddress.tag !== undefined) {
        return;
      }

      normalizedAccount = decodedClassicAddress.address;
    }
    object["Account"] = normalizedAccount;
    delete object.account;

    // Convert XRP denominated fee field.
    const txFee = transaction.getFee();
    if (txFee === undefined) {
      return;
    }
    object["Fee"] = this.legacyXRPAmountToJSON(txFee);
    delete object.fee;

    // Delete all fields from the transaction data one of before they get rewritten below.
    delete object.payment;

    // Convert additional transaction data.
    const transactionDataCase = transaction.getTransactionDataCase();
    switch (transactionDataCase) {
      case Transaction.TransactionDataCase.PAYMENT: {
        const payment = transaction.getPayment();
        if (payment === undefined) {
          return;
        }
        Object.assign(object, this.legacyPaymentToJSON(payment));
        break;
      }
    }

    return object;
  }

  /**
   * Convert a Payment to a JSON representation.
   *
   * @param payment The Payment to convert.
   * @returns The Payment as JSON.
   */
  private static legacyPaymentToJSON(
    payment: LegacyPayment
  ): object | undefined {
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
      case LegacyPayment.AmountCase.FIAT_AMOUNT: {
        return;
      }
      case LegacyPayment.AmountCase.XRP_AMOUNT: {
        const xrpAmount = payment.getXrpAmount();
        if (xrpAmount === undefined) {
          return;
        }
        json.Amount = this.legacyXRPAmountToJSON(xrpAmount);
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
  private static legacyXRPAmountToJSON(xrpAmount: XRPAmount): string {
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
