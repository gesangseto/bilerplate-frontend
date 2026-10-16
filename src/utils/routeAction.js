/**
 * ============================================================================
 *  ROUTE ACTION — sumber tunggal kebenaran mode form (create/read/update)
 * ============================================================================
 *
 *  MASALAH (yang diperbaiki)
 *  ------------------------
 *  Setiap form Jastip punya `action` dengan TIGA konvensi berbeda:
 *
 *    1. `capitalizeFirstLetter(route.params.type)`
 *       → 'Create' | 'Read' | 'Update' | 'Approve'
 *    2. Literal template guard `action === 'ADD'` / `'EDIT'` / `'VIEW'`
 *    3. `route_action` yang diset di mounted tapi TIDAK ada di `data()`
 *
 *  Akibatnya kondisi di template tidak pernah cocok:
 *    - `action === 'Read'`  → tidak pernah true (nilainya 'Read' lowercase beda),
 *      tapi `action === 'ADD'` juga false untuk route `create` → form create
 *      tampil sebagai form read (semua field non-editable).
 *    - Halaman yang seharusnya read-only justru editable.
 *    - Halaman `update/:id` tidak memuat data karena cabang `if (action === 'ADD')`
 *      tidak pernah TRUE untuk route `update`, dan `loadData()` dipanggil dengan
 *      id yang tidak ada → form kosong.
 *
 *  SOLUSI
 *  ------
 *  Semua form memakai `resolveRouteAction()` dari helper ini. Nilai `action`
 *  dinormalisasi ke SATU bentuk kanonik, lalu computed `isCreate/isRead/isUpdate`
 *  diturunkan darinya. Template TIDAK lagi membandingkan string mentah.
 *
 *  ═══ KONTRAK ═══
 *  return {
 *    type: 'create' | 'read' | 'update' | 'approve',  // kanonik, lowercase
 *    action: 'Create' | 'Read' | 'Update' | 'Approve', // untuk judul/display
 *    routeAction: 'ADD' | 'VIEW' | 'EDIT' | 'APPROVE', // untuk API/logic lama
 *    isCreate: boolean,
 *    isRead: boolean,
 *    isUpdate: boolean,
 *    isApprove: boolean,
 *    isEditable: boolean,   // boleh ubah field? false saat read
 *    id: string | null,
 *  }
 */

/** Bentuk kanonik dari semua kemungkinan input (case-insensitive). */
const TYPE_ALIASES = {
  create: 'create',
  add: 'create',
  new: 'create',
  insert: 'create',
  read: 'read',
  view: 'read',
  detail: 'read',
  show: 'read',
  update: 'update',
  edit: 'update',
  modify: 'update',
  approve: 'approve',
  dispatch: 'approve',
  approve_dispatch: 'approve',
};

/** Label judul per mode (dipakai di header form). */
const TITLE_MAP = {
  create: 'Create',
  read: 'Read',
  update: 'Update',
  approve: 'Dispatch',
};

/**
 * Normalisasi route param form Jastip.
 *
 * @param {object} params - `$route.params`
 * @returns {object} kontrak route action (lihat header file)
 */
export function resolveRouteAction(params = {}) {
  const rawType = params && params.type ? String(params.type) : '';
  const key = rawType.toLowerCase().trim();
  // Default: `create` supaya form tetap tampil apa adanya saat param kosong.
  const type = TYPE_ALIASES[key] || 'create';
  const id =
    params && params.id !== undefined && params.id !== null && params.id !== ''
      ? String(params.id)
      : null;

  const isCreate = type === 'create';
  const isRead = type === 'read';
  const isUpdate = type === 'update';
  const isApprove = type === 'approve';

  return {
    type,
    action: TITLE_MAP[type],
    // Nilai route_action yang dip freaking oleh logic lama.
    routeAction: isCreate ? 'ADD' : isRead ? 'VIEW' : isUpdate ? 'EDIT' : 'APPROVE',
    isCreate,
    isRead,
    isUpdate,
    isApprove,
    // Field form hanya boleh diubah saat create / update / approve.
    // Read = murni tampilan.
    isEditable: !isRead,
    id,
    // Route dengan `/:id` HARUS punya id. Tanpa id, mode create yang dipakai
    // (route `update` tanpa id tidak masuk akal).
    hasId: !!id,
  };
}

export default resolveRouteAction;