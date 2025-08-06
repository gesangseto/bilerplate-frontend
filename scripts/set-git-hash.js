const { execSync } = require('child_process');
const fs = require('fs');

const envPath = '.env';
const key = 'VUE_APP_BUILD_VERSION';

try {
  const gitHash = execSync('git rev-parse --short HEAD').toString().trim();
  const version = require('../package.json').version;
  const buildVersion = `${version} (${gitHash})`;
  let envContent = '';

  // Jika file sudah ada, baca isinya
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }

  const lines = envContent.split('\n').filter((line) => line.trim() !== '');
  let found = false;

  // Update jika sudah ada
  const newLines = lines.map((line) => {
    if (line.startsWith(`${key}=`)) {
      found = true;
      return `${key}=${buildVersion}`;
    }
    return line;
  });

  // Tambahkan jika belum ada
  if (!found) {
    newLines.push(`${key}=${buildVersion}`);
  }

  // Tulis kembali file
  fs.writeFileSync(envPath, newLines.join('\n') + '\n', 'utf-8');
} catch (error) {
  console.error('❌ Gagal mengambil commit hash:', error);
}
