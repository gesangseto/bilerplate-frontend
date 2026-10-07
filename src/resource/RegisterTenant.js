import $axios from '../api';

// Pendaftaran tenant PUBLIK (self-signup dari landing page).
// Endpoint tanpa token: POST /v1/public/register-tenant
let url = `/v1/public/register-tenant`;

/**
 * Daftarkan tenant baru.
 * @param {Object} param { subdomain, name, username, password, email, contact_phone? }
 * @returns {Promise<Object|false>} data tenant (termasuk login_url) atau false bila gagal.
 */
export const registerTenant = async (param = {}) => {
  return new Promise((resolve) => {
    $axios
      .post(url, param)
      .then((result) => {
        let res = result.data;
        if (res.error) return resolve({ error: true, message: res.message });
        return resolve(res.data && res.data[0] ? res.data[0] : res);
      })
      .catch((e) => {
        const msg =
          e?.response?.data?.message || e?.message || 'Pendaftaran gagal';
        return resolve({ error: true, message: msg });
      });
  });
};
