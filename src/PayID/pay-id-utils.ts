import PayIdComponents from './pay-id-components'

/**
 * A static utility class for Pay ID functionality.
 */
const payIdUtils = {
  /**
   * Parse a PayID string to a set of PayIdComponents object.
   *
   * @param payId - The input Pay ID.
   * @returns A PayIdComponents object if the input was valid, otherwise undefined.
   */
  parsePayId(payId: string): PayIdComponents | undefined {
    if (!this.isASCII(payId)) {
      return undefined
    }

    // Split on the last occurrence of '$'
    const lastDollarIndex = payId.lastIndexOf('$')
    if (lastDollarIndex === -1) {
      return undefined
    }
    const path = payId.slice(0, lastDollarIndex)
    const host = payId.slice(lastDollarIndex + 1)

    // Validate the host and path have values.
    if (host.length === 0 || path.length === 0) {
      return undefined
    }

    return new PayIdComponents(host, `/${path}`)
  },

  /**
   * Validate if the input is ASCII based text.
   *
   * Shamelessly taken from:
   * https://stackoverflow.com/questions/14313183/javascript-regex-how-do-i-check-if-the-string-is-ascii-only.
   *
   * @param input - The input to check.
   * @returns A boolean indicating the result.
   */
  isASCII(input: string): boolean {
    // eslint-disable-next-line no-control-regex -- The ASCII regex uses control characters
    return /^[\x00-\x7F]*$/u.test(input)
  },
}
export default payIdUtils
