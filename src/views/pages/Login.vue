<template>
  <CContainer
    fluid
    class="login-shell min-vh-100 d-flex align-items-center justify-content-center"
  >
    <CRow class="w-100 justify-content-center">
      <CCol xl="10" lg="11" md="12">
        <div class="login-grid">
          <aside class="info-panel">
            <div class="info-card">
              <span class="info-badge">Gastrack</span>
              <h2>Inventory visibility made simple.</h2>
              <p>
                A clean dashboard for your warehouse, stock, and process flow.
                Minimal layout for fast access and easy focus.
              </p>
              <ul>
                <li>Fast product finding</li>
                <li>Clear stock overview</li>
                <li>Light, modern interface</li>
              </ul>
              <div class="info-footer">Gesang Aji Seto</div>
            </div>
          </aside>

          <main class="form-panel">
            <CCard class="login-card border-0 shadow-sm">
              <CCardBody class="p-5">
                <div class="form-header mb-4 text-center">
                  <img :src="loginLogo" alt="Logo" class="login-logo" />
                  <h3 class="mb-2">Sign in</h3>
                  <p class="text-muted mb-0">
                    Login with your username and password.
                  </p>
                </div>

                <CForm @submit.prevent="login" class="login-form">
                  <div class="field-row mb-3">
                    <span class="field-icon"><CIcon name="cil-user" /></span>
                    <input
                      type="text"
                      class="field-input"
                      placeholder="Username"
                      autocomplete="username"
                      v-model="username"
                      @focus="showKeyboard = $event"
                      required
                    />
                  </div>

                  <div class="field-row mb-4">
                    <span class="field-icon"
                      ><CIcon name="cil-lock-locked"
                    /></span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="field-input"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="password"
                      @focus="showKeyboard = $event"
                      required
                    />
                    <button
                      type="button"
                      class="password-toggle"
                      @click="togglePassword"
                      aria-label="Toggle password"
                    >
                      <v-icon
                        :name="showPassword ? 'eye' : 'eye-slash'"
                        size="sm"
                      />
                    </button>
                  </div>

                  <CButton type="submit" color="primary" class="w-100 btn-login"
                    >Login</CButton
                  >
                  <p class="login-message text-danger mt-3 mb-0" v-if="message">
                    {{ message }}
                  </p>
                </CForm>
              </CCardBody>
            </CCard>
          </main>
        </div>
      </CCol>
    </CRow>

    <VirtualKeyboard :visible="showKeyboard" />
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
      username: null,
      password: null,
      loginLogo: null,
      showPassword: false,
      useKeyboard: false,
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
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      let param = {
        username: this.username,
        password: this.password,
      };
      if (!this.username || !this.password) {
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

<style scoped>
.login-shell {
  background: #f4f7fb;
}

.login-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2rem;
  align-items: stretch;
}

.info-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 3rem;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.08);
  min-height: 100%;
}

.info-badge {
  display: inline-flex;
  padding: 0.55rem 1rem;
  background: #eef2ff;
  color: #3730a3;
  border-radius: 999px;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.info-card h2 {
  font-size: 2rem;
  line-height: 1.15;
  margin-bottom: 1rem;
  color: #0f172a;
}

.info-card p {
  color: #475569;
  margin-bottom: 1.5rem;
  max-width: 34rem;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1.75rem;
}

.info-card li {
  margin-bottom: 0.85rem;
  color: #334155;
  position: relative;
  padding-left: 1.45rem;
}

.info-card li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #6366f1;
}

.info-footer {
  color: #64748b;
  font-size: 0.95rem;
}

.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  border-radius: 28px;
  background: #ffffff;
}

.form-header {
  text-align: center;
}

.login-logo {
  max-width: 100px;
  margin-bottom: 1rem;
}

.login-form {
  margin-top: 1rem;
}

.field-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.95rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.field-icon {
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.field-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  color: #0f172a;
  padding-right: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.field-input::placeholder {
  color: #94a3b8;
}

.password-toggle {
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.btn-login {
  border-radius: 14px;
  padding: 0.95rem 1.1rem;
  font-weight: 700;
}

.login-message {
  font-size: 0.95rem;
}

@media (max-width: 992px) {
  .login-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .info-card {
    padding: 2rem;
  }
}
</style>
