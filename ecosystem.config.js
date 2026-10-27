module.exports = {
  apps: [
    {
      name: 'dev-frontend',
      // `script` HARUS file .js (bukan biner node) — pm2 mengeksekusi script
      // sebagai JS; interpreter tetap dipaksa Node v22.
      script: 'node_modules/@vue/cli-service/bin/vue-cli-service.js',
      args: 'serve --port 8080',
      cwd: '/home/gesang/project/jastip/Frontend',
      interpreter: '/home/gesang/.nvm/versions/node/v22.23.4/bin/node',
      ignore_watch: ['node_modules', '.git', '*.log'],
    },
  ],
};
