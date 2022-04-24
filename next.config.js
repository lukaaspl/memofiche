/* eslint-disable @typescript-eslint/no-var-requires */

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = {
  webpack(config, options) {
    const { dev, isServer } = options;

    config.plugins.push(
      new DefinePlugin({
        "process.env.APP_VERSION": JSON.stringify(
          process.env.npm_package_version
        ),
      })
    );

    // Do not run type checking twice
    if (dev && isServer) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin());
    }

    return config;
  },
};
