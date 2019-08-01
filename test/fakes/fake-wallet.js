const Wallet = require('../../wallet.js');

/**
 * A fake wallet that signs with the given signature.
 */
class FakeWallet extends Wallet {
    /**
     * Initialize a wallet which will always produce the same signature when asked to sign a string.
     * 
     * @param {String} signature The signature this wallet will produce.
     */
    constructor(signature) {    
        super(
            "00D78B9735C3F26501C7337B8A5727FD53A6EFDBC6AA55984F098488561F985E23",
            "030D58EB48B4420B1F7B9DF55087E0E29FEF0E8468F9A6825B01CA2C361042D435"   
        );

        this.signature = signature;
    }

    /**
     * Return a fake signature for any input.
     * 
     * @param {String} hex The hex to sign.
     */
    sign(hex) {
        return this.signature;
    }
}

module.exports = FakeWallet;
