<template>
  <CContainer class="d-flex content-center min-vh-100">
    <CRow>
      <CCol>
        <CCardGroup>
          <CCard class="p-4">
            <CCardBody>
              <CForm>
                <!-- <h1>Login</h1> -->
                <img
                  v-bind:src="loginLogo"
                  class="mb-5"
                  style="width: 120px; heigth: auto"
                />
                <p class="text-muted">Sign In to your account</p>
                <CInput
                  placeholder="Username"
                  autocomplete="username email"
                  v-model="email"
                  data-layout="normal"
                  @focus="showKeyboard = $event"
                >
                  <template #prepend-content
                    ><CIcon name="cil-user"
                  /></template>
                </CInput>
                <CInput
                  placeholder="Password"
                  :type="showPassword == false ? 'password' : 'text'"
                  autocomplete="curent-password"
                  v-model="password"
                  @keyup="loginEnter"
                  @focus="showKeyboard = $event"
                >
                  <template #prepend-content
                    ><CIcon name="cil-lock-locked"
                  /></template>
                  <template #append-content>
                    <CButton
                      style="font-size: 10pt; margin: -10pt"
                      @click="showPassword = !showPassword"
                    >
                      <v-icon v-if="!showPassword" name="eye-slash" />
                      <v-icon v-if="showPassword" name="eye" />
                    </CButton>
                  </template>
                </CInput>
                <CRow>
                  <CCol col="12" class="text-center">
                    <CButton color="primary" style="width: 50%" @click="login"
                      >Login</CButton
                    >
                  </CCol>
                </CRow>
                <br />
                <strong class="text-danger">{{ message }}</strong>
              </CForm>
              <!-- <CFooter :fixed="false"> -->
              <br />
              <br />
              <br />
              <div class="ml-auto">
                <CButton @click="appModal = true" color="default">
                  <img
                    v-bind:src="copyright"
                    style="width: 120px; heigth: auto"
                  />
                </CButton>
              </div>
              <div class="ml-auto">
                <div>
                  <span class="mr-1"
                    >Copyright &copy; {{ new Date().getFullYear() }}</span
                  >
                  <a href="http://merindo.co.id/" target="_blank">
                    PT Merindo Makmur</a
                  >
                </div>
              </div>
              <!-- </CFooter> -->
            </CCardBody>
          </CCard>
          <!-- <CCard
            color="primary"
            text-color="white"
            class="text-center py-5 d-sm-down-none"
            body-wrapper
          >
            <h2>Sign up</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <CButton
              color="primary"
              class="active mt-3"
            >
              Register Now!
            </CButton>
          </CCard> -->
        </CCardGroup>
      </CCol>
    </CRow>
    <VirtualKeyboard :visible="showKeyboard" />
    <!-- <vue-fab
      size="small"
      :mainBtnColor="useKeyboard ? '#ff9900' : '#b5adac'"
      :icon="useKeyboard ? 'keyboard_hide' : 'keyboard'"
      @clickMainBtn="clickMainBtn"
      :menu="[]"
      style="right: 99%; top: 95%"
    >
    </vue-fab> 
    Ini adalah floating button untuk menampilkan virtual keyboard
    -->
  </CContainer>
</template>

<script>
import {
  reformatRole,
  setAsSuperAdmin,
  convertMenuV3,
  flatten,
  setLoginTimeout,
  setRole,
  setConfig,
  setProfile,
  getProfile,
  setMenu,
  getLoginLogo,
  getLastUrl,
  getConfig,
} from '../../utils';
import { logoMertrack } from '../../constants';
import { getSysConfig } from '../../resource/SysConfig';
import { authLogin } from '../../resource/SysAuth';

export default {
  name: 'Login',

  data() {
    return {
      showKeyboard: false,
      copyright: logoMertrack,
      message: null,
      email: null,
      password: null,
      loginLogo: null,
      showPassword: false,
      useKeyboard: false,

      // visible: false,
      layout: 'normal',
      input: null,
      options: {
        useKbEvents: false,
        preventClickEvent: false,
      },
    };
  },
  mounted() {
    this.loginLogo = getLoginLogo();
    this.loadConfig();
    this.message = null;
    if (!this.message && localStorage.getItem('message')) {
      this.message = localStorage.getItem('message');
      localStorage.removeItem('message');
    }
  },

  beforeMount() {
    if (getProfile()) {
      this.redirectReload();
    }
  },

  methods: {
    clickMainBtn() {
      this.useKeyboard = !this.useKeyboard;
      localStorage.setItem('use_keyboard', this.useKeyboard.toString());
      window.dispatchEvent(
        new CustomEvent('use_keyboard', {
          detail: {
            storage: localStorage.getItem('use_keyboard'),
          },
        }),
      );
    },
    redirectReload() {
      let profile = getProfile();
      let lastUrl = getLastUrl();
      if (lastUrl) {
        this.$router.push({ path: lastUrl });
        return;
      } else {
        this.$router.push({ path: '/home' });
        return;
      }
    },
    async loadConfig() {
      let _res = await getSysConfig();
      if (_res) {
        setConfig(_res.data[0]);
        this.loginLogo = getLoginLogo();
      }
    },

    loginEnter(event) {
      if (event.keyCode === 13) {
        this.login();
      }
    },

    async login() {
      let param = {
        email: this.email,
        password: this.password,
      };
      if (!this.email || !this.password) {
        this.$toast.open({
          message: `Please enter username and password`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.$isLoading(true);
      let res = await authLogin(param);
      this.$isLoading(false);
      if (res) {
        if (res?.error && res?.status_code == 403) {
          let profile = res?.data?.[0];
          setProfile(profile);
          this.$router.push({
            path: `/change-password?p-key=${profile?.token}`,
          });
          return;
        }

        this.$toast.open({
          message: `${res.message}`,
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        let _data = res.data[0];
        if (_data.id == 0) {
          _data = setAsSuperAdmin(_data);
        }

        let menu = [
          {
            _name: 'CSidebarNav',
            _children: convertMenuV3(_data.role_menu),
          },
        ];
        let role = reformatRole(flatten(_data.role_menu, 'items'));
        setMenu(menu);
        setRole(role);

        setProfile(_data);
        setLoginTimeout(_data.idletimeout ?? 0);
        this.redirectReload();
        return;
      }
    },
  },
};
</script>
