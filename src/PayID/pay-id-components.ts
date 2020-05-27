// Disable multiple classes to accommodate the switch to idiomatic style naming.
// TODO(keefertaylor): Remove this when migration is complete.
/* eslint-disable  max-classes-per-file */

/**
 * A class which encapsulates components of a Pay ID.
 */
export default class PayIdComponents {
  public readonly host: string

  public readonly path: string

  /**
   * Create a new PayIdComponents.
   *
   * @param host - The host of the payment pointer.
   * @param path - The path of the payment pointer, starting with a leading '/'.
   */
  public constructor(host: string, path: string) {
    this.host = host
    this.path = path
  }
}

/**
 * A class which encapsulates components of a Pay ID.
 *
 * @deprecated Please use the idiomatically named `PayIdComponents` class instead.
 */
export class PayIDComponents {
  public readonly host: string

  public readonly path: string

  /**
   * Create a new PayIDComponents.
   *
   * @param host - The host of the payment pointer.
   * @param path - The path of the payment pointer, starting with a leading '/'.
   */
  public constructor(host: string, path: string) {
    this.host = host
    this.path = path
  }
}
