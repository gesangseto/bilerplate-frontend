<template>
  <CHeader
    fixed
    with-subheader
    light
    style="
      background-color: #fafaf5;
      border-bottom: 1px solid rgba(85, 59, 156, 0.18);
    "
  >
    <CSubheader
      class="px-3"
      style="position: relative; background-color: transparent"
    >
      <CToggler
        in-header
        class="ml-3 d-lg-none"
        @click="$store.commit('toggleSidebarMobile')"
      />
      <CToggler
        in-header
        class="ml-3 d-md-down-none"
        @click="$store.commit('toggleSidebarDesktop')"
      />

      <!-- <CBreadcrumbRouter class="border-0 mb-0" /> -->
      <CHeaderNav>
        <a href="#/home"> Home /&nbsp;</a>
        <a :href="`#${$activeMenu.link}`"> {{ $activeMenu.breadcrumbs }}</a>
      </CHeaderNav>

      <!-- <div v-for="item of path_url" :key="item.path">
        {{ item }}
      </div> -->

      <CHeaderNav class="mr-4" style="position: absolute; right: 0">
        <CHeaderNavItem class="d-md-down-none mx-2">
          <CHeaderNavLink>
            <!-- INI Untuk download APK Android kalo udah stable  -->
          </CHeaderNavLink>
        </CHeaderNavItem>

        <TheHeaderDropdownAccnt />
      </CHeaderNav>
    </CSubheader>
    <CModal
      title="Warning Session Timeout"
      color="danger"
      :show.sync="timeoutModal"
      :close-on-backdrop="false"
    >
      <template #header>
        <h5 class="modal-title">Login Session Notification</h5>
      </template>
      {{
        timeout >= 0
          ? `Your login session will expire in less than ${timeout} seconds.`
          : `Your login session has expired.`
      }}
      <br />
      {{
        timeout >= 0
          ? `Click [Close] or change to another menu to extend the session.`
          : `Click [Close] or change to another menu to re-login.`
      }}

      <template #footer>
        <button
          type="button"
          class="btn btn-m btn-danger text-white"
          @click="handleClickClose()"
        >
          Close
        </button>
      </template>
    </CModal>
  </CHeader>
</template>

<style scoped>
.notification {
  font-size: small;
  color: black;
}
.scroll-auto {
  height: 60vh;
  overflow-y: scroll;
  overflow-x: hidden; /* Sembunyikan scroll horizontal secara eksplisit */
}
</style>
<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt';
import {
  setLoginTimeout,
  getLoginTimeout,
  getRole,
  getProfile,
  clearStorage,
  setLimitation,
  setConfig,
  setLastUrl,
  getConfig,
} from '../utils';
import moment from 'moment';
import { getSysConfig } from '../resource/SysConfig';
export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt,
  },
  data() {
    return {
      path_url: [],
      then: moment().add(15, 'minutes'),
      current_route: null,
      limit: 30,
      timeout: null,
      can_show: true,
      timeoutModal: false,
      notif: [],
      notifModal: false,
      notifLength: 0,
      notification: 0,
      notifId: [],
      next_count: true,
    };
  },
  mounted() {
    this.timeout = this.getDifferentSecond();
  },
  beforeCreate() {
    setLastUrl(this.$route.path);
    if (!getProfile()) {
      clearStorage();
      return this.$router.push({ path: `/login` });
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        // console.log('==========LOAD NOTIF VIA ROUTE============');
        // console.log(route.query);
        this.path_url = route.matched || null;
        this.timeoutModal = false;
        this.current_route = route;
        this.checkPermission(route);
        this.getLimitationConfig();
      },
    },
    timeout: {
      // immediate: true,
      handler(val) {
        let isNan = isNaN(parseFloat(val));
        if (!isNan && val != null && val > 0 && this.next_count) {
          this.next_count = false;
          if (val <= this.limit) {
            if (!this.timeoutModal) {
              this.can_show = true;
            }
            if (val <= this.limit && this.can_show) {
              this.timeoutModal = true;
              this.can_show = false;
            }
          } else {
            this.timeoutModal = false;
            this.can_show = true;
          }
          // Resync timeout setiap 10 detik
          if (val % 10 == 0) {
            setTimeout(() => {
              let diff = this.getDifferentSecond();
              this.next_count = true;
              this.timeout = diff === val ? val - 1 : diff;
            }, 1000);
          } else {
            setTimeout(() => {
              this.next_count = true;
              this.timeout -= 1;
            }, 1000);
          }
        } else if (!isNan && val != null && val <= 0) {
          this.sessionExpired();
        }
      },
    },
  },
  methods: {
    handleClickLink(it, index) {
      if (!index) {
        this.$router.push({ path: `/home` });
        return;
      }
      let url = this.path_url[index + 1];
      if (url.path.indexOf('/:') < 1) {
        url = url.path;
      } else {
        url = url.path.substring(0, url.path.indexOf('/:'));
      }
      if (url !== this.current_route.path) {
        this.$router.push({ path: `${url}` });
      }
      return;
    },
    async getLimitationConfig() {
      let data = await getSysConfig({ without_logo: true });
      data = data.data[0];
      setConfig(data);
      setLimitation(data);
    },
    getDifferentSecond() {
      let time_out = getLoginTimeout();
      let time_now = moment(new Date())
        .add(1, 'seconds')
        .format('DD/MM/YYYY HH:mm:ss:SSS');
      let time_diff = moment(time_out, 'DD/MM/YYYY HH:mm:ss').diff(
        moment(time_now, 'DD/MM/YYYY HH:mm:ss'),
      );
      let sisa = parseInt(time_diff / 1000);
      return sisa;
    },

    handleClickClose() {
      this.timeout = 9999;
      this.timeoutModal = false;
    },
    checkPermission(route) {
      let can_access = false;
      var method = route.params.type;
      let role = getRole();
      if (role && Array.isArray(role)) {
        for (const it of role) {
          if (route.path.includes(it.link)) {
            if (method) {
              can_access = it[`can_${method}`];
            } else {
              can_access = true;
            }
          }
        }
      }
      let allow_access = ['/setting/user-setting', '/home', '/change-password'];
      if (allow_access.includes(route.path)) {
        can_access = true;
      }
      if (can_access === 'false' || !can_access) {
        this.$router.push({ path: `/oops` });
      }
      let profile = getProfile();
      let url = `/change-password?p-key=${profile.token}`;
      if (profile && profile.id != 0 && profile.password_is_expiry) {
        this.$router.push({ path: `${url}&password_is_expiry=true` });
        return;
      }
      if (
        getConfig().password_must_change &&
        profile &&
        profile.id != 0 &&
        profile.password_must_change
      ) {
        this.$router.push({ path: url });
        return;
      }
    },
    generateLinkNotif(item) {
      if (!item.trx_ref_name) return null;
      let url = '#';
      if (item.trx_ref_name.toLowerCase() == 'bpom') {
        url += `/transaction/queue-bpom/read/${item.trx_ref_id || item.trx_id}`;
      } else if (item.trx_ref_name.toLowerCase() == 'return') {
        url += `/transaction/return/approve/${item.trx_id}`;
      } else if (item.trx_ref_name.toLowerCase() == 'disposal') {
        url += `/transaction/disposal/approve/${item.trx_id}`;
      } else if (item.trx_ref_name.toLowerCase() == 'sampling') {
        url += `/transaction/indirect_request/approve/${item.trx_id}`;
      } else if (item.trx_ref_name.toLowerCase() == 'indirect request') {
        url += `/transaction/indirect_request/approve/${item.trx_id}`;
      } else if (item.trx_ref_name.toLowerCase() == 'rework') {
        url += `/transaction/rework/approve/${item.trx_id}`;
      } else if (
        item.trx_ref_name.toLowerCase() == 'decommission' ||
        item.trx_ref_name.toLowerCase() == 'decommissioning'
      ) {
        url += `/transaction/comm-decomm/approve/${item.trx_id}`;
      } else if (
        item.trx_ref_name.toLowerCase() == 'commission' ||
        item.trx_ref_name.toLowerCase() == 'commissioning'
      ) {
        url += `/transaction/comm-decomm/approve/${item.trx_id}`;
      }
      return url;
    },
    sessionExpired() {
      let message = 'Your login session has expired, please login again.';
      localStorage.setItem('message', message);
      clearStorage();
      this.timeout = null;
      this.$router.push({ path: '/login' });
      setLoginTimeout(-1);
      // window.location.reload();
      return;
    },
  },
  computed: {},
};
</script>
