// Disable multiple classes to accommodate the switch to idiomatic style naming.
/* eslint-disable import/no-deprecated */
import PayIdComponents, { PayIDComponents } from './pay-id-components'

/**
 * A static utility class for Pay ID functionality.
 */
const payIdUtils = {
  /**
   * Parse a PayID string to a set of PayIDComponents object
   *
   * @param payID - The input Pay ID.
   * @returns A PayIDComponents object if the input was valid, otherwise undefined.
   */
  parsePayID(payID: string): PayIdComponents | undefined {
    if (!this.isASCII(payID)) {
      return undefined
    }

    // Validate there are two components of a payment pointer.
    const components = payID.split('$')
    if (components.length !== 2) {
      return undefined
    }

    // Validate the host and path have values.
    const path = components[0]
    const host = components[1]
    if (host.length === 0 || path.length === 0) {
      return undefined
    }

    return new PayIdComponents(host, `/${path}`)
  },

  /**
   * Validate if the input is ASCII based text.
   *
   * Shamelessly taken from:
   * https://stackoverflow.com/questions/14313183/javascript-regex-how-do-i-check-if-the-string-is-ascii-only
   *
   * @param input - The input to check
   * @returns A boolean indicating the result.
   */
  isASCII(input: string): boolean {
    // eslint-disable-next-line no-control-regex
    return /^[\x00-\x7F]*$/u.test(input)
  },
}
export default payIdUtils

/**
 * A static utility class for PayID.
 *
 * @deprecated Please use the idiomatically named `PayIdUtils` class instead.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class PayIDUtils {
  /**
   * Parse a PayID string to a set of PayIDComponents object.
   *
   * @param payID - The PayID to parse.
   * @returns A PayIDComponents object if the input was valid, otherwise undefined.
   */
  public static parsePayID(payID: string): PayIDComponents | undefined {
    const components = payIdUtils.parsePayID(payID)
    return components
      ? new PayIDComponents(components.host, components.path)
      : undefined
  }
}
