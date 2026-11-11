import $axios from '../api';

let url = `/v1/notification/channel`;

// List notification channel (record code='default' = koneksi Baileys)
export const getNotificationChannel = async (param = {}) => {
  return new Promise((resolve) => {
    $axios
      .get(url, { params: param })
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

// Update channel (api_key / description / status) — code tidak boleh diubah
export const updateNotificationChannel = async (param = Object) => {
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
