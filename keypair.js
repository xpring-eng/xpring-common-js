/**
 * A pair of assymetric cryptographic keys.
 */
class KeyPair {
    /**
     * Create a new key pair.
     * 
     * @constructor
     * 
     * @param {String} privateKey The private key.
     * @param {String} publicKey The public key.
     */
    constructor(privateKey, publicKey) {
      this.privateKey = privateKey
      this.publicKey = publicKey
    }
}