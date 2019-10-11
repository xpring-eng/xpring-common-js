"use strict";

var addressCodec = require("ripple-address-codec");

/**
 * A simple property bag which contains components of a classic address. Components contained in this object are neither sanitized or validated.
 */
export interface ClassicAddress {
  /** A classic address. */
  address: string;

  /** An optional tag. */
  tag: number | undefined;
}

class Utils {
  /**
   * Validate that the given string is a valid address on the XRP Ledger.
   *
   * This function returns true for both X-addresses and classic addresses.
   * @see https://xrpaddress.info/
   *
   * @param address An address to check.
   * @returns True if the address is valid, otherwise false.
   */
  public static isValidAddress(address: string): boolean {
    return (
      addressCodec.isValidClassicAddress(address) ||
      addressCodec.isValidXAddress(address)
    );
  }

  /**
   * Encode the given classic address and tag into an x-address.
   *
   * @see https://xrpaddress.info/
   *
   * @param classicAddress A classic address to encode.
   * @param tag An optional tag to encode.
   * @returns A new x-address if inputs were valid, otherwise undefined.
   */
  public static encodeXAddress(
    classicAddress: string,
    tag: number | undefined
  ): string | undefined {
    if (!addressCodec.isValidClassicAddress(classicAddress)) {
      return undefined;
    }

    // Xpring Common JS's API takes a string|undefined while the underlying address library wants string|false.
    const shimTagParameter = tag != undefined ? tag : false;
    return addressCodec.classicAddressToXAddress(
      classicAddress,
      shimTagParameter
    );
  }

  /**
   * Decode a `ClassicAddress` from a given x-address.
   *
   * @see https://xrpaddress.info/
   *
   * @param xAddress The xAddress to decode.
   * @returns A `ClassicAddress`
   */
  public static decodeXAddress(xAddress: string): ClassicAddress | undefined {
    if (!addressCodec.isValidXAddress(xAddress)) {
      return undefined;
    }

    let shimClassicAddress = addressCodec.xAddressToClassicAddress(xAddress);
    return {
      address: shimClassicAddress.classicAddress,
      tag: shimClassicAddress.tag != false ? shimClassicAddress.tag : undefined
    };
  }

  /**
   * Convert the given byte array to a hexadecimal string.
   *
   * @param bytes An array of bytes
   * @returns An encoded hexadecimal string.
   */
  public static toHex(bytes: Uint8Array): string {
    return Buffer.from(bytes).toString("hex");
  }

  /**
   * Convert the given hexadecimal string to a byte array.
   *
   * @param hex A hexadecimal string.
   * @returns A decoded byte array.
   */
  public static toBytes(hex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(hex, "hex"));
  }
}

export default Utils;
