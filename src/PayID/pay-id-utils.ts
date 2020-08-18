import * as utils from '@payid-org/utils'

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
    try {
      utils.parsePayId(payId)
      const [path, host] = utils.splitPayIdString(payId)
      return new PayIdComponents(host, `/${path}`)
    } catch {
      return undefined
    }
  },
}
export default payIdUtils
