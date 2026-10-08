import $axios from '../api';

/**
 * Identitas publik (TANPA token) dari sys_configuration_mst:
 *   { identity_name, identity_logo_path }
 * Dipakai halaman landing/tracking — didaftarkan di skip_token backend.
 *
 * Hasil di-cache selama satu sesi: applyTabIdentity() (main.js), Landing dan
 * NavPublic semuanya memanggil endpoint ini saat startup, jadi tanpa cache satu
 * kunjungan landing menembak 3 request CORS (preflight + GET) ke backend.
 * Dengan cache cukup 1 request lalu dipakai bersama; hasil gagal/kosong tidak
 * di-cache supaya percobaan berikutnya tetap jalan.
 */
let identityRequest = null;

const fetchIdentity = async () => {
  try {
    const result = await $axios.get('/v1/jastip/identity');
    const rows = result.data && result.data.data;
    return rows && rows[0] ? rows[0] : null;
  } catch (e) {
    return null;
  }
};

export const getIdentity = () => {
  if (!identityRequest) {
    identityRequest = fetchIdentity().then((row) => {
      if (!row) identityRequest = null;
      return row;
    });
  }
  return identityRequest;
};

/** Reset cache identitas (paksa request baru untuk kunjungan berikutnya). */
export const resetIdentityCache = () => {
  identityRequest = null;
};

/**
 * Terapkan identitas dari sys_configuration_mst ke tab browser:
 *   - document.title         ← identity_name
 *   - <link rel="icon"> etc  ← identity_logo_path
 *   - meta tile / web-app title ikut disesuaikan.
 * Dipanggil sekali saat app start (main.js).
 *
 * <title data-seo="dynamic"> (ditandai src/resource/PublicSeo.js) tidak
 * ditimpa, supaya halaman publik tetap memakai judul deskriptif untuk SEO.
 */
export const applyTabIdentity = async () => {
  const id = await getIdentity();
  if (!id) return;
  const titleEl = document.querySelector('title');
  const pageOwnsTitle =
    titleEl && titleEl.getAttribute('data-seo') === 'dynamic';
  if (id.identity_name && !pageOwnsTitle) {
    document.title = id.identity_name;
    const webTitle = document.querySelector(
      'meta[name="apple-mobile-web-app-title"]',
    );
    if (webTitle) webTitle.setAttribute('content', id.identity_name);
  }
  if (id.identity_logo_path) {
    document
      .querySelectorAll(
        'link[rel="icon"], link[rel="apple-touch-icon"], link[rel="shortcut icon"]',
      )
      .forEach((l) => {
        l.href = id.identity_logo_path;
      });
    const tile = document.querySelector('meta[name="msapplication-TileImage"]');
    if (tile) tile.setAttribute('content', id.identity_logo_path);
  }
};

/**
 * Warna brand default PLATFORM (samakan dengan src/assets/scss/_variables.scss).
 * Dipakai bila identitas tidak membawa primary_color/secondary_color.
 */
const DEFAULT_PRIMARY = '#553b9c';
const DEFAULT_SECONDARY = '#ff9b55';

/**
 * Terapkan TEMA (warna) + favicon white-label ke dokumen.
 *
 * Latar belakang: CoreUI 3 meng-compile warna menjadi nilai literal di CSS
 * (tidak memakai var()), sehingga mengubah custom property saja TIDAK cukup.
 * Karena itu kita:
 *   1) set custom property --primary/--secondary (untuk komponen yang memakai
 *      var(), dan sebagai sumber tunggal), lalu
 *   2) inject <style id="brand-theme"> yang meng-override komponen CoreUI
 *      utama (tombol, link, sidebar, dsb) dengan warna tenant.
 *
 * Idempoten: elemen <style> dipakai ulang (tidak menumpuk) dan dipanggil
 * ulang aman (mis. setelah login ganti tenant).
 *
 * @param {{primary_color?:string, secondary_color?:string, favicon_path?:string}} identity
 */
export const applyBrandTheme = (identity = {}) => {
  const primary = identity.primary_color || DEFAULT_PRIMARY;
  const secondary = identity.secondary_color || DEFAULT_SECONDARY;

  // 1) Custom property (sumber tunggal; beberapa komponen custom memakainya).
  const root = document.documentElement;
  root.style.setProperty('--primary', primary);
  root.style.setProperty('--secondary', secondary);

  // 2) Override literal CoreUI 3 (daftar selector = komponen utama yang
  //    menyimpan warna primer sebagai nilai literal di bundle).
  const css = `
:root{--primary:${primary};--secondary:${secondary};}
.btn-primary{background-color:${primary};border-color:${primary};}
.btn-primary:hover,.btn-primary:focus,.btn-primary:not(:disabled):not(.disabled):active{background-color:${primary};border-color:${primary};filter:brightness(.92);}
.btn-outline-primary{color:${primary};border-color:${primary};}
.btn-outline-primary:hover,.btn-outline-primary:not(:disabled):not(.disabled):active{background-color:${primary};border-color:${primary};color:#fff;}
.btn-link{color:${primary};}
.bg-primary{background-color:${primary}!important;}
.text-primary{color:${primary}!important;}
.border-primary{border-color:${primary}!important;}
.badge-primary{background-color:${primary};}
.page-link{color:${primary};}
.page-item.active .page-link{background-color:${primary};border-color:${primary};}
.progress-bar{background-color:${primary};}
.list-group-item.active{background-color:${primary};border-color:${primary};}
.nav-pills .show>.nav-link{background-color:${primary};}
.dropdown-item:active{background-color:${primary};}
.custom-control-input:checked~.custom-control-label:before{background-color:${primary};border-color:${primary};}
.custom-range::-webkit-slider-thumb{background-color:${primary};}
.custom-range::-moz-range-thumb{background-color:${primary};}
.card-accent-primary{border-top-color:${primary};}
.modal-primary .modal-content,.modal-primary .modal-header{border-color:${primary};}
.c-sidebar.c-sidebar-light .c-sidebar-brand{background-color:${primary};}
.toast-primary{background-color:${primary};}
`;
  let el = document.getElementById('brand-theme');
  if (!el) {
    el = document.createElement('style');
    el.id = 'brand-theme';
    document.head.appendChild(el);
  }
  el.textContent = css;

  // 3) Favicon: prioritas favicon_path, fallback ke logo.
  const icon = identity.favicon_path || identity.identity_logo_path;
  if (icon) {
    document
      .querySelectorAll(
        'link[rel="icon"], link[rel="apple-touch-icon"], link[rel="shortcut icon"]',
      )
      .forEach((l) => {
        l.href = icon;
      });
  }

  // 4) theme-color (warna address bar mobile) mengikuti warna primer brand.
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', primary);
};

/**
 * Terapkan identitas lengkap: title + favicon (applyTabIdentity) + tema warna
 * (applyBrandTheme). Panggil SETELAH konteks tenant ditentukan (main.js).
 */
export const applyBrand = async () => {
  const id = await getIdentity();
  if (!id) return;
  await applyTabIdentity();
  applyBrandTheme(id);
};
