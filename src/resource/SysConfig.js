import $axios from '../api';

let url = `/v1/configuration/application`;

export const getSysConfig = async (param = Object) => {
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

export const updateSysConfig = async (param = {}) => {
  return new Promise((resolve) => {
    $axios
      .post(url, param)
      .then((result) => resolve(result.data))
      .catch((e) => {
        console.log('ERROR => ', e);
        resolve(false);
      });
  });
};
