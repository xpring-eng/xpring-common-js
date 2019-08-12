"use strict";

var addressCodec = require("ripple-address-codec");

class Utils {
  isValidAddress(address: string): boolean {
    return addressCodec.isValidAddress(address);
  }
};

export default Utils;