<template>
  <nav class="pn" aria-label="Navigasi utama">
    <div class="pn-inner">
      <router-link class="pn-brand" to="/landing">
        <span
          class="pn-logo-box"
          :class="{ 'is-clickable': !!brandLogo }"
          :role="brandLogo ? 'button' : null"
          :tabindex="brandLogo ? 0 : null"
          :title="brandLogo ? 'Klik untuk lihat logo lebih besar' : null"
          :aria-label="brandLogo ? `Perbesar logo ${brandName}` : null"
          @click.stop.prevent="brandLogo && (logoZoom = true)"
          @keydown.enter.stop.prevent="brandLogo && (logoZoom = true)"
          @keydown.space.stop.prevent="brandLogo && (logoZoom = true)"
        >
          <img
            v-if="brandLogo"
            :src="brandLogo"
            class="pn-logo"
            width="30"
            height="30"
            decoding="async"
            :alt="`Logo ${brandName}`"
          />
          <span v-else class="pn-dot" aria-hidden="true"></span>
        </span>
        <span>{{ brandName }}</span>
      </router-link>
      <div class="pn-links">
        <button type="button" class="pn-link" @click="goTo('kategori')">
          Kategori
        </button>
        <button type="button" class="pn-link" @click="goTo('cara-order')">
          Cara Order
        </button>
        <button type="button" class="pn-link" @click="goTo('faq')">FAQ</button>
        <router-link to="/tracking" exact>Lacak Paket</router-link>
        <router-link class="pn-btn" to="/login">Login</router-link>
      </div>
    </div>

    <!-- Lightbox logo (klik logo navbar untuk melihat versi besar) -->
    <transition name="pn-fade">
      <div
        v-if="logoZoom && brandLogo"
        class="pn-logo-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Logo ${brandName}`"
        @click.self="logoZoom = false"
      >
        <button
          type="button"
          class="pn-logo-modal__close"
          aria-label="Tutup"
          @click="logoZoom = false"
        >
          ×
        </button>
        <img
          class="pn-logo-modal__img"
          :src="brandLogo"
          :alt="`Logo ${brandName}`"
        />
      </div>
    </transition>
  </nav>
</template>

<script>
import { getIdentity } from '../../resource/Identity';

export default {
  name: 'NavPublic',
  data() {
    return {
      // Logo brand statis (vector SVG) — konsisten dengan halaman landing.
      brandLogo: '/brand-logo.svg',
      brandName: 'Fiorella Zeanne',
      // Lightbox: tampilkan logo versi besar saat diklik.
      logoZoom: false,
    };
  },
  created() {
    this.loadIdentity();
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeydown);
  },
  methods: {
    onKeydown(e) {
      if (e.key === 'Escape' && this.logoZoom) this.logoZoom = false;
    },
    async loadIdentity() {
      const id = await getIdentity();
      if (id) {
        // Logo in-page memakai aset statis (brand-logo.svg); identity_logo_path
        // hanya dipakai untuk ikon tab (favicon).
        if (id.identity_name) this.brandName = id.identity_name;
      }
    },
    /**
     * Scroll ke section di landing. Kalau section tidak ada (mis. sedang di
     * halaman tracking), arahkan dulu ke /landing lalu scroll setelah render.
     */
    goTo(id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (this.$route.path !== '/landing') {
        this.$router.push('/landing');
      }
      this.$nextTick(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },
  },
};
</script>

<style scoped>
.pn {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #e2e8f0;
}
/* Latar + blur dipindah ke pseudo-element. backdrop-filter pada .pn akan
   menjadikan fixed milik lightbox terikat ke kotak navbar (bukan viewport),
   sehingga modal tidak menutupi layar. Sebagai pseudo (bukan ancestor modal)
   tampilan navbar tetap sama. */
.pn::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgba(255, 255, 255, 0.92);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
.pn-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.pn-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  color: #0f172a;
  text-decoration: none;
}
/* Kotak logo 30x30 selalu ada → nav tidak bergeser saat identity resolve */
.pn-logo-box {
  width: 30px;
  height: 30px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.pn-logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
  border-radius: 8px;
  background: #fff;
}
.pn-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  display: inline-block;
}
.pn-logo-box.is-clickable {
  cursor: zoom-in;
  border-radius: 10px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.pn-logo-box.is-clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.22);
}
.pn-logo-box.is-clickable:focus-visible {
  outline: 3px solid rgba(79, 70, 229, 0.7);
  outline-offset: 2px;
}

/* Lightbox logo (klik logo navbar untuk melihat versi besar) */
.pn-logo-modal {
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
.pn-logo-modal__img {
  width: auto;
  height: auto;
  max-width: min(80vw, 560px);
  max-height: 80vh;
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}
.pn-logo-modal__close {
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
.pn-logo-modal__close:hover {
  background: #fff;
}
.pn-fade-enter-active,
.pn-fade-leave-active {
  transition: opacity 0.18s ease;
}
.pn-fade-enter,
.pn-fade-leave-to {
  opacity: 0;
}
.pn-links {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.pn-links a,
.pn-link {
  color: #475569;
  text-decoration: none;
  font-size: 14.5px;
  font-weight: 500;
  font-family: inherit;
  padding: 7px 12px;
  border-radius: 8px;
  border: 0;
  background: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.pn-links a:hover,
.pn-link:hover {
  background: #f1f5f9;
  color: #0f172a;
}
.pn-links a.router-link-active:not(.pn-btn) {
  color: #4f46e5;
}
.pn-links a.pn-btn {
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: #fff;
  padding: 8px 18px;
  font-weight: 600;
}
.pn-links a.pn-btn:hover {
  opacity: 0.9;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: #fff;
}
@media (max-width: 560px) {
  .pn-inner {
    justify-content: center;
  }
  .pn-links {
    justify-content: center;
  }
}
</style>
