import axios from "axios";
import moment from "moment";

const $axiosMertrack = axios.create();
$axiosMertrack.interceptors.request.use(
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
    config.baseURL = process.env.VUE_APP_URL_API_MERTRACK + "/api";
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

$axiosMertrack.interceptors.response.use(
  function (response) {
    NProgress.done();
    document.body.classList.remove("loading-indicator");
    let res = response.data;
    if (res && res.StatusCode && res.StatusCode == "401") {
      localStorage.clear();
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
