<template>
  <div class="rp">
    <NavPublic />

    <main class="rp-main">
      <div class="rp-card">
        <h1>Daftarkan Toko Jastip Anda</h1>
        <p class="rp-sub">
          Buat ruang kerja multi-tenant Anda sendiri. Cukup isi data di bawah,
          akun langsung aktif dan siap dipakai.
        </p>

        <form v-if="!done" @submit.prevent="submit">
          <div class="rp-field">
            <label>Nama Toko / Bisnis</label>
            <input
              v-model.trim="form.name"
              type="text"
              placeholder="mis. Beta Satu Corp"
              autocomplete="organization"
            />
          </div>

          <div class="rp-field">
            <label>Subdomain</label>
            <div class="rp-subdomain">
              <input
                v-model.trim="form.subdomain"
                type="text"
                placeholder="namatoko"
                autocomplete="off"
                @input="onSubdomain"
              />
              <span class="rp-suffix">.{{ baseDomain }}</span>
            </div>
            <small class="rp-hint">
              3–30 karakter, huruf kecil, angka, dan dash. Tidak boleh diawali
              atau diakhiri dash.
            </small>
          </div>

          <div class="rp-row">
            <div class="rp-field">
              <label>Username Admin</label>
              <input
                v-model.trim="form.username"
                type="text"
                placeholder="admin"
                autocomplete="off"
              />
            </div>
            <div class="rp-field">
              <label>Email</label>
              <input
                v-model.trim="form.email"
                type="email"
                placeholder="admin@toko.com"
                autocomplete="email"
              />
            </div>
          </div>

          <div class="rp-field">
            <label>Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Minimal 6 karakter"
              autocomplete="new-password"
            />
          </div>

          <div class="rp-field">
            <label>No. HP (opsional)</label>
            <input
              v-model.trim="form.contact_phone"
              type="text"
              placeholder="0812xxxxxxx"
              autocomplete="tel"
            />
          </div>

          <p v-if="error" class="rp-error">{{ error }}</p>

          <button class="rp-btn" type="submit" :disabled="loading">
            {{ loading ? 'Memproses…' : 'Daftar Sekarang' }}
          </button>
        </form>

        <div v-else class="rp-done">
          <div class="rp-done-icon">✓</div>
          <h2>Pendaftaran Berhasil</h2>
          <p>
            Tenant <strong>{{ result.name }}</strong> sudah aktif. Masuk memakai
            kredensial yang Anda buat:
          </p>
          <div class="rp-done-url">
            <code>{{ result.login_url }}</code>
          </div>
          <a class="rp-btn" :href="result.login_url">Masuk ke Akun</a>
          <router-link class="rp-link" to="/login">
            atau login di halaman ini
          </router-link>
        </div>

        <p v-if="!done" class="rp-foot">
          Sudah punya akun?
          <router-link to="/login">Masuk di sini</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import NavPublic from '../landing/NavPublic.vue';
import { registerTenant } from '../../resource/RegisterTenant';

export default {
  name: 'RegisterTenant',
  components: { NavPublic },
  data() {
    return {
      form: {
        name: '',
        subdomain: '',
        username: '',
        email: '',
        password: '',
        contact_phone: '',
      },
      baseDomain: process.env.VUE_APP_BASE_DOMAIN || 'jastip.local',
      loading: false,
      error: null,
      done: false,
      result: {},
    };
  },
  methods: {
    onSubdomain() {
      this.form.subdomain = String(this.form.subdomain || '')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '');
    },
    validate() {
      const f = this.form;
      if (!f.name) return 'Nama toko wajib diisi';
      if (!f.subdomain) return 'Subdomain wajib diisi';
      if (!/^[a-z0-9]([a-z0-9-]{1,28})[a-z0-9]$/.test(f.subdomain))
        return 'Format subdomain tidak valid (3–30 karakter)';
      if (!f.username) return 'Username admin wajib diisi';
      if (!/^[a-z0-9._-]{3,50}$/.test(f.username))
        return 'Username 3–50 karakter (huruf kecil, angka, . _ -)';
      if (!f.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email))
        return 'Email tidak valid';
      if (!f.password || f.password.length < 6)
        return 'Password minimal 6 karakter';
      return null;
    },
    async submit() {
      this.error = this.validate();
      if (this.error) return;
      this.loading = true;
      const res = await registerTenant({
        name: this.form.name,
        subdomain: this.form.subdomain,
        username: this.form.username,
        email: this.form.email,
        password: this.form.password,
        contact_phone: this.form.contact_phone || undefined,
      });
      this.loading = false;
      if (!res || res.error) {
        this.error = (res && res.message) || 'Pendaftaran gagal';
        return;
      }
      this.result = res;
      this.done = true;
    },
  },
};
</script>

<style scoped>
.rp {
  min-height: 100vh;
  background: #f8fafc;
}
.rp-main {
  display: flex;
  justify-content: center;
  padding: 40px 20px 80px;
}
.rp-card {
  width: 100%;
  max-width: 560px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}
.rp-card h1 {
  font-size: 24px;
  color: #0f172a;
  margin: 0 0 8px;
}
.rp-sub {
  color: #64748b;
  font-size: 14.5px;
  margin: 0 0 24px;
  line-height: 1.5;
}
.rp-field {
  margin-bottom: 16px;
  flex: 1;
}
.rp-field label {
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}
.rp-field input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  font-size: 14.5px;
  color: #0f172a;
  outline: none;
  transition: border 0.15s, box-shadow 0.15s;
}
.rp-field input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}
.rp-row {
  display: flex;
  gap: 14px;
}
.rp-subdomain {
  display: flex;
  align-items: stretch;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  overflow: hidden;
}
.rp-subdomain input {
  border: none;
  border-radius: 0;
  flex: 1;
}
.rp-subdomain input:focus {
  box-shadow: none;
}
.rp-suffix {
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  background: #f1f5f9;
  color: #475569;
  font-size: 13.5px;
  border-left: 1px solid #e2e8f0;
}
.rp-hint {
  display: block;
  color: #94a3b8;
  font-size: 12.5px;
  margin-top: 6px;
}
.rp-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 10px 12px;
  border-radius: 9px;
  font-size: 14px;
  margin: 4px 0 16px;
}
.rp-btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: #fff;
  font-size: 15.5px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.15s;
}
.rp-btn:hover {
  opacity: 0.92;
}
.rp-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.rp-foot {
  text-align: center;
  color: #64748b;
  font-size: 14px;
  margin: 20px 0 0;
}
.rp-foot a,
.rp-link {
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
}
.rp-done {
  text-align: center;
}
.rp-done-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: #dcfce7;
  color: #16a34a;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rp-done h2 {
  color: #0f172a;
  margin: 0 0 8px;
}
.rp-done p {
  color: #475569;
  font-size: 14.5px;
  margin: 0 0 16px;
}
.rp-done-url {
  background: #f1f5f9;
  border-radius: 9px;
  padding: 12px;
  margin-bottom: 18px;
  word-break: break-all;
}
.rp-done-url code {
  color: #1e293b;
  font-size: 13.5px;
}
.rp-done .rp-btn {
  margin-bottom: 12px;
}
.rp-done .rp-link {
  display: inline-block;
  font-size: 13.5px;
}
</style>
