const { Payment } = require('./generated/Payment_pb.js');
const { Transaction } = require('./generated/Transaction_pb.js');

/**
 * Provides functionality to serialize from protocol buffers to JSON objects.
 */
class Serializer {
    static serializeTransaction(transaction) {
        var object = transaction.toObject();

        this.convertPropertyName("account", "Account", object);
        this.convertPropertyName("sequence", "Sequence", object);

        object.Fee = this.xrpAmountToJSON(transaction.getFee());
        delete object.fee;


        const transactionDataCase = transaction.getTransactionDataCase();
        switch (transactionDataCase) {
            case Transaction.TransactionDataCase.PAYMENT:
                this.convertPaymentData(transaction.getPayment(), object);
                break;
        }

        return object;
    }


    static convertPaymentData(paymentData, object) {
        object.TransactionType = "Payment";
        object.Destination = paymentData.getDestination();
        
        const amountCase = paymentData.getAmountCase();
        switch (amountCase) {
            case Payment.AmountCase.FIAT_AMOUNT:
                // TODO: Implement me.
                break;
            case Payment.AmountCase.XRP_AMOUNT:
                object.Amount = this.xrpAmountToJSON(paymentData.getXrpAmount());
                break;
        }



        delete object.payment



        // object.Amount = paymentData.getAmount();
    }
    static getAmountField(proto) {
        const amountCase = proto.getAmountCase();


    }

    static convertPropertyName(oldPropertyName, newPropertyName, object) {
        object[newPropertyName] = object[oldPropertyName];
        delete object[oldPropertyName];        
    }

    static xrpAmountToJSON(xrpAmount) {
        return xrpAmount.getDrops() + "";
    }
}

module.exports = Serializer;
