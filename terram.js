const Signer = require('./Signer.js')
const Wallet = require('./wallet.js')

/**
 * Terram provides a javascript foundation for XRP Wallet and Exchange APIs 
 */
const Terram = {
  Signer: Signer,
  Wallet: Wallet
}

module.exports = Terram;
