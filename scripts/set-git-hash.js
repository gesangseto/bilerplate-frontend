const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  const gitHash = execSync('git rev-parse --short HEAD').toString().trim();
  const version = require('../package.json').version;
  const buildVersion = `${version} (${gitHash})`;

  const configPath = path.resolve(__dirname, '../src/config.js');
  const content = `// 🚀 Auto-generated file, jangan edit manual
    export const APP_CONFIG = {
      BUILD_VERSION: "${buildVersion}",
    };`;
  fs.writeFileSync(configPath, content, 'utf-8');
  console.log('✅ Build version updated:', buildVersion);
} catch (error) {
  console.error('❌ Gagal mengambil commit hash:', error);
}
