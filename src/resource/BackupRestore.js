import $axiosMertrack from '../apiMertrack';

let url = `/v4/maintenance`;

export const DatabaseBackup = async () => {
  return new Promise((resolve) => {
    $axiosMertrack
      .post(url + '/backup')
      .then((result) => {
        let res = result.data;
        return resolve(res);
      })
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};
export const DatabaseRestore = async (file) => {
  if (!file) {
    return false;
  }
  const formData = new FormData();
  formData.append('file', file); // "file" harus sama dengan yang dicek di backend: req.files.file

  return new Promise((resolve) => {
    $axiosMertrack
      .post(url + '/restore', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((result) => {
        let res = result.data;
        return resolve(res);
      })
      .catch((e) => {
        console.log('ERROR => ', e);
        return resolve(false);
      });
  });
};
