"use strict";
var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();
var Transaction_pb = require('./Transaction_pb.js');
goog.object.extend(proto, Transaction_pb);
goog.exportSymbol('proto.SignedTransaction', null, global);
proto.SignedTransaction = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.SignedTransaction, jspb.Message);
if (goog.DEBUG && !COMPILED) {
    proto.SignedTransaction.displayName = 'proto.SignedTransaction';
}
if (jspb.Message.GENERATE_TO_OBJECT) {
    proto.SignedTransaction.prototype.toObject = function (opt_includeInstance) {
        return proto.SignedTransaction.toObject(opt_includeInstance, this);
    };
    proto.SignedTransaction.toObject = function (includeInstance, msg) {
        var f, obj = {
            transaction: (f = msg.getTransaction()) && Transaction_pb.Transaction.toObject(includeInstance, f),
            transactionSignatureHex: jspb.Message.getFieldWithDefault(msg, 2, ""),
            publicKeyHex: jspb.Message.getFieldWithDefault(msg, 3, "")
        };
        if (includeInstance) {
            obj.$jspbMessageInstance = msg;
        }
        return obj;
    };
}
proto.SignedTransaction.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.SignedTransaction;
    return proto.SignedTransaction.deserializeBinaryFromReader(msg, reader);
};
proto.SignedTransaction.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
        if (reader.isEndGroup()) {
            break;
        }
        var field = reader.getFieldNumber();
        switch (field) {
            case 1:
                var value = new Transaction_pb.Transaction;
                reader.readMessage(value, Transaction_pb.Transaction.deserializeBinaryFromReader);
                msg.setTransaction(value);
                break;
            case 2:
                var value = (reader.readString());
                msg.setTransactionSignatureHex(value);
                break;
            case 3:
                var value = (reader.readString());
                msg.setPublicKeyHex(value);
                break;
            default:
                reader.skipField();
                break;
        }
    }
    return msg;
};
proto.SignedTransaction.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.SignedTransaction.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
};
proto.SignedTransaction.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getTransaction();
    if (f != null) {
        writer.writeMessage(1, f, Transaction_pb.Transaction.serializeBinaryToWriter);
    }
    f = message.getTransactionSignatureHex();
    if (f.length > 0) {
        writer.writeString(2, f);
    }
    f = message.getPublicKeyHex();
    if (f.length > 0) {
        writer.writeString(3, f);
    }
};
proto.SignedTransaction.prototype.getTransaction = function () {
    return (jspb.Message.getWrapperField(this, Transaction_pb.Transaction, 1));
};
proto.SignedTransaction.prototype.setTransaction = function (value) {
    jspb.Message.setWrapperField(this, 1, value);
};
proto.SignedTransaction.prototype.clearTransaction = function () {
    this.setTransaction(undefined);
};
proto.SignedTransaction.prototype.hasTransaction = function () {
    return jspb.Message.getField(this, 1) != null;
};
proto.SignedTransaction.prototype.getTransactionSignatureHex = function () {
    return (jspb.Message.getFieldWithDefault(this, 2, ""));
};
proto.SignedTransaction.prototype.setTransactionSignatureHex = function (value) {
    jspb.Message.setProto3StringField(this, 2, value);
};
proto.SignedTransaction.prototype.getPublicKeyHex = function () {
    return (jspb.Message.getFieldWithDefault(this, 3, ""));
};
proto.SignedTransaction.prototype.setPublicKeyHex = function (value) {
    jspb.Message.setProto3StringField(this, 3, value);
};
goog.object.extend(exports, proto);
//# sourceMappingURL=SignedTransaction_pb.js.map