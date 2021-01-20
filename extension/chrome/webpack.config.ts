import * as path from "path";
import * as webpack from "webpack";

const config: webpack.Configuration = {
  entry: "./src/run.ts",
  devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          context: path.resolve(__dirname),
          configFile: "tsconfig.json",
        },
      },
    ],
  },
  resolve: {
    modules: [__dirname],
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "script.js",
    path: path.resolve(__dirname),
  }
};

export default config;