import moment from 'moment';
import { isAlphaNumeric, isNumeric } from '../costumUtils';
import { getConfig } from '../storage';
import cronstrue from 'cronstrue';
const CryptoJs = require('crypto-js');

export function calculatePagination({ filter = Object, item = Object }) {
  if (item.hasOwnProperty('status') && item.hasOwnProperty('headers')) {
    item = item.data;
  }
  if (item.hasOwnProperty('total') && item.hasOwnProperty('total_row')) {
    filter.totalPages = Math.ceil(item.total / filter.limit) ?? 0;
  }
  return filter;
}
export function calculatePaginationV3({ filter = Object, item = Object }) {
  if (item.hasOwnProperty('status') && item.hasOwnProperty('headers')) {
    item = item.data;
  }
  if (item.hasOwnProperty('total') && item.hasOwnProperty('grand_total')) {
    filter.totalPages = Math.ceil(item.grand_total / filter.limit) ?? 0;
    filter.totalData = item.grand_total || 0;
  }
  return filter;
}
export function getStringBetween({ string, field1 = '$SF$', field2 = '$EF$' }) {
  let new_str = '';
  if (string.indexOf(field1) > 0 && string.lastIndexOf(field2) > 0) {
    new_str = string.substring(
      string.indexOf(field1) + field1.length,
      string.lastIndexOf(field2)
    );
  }
  return new_str;
}

export function isValidEpcKey(epc_key = String) {
  let result = false;
  if (!epc_key) {
    result = false;
  } else {
    if (
      isAlphaNumeric(epc_key) &&
      (epc_key.length == 15 || epc_key.length == 16)
    ) {
      result = true;
    } else if (isNumeric(epc_key)) {
      if (epc_key.length === 18 || epc_key.length === 14) {
        let num = epc_key.slice(0, -1);
        num = `${num}${gs1CheckDigit(num)}`;
        if (num != epc_key) {
          result = false;
        } else {
          result = true;
        }
      }
    }
  }
  return result;
}
export function isValidNie(epc_key = String) {
  let result = false;
  if (!epc_key) {
    result = false;
  } else {
    if (
      isAlphaNumeric(epc_key) &&
      epc_key.length >= 15 &&
      epc_key.length <= 16
    ) {
      result = true;
    } else {
      result = false;
    }
  }
  return result;
}
export function gs1CheckDigit(input) {
  let array = input.split('').reverse();
  let total = 0;
  let i = 1;
  array.forEach((number) => {
    number = parseInt(number);
    if (i % 2 === 0) {
      total = total + number;
    } else {
      total = total + number * 3;
    }
    i++;
  });
  return Math.ceil(total / 10) * 10 - total;
}
export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
export function removeEmptyArray(array) {
  return array.filter((n) => n);
}
export function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

export function humanize(str) {
  var i,
    frags = str.split('_');
  for (i = 0; i < frags.length; i++) {
    frags[i] =
      frags[i].charAt(0).toUpperCase() + frags[i].slice(1).toLowerCase();
  }
  return frags.join(' ');
}
export function flatten(list = Array, childrenAttr = 'children') {
  let result = [];
  for (let it of list) {
    if (it[`${childrenAttr}`])
      result = [...result, ...flatten(it[`${childrenAttr}`], childrenAttr)];
    delete it[`${childrenAttr}`];
    result.push(it);
  }
  return result;
}
export function getBrowserType() {
  let result = '';
  if (navigator.userAgent.indexOf('Chrome') != -1) {
    result = 'Google Chrome';
  } else if (navigator.userAgent.indexOf('Firefox') != -1) {
    result = 'Mozilla Firefox';
  } else if (navigator.userAgent.indexOf('Safari') != -1) {
    result = 'Apple Safari';
  } else if (
    navigator.userAgent.indexOf('MSIE') != -1 ||
    navigator.userAgent.indexOf('Trident') != -1
  ) {
    result = 'Internet Explorer';
  } else {
    result = 'Another browser';
  }
  return result;
}
export function getOsType() {
  let result = '';
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf('Windows NT 10.0') !== -1) result = 'Windows 10';
  else if (userAgent.indexOf('Windows NT 6.2') !== -1) result = 'Windows 8';
  else if (userAgent.indexOf('Windows NT 6.1') !== -1) result = 'Windows 7';
  else if (userAgent.indexOf('Mac') !== -1) result = 'macOS';
  else if (userAgent.indexOf('X11') !== -1) result = 'UNIX';
  else if (userAgent.indexOf('Linux') !== -1) result = 'Linux';
  else result = 'OS tidak dikenal';
  return result;
}

export function convertMenuV3(menu = Array) {
  let reformatChild = (child) => {
    let _menu = [];
    for (const it of child) {
      let field = {};
      if (Array.isArray(it.items) && it.items.length > 0) {
        field = {
          _name: 'CSidebarNavDropdown',
          name: it.name,
          route: it.link,
          link: '',
          icon: it.icon,
          items: reformatChild(it.items),
        };
      } else {
        field = {
          _name: 'CSidebarNavItem',
          name: it.name,
          to: it.link,
          link: it.link,
          icon: it.icon,
        };
      }
      if (it.type_desc == 'Website') _menu.push(field);
    }
    return _menu;
  };
  return reformatChild(menu);
  // for (const it of menu) {
  // }
}
export function strToBool(str) {
  if (str == undefined && str == null) return false;
  str = str.toString().toLowerCase();
  if (str === 'true') {
    return true;
  } else {
    return false;
  }
}

export function validationPassword(input) {
  let conf = getConfig();
  let message = [];
  if (input && conf.password_pattern) {
    let pattern = JSON.parse(conf.password_pattern);
    if (pattern.regex) {
      let regex = new RegExp(pattern.regex, 'gm');
      if (!regex.test(input)) {
        message.push(`Password must meet the following criteria: `);
        let msg = `Password must meet the following criteria: `;
        if (pattern.min) {
          if (input.length < pattern.min)
            msg += `\n- Min. ${pattern.min} characters`;
        }
        if (pattern.max) {
          if (input.length > pattern.max)
            msg += `\n- Max. ${pattern.max} characters`;
        }
        if (pattern.alphabet_lower) {
          if (!containsLowercase(input)) msg += `\n- Contain lowercase letters`;
        }
        if (pattern.alphabet_upper) {
          if (!containsUppercase(input)) msg += `\n- Contain uppercase letters`;
        }
        if (pattern.numeric) {
          if (!containsNumeric(input)) msg += `\n- Contain numbers`;
        }
        if (pattern.symbol) {
          if (!containsSymbol(input)) msg += `\n- Contain symbols`;
        }
        return msg;
      }
    }
  }
  return;
}
function containsSymbol(str) {
  const regex = /[^\w\s]/; // Mencocokkan karakter yang bukan huruf, angka, atau spasi
  return regex.test(str);
}
function containsNumeric(str) {
  const regex = /\d/; // Regex untuk mencari digit (0-9)
  return regex.test(str);
}
function containsLowercase(str) {
  const regex = /[a-z]/; // Regex untuk huruf kecil
  return regex.test(str);
}
function containsUppercase(str) {
  const regex = /[A-Z]/; // Regex untuk huruf besar
  return regex.test(str);
}
export function isJsonString(item) {
  try {
    // item = typeof item !== 'string' ? JSON.stringify(item) : item;
    item = JSON.parse(item);
    return true;
  } catch (e) {
    return false;
  }
}

let secret_key = 'PT. Merindo Makmur';
// Encrypt data
export function encryptData(data) {
  if (typeof data === 'object') data = JSON.stringify(data);
  return CryptoJs.AES.encrypt(data, secret_key).toString();
}

// Decrypt data
export function decryptData(data) {
  try {
    // Pada API method GET, query params yang dikirim mengandung '+' maka akan diganti dengan spasi, kemudian disini dilakukan pergantian spasi menjadi '+'
    data = data.replace(/ /g, '+');
    var bytes = CryptoJs.AES.decrypt(data, secret_key);
    let result = bytes.toString(CryptoJs.enc.Utf8);
    return result;
  } catch (error) {
    return null;
  }
}

export function readCron(cron) {
  const parts = cron.split(' ');
  let humanReadable = '';
  if (parts.length === 6) {
    const [sec, ...rest] = parts;
    humanReadable = cronstrue.toString(rest.join(' '));
    humanReadable = `Every ${sec} seconds, ${humanReadable}`;
  } else {
    humanReadable = cronstrue.toString(parts.join(' '));
  }
  return humanReadable;
}

export function isValidCron(cron) {
  if (!cron) return false;

  // Pastikan cron adalah string
  if (typeof cron !== 'string') cron = cron.toString();

  const cronParts = cron.trim().split(/\s+/);

  // Cron dapat memiliki 5 atau 6 bagian (tahun ditambahkan di bagian terakhir)
  if (cronParts.length !== 5 && cronParts.length !== 6) return false;

  // Definisikan validator untuk setiap bagian
  const validators = [
    { name: 'minute', min: 0, max: 59 },
    { name: 'hour', min: 0, max: 23 },
    { name: 'dayOfMonth', min: 1, max: 31 },
    { name: 'month', min: 1, max: 12 },
    { name: 'dayOfWeek', min: 0, max: 7 }, // 0 dan 7 untuk Minggu, yang keduanya valid
    { name: 'year', min: 1970, max: 2099 }, // Untuk cron yang mencakup tahun
  ];

  // Periksa apakah ada bagian tambahan untuk tahun
  const numParts = cronParts.length;
  const limit = numParts === 6 ? 6 : 5; // Hanya validasi tahun jika ada 6 bagian

  // Validasi setiap bagian cron
  for (let i = 0; i < limit; i++) {
    if (
      !validateCronField(cronParts[i], validators[i].min, validators[i].max)
    ) {
      return false;
    }
  }

  return true;
}

// Fungsi validasi untuk setiap field cron
function validateCronField(field, min, max) {
  // Mengizinkan penggunaan wildcard '*', angka, dan rentang angka (misalnya '1-5')
  const regex = /^(?:\*|([0-9]+(-[0-9]+)?(\/[0-9]+)?))$/;
  if (field === '*' || regex.test(field)) {
    return true;
  }

  // Jika bukan '*' dan tidak sesuai regex, pastikan nilainya berada dalam rentang yang valid
  const parts = field.split('/');
  const baseField = parts[0];
  const step = parts[1] ? parseInt(parts[1], 10) : 1;

  // Validasi nilai dasar (misalnya '5-10')
  if (baseField.includes('-')) {
    const [start, end] = baseField.split('-').map((num) => parseInt(num, 10));
    if (start < min || end > max || start > end) {
      return false;
    }
  } else {
    const value = parseInt(baseField, 10);
    if (value < min || value > max) {
      return false;
    }
  }

  // Validasi langkah (misalnya '*/5')
  if (step && step < 1) return false;

  return true;
}

export function expFromShelfLife({ mfg_date, shelf_life, type }) {
  let add = shelf_life;
  if (add && mfg_date) {
    let mfg = moment(mfg_date);
    let date = mfg.date();
    if (type == 'start_of_month') {
      return mfg.add(add, 'months').startOf('month').format('YYYY-MM-DD');
    } else if (type == 'end_of_month') {
      return mfg.add(add, 'months').endOf('month').format('YYYY-MM-DD');
    } else if (type == 'adjusted_eom') {
      /*
      Jika tanggal produksi (mfg_date) < 15, maka shelf life dikurangi 1 bulan, lalu hasilnya diarahkan ke akhir bulan dari tanggal tersebut.
      Jika tanggal produksi ≥ 15, langsung ke akhir bulan setelah shelf life ditambahkan. 
      Sudah digunakan di ETHICA
      */
      if (date < 15) {
        add = add - 1;
      }
      return mfg.add(add, 'months').endOf('month').format('YYYY-MM-DD');
    } else {
      return mfg.add(add, 'months').format('YYYY-MM-DD');
    }
  }
}
