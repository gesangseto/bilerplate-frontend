import $axios from '../api';

let url = `/v1/notification/report`;

// Daftar penerima yang ditahan (mis. belum pernah mengirim pesan masuk)
export const getNotificationReport = async (param = {}) => {
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

// Kirim ulang pesan yang dulu ditahan. Backend mengecek ulang apakah nomor
// sudah pernah membalas; kalau belum, pesan tetap tidak dikirim.
export const retryNotificationReport = async (param = {}) => {
  if (!param.id) return false;
  return new Promise((resolve) => {
    $axios
      .post(`${url}/retry`, param)
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

// Hapus (soft delete) baris laporan
export const deleteNotificationReport = async (param = {}) => {
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
