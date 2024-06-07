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
    if (it.id == 100) {
      let items = it.items || [];
      items.push({ ...configApplicationMenu() });
      it.items = items;
    }
    newMenu.push(it);
  }
  newProp.role_menu = newMenu;
  newProp.role_menu.push({ ...developmentToolsMenu() });
  return newProp;
}

export function devToken() {
  let timeToken = moment().add(0.5, 'minutes').valueOf();
  let token = `c71d88f3-e144-49c9-91df-d9a6bd0e3414:${timeToken}`;
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

let configApplicationMenu = () => {
  let menu = {
    child_menu_id: 199,
    menu_id: 199,
    parent_menu_id: 100,
    id: 199,
    mst_menu_id: 100,
    icon: '',
    label: 'Config Application',
    link: '/configuration/application',
    _name: 'CSidebarNavItem',
    can_view: 'true',
    can_add: 'true',
    can_edit: 'true',
    can_delete: 'true',
    can_print: 'true',
    can_approve: 'true',
    name: 'Config Application',
    route: null,
    to: '/configuration/application',
    type: 0,
    path: '/configuration/application',
    show_create: 1,
    show_read: 1,
    show_update: 1,
    show_delete: 1,
    show_approve: 1,
    show_print: 1,
    sa: 1,
    type_desc: 'Website',
    items: [],
  };
  return menu;
};
let developmentToolsMenu = () => {
  let menu = {
    child_menu_id: 200,
    menu_id: 200,
    parent_menu_id: null,
    id: 200,
    mst_menu_id: null,
    icon: 'cilStar',
    label: 'Development Tools',
    link: '',
    _name: 'CSidebarNavDropdown',
    can_view: 'true',
    can_add: 'true',
    can_edit: 'true',
    can_delete: 'true',
    can_print: 'true',
    can_approve: 'true',
    name: 'Development Tools',
    route: '/development_tools',
    to: null,
    type: 0,
    path: '/development_tools',
    show_create: 1,
    show_read: 1,
    show_update: 1,
    show_delete: 1,
    show_approve: 0,
    show_print: 1,
    type_desc: 'Website',
    items: [
      {
        child_menu_id: 201,
        menu_id: 201,
        parent_menu_id: 200,
        id: 201,
        mst_menu_id: 200,
        icon: '',
        label: 'Stock Data Barcode Generator',
        link: '/development_tools/barcode_generator',
        _name: 'CSidebarNavItem',
        can_view: 'true',
        can_add: 'true',
        can_edit: 'true',
        can_delete: 'true',
        can_print: 'true',
        can_approve: 'true',
        name: 'Stock Data Barcode Generator',
        route: null,
        to: '/development_tools/barcode_generator',
        type: 0,
        path: '/development_tools/barcode_generator',
        show_create: 1,
        show_read: 1,
        show_update: 1,
        show_delete: 1,
        show_approve: 1,
        show_print: 1,
        type_desc: 'Website',
        items: [],
      },
      {
        child_menu_id: 202,
        menu_id: 202,
        parent_menu_id: 200,
        id: 202,
        mst_menu_id: 200,
        icon: '',
        label: 'Manual Barcode Generator',
        link: '/development_tools/manual_barcode_generator',
        _name: 'CSidebarNavItem',
        can_view: 'true',
        can_add: 'true',
        can_edit: 'true',
        can_delete: 'true',
        can_print: 'true',
        can_approve: 'true',
        name: 'Manual Barcode Generator',
        route: null,
        to: '/development_tools/manual_barcode_generator',
        type: 0,
        path: '/development_tools/manual_barcode_generator',
        show_create: 1,
        show_read: 1,
        show_update: 1,
        show_delete: 1,
        show_approve: 1,
        show_print: 1,
        type_desc: 'Website',
        items: [],
      },
    ],
  };
  return menu;
};
