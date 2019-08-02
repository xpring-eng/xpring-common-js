const { Transaction } = require('./generated/Transaction_pb.js');

/**
 * Provides functionality to serialize from protocol buffers to JSON objects.
 */
class Serializer {
    static serializeTransaction(transaction) {
        var object = transaction.toObject();

        // var object = Transaction.toObject(transaction, {
        //     longs: String,
        //     enums: String,
        //     bytes: String
        // });
        return object;
    }
}

module.exports = Serializer;
