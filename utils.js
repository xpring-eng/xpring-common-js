const addressCodec = require('ripple-address-codec');

const utils = {
    isValidAddress: function(address) {
        return addressCodec.isValidAddress(address);
    }
}

module.exports = utils