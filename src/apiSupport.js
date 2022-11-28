import axios from "axios";

const $axiosSupport = axios.create();
$axiosSupport.interceptors.request.use(
  function (config) {
    NProgress.configure({ easing: "ease", speed: 500 });
    NProgress.start();
    config.baseURL = process.env.VUE_APP_URL_API_SUPPORT + "/api/v3";
    config.headers = {
      "Content-Type": "application/json",
      // "MertrackApi-Token": `${token}`,
      "Access-Control-Allow-Origin": "*",
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

$axiosSupport.interceptors.response.use(
  function (response) {
    NProgress.done();
    document.body.classList.remove("loading-indicator");
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

$axiosSupport.defaults.timeout = 120000;

export default $axiosSupport;
