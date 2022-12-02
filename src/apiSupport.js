import axios from "axios";
import moment from "moment";

const $axiosSupport = axios.create();
$axiosSupport.interceptors.request.use(
  function (config) {
    let token = "c71d88f3-e144-49c9-91df-d9a6bd0e3414";
    let profile = JSON.parse(localStorage.getItem("profile"));
    let time_out = "-1";
    if (profile) {
      token = profile.token;
      time_out = profile.idletimeout;
    }
    localStorage.setItem(
      "time_out",
      `${moment().add(time_out, "minutes").format("DD/MM/YYYY HH:mm:ss:SSS")}`
    );
    NProgress.configure({ easing: "ease", speed: 500 });
    NProgress.start();
    config.baseURL = process.env.VUE_APP_URL_API_SUPPORT + "/api/v3";
    config.headers = {
      "Content-Type": "application/json",
      "MertrackApi-Token": `${token}`,
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
