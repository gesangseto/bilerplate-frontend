import axios from "axios";

const $axios = axios.create({
  baseURL: process.env.VUE_APP_URL_API_TRANSACTION + "/api/",
  headers: {
    // 'Authorization': localStorage.getItem('token') != 'null' ? 'Bearer ' + localStorage.getItem('token') : '',
    "Content-Type": "application/json",
    user_id: `${localStorage.getItem("iduser")}`,
    token: `${localStorage.getItem("token")}`,
  },
});

$axios.defaults.timeout = 600000;

export default $axios;
