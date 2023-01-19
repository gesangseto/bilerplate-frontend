export function calculatePagination({ filter = Object, item = Object }) {
  if (item.hasOwnProperty("status") && item.hasOwnProperty("headers")) {
    item = item.data;
  }
  if (item.hasOwnProperty("total") && item.hasOwnProperty("total_row")) {
    filter.totalPages = Math.ceil(item.total / filter.limit) ?? 0;
  }
  return filter;
}
export function calculatePaginationV3({ filter = Object, item = Object }) {
  if (item.hasOwnProperty("status") && item.hasOwnProperty("headers")) {
    item = item.data;
  }
  if (item.hasOwnProperty("total") && item.hasOwnProperty("grand_total")) {
    filter.totalPages = Math.ceil(item.grand_total / filter.limit) ?? 0;
  }
  return filter;
}
export function getStringBetween({ string, field1 = "$SF$", field2 = "$EF$" }) {
  let new_str = "";
  if (string.indexOf(field1) > 0 && string.lastIndexOf(field2) > 0) {
    new_str = string.substring(
      string.indexOf(field1) + field1.length,
      string.lastIndexOf(field2)
    );
  }
  return new_str;
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}
export function removeEmptyArray(array) {
  return array.filter((n) => n);
}
export function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
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
    frags = str.split("_");
  for (i = 0; i < frags.length; i++) {
    frags[i] =
      frags[i].charAt(0).toUpperCase() + frags[i].slice(1).toLowerCase();
  }
  return frags.join(" ");
}
export function flatten(list = Array, childrenAttr = "children") {
  let result = [];
  for (let it of list) {
    if (it[`${childrenAttr}`])
      result = [...result, ...flatten(it[`${childrenAttr}`], childrenAttr)];
    delete it[`${childrenAttr}`];
    result.push(it);
  }
  return result;
}

export function converMenuV3(menu = Array) {
  let reformatChild = (child) => {
    let _menu = [];
    for (const it of child) {
      let field = {};
      if (it.items.length > 0) {
        field = {
          _name: "CSidebarNavDropdown",
          name: it.name,
          route: it.link,
          link: "",
          icon: it.icon,
          items: reformatChild(it.items),
        };
      } else {
        field = {
          _name: "CSidebarNavItem",
          name: it.name,
          to: it.link,
          link: it.link,
          icon: it.icon,
        };
      }
      if (it.type_desc == "Website") _menu.push(field);
    }
    return _menu;
  };
  return reformatChild(menu);
  // for (const it of menu) {
  // }
}
