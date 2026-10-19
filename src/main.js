import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import App from './App';
import router from './router';
import CoreuiVue from '@coreui/vue';
import VueToast from 'vue-toast-notification';
import Vuelidate from 'vuelidate';
import { iconsSet as icons } from './assets/icons/icons.js';
import store from './store';
import { applyTabIdentity } from './resource/Identity';
import 'vue-toast-notification/dist/theme-default.css';
// import JQuery from 'jquery'
import './assets/css/jquery-ui.css';
import vSelect from 'vue-select';
// Plugin yang tidak terpakai dihapus dari bootstrap agar tidak membebani bundle
// awal halaman publik:
//  - vue-excel-xlsx  (menarik xlsx ~3,6 MB) — tidak ada <vue-excel-xlsx>
//  - vue-print-nb    ($print tidak dipakai)
//  - vue-html-to-paper ($htmlToPaper tidak dipakai)
//  - vue-multilanguage ($ml tidak dipakai)
//  - vuelidate-error-extractor (komponen form-group-row tidak dipakai)
//  - CSS @fortawesome (class fa-* tidak dipakai)
// Tambahkan kembali hanya jika fiturnya benar-benar dipakai.
Vue.config.performance = true;
Vue.use(CoreuiVue);
Vue.use(VueToast);
Vue.use(Vuelidate);
Vue.component('v-select', vSelect);
Vue.prototype.$log = console.log.bind(console);
Vue.prototype.$activeMenu = { name: '', link: null };

Vue.config.errorHandler = (err, vm, info) => {
  console.error('==========================vvv==========================');
  console.error(vm._name, info, err);
  console.error('==========================^^^==========================');
};
// Warm-up koneksi ke host API: halaman publik (landing/tracking) menarik
// /v1/jastip/identity tanpa token, dan origin-nya cross-origin (lihat .env
// VUE_APP_URL_API) sehingga tanpa preconnect kena DNS+TCP lagi di tiap request.
try {
  const apiOrigin = new URL(`${process.env.VUE_APP_URL_API}/api`).origin;
  if (
    apiOrigin &&
    apiOrigin !== window.location.origin &&
    !document.querySelector(`link[rel="preconnect"][href="${apiOrigin}"]`)
  ) {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = apiOrigin;
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);

    const dns = document.createElement('link');
    dns.rel = 'dns-prefetch';
    dns.href = apiOrigin;
    document.head.appendChild(dns);
  }
} catch (e) {
  /* VUE_APP_URL_API tidak valid? abaikan, hanya hint performa */
}

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

applyTabIdentity();

window.myApp = app;
