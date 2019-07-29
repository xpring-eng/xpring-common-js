const keypair = require('ripple-keypairs')

const petra = {
  generateAddress: function() {
    console.log("ADDR")
    let mnemonic = keypair.generateSeed();
    console.log(mnemonic)
  },
}

module.exports = petra;
