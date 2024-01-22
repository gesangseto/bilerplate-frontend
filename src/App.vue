<template>
  <router-view></router-view>
</template>

<script>
import Vue from 'vue';
import loading from 'vuejs-loading-screen';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';
import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip';
import {
  Button,
  ButtonBack,
  ButtonPermission,
  HeaderFilterDefault,
  MasterPid,
  HeaderShowStatus,
  CancelModal,
  ShowLockedStatus,
  DetailBarcodeGenerator,
  ModalBarcodeGenerator,
  ModalPrintLabelV3,
  FormAddItemV3,
  DetailTransactionV3,
  HeaderFilterTransactionV3,
  HeaderShowStatusV3,
  SwitchStatusMaster,
  SwitchStatusTrx,
  SwitchDefault,
  ProductWeight,
} from './views/component';
Vue.use(VueCustomTooltip);
Vue.use(loading);
Vue.component('v-icon', Icon);
Vue.component('MasterPid', MasterPid);
Vue.component('Button', Button);
Vue.component('ButtonBack', ButtonBack);
Vue.component('ButtonPermission', ButtonPermission);
Vue.component('HeaderShowStatus', HeaderShowStatus);
Vue.component('HeaderFilterDefault', HeaderFilterDefault);
Vue.component('CancelModal', CancelModal);
Vue.component('ShowLockedStatus', ShowLockedStatus);
Vue.component('DetailBarcodeGenerator', DetailBarcodeGenerator);
Vue.component('ModalBarcodeGenerator', ModalBarcodeGenerator);
Vue.component('ModalPrintLabelV3', ModalPrintLabelV3);
Vue.component('FormAddItemV3', FormAddItemV3);
Vue.component('HeaderFilterTransactionV3', HeaderFilterTransactionV3);
Vue.component('DetailTransactionV3', DetailTransactionV3);
Vue.component('HeaderShowStatusV3', HeaderShowStatusV3);
Vue.component('SwitchStatusMaster', SwitchStatusMaster);
Vue.component('SwitchStatusTrx', SwitchStatusTrx);
Vue.component('SwitchDefault', SwitchDefault);
Vue.component('ProductWeight', ProductWeight);

export default {
  name: 'App',
};
</script>

<style lang="scss">
// Import Main styles for this application
@import 'assets/scss/style';
</style>
