const { Payment } = require('./generated/Payment_pb.js');
const { Transaction } = require('./generated/Transaction_pb.js');

/**
 * Provides functionality to serialize from protocol buffers to JSON objects.
 */
class Serializer {
    /**
     * Convert a transaction to a JSON representation.
     * 
     * @param {proto.Transaction} transaction A transaction protocol buffer to convert.
     * @returns {Object} The JSON representation of the given transaction.
     */
    static serializeTransaction(transaction) {
        // Serialize the protocol buffer to a JSON representation.
        var object = transaction.toObject();

        // Convert fields to upper case.
        this.convertPropertyName("account", "Account", object);
        this.convertPropertyName("sequence", "Sequence", object);

        // Convert XRP denominated fee field.
        object.Fee = this.xrpAmountToJSON(transaction.getFee());
        delete object.fee;

        // Convert additional transaction data.
        const transactionDataCase = transaction.getTransactionDataCase();
        switch (transactionDataCase) {
            case Transaction.TransactionDataCase.PAYMENT:
                this.convertPaymentData(transaction.getPayment(), object);
                break;
        }

        return object;
    }

    /**
     * 
     * @param {proto.Payment} paymentData 
     * @param {*} object 
     */
    static convertPaymentData(paymentData, object) {
        object.TransactionType = "Payment";
        object.Destination = paymentData.getDestination();
        
        const amountCase = paymentData.getAmountCase();
        switch (amountCase) {
            case Payment.AmountCase.FIAT_AMOUNT:
                object.Amount = this.fiatAmountToJSON(paymentData.getFiatAmount());
                break;
            case Payment.AmountCase.XRP_AMOUNT:
                object.Amount = this.xrpAmountToJSON(paymentData.getXrpAmount());
                break;
        }
        delete object.payment
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

    /**
     * Convert a FiatAmount proto to a JSON representation.
     * 
     * @param {proto.FiatAmount} fiatAmount The FiatAmount to convert.
     * @returns {Object} The FiatAmount as JSON.
     */
    static fiatAmountToJSON(fiatAmount) {
        const json = fiatAmount.toObject();
        json.currency = this.currencyValueToJSON(fiatAmount.getCurrency());
        return json;
    }

    /**
     * Convert a Currency enum to a JSON representation.
     *  
     * @param {proto.FiatAmount.Currency} currency The Currency to convert.
     * @returns {String} The Currency as JSON.
     */
    static currencyValueToJSON(currency) {
        switch (currency) {
            case proto.FiatAmount.Currency.USD:
                return "USD";
        }
    }

    /**
     * Convert an XRPAmount proto to a JSON representation.
     * 
     * @param {proto.XRPAmount} xrpAmount The XRPAmount to convert.
     * @return {String} The XRPAmount as JSON.
     */
    static xrpAmountToJSON(xrpAmount) {
        return xrpAmount.getDrops() + "";
    }
}

module.exports = Serializer;
