module.exports = {
  entry: './build/src/index.js',
  output: {
    filename: 'index.js',
    libraryTarget: 'var',
    library: 'EntryPoint'
  }
};
