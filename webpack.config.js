module.exports = {
  entry: './build/src/index.js',
  output: {
    filename: 'bundled.js',
    libraryTarget: 'var',
    library: 'EntryPoint'
  },
  externals: {
    'grpc': '{}',
    '../generated/xrp_ledger_grpc_pb': '{}',
  }
};
