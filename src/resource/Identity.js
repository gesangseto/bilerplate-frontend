import $axios from '../api';

/**
 * Identitas publik (TANPA token) dari sys_configuration_mst:
 *   { identity_name, identity_logo_path }
 * Dipakai halaman landing/tracking — didaftarkan di skip_token backend.
 */
export const getIdentity = async () => {
  try {
    const result = await $axios.get('/v1/jastip/identity');
    const rows = result.data && result.data.data;
    return rows && rows[0] ? rows[0] : null;
  } catch (e) {
    return null;
  }
};

/**
 * Terapkan identitas dari sys_configuration_mst ke tab browser:
 *   - document.title         ← identity_name
 *   - <link rel="icon"> etc  ← identity_logo_path
 *   - meta tile / web-app title ikut disesuaikan.
 * Dipanggil sekali saat app start (main.js).
 */
export const applyTabIdentity = async () => {
  const id = await getIdentity();
  if (!id) return;
  if (id.identity_name) {
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
