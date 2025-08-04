import $axiosMertrack from '../apiMertrack';
import $axiosMertrackNonLoading from '../apiMertrackNonLoading';

let url = `/v3/master/menu`;

export const getMstMenu = async (param = Object) => {
  var query_string = '';
  if (param) {
    query_string = new URLSearchParams(param).toString();
  }
  return new Promise((resolve) => {
    $axiosMertrackNonLoading
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

export const updateMstMenu = async (param = Object) => {
  if (!param) {
    return false;
  }
  return new Promise((resolve) => {
    $axiosMertrack
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
export const deleteMstMenu = async (param = Object) => {
  if (!param) {
    return false;
  }
  param = { data: { ...param } };
  return new Promise((resolve) => {
    $axiosMertrack
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
