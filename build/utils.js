Object.defineProperty(exports, "__esModule", { value: true });
var addressCodec = require("ripple-address-codec");
class Utils {
  isValidAddress(address) {
    return addressCodec.isValidAddress(address);
  }
}

exports.default = Utils;
//# sourceMappingURL=utils.js.map
