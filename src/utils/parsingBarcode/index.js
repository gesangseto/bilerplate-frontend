import moment from 'moment';
import { GS1_application_identifiers } from '../../constants';
const AIs = [
  //FIX_AI = [
  { ai: '00', type: 'SSCC', length: 18, alias: 'epc_key' },
  { ai: '01', type: 'GTIN', length: 14, alias: 'epc_key' },
  { ai: '02', type: 'CONTENT', length: 14, alias: 'content' },
  { ai: '17', type: 'EXPIRY_DATE', length: 6, alias: 'exp' },

  //  DINAMIC_AI = [
  { ai: '10', type: 'BATCH', length: null, max_length: 20, alias: 'batch_no' },
  { ai: '21', type: 'SERIAL', length: null, max_length: 20, alias: 'serial' },
  { ai: '30', type: 'VAR_COUNT', length: null, max_length: 8, alias: null },
  { ai: '37', type: 'COUNT', length: null, max_length: 8, alias: 'count' },

  // Di taruh dibawah karena jarang terpakai AI tersebut
  //FIX_AI = [
  { ai: '11', type: 'PROD_DATE', length: 6, alias: 'prod_date' },
  { ai: '12', type: 'DUE_DATE', length: 6, alias: 'due_date' },
  { ai: '13', type: 'PACK_DATE', length: 6, alias: 'pack_date' },
  { ai: '15', type: 'BEST_BEFORE', length: 6, alias: 'best_before' },
  { ai: '20', type: 'VARIANT', length: 2, alias: 'variant' },
  { ai: '410', type: 'SHIP_TO_LOC', length: 13, alias: 'ship_to_loc' },
  { ai: '411', type: 'BILL_TO', length: 13, alias: 'bill_to' },
  { ai: '412', type: 'PURCHASE_FROM', length: 13, alias: null },
  { ai: '413', type: 'SHIP_FOR_LOC', length: 13, alias: null },
  { ai: '414', type: 'LOC_NO', length: 13, alias: 'loc_no' },
  { ai: '415', type: 'PAY_TO', length: 13, alias: 'pay_to' },
  { ai: '422', type: 'ORIGIN', length: 3, alias: 'origin' },
  { ai: '424', type: 'COUNTRY_PROCESS', length: 3, alias: null },
  { ai: '426', type: 'COUNTRY_FULL_PROCESS', length: 3, alias: null },
  { ai: '7001', type: 'NSN', length: 13, alias: 'nsn' },
  { ai: '7003', type: 'EXPIRY_TIME', length: 10, alias: 'exp_time' },
  { ai: '8001', type: 'DIMENSIONS', length: 14, alias: 'dimensions' },
  { ai: '8005', type: 'PRICE_PER_UNIT', length: 6, alias: null },
  { ai: '8017', type: 'GSRN_PROVIDER', length: 18, alias: null },
  { ai: '8018', type: 'GSRN_RECIPIENT', length: 18, alias: null },

  //  DINAMIC_AI = [
  { ai: '22', type: 'CPV', length: null, max_length: 20, alias: 'cpv' },
  {
    ai: '400',
    type: 'ORDER_NUMBER',
    length: null,
    max_length: 30,
    alias: null,
  },
  { ai: '401', type: 'GINC', length: null, max_length: 30, alias: 'ginc' },
  { ai: '403', type: 'ROUTE', length: null, max_length: 30, alias: 'route' },
  {
    ai: '420',
    type: 'SHIP_TO_POST',
    length: null,
    max_length: 20,
    alias: null,
  },
  { ai: '8004', type: 'GIAI', length: null, max_length: 30, alias: 'giai' },
  { ai: '8007', type: 'IBAN', length: null, max_length: 36, alias: 'iban' },
  { ai: '8013', type: 'GMN', length: null, max_length: 30, alias: 'gmn' },
  { ai: '8020', type: 'REF_NO', length: null, max_length: 25, alias: 'ref_no' },
  { ai: '8110', type: 'COUPON', length: null, max_length: 70, alias: 'coupon' },
  {
    ai: '90',
    type: 'NIE',
    length: null,
    max_length: 16,
    alias: 'epc_key',
  },
  {
    ai: '91',
    type: 'INTERNAL',
    length: null,
    max_length: 90,
    alias: 'INTERNAL',
  },
  // .... sampai AI 99 adalah internal
];
const parsing = (barcode) => {
  var char_fnc = 'u001d';
  var arrBarcode = barcode.split(char_fnc);
  let datas = [];
  for (const brc of arrBarcode) {
    var it_brc = brc;
    while (it_brc) {
      let is_match = false;
      for (const it of AIs) {
        let it_ai = it_brc.substring(0, it.ai.length);
        let data = it;
        if (it_ai == it.ai) {
          is_match = true;
          if (!it.length) {
            let string = it_brc.substring(it.ai.length, it.max_length);
            data.data = string;
            it_brc = false;
          } else {
            let string = it_brc.substring(
              it.ai.length,
              it.length + it.ai.length
            );
            data.data = string;
            it_brc = it_brc.slice(data.data.length + it.ai.length);
          }
          datas.push(data);
          if (!it_brc) {
            break;
          }
        }
      }
      if (!is_match) {
        it_brc = false;
      }
    }
  }
  return datas;
};

export const parsingBarcode = (barcode) => {
  barcode = JSON.stringify(barcode).replace(/\\/g, '').replace(/['"]+/g, '');
  let data = parsing(barcode);
  let datas = {};
  datas.barcode_2d = barcode;
  for (const row of data) {
    if (row.type == 'EXPIRY_DATE') {
      var y = `20${row.data.substring(0, 2)}`;
      var m = `${row.data.substring(2, 4)}`;
      var d = `${row.data.substring(4, 6)}`;
      datas[`${row.alias}`] = `${y}-${m}-${d}`;
    } else {
      datas[`${row.alias}`] = row.data;
    }
  }
  return datas;
};
export const parsingBarcodeToHr = (barcode) => {
  barcode = JSON.stringify(barcode).replace(/\\/g, '').replace(/['"]+/g, '');
  let data = parsing(barcode);
  let datas = '';
  for (const it of data) {
    datas += `(${it.ai})${it.data}`;
  }
  return datas;
};

export const MatchBarcode = (barcode_A, barcode_B) => {
  if (!barcode_A || !barcode_B) {
    return false;
  }
  let bar_a = parsingBarcode(barcode_A);
  let bar_b = parsingBarcode(barcode_B);
  delete bar_a.barcode_2d;
  delete bar_b.barcode_2d;
  const isEqual = (...objects) =>
    objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));
  if (isEqual(bar_a, bar_b)) {
    return true;
  } else {
    return false;
  }
};
export const parsingDataToBarcode = ({ data_object = Object }) => {
  let str = '';

  for (const it in data_object) {
    if (data_object[it]) {
      let filterAI = GS1_application_identifiers.filter((x) => x.column == it);
      let AI = filterAI.find(
        (x) =>
          x.length == data_object[it].length ||
          x.max_length >= data_object[it].length
      );
      if (AI) {
        str += `(${AI.ai})`;
        if (AI.column.includes('date')) {
          str += `${moment.utc(data_object[it]).format('YYMMDD')}`;
        } else {
          str += `${data_object[it]}`;
        }
      }
    }
  }
  return str;
};

export const checkDigit = (input) => {
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
};
