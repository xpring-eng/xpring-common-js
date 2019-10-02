"use strict";

var addressCodec = require("ripple-address-codec");

class Utils {
  public static isValidAddress(address: string): boolean {
    return addressCodec.isValidAddress(address);
  }

  public static toHex(bytes: Uint8Array): String {
    return Buffer.from(bytes).toString('hex');
  }

  public static toBytes(hex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(hex, 'hex'));
  }
}

export default Utils;
