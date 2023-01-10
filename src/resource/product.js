import $axiosMertrack from "../apiMertrack";

export const getListProduct = async ({ param = {} }) => {
  var query_string = new URLSearchParams(param).toString();
  let url = `/v3/master/product?${query_string}`;
  console.log(url, param);
  return new Promise((resolve) => {
    $axiosMertrack
      .get(url)
      .then((result) => {
        return resolve(result);
      })
      .catch((e) => {
        this.$toast.open({
          message: e.message,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        return resolve(false);
      });
  });
};
