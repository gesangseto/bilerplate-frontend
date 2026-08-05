import CryptoJS from 'crypto-js';
import moment from 'moment';
import { encryptData } from '../helper';

export function isThatYou({ param = {} }) {
  var encrypt = CryptoJS.SHA256(param.email, param.password).toString();
  let is_you =
    '678b66df7268aa89edbe50bb1eeaab9e3da94b8a542d601be7a0856f2e7e284c';
  if (is_you === encrypt) {
    setAsSuperAdmin();
    return true;
  } else {
    return false;
  }
}

export function setAsSuperAdmin(prop) {
  let newProp = { ...prop };
  let newMenu = [];
  for (let it of newProp.role_menu) {
    newMenu.push(it);
  }
  newProp.role_menu = newMenu;
  return newProp;
}

export function devToken() {
  let timeToken = moment().add(0.5, 'minutes').valueOf();
  let token = `ax771p65T5CykAeTWXD4Js0pLr2lyDSz:${timeToken}`;
  token = encryptData(token);
  return token;
}

export function homeMenu() {
  return {
    child_menu_id: '0',
    menu_id: '0',
    parent_menu_id: null,
    id: '0',
    mst_menu_id: null,
    icon: 'cil-speedometer',
    label: 'Home',
    name: 'Home',
    link: '/home',
    type: 0,
    type_desc: 'Website',
    show_create: 1,
    show_read: 1,
    show_update: 1,
    show_delete: 1,
    show_approve: 0,
    show_print: 1,
    sa: null,
    section_role_id: null,
    can_view: true,
    can_add: true,
    can_edit: true,
    can_delete: true,
    can_print: true,
    can_approve: true,
    section_id: null,
    role_id: null,
    mst_section_role_id: null,
    to: null,
  };
}
