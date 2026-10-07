import $axios from '../api';
import {
  detectTenantFromHost,
  getTenantCode,
  setTenantInfo,
} from '../utils/storage';

let url = `/v1/system/tenant`;

export const getSysTenant = async (param = Object) => {
  var query_string = '';
  if (param) {
    query_string = new URLSearchParams(param).toString();
  }
  return new Promise((resolve) => {
    $axios
      .get(`${url}?${query_string}`)
      .then((result) => {
        let res = result.data;
        return resolve(res);
      })
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};

export const insertSysTenant = async (param = Object) => {
  if (!param) {
    return false;
  }
  return new Promise((resolve) => {
    $axios
      .put(url, param)
      .then((result) => {
        let res = result.data;
        return resolve(res);
      })
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};

export const updateSysTenant = async (param = Object) => {
  if (!param) {
    return false;
  }
  return new Promise((resolve) => {
    $axios
      .post(url, param)
      .then((result) => {
        let res = result.data;
        return resolve(res);
      })
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};

export const deleteSysTenant = async (param = Object) => {
  if (!param.id) return false;
  param = { data: { ...param } };
  return new Promise((resolve) => {
    $axios
      .delete(url, param)
      .then((result) => {
        let res = result.data;
        return resolve(res);
      })
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};

export const getSysTenantBySubdomain = async (subdomain) => {
  if (!subdomain) return false;
  return new Promise((resolve) => {
    $axios
      .get(`${url}/subdomain/${subdomain}`)
      .then((result) => {
        let res = result.data;
        return resolve(res);
      })
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};

/**
 * Ambil info tenant dari endpoint PUBLIK lalu simpan ke localStorage
 * ('tenant_info'). Dipakai saat boot & sebelum login untuk branding
 * (nama, logo, warna) tanpa memerlukan token.
 * @param {string} [subdomain] kode tenant; default dari kode tersimpan/host.
 * @returns {Promise<object|null>}
 */
export const fetchTenantInfoWeb = async (subdomain) => {
  const code =
    subdomain ||
    getTenantCode() ||
    detectTenantFromHost(window.location.hostname);
  if (!code) return null;
  const res = await getSysTenantBySubdomain(code);
  const row = res && res.data && res.data[0];
  if (!row) return null;
  return setTenantInfo(row) || row;
};

export const getSysTenantLimits = async (param = Object) => {
  return new Promise((resolve) => {
    $axios
      .get(`${url}/limits`, { params: param })
      .then((result) => {
        let res = result.data;
        return resolve(res);
      })
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};