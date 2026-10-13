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
        <span class="lp-pill">Sistem Jastip</span>
        <h1>
          Dari titipan masuk sampai tagihan lunas.<br />
          <span class="lp-grad">Satu alur, tanpa Excel.</span>
        </h1>
        <p class="lp-sub">
          Catat barang, kirim ke gudang, pantau pengiriman, lalu tagih customer
          lewat WhatsApp. Customer juga bisa cek paketnya sendiri hanya dengan
          nomor HP.
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

    <!-- MASALAH -->
    <section class="lp-section">
      <div class="lp-wrap">
        <h2>Bisnis jastip kacau biasanya mulai dari hal kecil</h2>
        <p class="lp-lead">
          Barangnya laku. Masalahnya muncul di belakang: catatan berserakan dan
          tagihan yang lupa ditagih.
        </p>
        <div class="lp-problem">
          <div class="lp-problem-col lp-problem-bad">
            <h3>Kalau serba manual</h3>
            <ul>
              <li>Chat &ldquo;paket aku mana?&rdquo; datang terus, tiap hari.</li>
              <li>Catatan belanja tersebar di chat, Excel, dan buku.</li>
              <li>Kurs dihitung manual, untung sering salah hitung.</li>
              <li>Niatnya nagih, tapi lupa. Uang tertahan berbulan-bulan.</li>
            </ul>
          </div>
          <div class="lp-problem-col lp-problem-good">
            <h3>Dengan Jastip</h3>
            <ul>
              <li>Semua titipan tercatat di satu dashboard.</li>
              <li>Customer cek sendiri, tanpa perlu tanya admin.</li>
              <li>Kurs ditarik otomatis, modal dan untung dihitung sistem.</li>
              <li>Blast tagihan: sekali klik, semua customer dapat invoice.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- FITUR -->
    <section class="lp-section lp-section-alt">
      <div class="lp-wrap">
        <h2>Yang bikin kerja lebih cepat</h2>
        <div class="lp-grid">
          <div class="lp-card">
            <div class="lp-card-icon lp-i-1">01</div>
            <h3>Blast tagihan WhatsApp</h3>
            <p>
              Kirim invoice ke semua customer yang belum lunas sekaligus. Tidak
              perlu buka chat satu per satu.
            </p>
          </div>
          <div class="lp-card">
            <div class="lp-card-icon lp-i-2">02</div>
            <h3>Lacak paket tanpa login</h3>
            <p>
              Customer masukkan nomor HP atau nomor resi, langsung lihat posisi
              barangnya. Riwayat per customer dan statusnya.
            </p>
          </div>
          <div class="lp-card">
            <div class="lp-card-icon lp-i-3">03</div>
            <h3>Hitung untung lintas mata uang</h3>
            <p>
              Belanja dari Thailand atau Jepang? Kurs ditarik otomatis. Modal
              dalam baht, untung tetap dalam rupiah.
            </p>
          </div>
          <div class="lp-card">
            <div class="lp-card-icon lp-i-4">04</div>
            <h3>Alur gudang yang jelas</h3>
            <p>
              Tiap barang punya tahap: draft, manifest, kirim, terima, dispatch,
              terjual. Tidak ada paket yang hilang jejak.
            </p>
          </div>
          <div class="lp-card">
            <div class="lp-card-icon lp-i-5">05</div>
            <h3>Invoice PDF otomatis</h3>
            <p>
              Rincian belanja per customer langsung jadi invoice PDF, lengkap
              dengan total dan sisa tagihan.
            </p>
          </div>
          <div class="lp-card">
            <div class="lp-card-icon lp-i-6">06</div>
            <h3>Kabar otomatis tiap tahap</h3>
            <p>
              Status barang berubah, customer dapat notifikasi WhatsApp. Tujuh
              pesan siap pakai, tinggal sesuaikan.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CARA KERJA -->
    <section class="lp-section">
      <div class="lp-wrap">
        <h2>Alurnya sesederhana ini</h2>
        <div class="lp-steps">
          <div class="lp-step">
            <span class="lp-step-num">1</span>
            <h3>Catat titipan</h3>
            <p>Masukkan barang, jumlah, harga modal dan harga jualnya.</p>
          </div>
          <div class="lp-step">
            <span class="lp-step-num">2</span>
            <h3>Kumpulkan jadi batch</h3>
            <p>Barang yang masih draft digabung, lalu dikirim ke gudang.</p>
          </div>
          <div class="lp-step">
            <span class="lp-step-num">3</span>
            <h3>Terima di gudang</h3>
            <p>Barang dicatat masuk, lengkap dengan foto dan barcode.</p>
          </div>
          <div class="lp-step">
            <span class="lp-step-num">4</span>
            <h3>Kirim ke customer</h3>
            <p>Pilih kurir, catat nomor resi, pantau pengirimannya.</p>
          </div>
          <div class="lp-step">
            <span class="lp-step-num">5</span>
            <h3>Tagih dan terima bayar</h3>
            <p>Kirim invoice, catat pembayaran, sisa tagihan tetap terlihat.</p>
          </div>
        </div>
        <div class="lp-cta lp-cta-center">
          <router-link class="lp-btn lp-btn-primary" to="/tracking">
            Lacak Paket Sekarang
          </router-link>
        </div>
      </div>
    </section>

    <!-- PERANGKAT -->
    <section class="lp-section lp-section-alt">
      <div class="lp-wrap">
        <h2>Dipakai dari mana saja</h2>
        <div class="lp-devices">
          <div class="lp-device">
            <h3>Dashboard web</h3>
            <p>
              Untuk admin dan pemilik. Kelola barang, tagihan, sesi belanja, dan
              laporan dari laptop. Cocok untuk kerja yang butuh layar lebar.
            </p>
          </div>
          <div class="lp-device">
            <h3>Aplikasi Android</h3>
            <p>
              Untuk tim di lapangan. Scan barang, perbarui status, dan kirim
              tagihan langsung dari ponsel, bahkan sambil jalan.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="lp-band">
      <div class="lp-wrap lp-band-inner">
        <h2>Mulai dari mencatat satu titipan</h2>
        <p>
          Sisanya biar sistem yang urus: dari barang masuk gudang sampai tagihan
          customer lunas.
        </p>
        <div class="lp-cta">
          <router-link class="lp-btn lp-btn-primary" to="/login">
            Masuk ke Akun
          </router-link>
          <router-link class="lp-btn lp-btn-ghost" to="/tracking">
            Lacak Paket
          </router-link>
        </div>
      </div>
    </section>

    <footer class="lp-footer">
      <div class="lp-wrap lp-footer-inner">
        <div class="lp-footer-brand">
          <span><span class="lp-dot-mini"></span> {{ brandName }}</span>
          <span
            v-if="brandAddress || brandPhone"
            class="lp-footer-contact"
          >
            <span v-if="brandAddress">{{ brandAddress }}</span>
            <span v-if="brandAddress && brandPhone"> · </span>
            <span v-if="brandPhone">{{ brandPhone }}</span>
          </span>
        </div>
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
      brandAddress: null,
      brandPhone: null,
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
      return `${this.brandName} — Sistem Jastip: Catat, Kirim, Tagih, Lacak`;
    },
  },
  methods: {
    async loadIdentity() {
      const id = await getIdentity();
      if (id) {
        if (id.identity_logo_path) this.brandLogo = id.identity_logo_path;
        if (id.identity_name) this.brandName = id.identity_name;
        if (id.identity_address) this.brandAddress = id.identity_address;
        if (id.identity_phone) this.brandPhone = id.identity_phone;
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
  margin: 0 0 14px;
  text-align: center;
}
.lp-lead {
  text-align: center;
  color: #64748b;
  font-size: 15.5px;
  line-height: 1.6;
  max-width: 620px;
  margin: 0 auto 34px;
}

/* Masalah (2 kolom) */
.lp-problem {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}
.lp-problem-col {
  border-radius: 14px;
  padding: 22px 24px;
  border: 1px solid #e2e8f0;
  background: #fff;
}
.lp-problem-col h3 {
  font-size: 16.5px;
  font-weight: 700;
  margin: 0 0 14px;
}
.lp-problem-bad h3 {
  color: #b91c1c;
}
.lp-problem-good h3 {
  color: #047857;
}
.lp-problem-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.lp-problem-col li {
  position: relative;
  padding-left: 26px;
  margin-bottom: 11px;
  font-size: 14.5px;
  line-height: 1.55;
  color: #475569;
}
.lp-problem-col li:last-child {
  margin-bottom: 0;
}
.lp-problem-bad li::before {
  content: '\2715';
  position: absolute;
  left: 0;
  top: 0;
  color: #dc2626;
  font-weight: 700;
}
.lp-problem-good li::before {
  content: '\2713';
  position: absolute;
  left: 0;
  top: 0;
  color: #059669;
  font-weight: 700;
}

/* Cards */
.lp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}
@media (min-width: 900px) {
  /* 6 kartu fitur -> 3 kolom x 2 baris, biar rapi & seimbang */
  .lp-grid {
    grid-template-columns: repeat(3, 1fr);
  }
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
.lp-i-5 { background: linear-gradient(135deg, #ec4899, #f472b6); }
.lp-i-6 { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }
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
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
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

/* Perangkat */
.lp-devices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}
.lp-device {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
}
.lp-device h3 {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 10px;
}
.lp-device p {
  font-size: 14.5px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
}

/* CTA band */
.lp-band {
  background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
  color: #fff;
  padding: 60px 20px;
}
.lp-band-inner {
  text-align: center;
}
.lp-band h2 {
  font-size: clamp(22px, 3.4vw, 28px);
  font-weight: 800;
  margin: 0 0 12px;
}
.lp-band p {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  max-width: 560px;
  margin: 0 auto 28px;
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
.lp-footer-brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.lp-footer-brand > span:first-child {
  font-weight: 700;
  color: #fff;
}
.lp-footer-contact {
  font-size: 13px;
  color: #94a3b8;
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
