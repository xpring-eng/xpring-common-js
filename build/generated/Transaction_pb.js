"use strict";
var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();
var Payment_pb = require('./Payment_pb.js');
goog.object.extend(proto, Payment_pb);
var XRPAmount_pb = require('./XRPAmount_pb.js');
goog.object.extend(proto, XRPAmount_pb);
goog.exportSymbol('proto.Transaction', null, global);
proto.Transaction = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, proto.Transaction.oneofGroups_);
};
goog.inherits(proto.Transaction, jspb.Message);
if (goog.DEBUG && !COMPILED) {
    proto.Transaction.displayName = 'proto.Transaction';
}
proto.Transaction.oneofGroups_ = [[4]];
proto.Transaction.TransactionDataCase = {
    TRANSACTION_DATA_NOT_SET: 0,
    PAYMENT: 4
};
proto.Transaction.prototype.getTransactionDataCase = function () {
    return (jspb.Message.computeOneofCase(this, proto.Transaction.oneofGroups_[0]));
};
if (jspb.Message.GENERATE_TO_OBJECT) {
    proto.Transaction.prototype.toObject = function (opt_includeInstance) {
        return proto.Transaction.toObject(opt_includeInstance, this);
    };
    proto.Transaction.toObject = function (includeInstance, msg) {
        var f, obj = {
            account: jspb.Message.getFieldWithDefault(msg, 1, ""),
            fee: (f = msg.getFee()) && XRPAmount_pb.XRPAmount.toObject(includeInstance, f),
            sequence: jspb.Message.getFieldWithDefault(msg, 3, 0),
            payment: (f = msg.getPayment()) && Payment_pb.Payment.toObject(includeInstance, f)
        };
        if (includeInstance) {
            obj.$jspbMessageInstance = msg;
        }
        return obj;
    };
}
proto.Transaction.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.Transaction;
    return proto.Transaction.deserializeBinaryFromReader(msg, reader);
};
proto.Transaction.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
        if (reader.isEndGroup()) {
            break;
        }
        var field = reader.getFieldNumber();
        switch (field) {
            case 1:
                var value = (reader.readString());
                msg.setAccount(value);
                break;
            case 2:
                var value = new XRPAmount_pb.XRPAmount;
                reader.readMessage(value, XRPAmount_pb.XRPAmount.deserializeBinaryFromReader);
                msg.setFee(value);
                break;
            case 3:
                var value = (reader.readUint64());
                msg.setSequence(value);
                break;
            case 4:
                var value = new Payment_pb.Payment;
                reader.readMessage(value, Payment_pb.Payment.deserializeBinaryFromReader);
                msg.setPayment(value);
                break;
            default:
                reader.skipField();
                break;
        }
    }
    return msg;
};
proto.Transaction.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.Transaction.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
};
proto.Transaction.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getAccount();
    if (f.length > 0) {
        writer.writeString(1, f);
    }
    f = message.getFee();
    if (f != null) {
        writer.writeMessage(2, f, XRPAmount_pb.XRPAmount.serializeBinaryToWriter);
    }
    f = message.getSequence();
    if (f !== 0) {
        writer.writeUint64(3, f);
    }
    f = message.getPayment();
    if (f != null) {
        writer.writeMessage(4, f, Payment_pb.Payment.serializeBinaryToWriter);
    }
};
proto.Transaction.prototype.getAccount = function () {
    return (jspb.Message.getFieldWithDefault(this, 1, ""));
};
proto.Transaction.prototype.setAccount = function (value) {
    jspb.Message.setProto3StringField(this, 1, value);
};
proto.Transaction.prototype.getFee = function () {
    return (jspb.Message.getWrapperField(this, XRPAmount_pb.XRPAmount, 2));
};
proto.Transaction.prototype.setFee = function (value) {
    jspb.Message.setWrapperField(this, 2, value);
};
proto.Transaction.prototype.clearFee = function () {
    this.setFee(undefined);
};
proto.Transaction.prototype.hasFee = function () {
    return jspb.Message.getField(this, 2) != null;
};
proto.Transaction.prototype.getSequence = function () {
    return (jspb.Message.getFieldWithDefault(this, 3, 0));
};
proto.Transaction.prototype.setSequence = function (value) {
    jspb.Message.setProto3IntField(this, 3, value);
};
proto.Transaction.prototype.getPayment = function () {
    return (jspb.Message.getWrapperField(this, Payment_pb.Payment, 4));
};
proto.Transaction.prototype.setPayment = function (value) {
    jspb.Message.setOneofWrapperField(this, 4, proto.Transaction.oneofGroups_[0], value);
};
proto.Transaction.prototype.clearPayment = function () {
    this.setPayment(undefined);
};
proto.Transaction.prototype.hasPayment = function () {
    return jspb.Message.getField(this, 4) != null;
};
goog.object.extend(exports, proto);
//# sourceMappingURL=Transaction_pb.js.map