import $axiosMertrack from '../apiMertrack';

let url = `/v4/maintenance`;

export const getDatabaseLog = async (filter = {}) => {
  let param = `${new URLSearchParams(filter).toString()}`;
  return new Promise((resolve) => {
    $axiosMertrack
      .get(url + '/log', param)
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
export const getDatabaseBackup = async (params = {}) => {
  return new Promise((resolve) => {
    $axiosMertrack
      .get(url + '/backup', params)
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
export const DatabaseBackup = async (params = {}) => {
  return new Promise((resolve) => {
    $axiosMertrack
      .post(url + '/backup', params)
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
export const DatabaseRestore = async (params = {}) => {
  const formData = new FormData();
  for (const key in params) {
    formData.append(key, params[key]);
  }

  return new Promise((resolve) => {
    $axiosMertrack
      .post(url + '/restore', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
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
