const path = require("path");

module.exports = {
  target: "web",
  mode: "development",
  entry: "./src/index.ts",
  devtool: "true",
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
    globalObject: "(typeof window !== 'undefined' ? window : this)"
  }
};
