<template>
  <div class="login-page">
    <!-- Tombol kembali ke landing page -->
    <router-link class="back-home" to="/landing">
      <span class="back-home-arrow" aria-hidden="true">&larr;</span>
      Kembali ke Beranda
    </router-link>

    <div class="login-shell">
      <!-- Panel kiri: identitas dari sys_config -->
      <aside class="brand-panel">
        <div class="brand-inner">
          <div class="brand-logo" :class="{ 'is-placeholder': !logo }">
            <img v-if="logo" :src="logo" :alt="brandName" />
            <span v-else class="brand-initial">{{ brandInitial }}</span>
          </div>
          <h1 class="brand-name">{{ brandName }}</h1>
          <p class="brand-tagline">Sistem Jasa Titip Belanja</p>

          <ul class="brand-points">
            <li>Catat barang titipan sampai tiba di customer.</li>
            <li>Tagih customer lewat WhatsApp dalam sekali klik.</li>
            <li>Lacak paket dengan nomor HP atau nomor resi.</li>
          </ul>

          <div class="brand-contact" v-if="address || phone || number">
            <div v-if="address" class="contact-row">
              <span class="contact-icon" aria-hidden="true">&#9906;</span>
              <span>{{ address }}</span>
            </div>
            <div v-if="phone" class="contact-row">
              <span class="contact-icon" aria-hidden="true">&#9742;</span>
              <span>{{ phone }}</span>
            </div>
            <div v-if="number" class="contact-row">
              <span class="contact-icon" aria-hidden="true">&#9635;</span>
              <span>{{ number }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Panel kanan: form login -->
      <main class="form-panel">
        <div class="form-card">
          <div class="form-logo-mobile" :class="{ 'is-placeholder': !logo }">
            <img v-if="logo" :src="logo" :alt="brandName" />
            <span v-else class="brand-initial">{{ brandInitial }}</span>
          </div>

          <header class="form-head">
            <h2>Masuk ke Akun</h2>
            <p>Gunakan username dan password Anda untuk melanjutkan.</p>
          </header>

          <CForm @submit.prevent="login" class="login-form">
            <label class="field-label" for="login-username">Username</label>
            <div class="field-row">
              <span class="field-icon"><CIcon name="cil-user" /></span>
              <input
                id="login-username"
                type="text"
                class="field-input"
                placeholder="Username atau email"
                autocomplete="username"
                v-model="username"
                required
              />
            </div>

            <label class="field-label" for="login-password">Password</label>
            <div class="field-row">
              <span class="field-icon"><CIcon name="cil-lock-locked" /></span>
              <input
                id="login-password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                placeholder="Password"
                autocomplete="current-password"
                v-model="password"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="togglePassword"
                :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
              >
                <CIcon :name="showPassword ? 'cil-low-vision' : 'cil-eye'" />
              </button>
            </div>

            <CButton type="submit" color="primary" class="btn-login w-100">
              Masuk
            </CButton>

            <p class="login-message" v-if="message">{{ message }}</p>
          </CForm>

          <p class="form-foot">
            Butuh bantuan? Hubungi admin sistem Anda.
          </p>
        </div>
      </main>
    </div>

    <VirtualKeyboard :visible="showKeyboard" />
  </div>
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
} from '../../utils';
import { getIdentity } from '../../resource/Identity';
import { getSysConfig } from '../../resource/SysConfig';
import { authLogin } from '../../resource/SysAuth';

export default {
  name: 'Login',

  data() {
    return {
      showKeyboard: false,
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
      // Identitas dari sys_configuration_mst (endpoint publik, tanpa token)
      logo: null,
      brandName: 'Jastip',
      address: null,
      phone: null,
      number: null,
    };
  },
  created() {
    // Branding publik: ambil dari endpoint identity (tidak butuh token),
    // jadi logo/nama/alamat selalu tampil walau belum login.
    this.loadIdentity();
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

  computed: {
    brandInitial() {
      const name = (this.brandName || 'J').trim();
      return name.charAt(0).toUpperCase();
    },
  },

  methods: {
    async loadIdentity() {
      const id = await getIdentity();
      if (id) {
        if (id.identity_logo_path) this.logo = id.identity_logo_path;
        if (id.identity_name) this.brandName = id.identity_name;
        if (id.identity_address) this.address = id.identity_address;
        if (id.identity_phone) this.phone = id.identity_phone;
        if (id.identity_number) this.number = id.identity_number;
      }
    },
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
        // Login gagal (kredensial salah / user nonaktif / akun terkunci):
        // backend balas error tanpa data user → tampilkan pesan, jangan lanjut.
        if (res.error && !(res.status_code == 403 && res.data && res.data[0])) {
          this.message = res.message || 'Login gagal. Periksa username dan password.';
          this.$toast.open({
            message: `${this.message}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return;
        }
        if (res?.error && res?.status_code == 403) {
          let profile = res?.data?.[0];
          setProfile(profile);
          this.$router.push({
            path: `/change-password?p-key=${profile?.token}`,
          });
          return;
        }

        let _data = res.data && res.data[0];
        if (!_data) {
          this.message = res.message || 'Login gagal. Periksa username dan password.';
          return;
        }
        this.$toast.open({
          message: `${res.message}`,
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
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
.login-page {
  min-height: 100vh;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
}

/* Tombol kembali ke landing */
.back-home {
  position: absolute;
  top: 22px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  padding: 9px 16px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e2e8f0;
  transition: color 0.15s, border-color 0.15s, transform 0.15s;
}
.back-home:hover {
  color: #4f46e5;
  border-color: #c7d2fe;
  transform: translateX(-2px);
  text-decoration: none;
}
.back-home-arrow {
  font-size: 16px;
  line-height: 1;
}

.login-shell {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 980px;
  background: #fff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
}

/* Panel brand (kiri) */
.brand-panel {
  background: linear-gradient(150deg, #4f46e5 0%, #0ea5e9 100%);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 48px 44px;
}
.brand-inner {
  width: 100%;
}
.brand-logo {
  width: 68px;
  height: 68px;
  border-radius: 16px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-bottom: 22px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.18);
}
.brand-logo.is-placeholder {
  background: rgba(255, 255, 255, 0.9);
}
.brand-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
}
.brand-initial {
  font-size: 28px;
  font-weight: 800;
  color: #4f46e5;
  line-height: 1;
}
.brand-name {
  font-size: 30px;
  font-weight: 800;
  margin: 0 0 6px;
  line-height: 1.15;
  color: #fff;
}
.brand-tagline {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 26px;
}
.brand-points {
  list-style: none;
  padding: 0;
  margin: 0 0 30px;
}
.brand-points li {
  position: relative;
  padding-left: 26px;
  margin-bottom: 12px;
  font-size: 14.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.95);
}
.brand-points li::before {
  content: '\2713';
  position: absolute;
  left: 0;
  top: 0;
  font-weight: 700;
  color: #d1fae5;
}
.brand-contact {
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  padding-top: 18px;
}
.contact-row {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 13.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
}
.contact-row:last-child {
  margin-bottom: 0;
}
.contact-icon {
  flex: none;
  opacity: 0.9;
}

/* Panel form (kanan) */
.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 44px;
}
.form-card {
  width: 100%;
  max-width: 360px;
}
.form-logo-mobile {
  display: none;
}
.form-head {
  margin-bottom: 26px;
}
.form-head h2 {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 8px;
  color: #0f172a;
}
.form-head p {
  font-size: 14.5px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 7px;
}
.field-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  height: 50px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 18px;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.field-row:focus-within {
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.14);
}
.field-icon {
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  flex: none;
}
.field-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  color: #0f172a;
}
.field-input::placeholder {
  color: #94a3b8;
}
.password-toggle {
  flex: none;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 4px;
}
.password-toggle:hover {
  color: #4f46e5;
}

.btn-login {
  border-radius: 12px;
  padding: 0.85rem 1.1rem;
  font-weight: 700;
  font-size: 15px;
  margin-top: 4px;
}

.login-message {
  font-size: 14px;
  color: #dc2626;
  margin: 14px 0 0;
  text-align: center;
}

.form-foot {
  margin: 22px 0 0;
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
}

/* Responsive */
@media (max-width: 860px) {
  .login-shell {
    grid-template-columns: 1fr;
    max-width: 440px;
  }
  .brand-panel {
    display: none;
  }
  .form-panel {
    padding: 40px 28px;
  }
  .form-logo-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 14px;
    background: #fff;
    border: 1px solid #e2e8f0;
    padding: 7px;
    margin: 0 auto 20px;
  }
  .form-logo-mobile.is-placeholder {
    background: #f8fafc;
  }
  .form-logo-mobile img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 9px;
  }
  .form-head {
    text-align: center;
  }
  .back-home {
    top: 16px;
    left: 16px;
    font-size: 13px;
    padding: 8px 12px;
  }
}
</style>
