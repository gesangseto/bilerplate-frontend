<template>
  <div class="lp">
    <NavPublic />

    <!-- HERO -->
    <header class="lp-hero">
      <div class="lp-hero-inner">
        <div class="lp-hero-logo" :class="{ 'is-placeholder': !brandLogo }">
          <img
            v-if="brandLogo"
            :src="brandLogo"
            width="76"
            height="76"
            fetchpriority="high"
            decoding="async"
            :alt="brandName"
          />
          <span v-else class="lp-hero-initial" aria-hidden="true">{{
            brandInitial
          }}</span>
        </div>
        <span class="lp-pill">Jasa Titip Belanja</span>
        <h1>
          Titip belanja tanpa ragu,<br />
          <span class="lp-grad">terlacak dari belanja sampai tiba.</span>
        </h1>
        <p class="lp-sub">
          Jastip mencatat setiap barang, tagihan, dan pengiriman dalam satu
          sistem. Pantau statusnya kapan saja lewat nomor resi atau nomor HP.
        </p>
        <div class="lp-cta">
          <router-link class="lp-btn lp-btn-primary" to="/tracking">
            Lacak Paket
          </router-link>
          <router-link class="lp-btn lp-btn-ghost" to="/login">
            Masuk ke Akun
          </router-link>
        </div>
      </div>
    </header>

    <!-- FITUR -->
    <section class="lp-section">
      <div class="lp-wrap">
        <h2>Kenapa Jastip</h2>
        <div class="lp-grid">
          <div class="lp-card">
            <div class="lp-card-icon lp-i-1">01</div>
            <h3>Pelacakan Status</h3>
            <p>
              Cek posisi barang dari manifest, masuk gudang, sampai dikirim ke
              penerima — semua berdasarkan data nyata.
            </p>
          </div>
          <div class="lp-card">
            <div class="lp-card-icon lp-i-2">02</div>
            <h3>Tagihan Transparan</h3>
            <p>
              Total tagihan per customer dihitung otomatis dari barang yang
              dibeli, lengkap dengan rincian item.
            </p>
          </div>
          <div class="lp-card">
            <div class="lp-card-icon lp-i-3">03</div>
            <h3>Invoice WhatsApp</h3>
            <p>
              Rincian tagihan berupa invoice PDF bisa dikirim langsung ke
              WhatsApp customer dari sistem.
            </p>
          </div>
          <div class="lp-card">
            <div class="lp-card-icon lp-i-4">04</div>
            <h3>Gudang &amp; Dokumentasi</h3>
            <p>
              Setiap barang tercatat dengan barcode, foto, dan status — tidak
              ada paket yang tanpa jejak.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CARA KERJA -->
    <section class="lp-section lp-section-alt">
      <div class="lp-wrap">
        <h2>Cara Kerja</h2>
        <div class="lp-steps">
          <div class="lp-step">
            <span class="lp-step-num">1</span>
            <h3>Titip Belanja</h3>
            <p>Barang dibelikan sesuai permintaan dan dicatat di sistem.</p>
          </div>
          <div class="lp-step">
            <span class="lp-step-num">2</span>
            <h3>Masuk Gudang</h3>
            <p>
              Barang diterima di gudang, di-scan, dan statusnya diperbarui.
            </p>
          </div>
          <div class="lp-step">
            <span class="lp-step-num">3</span>
            <h3>Dikirim ke Penerima</h3>
            <p>
              Dikirim lewat kurir — lacak dengan nomor resi atau nomor HP.
            </p>
          </div>
        </div>
        <div class="lp-cta lp-cta-center">
          <router-link class="lp-btn lp-btn-primary" to="/tracking">
            Lacak Paket Sekarang
          </router-link>
        </div>
      </div>
    </section>

    <footer class="lp-footer">
      <div class="lp-wrap lp-footer-inner">
        <span><span class="lp-dot-mini"></span> {{ brandName }}</span>
        <span class="lp-muted">© {{ year }} — Jasa Titip Belanja</span>
      </div>
    </footer>
  </div>
</template>

<script>
import NavPublic from './NavPublic.vue';
import { getIdentity } from '../../resource/Identity';
import { applyPublicSeo, releasePublicSeo } from '../../resource/PublicSeo';

export default {
  name: 'LandingPage',
  components: { NavPublic },
  data() {
    return {
      brandLogo: null,
      brandName: 'Jastip',
    };
  },
  created() {
    // Non-blocking: render langsung dengan fallback, identity menyusul saat
    // resolve (lihat getIdentity yang di-cache di resource/Identity.js).
    this.loadIdentity();
  },
  mounted() {
    applyPublicSeo({ title: this.seoTitle, path: '/landing' });
  },
  beforeDestroy() {
    releasePublicSeo();
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
    brandInitial() {
      const name = (this.brandName || 'J').trim();
      return name.charAt(0).toUpperCase();
    },
    seoTitle() {
      return `${this.brandName} — Jasa Titip Belanja & Lacak Paket`;
    },
  },
  methods: {
    async loadIdentity() {
      const id = await getIdentity();
      if (id) {
        if (id.identity_logo_path) this.brandLogo = id.identity_logo_path;
        if (id.identity_name) this.brandName = id.identity_name;
      }
      // Judul ikut brand runtime; applyTabIdentity() tidak menimpa judul
      // ber-flag data-seo="dynamic".
      applyPublicSeo({ title: this.seoTitle, path: '/landing' });
    },
  },
};
</script>

<style scoped>
.lp {
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
}

/* Hero */
.lp-hero {
  background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
  color: #fff;
  padding: 72px 20px 84px;
}
.lp-hero-inner {
  max-width: 780px;
  margin: 0 auto;
  text-align: center;
}
.lp-hero-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  width: 76px;
  height: 76px;
  border-radius: 18px;
  background: #fff;
  padding: 6px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
}
/* Kotak logo selalu ada (sebelum identity resolve) supaya tidak ada layout shift */
.lp-hero-logo.is-placeholder {
  background: rgba(255, 255, 255, 0.9);
}
.lp-hero-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}
.lp-hero-initial {
  font-size: 30px;
  line-height: 1;
  font-weight: 800;
  color: #4f46e5;
}
.lp-pill {
  display: inline-block;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 14px;
  border-radius: 999px;
  margin-bottom: 20px;
}
.lp-hero h1 {
  font-size: clamp(28px, 5vw, 44px);
  line-height: 1.2;
  font-weight: 800;
  margin: 0 0 16px;
}
.lp-grad {
  color: #e0f2fe;
}
.lp-sub {
  font-size: clamp(15px, 2.2vw, 17.5px);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.88);
  max-width: 620px;
  margin: 0 auto 28px;
}
.lp-cta {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.lp-cta-center {
  margin-top: 36px;
}
.lp-btn {
  display: inline-block;
  padding: 12px 26px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s, opacity 0.15s, background 0.15s;
}
.lp-btn:hover {
  transform: translateY(-1px);
  text-decoration: none;
}
.lp-btn-primary {
  background: #fff;
  color: #4f46e5;
}
.lp-btn-primary:hover {
  color: #4f46e5;
}
.lp-btn-ghost {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.45);
}
.lp-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}

/* Section */
.lp-section {
  padding: 60px 20px;
}
.lp-section-alt {
  background: #fff;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}
.lp-wrap {
  max-width: 1080px;
  margin: 0 auto;
}
.lp-section h2 {
  font-size: clamp(22px, 3.4vw, 28px);
  font-weight: 800;
  margin: 0 0 30px;
  text-align: center;
}

/* Cards */
.lp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px;
}
.lp-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 22px 20px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.lp-card:hover {
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  transform: translateY(-3px);
}
.lp-card-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  color: #fff;
  margin-bottom: 14px;
}
.lp-i-1 { background: linear-gradient(135deg, #4f46e5, #6366f1); }
.lp-i-2 { background: linear-gradient(135deg, #0ea5e9, #38bdf8); }
.lp-i-3 { background: linear-gradient(135deg, #10b981, #34d399); }
.lp-i-4 { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
.lp-card h3 {
  font-size: 16.5px;
  font-weight: 700;
  margin: 0 0 8px;
}
.lp-card p {
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
}

/* Steps */
.lp-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}
.lp-step {
  text-align: center;
  padding: 10px;
}
.lp-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: #fff;
  font-weight: 800;
  font-size: 17px;
  margin-bottom: 14px;
}
.lp-step h3 {
  font-size: 16.5px;
  font-weight: 700;
  margin: 0 0 8px;
}
.lp-step p {
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
}

/* Footer */
.lp-footer {
  padding: 26px 20px;
  background: #0f172a;
  color: #cbd5e1;
}
.lp-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
}
.lp-footer-inner > span:first-child {
  font-weight: 700;
  color: #fff;
}
.lp-dot-mini {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  margin-right: 4px;
}
.lp-muted {
  color: #94a3b8;
}
</style>
