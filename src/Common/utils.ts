import { createHash } from 'crypto'
import XrpUtils, { ClassicAddress } from '../XRP/xrp-utils'

const utils = {
  /**
   * Validate that the given string is a valid address for the XRP Ledger.
   *
   * This function returns true for both X-addresses and classic addresses.
   * @see https://xrpaddress.info/
   *
   * @deprecated Please use the method provided by XrpUtils instead.
   *
   * @param address - An address to check.
   * @returns True if the address is valid, otherwise false.
   */
  isValidAddress(address: string): boolean {
    return XrpUtils.isValidAddress(address)
  },

  /**
   * Validate whether the given string is a valid X-address for the XRP Ledger.
   *
   * @see https://xrpaddress.info/
   *
   * @deprecated Please use the method provided by XrpUtils instead.
   *
   * @param address - An address to check.
   * @returns True if the address is a valid X-address, otherwise false.
   */
  isValidXAddress(address: string): boolean {
    return XrpUtils.isValidXAddress(address)
  },

  /**
   * Validate whether the given string is a valid classic address for the XRP Ledger.
   *
   * @see https://xrpaddress.info/
   *
   * @deprecated Please use the method provided by XrpUtils instead.
   *
   * @param address - An address to check.
   * @returns True if the address is a valid classic address, otherwise false.
   */
  isValidClassicAddress(address: string): boolean {
    return XrpUtils.isValidClassicAddress(address)
  },

  /**
   * Encode the given classic address and tag into an x-address.
   *
   * @see https://xrpaddress.info/
   *
   * @deprecated Please use the method provided by XrpUtils instead.
   *
   * @param classicAddress - A classic address to encode.
   * @param tag - An optional tag to encode.
   * @param test - Whether the address is for use on a test network, defaults to `false`.
   * @returns A new x-address if inputs were valid, otherwise undefined.
   */
  encodeXAddress(
    classicAddress: string,
    tag: number | undefined,
    test = false,
  ): string | undefined {
    return XrpUtils.encodeXAddress(classicAddress, tag, test)
  },

  /**
   * Decode a `ClassicAddress` from a given x-address.
   *
   * @see https://xrpaddress.info/
   *
   * @deprecated Please use the method provided by XrpUtils instead.
   *
   * @param xAddress - The xAddress to decode.
   * @returns A `ClassicAddress`
   */
  decodeXAddress(xAddress: string): ClassicAddress | undefined {
    return XrpUtils.decodeXAddress(xAddress)
  },

  /**
   * Convert the given byte array to a hexadecimal string.
   *
   * @param bytes - An array of bytes
   * @returns An encoded hexadecimal string.
   */
  toHex(bytes: Uint8Array): string {
    return Buffer.from(bytes).toString('hex').toUpperCase()
  },

  /**
   * Convert the given hexadecimal string to a byte array.
   *
   * @param hex - A hexadecimal string.
   * @returns A decoded byte array.
   */
  toBytes(hex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(hex, 'hex'))
  },

  /**
   * Convert the given transaction blob to a transaction hash.
   *
   * @deprecated Please use the method provided by XrpUtils instead.
   *
   * @param transactionBlobHex - A hexadecimal encoded transaction blob.
   * @returns A hex encoded hash if the input was valid, otherwise undefined.
   */
  transactionBlobToTransactionHash(
    transactionBlobHex: string,
  ): string | undefined {
    return XrpUtils.transactionBlobToTransactionHash(transactionBlobHex)
  },

  /**
   * Check if the given string is valid hex.
   *
   * @param input - The input to check.
   * @returns true if the input is valid hex, otherwise false.
   */
  isHex(input: string): boolean {
    const hexRegEx = /(?:[0-9]|[a-f])/gimu
    return (input.match(hexRegEx) ?? []).length === input.length
  },

  /**
   * Compute the SHA512 half hash of the given bytes.
   *
   * @param input - The input to hash.
   * @returns The hash of the input.
   */
  sha512Half(bytes: Uint8Array): Uint8Array {
    const sha512 = createHash('sha512')
    const hashHex = sha512.update(bytes).digest('hex').toUpperCase()
    const hash = this.toBytes(hashHex)

    return hash.slice(0, hash.length / 2)
  },
}

export default utils
