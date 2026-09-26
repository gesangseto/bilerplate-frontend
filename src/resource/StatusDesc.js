// Data status lokal per tabel — tidak perlu request ke Backend.
// Sumber data: seeder trx_status_desc (backend lama) + status modul Jastip.
const STATUS_DESC = {
  // ===== Master Data =====
  mst_product: [
    { status_code: 'Active', status_desc: 'Active' },
    { status_code: 'Inactive', status_desc: 'Inactive' },
  ],
  mst_customer: [
    { status_code: 'Active', status_desc: 'Active' },
    { status_code: 'Inactive', status_desc: 'Inactive' },
  ],
  mst_warehouse: [
    { status_code: 'Active', status_desc: 'Active' },
    { status_code: 'Inactive', status_desc: 'Inactive' },
  ],
  mst_supplier: [
    { status_code: 'Active', status_desc: 'Active' },
    { status_code: 'Inactive', status_desc: 'Inactive' },
  ],
  mst_department: [
    { status_code: 'Active', status_desc: 'Active' },
    { status_code: 'Inactive', status_desc: 'Inactive' },
  ],

  // ===== Modul Jastip =====
  item_stock: [
    { status_code: '200', status_desc: 'Draft' },
    { status_code: '201', status_desc: 'Manifesting' },
    { status_code: '202', status_desc: 'In Transit' },
    { status_code: '203', status_desc: 'GRN' },
    { status_code: '204', status_desc: 'Dispatch' },
    { status_code: '205', status_desc: 'Sold' },
    { status_code: '206', status_desc: 'Disposed' },
  ],
  item_batch: [
    { status_code: 'Draft', status_desc: 'Draft' },
    { status_code: 'Shipping', status_desc: 'Shipping' },
    { status_code: 'Done', status_desc: 'Done' },
  ],
  trx_inbound: [{ status_code: '1', status_desc: 'Done' }],
  trx_picking: [
    { status_code: '-1', status_desc: 'Canceled' },
    { status_code: '0', status_desc: 'Waiting' },
    { status_code: '1', status_desc: 'Done' },
    { status_code: '2', status_desc: 'In Courier' },
  ],

  // ===== Transaksi =====
  trx_transfer: [
    { status_code: '0', status_desc: 'Booked' },
    { status_code: '1', status_desc: 'Done' },
    { status_code: '2', status_desc: 'Canceled' },
  ],
  trx_stock_opname: [
    { status_code: '0', status_desc: 'Pending' },
    { status_code: '1', status_desc: 'Done' },
    { status_code: '2', status_desc: 'Canceled' },
  ],
  trx_sampling: [
    { status_code: '0', status_desc: 'Pending' },
    { status_code: '1', status_desc: 'Approved' },
    { status_code: '2', status_desc: 'Rejected' },
  ],
  trx_rework: [
    { status_code: '0', status_desc: 'Pending' },
    { status_code: '1', status_desc: 'Approved' },
    { status_code: '2', status_desc: 'Rejected' },
  ],
  trx_return: [
    { status_code: '0', status_desc: 'Pending' },
    { status_code: '1', status_desc: 'Approved' },
    { status_code: '2', status_desc: 'Rejected' },
  ],
  trx_disposal: [
    { status_code: '0', status_desc: 'Pending' },
    { status_code: '1', status_desc: 'Approved' },
    { status_code: '2', status_desc: 'Rejected' },
  ],
  trx_decomissioning: [
    { status_code: '0', status_desc: 'Pending' },
    { status_code: '1', status_desc: 'Approved' },
    { status_code: '2', status_desc: 'Rejected' },
  ],
  trx_decomissioning_activate: [
    { status_code: '0', status_desc: 'Decommission' },
    { status_code: '1', status_desc: 'Commission' },
  ],
  pre_inbound: [
    { status_code: '0', status_desc: 'Booked' },
    { status_code: '1', status_desc: 'Done' },
  ],
  upload_file_xml: [
    { status_code: '0', status_desc: 'Uploaded' },
    { status_code: '1', status_desc: 'Done' },
    { status_code: '2', status_desc: 'Canceled' },
    { status_code: '3', status_desc: 'Generated' },
  ],

  // ===== Produksi =====
  production_batch_list: [
    { status_code: '0', status_desc: 'Waiting' },
    { status_code: '1', status_desc: 'Closed' },
    { status_code: '2', status_desc: 'Canceled' },
    { status_code: '3', status_desc: 'Ready' },
    { status_code: '4', status_desc: 'In Progress' },
    { status_code: '10', status_desc: 'Generating Serials' },
  ],

  // ===== BPOM / CSV =====
  bpom_transaction: [
    { status_code: 'success', status_desc: 'Success' },
    { status_code: 'waiting', status_desc: 'Waiting' },
    { status_code: 'fail', status_desc: 'Fail' },
  ],
  generate_csv: [
    { status_code: '0', status_desc: 'Waiting' },
    { status_code: '1', status_desc: 'Approved' },
    { status_code: '2', status_desc: 'Rejected' },
  ],

  // ===== Stock Serial =====
  product_stock_serial: [
    { status_code: '1', status_desc: 'Active' },
    { status_code: '10', status_desc: 'Indirect Request' },
    { status_code: '11', status_desc: 'Destroyed' },
    { status_code: '69', status_desc: 'Pending' },
    { status_code: '91', status_desc: 'Sold' },
    { status_code: '203', status_desc: 'Picking Done' },
    { status_code: '206', status_desc: 'Destroyed (Return Ext)' },
    { status_code: '901', status_desc: 'Inactive' },
    { status_code: '902', status_desc: 'Reworked' },
  ],

  // ===== Report =====
  report_stock: [
    { status_code: 'include_pending', status_desc: 'Include Pending' },
    { status_code: 'exclude_pending', status_desc: 'Exclude Pending' },
  ],

  // ===== System =====
  sys_audit_trail: [
    { status_code: '0', status_desc: 'Failed' },
    { status_code: '1', status_desc: 'Success' },
  ],
};

export const getStatusDesc = async (param = {}) => {
  const tableName = param && param.table_name;
  const data = STATUS_DESC[tableName] || [];
  return { data };
};