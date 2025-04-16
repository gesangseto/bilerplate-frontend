import $axiosMertrack from '../apiMertrack';

let url = `/v4/helper/whatsapp`;

export const getWhatsappQr = async () => {
  return new Promise((resolve) => {
    $axiosMertrack
      .get(`${url}/qr`)
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

export const sendWhatsappMessage = async (param = Object) => {
  if (!param) {
    return false;
  }
  return new Promise((resolve) => {
    $axiosMertrack
      .post(`${url}/send`, param)
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

export const deleteWhatsappSession = async () => {
  return new Promise((resolve) => {
    $axiosMertrack
      .delete(`${url}/session`)
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
