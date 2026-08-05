import axios from 'axios';
import { clearStorage, devToken, getProfile, setLoginTimeout } from './utils';
import { getBrowserType, getOsType } from './utils/helper';

// Counter request aktif
let activeRequests = 0;
/**
 * Start Loading
 */
const startLoading = () => {
  activeRequests++;
  if (activeRequests === 1) {
    NProgress.configure({
      easing: 'ease',
      speed: 500,
      showSpinner: true,
    });
    NProgress.start();
  }
};

/**
 * Stop Loading
 */
const stopLoading = () => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    NProgress.done();
  }
};

const $axios = axios.create();
$axios.interceptors.request.use(
  function (config) {
    startLoading();
    let token = devToken();
    let profile = getProfile();
    let deviceProfile = `Website App: ${getOsType()}, ${getBrowserType()}`;
    let time_out = '-1';
    if (profile) {
      token = profile.token;
      time_out = profile.idletimeout;
    }
    setLoginTimeout(time_out);
    config.baseURL = process.env.VUE_APP_URL_API + '/api';
    config.headers = {
      'Content-Type': 'application/json',
      token: `${token}`,
      'Access-Control-Allow-Origin': '*',
      'User-Type': deviceProfile,
    };
    return config;
  },
  function (error) {
    stopLoading();
    return Promise.reject(error);
  },
);

$axios.interceptors.response.use(
  function (response) {
    stopLoading();
    document.body.classList.remove('loading-indicator');
    let res = response.data;
    if (res && res.StatusCode && res.StatusCode == '401') {
      clearStorage();
      return Promise.resolve(response);
    }
    return Promise.resolve(response);
  },
  function (error) {
    stopLoading();
    return Promise.reject(error);
  },
);

$axios.defaults.timeout = 120000;

export default $axios;
