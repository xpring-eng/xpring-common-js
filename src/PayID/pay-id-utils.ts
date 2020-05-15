// Disable multiple classes to accommodate the switch to idiomatic style naming.
// TODO(keefertaylor): Remove this when migration is complete.
/* eslint-disable  max-classes-per-file */

import PayIdComponents, { PayIDComponents } from './pay-id-components'

/**
 * A static utility class for Pay ID functionality.
 */
export default class PayIdUtils {
  /**
   * Parse a PayID string to a set of PayIDComponents object
   *
   * @param parsePayID - The input Pay ID.
   * @returns A PayIDComponents object if the input was valid, otherwise undefined.
   */
  public static parsePayID(payID: string): PayIdComponents | undefined {
    if (!PayIdUtils.isASCII(payID)) {
      return
    }

    // Validate there are two components of a payment pointer.
    const components = payID.split('$')
    if (components.length !== 2) {
      return
    }

    // Validate the host and path have values.
    const path = components[0]
    const host = components[1]
    if (host.length === 0 || path.length === 0) {
      return
    }

    return new PayIdComponents(host, `/${path}`)
  }

  /**
   * Validate if the input is ASCII based text.
   *
   * Shamelessly taken from:
   * https://stackoverflow.com/questions/14313183/javascript-regex-how-do-i-check-if-the-string-is-ascii-only
   *
   * @param input - The input to check
   * @returns A boolean indicating the result.
   */
  private static isASCII(input: string): boolean {
    // eslint-disable-next-line no-control-regex
    return /^[\x00-\x7F]*$/u.test(input)
  }
}

/**
 * A static utility class for PayID.
 *
 * @deprecated Please use the idiomatically named `PayIdUtils` class instead.
 */
export class PayIDUtils {
  /**
   * Parse a PayID string to a set of PayIDComponents object
   *
   * @param parsePayID - The input Pay ID.
   * @returns A PayIDComponents object if the input was valid, otherwise undefined.
   */
  public static parsePayID(payID: string): PayIDComponents | undefined {
    const components = PayIdUtils.parsePayID(payID)
    return components !== undefined
      ? new PayIDComponents(components?.host, components?.path)
      : undefined
  }

  /** Please do not instantiate this static utility class. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
}
