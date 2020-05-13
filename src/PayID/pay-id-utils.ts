import PayIDComponents from './pay-id-components'

/**
 * A static utility class for PayID.
 */
export default abstract class PayIDUtils {
  /**
   * Parse a PayID string to a set of PayIDComponents object
   *
   * @param parsePayID - The input Pay ID.
   * @returns A PayIDComponents object if the input was valid, otherwise undefined.
   */
  public static parsePayID(payID: string): PayIDComponents | undefined {
    if (!PayIDUtils.isASCII(payID)) {
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

    return new PayIDComponents(host, `/${path}`)
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
