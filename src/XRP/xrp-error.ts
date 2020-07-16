/**
 * Types of errors that originate from interacting with XRPL.
 */
export enum XrpErrorType {
  InvalidInput,
  PaymentConversionFailure,
  MalformedResponse,
  SigningError,
  Unknown,
  XAddressRequired,
}

/**
 * Represents errors thrown by XRP components of the Xpring SDK.
 */
export default class XrpError extends Error {
  /**
   * An X-Address is required to use the requested functionality.
   */
  public static xAddressRequired = new XrpError(
    XrpErrorType.XAddressRequired,
    'Please use the X-Address format. See: https://xrpaddress.info/.',
  )

  /**
   * A payment transaction can't be converted to an XrpTransaction.
   */
  public static paymentConversionFailure = new XrpError(
    XrpErrorType.PaymentConversionFailure,
    'Could not convert payment transaction: (transaction). Please file a bug at https://github.com/xpring-eng/Xpring-JS/issues',
  )

  /**
   * The response was in an unexpected format.
   */
  public static malformedResponse = new XrpError(
    XrpErrorType.MalformedResponse,
    'The response from the remote service was malformed or in an unexpected format',
  )

  /** The error's type. */
  public readonly errorType: XrpErrorType

  /**
   * Creates a new XrpError.
   *
   * @param errorType - The type of error.
   * @param message - The error message.
   */
  public constructor(
    errorType: XrpErrorType,
    message: string | undefined = undefined,
  ) {
    super(message)

    this.errorType = errorType
  }
}
