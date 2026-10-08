import $axios from '../api';

let url = `/v1/master/subscription-plan`;

/**
 * Katalog paket langganan (subscription plan) — GLOBAL, dipakai semua tenant.
 * Endpoint master butuh token; endpoint publik dipakai halaman harga landing.
 */

export const getMstSubscriptionPlan = async (param = Object) => {
  var query_string = '';
  if (param) {
    query_string = new URLSearchParams(param).toString();
  }
  return new Promise((resolve) => {
    $axios
      .get(`${url}?${query_string}`)
      .then((result) => resolve(result.data))
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};

/** Katalog paket AKTIF untuk halaman harga (tanpa login). */
export const getPublicSubscriptionPlan = async () => {
  return new Promise((resolve) => {
    $axios
      .get(`/v1/public/subscription-plans`)
      .then((result) => resolve(result.data))
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};

export const insertMstSubscriptionPlan = async (param = Object) => {
  if (!param) return false;
  return new Promise((resolve) => {
    $axios
      .put(url, param)
      .then((result) => resolve(result.data))
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};

export const updateMstSubscriptionPlan = async (param = Object) => {
  if (!param) return false;
  return new Promise((resolve) => {
    $axios
      .post(url, param)
      .then((result) => resolve(result.data))
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};

export const deleteMstSubscriptionPlan = async (param = Object) => {
  if (!param.id) return false;
  param = { data: { ...param } };
  return new Promise((resolve) => {
    $axios
      .delete(url, param)
      .then((result) => resolve(result.data))
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};
