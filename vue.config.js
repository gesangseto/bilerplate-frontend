const path = require('path');
const zlib = require('zlib');
const webpack = require('webpack');
module.exports = {
  // Enable Compression Website
  pluginOptions: {
    compression: {
      brotli: {
        filename: '[file].br[query]',
        algorithm: 'brotliCompress',
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        minRatio: 0.8,
      },
      gzip: {
        filename: '[file].gz[query]',
        algorithm: 'gzip',
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
      },
    },
  },
  // End Of Enable Compression Website
  publicPath: '/',
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
      symlinks: false,
    },
    plugins: [
      // Moment membawa semua berkas locale (~1,8 MB). Aplikasi tidak pernah
      // memanggil moment.locale(...) (format tanggal memakai locale default
      // Inggris), jadi berkas locale diabaikan untuk mengecilkan bundle awal.
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ],
  },
  chainWebpack: (config) => {
    // Jangan prefetch SEMUA chunk route saat muat pertama. Secara default
    // @vue/preload-webpack-plugin menyuntik <link rel="prefetch"> untuk setiap
    // chunk async (~137 chunk), sehingga halaman landing (yang cuma butuh 1
    // chunk) ikut mengunduh ~20 MB JS yang tidak terpakai. Chunk kini dimuat
    // saat rutenya benar-benar dibuka.
    config.plugins.delete('prefetch');
  },
  transpileDependencies: ['@coreui/utils'],
    outputDir: path.resolve(__dirname, '../public'),
    devServer: {
      // Kompresi respons dev server (gzip). Untuk klien jauh (mis. lewat
      // tunnel) ini memangkas transfer drastis; di localhost efeknya kecil.
      compress: true,
      watchOptions: {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      },
      allowedHosts: [
        'workflow-maiden-justice-notices.trycloudflare.com',
        'generated-coupons-shows-this.trycloudflare.com',
        '.trycloudflare.com',
        '.localhost',
      ],
    },
  };
