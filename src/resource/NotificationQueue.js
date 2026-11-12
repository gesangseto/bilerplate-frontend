import $axios from '../api';

let url = `/v1/notification/queue`;

const buildQuery = (param = {}) => {
  const clean = {};
  Object.keys(param).forEach((key) => {
    const value = param[key];
    if (value !== undefined && value !== null && value !== '') {
      clean[key] = value;
    }
  });
  return new URLSearchParams(clean).toString();
};

// Daftar antrean pesan WhatsApp (monitoring, read-only).
// Query: status, channel_code, customer_id, session_id, search, page, limit
export const getNotificationQueue = async (param = {}) => {
  return new Promise((resolve) => {
    $axios
      .get(`${url}?${buildQuery(param)}`)
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

// Jumlah pesan per status untuk chip statistik.
export const getNotificationQueueSummary = async () => {
  return new Promise((resolve) => {
    $axios
      .get(`${url}/summary`)
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
