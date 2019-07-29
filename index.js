const terram = require('./terram.js')

const wallet = terram.Wallet.generateWallet();
console.log(wallet.getAddress());
console.log(wallet.getPrivateKey());
console.log(wallet.getAddress());
