import * as addressCodec from 'ripple-address-codec'

import Utils from '../Common/utils'

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
   * Convert the given transaction blob to a transaction hash.
   *
   * @param transactionBlobHex - A hexadecimal encoded transaction blob.
   * @returns A hex encoded hash if the input was valid, otherwise undefined.
   */
  transactionBlobToTransactionHash(
    transactionBlobHex: string,
  ): string | undefined {
    if (!Utils.isHex(transactionBlobHex)) {
      return undefined
    }

    const prefixedTransactionBlob = Utils.toBytes(
      signedTransactionPrefixHex + transactionBlobHex,
    )
    const hash = Utils.sha512Half(prefixedTransactionBlob)
    return Utils.toHex(hash)
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
