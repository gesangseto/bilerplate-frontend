<template>
  <div class="lp">
    <NavPublic />

    <!-- HERO -->
    <header class="lp-hero">
      <div class="lp-hero-inner">
        <div
          class="lp-hero-logo"
          :class="{ 'is-placeholder': !brandLogo, 'is-clickable': !!brandLogo }"
          :role="brandLogo ? 'button' : null"
          :tabindex="brandLogo ? 0 : null"
          :title="brandLogo ? 'Klik untuk lihat logo lebih besar' : null"
          :aria-label="brandLogo ? `Perbesar logo ${brandName}` : null"
          @click="brandLogo && (logoZoom = true)"
          @keydown.enter.prevent="brandLogo && (logoZoom = true)"
          @keydown.space.prevent="brandLogo && (logoZoom = true)"
        >
          <img
            v-if="brandLogo"
            :src="brandLogo"
            width="76"
            height="76"
            fetchpriority="high"
            decoding="async"
            :alt="`Logo ${brandName}`"
          />
          <span v-else class="lp-hero-initial" aria-hidden="true">{{
            brandInitial
          }}</span>
        </div>

        <!-- Lightbox logo: klik logo untuk melihat versi besar -->
        <transition name="lp-fade">
          <div
            v-if="logoZoom && brandLogo"
            class="lp-logo-modal"
            role="dialog"
            aria-modal="true"
            :aria-label="`Logo ${brandName}`"
            @click.self="logoZoom = false"
          >
            <button
              type="button"
              class="lp-logo-modal__close"
              aria-label="Tutup"
              @click="logoZoom = false"
            >
              ×
            </button>
            <img
              class="lp-logo-modal__img"
              :src="brandLogo"
              :alt="`Logo ${brandName}`"
            />
          </div>
        </transition>
        <span class="lp-pill">Jastip Thailand &amp; All Brand</span>
        <h1>
          Titip apa aja dari Bangkok &amp; seluruh dunia —
          <span class="lp-grad">aman sampai rumah.</span>
        </h1>
        <p class="lp-sub">
          {{ brandName }} bantu belanjain skincare, fashion, snack, sampai
          barang branded. Harga transparan, barang dilacak, tagihan rapi. Order
          tinggal chat.
        </p>
        <div class="lp-cta">
          <a
            v-if="waUrl"
            class="lp-btn lp-btn-primary"
            :href="waUrl"
            target="_blank"
            rel="noopener"
          >
            Order via WhatsApp
          </a>
          <router-link class="lp-btn lp-btn-ghost" to="/tracking">
            Lacak Paket
          </router-link>
          <button
            class="lp-btn lp-btn-ghost"
            type="button"
            @click="scrollTo('cara-order')"
          >
            Cara Order
          </button>
        </div>
        <ul class="lp-trust" aria-label="Keunggulan layanan">
          <li>Harga transparan</li>
          <li>Barang original</li>
          <li>Lacak real-time</li>
          <li>Admin responsif</li>
        </ul>
        <!-- Sosial: hanya muncul kalau link di sys_configuration_mst terisi -->
        <SocialIcons v-if="socialLinks.length" :links="socialLinks" class="lp-hero-social" />
      </div>
    </header>

    <main>
      <!-- KATEGORI -->
      <section id="kategori" class="lp-section">
        <div class="lp-wrap">
          <h2>Titip apa aja? Semua bisa.</h2>
          <p class="lp-lead">
            Dari yang lagi viral sampai barang langka — kirim link atau
            fotonya, kami carikan.
          </p>
          <div class="lp-grid">
            <article
              v-for="(cat, i) in categories"
              :key="cat.title"
              class="lp-card"
            >
              <div class="lp-card-icon" :class="`lp-i-${(i % 6) + 1}`">
                {{ String(i + 1).padStart(2, '0') }}
              </div>
              <h3>{{ cat.title }}</h3>
              <p>{{ cat.desc }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- KENAPA PILIH KAMI -->
      <section id="kenapa" class="lp-section lp-section-alt">
        <div class="lp-wrap">
          <h2>Kenapa titip di {{ brandName }}?</h2>
          <p class="lp-lead">
            Bukan cuma belanjain — semua tercatat dan bisa kamu pantau.
          </p>
          <div class="lp-grid">
            <article
              v-for="(item, i) in reasons"
              :key="item.title"
              class="lp-card"
            >
              <div class="lp-card-icon" :class="`lp-i-${(i % 6) + 1}`">
                {{ String(i + 1).padStart(2, '0') }}
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- CARA ORDER -->
      <section id="cara-order" class="lp-section">
        <div class="lp-wrap">
          <h2>Cara order, gampang.</h2>
          <p class="lp-lead">
            Enam langkah dari chat pertama sampai paket tiba di rumahmu.
          </p>
          <ol class="lp-steps">
            <li v-for="(step, i) in steps" :key="step.title" class="lp-step">
              <span class="lp-step-num" aria-hidden="true">{{ i + 1 }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </li>
          </ol>
          <div class="lp-cta lp-cta-center">
            <router-link class="lp-btn lp-btn-primary" to="/tracking">
              Lacak Paket Sekarang
            </router-link>
          </div>
        </div>
      </section>

      <!-- TESTIMONI -->
      <section id="testimoni" class="lp-section lp-section-alt">
        <div class="lp-wrap">
          <h2>Kata customer</h2>
          <p class="lp-lead">
            Cerita dari yang sudah titip lewat {{ brandName }}.
          </p>
          <div class="lp-grid">
            <article
              v-for="t in testimonials"
              :key="t.name"
              class="lp-quote"
            >
              <p class="lp-quote-text">&ldquo;{{ t.text }}&rdquo;</p>
              <footer class="lp-quote-by">
                <span class="lp-quote-name">{{ t.name }}</span>
                <span class="lp-quote-city">{{ t.city }}</span>
              </footer>
            </article>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section id="faq" class="lp-section">
        <div class="lp-wrap lp-wrap-narrow">
          <h2>Pertanyaan yang sering ditanya</h2>
          <p class="lp-lead">
            Belum ketemu jawabannya? Chat admin langsung.
          </p>
          <div class="lp-faq">
            <article
              v-for="(faq, i) in faqs"
              :key="faq.q"
              class="lp-faq-item"
              :class="{ 'is-open': openFaq === i }"
            >
              <h3 class="lp-faq-q">
                <button
                  type="button"
                  class="lp-faq-btn"
                  :aria-expanded="openFaq === i ? 'true' : 'false'"
                  @click="toggleFaq(i)"
                >
                  <span>{{ faq.q }}</span>
                  <span class="lp-faq-sign" aria-hidden="true">{{
                    openFaq === i ? '−' : '+'
                  }}</span>
                </button>
              </h3>
              <div v-show="openFaq === i" class="lp-faq-a">
                <p>{{ faq.a }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="lp-band">
        <div class="lp-wrap lp-band-inner">
          <h2>Siap titip barang impianmu?</h2>
          <p>
            Chat sekarang, kirim link barangnya, sisanya biar kami urus — dari
            Bangkok sampai depan pintu rumahmu.
          </p>
          <div class="lp-cta">
            <a
              v-if="waUrl"
              class="lp-btn lp-btn-primary"
              :href="waUrl"
              target="_blank"
              rel="noopener"
            >
              Order via WhatsApp
            </a>
            <router-link class="lp-btn lp-btn-ghost" to="/tracking">
              Lacak Paket
            </router-link>
          </div>
        </div>
      </section>
    </main>

    <footer id="kontak" class="lp-footer">
      <div class="lp-wrap lp-footer-inner">
        <div class="lp-footer-brand">
          <span class="lp-footer-name">
            <span class="lp-dot-mini" aria-hidden="true"></span> {{ brandName }}
          </span>
          <span class="lp-footer-contact">
            <template v-if="brandAddress || brandPhone">
              <span v-if="brandAddress">{{ brandAddress }}</span>
              <span v-if="brandAddress && brandPhone" aria-hidden="true">
                ·
              </span>
              <a
                v-if="brandPhone"
                class="lp-footer-link"
                :href="waUrl || '#'"
                target="_blank"
                rel="noopener"
                >{{ brandPhone }}</a
              >
            </template>
          </span>
        </div>
        <span class="lp-muted">
          © {{ year }} — Jastip Thailand &amp; All Brand
        </span>
      </div>
      <!-- Sosial di footer: baris ikon di bawah brand, hanya bila link terisi -->
      <div v-if="socialLinks.length" class="lp-wrap lp-footer-social">
        <SocialIcons :links="socialLinks" />
      </div>
    </footer>
  </div>
</template>

<script>
import NavPublic from './NavPublic.vue';
import SocialIcons from './SocialIcons.vue';
import { getIdentity } from '../../resource/Identity';
import { applyPublicSeo, releasePublicSeo } from '../../resource/PublicSeo';

export default {
  name: 'LandingPage',
  components: { NavPublic, SocialIcons },
  data() {
    return {
      // Logo brand statis (vector SVG hasil rekreasi). Dipakai di hero & nav;
      // bisa diklik untuk dibuka versi besarnya (lightbox). identity_logo_path
      // tetap dipakai untuk ikon tab (favicon) lewat applyTabIdentity().
      brandLogo: '/brand-logo.svg',
      brandName: 'Fiorella Zeanne',
      brandAddress: null,
      brandPhone: null,
      // Lightbox: tampilkan logo versi besar saat diklik.
      logoZoom: false,
      // Link sosial dari sys_configuration_mst (link_tiktok/instagram/other).
      // Hanya yang terisi yang diisi di sini → ikon kosong tidak pernah tampil.
      socialLinks: [],
      openFaq: 0,
      categories: [
        {
          title: 'Skincare & Beauty',
          desc: 'Skincare Thailand, Korea, Jepang — dari yang viral sampai langka.',
        },
        {
          title: 'Fashion & Branded',
          desc: 'Baju, tas, sepatu, jam. Branded lokal sampai luxury.',
        },
        {
          title: 'Snack & Food',
          desc: 'Snack khas Bangkok, oleh-oleh, sampai makanan viral.',
        },
        {
          title: 'K-pop & Anime Merch',
          desc: 'Album, photocard, lightstick, figure, dan merch lainnya.',
        },
        {
          title: 'Gadget & Elektronik',
          desc: 'Aksesoris HP, gadget, dan elektronik dari luar negeri.',
        },
        {
          title: 'Request Bebas',
          desc: 'Nggak ada di list? Kirim link atau fotonya, kami carikan.',
        },
      ],
      reasons: [
        {
          title: 'Harga transparan',
          desc: 'Harga toko + fee jastip dihitung jelas. Nggak ada biaya tersembunyi.',
        },
        {
          title: 'Barang original',
          desc: 'Dibeli langsung dari toko resmi, lengkap dengan bukti pembelian.',
        },
        {
          title: 'Lacak tanpa login',
          desc: 'Cek posisi paket sendiri pakai nomor HP atau nomor resi.',
        },
        {
          title: 'Update tiap tahap',
          desc: 'Status barang berubah, kamu dapat kabar otomatis.',
        },
        {
          title: 'Pembayaran aman',
          desc: 'DP atau full payment, tercatat rapi. Sisa tagihan selalu kelihatan.',
        },
        {
          title: 'Admin responsif',
          desc: 'Tanya stok, harga, atau request barang? Tinggal chat.',
        },
      ],
      steps: [
        {
          title: 'Chat admin',
          desc: 'Hubungi admin via WhatsApp.',
        },
        {
          title: 'Kirim detail barang',
          desc: 'Link, foto, ukuran, warna, dan jumlahnya.',
        },
        {
          title: 'Konfirmasi harga',
          desc: 'Kami hitung harga + fee + ongkir, lalu kirim totalnya.',
        },
        {
          title: 'Bayar DP / full',
          desc: 'Transfer sesuai kesepakatan. Pembayaran tercatat.',
        },
        {
          title: 'Barang dibeli & dikirim',
          desc: 'Kami belanjakan, kirim, dan update nomor resinya.',
        },
        {
          title: 'Lacak & terima',
          desc: 'Pantau paket sampai tiba di rumahmu.',
        },
      ],
      // GANTI dengan testimoni asli sebelum publish.
      testimonials: [
        {
          text: 'Prosesnya cepat, barang sesuai foto. Update terus jadi nggak was-was.',
          name: 'Rina',
          city: 'Jakarta',
        },
        {
          text: 'Harga transparan, fee jelas di awal. Recommended banget.',
          name: 'Dita',
          city: 'Bandung',
        },
        {
          text: 'Request barang langka tetap dicariin. Adminnya sabar.',
          name: 'Sarah',
          city: 'Surabaya',
        },
      ],
      faqs: [
        {
          q: 'Berapa fee jastipnya?',
          a: 'Fee dihitung dari harga barang dan jenisnya. Kami kirim rincian harga + fee + ongkir sebelum kamu bayar, jadi semuanya transparan.',
        },
        {
          q: 'Berapa lama barang sampai?',
          a: 'Tergantung jadwal open PO dan pengiriman. Biasanya 1–3 minggu setelah pembelian. Estimasi selalu kami infokan di awal.',
        },
        {
          q: 'Bisa titip barang apa aja?',
          a: 'Skincare, fashion, branded, snack, gadget, merch K-pop/anime, sampai request khusus. Kirim link atau fotonya, kami cek.',
        },
        {
          q: 'Bagaimana cara bayarnya?',
          a: 'DP atau full payment via transfer. Semua pembayaran tercatat dan sisa tagihan bisa kamu lihat.',
        },
        {
          q: 'Kalau barang hilang atau rusak?',
          a: 'Setiap barang dilacak dari pembelian sampai tiba. Kalau ada kendala, kami bantu proses klaim ke kurir.',
        },
        {
          q: 'Bisa COD?',
          a: 'Untuk area tertentu bisa. Tanya admin dulu ya.',
        },
      ],
    };
  },
  created() {
    // Non-blocking: render langsung dengan fallback, identity menyusul saat
    // resolve (lihat getIdentity yang di-cache di resource/Identity.js).
    this.loadIdentity();
  },
  mounted() {
    applyPublicSeo({ title: this.seoTitle, path: '/landing' });
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeDestroy() {
    releasePublicSeo();
    window.removeEventListener('keydown', this.onKeydown);
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
    brandInitial() {
      const name = (this.brandName || 'F').trim();
      return name.charAt(0).toUpperCase();
    },
    waUrl() {
      if (!this.brandPhone) return null;
      let digits = String(this.brandPhone).replace(/\D/g, '');
      if (!digits) return null;
      // Normalisasi ke format internasional (62...) agar tautan wa.me valid.
      if (digits.startsWith('0')) digits = `62${digits.slice(1)}`;
      else if (digits.startsWith('8')) digits = `62${digits}`;
      return `https://wa.me/${digits}`;
    },
    seoTitle() {
      return `${this.brandName} — Jastip Thailand & All Brand | Open PO Bangkok Terpercaya`;
    },
  },
  methods: {
    onKeydown(e) {
      if (e.key === 'Escape' && this.logoZoom) this.logoZoom = false;
    },
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    toggleFaq(i) {
      this.openFaq = this.openFaq === i ? -1 : i;
    },
    /**
     * Susun daftar link sosial dari data identity.
     * Kolom yang kosong (sudah disaring backend, tapi dijaga lagi di sini)
     * tidak ikut dirender supaya tidak ada ikon tanpa tujuan.
     * Label = URL tanpa skema (mis. instagram.com/toko).
     */
    buildSocialLinks(id) {
      return [
        { key: 'tiktok', label: 'TikTok', url: id.link_tiktok },
        { key: 'instagram', label: 'Instagram', url: id.link_instagram },
        { key: 'other', label: 'Lainnya', url: id.link_other },
      ]
        .map((s) => ({ ...s, url: String(s.url || '').trim() }))
        .filter((s) => s.url);
    },
    async loadIdentity() {
      const id = await getIdentity();
      if (id) {
        // Logo in-page memakai aset statis (brand-logo.svg) agar tajam & bisa
        // diperbesar; identity_logo_path hanya untuk ikon tab (favicon).
        if (id.identity_name) this.brandName = id.identity_name;
        if (id.identity_address) this.brandAddress = id.identity_address;
        if (id.identity_phone) this.brandPhone = id.identity_phone;
        // Link sosial (hanya yang terisi) → dipakai blok ikon di hero & footer.
        this.socialLinks = this.buildSocialLinks(id);
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
  --lp-primary: #4f46e5;
  --lp-primary-2: #0ea5e9;
  --lp-accent: #f59e0b;
  --lp-ink: #0f172a;
  --lp-muted: #64748b;
  --lp-border: #e2e8f0;
  --lp-bg: #f8fafc;
  min-height: 100vh;
  background: var(--lp-bg);
  color: var(--lp-ink);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
}

/* Hero */
.lp-hero {
  position: relative;
  background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
  color: #fff;
  padding: 72px 20px 84px;
  overflow: hidden;
}
.lp-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
      circle at 15% 20%,
      rgba(245, 158, 11, 0.28),
      transparent 45%
    ),
    radial-gradient(circle at 85% 80%, rgba(255, 255, 255, 0.16), transparent 40%);
  pointer-events: none;
}
.lp-hero-inner {
  position: relative;
  z-index: 1;
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
.lp-hero-logo.is-clickable {
  cursor: zoom-in;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.lp-hero-logo.is-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.28);
}
.lp-hero-logo.is-clickable:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.85);
  outline-offset: 3px;
}

/* Lightbox logo (klik logo hero untuk melihat versi besar) */
.lp-logo-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.72);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}
.lp-logo-modal__img {
  width: auto;
  height: auto;
  max-width: min(80vw, 560px);
  max-height: 80vh;
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}
.lp-logo-modal__close {
  position: absolute;
  top: 18px;
  right: 20px;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}
.lp-logo-modal__close:hover {
  background: #fff;
}
.lp-fade-enter-active,
.lp-fade-leave-active {
  transition: opacity 0.18s ease;
}
.lp-fade-enter,
.lp-fade-leave-to {
  opacity: 0;
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
  color: #fde68a;
}
.lp-sub {
  font-size: clamp(15px, 2.2vw, 17.5px);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
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
  font-family: inherit;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  transition: transform 0.15s, opacity 0.15s, background 0.15s;
}
.lp-btn:hover {
  transform: translateY(-1px);
  text-decoration: none;
}
.lp-btn:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.7);
  outline-offset: 2px;
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
  border-color: rgba(255, 255, 255, 0.45);
}
.lp-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}
.lp-trust {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 22px;
  margin: 30px 0 0;
  padding: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
}
.lp-trust li {
  position: relative;
  padding-left: 20px;
}
.lp-trust li::before {
  content: '\2713';
  position: absolute;
  left: 0;
  top: 0;
  color: #fde68a;
  font-weight: 800;
}

/* Section */
.lp-section {
  padding: 60px 20px;
}
.lp-section-alt {
  background: #fff;
  border-top: 1px solid var(--lp-border);
  border-bottom: 1px solid var(--lp-border);
}
.lp-wrap {
  max-width: 1080px;
  margin: 0 auto;
}
.lp-wrap-narrow {
  max-width: 780px;
}
.lp-section h2 {
  font-size: clamp(22px, 3.4vw, 28px);
  font-weight: 800;
  margin: 0 0 14px;
  text-align: center;
}
.lp-lead {
  text-align: center;
  color: var(--lp-muted);
  font-size: 15.5px;
  line-height: 1.6;
  max-width: 620px;
  margin: 0 auto 34px;
}

/* Cards */
.lp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}
@media (min-width: 900px) {
  /* 6 kartu -> 3 kolom x 2 baris, biar rapi & seimbang */
  .lp-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.lp-card {
  background: #fff;
  border: 1px solid var(--lp-border);
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
  color: var(--lp-muted);
  margin: 0;
}

/* Steps */
.lp-steps {
  list-style: none;
  margin: 0;
  padding: 0;
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
  color: var(--lp-muted);
  margin: 0;
}

/* Testimoni */
.lp-quote {
  background: #fff;
  border: 1px solid var(--lp-border);
  border-left: 4px solid var(--lp-accent);
  border-radius: 14px;
  padding: 22px 22px 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.lp-quote-text {
  font-size: 15px;
  line-height: 1.65;
  color: #334155;
  margin: 0 0 16px;
}
.lp-quote-by {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.lp-quote-name {
  font-weight: 700;
  font-size: 14.5px;
  color: var(--lp-ink);
}
.lp-quote-city {
  font-size: 13px;
  color: var(--lp-muted);
}

/* FAQ */
.lp-faq {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.lp-faq-item {
  background: #fff;
  border: 1px solid var(--lp-border);
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.lp-faq-item.is-open {
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
}
.lp-faq-q {
  margin: 0;
  font-size: inherit;
}
.lp-faq-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  background: none;
  border: 0;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  font-size: 15.5px;
  font-weight: 700;
  color: var(--lp-ink);
}
.lp-faq-btn:focus-visible {
  outline: 3px solid rgba(79, 70, 229, 0.4);
  outline-offset: -3px;
}
.lp-faq-sign {
  flex: none;
  font-size: 20px;
  font-weight: 700;
  color: var(--lp-primary);
  line-height: 1;
}
.lp-faq-a {
  padding: 0 20px 18px;
}
.lp-faq-a p {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--lp-muted);
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
  color: rgba(255, 255, 255, 0.92);
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
.lp-footer-name {
  font-weight: 700;
  color: #fff;
}
.lp-footer-contact {
  font-size: 13px;
  color: #94a3b8;
}
.lp-footer-link {
  color: #cbd5e1;
  text-decoration: none;
}
.lp-footer-link:hover {
  color: #fff;
  text-decoration: underline;
}
/* Sosial di hero: sejajar di tengah, sedikit di bawah trust badges */
.lp-hero-social {
  justify-content: center;
  margin-top: 22px;
}
.lp-hero-social :deep(.social-icons__link) {
  color: #e0e7ff;
}
/* Sosial di footer: baris ikon di bawah brand */
.lp-footer-social {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}
.lp-footer-social :deep(.social-icons__link) {
  color: #cbd5e1;
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
