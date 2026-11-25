import $axiosMertrack from '../apiMertrack';

export const getInOutDashboard = async (param = Object) => {
  var query_string = '';
  if (param) {
    query_string = new URLSearchParams(param).toString();
  }
  let url = `/v4/dashboard/in-out`;
  return new Promise((resolve) => {
    $axiosMertrack
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

export const getStockInfo = async (param = Object) => {
  var query_string = '';
  if (param) {
    query_string = new URLSearchParams(param).toString();
  }
  let url = `/v4/dashboard/stock-info`;
  return new Promise((resolve) => {
    $axiosMertrack
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

export const getBpomInfo = async (param = Object) => {
  var query_string = '';
  if (param) {
    query_string = new URLSearchParams(param).toString();
  }
  let url = `/v4/dashboard/bpom-info`;
  return new Promise((resolve) => {
    $axiosMertrack
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
