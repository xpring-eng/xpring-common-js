"use strict";
var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();
goog.exportSymbol('proto.FiatAmount', null, global);
goog.exportSymbol('proto.FiatAmount.Currency', null, global);
proto.FiatAmount = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.FiatAmount, jspb.Message);
if (goog.DEBUG && !COMPILED) {
    proto.FiatAmount.displayName = 'proto.FiatAmount';
}
if (jspb.Message.GENERATE_TO_OBJECT) {
    proto.FiatAmount.prototype.toObject = function (opt_includeInstance) {
        return proto.FiatAmount.toObject(opt_includeInstance, this);
    };
    proto.FiatAmount.toObject = function (includeInstance, msg) {
        var f, obj = {
            currency: jspb.Message.getFieldWithDefault(msg, 1, 0),
            value: jspb.Message.getFieldWithDefault(msg, 2, ""),
            issuer: jspb.Message.getFieldWithDefault(msg, 3, "")
        };
        if (includeInstance) {
            obj.$jspbMessageInstance = msg;
        }
        return obj;
    };
}
proto.FiatAmount.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.FiatAmount;
    return proto.FiatAmount.deserializeBinaryFromReader(msg, reader);
};
proto.FiatAmount.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
        if (reader.isEndGroup()) {
            break;
        }
        var field = reader.getFieldNumber();
        switch (field) {
            case 1:
                var value = (reader.readEnum());
                msg.setCurrency(value);
                break;
            case 2:
                var value = (reader.readString());
                msg.setValue(value);
                break;
            case 3:
                var value = (reader.readString());
                msg.setIssuer(value);
                break;
            default:
                reader.skipField();
                break;
        }
    }
    return msg;
};
proto.FiatAmount.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.FiatAmount.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
};
proto.FiatAmount.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getCurrency();
    if (f !== 0.0) {
        writer.writeEnum(1, f);
    }
    f = message.getValue();
    if (f.length > 0) {
        writer.writeString(2, f);
    }
    f = message.getIssuer();
    if (f.length > 0) {
        writer.writeString(3, f);
    }
};
proto.FiatAmount.Currency = {
    USD: 0
};
proto.FiatAmount.prototype.getCurrency = function () {
    return (jspb.Message.getFieldWithDefault(this, 1, 0));
};
proto.FiatAmount.prototype.setCurrency = function (value) {
    jspb.Message.setProto3EnumField(this, 1, value);
};
proto.FiatAmount.prototype.getValue = function () {
    return (jspb.Message.getFieldWithDefault(this, 2, ""));
};
proto.FiatAmount.prototype.setValue = function (value) {
    jspb.Message.setProto3StringField(this, 2, value);
};
proto.FiatAmount.prototype.getIssuer = function () {
    return (jspb.Message.getFieldWithDefault(this, 3, ""));
};
proto.FiatAmount.prototype.setIssuer = function (value) {
    jspb.Message.setProto3StringField(this, 3, value);
};
goog.object.extend(exports, proto);
//# sourceMappingURL=FiatAmount_pb.js.map