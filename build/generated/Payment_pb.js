"use strict";
var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();
var FiatAmount_pb = require('./FiatAmount_pb.js');
goog.object.extend(proto, FiatAmount_pb);
var XRPAmount_pb = require('./XRPAmount_pb.js');
goog.object.extend(proto, XRPAmount_pb);
goog.exportSymbol('proto.Payment', null, global);
proto.Payment = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, proto.Payment.oneofGroups_);
};
goog.inherits(proto.Payment, jspb.Message);
if (goog.DEBUG && !COMPILED) {
    proto.Payment.displayName = 'proto.Payment';
}
proto.Payment.oneofGroups_ = [[1, 2]];
proto.Payment.AmountCase = {
    AMOUNT_NOT_SET: 0,
    XRP_AMOUNT: 1,
    FIAT_AMOUNT: 2
};
proto.Payment.prototype.getAmountCase = function () {
    return (jspb.Message.computeOneofCase(this, proto.Payment.oneofGroups_[0]));
};
if (jspb.Message.GENERATE_TO_OBJECT) {
    proto.Payment.prototype.toObject = function (opt_includeInstance) {
        return proto.Payment.toObject(opt_includeInstance, this);
    };
    proto.Payment.toObject = function (includeInstance, msg) {
        var f, obj = {
            xrpAmount: (f = msg.getXrpAmount()) && XRPAmount_pb.XRPAmount.toObject(includeInstance, f),
            fiatAmount: (f = msg.getFiatAmount()) && FiatAmount_pb.FiatAmount.toObject(includeInstance, f),
            destination: jspb.Message.getFieldWithDefault(msg, 3, "")
        };
        if (includeInstance) {
            obj.$jspbMessageInstance = msg;
        }
        return obj;
    };
}
proto.Payment.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.Payment;
    return proto.Payment.deserializeBinaryFromReader(msg, reader);
};
proto.Payment.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
        if (reader.isEndGroup()) {
            break;
        }
        var field = reader.getFieldNumber();
        switch (field) {
            case 1:
                var value = new XRPAmount_pb.XRPAmount;
                reader.readMessage(value, XRPAmount_pb.XRPAmount.deserializeBinaryFromReader);
                msg.setXrpAmount(value);
                break;
            case 2:
                var value = new FiatAmount_pb.FiatAmount;
                reader.readMessage(value, FiatAmount_pb.FiatAmount.deserializeBinaryFromReader);
                msg.setFiatAmount(value);
                break;
            case 3:
                var value = (reader.readString());
                msg.setDestination(value);
                break;
            default:
                reader.skipField();
                break;
        }
    }
    return msg;
};
proto.Payment.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.Payment.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
};
proto.Payment.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getXrpAmount();
    if (f != null) {
        writer.writeMessage(1, f, XRPAmount_pb.XRPAmount.serializeBinaryToWriter);
    }
    f = message.getFiatAmount();
    if (f != null) {
        writer.writeMessage(2, f, FiatAmount_pb.FiatAmount.serializeBinaryToWriter);
    }
    f = message.getDestination();
    if (f.length > 0) {
        writer.writeString(3, f);
    }
};
proto.Payment.prototype.getXrpAmount = function () {
    return (jspb.Message.getWrapperField(this, XRPAmount_pb.XRPAmount, 1));
};
proto.Payment.prototype.setXrpAmount = function (value) {
    jspb.Message.setOneofWrapperField(this, 1, proto.Payment.oneofGroups_[0], value);
};
proto.Payment.prototype.clearXrpAmount = function () {
    this.setXrpAmount(undefined);
};
proto.Payment.prototype.hasXrpAmount = function () {
    return jspb.Message.getField(this, 1) != null;
};
proto.Payment.prototype.getFiatAmount = function () {
    return (jspb.Message.getWrapperField(this, FiatAmount_pb.FiatAmount, 2));
};
proto.Payment.prototype.setFiatAmount = function (value) {
    jspb.Message.setOneofWrapperField(this, 2, proto.Payment.oneofGroups_[0], value);
};
proto.Payment.prototype.clearFiatAmount = function () {
    this.setFiatAmount(undefined);
};
proto.Payment.prototype.hasFiatAmount = function () {
    return jspb.Message.getField(this, 2) != null;
};
proto.Payment.prototype.getDestination = function () {
    return (jspb.Message.getFieldWithDefault(this, 3, ""));
};
proto.Payment.prototype.setDestination = function (value) {
    jspb.Message.setProto3StringField(this, 3, value);
};
goog.object.extend(exports, proto);
//# sourceMappingURL=Payment_pb.js.map