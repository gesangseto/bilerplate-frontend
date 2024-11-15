import moment from 'moment';
import { decryptData, encryptData } from '../helper';

export function clearStorage() {
  localStorage.removeItem('profile');
  localStorage.removeItem('menu');
  localStorage.removeItem('role');
  localStorage.removeItem('time_out');
}

export function getFilterTable(url) {
  let result = null;
  let history = [];
  let stringHistory = sessionStorage.getItem('filter');
  if (stringHistory) history = JSON.parse(stringHistory);
  let backHistory = history[history.length - 2];
  let lastHistory = history[history.length - 1];
  if (backHistory) {
    // jika url sebelumnya sama dengan url yang di check dianggap sedang HIT BACK BUTTON
    if (backHistory.url === url) {
      // maka hapus history terakhir
      history.pop();
      // kembalikan nilai backHistory
      result = backHistory.filter;
    }
  } else if (lastHistory) {
    // jika url terakhir sama dengan url yang di check
    if (lastHistory.url === url) {
      // kembalikan nilai lastHistory
      result = lastHistory.filter;
    }
  } else {
    history.push({ url: url, filter: {} });
  }
  sessionStorage.setItem(`filter`, JSON.stringify(history));
  return result;
}

export function setFilterTable(url, filter) {
  let history = [];
  let stringHistory = sessionStorage.getItem('filter');
  if (stringHistory) history = JSON.parse(stringHistory);
  if (history.length >= 20) history.shift();
  let lastHistory = history[history.length - 1];
  if (lastHistory) {
    // jika url terakhir sama dengan url yang di set maka replace filtering dengan yang baru
    if (lastHistory.url === url) {
      lastHistory.filter = filter;
      history[history.length - 1] = lastHistory;
      sessionStorage.setItem(`filter`, JSON.stringify(history));
      return;
    }
  }
  history.push({ url: url, filter: filter });
  sessionStorage.setItem(`filter`, JSON.stringify(history));
  return;
}

export function setFiltering(url, filter) {
  sessionStorage.setItem(`filtering`, JSON.stringify(filter));
  sessionStorage.setItem(`filtering-url`, url);
}

export function getFiltering(url) {
  let oldUrl = sessionStorage.getItem('filtering-url');
  if (oldUrl && oldUrl !== url) {
    sessionStorage.removeItem('filtering');
    sessionStorage.setItem('filtering-url', url);
  }
  let filtering = sessionStorage.getItem('filtering');
  if (filtering) filtering = JSON.parse(filtering);
  else filtering = null;
  return filtering;
}

export function setProfile(data = {}) {
  delete data.role_menu;
  delete data.identity_logo_path;
  delete data.login_logo;
  delete data.home_logo;
  localStorage.setItem('profile', encryptData(JSON.stringify(data)));
}

export function getProfile() {
  try {
    return JSON.parse(decryptData(localStorage.getItem('profile')));
  } catch (error) {
    return null;
  }
}

export function getConfUserApp() {
  try {
    let profile = getProfile();
    return profile.conf_app;
  } catch (error) {
    return {};
  }
}

export function getUserId() {
  try {
    let user = getProfile();
    return parseInt(user.id);
  } catch (error) {
    return null;
  }
}

export function getSectionId() {
  try {
    let user = getProfile();
    return parseInt(user.mst_section_id);
  } catch (error) {
    return null;
  }
}

export function getToken() {
  try {
    let user = getProfile();
    return user.token;
  } catch (error) {
    return null;
  }
}

export function setMenu(data) {
  localStorage.setItem('menu', encryptData(JSON.stringify(data)));
}

export function getMenu() {
  try {
    return JSON.parse(decryptData(localStorage.getItem('menu')));
  } catch (error) {
    return [];
  }
}

export function setRole(data) {
  localStorage.setItem('role', encryptData(JSON.stringify(data)));
}

export function getRole() {
  try {
    return JSON.parse(decryptData(localStorage.getItem('role')));
  } catch (error) {
    return null;
  }
}

export function setConfig(data = {}) {
  if (data.login_logo) {
    localStorage.setItem('loginLogo', data.login_logo);
    delete data.login_logo;
  }
  if (data.home_logo) {
    localStorage.setItem('homeLogo', data.home_logo);
    delete data.home_logo;
  }
  if (data.identity_logo_path) {
    localStorage.setItem('identityLogo', data.identity_logo_path);
    delete data.identity_logo_path;
  }

  localStorage.setItem('configuration', encryptData(JSON.stringify(data)));
}

export function getLogo() {
  let data = localStorage.getItem('identityLogo');
  return data;
}

export function getLoginLogo() {
  let data = localStorage.getItem('loginLogo');
  return data;
}

export function getHomeLogo() {
  let data = localStorage.getItem('homeLogo');
  return data;
}

export function getConfig() {
  return JSON.parse(decryptData(localStorage.getItem('configuration')));
}

export function setLimitation(data = {}) {
  let limit = {
    total_conf_date: data.total_conf_date || null,
    total_conf_layout: data.total_conf_layout || null,
    total_department: data.total_department || null,
    total_section: data.total_section || null,
    total_wh: data.total_wh || null,
    total_device: data.total_device || null,
  };
  localStorage.setItem('limitation', encryptData(JSON.stringify(limit)));
}

export function getLimitation(type) {
  let data = null;
  try {
    data = JSON.parse(decryptData(localStorage.getItem('limitation')));
  } catch (error) {
    data = null;
  }
  if (type && data[type]) {
    return data[type];
  } else return data;
}

export function setLoginTimeout(data) {
  let time = moment().add(data, 'minutes').format('DD/MM/YYYY HH:mm:ss:SSS');
  localStorage.setItem('time_out', time);
}

export function getLoginTimeout() {
  return localStorage.getItem('time_out');
}
