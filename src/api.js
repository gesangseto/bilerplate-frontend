import axios from 'axios';
import {
  clearStorage,
  clearSession,
  devToken,
  getProfile,
  setLoginTimeout,
  getTenantCode,
} from './utils';
import { getBrowserType, getOsType } from './utils/helper';

// Kode error backend yang berarti: sesi/tenant tidak valid -> paksa login ulang.
// TENANT_SUBDOMAIN_MISSING: cache tenant nyangkut/rusak, backend menolak request.
// Kasus ini bisa membuat user STUCK (mis. tidak bisa logout). Kita "self-heal":
// bersihkan sesi lokal + arahkan ke /login.
const FORCE_LOGOUT_CODES = [
  'TENANT_SUBDOMAIN_MISSING',
  'TENANT_NOT_FOUND',
  'TENANT_MISMATCH',
  'UNAUTHORIZED',
  'TOKEN_EXPIRED',
  'INVALID_TOKEN',
];

// Hindari loop redirect & toast berulang saat banyak request gagal bersamaan.
let redirectingToLogin = false;

function forceLogout(reason) {
  if (redirectingToLogin) return;
  // Kalau sudah di halaman login, tidak perlu redirect.
  const path = (window.location.pathname || '') + (window.location.hash || '');
  if (path.includes('/login')) return;

  redirectingToLogin = true;
  try {
    clearSession();
  } catch (e) {
    /* abaikan */
  }
  try {
    // Simpan alasan agar halaman login bisa menampilkan pesan (opsional).
    sessionStorage.setItem('force_logout_reason', String(reason || ''));
  } catch (e) {
    /* abaikan */
  }
  // Redirect keras -> menjamin user keluar dari halaman ber-sesi.
  window.location.href = '/login';
}


// Counter request aktif
let activeRequests = 0;
/**
 * Start Loading
 */
const startLoading = () => {
  activeRequests++;
  if (activeRequests === 1) {
    NProgress.configure({
      easing: 'ease',
      speed: 500,
      showSpinner: true,
    });
    NProgress.start();
  }
};

/**
 * Stop Loading
 */
const stopLoading = () => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    NProgress.done();
  }
};

const $axios = axios.create();
$axios.interceptors.request.use(
  function (config) {
    startLoading();
    let token = devToken();
    let profile = getProfile();
    let deviceProfile = `Website App: ${getOsType()}, ${getBrowserType()}`;
    let time_out = '-1';
    if (profile) {
      token = profile.token;
      time_out = profile.idletimeout;
    }
    setLoginTimeout(time_out);
    config.baseURL = process.env.VUE_APP_URL_API + '/api';
    config.headers = {
      'Content-Type': 'application/json',
      token: `${token}`,
      'Access-Control-Allow-Origin': '*',
      'User-Type': deviceProfile,
    };
    // Identitas tenant (multi-tenant SaaS). Backend mengecek Host lebih dulu,
    // X-Tenant dipakai saat web diakses tanpa subdomain (mis. localhost saat dev).
    const tenantCode = getTenantCode();
    if (tenantCode) config.headers['X-Tenant'] = tenantCode;
    return config;
  },
  function (error) {
    stopLoading();
    return Promise.reject(error);
  },
);

$axios.interceptors.response.use(
  function (response) {
    stopLoading();
    document.body.classList.remove('loading-indicator');
    let res = response.data;
    // Sesi kadaluarsa (bentuk lama).
    if (res && res.StatusCode && res.StatusCode == '401') {
      clearStorage();
      forceLogout('StatusCode 401');
      return Promise.resolve(response);
    }
    // Backend mengirim error pada BODY (HTTP bisa 400/403/500) dengan field
    // `error_code`/`error`. Deteksi kode yang memaksa logout agar user tidak
    // stuck (mis. TENANT_SUBDOMAIN_MISSING karena cache tenant nyangkut).
    if (res && res.error) {
      const code = res.code || res.error_code || res.errorCode || '';
      if (code && FORCE_LOGOUT_CODES.indexOf(String(code)) !== -1) {
        forceLogout(code);
      }
    }
    return Promise.resolve(response);
  },
  function (error) {
    stopLoading();
    // Jalur HTTP error: cek apakah body error memuat kode paksa-logout.
    try {
      const res = error && error.response && error.response.data;
      if (res && res.error) {
        const code = res.code || res.error_code || res.errorCode || '';
        if (code && FORCE_LOGOUT_CODES.indexOf(String(code)) !== -1) {
          forceLogout(code);
        }
      }
    } catch (e) {
      /* abaikan */
    }
    return Promise.reject(error);
  },
);

$axios.defaults.timeout = 120000;

export default $axios;
