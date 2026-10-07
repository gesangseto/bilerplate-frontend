import moment from 'moment';
import { decryptData, encryptData } from '../helper';

export function clearStorage() {
  localStorage.removeItem('profile');
  localStorage.removeItem('menu');
  localStorage.removeItem('role');
  localStorage.removeItem('time_out');
  // Info tenant dibersihkan saat logout (anti-kebocoran antar pengguna).
  // Kode tenant TETAP disimpan agar layar login masih tahu tenant mana.
  localStorage.removeItem('tenant_info');
}

// ===== Tenant (multi-tenant SaaS) =====
// Kode tenant dideteksi dari subdomain host (mis. demo.app.com -> 'demo').
// Info tenant (dari endpoint publik /system/tenant/subdomain/:kode) disimpan
// di localStorage untuk branding (nama, logo, warna) & preferensi.
const TENANT_INFO_KEY = 'tenant_info';
const TENANT_CODE_KEY = 'tenant_code';

/**
 * Ambil kode tenant dari subdomain host. Mengembalikan '' bila host tidak
 * punya subdomain tenant (mis. localhost, IP, atau domain tanpa subdomain).
 * Aturan: subdomain = label pertama host, KECUALI 'www' & alamat non-domain.
 */
export function detectTenantFromHost(hostname = window.location.hostname) {
  const host = String(hostname || '').toLowerCase();
  if (!host) return '';
  // IP address / localhost -> tidak ada tenant
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return '';
  if (host === 'localhost') return '';
  const parts = host.split('.');
  // Butuh minimal 3 label (sub.domain.tld) agar bagian pertama = subdomain.
  if (parts.length < 3) return '';
  const first = parts[0];
  if (['www', 'app', 'api'].includes(first)) return '';
  return first.replace(/[^a-z0-9-]/g, '');
}

export function setTenantCode(code) {
  const clean = String(code || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
  if (!clean) {
    localStorage.removeItem(TENANT_CODE_KEY);
    return '';
  }
  localStorage.setItem(TENANT_CODE_KEY, clean);
  return clean;
}

export function getTenantCode() {
  try {
    return localStorage.getItem(TENANT_CODE_KEY) || '';
  } catch (error) {
    return '';
  }
}

export function setTenantInfo(data = {}) {
  if (!data || !data.subdomain) return null;
  // Buang field sensitif bila sewaktu-waktu ikut terkirim.
  const {
    password,
    username,
    db_host,
    db_port,
    db_name,
    db_user,
    db_password_enc,
    ...safe
  } = data;
  localStorage.setItem(TENANT_INFO_KEY, encryptData(JSON.stringify(safe)));
  localStorage.setItem(TENANT_CODE_KEY, safe.subdomain);
  return safe;
}

export function getTenantInfo() {
  try {
    return JSON.parse(decryptData(localStorage.getItem(TENANT_INFO_KEY)));
  } catch (error) {
    return null;
  }
}

export function removeTenantInfo() {
  localStorage.removeItem(TENANT_INFO_KEY);
}

export function getFilterTable(url) {
  let result = null;
  let history = [];
  let stringHistory = sessionStorage.getItem('filter');
  if (stringHistory) history = JSON.parse(stringHistory);
  let backHistory = history[history.length - 2];
  let lastHistory = history[history.length - 1];
  if (backHistory && backHistory.url == url) {
    // jika url sebelumnya sama dengan url yang di check dianggap sedang HIT BACK BUTTON
    // maka hapus history terakhir
    history.pop();
    // kembalikan nilai backHistory
    result = backHistory.filter;
  } else if (lastHistory && lastHistory.url == url) {
    // jika url terakhir sama dengan url yang di check
    // kembalikan nilai lastHistory
    result = lastHistory.filter;
  }
  sessionStorage.setItem(`filter`, JSON.stringify(history));
  return result;
}

export function setFilterTable(url, filter) {
  let history = [];
  let stringHistory = sessionStorage.getItem('filter');
  if (stringHistory) history = JSON.parse(stringHistory);
  if (history.length >= 20) history.shift();
  let lastHistory = history[history.length - 1];
  if (lastHistory) {
    // jika url terakhir sama dengan url yang di set maka replace filtering dengan yang baru
    if (lastHistory.url === url) {
      lastHistory.filter = filter;
      history[history.length - 1] = lastHistory;
      sessionStorage.setItem(`filter`, JSON.stringify(history));
      return;
    }
  }
  history.push({ url: url, filter: filter });
  sessionStorage.setItem(`filter`, JSON.stringify(history));
  return;
}

export function setFiltering(url, filter) {
  sessionStorage.setItem(`filtering`, JSON.stringify(filter));
  sessionStorage.setItem(`filtering-url`, url);
}

export function getFiltering(url) {
  let oldUrl = sessionStorage.getItem('filtering-url');
  if (oldUrl && oldUrl !== url) {
    sessionStorage.removeItem('filtering');
    sessionStorage.setItem('filtering-url', url);
  }
  let filtering = sessionStorage.getItem('filtering');
  if (filtering) filtering = JSON.parse(filtering);
  else filtering = null;
  return filtering;
}

export function setLastUrl(url) {
  localStorage.setItem('last_url', url);
}
export function getLastUrl() {
  try {
    return localStorage.getItem('last_url');
  } catch (error) {
    return null;
  }
}

export function setProfile(data = {}) {
  delete data.role_menu;
  delete data.identity_logo_path;
  delete data.login_logo;
  delete data.home_logo;
  localStorage.setItem('profile', encryptData(JSON.stringify(data)));
}

export function getProfile() {
  try {
    return JSON.parse(decryptData(localStorage.getItem('profile')));
  } catch (error) {
    return null;
  }
}

export function getConfUserApp() {
  try {
    let profile = getProfile();
    return profile.conf_app;
  } catch (error) {
    return {};
  }
}

export function getUserId() {
  try {
    let user = getProfile();
    return parseInt(user.id);
  } catch (error) {
    return null;
  }
}

export function getSectionId() {
  try {
    let user = getProfile();
    return parseInt(user.mst_section_id);
  } catch (error) {
    return null;
  }
}

export function getToken() {
  try {
    let user = getProfile();
    return user.token;
  } catch (error) {
    return null;
  }
}

export function setMenu(data) {
  localStorage.setItem('menu', encryptData(JSON.stringify(data)));
}

export function getMenu() {
  try {
    return JSON.parse(decryptData(localStorage.getItem('menu')));
  } catch (error) {
    return [];
  }
}

export function setRole(data) {
  localStorage.setItem('role', encryptData(JSON.stringify(data)));
}

export function getRole() {
  try {
    return JSON.parse(decryptData(localStorage.getItem('role')));
  } catch (error) {
    return null;
  }
}

export function setConfig(data = {}) {
  if (data.login_logo) {
    localStorage.setItem('loginLogo', data.login_logo);
    delete data.login_logo;
  }
  if (data.home_logo) {
    localStorage.setItem('homeLogo', data.home_logo);
    delete data.home_logo;
  }
  if (data.identity_logo_path) {
    localStorage.setItem('identityLogo', data.identity_logo_path);
    delete data.identity_logo_path;
  }

  localStorage.setItem('configuration', encryptData(JSON.stringify(data)));
}

export function getLogo() {
  let data = localStorage.getItem('identityLogo');
  return data;
}

export function getLoginLogo() {
  let data = localStorage.getItem('loginLogo');
  return data;
}

export function getHomeLogo() {
  let data = localStorage.getItem('homeLogo');
  return data;
}

/**
 * Konfigurasi aplikasi yang dipakai UI.
 *
 * Dua sumber:
 *  1. Platform (`configuration`, dari /system/sys-configuration) — HANYA super
 *     admin yang bisa membacanya; menyimpan kebijakan global (password policy,
 *     backup, cron) + branding default platform.
 *  2. Tenant (`tenant_info`, dari /system/tenant/subdomain/:kode) — branding &
 *     preferensi milik tenant aktif (nama, logo, warna, locale, mata uang).
 *
 * getConfig() menggabungkan keduanya: nilai TENANT menang atas platform, agar
 * setiap pemakaian lama (getConfig().xxx) otomatis mengikuti tenant tanpa perlu
 * diubah satu per satu. Bila tidak ada tenant (mis. super admin di domain
 * utama), hasilnya = konfigurasi platform seperti sebelumnya.
 */
export function getConfig() {
  let base = {};
  try {
    base = JSON.parse(decryptData(localStorage.getItem('configuration'))) || {};
  } catch (error) {
    base = {};
  }
  const tenant = getTenantInfo() || {};
  // Hanya bidang non-null dari tenant yang menimpa platform.
  const overlay = {};
  Object.keys(tenant).forEach((k) => {
    const v = tenant[k];
    if (v !== null && v !== undefined && v !== '') overlay[k] = v;
  });
  return { ...base, ...overlay };
}

export function setLimitation(data = {}) {
  let limit = {
    total_conf_date: data.total_conf_date || null,
    total_conf_layout: data.total_conf_layout || null,
    total_department: data.total_department || null,
    total_section: data.total_section || null,
    total_wh: data.total_wh || null,
    total_device: data.total_device || null,
  };
  localStorage.setItem('limitation', encryptData(JSON.stringify(limit)));
}

export function getLimitation(type) {
  let data = null;
  try {
    data = JSON.parse(decryptData(localStorage.getItem('limitation')));
  } catch (error) {
    data = null;
  }
  if (type && data[type]) {
    return data[type];
  } else return data;
}

export function setLoginTimeout(data) {
  let time = moment().add(data, 'minutes').format('DD/MM/YYYY HH:mm:ss:SSS');
  localStorage.setItem('time_out', time);
}

export function getLoginTimeout() {
  return localStorage.getItem('time_out');
}
