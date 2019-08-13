"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Payment_pb_1 = require("../generated/Payment_pb");
const Transaction_pb_1 = require("../generated/Transaction_pb");
class Serializer {
    static transactionToJSON(transaction) {
        var object = transaction.toObject();
        this.convertPropertyName("account", "Account", object);
        this.convertPropertyName("sequence", "Sequence", object);
        const txFee = transaction.getFee();
        if (txFee == undefined) {
            return undefined;
        }
        object["Fee"] = this.xrpAmountToJSON(txFee);
        delete object.fee;
        delete object.payment;
        const transactionDataCase = transaction.getTransactionDataCase();
        switch (transactionDataCase) {
            case Transaction_pb_1.Transaction.TransactionDataCase.PAYMENT:
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
    static paymentToJSON(payment) {
        const json = {
            TransactionType: "Payment",
            Destination: payment.getDestination(),
            Amount: {}
        };
        const amountCase = payment.getAmountCase();
        switch (amountCase) {
            case Payment_pb_1.Payment.AmountCase.FIAT_AMOUNT:
                const fiatAmount = payment.getFiatAmount();
                if (fiatAmount == undefined) {
                    return undefined;
                }
                json.Amount = this.fiatAmountToJSON(fiatAmount);
                break;
            case Payment_pb_1.Payment.AmountCase.XRP_AMOUNT:
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
    static fiatAmountToJSON(fiatAmount) {
        const json = fiatAmount.toObject();
        json.currency = this.currencyToJSON(fiatAmount.getCurrency());
        return json;
    }
    static currencyToJSON(currency) {
        return "USD";
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