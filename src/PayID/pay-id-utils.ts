import PaymentPointer from './payment-pointer'

/**
 * A static utility class for PayID.
 */
export default class PayIDUtils {
  /**
   * Parse a payment pointer string to a payment pointer object
   *
   * @param paymentPointer The input string payment pointer.
   * @returns A PaymentPointer object if the input was valid, otherwise undefined.
   */
  public static parsePaymentPointer(
    paymentPointer: string,
  ): PaymentPointer | undefined {
    // Payment pointers must start with a '$'
    if (!paymentPointer.startsWith('$')) {
      return
    }

    const address = paymentPointer.substring(1)
    const pathIndex = address.indexOf('/')
    if (pathIndex >= 0) {
      return new PaymentPointer(
        address.substring(0, pathIndex),
        address.substring(pathIndex),
      )
    }
    return new PaymentPointer(address)
  }

  /** Please do not instantiate this static utility class. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
}
