/**
 * Meta SEO untuk halaman PUBLIK (Landing, TrackingPublic).
 *
 * Kenapa bukan vue-meta: package.json tidak memuat vue-meta dan menambah
 * dependency baru butuh install ulang. Cukup update document.head langsung —
 * idempotent, aman dipanggil berkali-kali (mis. ulang setelah identity resolve).
 *
 * Semua URL absolut dihitung dari location.origin saat runtime supaya tidak
 * ada URL produksi yang ditebak/dikarang di source.
 */
import { getIdentity } from './Identity';

const DESCRIPTIONS = {
  landing:
    'Jastip adalah layanan jasa titip belanja yang mencatat barang, tagihan, dan pengiriman dalam satu sistem. Lacak posisi paket kapan saja lewat nomor resi atau nomor HP.',
  tracking:
    'Lacak paket jasa titip belanja: masukkan nomor resi kurir atau nomor HP customer untuk melihat status barang dari manifest sampai tiba di penerima.',
};

const upsertMeta = (keyAttr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${keyAttr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(keyAttr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertLink = (rel, href) => {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const absoluteUrl = (path) => {
  try {
    return new URL(path || '/', window.location.origin).toString();
  } catch (e) {
    return null;
  }
};

/** Isi url + logo pada JSON-LD publik (script#ld-public) dengan data runtime. */
const applyJsonLd = (imageUrl) => {
  const el = document.getElementById('ld-public');
  if (!el) return;
  try {
    const data = JSON.parse(el.textContent);
    const origin = window.location.origin;
    const graph = Array.isArray(data['@graph']) ? data['@graph'] : [data];
    graph.forEach((node) => {
      if (!node || typeof node !== 'object') return;
      if (!node.url) node.url = origin + '/';
      if (node['@type'] === 'Organization' && imageUrl && !node.logo) {
        node.logo = imageUrl;
      }
    });
    el.textContent = JSON.stringify(data);
  } catch (e) {
    /* JSON-LD tidak valid? biarkan apa adanya */
  }
};

/**
 * Terapkan meta SEO sebuah halaman publik.
 * @param {Object} opts
 * @param {string} opts.title        judul halaman (pakai brand bila ada)
 * @param {string} [opts.description]
 * @param {string} [opts.path]       path halaman, mis. '/landing'
 * @param {string} [opts.image]      URL absolut utk og:image (opsional)
 */
export const applyPublicSeo = (opts = {}) => {
  const {
    title,
    description = DESCRIPTIONS.landing,
    path = '/',
    image = '/gastrack-icon-512.png',
  } = opts;

  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  if (title) {
    document.title = title;
    const titleEl = document.querySelector('title');
    if (titleEl) titleEl.setAttribute('data-seo', 'dynamic');
  }

  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large');

  upsertLink('canonical', url);

  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:image', imageUrl);

  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', imageUrl);

  applyJsonLd(imageUrl);
};

/**
 * Lepas flag judul dinamis saat meninggalkan halaman publik, lalu kembalikan
 * <title> ke nama identity (perilaku lama applyTabIdentity) supaya tab aplikasi
 * tidak selalu membawa suffix SEO halaman landing/tracking.
 */
export const releasePublicSeo = async () => {
  const titleEl = document.querySelector('title');
  if (titleEl) titleEl.removeAttribute('data-seo');
  try {
    const id = await getIdentity();
    if (id && id.identity_name) document.title = id.identity_name;
  } catch (e) {
    /* identity tak terjangkau: biarkan judul apa adanya */
  }
};

export default applyPublicSeo;
