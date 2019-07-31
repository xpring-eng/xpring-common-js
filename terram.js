const { Wallet, WalletGenerationResult } = require('./wallet.js')
const KeyPair = require('./keypair.js')

/**
 * Terram provides a javascript foundation for XRP Wallet and Exchange APIs 
 */
const Terram = {
  Keypair: KeyPair,
  Wallet: Wallet,
  WalletGenerationResult: WalletGenerationResult
}

module.exports = Terram;
