import $axios from '../api';

const url = `/v1/master/courier`;

const request = (method, param, config = {}) =>
  $axios({ method, url, ...config, data: param }).then(result => result.data);

export const getMstCourier = async (param = {}) => {
  const query = new URLSearchParams(param).toString();
  try {
    const result = await $axios.get(`${url}?${query}`);
    return result.data;
  } catch (error) {
    console.log('ERROR => ', error);
    return false;
  }
};

export const insertMstCourier = async param => {
  if (!param) return false;
  try {
    return await request('put', param);
  } catch (error) {
    console.log('ERROR => ', error);
    return false;
  }
};

export const updateMstCourier = async param => {
  if (!param) return false;
  try {
    return await request('post', param);
  } catch (error) {
    console.log('ERROR => ', error);
    return false;
  }
};

export const deleteMstCourier = async param => {
  if (!param?.id) return false;
  try {
    return await $axios.delete(url, { data: param }).then(result => result.data);
  } catch (error) {
    console.log('ERROR => ', error);
    return false;
  }
};
