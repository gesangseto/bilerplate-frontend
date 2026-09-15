# Gastrack Website (Admin Panel)

Admin panel berbasis **Vue.js 2 + CoreUI** untuk aplikasi **Gastrack — Jasa Titip Belanja (Jastip)**.
Awalnya template "Gastrack PharmaTrust Track & Trace for Pharma Manufacturer", dikembangkan dengan modul Jastip
yang terhubung ke backend Gastrack (Express + PostgreSQL).

- **Repo**: `gesangseto/bilerplate-frontend` (branch `jastip`)
- **Versi**: 4.2.0
- **Lisensi**: MIT

---

## Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Vue.js 2.6, Vue Router 3 (mode hash), Vuex 3 |
| UI | CoreUI 3 (`@coreui/vue`), Bootstrap 4, Font Awesome |
| HTTP | Axios (interceptor token + loading bar NProgress) |
| Validasi | Vuelidate + vuelidate-error-extractor |
| Chart | Chart.js 2 + vue-chartjs |
| Tabel | Tabulator, TableTransaction (komponen custom) |
| Barcode | bwip-js |
| Export/Print | vue-excel-xlsx, vue-print-nb, jspdf, vue-html-to-paper |
| Lainnya | vue-cute-timeline, vue2-datepicker, vue-select, vue-js-modal, sass |

---

## Struktur Direktori

```
Website/
├── public/                  # Output build (vue.config.js: outputDir = ../public)
├── scripts/
│   └── set-git-hash.js      # Auto-bump BUILD_VERSION (git hash) ke src/config.js
├── src/
│   ├── api.js               # Axios instance (baseURL, header token, interceptor 401)
│   ├── apiNonLoading.js     # Axios tanpa loading bar
│   ├── config.js            # Auto-generated: APP_CONFIG.BUILD_VERSION
│   ├── main.js              # Registrasi plugin global
│   ├── store.js             # Vuex store
│   ├── router/index.js      # Semua route (prefix /jastip/* untuk modul Jastip)
│   ├── containers/
│   │   ├── TheContainer.vue # Layout utama (sidebar + header)
│   │   └── _nav.js          # Definisi menu sidebar
│   ├── views/
│   │   ├── jastip/          # ★ Modul Jastip (7 folder, 13 file)
│   │   ├── master/          # Supplier, Customer, Warehouse, Product, dll
│   │   ├── settings/        # User, Role, Workflow, Department, dll
│   │   ├── transactions/    # Modul pharma lama (picking, inbound, outbound, dll)
│   │   ├── reports/         # Laporan & audit trail
│   │   ├── configuration/   # Station, Pattern, Currency, Metadata, dll
│   │   └── component/       # Komponen global (TableTransaction, ButtonPermission)
│   ├── resource/            # Helper API per modul (MstCustomer, SysAuth, dll)
│   ├── utils/               # storage, helper, validator
│   └── assets/              # Ikon, CSS
├── .env                     # Konfigurasi environment
├── vue.config.js            # Konfigurasi build + kompresi brotli/gzip
└── .gitlab-ci.yml           # Mirror GitLab → GitHub
```

---

## Modul Jastip

Menu sidebar (`src/containers/_nav.js`) → **Jastip** dengan 7 submenu.
Semua route di bawah prefix `/jastip/*` (`src/router/index.js`).

| Halaman | Route | File | Fungsi | Endpoint API |
|---|---|---|---|---|
| Dashboard | `/jastip/dashboard` | `dashboard/Dashboard.vue` | Stat card + tabel status item/batch/picking/invoice | `GET /v1/jastip/dashboard` |
| Item Registry | `/jastip/item-registry` | `item-registry/ListItemRegistry.vue` | List item (filter, sort, pagination) | `GET /v1/jastip/item-registry` |
| | `/jastip/item-registry/create` `/jastip/item-registry/update/:id` | `item-registry/FormItemRegistry.vue` | Form CRUD item + upload foto | `PUT/POST /v1/jastip/item-registry`, `GET /v1/master/customer`, `GET /v1/master/product`, `GET /v1/master/warehouse` |
| Outbound Manifest | `/jastip/outbound-manifest` | `outbound-manifest/ListOutboundManifest.vue` | List batch | `GET /v1/jastip/outbound-manifest` |
| | `/jastip/outbound-manifest/create` `/jastip/outbound-manifest/update/:id` | `outbound-manifest/FormOutboundManifest.vue` | Form batch (pilih item draft) | `PUT/POST /v1/jastip/outbound-manifest`, `GET /v1/master/supplier`, `GET /v1/jastip/item-registry` |
| Inbound | `/jastip/inbound` | `inbound/ListInbound.vue` | List inbound | `GET /v1/jastip/inbound` |
| | `/jastip/inbound/create` | `inbound/FormInbound.vue` | Terima batch (Shipping → Done) | `POST /v1/jastip/inbound`, `GET /v1/jastip/outbound-manifest` |
| Picking | `/jastip/picking` | `picking/ListPicking.vue` | List picking | `GET /v1/jastip/picking` |
| | `/jastip/picking/create` | `picking/FormPicking.vue` | Form picking (pilih item stock) | `PUT /v1/jastip/picking`, `GET /v1/master/customer`, `GET /v1/jastip/item-stock` |
| Item Stock | `/jastip/item-stock` | `item-stock/ListItemStock.vue` | List item stock | `GET /v1/jastip/item-stock` |
| | `/jastip/item-stock/update/:id` | `item-stock/FormItemStock.vue` | Detail item stock | `GET /v1/jastip/item-stock?id=` |
| Item Disposal | `/jastip/item-disposal` | `disposal/ListItemDisposal.vue` | List disposal | `GET /v1/jastip/disposal` |
| | `/jastip/item-disposal/create` | `disposal/FormItemDisposal.vue` | Form disposal (pilih item) | `PUT /v1/jastip/disposal`, `GET /v1/jastip/item-registry` |

**Field utama Item Registry**: `customer_id`, `product_id`, `warehouse_id`, `quantity`, `cost_price`,
`selling_price`, `cost_code`, `selling_code`, `photo` (upload).

**Status item**: 200=Draft, 201=Manifesting, 202=In Transit, 203=GRN, 204=Dispatch, 205=Sold.
**Status batch**: Draft → Shipping → Done.

---

## Routing & Navigasi

- Mode **hash** (`#/jastip/...`), redirect `/` → `/login`.
- Route Jastip didefinisikan di `src/router/index.js` (blok `// ========================JASTIP`).
- Pola route form: `:type` (`create`/`update`) + `:id` opsional — komponen yang sama dipakai untuk ADD & EDIT.
- Breadcrumb aktif dihitung otomatis dari menu (`router.beforeEach` → `$activeMenu`).
- Menu sidebar: `src/containers/_nav.js` (CSidebarNavDropdown "Jastip" + 7 CSidebarNavItem).

---

## Konfigurasi API & Environment

File `.env`:

```
VUE_APP_URL_API="http://127.0.0.1:8001"
VUE_APP_DEFAULT_DATE_FILTER="last_6_month"
VUE_APP_EPC_TYPE="sgtin,sscc,nie"
```

- Base URL API: `VUE_APP_URL_API + '/api'` (di-set di interceptor `src/api.js`).
- Header tiap request: `token` (dari profil login / devToken), `User-Type` (info browser & OS).
- Response `StatusCode == 401` → `clearStorage()` (logout).
- Timeout default: 120 detik.

---

## Scripts & Build

```bash
npm install          # Install dependencies
npm run serve        # Development (auto bump BUILD_VERSION via set-git-hash.js)
npm run build        # Production build → output ke ../public
npm run lint         # ESLint
npm run test:unit    # Unit test (Jest)
npm run test:e2e     # E2E test (Nightwatch)
npm run release      # clearCache + lint + build + test
```

- `scripts/set-git-hash.js` menulis `src/config.js` berisi `APP_CONFIG.BUILD_VERSION = "<versi> (<git hash>)"`
  — dijalankan otomatis sebelum `serve`/`build`.
- `vue.config.js`: kompresi **brotli + gzip** untuk aset, `outputDir = ../public`, `publicPath = '/'`.
- CI/CD: `.gitlab-ci.yml` mirror repo GitLab → GitHub.

---

## Komponen UI

- `TableTransaction` — tabel list standar (filter, sort, pagination, aksi read/update/delete, export).
- `ButtonPermission` — tombol aksi berbasis permission (add/export).
- Terdaftar global via `src/views/component/index.js`.

---

## Catatan Penting

**Bug node_modules (Website "not respond" / crash):**
Pada komputer tertentu `node_modules` tidak terinstall dengan benar dan menghasilkan Website yang selalu
"not respond" (crash). Jalankan:

```bash
npm cache clean --force
```

**Versi teruji** (harus hapus `node_modules` dan `package-lock.json` sebelum ganti versi):

1. Node 14.18.0, npm 6.15.14
2. Node 18.12.0, npm 8.19.2

**Cari ikon CoreUI:** https://coreui.io/icons/all/

---

## Status Integrasi

- Modul Jastip sudah memanggil backend Gastrack secara langsung (axios ke `/api/v1/jastip/*` dan `/api/v1/master/*`).
- Dashboard, Item Registry, Outbound Manifest, Inbound, Picking, Item Stock, dan Disposal sudah memiliki
  halaman List + Form yang terhubung ke endpoint backend.
- Beberapa alur form masih perlu disinkronkan lebih lanjut dengan payload/status backend
  (lihat `AI_CONTEXT.md` di root proyek untuk status terbaru).