module.exports = {
  entry: './build/index.js',
  output: {
    filename: 'bundled.js',
    libraryTarget: 'var',
    library: 'EntryPoint',
  },
}
