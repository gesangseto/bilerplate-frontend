import $axiosMertrack from "../apiMertrack";

let url = `/v3/configuration/layout`;

export const getConfLayout = async (param = Object) => {
  var query_string = "";
  if (param) {
    query_string = new URLSearchParams(param).toString();
  }
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

export const insertConfLayout = async (param = Object) => {
  if (!param) {
    return false;
  }
  return new Promise((resolve) => {
    $axiosMertrack
      .put(url, param)
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

export const updateConfLayout = async (param = Object) => {
  if (!param) {
    return false;
  }
  return new Promise((resolve) => {
    $axiosMertrack
      .post(url, param)
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

export const deleteConfLayout = async (param = Object) => {
  if (!param.id) return false;
  param = { data: { ...param } };
  return new Promise((resolve) => {
    $axiosMertrack
      .delete(url, param)
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

export const getLayoutIdentifier = async (param = Object) => {
  var query_string = "";
  if (param) {
    query_string = new URLSearchParams(param).toString();
  }
  let _url = "/v3/configuration/layout/identifier";
  return new Promise((resolve) => {
    $axiosMertrack
      .get(`${_url}?${query_string}`)
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
export const getLayoutGrouptIdentifier = async (param = Object) => {
  var query_string = "";
  if (param) {
    query_string = new URLSearchParams(param).toString();
  }
  let _url = "/v3/configuration/layout/group-identifier";
  return new Promise((resolve) => {
    $axiosMertrack
      .get(`${_url}?${query_string}`)
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
export const getLayoutType = async (param = Object) => {
  var query_string = "";
  if (param) {
    query_string = new URLSearchParams(param).toString();
  }
  let _url = "/v3/configuration/layout/type";
  return new Promise((resolve) => {
    $axiosMertrack
      .get(`${_url}?${query_string}`)
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
