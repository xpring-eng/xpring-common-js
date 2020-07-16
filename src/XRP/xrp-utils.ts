import { BigNumber } from 'bignumber.js'
import * as addressCodec from 'ripple-address-codec'

import Utils from '../Common/utils'

import XrpError, { XrpErrorType } from './xrp-error'
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

  /**
   * Convert drops to an XRP amount.
   *
   * @throws An {@link XrpError} if the inputs are invalid.
   *
   * @param drops - A number of drops to convert.
   * @returns The equivalent amount of XRP.
   */
  // eslint-disable-next-line max-statements --  Disabled due to historical code imported from Xpring-JS
  dropsToXrp(drops: BigNumber.Value): string {
    const dropsRegEx = RegExp(/^-?[0-9]*\.?[0-9]*$/)

    if (typeof drops === 'string') {
      if (!dropsRegEx.exec(drops)) {
        throw new XrpError(
          XrpErrorType.InvalidInput,
          `dropsToXrp: invalid value '${drops}',` +
            ` should be a number matching (^-?[0-9]*\\.?[0-9]*$).`,
        )
      } else if (drops === '.') {
        throw new XrpError(
          XrpErrorType.InvalidInput,
          `dropsToXrp: invalid value '${drops}',` +
            ` should be a BigNumber or string-encoded number.`,
        )
      }
    }

    // Converting to BigNumber and then back to string should remove any
    // decimal point followed by zeros, e.g. '1.00'.
    // Important: specify base 10 to avoid exponential notation, e.g. '1e-7'.
    const normalizedDrops = new BigNumber(drops).toString()

    // drops are only whole units
    if (normalizedDrops.includes('.')) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        `dropsToXrp: value '${normalizedDrops}' has too many decimal places.`,
      )
    }

    // This should never happen; the value has already been
    // validated above. This just ensures BigNumber did not do
    // something unexpected.
    if (!dropsRegEx.exec(normalizedDrops)) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        `dropsToXrp: failed sanity check -` +
          ` value '${normalizedDrops}',` +
          ` does not match (^-?[0-9]+$).`,
      )
    }
    const maxPrecisionDigits = 6
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Doing base 10 manipulations
    const dropsPerXrp = 10 ** maxPrecisionDigits
    return new BigNumber(normalizedDrops).dividedBy(dropsPerXrp).toString()
  },

  /**
   * Convert an XRP amount to drops.
   *
   * @throws An {@link XrpError} if the inputs are invalid.
   *
   * @param xrp - A amount of XRP to convert.
   * @returns The equivalent amount of dropt.
   */
  // eslint-disable-next-line max-statements, max-lines-per-function -- Disabled due to historical code imported from Xpring-JS
  xrpToDrops(xrp: BigNumber.Value): string {
    const xrpRegEx = RegExp(/^-?[0-9]*\.?[0-9]*$/)

    if (typeof xrp === 'string') {
      if (!xrpRegEx.exec(xrp)) {
        throw new XrpError(
          XrpErrorType.InvalidInput,
          `xrpToDrops: invalid value '${xrp}',` +
            ` should be a number matching (^-?[0-9]*\\.?[0-9]*$).`,
        )
      } else if (xrp === '.') {
        throw new XrpError(
          XrpErrorType.InvalidInput,
          `xrpToDrops: invalid value '${xrp}',` +
            ` should be a BigNumber or string-encoded number.`,
        )
      }
    }

    // Important: specify base 10 to avoid exponential notation, e.g. '1e-7'.
    const normalizedXrp = new BigNumber(xrp).toString()

    // This should never happen; the value has already been
    // validated above. This just ensures BigNumber did not do
    // something unexpected.
    if (!xrpRegEx.exec(normalizedXrp)) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        `xrpToDrops: failed sanity check -` +
          ` value '${normalizedXrp}',` +
          ` does not match (^-?[0-9.]+$).`,
      )
    }

    const components = normalizedXrp.split('.')
    if (components.length > 2) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        `xrpToDrops: failed sanity check -` +
          ` value '${normalizedXrp}' has` +
          ` too many decimal points.`,
      )
    }

    const fraction = components[1] || '0'
    const maxPrecisionDigits = 6
    if (fraction.length > maxPrecisionDigits) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        `xrpToDrops: value '${normalizedXrp}' has too many decimal places.`,
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Doing base 10 manipulations
    const dropsPerXrp = 10 ** maxPrecisionDigits
    return new BigNumber(normalizedXrp)
      .times(dropsPerXrp)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString()
  },
}

export default xrpUtils
