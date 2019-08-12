"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Payment_pb_1 = require("../generated/Payment_pb");
const Transaction_pb_1 = require("../generated/Transaction_pb");
const FiatAmount_pb_1 = require("../generated/FiatAmount_pb");
from;
"../generated/FiatAmount_pb";
class Serializer {
    static transactionToJSON(transaction) {
        var object = transaction.toObject();
        this.convertPropertyName("account", "Account", object);
        this.convertPropertyName("sequence", "Sequence", object);
        object.Fee = this.xrpAmountToJSON(transaction.getFee());
        delete object.fee;
        delete object.payment;
        const transactionDataCase = transaction.getTransactionDataCase();
        switch (transactionDataCase) {
            case Transaction_pb_1.Transaction.TransactionDataCase.PAYMENT:
                Object.assign(object, this.paymentToJSON(transaction.getPayment()));
                break;
            default:
                return undefined;
        }
        return object;
    }
    static paymentToJSON(payment) {
        const json = {
            TransactionType: "Payment",
            Destination: payment.getDestination()
        };
        const amountCase = payment.getAmountCase();
        switch (amountCase) {
            case Payment_pb_1.Payment.AmountCase.FIAT_AMOUNT:
                json.Amount = this.fiatAmountToJSON(payment.getFiatAmount());
                break;
            case Payment_pb_1.Payment.AmountCase.XRP_AMOUNT:
                json.Amount = this.xrpAmountToJSON(payment.getXrpAmount());
                break;
            default:
                return undefined;
        }
        return json;
    }
    static fiatAmountToJSON(fiatAmount) {
        const json = fiatAmount.toObject();
        json.currency = this.currencyToJSON(fiatAmount.getCurrency());
        return json;
    }
    static currencyToJSON(currency) {
        switch (currency) {
            case FiatAmount_pb_1.FiatAmount.Currency.USD:
                return "USD";
            default:
                return undefined;
        }
    }
    static xrpAmountToJSON(xrpAmount) {
        return xrpAmount.getDrops() + "";
    }
    static convertPropertyName(oldPropertyName, newPropertyName, object) {
        object[newPropertyName] = object[oldPropertyName];
        delete object[oldPropertyName];
    }
}
exports.default = Serializer;
//# sourceMappingURL=serializer.js.map