const path = require('path')

module.exports = {
  target: process.env.NODE_TARGET === 'node' ? 'node' : 'web',
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            outDir: './dist',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'XpringCommonJS',
    libraryTarget: 'umd',
    globalObject: "(typeof self !== 'undefined' ? self : this)",
  },
}
