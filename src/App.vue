<template>
  <router-view></router-view>
</template>

<script>
import Vue from "vue";
import loading from "vuejs-loading-screen";
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";
import VueCustomTooltip from "@adamdehaven/vue-custom-tooltip";
import {
  Button,
  ButtonPermission,
  DetailTransaction,
  DetailTransactionV3,
  HeaderFilterTransaction,
  HeaderFilterTransactionV3,
  DetailStockSerial,
  DetailShowStatus,
  HeaderFilterDefault,
  MasterPid,
  HeaderShowStatus,
  FormAddItem,
  CancelModal,
  ShowLockedStatus,
  DetailBarcodeGenerator,
  ModalPrintLabel,
  ModalPrintLabelV3,
} from "./views/component";
Vue.use(VueCustomTooltip);
Vue.use(loading);
Vue.component("v-icon", Icon);
Vue.component("MasterPid", MasterPid);
Vue.component("Button", Button);
Vue.component("ButtonPermission", ButtonPermission);
Vue.component("HeaderFilterTransaction", HeaderFilterTransaction);
Vue.component("HeaderFilterTransactionV3", HeaderFilterTransactionV3);
Vue.component("DetailTransaction", DetailTransaction);
Vue.component("DetailTransactionV3", DetailTransactionV3);
Vue.component("DetailShowStatus", DetailShowStatus);
Vue.component("HeaderShowStatus", HeaderShowStatus);
Vue.component("DetailStockSerial", DetailStockSerial);
Vue.component("HeaderFilterDefault", HeaderFilterDefault);
Vue.component("FormAddItem", FormAddItem);
Vue.component("CancelModal", CancelModal);
Vue.component("ShowLockedStatus", ShowLockedStatus);
Vue.component("DetailBarcodeGenerator", DetailBarcodeGenerator);
Vue.component("ModalPrintLabel", ModalPrintLabel);
Vue.component("ModalPrintLabelV3", ModalPrintLabelV3);

export default {
  name: "App",
};
</script>

<style lang="scss">
// Import Main styles for this application
@import "assets/scss/style";
</style>
