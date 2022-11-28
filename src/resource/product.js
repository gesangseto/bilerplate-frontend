import $axiosMertrack from "../apiMertrack";

export const getListProduct = async ({ param = {} }) => {
  var defaultParam = {
    ApiName: "ListProduct",
    Params: JSON.stringify(param),
    Id: param.id ?? null,
  };
  var query_string = new URLSearchParams(defaultParam).toString();
  let url = `/general/mobile?${query_string}`;
  return new Promise((resolve) => {
    $axiosMertrack
      .get(url)
      .then((result) => {
        let data = result.data.data;
        let storeData = [];
        for (const it of data) {
          let tmp = it;
          tmp.value = it.id;
          tmp.label = it.name;
          storeData.push(tmp);
        }
        return resolve(storeData);
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
