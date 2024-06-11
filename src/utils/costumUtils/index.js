import { tableAliasName } from '../../constants';
import { strToBool } from '../helper';
import { getRole, getToken } from '../storage';

// export function isNumeric(num) {
//   return !isNaN(num);
// }
export function isNumeric(input) {
  return /^\d+$/.test(input);
}

export function isAlphaNumeric(input) {
  return /^[a-zA-Z0-9]+$/.test(input);
}

export function onlyNumber({ event, data, max }) {
  event = event ? event : window.event;
  var charCode = event.which ? event.which : event.keyCode;
  if (data && max && data.toString().length >= max) {
    event.preventDefault();
    return false;
  } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  } else {
    return true;
  }
}
export function isEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function isPhone(num) {
  if (num)
    if (num.length < 7 || num.length > 12) {
      return false;
    } else {
      return true;
    }
  else {
    return false;
  }
}
export function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return '';
  }
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function reformatMenu(menu = []) {
  let menu_vue = [];
  for (const it of menu) {
    // CHECK type 1 is android menu
    if (it.type != 1) {
      // let have_access = false;
      let temp = {};
      if (it.link) {
        if (
          strToBool(it.can_view) ||
          strToBool(it.can_add) ||
          strToBool(it.can_edit) ||
          strToBool(it.can_delete) ||
          strToBool(it.can_print) ||
          strToBool(it.can_approve)
        ) {
          // have_access = true;
          temp = {
            _name: 'CSidebarNavItem',
            name: it.label,
            to: it.link,
            link: it.link,
            icon: it.icon,
            can_create: it.can_add,
            can_read: it.can_view,
            can_update: it.can_edit,
            can_delete: it.can_delete,
            can_print: it.can_print,
            can_approve: it.can_approve,
          };
        }
      } else if (!it.link) {
        let child = [];
        if (it.items) {
          child = reformatMenu(it.items);
          if (child.length > 0) {
            temp._name = 'CSidebarNavDropdown';
            temp.name = it.label;
            temp.route = `/${it.name.toLowerCase()}`;
            temp.link = it.link;
            temp.icon = it.icon;
            temp.items = child;
          }
        }
      }
      if (Object.keys(temp).length > 0) {
        menu_vue.push(temp);
      }
    }
  }
  return menu_vue;
}

export function reformatRole(menu = []) {
  let roles = [];
  for (const it of menu) {
    // CHECK type 1 is android menu
    if (it.type != 1) {
      // let have_access = false;
      let temp = {};
      if (it.link) {
        if (
          strToBool(it.can_view) ||
          strToBool(it.can_add) ||
          strToBool(it.can_edit) ||
          strToBool(it.can_delete) ||
          strToBool(it.can_print) ||
          strToBool(it.can_approve)
        ) {
          // have_access = true;
          temp = {
            name: it.label,
            link: it.link,
            can_create: it.show_create ? strToBool(it.can_add) : false,
            can_read: it.show_read ? strToBool(it.can_view) : false,
            can_update: it.show_update ? strToBool(it.can_edit) : false,
            can_delete: it.show_delete ? strToBool(it.can_delete) : false,
            can_print: it.show_print ? strToBool(it.can_print) : false,
            can_approve: it.show_approve ? strToBool(it.can_approve) : false,
          };
        }
      }
      if (Object.keys(temp).length > 0) {
        roles.push(temp);
      }
    }
  }
  return roles;
}

export function buttonPermission({ path }) {
  let action = {
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
    can_print: false,
    can_approve: false,
  };
  const patterns = ['/create', '/read', '/update', '/delete'];
  const pattern = patterns.find((p) => path.includes(p));
  path = pattern ? path.split(pattern)[0] : path;
  let role = getRole();
  if (!role) return action;
  for (const it of role) {
    if (path == it.link) {
      action.can_create = strToBool(it.can_create) ? true : false;
      action.can_read = strToBool(it.can_read) ? true : false;
      action.can_update = strToBool(it.can_update) ? true : false;
      action.can_delete = strToBool(it.can_delete) ? true : false;
      action.can_print = strToBool(it.can_print) ? true : false;
      action.can_approve = strToBool(it.can_approve) ? true : false;
    }
  }
  return action;
}

export function exportData({ param = {}, exportType = 'xls' }) {
  let new_param = param;
  new_param.MertrackApiToken = getToken();
  if (!new_param.SearchVal1Text) {
    new_param.SearchVal1Text = 'All';
  }
  if (!new_param.StatusCodeText) {
    new_param.StatusCodeText = 'All';
  }
  delete new_param.limit;
  delete new_param.page;
  new_param.PrintTo = exportType;
  let url = `${
    process.env.VUE_APP_URL_API_MERTRACK
  }/api/general/web?${new URLSearchParams(new_param).toString()}`;
  window.open(`${url}`, '_blank');
  delete new_param.PrintTo;
  return true;
}

export function exportDataV3({
  param = {},
  exportType = 'xls',
  url,
  alert = false,
}) {
  let endpoint = process.env.VUE_APP_URL_API_MERTRACK;
  let new_param = { ...param };
  delete new_param.limit;
  delete new_param.page;
  new_param.MertrackApiToken = getToken();
  new_param['User-Type'] = 'Website App';
  if (!new_param.SearchVal1Text) {
    new_param.SearchVal1Text = 'All';
  }
  if (!new_param.StatusCodeText) {
    new_param.StatusCodeText = 'All';
  }
  // delete new_param.limit;
  // delete new_param.page;
  new_param.PrintTo = exportType;
  let _url = `${endpoint}/api${url}?${new URLSearchParams(
    new_param
  ).toString()}`;
  let next = true;
  if (new_param.totalData && alert) {
    let message = `You are about to generate report in PDF/XLSX file format that contains detail data of ${new_param.totalData} records.\nThis process may take few minutes to complete.\nDo you want to continue?`;
    if (!confirm(message)) {
      next = false;
    }
  }
  if (!next) return;
  window.open(`${_url}`, '_blank');
  delete new_param.PrintTo;
  return true;
}

export function exportDataReport({ param = {}, exportType = 'xls' }) {
  let new_param = param;
  new_param.MertrackApiToken = localStorage.getItem('token');
  if (!new_param.SearchVal1Text) {
    new_param.SearchVal1Text = 'All';
  }
  if (!new_param.StatusCodeText) {
    new_param.StatusCodeText = 'All';
  }
  delete new_param.limit;
  delete new_param.page;
  new_param.PrintTo = exportType;
  let url = `${
    process.env.VUE_APP_URL_API_MERTRACK
  }/api/general/report?${new URLSearchParams(new_param).toString()}`;
  window.open(`${url}`, '_blank');
  delete new_param.PrintTo;
  return true;
}

export function convertTableName(tableName) {
  const list = tableAliasName;
  for (const it of list) {
    if (it.table_name == tableName) {
      return it.alias;
    }
  }
  return tableName;
}
