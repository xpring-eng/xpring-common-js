"use strict";
var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();
goog.exportSymbol('proto.XRPAmount', null, global);
proto.XRPAmount = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.XRPAmount, jspb.Message);
if (goog.DEBUG && !COMPILED) {
    proto.XRPAmount.displayName = 'proto.XRPAmount';
}
if (jspb.Message.GENERATE_TO_OBJECT) {
    proto.XRPAmount.prototype.toObject = function (opt_includeInstance) {
        return proto.XRPAmount.toObject(opt_includeInstance, this);
    };
    proto.XRPAmount.toObject = function (includeInstance, msg) {
        var f, obj = {
            drops: jspb.Message.getFieldWithDefault(msg, 1, 0)
        };
        if (includeInstance) {
            obj.$jspbMessageInstance = msg;
        }
        return obj;
    };
}
proto.XRPAmount.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.XRPAmount;
    return proto.XRPAmount.deserializeBinaryFromReader(msg, reader);
};
proto.XRPAmount.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
        if (reader.isEndGroup()) {
            break;
        }
        var field = reader.getFieldNumber();
        switch (field) {
            case 1:
                var value = (reader.readUint64());
                msg.setDrops(value);
                break;
            default:
                reader.skipField();
                break;
        }
    }
    return msg;
};
proto.XRPAmount.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.XRPAmount.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
};
proto.XRPAmount.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getDrops();
    if (f !== 0) {
        writer.writeUint64(1, f);
    }
};
proto.XRPAmount.prototype.getDrops = function () {
    return (jspb.Message.getFieldWithDefault(this, 1, 0));
};
proto.XRPAmount.prototype.setDrops = function (value) {
    jspb.Message.setProto3IntField(this, 1, value);
};
goog.object.extend(exports, proto);
//# sourceMappingURL=XRPAmount_pb.js.map