<template>
  <div class="lp">
    <NavPublic />

    <!-- HERO -->
    <header class="lp-hero">
      <div class="lp-hero-glow" aria-hidden="true"></div>
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
        <span class="lp-pill">Jasa Titip Belanja &middot; Operasional &amp; Pelacakan</span>
        <h1>
          Titip belanja tanpa ragu,<br />
          <span class="lp-grad">terlacak dari belanja sampai tiba.</span>
        </h1>
        <p class="lp-sub">
          Satu sistem untuk mencatat setiap barang, tagihan, dan pengiriman   dari
          barang dibeli, masuk gudang, sampai diterima customer. Pantau statusnya
          kapan saja lewat nomor resi atau nomor HP.
        </p>
        <div class="lp-cta">
          <router-link class="lp-btn lp-btn-primary" to="/tracking">
            Lacak Paket
          </router-link>
          <router-link class="lp-btn lp-btn-ghost" to="/register-tenant">
            Daftarkan Toko
          </router-link>
          <router-link class="lp-btn lp-btn-ghost" to="/login">
            Masuk ke Akun
          </router-link>
        </div>
        <ul class="lp-trust">
          <li><span class="lp-tick">&#10003;</span> Multi-toko &amp; cabang</li>
          <li><span class="lp-tick">&#10003;</span> Invoice WhatsApp</li>
          <li><span class="lp-tick">&#10003;</span> Lacak via resi / nomor HP</li>
          <li><span class="lp-tick">&#10003;</span> Data tiap toko terisolasi</li>
        </ul>
      </div>
    </header>

    <!-- PAIN POINTS -->
    <section class="lp-section lp-section-pain">
      <div class="lp-wrap">
        <p class="lp-kicker">Yang biasa kejadian</p>
        <h2>Makin ramai order, makin gampang ada yang kelewat</h2>
        <div class="lp-pain-grid">
          <div class="lp-pain">
            <span class="lp-pain-icon" aria-hidden="true">&#128221;</span>
            <h3>Order tercecer di chat</h3>
            <p>
              Dicatat di notes, tagihan dihitung di kalkulator, status dijawab
              satu-satu   susah dilacak saat order menumpuk.
            </p>
          </div>
          <div class="lp-pain">
            <span class="lp-pain-icon" aria-hidden="true">&#129518;</span>
            <h3>Salah hitung tagihan</h3>
            <p>
              Harga barang, ongkir, dan fee dihitung manual. Rawan keliru dan
              membuat customer ragu.
            </p>
          </div>
          <div class="lp-pain">
            <span class="lp-pain-icon" aria-hidden="true">&#128172;</span>
            <h3>"Orderku sampai mana?"</h3>
            <p>
              Pertanyaan yang sama berulang tiap hari, karena customer tidak
              punya cara memantau sendiri.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FITUR UNGGULAN -->
        <section class="lp-section lp-section-alt">
          <div class="lp-wrap">
            <p class="lp-kicker">Kenapa Jastip</p>
            <h2>Yang membuat operasional jastip rapi</h2>
            <div class="lp-grid">
              <div class="lp-card">
                <div class="lp-card-icon lp-i-1" aria-hidden="true">&#128230;</div>
                <h3>Alur Gudang Lengkap</h3>
                <p>
                  Barang masuk gudang, disisir per pesanan, disiapkan manifest
                  kirim, sampai penanganan barang bermasalah   tercatat berurutan,
                  tanpa langkah yang terlewat.
                </p>
              </div>
              <div class="lp-card">
                <div class="lp-card-icon lp-i-2" aria-hidden="true">&#128270;</div>
                <h3>Pelacakan Tanpa Login</h3>
                <p>
                  Customer cukup memasukkan nomor resi atau nomor HP   melihat
                  status barangnya kapan saja tanpa perlu punya akun.
                </p>
              </div>
              <div class="lp-card">
                <div class="lp-card-icon lp-i-3" aria-hidden="true">&#129534;</div>
                <h3>Invoice & Tagihan ke WhatsApp</h3>
                <p>
                  Tagihan per customer dihitung otomatis dari barang yang dibeli,
                  lalu dikirim sebagai invoice ke WhatsApp   satu per satu atau
                  sekaligus.
                </p>
              </div>
              <div class="lp-card">
                <div class="lp-card-icon lp-i-4" aria-hidden="true">&#128177;</div>
                <h3>Multi Mata Uang</h3>
                <p>
                  Harga modal dan harga jual dicatat dalam mata uang asal dan
                  Rupiah sekaligus   untung per barang tetap terlihat meski kurs
                  berubah.
                </p>
              </div>
              <div class="lp-card">
                <div class="lp-card-icon lp-i-5" aria-hidden="true">&#127978;</div>
                <h3>Multi Toko & Cabang</h3>
                <p>
                  Jalankan beberapa toko atau cabang dalam satu sistem. Data setiap
                  toko terpisah   tidak tercampur, tidak terlihat toko lain.
                </p>
              </div>
              <div class="lp-card">
                <div class="lp-card-icon lp-i-6" aria-hidden="true">&#127991;</div>
                <h3>Barcode & Foto Barang</h3>
                <p>
                  Setiap barang punya barcode dan fotonya sendiri. Jadi barang yang
                  mirip tetap bisa dibedakan dengan pasti.
                </p>
              </div>
              <div class="lp-card">
                <div class="lp-card-icon lp-i-7" aria-hidden="true">&#128197;</div>
                <h3>Akses Pengguna Dinamis (RBAC)</h3>
                <p>
                  Atur peran per pengguna: Admin, Gudang, Kasir, Driver, dll. Tiap
                  peran hanya akses menu yang relevan — aman, rapi, tanpa tumpang
                  tindih tugas.
                </p>
              </div>
              <div class="lp-card">
                <div class="lp-card-icon lp-i-8" aria-hidden="true">&#128241;</div>
                <h3>Branding Per Toko (White-label)</h3>
                <p>
                  Logo, nama identitas, warna tema, favicon — diatur per tenant.
                  Customer melihat brand toko Anda, bukan brand platform.
                </p>
              </div>
              <div class="lp-card">
                <div class="lp-card-icon lp-i-9" aria-hidden="true">&#128206;</div>
                <h3>Manajemen Stok Real-time</h3>
                <p>
                  Stok otomatis berkurang saat barang dikirim, bertambah saat
                  return/masuk gudang. Alert stok minim, riwayat mutasi lengkap.
                </p>
              </div>
              <div class="lp-card">
                <div class="lp-card-icon lp-i-10" aria-hidden="true">&#128221;</div>
                <h3>Laporan & Dashboard Lengkap</h3>
                <p>
                  Penjualan, keuntungan, hutang/piutong, performa kurir, aging
                  tagihan — semuanya dalam satu dashboard tanpa ekspor manual.
                </p>
              </div>
              <div class="lp-card">
                <div class="lp-card-icon lp-i-11" aria-hidden="true">&#128274;</div>
                <h3>Integrasi Kurir & Otomatis Resi</h3>
                <p>
                  Generate nomor resi & cetak label otomatis. Cek tarif &
                  booking pickup multi-kurir (JNE, J&T, Sicepat, dll) dari dalam
                  sistem.
                </p>
              </div>
              <div class="lp-card">
                <div class="lp-card-icon lp-i-12" aria-hidden="true">&#128228;</div>
                <h3>Notifikasi Otomatis</h3>
                <p>
                  WhatsApp & Email: konfirmasi order, barang masuk gudang,
                  dikirim, sampai, tagihan jatuh tempo — tanpa ketik manual.
                </p>
              </div>
            </div>
          </div>
        </section>

    <!-- CARA KERJA -->
    <section class="lp-section">
      <div class="lp-wrap">
        <p class="lp-kicker">Cara kerja</p>
        <h2>Empat langkah, terlacak dari awal</h2>
        <div class="lp-steps">
          <div class="lp-step">
            <span class="lp-step-num">1</span>
            <h3>Titip Belanja</h3>
            <p>Barang dibelikan sesuai permintaan dan dicatat di sistem.</p>
          </div>
          <div class="lp-step">
            <span class="lp-step-num">2</span>
            <h3>Masuk Gudang</h3>
            <p>Barang di-scan, diberi barcode &amp; foto, status diperbarui.</p>
          </div>
          <div class="lp-step">
            <span class="lp-step-num">3</span>
            <h3>Disiapkan &amp; Dikirim</h3>
            <p>Barang disisir per pesanan, lalu dikirim lewat kurir.</p>
          </div>
          <div class="lp-step">
            <span class="lp-step-num">4</span>
            <h3>Dilacak Customer</h3>
            <p>Customer memantau status lewat nomor resi atau nomor HP.</p>
          </div>
        </div>
        <div class="lp-cta lp-cta-center">
          <router-link class="lp-btn lp-btn-primary" to="/tracking">
            Lacak Paket Sekarang
          </router-link>
        </div>
      </div>
    </section>

    <!-- KEAMANAN / TRUST -->
    <section class="lp-section lp-section-dark">
      <div class="lp-wrap lp-trust-wrap">
        <div class="lp-trust-text">
          <p class="lp-kicker lp-kicker-light">Keamanan data</p>
          <h2>Data setiap toko benar-benar terpisah</h2>
          <p>
            Jastip dibangun sebagai sistem multi-toko. Setiap toko atau cabang
            punya ruang datanya sendiri   order, customer, dan laporan tidak
            pernah bercampur dengan toko lain. Customer hanya melihat status
            paketnya sendiri lewat nomor resi atau nomor HP.
          </p>
          <ul class="lp-bullets">
            <li>Isolasi data di tingkat sistem, bukan sekadar penyaringan tampilan.</li>
            <li>Tiap toko bisa memakai nama, logo, dan warna sendiri.</li>
            <li>Hak akses pengguna diatur per toko.</li>
          </ul>
        </div>
        <div class="lp-trust-badge">
          <div class="lp-badge-item">
            <span class="lp-badge-num">01</span>
            <span class="lp-badge-lbl">Data terpisah per toko</span>
          </div>
          <div class="lp-badge-item">
            <span class="lp-badge-num">02</span>
            <span class="lp-badge-lbl">Branding sendiri</span>
          </div>
          <div class="lp-badge-item">
            <span class="lp-badge-num">03</span>
            <span class="lp-badge-lbl">Akses per pengguna</span>
          </div>
        </div>
      </div>
    </section>

    <!-- USE CASE / TESTIMONI -->
    <section class="lp-section lp-section-alt">
      <div class="lp-wrap">
        <p class="lp-kicker">Kasus nyata</p>
        <h2>Bagaimana toko lain menghemat waktu dengan Jastip</h2>
        <div class="lp-grid lp-grid-3">
          <div class="lp-card lp-card-case">
            <div class="lp-case-tag">Toko Fashion Online</div>
            <h3>"Dulu 3 jam hitung tagihan manual, sekarang 5 menit"</h3>
            <p>
              Order 200+/hari. Sebelumnya tagihan dihitung di Excel, kirim WA
              satu-satu. Sekarang invoice tergenerate otomatis dari barang yang
              dibeli, kirim massal ke WA pelanggan. Tim kasir hanya cek & tekan
              kirim.
            </p>
            <div class="lp-case-meta">
              <span>&#128197; 3 orang</span>
              <span>&#127978; 1 toko</span>
              <span>&#9889; 85% lebih cepat</span>
            </div>
          </div>
          <div class="lp-card lp-card-case">
            <div class="lp-case-tag">Jastiper Multi-Cabang</div>
            <h3>"Stok & order 3 cabang terpisah rapi, tidak bercampur"</h3>
            <p>
              Setiap cabang punya user gudang, kasir, driver sendiri. Data
              order, customer, stok isolasi total. Owner cek dashboard gabungan
              real-time tanpa minta laporan ke masing-masing cabang.
            </p>
            <div class="lp-case-meta">
              <span>&#128197; 12 orang</span>
              <span>&#127978; 3 cabang</span>
              <span>&#9889; 0 kerusakan data</span>
            </div>
          </div>
          <div class="lp-card lp-card-case">
            <div class="lp-case-tag">Importir Aksesoris</div>
            <h3>"Multi-mata uang otomatis, untung per barang jelas"</h3>
            <p>
              Beli dalam USD/CNY, jual dalam IDR. Kurs harian diambil otomatis.
              Modal & untung per item terlihat real-time — tidak perlu ekspor
              ke spreadsheet untuk hitung ulang saat kurs berubah.
            </p>
            <div class="lp-case-meta">
              <span>&#128197; 5 orang</span>
              <span>&#127978; 1 toko</span>
              <span>&#9889; 3 mata uang</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- UNTUK SIAPA -->
    <section class="lp-section">
      <div class="lp-wrap">
        <p class="lp-kicker">Cocok untuk</p>
        <h2>Siapa pun yang mengurus titip belanja</h2>
        <div class="lp-grid lp-grid-3">
          <div class="lp-card lp-card-plain">
            <h3>Jastiper perorangan</h3>
            <p>
              Baru mulai dan ingin catatan rapi sejak order pertama   tanpa
              perlu membuka banyak aplikasi.
            </p>
          </div>
          <div class="lp-card lp-card-plain">
            <h3>Tim &amp; toko ramai</h3>
            <p>
              Beberapa orang mengerjakan bersamaan. Setiap pengguna punya akses
              dan perannya sendiri.
            </p>
          </div>
          <div class="lp-card lp-card-plain">
            <h3>Beberapa cabang</h3>
            <p>
              Kelola lebih dari satu toko atau cabang dalam satu sistem, data
              tetap terpisah rapi.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- PAKET LANGGANAN (PRICING) -->
    <section class="lp-section lp-section-alt" id="pricing">
      <div class="lp-wrap">
        <p class="lp-kicker">Paket &amp; harga</p>
        <h2>Pilih paket sesuai skala usaha Anda</h2>
        <p class="lp-lead">
          Mulai gratis, upgrade kapan saja saat operasional makin ramai. Semua
          paket sudah termasuk pelacakan paket dan manajemen order.
        </p>
        <div v-if="plansLoading" class="lp-plans-loading">Memuat paket…</div>
        <div v-else-if="plans.length" class="lp-grid lp-grid-3 lp-plans">
          <div
            class="lp-card lp-card-plain lp-plan"
            :class="{ 'lp-plan-popular': plan.is_popular }"
            v-for="plan in plans"
            :key="plan.code"
          >
            <span v-if="plan.is_popular" class="lp-plan-badge">Paling Populer</span>
            <h3>{{ plan.name }}</h3>
            <p class="lp-plan-price">
              {{ formatPrice(plan) }}
              <small v-if="plan.billing_cycle">/{{ plan.billing_cycle === 'yearly' ? 'tahun' : 'bulan' }}</small>
            </p>
            <p class="lp-plan-desc" v-if="plan.description">{{ plan.description }}</p>
            <ul class="lp-plan-features">
              <li v-if="plan.max_users">Hingga {{ plan.max_users }} pengguna</li>
              <li v-if="plan.max_customers">Hingga {{ plan.max_customers }} customer</li>
              <li v-if="plan.max_warehouses">Hingga {{ plan.max_warehouses }} gudang</li>
              <li v-if="plan.max_products">Hingga {{ plan.max_products }} produk</li>
              <li v-for="(feat, idx) in plan.features_enabled" :key="idx">
                {{ featureLabel(feat) }}
              </li>
            </ul>
            <router-link class="lp-btn lp-btn-primary lp-plan-cta" to="/register-tenant">
              Mulai Sekarang
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA AKHIR -->
    <section class="lp-cta-final">
      <div class="lp-wrap">
        <h2>Rapikan operasional jastip Anda mulai hari ini</h2>
        <p>
          Daftarkan toko Anda, lalu bagikan halaman pelacakan ke customer  
          mereka bisa memantau sendiri tanpa perlu bertanya lagi.
        </p>
        <div class="lp-cta">
          <router-link class="lp-btn lp-btn-primary" to="/register-tenant">
            Daftarkan Toko
          </router-link>
          <router-link class="lp-btn lp-btn-outline" to="/login">
            Masuk ke Akun
          </router-link>
        </div>
      </div>
    </section>

    <footer class="lp-footer">
      <div class="lp-wrap lp-footer-inner">
        <span><span class="lp-dot-mini"></span> {{ brandName }}</span>
        <span class="lp-muted" v-if="brandAddress">{{ brandAddress }}</span>
        <span class="lp-muted" v-if="brandEmail">
          <a :href="'mailto:' + brandEmail">{{ brandEmail }}</a>
        </span>
        <span class="lp-muted">&copy; {{ year }}   Jasa Titip Belanja</span>
      </div>
    </footer>
  </div>
</template>

<script>
import NavPublic from './NavPublic.vue';
import { getIdentity } from '../../resource/Identity';
import { getPublicSubscriptionPlan } from '../../resource/MstSubscriptionPlan';
import { applyPublicSeo, releasePublicSeo } from '../../resource/PublicSeo';

export default {
  name: 'LandingPage',
  components: { NavPublic },
  data() {
    return {
      brandLogo: null,
      brandName: 'Jastip',
      brandAddress: null,
      brandEmail: null,
      plans: [],
      plansLoading: true,
    };
  },
  created() {
    // Non-blocking: render langsung dengan fallback, identity menyusul saat
    // resolve (lihat getIdentity yang di-cache di resource/Identity.js).
    this.loadIdentity();
    this.loadPlans();
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
      return `${this.brandName}   Jasa Titip Belanja & Lacak Paket`;
    },
  },
  methods: {
    async loadIdentity() {
      const id = await getIdentity();
      if (id) {
        if (id.identity_logo_path) this.brandLogo = id.identity_logo_path;
        if (id.identity_name) this.brandName = id.identity_name;
        if (id.identity_address) this.brandAddress = id.identity_address;
        if (id.identity_email) this.brandEmail = id.identity_email;
      }
      // Judul ikut brand runtime; applyTabIdentity() tidak menimpa judul
      // ber-flag data-seo="dynamic".
      applyPublicSeo({ title: this.seoTitle, path: '/landing' });
    },
    async loadPlans() {
      this.plansLoading = true;
      const result = await getPublicSubscriptionPlan();
      this.plansLoading = false;
      if (result && !result.error && Array.isArray(result.data)) {
        this.plans = result.data;
      }
    },
    formatPrice(plan) {
      const price = Number(plan.price || 0);
      if (!price) return 'Gratis';
      try {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: plan.currency || 'IDR',
          maximumFractionDigits: 0,
        }).format(price);
      } catch (e) {
        return `${plan.currency || 'IDR'} ${price.toLocaleString('id-ID')}`;
      }
    },
    featureLabel(feat) {
      const labels = {
        courier: 'Integrasi kurir',
        tracking: 'Pelacakan paket',
        whatsapp: 'Notifikasi WhatsApp',
        report: 'Laporan lengkap',
        api: 'Akses API',
        reports: 'Laporan lanjutan',
        all: 'Semua fitur',
      };
      return labels[feat] || feat;
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
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
  color: #fff;
  padding: 72px 20px 84px;
}
.lp-hero-glow {
  position: absolute;
  top: -180px;
  right: -120px;
  width: 520px;
  height: 520px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0) 65%
  );
  pointer-events: none;
}
.lp-hero-inner {
  position: relative;
  max-width: 820px;
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
  font-size: clamp(28px, 5vw, 46px);
  line-height: 1.18;
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -0.01em;
}
.lp-grad {
  color: #e0f2fe;
}
.lp-sub {
  font-size: clamp(15px, 2.2vw, 18px);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  max-width: 640px;
  margin: 0 auto 28px;
}
.lp-cta {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.lp-cta-center {
  margin-top: 40px;
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
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.18);
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
.lp-btn-outline {
  background: transparent;
  color: #4f46e5;
  border: 1.5px solid #4f46e5;
}
.lp-btn-outline:hover {
  background: rgba(79, 70, 229, 0.06);
  color: #4f46e5;
}
.lp-trust {
  list-style: none;
  display: flex;
  gap: 10px 22px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 28px 0 0;
  padding: 0;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.92);
}
.lp-trust li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.lp-tick {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  font-size: 11px;
  font-weight: 700;
}

/* Section */
.lp-section {
  padding: 68px 20px;
}
.lp-section-alt {
  background: #fff;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}
.lp-section-pain {
  background: #f8fafc;
}
.lp-section-dark {
  background: #0f172a;
  color: #e2e8f0;
}
.lp-wrap {
  max-width: 1080px;
  margin: 0 auto;
}
.lp-kicker {
  text-align: center;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4f46e5;
  margin: 0 0 8px;
}
.lp-kicker-light {
  color: #7dd3fc;
}
.lp-section h2 {
  font-size: clamp(22px, 3.4vw, 30px);
  font-weight: 800;
  margin: 0 0 34px;
  text-align: center;
  letter-spacing: -0.01em;
}

/* Pain points */
.lp-pain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}
.lp-pain {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #f59e0b;
  border-radius: 12px;
  padding: 22px 20px;
}
.lp-pain-icon {
  font-size: 24px;
  line-height: 1;
  display: block;
  margin-bottom: 12px;
}
.lp-pain h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px;
}
.lp-pain p {
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
}

/* Cards */
.lp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}
.lp-grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.lp-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px 22px;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
}
.lp-card:hover {
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.09);
  transform: translateY(-3px);
  border-color: #c7d2fe;
}
.lp-card-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #fff;
  margin-bottom: 16px;
}
.lp-i-1 { background: linear-gradient(135deg, #4f46e5, #6366f1); }
.lp-i-2 { background: linear-gradient(135deg, #0ea5e9, #38bdf8); }
.lp-i-3 { background: linear-gradient(135deg, #10b981, #34d399); }
.lp-i-4 { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
.lp-i-5 { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }
.lp-i-6 { background: linear-gradient(135deg, #ef4444, #f87171); }
.lp-i-7 { background: linear-gradient(135deg, #ec4899, #f472b6); }
.lp-i-8 { background: linear-gradient(135deg, #14b8a6, #2dd4bf); }
.lp-i-9 { background: linear-gradient(135deg, #f97316, #fb923c); }
.lp-i-10 { background: linear-gradient(135deg, #6366f1, #818cf8); }
.lp-i-11 { background: linear-gradient(135deg, #84cc16, #a3e635); }
.lp-i-12 { background: linear-gradient(135deg, #06b6d4, #22d3ee); }
.lp-card h3 {
  font-size: 16.5px;
  font-weight: 700;
  margin: 0 0 8px;
}
.lp-card p {
  font-size: 14px;
  line-height: 1.62;
  color: #64748b;
  margin: 0;
}
.lp-card-plain {
  border-top: 3px solid #4f46e5;
}

/* Pricing / Paket Langganan */
.lp-lead {
  max-width: 640px;
  margin: 10px auto 0;
  text-align: center;
  color: #64748b;
  font-size: 15px;
  line-height: 1.6;
}
.lp-plans-loading {
  text-align: center;
  color: #94a3b8;
  padding: 24px 0;
}
.lp-plans {
  margin-top: 28px;
}
.lp-plan {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 26px 22px;
}
.lp-plan-popular {
  border-top-color: #f59e0b;
  box-shadow: 0 18px 40px rgba(79, 70, 229, 0.16);
  transform: translateY(-4px);
}
.lp-plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 4px 12px;
  border-radius: 999px;
  white-space: nowrap;
}
.lp-plan-price {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin: 12px 0 6px;
}
.lp-plan-price small {
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
}
.lp-plan-desc {
  font-size: 13.5px;
  color: #64748b;
  margin: 0 0 14px;
}
.lp-plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  flex-grow: 1;
}
.lp-plan-features li {
  position: relative;
  padding-left: 22px;
  font-size: 13.5px;
  color: #475569;
  line-height: 1.9;
}
.lp-plan-features li::before {
  content: '\2713';
  position: absolute;
  left: 0;
  color: #4f46e5;
  font-weight: 700;
}
.lp-plan-cta {
  text-align: center;
  display: block;
}

/* Steps */
.lp-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
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
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: #fff;
  font-weight: 800;
  font-size: 17px;
  margin-bottom: 14px;
  box-shadow: 0 8px 18px rgba(79, 70, 229, 0.28);
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

/* Trust section */
.lp-trust-wrap {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  align-items: center;
}
.lp-trust-text h2 {
  text-align: left;
  margin-bottom: 16px;
}
.lp-trust-text p {
  font-size: 15px;
  line-height: 1.7;
  color: #94a3b8;
  margin: 0 0 18px;
}
.lp-bullets {
  list-style: none;
  margin: 0;
  padding: 0;
}
.lp-bullets li {
  position: relative;
  padding-left: 26px;
  margin-bottom: 10px;
  font-size: 14.5px;
  color: #cbd5e1;
}
.lp-bullets li::before {
  content: '\2713';
  position: absolute;
  left: 0;
  color: #34d399;
  font-weight: 700;
}
.lp-trust-badge {
  display: grid;
  gap: 12px;
}
.lp-badge-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 16px 18px;
}
.lp-badge-num {
  font-size: 20px;
  font-weight: 800;
  color: #7dd3fc;
  min-width: 34px;
}
.lp-badge-lbl {
  font-size: 14.5px;
  color: #e2e8f0;
}

/* Final CTA */
.lp-cta-final {
  background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
  color: #fff;
  padding: 66px 20px;
  text-align: center;
}
.lp-cta-final h2 {
  font-size: clamp(22px, 3.4vw, 30px);
  font-weight: 800;
  margin: 0 0 12px;
}
.lp-cta-final p {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  max-width: 620px;
  margin: 0 auto 26px;
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
.lp-muted a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.lp-muted a:hover {
  color: #fff;
}

/* Use Case / Case Study Cards */
.lp-card-case {
  border-top: 3px solid #0ea5e9;
  background: #f8fafc;
}
.lp-case-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #0ea5e9;
  background: rgba(14, 165, 233, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
}
.lp-card-case h3 {
  font-size: 15.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
  margin: 0 0 10px;
}
.lp-card-case p {
  font-size: 13.5px;
  line-height: 1.65;
  color: #475569;
  margin: 0 0 14px;
}
.lp-case-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #64748b;
}
.lp-case-meta span {
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 3px 10px;
  border-radius: 6px;
}

@media (max-width: 720px) {
  .lp-trust-wrap {
    grid-template-columns: 1fr;
    gap: 26px;
  }
  .lp-trust-text h2 {
    text-align: center;
  }
  .lp-hero {
    padding: 56px 18px 64px;
  }
  .lp-section {
    padding: 54px 18px;
  }
}
</style>
