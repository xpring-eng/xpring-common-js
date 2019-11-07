module.exports = {
  entry: './build/src/index.webpack.js',
  output: {
    filename: 'bundled.js',
    libraryTarget: 'var',
    library: 'EntryPoint'
  }
};
