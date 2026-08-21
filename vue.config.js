const path = require("path");
const zlib = require("zlib");
module.exports = {
  // Enable Compression Website
  pluginOptions: {
    compression: {
      brotli: {
        filename: "[file].br[query]",
        algorithm: "brotliCompress",
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        minRatio: 0.8,
      },
      gzip: {
        filename: "[file].gz[query]",
        algorithm: "gzip",
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
      },
    },
  },
  // End Of Enable Compression Website
  publicPath: "/",
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
      symlinks: false,
    },
  },
  transpileDependencies: ["@coreui/utils"],
  outputDir: path.resolve(__dirname, "../public"),
  chainWebpack: (config) => {
    config.plugin("copy").tap((args) => {
      args[0].push({
        from: path.resolve(__dirname, "LICENSE.txt"),
        to: path.resolve(__dirname, "../public"),
      });
      return args;
    });
  },
};
