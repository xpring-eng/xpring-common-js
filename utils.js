"use strict";
var addressCodec = require("ripple-address-codec");
var utils = {
  isValidAddress: function(address) {
    return addressCodec.isValidAddress(address);
  }
};
module.exports = utils;
