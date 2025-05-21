<template>
  <router-view></router-view>
</template>

<script>
import Vue from 'vue';
import loading from 'vuejs-loading-screen';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';
import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip';
import VueTouchKeyboard from 'vue-touch-keyboard';
import 'vue-touch-keyboard/dist/vue-touch-keyboard.css'; // load default style
import 'vue-js-modal/dist/styles.css';
import vmodal from 'vue-js-modal';
import VueFab from 'vue-float-action-button';

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
  VirtualKeyboard,
  SelectOption,
  Metadata,
  ButtonDownloadFilePath,
  InputDateDefault,
  InputDefault,
  ButtonPopover,
  TextareaDefault,
  TableDefault,
} from './views/component';
Vue.use(
  VueFab /* {
  ----------------------
  // opitons Optional Alibaba iconfont icon or MaterialIcons
  iconType: 'MaterialDesign'
  // iconType: 'iconfont'
} */
);
Vue.use(VueCustomTooltip);
Vue.use(loading);
Vue.use(vmodal);
Vue.use(VueTouchKeyboard);
Vue.component('TableDefault', TableDefault);
Vue.component('ButtonPopover', ButtonPopover);
Vue.component('VirtualKeyboard', VirtualKeyboard);
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
Vue.component('SelectOption', SelectOption);
Vue.component('Metadata', Metadata);
Vue.component('ButtonDownloadFilePath', ButtonDownloadFilePath);
Vue.component('InputDefault', InputDefault);
Vue.component('InputDateDefault', InputDateDefault);
Vue.component('TextareaDefault', TextareaDefault);

export default {
  name: 'App',
};
</script>

<style lang="scss">
// Import Main styles for this application
@import 'assets/scss/style';
svg {
  fill: currentColor !important;
}
</style>
