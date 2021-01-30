// eslint-disable-next-line no-undef
const path = require("path");

const config = {
  entry: "./src/run.js",
  devtool: "inline-source-map",

  resolve: {
    // eslint-disable-next-line no-undef
    modules: [__dirname],
    extensions: [".js"],
  },
  output: {
    filename: "script.js",
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname),
  }
};

// eslint-disable-next-line no-undef
exports.default = config;