import $axios from '../api';

// "Pengaturan Aplikasi" milik tenant aktif (bukan konfigurasi platform).
// Backend me-resolve tenant dari header X-Tenant / subdomain, bukan dari id.
let url = `/v1/system/tenant/self-config`;

export const getTenantSelfConfig = async () => {
  return new Promise((resolve) => {
    $axios
      .get(url)
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

export const updateTenantSelfConfig = async (param = Object) => {
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
