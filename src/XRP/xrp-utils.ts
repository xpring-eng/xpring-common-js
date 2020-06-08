import { createHash } from 'crypto'

import * as addressCodec from 'ripple-address-codec'

import XrplNetwork from './xrpl-network'

/**
 * A prefix applied when hashing a signed transaction blob.
 *
 * @see Https://xrpl.org/basic-data-types.html#hashes.
 */
const signedTransactionPrefixHex = '54584E00'

/**
 * A simple property bag which contains components of a classic address.
 * Components contained in this object are neither sanitized nor validated.
 */
export interface ClassicAddress {
  /** A classic address. */
  address: string

  /** An optional tag. */
  tag?: number

  /** A boolean indicating whether this address is for use on a test network. */
  test: boolean
}

const xrpUtils = {
  /**
   * Validate that the given string is a valid address for the XRP Ledger.
   *
   * This function returns true for both X-addresses and classic addresses.
   *
   * @see Https://xrpaddress.info/.
   *
   * @param address - An address to check.
   * @returns True if the address is valid, otherwise false.
   */
  isValidAddress(address: string): boolean {
    return (
      addressCodec.isValidClassicAddress(address) ||
      addressCodec.isValidXAddress(address)
    )
  },

  /**
   * Validate whether the given string is a valid X-address for the XRP Ledger.
   *
   * @see Https://xrpaddress.info/.
   *
   * @param address - An address to check.
   * @returns True if the address is a valid X-address, otherwise false.
   */
  isValidXAddress(address: string): boolean {
    return addressCodec.isValidXAddress(address)
  },

  /**
   * Validate whether the given string is a valid classic address for the XRP Ledger.
   *
   * @see Https://xrpaddress.info/.
   *
   * @param address - An address to check.
   * @returns True if the address is a valid classic address, otherwise false.
   */
  isValidClassicAddress(address: string): boolean {
    return addressCodec.isValidClassicAddress(address)
  },

  /**
   * Encode the given classic address and tag into an x-address.
   *
   * @see Https://xrpaddress.info/.
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
    if (!addressCodec.isValidClassicAddress(classicAddress)) {
      return undefined
    }

    // Xpring Common JS's API takes a string|undefined while the underlying address library wants string|false.
    const shimTagParameter = tag ?? false
    return addressCodec.classicAddressToXAddress(
      classicAddress,
      shimTagParameter,
      test,
    )
  },

  /**
   * Decode a `ClassicAddress` from a given x-address.
   *
   * @see Https://xrpaddress.info/.
   *
   * @param xAddress - The xAddress to decode.
   * @returns A `ClassicAddress`.
   */
  decodeXAddress(xAddress: string): ClassicAddress | undefined {
    if (!addressCodec.isValidXAddress(xAddress)) {
      return undefined
    }

    const shimClassicAddress = addressCodec.xAddressToClassicAddress(xAddress)
    return {
      address: shimClassicAddress.classicAddress,
      tag:
        shimClassicAddress.tag === false ? undefined : shimClassicAddress.tag,
      test: shimClassicAddress.test,
    }
  },

  /**
   * Convert the given byte array to a hexadecimal string.
   *
   * This method exists to break a dependency cycle between XrpUtils and Utils while deprecated funtionality exists in the latter.
   * TODO(keefertaylor): Remove this when methods in Utils are removed.
   *
   * @param bytes - An array of bytes.
   * @returns An encoded hexadecimal string.
   */
  toHex(bytes: Uint8Array): string {
    return Buffer.from(bytes).toString('hex').toUpperCase()
  },

  /**
   * Convert the given hexadecimal string to a byte array.
   *
   * This method exists to break a dependency cycle between XrpUtils and Utils while deprecated funtionality exists in the latter.
   * TODO(keefertaylor): Remove this when methods in Utils are removed.
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
   * @param transactionBlobHex - A hexadecimal encoded transaction blob.
   * @returns A hex encoded hash if the input was valid, otherwise undefined.
   */
  transactionBlobToTransactionHash(
    transactionBlobHex: string,
  ): string | undefined {
    if (!this.isHex(transactionBlobHex)) {
      return undefined
    }

    const prefixedTransactionBlob = this.toBytes(
      signedTransactionPrefixHex + transactionBlobHex,
    )
    const hash = this.sha512Half(prefixedTransactionBlob)
    return this.toHex(hash)
  },

  /**
   * Check if the given string is valid hex.
   *
   * This method exists to break a dependency cycle between XrpUtils and Utils while deprecated funtionality exists in the latter.
   * TODO(keefertaylor): Remove this when methods in Utils are removed.
   *
   * @param input - The input to check.
   * @returns True if the input is valid hex, otherwise false.
   */
  isHex(input: string): boolean {
    const hexRegEx = /(?:[0-9]|[a-f])/gimu
    return (input.match(hexRegEx) ?? []).length === input.length
  },

  /**
   * Compute the SHA512 half hash of the given bytes.
   *
   * @param bytes - The input to hash.
   * @returns The hash of the input.
   */
  sha512Half(bytes: Uint8Array): Uint8Array {
    const sha512 = createHash('sha512')
    const hashHex = sha512.update(bytes).digest('hex').toUpperCase()
    const hash = this.toBytes(hashHex)

    return hash.slice(0, hash.length / 2)
  },

  /**
   * Returns whether the given `XrplNetwork` is a test network.
   *
   * @param network - The network to check.
   * @returns A boolean indicating if the network is a test network.
   */
  isTestNetwork(network: XrplNetwork): boolean {
    return network === XrplNetwork.Test || network === XrplNetwork.Dev
  },
}

export default xrpUtils
