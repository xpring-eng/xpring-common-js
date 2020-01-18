// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  target: "web",
  mode: "production",
  entry: "./src/index.ts",
  devtool: "false",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
    library: "xpring-common-js",
    libraryTarget: "umd",
    globalObject: "(typeof self !== 'undefined' ? self : this)"
  }
};
