const utils = require('./utils.js');
const Wallet = require('./wallet.js');

/**
 * Terram provides a javascript foundation for XRP Wallet and Exchange APIs.
 */
const terram = {
  utils: utils,
  Wallet: Wallet
}

module.exports = Terram;
