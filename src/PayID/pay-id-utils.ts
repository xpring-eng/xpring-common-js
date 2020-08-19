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
}
export default payIdUtils
