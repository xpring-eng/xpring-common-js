const { Wallet, WalletGenerationResult } = require('./wallet.js')

/**
 * Terram provides a javascript foundation for XRP Wallet and Exchange APIs.
 */
const Terram = {
  Wallet: Wallet,
  WalletGenerationResult: WalletGenerationResult
}

module.exports = Terram;
