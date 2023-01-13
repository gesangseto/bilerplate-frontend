import $axiosMertrack from "../apiMertrack";

export const getDashboard = async (param = Object) => {
  var query_string = "";
  if (param) {
    query_string = new URLSearchParams(param).toString();
  }
  let url = `/v3/helper/dashboard`;
  return new Promise((resolve) => {
    $axiosMertrack
      .get(`${url}?${query_string}`)
      .then((result) => {
        let res = result.data;
        return resolve(res);
      })
      .catch((e) => {
        console.log("ERROR => ", e);
        return resolve(false);
      });
  });
};
