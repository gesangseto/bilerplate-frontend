import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import App from './App';
import router from './router';
import CoreuiVue from '@coreui/vue';
import VueToast from 'vue-toast-notification';
import Vuelidate from 'vuelidate';
import VuelidateErrorExtractor, { templates } from 'vuelidate-error-extractor';
import { iconsSet as icons } from './assets/icons/icons.js';
import store from './store';
import 'vue-toast-notification/dist/theme-default.css';
// import JQuery from 'jquery'
// import "./assets/js/select2.min.js";
// import "./assets/css/select2.min.css";
import './assets/css/jquery-ui.css';
import vSelect from 'vue-select';
import { MLInstaller } from 'vue-multilanguage';
import VueExcelXlsx from 'vue-excel-xlsx';
import Print from 'vue-print-nb';
import VueHtmlToPaper from 'vue-html-to-paper';
import '@fortawesome/fontawesome-free/css/all.css';
const options = {
  name: '',
  specs: ['fullscreen=yes', 'titlebar=no', 'scrollbars=no'],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css',
  ],
};
Vue.config.performance = true;
Vue.use(VueHtmlToPaper, options);
Vue.use(CoreuiVue);
Vue.use(VueToast);
Vue.use(Vuelidate);
Vue.use(VueExcelXlsx);
Vue.use(Print);

// Vue.use(JQuery)
Vue.use(MLInstaller);
Vue.use(VuelidateErrorExtractor, {
  i18n: false,
  messages: {
    required: '{attribute} is required!',
    email: '{attribute} is not a valid Email address.',
    isEmailAvailable:
      '{attribute} is not available. Must be at least 10 characters long.',
  },
});

Vue.component('form-group-row', templates.singleErrorExtractor.foundation6);
Vue.component('v-select', vSelect);
Vue.prototype.$log = console.log.bind(console);
Vue.prototype.$activeMenu = { name: '', link: null };

Vue.config.errorHandler = (err, vm, info) => {
  console.error('==========================vvv==========================');
  console.error(vm._name, info, err);
  console.error('==========================^^^==========================');
};
const app = new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App,
  },
});

window.myApp = app;
