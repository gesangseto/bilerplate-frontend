<template>
  <CHeader fixed with-subheader light>
    <CSubheader class="px-3" style="position: relative">
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
      <CHeaderNav
        style="margin-left: 10px"
        v-for="(item, index) in path_url"
        :key="index"
      >
        <a
          style="color: blue; cursor: pointer"
          v-if="index + 1 != path_url.length"
          @click="handleClickLink(item, index)"
        >
          {{ item.name }} /
        </a>
        <a v-if="index + 1 == path_url.length"> {{ item.name }}</a>
      </CHeaderNav>
      <!-- <div v-for="item of path_url" :key="item.path">
        {{ item }}
      </div> -->

      <CHeaderNav class="mr-4" style="position: absolute; right: 0">
        <CHeaderNavItem class="d-md-down-none mx-2">
          <CHeaderNavLink>
            <CButton @click="notifModal = true">
              <CIcon name="cil-bell" />
              <CBadge color="danger">{{ notifUnreadCount }}</CBadge>
            </CButton>
          </CHeaderNavLink>
        </CHeaderNavItem>

        <TheHeaderDropdownAccnt />
      </CHeaderNav>
    </CSubheader>
    <CModal :show.sync="notifModal" title="Notification">
      <template #header>
        <h5 class="modal-title">Notification</h5>
        <div>
          <CButton
            v-if="notifCount > 0"
            class="m-1"
            type="submit"
            size="sm"
            color="danger"
            @click="deleteNotifAll()"
          >
            Delete All
          </CButton>
          <CButton
            v-if="notifUnreadCount > 0"
            class="m-1"
            type="submit"
            size="sm"
            color="primary"
            @click="readNotifAll()"
          >
            Read All
          </CButton>
        </div>
      </template>

      <div class="scroll-auto" v-if="notifCount > 0">
        <CRow v-for="item in notif" :key="item.id">
          <CCol key="item.id" sm="12" md="12">
            <CButton
              v-if="!item.flag_read"
              @click="readNotif(item)"
              color="primary"
              size="sm"
              class="m-1"
            >
              <CIcon name="cil-bell" />
            </CButton>
            <CButton
              v-if="item.flag_read"
              @click="deleteNotif(item)"
              color="danger"
              size="sm"
              class="m-1"
            >
              <CIcon name="cil-trash" />
            </CButton>
            <a
              :href="item.trx_ref_name ? generateLinkNotif(item) : null"
              class="notification"
              @click="readNotif(item, true)"
              :style="!item.flag_read ? 'font-weight: bold' : null"
              >{{ item.content }}</a
            >
          </CCol>
        </CRow>
      </div>
      <template #footer>
        <button
          type="button"
          class="btn btn-m btn-danger text-white"
          @click="notifModal = false"
        >
          Close
        </button>
      </template>
    </CModal>
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
  getMstNotification,
  updateMstNotification,
  deleteMstNotification,
} from '../resource/MstNotification';
import {
  setLoginTimeout,
  getLoginTimeout,
  getRole,
  getProfile,
  clearStorage,
} from '../utils';
import moment from 'moment';
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
      notif: null,
      notifModal: false,
      notifLength: 0,
      notification: 0,
      notifId: [],
      next_count: true,
    };
  },
  mounted() {
    this.timeout = this.getDifferentSecond();
    this.getNotif();
  },
  beforeCreate() {
    if (!getProfile()) {
      clearStorage();
      return this.$router.push({ path: `/login` });
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        this.path_url = route.matched || null;
        this.timeoutModal = false;
        this.current_route = route;
        this.getNotif();
        this.checkPermission(route);
      },
    },
    timeout: {
      immediate: true,
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

    getDifferentSecond() {
      let time_out = getLoginTimeout();
      let time_now = moment(new Date())
        .add(1, 'seconds')
        .format('DD/MM/YYYY HH:mm:ss:SSS');
      let time_diff = moment(time_out, 'DD/MM/YYYY HH:mm:ss').diff(
        moment(time_now, 'DD/MM/YYYY HH:mm:ss')
      );
      let sisa = parseInt(time_diff / 1000);
      return sisa;
    },

    handleClickClose() {
      this.timeout = 9999;
      this.timeoutModal = false;
      this.getNotif();
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
      let allow_access = ['/setting/user-setting', '/home'];
      if (allow_access.includes(route.path)) {
        can_access = true;
      }
      if (can_access === 'false' || !can_access) {
        this.$router.push({ path: `/oops` });
      }
    },
    async readNotif(item, closeAfterUpdate) {
      let _res = await updateMstNotification({ id: [item.id] });
      this.$toast.open({
        message: _res.error ? _res.message : 'Data has been saved succesfully ',
        type: _res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      this.getNotif();
      if (closeAfterUpdate) {
        this.notifModal = false;
      }
    },
    async deleteNotif(item) {
      let _res = await deleteMstNotification({ id: [item.id] });
      this.$toast.open({
        message: _res.error ? _res.message : 'Data has been saved succesfully ',
        type: _res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      this.getNotif();
    },
    async readNotifAll() {
      let message = `You are about to read all existing notifications. All read notifications cannot be restored.\nAre you sure you want to continue?`;
      if (!confirm(message)) {
        return;
      }
      let _res = await updateMstNotification({ id: 'all' });
      this.$toast.open({
        message: _res.error ? _res.message : 'Data has been saved succesfully ',
        type: _res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      this.getNotif();
    },
    async deleteNotifAll() {
      let message = `You are about to delete all existing notifications. All deleted notifications cannot be restored.\nAre you sure you want to continue?`;
      if (!confirm(message)) {
        return;
      }
      let _res = await deleteMstNotification({ id: 'all' });
      this.$toast.open({
        message: _res.error ? _res.message : 'Data has been saved succesfully ',
        type: _res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      this.getNotif();
    },
    async getNotif() {
      let _res = await getMstNotification();
      if (_res) {
        if (_res.status_code && _res.status_code == '401') {
          this.sessionExpired();
          return;
        }
        this.notif = _res.data;
        this.notifLength = _res.data.length || 0;
        this.timeout = this.getDifferentSecond();
      }
      return;
    },
    generateLinkNotif(item) {
      if (!item.trx_ref_name) return null;
      let url = '#';
      if (item.trx_ref_name.toLowerCase() == 'bpom') {
        url += `/transaction/queue-bpom/read/${item.trx_ref_id}`;
      } else if (item.trx_ref_name.toLowerCase() == 'return') {
        url += `/transaction/return/approve/${item.trx_ref_id}`;
      } else if (item.trx_ref_name.toLowerCase() == 'disposal') {
        url += `/transaction/disposal/approve/${item.trx_ref_id}`;
      } else if (item.trx_ref_name.toLowerCase() == 'sampling') {
        url += `/transaction/indirect_request/approve/${item.trx_ref_id}`;
      } else if (item.trx_ref_name.toLowerCase() == 'rework') {
        url += `/transaction/rework/approve/${item.trx_ref_id}`;
      } else if (item.trx_ref_name.toLowerCase() == 'decommission') {
        url += `/transaction/comm-decomm/approve/${item.trx_ref_id}`;
      }
      return url;
    },
    sessionExpired() {
      let message = 'Your login session has expired, please login again.';
      localStorage.setItem('current_url', this.current_route.path);
      localStorage.setItem('message', message);
      clearStorage();
      this.timeout = null;
      this.$router.push({ path: '/login' });
      setLoginTimeout(-1);
      // window.location.reload();
      return;
    },
  },
  computed: {
    notifUnreadCount() {
      return Array.isArray(this.notif)
        ? this.notif.filter((it) => it.flag_read === 0).length
        : 0;
    },
    notifCount() {
      return Array.isArray(this.notif) ? this.notif.length : 0;
    },
  },
};
</script>
