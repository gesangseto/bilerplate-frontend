export function parsingBarcode(barcode) {
  const fix_ai = [
    { ai: "00", type: "SSCC", length_digit: 18, raw: "" },
    { ai: "01", type: "SGTIN", length_digit: 14, raw: "" },
    { ai: "17", type: "EXP", length_digit: 6, raw: "" },
  ];
  const din_ai = [
    { ai: 10, type: "BATCH", length_digit: null, raw: "" },
    { ai: 21, type: "SERIAL", length_digit: null, raw: "" },
  ];
  barcode = JSON.stringify(barcode)
    .replace(/\\/g, "")
    .replace(/['"]+/g, "");
  var char_fnc = "u001d";
  var arrBarcode = barcode.split(char_fnc);
  var data = [];
  for (var singleBarcode of arrBarcode) {
    var temp = {};
    for (const fix of fix_ai) {
      if (singleBarcode.substring(0, 2) == fix.ai) {
        var total_fix = fix.length_digit + 2;
        var raw = singleBarcode.substring(2, total_fix);
        temp = fix;
        temp.raw = raw;
        singleBarcode = singleBarcode.substring(total_fix);
        data.push(temp);
      }
    }
    for (const din of din_ai) {
      if (singleBarcode.substring(0, 2) == din.ai) {
        temp = din;
        temp.raw = singleBarcode.substring(2);
        data.push(temp);
      }
    }
  }
  var result = {};
  result.barcode_2d = barcode;
  for (const row of data) {
    if (row.type == "BATCH") {
      result.batch_no = row.raw.replace(/ /g, "");
    } else if (row.type == "EXP") {
      var y = `20${row.raw.substring(0, 2)}`;
      var m = `${row.raw.substring(2, 4)}`;
      var d = `${row.raw.substring(4, 6)}`;
      result.exp = `${y}-${m}-${d}`;
    } else if (row.type == "SERIAL") {
      result.serial = row.raw.replace(/ /g, "");
    } else if (row.type == "SGTIN") {
      result.gtin = row.raw.replace(/ /g, "");
    } else if (row.type == "SSCC") {
      result.serial = `${row.raw.slice(0, 1)}${row.raw.slice(10, 17)}`;
      result.sscc = row.raw.replace(/ /g, "");
    }
  }
  return result;
}
