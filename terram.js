const Wallet = require('./wallet.js')
const KeyPair = require('./keypair.js')

/**
 * Terram provides a javascript foundation for XRP Wallet and Exchange APIs 
 */
const Terram = {
  Wallet: Wallet,
  Keypair: KeyPair
}

module.exports = Terram;
