import * as components from './componentImports';

export default function configRoutes() {
  return [
    {
      path: '/',
      redirect: '/home',
      name: 'TheContainer',
      meta: {
        login: true,
      },
      component: components.TheContainer,
      children: [
        {
          path: 'home',
          name: 'Home',
          component: components.Home,
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: components.Dashboard,
        },
        {
          path: 'master',
          redirect: '/master/product',
          name: 'Master',
          component: {
            render(c) {
              return c('router-view');
            },
          },
          meta: { login: true },
          children: [
            {
              path: 'product/:type/:id',
              name: 'Product (Details) ',
              component: components.FormProduct,
              meta: { login: true },
            },
            {
              path: 'product/:type',
              name: 'Product (Details)',
              component: components.FormProduct,
              meta: { login: true },
            },
            {
              path: 'product',
              name: 'Product (Home)',
              component: components.ListProduct,
              meta: { login: true },
            },
            {
              path: 'product_category/:type/:id',
              name: 'Product Category (Details) ',
              component: components.FormProductCategory,
              meta: { login: true },
            },
            {
              path: 'product_category/:type',
              name: 'Product Category (Details)',
              component: components.FormProductCategory,
              meta: { login: true },
            },
            {
              path: 'product_category',
              name: 'Product Category (Home)',
              component: components.ListProductCategory,
              meta: { login: true },
            },
            {
              path: 'supplier/:type/:id',
              name: 'Supplier (Details) ',
              component: components.FormSupplier,
              meta: { login: true },
            },
            {
              path: 'supplier/:type',
              name: 'Supplier (Details)',
              component: components.FormSupplier,
              meta: { login: true },
            },
            {
              path: 'supplier',
              name: 'Supplier (Home)',
              component: components.ListSupplier,
              meta: { login: true },
            },
            {
              path: 'customer/:type/:id',
              name: 'Customer (Details) ',
              component: components.FormCustomer,
              meta: { login: true },
            },
            {
              path: 'customer/:type',
              name: 'Customer (Details)',
              component: components.FormCustomer,
              meta: { login: true },
            },
            {
              path: 'customer',
              name: 'Customer (Home)',
              component: components.ListCustomer,
              meta: { login: true },
            },
            {
              path: 'warehouse/:type/:id',
              name: 'Warehouse (Details) ',
              component: components.FormWarehouse,
              meta: { login: true },
            },
            {
              path: 'warehouse/:type',
              name: 'Warehouse (Details)',
              component: components.FormWarehouse,
              meta: { login: true },
            },
            {
              path: 'warehouse',
              name: 'Warehouse (Home)',
              component: components.ListWarehouse,
              meta: { login: true },
            },
            {
              path: 'packaging/:type/:id',
              name: 'Packaging (Details) ',
              component: components.FormPackaging,
              meta: { login: true },
            },
            {
              path: 'packaging/:type',
              name: 'Packaging (Details)',
              component: components.FormPackaging,
              meta: { login: true },
            },
            {
              path: 'packaging',
              name: 'Packaging (Home)',
              component: components.ListPackaging,
              meta: { login: true },
            },
          ],
        },
        {
          path: 'setting',
          redirect: '/dashboard',
          name: 'Setting',
          component: {
            render(c) {
              return c('router-view');
            },
          },
          meta: { login: true },
          children: [
            {
              path: 'user/:type/:id',
              name: 'User (Details) ',
              component: components.FormUser,
              meta: { login: true },
            },
            {
              path: 'user/:type',
              name: 'User (Details)',
              component: components.FormUser,
              meta: { login: true },
            },
            {
              path: 'user',
              name: 'User (Home)',
              component: components.ListUser,
              meta: { login: true },
            },
            {
              path: 'role/:type/:id',
              name: 'Role (Details) ',
              component: components.FormRole,
              meta: { login: true },
            },
            {
              path: 'role/:type',
              name: 'Role (Details)',
              component: components.FormRole,
              meta: { login: true },
            },
            {
              path: 'role',
              name: 'Role (Home)',
              component: components.ListRole,
              meta: { login: true },
            },
            {
              path: 'role-station/:type/:id',
              name: 'Role Station (Details) ',
              component: components.FormRoleStation,
              meta: { login: true },
            },
            {
              path: 'role-station/:type',
              name: 'Role Station (Details)',
              component: components.FormRoleStation,
              meta: { login: true },
            },
            {
              path: 'role-station',
              name: 'Role Station (Home)',
              component: components.ListRoleStation,
              meta: { login: true },
            },
            {
              path: 'department/:type/:id',
              name: 'Department (Details) ',
              component: components.FormDepartment,
              meta: { login: true },
            },
            {
              path: 'department/:type',
              name: 'Department (Details)',
              component: components.FormDepartment,
              meta: { login: true },
            },
            {
              path: 'department',
              name: 'Department (Home)',
              component: components.ListDepartment,
              meta: { login: true },
            },
            {
              path: 'section/:type/:id',
              name: 'Section (Details) ',
              meta: { login: true },
              component: components.FormSection,
            },
            {
              path: 'section/:type',
              name: 'Section (Details)',
              meta: { login: true },
              component: components.FormSection,
            },
            {
              path: 'section',
              name: 'Section (Home)',
              meta: { login: true },
              component: components.ListSection,
            },
            {
              path: 'workflow/:type/:id',
              name: 'Workflow (Details) ',
              meta: { login: true },
              component: components.FormWorkflow,
            },
            {
              path: 'workflow',
              name: 'Workflow (Home)',
              meta: { login: true },
              component: components.ListWorkflow,
            },
          ],
        },
        {
          path: 'transaction',
          redirect: '/transaction/inbound',
          name: 'Transaction',
          meta: { login: true },
          watch: {
            $route: {
              immediate: true,
              handler() {},
            },
          },
          component: {
            render(c) {
              return c('router-view');
            },
          },
          children: [
            {
              path: 'indirect_request/:type/:id',
              name: 'Indirect Request (Details) ',
              meta: { login: true },
              component: components.DetailSampling,
            },
            {
              path: 'indirect_request',
              name: 'Indirect Request (Home)',
              meta: { login: true },
              component: components.ListSampling,
            },
            {
              path: 'picking_list/:type/:id',
              name: 'Picking List (Details) ',
              meta: { login: true },
              component: components.DetailPickingList,
            },
            {
              path: 'picking_list/:type',
              name: 'Picking List (Details)',
              meta: { login: true },
              component: components.FormPickingList,
            },
            {
              path: 'picking_list',
              name: 'Picking List (Home)',
              meta: { login: true },
              component: components.ListPickingList,
            },
            {
              path: 'upload_xml/:type/:id',
              name: 'Upload XML (Details) ',
              meta: { login: true },
              component: components.DetailUploadXML,
            },
            {
              path: 'upload_xml/:type',
              name: 'Upload XML (Details)',
              meta: { login: true },
              component: components.FormUploadXML,
            },
            {
              path: 'upload_xml',
              name: 'Upload XML (Home)',
              meta: { login: true },
              component: components.ListUploadXML,
            },
            {
              path: 'pre-inbound/:type/:id',
              name: 'Pre Inbound (Details) ',
              meta: { login: true },
              component: components.DetailPreInbound,
            },
            {
              path: 'pre-inbound',
              name: 'Pre Inbound (Home)',
              meta: { login: true },
              component: components.ListPreInbound,
            },
            {
              path: 'inbound/:type/:id',
              name: 'Inbound (Details) ',
              meta: { login: true },
              component: components.DetailInbound,
            },
            {
              path: 'inbound',
              name: 'Inbound (Home)',
              meta: { login: true },
              component: components.ListInbound,
            },
            {
              path: 'outbound/:type/:id',
              name: 'Outbound (Details) ',
              meta: { login: true },
              component: components.DetailOutbound,
            },
            {
              path: 'outbound',
              name: 'Outbound (Home)',
              meta: { login: true },
              component: components.ListOutbound,
            },
            {
              path: 'return/:type/:id',
              name: 'Stock Return (Details) ',
              meta: { login: true },
              component: components.DetailReturn,
            },
            {
              path: 'return',
              name: 'Stock Return (Home)',
              meta: { login: true },
              component: components.ListReturn,
            },
            {
              path: 'disposal/:type/:id',
              name: 'Disposal (Details) ',
              meta: { login: true },
              component: components.DetailDisposal,
            },
            {
              path: 'disposal',
              name: 'Disposal (Home)',
              meta: { login: true },
              component: components.ListDisposal,
            },
            {
              path: 'rework/:type/:id',
              name: 'Rework (Details) ',
              meta: { login: true },
              component: components.DetailRework,
            },
            {
              path: 'rework',
              name: 'Rework (Home)',
              meta: { login: true },
              component: components.ListRework,
            },
            {
              path: 'aggregation/:type/:id',
              name: 'Aggregation (Details) ',
              meta: { login: true },
              component: components.DetailAggregation,
            },
            {
              path: 'aggregation',
              name: 'Aggregation (Home)',
              meta: { login: true },
              component: components.ListAggregation,
            },
            {
              path: 're-aggregation/:type/:id',
              name: 'Re-Aggregation (Details) ',
              meta: { login: true },
              component: components.DetailReaggregation,
            },
            {
              path: 're-aggregation',
              name: 'Re-Aggregation (Home)',
              meta: { login: true },
              component: components.ListReaggregation,
            },
            {
              path: 'packing/:type/:id',
              name: 'Packing (Details) ',
              meta: { login: true },
              component: components.DetailPacking,
            },
            {
              path: 'packing/:type',
              name: 'Packing (Details)',
              meta: { login: true },
              component: components.FormPacking,
            },
            {
              path: 'packing',
              name: 'Packing (Home)',
              meta: { login: true },
              component: components.ListPacking,
            },
            {
              path: 're-packing/:type/:id',
              name: 'Re-Packing  (Details) ',
              meta: { login: true },
              component: components.DetailRepack,
            },
            {
              path: 're-packing',
              name: 'Re-Packing (Home)',
              meta: { login: true },
              component: components.ListRepack,
            },
            {
              path: 'comm-decomm/:type/:id',
              name: 'Comm/Decomm (Details) ',
              meta: { login: true },
              component: components.DetailDecommissioning,
            },
            {
              path: 'comm-decomm',
              name: 'Comm/Decomm (Home)',
              meta: { login: true },
              component: components.ListDecommissioning,
            },
            {
              path: 'stock_transfer/:type/:id',
              name: 'Stock Transfer (Details) ',
              meta: { login: true },
              component: components.DetailStockTransfer,
            },
            {
              path: 'stock_transfer/:type',
              name: 'Stock Transfer (Details)',
              meta: { login: true },
              component: components.FormStockTransfer,
            },
            {
              path: 'stock_transfer',
              name: 'Stock Transfer (Home)',
              meta: { login: true },
              component: components.ListStockTransfer,
            },
            {
              path: 'stock_opname/:type/:id',
              name: 'Stock Opname (Details) ',
              meta: { login: true },
              component: components.DetailStockOpname,
            },
            {
              path: 'stock_opname/:type',
              name: 'Stock Opname (Details)',
              meta: { login: true },
              component: components.FormStockOpname,
            },
            {
              path: 'stock_opname',
              name: 'Stock Opname (Home)',
              meta: { login: true },
              component: components.ListStockOpname,
            },
            {
              path: 'bpom_reporting',
              name: 'BPOM Reporting (Home)',
              meta: { login: true },
              component: components.ListBpom,
            },
            {
              path: 'queue-bpom',
              name: 'Queue BPOM',
              meta: { login: true },
              component: components.ListQueueBpom,
            },
            {
              path: 'queue-bpom/:type/:id',
              name: 'Queue BPOM (Details)',
              meta: { login: true },
              component: components.DetailQueueBpom,
            },
          ],
        },
        {
          path: 'jastip',
          redirect: '/jastip/dashboard',
          name: 'Jastip',
          meta: { login: true },
          component: {
            render(c) {
              return c('router-view');
            },
          },
          children: [
            {
              path: 'dashboard',
              name: 'Jastip Dashboard',
              meta: { login: true },
              component: components.JastipDashboard,
            },
            {
              path: 'item-registry/:type/:id',
              name: 'Item Registry (Details) ',
              meta: { login: true },
              component: components.JastipFormItemRegistry,
            },
            {
              path: 'item-registry/:type',
              name: 'Item Registry (Details)',
              meta: { login: true },
              component: components.JastipFormItemRegistry,
            },
            {
              path: 'item-registry',
              name: 'Item Registry (Home)',
              meta: { login: true },
              component: components.JastipListItemRegistry,
            },
            {
              path: 'outbound-manifest/:type/:id',
              name: 'Outbound Manifest (Details) ',
              meta: { login: true },
              component: components.JastipFormOutboundManifest,
            },
            {
              path: 'outbound-manifest/:type',
              name: 'Outbound Manifest (Details)',
              meta: { login: true },
              component: components.JastipFormOutboundManifest,
            },
            {
              path: 'outbound-manifest',
              name: 'Outbound Manifest (Home)',
              meta: { login: true },
              component: components.JastipListOutboundManifest,
            },
            {
              path: 'inbound',
              name: 'Inbound (Home)',
              meta: { login: true },
              component: components.JastipListInbound,
            },
            {
              path: 'picking/:type/:id',
              name: 'Picking (Details) ',
              meta: { login: true },
              component: components.JastipFormPicking,
            },
            {
              path: 'picking/:type',
              name: 'Picking (Details)',
              meta: { login: true },
              component: components.JastipFormPicking,
            },
            {
              path: 'picking',
              name: 'Picking (Home)',
              meta: { login: true },
              component: components.JastipListPicking,
            },
            {
              path: 'item-stock',
              name: 'Item Stock (Home)',
              meta: { login: true },
              component: components.JastipListItemStock,
            },
            {
              path: 'item-disposal/:type/:id',
              name: 'Item Disposal (Details) ',
              meta: { login: true },
              component: components.JastipFormItemDisposal,
            },
            {
              path: 'item-disposal/:type',
              name: 'Item Disposal (Details)',
              meta: { login: true },
              component: components.JastipFormItemDisposal,
            },
            {
              path: 'item-disposal',
              name: 'Item Disposal (Home)',
              meta: { login: true },
              component: components.JastipListItemDisposal,
            },
          ],
        },
        {
          path: 'report',
          redirect: '/dashboard',
          name: 'Report',
          meta: { login: true },
          component: {
            render(c) {
              return c('router-view');
            },
          },
          children: [
            {
              path: 'product_batch',
              name: 'Product Batch Report',
              meta: { login: true },
              component: components.ReportProductBatch,
            },
            {
              path: 'audit_trail',
              name: 'Audit Trail',
              meta: { login: true },
              component: components.ListAuditTrail,
            },
            {
              path: 'audit_trail/:type/:id',
              name: 'Audit Trail (Details)',
              meta: { login: true },
              component: components.DetailAuditTrail,
            },
            {
              path: 'show_epc_status',
              name: 'Show EPC Status',
              meta: { login: true },
              component: components.ReportShowStatus,
            },
            {
              path: 'stock',
              name: 'Product Stock',
              meta: { login: true },
              component: components.ReportStock,
            },
            {
              path: 'item-stock',
              name: 'Item Stock',
              meta: { login: true },
              component: components.ItemStock,
            },
          ],
        },
        {
          path: 'configuration',
          redirect: '/dashboard',
          name: 'Configuration',
          meta: { login: true },
          component: {
            render(c) {
              return c('router-view');
            },
          },
          children: [
            {
              path: 'date/:type/:id',
              name: 'Manage Date Format',
              component: components.FormDate,
              meta: { login: true },
            },
            {
              path: 'date/:type',
              name: 'Add Date Format',
              component: components.FormDate,
              meta: { login: true },
            },
            {
              path: 'date',
              name: 'Config Date',
              meta: { login: true },
              component: components.ListDate,
            },
            {
              path: 'station/:type/:id',
              name: 'Station Details',
              component: components.FormStation,
              meta: { login: true },
            },
            {
              path: 'station/:type',
              name: 'Station Add',
              component: components.FormStation,
              meta: { login: true },
            },
            {
              path: 'station',
              name: 'Station',
              meta: { login: true },
              component: components.ListStation,
            },
            {
              path: 'pattern/:type/:id',
              name: 'Pattern Details',
              component: components.FormPattern,
              meta: { login: true },
            },
            {
              path: 'pattern/:type',
              name: 'Pattern Add',
              component: components.FormPattern,
              meta: { login: true },
            },
            {
              path: 'pattern',
              name: 'Pattern',
              meta: { login: true },
              component: components.ListPattern,
            },
            {
              path: 'currency/:type/:id',
              name: 'Currency Details',
              component: components.FormCurrency,
              meta: { login: true },
            },
            {
              path: 'currency/:type',
              name: 'Currency Add',
              component: components.FormCurrency,
              meta: { login: true },
            },
            {
              path: 'currency',
              name: 'Currency',
              meta: { login: true },
              component: components.ListCurrency,
            },
            {
              path: 'metadata/:type/:id',
              name: 'Metadata Details',
              component: components.FormMetadata,
              meta: { login: true },
            },
            {
              path: 'metadata/:type',
              name: 'Metadata Add',
              component: components.FormMetadata,
              meta: { login: true },
            },
            {
              path: 'metadata',
              name: 'Metadata',
              meta: { login: true },
              component: components.ListMetadata,
            },
            {
              path: 'cron-schedule/:type/:id',
              name: 'Cron Details',
              component: components.FormCron,
              meta: { login: true },
            },
            {
              path: 'cron-schedule/:type',
              name: 'Cron Add',
              component: components.FormCron,
              meta: { login: true },
            },
            {
              path: 'cron-schedule',
              name: 'Cron',
              meta: { login: true },
              component: components.ListCron,
            },
            {
              path: 'layout/:type/:id',
              name: 'Manage Layout',
              component: components.FormLayout,
              meta: { login: true },
            },
            {
              path: 'layout/:type',
              name: 'Add Layout',
              component: components.FormLayout,
              meta: { login: true },
            },
            {
              path: 'layout',
              name: 'List Layout',
              component: components.ListLayout,
              meta: { login: true },
            },
            {
              path: 'connector/:type/:id',
              name: 'Manage Connector',
              component: components.FormConnector,
              meta: { login: true },
            },
            {
              path: 'connector/:type',
              name: 'Add Connector',
              component: components.FormConnector,
              meta: { login: true },
            },
            {
              path: 'connector',
              name: 'List Connector',
              component: components.ListConnector,
              meta: { login: true },
            },
            {
              path: 'connector_action/:type/:id',
              name: 'Manage Connector Action',
              component: components.FormConnectorAct,
              meta: { login: true },
            },
            {
              path: 'connector_action/:type',
              name: 'Add Connector Action',
              component: components.FormConnectorAct,
              meta: { login: true },
            },
            {
              path: 'connector_action',
              name: 'List Connector Action',
              component: components.ListConnectorAct,
              meta: { login: true },
            },
          ],
        },
        {
          path: 'maintenance',
          redirect: '/dashboard',
          name: 'Maintenance',
          meta: { login: true },
          component: {
            render(c) {
              return c('router-view');
            },
          },
          children: [
            {
              path: 'log',
              name: 'Database Log',
              meta: { login: true },
              component: components.MaintenanceLog,
            },
            {
              path: 'database-backup',
              name: 'Database Backup',
              meta: { login: true },
              component: components.DatabaseBackup,
            },
            {
              path: 'database-restore',
              name: 'Database Restore',
              meta: { login: true },
              component: components.DatabaseRestore,
            },
          ],
        },
        {
          path: 'system',
          redirect: '/dashboard',
          name: 'System',
          meta: { login: true },
          component: {
            render(c) {
              return c('router-view');
            },
          },
          children: [
            {
              path: 'application',
              name: 'System Configuration (Details)',
              meta: { login: true },
              component: components.SystemApplication,
            },
            {
              path: 'menu',
              name: 'System Menu ',
              meta: { login: true },
              component: components.SystemMenu,
            },
            {
              path: 'script-injection/:type/:id',
              name: 'Script Injection (Details)',
              component: components.FormSystemScriptInj,
              meta: { login: true },
            },
            {
              path: 'script-injection/:type',
              name: 'Script Injection (Create)',
              component: components.FormSystemScriptInj,
              meta: { login: true },
            },
            {
              path: 'script-injection',
              name: 'Script Injection (Home)',
              component: components.ListSystemScriptInj,
              meta: { login: true },
            },
          ],
        },
        {
          path: 'system-process',
          redirect: '/dashboard',
          name: 'System Process',
          meta: { login: true },
          component: {
            render(c) {
              return c('router-view');
            },
          },
          children: [
            {
              path: 'process-schedule',
              name: 'Process Schedule (Home)',
              component: components.ListProcessSchedule,
              meta: { login: true },
            },
            {
              path: 'process-queue',
              name: 'Process Queue (Home)',
              component: components.ListProcessQueue,
              meta: { login: true },
            },
          ],
        },
        {
          path: 'development_tools',
          redirect: '/dashboard',
          name: 'Development Tools',
          meta: { login: true },
          component: {
            render(c) {
              return c('router-view');
            },
          },
          children: [
            {
              path: 'barcode_generator',
              name: 'Barcode Generator (Home)',
              meta: { login: true },
              component: components.ListBarcodeGenerator,
            },
            {
              path: 'manual_barcode_generator',
              name: 'Manual Barcode Generator (Home)',
              meta: { login: true },
              component: components.ManualBarcodeGenerator,
            },
            {
              path: 'bpom_compare_tool',
              name: 'BPOM Compare Tool (Home)',
              meta: { login: true },
              component: components.BpomCompareTool,
            },
          ],
        },
        {
          path: 'production',
          redirect: '/home',
          name: 'Production',
          meta: { login: true },
          component: {
            render(c) {
              return c('router-view');
            },
          },
          children: [
            {
              path: 'process-order/:type/:id',
              name: 'Process Order (Details) ',
              component: components.FormProcessOrder,
              meta: { login: true },
            },
            {
              path: 'process-order/:type',
              name: 'Process Order (Details)',
              component: components.FormProcessOrder,
              meta: { login: true },
            },
            {
              path: 'process-order',
              name: 'Process Order (Home)',
              component: components.ListProcessOrder,
              meta: { login: true },
            },
          ],
        },
        {
          path: 'setting/user-setting',
          name: 'Setting User',
          component: components.UserSetting,
        },
      ],
    },
    {
      path: '/',
      redirect: '/login',
      name: 'Pages',
      component: {
        render(c) {
          return c('router-view');
        },
      },
      meta: { login: false },
      children: [
        {
          path: '/oops',
          name: 'oopsPage',
          component: components.Oops,
          meta: { login: false },
        },
        {
          path: '/404',
          name: 'Page404',
          component: components.Page404,
          meta: { login: false },
        },
        {
          path: '/500',
          name: 'Page500',
          component: components.Page500,
          meta: { login: false },
        },
        {
          path: '/login',
          name: 'Login',
          component: components.Login,
          meta: { login: false },
        },
        {
          path: '/change-password',
          name: 'ChangePassword',
          component: components.ChangePassword,
          meta: { login: false },
        },
        {
          path: '/register',
          name: 'Register',
          component: components.Register,
          meta: { login: false },
        },
      ],
    },
  ];
}
