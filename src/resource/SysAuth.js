import $axios from '../api';

export const authLogin = async (param = Object) => {
  if (!param) {
    return false;
  }
  let url = `/v1/authentication/login`;
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

export const authLogout = async (param = Object) => {
  if (!param) {
    return false;
  }
  let url = `/v1/authentication/logout`;
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

export const authChangePwd = async (param = Object) => {
  if (!param) {
    return false;
  }
  let url = `/v1/authentication/change-password`;
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
export const ChangePwdFirstTime = async (param = Object) => {
  if (!param) {
    return false;
  }
  let url = `/v1/authentication/change-password/first-time`;
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
