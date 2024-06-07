import axios from 'axios';
import { clearStorage, devToken, getProfile, setLoginTimeout } from './utils';
import { getBrowserType, getOsType } from './utils/helper';

const $axiosMertrack = axios.create();
$axiosMertrack.interceptors.request.use(
  function (config) {
    let token = devToken();
    let profile = getProfile();
    let deviceProfile = `Website App: ${getOsType()}, ${getBrowserType()}`;
    let time_out = '-1';
    if (profile) {
      token = profile.token;
      time_out = profile.idletimeout;
    }
    setLoginTimeout(time_out);
    NProgress.configure({ easing: 'ease', speed: 500 });
    NProgress.start();
    config.baseURL = process.env.VUE_APP_URL_API_MERTRACK + '/api';
    config.headers = {
      'Content-Type': 'application/json',
      'MertrackApi-Token': `${token}`,
      'Access-Control-Allow-Origin': '*',
      'User-Type': deviceProfile,
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

$axiosMertrack.interceptors.response.use(
  function (response) {
    NProgress.done();
    document.body.classList.remove('loading-indicator');
    let res = response.data;
    if (res && res.StatusCode && res.StatusCode == '401') {
      clearStorage();
      return Promise.resolve(response);
    }
    return Promise.resolve(response);
  },
  function (error) {
    return Promise.reject(error);
  }
);

$axiosMertrack.defaults.timeout = 120000;

export default $axiosMertrack;
