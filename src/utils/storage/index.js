import CryptoJS from "crypto-js";
import moment from "moment";
export function encrypt(plaintext) {
  const password = "1sampai9";
  // Buat salt dan key dari password
  const salt = CryptoJS.lib.WordArray.random(16);
  const key = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32 });
  // Buat IV (inisialisasi vektor) acak
  const iv = CryptoJS.lib.WordArray.random(16);
  // Lakukan enkripsi menggunakan kunci dan IV
  const ciphertext = CryptoJS.AES.encrypt(plaintext, key, { iv: iv });
  // Gabungkan salt, IV, dan teks terenkripsi menjadi satu string dan kembalikan hasilnya
  return salt.toString() + iv.toString() + ciphertext.toString();
}

// Fungsi untuk melakukan dekripsi
export function decrypt(ciphertext) {
  const password = "1sampai9";
  // Ambil salt, IV, dan teks terenkripsi dari string
  const salt = CryptoJS.enc.Hex.parse(ciphertext.substr(0, 32));
  const iv = CryptoJS.enc.Hex.parse(ciphertext.substr(32, 32));
  const encrypted = ciphertext.substring(64);
  // Buat kunci dari password dan salt
  const key = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32 });
  // Lakukan dekripsi menggunakan kunci dan IV
  const bytes = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
  // Kembalikan hasil dekripsi dalam bentuk string
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function clearStorage() {
  localStorage.removeItem("profile");
  localStorage.removeItem("menu");
}

export function setProfile(data) {
  localStorage.setItem("profile", encrypt(JSON.stringify(data)));
}
export function getProfile() {
  try {
    return JSON.parse(decrypt(localStorage.getItem("profile")));
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
export function getToken() {
  try {
    let user = getProfile();
    return user.token;
  } catch (error) {
    return null;
  }
}
export function setMenu(data) {
  localStorage.setItem("menu", encrypt(JSON.stringify(data)));
}
export function getMenu() {
  try {
    return JSON.parse(decrypt(localStorage.getItem("menu")));
  } catch (error) {
    return [];
  }
}
export function setRole(data) {
  localStorage.setItem("role", encrypt(JSON.stringify(data)));
}
export function getRole() {
  return JSON.parse(decrypt(localStorage.getItem("role")));
}
export function setConfig(data) {
  localStorage.setItem("configuration", encrypt(JSON.stringify(data)));
}
export function setLogo(data) {
  localStorage.setItem("logo", data);
}
export function getLogo() {
  let data = localStorage.getItem("logo");
  return data;
}

export function getConfig() {
  return JSON.parse(decrypt(localStorage.getItem("configuration")));
}
export function setLoginTimeout(data) {
  let time = moment().add(data, "minutes").format("DD/MM/YYYY HH:mm:ss:SSS");
  localStorage.setItem("time_out", time);
}
export function getLoginTimeout() {
  return localStorage.getItem("time_out");
}
