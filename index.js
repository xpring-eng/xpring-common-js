const Wallet = require('./wallet.js');
const utils = require('./utils.js');

/**
 * Terram provides a javascript foundation for XRP Wallet and Exchange APIs.
 */
const Terram = {
  Wallet: Wallet,
  utils: utils
}

module.exports = Terram;
