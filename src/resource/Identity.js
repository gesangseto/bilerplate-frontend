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
