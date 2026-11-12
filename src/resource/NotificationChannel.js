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

// Kesiapan channel + kuota anti-ban channel default (termasuk pemanasan
// nomor: warmup_day, warmup_complete, warmup_days_remaining).
export const getNotificationChannelStatus = async (code = null) => {
  return new Promise((resolve) => {
    $axios
      .get(`${url}/status`, { params: code ? { code } : {} })
      .then((result) => resolve(result.data))
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};

// Cek koneksi channel TANPA mengirim pesan (tombol "Test Koneksi")
export const testNotificationChannelConnection = async (code) => {
  return new Promise((resolve) => {
    $axios
      .get(`${url}/test-connection`, { params: { code } })
      .then((result) => resolve(result.data))
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};

// Kirim pesan uji lewat channel tertentu (tombol "Send Test Message").
// Channel 'default' mengikuti antrean anti-ban, jadi beri waktu lebih lama.
export const sendTestNotificationChannel = async (param = {}) => {
  if (!param || !param.code || !param.to) {
    return false;
  }
  return new Promise((resolve) => {
    $axios
      .post(`${url}/test`, param, { timeout: 180000 })
      .then((result) => resolve(result.data))
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};
