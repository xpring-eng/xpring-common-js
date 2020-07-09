import { createHash } from 'crypto'

const utils = {
  /**
   * Convert the given byte array to a hexadecimal string.
   *
   * @param bytes - An array of bytes.
   * @returns An encoded hexadecimal string.
   */
  toHex(bytes: Uint8Array): string {
    return Buffer.from(bytes).toString('hex').toUpperCase()
  },

  /**
   * Convert the given hexadecimal string to a byte array.
   *
   * @param hex - A hexadecimal string.
   * @returns A decoded byte array.
   */
  toBytes(hex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(hex, 'hex'))
  },

  /**
   * Check if the given string is valid hex.
   *
   * @param input - The input to check.
   * @returns True if the input is valid hex, otherwise false.
   */
  isHex(input: string): boolean {
    const hexRegEx = /(?:[0-9]|[a-f])/gimu
    return (input.match(hexRegEx) ?? []).length === input.length
  },

  /**
   * Compute the SHA512 half hash of the given bytes.
   *
   * @param bytes - The array of bytes to hash.
   * @returns The hash of the input.
   */
  sha512Half(bytes: Uint8Array): Uint8Array {
    const sha512 = createHash('sha512')
    const hashHex = sha512.update(bytes).digest('hex').toUpperCase()
    const hash = this.toBytes(hashHex)

    return hash.slice(0, hash.length / 2)
  },

  /**
   * Convert a buffer to a hex string.
   *
   * @param buffer - The buffer to convert.
   * @returns A hex string representing the buffer.
   */
  hexFromBuffer(buffer: Buffer): string {
    return buffer.toString('hex').toUpperCase()
  },
}

export default utils
