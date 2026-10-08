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
import { applyTabIdentity } from './resource/Identity';
import { detectTenantFromHost, setTenantCode, removeTenantInfo } from './utils/storage';
import { fetchTenantInfoWeb } from './resource/SysTenant';
import 'vue-toast-notification/dist/theme-default.css';
// import JQuery from 'jquery'
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

// Multi-tenant SaaS: tentukan konteks branding SEBELUM app di-mount.
//  - Host DENGAN subdomain tenant (demo.jastipcenter.local) -> branding TENANT.
//  - Host TANPA subdomain (jastipcenter.local / IP / localhost) -> branding
//    PLATFORM. Kode tenant yang tersimpan dari kunjungan sebelumnya HARUS
//    dibuang, kalau tidak branding tenant lama bocor ke halaman platform.
// WAJIB dijalankan sebelum `new Vue({el:'#app'})`: mount bersifat SINKRON dan
// komponen (Landing/NavPublic) langsung memanggil getIdentity(); bila X-Tenant
// belum di-set, request identitas pertama akan ter-cache dengan branding salah.
try {
  const fromHost = detectTenantFromHost(window.location.hostname);
  if (fromHost) {
    setTenantCode(fromHost);
    fetchTenantInfoWeb(fromHost);
  } else {
    // Tidak ada subdomain tenant: pastikan konteks branding = PLATFORM.
    removeTenantInfo();
    setTenantCode('');
  }
} catch (e) {
  /* diabaikan — tenant opsional (super admin) */
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

// Terapkan identitas SETELAH konteks tenant ditentukan, agar request
// /v1/jastip/identity membawa X-Tenant yang benar (branding tenant vs platform).
applyTabIdentity();

window.myApp = app;
