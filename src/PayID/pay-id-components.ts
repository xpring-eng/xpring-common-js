/**
 * A class which encapsulates components of a Pay ID.
 */
export default class PayIDComponents {
  /**
   * Create a new PayIDComponents.
   *
   * @param host - The host of the payment pointer.
   * @param path - The path of the payment pointer, starting with a leading '/'.
   */
  public constructor(
    public readonly host: string,
    public readonly path: string,
  ) {}
}
