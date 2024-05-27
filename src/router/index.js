import Vue from 'vue';
import Router from 'vue-router';

// Containers
const TheContainer = () => import('@/containers/TheContainer');

// Views
const Home = () => import('@/views/Home');

// Views
const Dashboard = () => import('@/views/Dashboard');

// Views - Pages
const Oops = () => import('@/views/pages/Oops');
const Page404 = () => import('@/views/pages/Page404');
const Page500 = () => import('@/views/pages/Page500');
const Login = () => import('@/views/pages/Login');
const Register = () => import('@/views/pages/Register');

// ========================MASTER========================
// Supplier
const FormSupplier = () => import('@/views/master/supplier/FormSupplier');
const ListSupplier = () => import('@/views/master/supplier/ListSupplier');
// Customer
const FormCustomer = () => import('@/views/master/customer/FormCustomer');
const ListCustomer = () => import('@/views/master/customer/ListCustomer');
// ListWarehouse
const ListWarehouse = () => import('@/views/master/warehouse/ListWarehouse');
const FormWarehouse = () => import('@/views/master/warehouse/FormWarehouse');
//Product Categories
const ListProductCategory = () =>
  import('@/views/master/product_category/ListProductCategory');
const FormProductCategory = () =>
  import('@/views/master/product_category/FormProductCategory');
// Product Article
const ListProduct = () => import('@/views/master/product/ListProduct');
const FormProduct = () =>
  // getUserId() == 0
  // ? import("@/views/master/product/FormProduct_v2")
  //   : import("@/views/master/product/FormProduct");
  import('@/views/master/product/FormProduct_v2');
// Packaging
const ListPackaging = () => import('@/views/master/packaging/ListPackaging');
const FormPackaging = () => import('@/views/master/packaging/FormPackaging');
// ========================MASTER========================

// ========================SETTING========================
// User
const UserSetting = () => import('@/views/settings/user/Setting');
const ListUser = () => import('@/views/settings/user/ListUser');
const FormUser = () => import('@/views/settings/user/FormUser');
// Role
const ListRole = () => import('@/views/settings/role/ListRole');
const FormRole = () => import('@/views/settings/role/FormRole');
// Workflow
const ListWorkflow = () => import('@/views/settings/workflow/ListWorkflow');
const FormWorkflow = () => import('@/views/settings/workflow/FormWorkflow');
// Department
const ListDepartment = () =>
  import('@/views/settings/department/ListDepartment');
const FormDepartment = () =>
  import('@/views/settings/department/FormDepartment');
// Section
const ListSection = () => import('@/views/settings/section/ListSection');
const FormSection = () => import('@/views/settings/section/FormSection ');
// ========================SETTING========================

// ========================PRODUCTION========================
// Proccess Order
const ListProccessOrder = () =>
  import('@/views/production/proccess_order/ListProccessOrder');
// Picking List
const FormProccessOrder = () =>
  import('@/views/production/proccess_order/FormProccessOrder');
// ========================TRANSACTION========================
// Picking List
const ListPickingList = () =>
  import('@/views/transactions/pickingList/ListPickingList');
const FormPickingList = () =>
  import('@/views/transactions/pickingList/FormPickingList');
const DetailPickingList = () =>
  import('@/views/transactions/pickingList/DetailPickingList');
// Upload XML
const FormUploadXML = () => import('@/views/transactions/upload/FormUploadXML');
const DetailUploadXML = () =>
  import('@/views/transactions/upload/DetailUploadXML');
const ListUploadXML = () => import('@/views/transactions/upload/ListUploadXML');
// Pre-Inbound
const ListPreInbound = () =>
  import('@/views/transactions/pre-inbound/ListPreInbound');
const DetailPreInbound = () =>
  import('@/views/transactions/pre-inbound/DetailPreInbound');
// Inbound
const ListInbound = () => import('@/views/transactions/inbound/ListInbound');
const DetailInbound = () =>
  import('@/views/transactions/inbound/DetailInbound');
// Outbound
const ListOutbound = () => import('@/views/transactions/outbound/ListOutbound');
const DetailOutbound = () =>
  import('@/views/transactions/outbound/DetailOutbound');
// Return
const ListReturn = () => import('@/views/transactions/return/ListReturn');
const DetailReturn = () => import('@/views/transactions/return/DetailReturn');
// Disposal
const ListDisposal = () => import('@/views/transactions/disposal/ListDisposal');
const DetailDisposal = () =>
  import('@/views/transactions/disposal/DetailDisposal');
// Rework
const ListRework = () => import('@/views/transactions/rework/ListRework');
const DetailRework = () => import('@/views/transactions/rework/DetailRework');
// Transfer
const ListStockTransfer = () =>
  import('@/views/transactions/transfer/ListStockTransfer');
const FormStockTransfer = () =>
  import('@/views/transactions/transfer/FormStockTransfer');
const DetailStockTransfer = () =>
  import('@/views/transactions/transfer/DetailStockTransfer');
// Stock Opame
const ListStockOpname = () =>
  import('@/views/transactions/stockOpname/ListStockOpname');
const FormStockOpname = () =>
  import('@/views/transactions/stockOpname/FormStockOpname');
const DetailStockOpname = () =>
  import('@/views/transactions/stockOpname/DetailStockOpname');
//Sampling
const ListSampling = () => import('@/views/transactions/sampling/ListSampling');
const DetailSampling = () =>
  import('@/views/transactions/sampling/DetailSampling');
//Aggregation
const ListAggregation = () =>
  import('@/views/transactions/aggregation/ListAggregation');
const DetailAggregation = () =>
  import('@/views/transactions/aggregation/DetailAggregation');
//Reaggregation
const ListReaggregation = () =>
  import('@/views/transactions/reaggregation/ListReaggregation');
const DetailReaggregation = () =>
  import('@/views/transactions/reaggregation/DetailReaggregation');
//Decomissioning
const ListDecommissioning = () =>
  import('@/views/transactions/decommissioning/ListDecommissioning');
const DetailDecommissioning = () =>
  import('@/views/transactions/decommissioning/DetailDecommissioning');
//Packing
const ListPacking = () => import('@/views/transactions/packing/ListPacking');
const DetailPacking = () =>
  import('@/views/transactions/packing/DetailPacking');
const FormPacking = () => import('@/views/transactions/packing/FormPacking');
//Repack
const ListRepack = () => import('@/views/transactions/repack/ListRepack');
const DetailRepack = () => import('@/views/transactions/repack/DetailRepack');
// BPOM
const ListBpom = () => import('@/views/transactions/bpom/ListBpom');
// QUEUE BPOM
const ListQueueBpom = () =>
  import('@/views/transactions/queue_bpom/ListQueueBpom');
const DetailQueueBpom = () =>
  import('@/views/transactions/queue_bpom/DetailQueueBpom');
// ========================TRANSACTION========================

// ========================REPORT========================
const ReportProductBatch = () => import('@/views/reports/ReportProductBatch');
const ReportStock = () => import('@/views/reports/ReportStock');
const ListAuditTrail = () =>
  import('@/views/reports/AuditTrail/ListAuditTrail');
const DetailAuditTrail = () =>
  import('@/views/reports/AuditTrail/DetailAuditTrail');
const ReportShowStatus = () => import('@/views/reports/ReportShowStatus');
// ========================REPORT========================

// ========================CONFIGURATION========================
const ConfApplication = () =>
  import('@/views/configuration/application/ConfApplication');
// Conf Date
const ListDate = () => import('@/views/configuration/date/ListDate');
const FormDate = () => import('@/views/configuration/date/FormDate');
// Conf Layout
const ListLayout = () => import('@/views/configuration/layout/ListLayout');
const FormLayout = () => import('@/views/configuration/layout/FormLayout');
// Conf Connector
const ListConnector = () =>
  import('@/views/configuration/connector/ListConnector');
const FormConnector = () =>
  import('@/views/configuration/connector/FormConnector');
// Conf Connector Action
const ListConnectorAct = () =>
  import('@/views/configuration/connector_action/ListConnectorAct');
const FormConnectorAct = () =>
  import('@/views/configuration/connector_action/FormConnectorAct');
// ========================CONFIGURATION========================
// ========================DEVELOPMENT TOOLS========================
const ListBarcodeGenerator = () =>
  import('@/views/development_tools/BarcodeGenerator/ListBarcodeGenerator');
const ManualBarcodeGenerator = () =>
  import(
    '@/views/development_tools/ManualBarcodeGenerator/ManualBarcodeGenerator'
  );
// ========================CONFIGURATION========================
Vue.use(Router);
let router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes(),
});

router.beforeEach((to, from, next) => {
  // menuToRouter(localStorage.getItem("menu"));
  // return next("/dashboard");
  //   if (to.meta.login) {
  //     if (localStorage.hasOwnProperty("is_login")) {
  //       // if (to.meta.check) return next()
  //       if (localStorage.getItem("super_admin") == "true") {
  //         return next();
  //       } else {
  //         if (to.path == "/setting/configuration") {
  //           return next("/dashboard");
  //         }
  //       }
  // let getChildMenu = JSON.parse(localStorage.getItem("userRole"));
  //       let findMenu = getChildMenu.find((el) => el.linkNew == to.path);
  //       if (findMenu != undefined) {
  //         if (findMenu.canView == "true") {
  //           return next();
  //         } else {
  //           if (to.path == "/dashboard") return next("/oops");
  //           return next("/dashboard");
  //         }
  //       } else {
  //         // let explodeLink = to.path.split('/')
  //         // let makeNewLink = `/${explodeLink[1]}/${explodeLink[2]}`
  //         // let findMenu = getChildMenu.filter((e) => to.path.split(e.linkNew) > 1)
  //         // return next('/dashboard');
  //         return next();
  //       }
  //     } else {
  //       return next("/login");
  //     }
  //   } else {
  //     if (localStorage.hasOwnProperty("token")) {
  //       if (to.path == "/oops") return next();
  //       return next("/dashboard");
  //     }
  //   }
  return next();
});

export default router;

function configRoutes() {
  var tempRoute = [
    {
      path: 'home',
      name: 'Home',
      component: Home,
    },
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    // MASTER
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
        // PRODUCT
        {
          path: 'product/:type/:id',
          name: 'Product (Details) ',
          component: FormProduct,
          meta: { login: true },
        },
        {
          path: 'product/:type',
          name: 'Product (Details)',
          component: FormProduct,
          meta: { login: true },
        },
        {
          path: 'product',
          name: 'Product (Home)',
          component: ListProduct,
          meta: { login: true },
        },
        // PRODUCT CATEGORY
        {
          path: 'product_category/:type/:id',
          name: 'Product Category (Details) ',
          component: FormProductCategory,
          meta: { login: true },
        },
        {
          path: 'product_category/:type',
          name: 'Product Category (Details)',
          component: FormProductCategory,
          meta: { login: true },
        },
        {
          path: 'product_category',
          name: 'Product Category (Home)',
          component: ListProductCategory,
          meta: { login: true },
        },
        // SUPPLIER
        {
          path: 'supplier/:type/:id',
          name: 'Supplier (Details) ',
          component: FormSupplier,
          meta: { login: true },
        },
        {
          path: 'supplier/:type',
          name: 'Supplier (Details)',
          component: FormSupplier,
          meta: { login: true },
        },
        {
          path: 'supplier',
          name: 'Supplier (Home)',
          component: ListSupplier,
          meta: { login: true },
        },
        // CUSTOMER
        {
          path: 'customer/:type/:id',
          name: 'Customer (Details) ',
          component: FormCustomer,
          meta: {
            login: true,
          },
        },
        {
          path: 'customer/:type',
          name: 'Customer (Details)',
          component: FormCustomer,
          meta: {
            login: true,
          },
        },
        {
          path: 'customer',
          name: 'Customer (Home)',
          component: ListCustomer,
          meta: { login: true },
        },
        // WAREHOUSE
        {
          path: 'warehouse/:type/:id',
          name: 'Warehouse (Details) ',
          component: FormWarehouse,
          meta: { login: true },
        },
        {
          path: 'warehouse/:type',
          name: 'Warehouse (Details)',
          component: FormWarehouse,
          meta: { login: true },
        },
        {
          path: 'warehouse',
          name: 'Warehouse (Home)',
          component: ListWarehouse,
          meta: { login: true },
        },
        // PACKAGING
        {
          path: 'packaging/:type/:id',
          name: 'Packaging (Details) ',
          component: FormPackaging,
          meta: { login: true },
        },
        {
          path: 'packaging/:type',
          name: 'Packaging (Details)',
          component: FormPackaging,
          meta: { login: true },
        },
        {
          path: 'packaging',
          name: 'Packaging (Home)',
          component: ListPackaging,
          meta: { login: true },
        },
      ],
    },
    // SETTING
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
        // USERS
        {
          path: 'user/:type/:id',
          name: 'User (Details) ',
          component: FormUser,
          meta: { login: true },
        },
        {
          path: 'user/:type',
          name: 'User (Details)',
          component: FormUser,
          meta: { login: true },
        },
        {
          path: 'user',
          name: 'User (Home)',
          component: ListUser,
          meta: { login: true },
        },
        // ROLES
        {
          path: 'role/:type/:id',
          name: 'Role (Details) ',
          component: FormRole,
          meta: { login: true },
        },
        {
          path: 'role/:type',
          name: 'Role (Details)',
          component: FormRole,
          meta: { login: true },
        },
        {
          path: 'role',
          name: 'Role (Home)',
          component: ListRole,
          meta: { login: true },
        },
        // DEPARTMENT
        {
          path: 'department/:type/:id',
          name: 'Department (Details) ',
          component: FormDepartment,
          meta: { login: true },
        },
        {
          path: 'department/:type',
          name: 'Department (Details)',
          component: FormDepartment,
          meta: { login: true },
        },
        {
          path: 'department',
          name: 'Department (Home)',
          component: ListDepartment,
          meta: { login: true },
        },
        // SECTION
        {
          path: 'section/:type/:id',
          name: 'Section (Details) ',
          meta: { login: true },
          component: FormSection,
        },
        {
          path: 'section/:type',
          name: 'Section (Details)',
          meta: { login: true },
          component: FormSection,
        },
        {
          path: 'section',
          name: 'Section (Home)',
          meta: { login: true },
          component: ListSection,
        },
        // WORKFLOEW
        {
          path: 'workflow/:type/:id',
          name: 'Workflow (Details) ',
          meta: { login: true },
          component: FormWorkflow,
        },
        {
          path: 'workflow',
          name: 'Workflow (Home)',
          meta: { login: true },
          component: ListWorkflow,
        },
      ],
    },
    // TRANSACTION
    {
      path: 'transaction',
      redirect: '/transaction/inbound',
      name: 'Transaction',
      meta: { login: true },
      watch: {
        $route: {
          immediate: true,
          handler(route) {},
        },
      },
      component: {
        render(c) {
          return c('router-view');
        },
      },
      children: [
        // INDIRECT REQUEST
        {
          path: 'indirect_request/:type/:id',
          name: 'Indirect Request (Details) ',
          meta: { login: true },
          component: DetailSampling,
        },
        {
          path: 'indirect_request',
          name: 'Indirect Request (Home)',
          meta: { login: true },
          component: ListSampling,
        },
        // PICKING LIST
        {
          path: 'picking_list/:type/:id',
          name: 'Picking List (Details) ',
          meta: { login: true },
          component: DetailPickingList,
        },
        {
          path: 'picking_list/:type',
          name: 'Picking List (Details)',
          meta: { login: true },
          component: FormPickingList,
        },
        {
          path: 'picking_list',
          name: 'Picking List (Home)',
          meta: { login: true },
          component: ListPickingList,
        },
        // UPLOAD XML
        {
          path: 'upload_xml/:type/:id',
          name: 'Upload XML (Details) ',
          meta: { login: true },
          component: DetailUploadXML,
        },
        {
          path: 'upload_xml/:type',
          name: 'Upload XML (Details)',
          meta: { login: true },
          component: FormUploadXML,
        },
        {
          path: 'upload_xml',
          name: 'Upload XML (Home)',
          meta: { login: true },
          component: ListUploadXML,
        },
        // PRE INBOUND
        {
          path: 'pre-inbound/:type/:id',
          name: 'Pre Inbound (Details) ',
          meta: { login: true },
          component: DetailPreInbound,
        },
        {
          path: 'pre-inbound',
          name: 'Pre Inbound (Home)',
          meta: { login: true },
          component: ListPreInbound,
        },
        // INBOUND
        {
          path: 'inbound/:type/:id',
          name: 'Inbound (Details) ',
          meta: { login: true },
          component: DetailInbound,
        },
        {
          path: 'inbound',
          name: 'Inbound (Home)',
          meta: { login: true },
          component: ListInbound,
        },
        // OUTBOUND
        {
          path: 'outbound/:type/:id',
          name: 'Outbound (Details) ',
          meta: { login: true },
          component: DetailOutbound,
        },
        {
          path: 'outbound',
          name: 'Outbound (Home)',
          meta: { login: true },
          component: ListOutbound,
        },
        // RETURN
        {
          path: 'return/:type/:id',
          name: 'Stock Return (Details) ',
          meta: { login: true },
          component: DetailReturn,
        },
        {
          path: 'return',
          name: 'Stock Return (Home)',
          meta: { login: true },
          component: ListReturn,
        },
        // DISPOSAL
        {
          path: 'disposal/:type/:id',
          name: 'Disposal (Details) ',
          meta: { login: true },
          component: DetailDisposal,
        },
        {
          path: 'disposal',
          name: 'Disposal (Home)',
          meta: { login: true },
          component: ListDisposal,
        },
        // REWORK
        {
          path: 'rework/:type/:id',
          name: 'Rework (Details) ',
          meta: { login: true },
          component: DetailRework,
        },
        {
          path: 'rework',
          name: 'Rework (Home)',
          meta: { login: true },
          component: ListRework,
        },
        // AGGREGATION
        {
          path: 'aggregation/:type/:id',
          name: 'Aggregation (Details) ',
          meta: { login: true },
          component: DetailAggregation,
        },
        {
          path: 'aggregation',
          name: 'Aggregation (Home)',
          meta: { login: true },
          component: ListAggregation,
        },
        // REAGGREGATION
        {
          path: 're-aggregation/:type/:id',
          name: 'Re-Aggregation (Details) ',
          meta: { login: true },
          component: DetailReaggregation,
        },
        {
          path: 're-aggregation',
          name: 'Re-Aggregation (Home)',
          meta: { login: true },
          component: ListReaggregation,
        },
        // PACKING
        {
          path: 'packing/:type/:id',
          name: 'Packing (Details) ',
          meta: { login: true },
          component: DetailPacking,
        },
        {
          path: 'packing/:type',
          name: 'Packing (Details)',
          meta: { login: true },
          component: FormPacking,
        },
        {
          path: 'packing',
          name: 'Packing (Home)',
          meta: { login: true },
          component: ListPacking,
        },
        // REPACKING
        {
          path: 're-packing/:type/:id',
          name: 'Re-Packing  (Details) ',
          meta: { login: true },
          component: DetailRepack,
        },
        {
          path: 're-packing',
          name: 'Re-Packing (Home)',
          meta: { login: true },
          component: ListRepack,
        },
        // DECOMMISION
        {
          path: 'comm-decomm/:type/:id',
          name: 'Comm/Decomm (Details) ',
          meta: { login: true },
          component: DetailDecommissioning,
        },
        {
          path: 'comm-decomm',
          name: 'Comm/Decomm (Home)',
          meta: { login: true },
          component: ListDecommissioning,
        },
        // STOCK TRANSFER
        {
          path: 'stock_transfer/:type/:id',
          name: 'Stock Transfer (Details) ',
          meta: { login: true },
          component: DetailStockTransfer,
        },
        {
          path: 'stock_transfer/:type',
          name: 'Stock Transfer (Details)',
          meta: { login: true },
          component: FormStockTransfer,
        },
        {
          path: 'stock_transfer',
          name: 'Stock Transfer (Home)',
          meta: { login: true },
          component: ListStockTransfer,
        },
        // STOCK OPNAME
        {
          path: 'stock_opname/:type/:id',
          name: 'Stock Opname (Details) ',
          meta: { login: true },
          component: DetailStockOpname,
        },
        {
          path: 'stock_opname/:type',
          name: 'Stock Opname (Details)',
          meta: { login: true },
          component: FormStockOpname,
        },
        {
          path: 'stock_opname',
          name: 'Stock Opname (Home)',
          meta: { login: true },
          component: ListStockOpname,
        },
        // BPOM
        {
          path: 'bpom_reporting',
          name: 'BPOM Reporting (Home)',
          meta: { login: true },
          component: ListBpom,
        },
        // Queue BPOM
        {
          path: 'queue-bpom',
          name: 'Queue BPOM',
          meta: { login: true },
          component: ListQueueBpom,
        },
        {
          path: 'queue-bpom/:type/:id',
          name: 'Queue BPOM (Details)',
          meta: { login: true },
          component: DetailQueueBpom,
        },
      ],
    },
    // REPORT
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
          component: ReportProductBatch,
        },
        {
          path: 'audit_trail',
          name: 'Audit Trail',
          meta: { login: true },
          component: ListAuditTrail,
        },
        {
          path: 'audit_trail/:type/:id',
          name: 'Audit Trail (Details)',
          meta: { login: true },
          component: DetailAuditTrail,
        },
        {
          path: 'show_epc_status',
          name: 'Show EPC Status',
          meta: { login: true },
          component: ReportShowStatus,
        },
        {
          path: 'stock',
          name: 'Product Stock',
          meta: { login: true },
          component: ReportStock,
        },
      ],
    },
    // CONFIGURATION
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
        // CONF APPLICATION
        {
          path: 'application',
          name: 'Configuration (Details)',
          meta: { login: true },
          component: ConfApplication,
        },
        // CONF DATE
        {
          path: 'date/:type/:id',
          name: 'Manage Date Format',
          component: FormDate,
          meta: { login: true },
        },
        {
          path: 'date/:type',
          name: 'Add Date Format',
          component: FormDate,
          meta: { login: true },
        },
        {
          path: 'date',
          name: 'Config Date',
          meta: { login: true },
          component: ListDate,
        },
        // CONF LAYOUT
        {
          path: 'layout/:type/:id',
          name: 'Manage Layout',
          component: FormLayout,
          meta: { login: true },
        },
        {
          path: 'layout/:type',
          name: 'Add Layout',
          component: FormLayout,
          meta: { login: true },
        },
        {
          path: 'layout',
          name: 'List Layout',
          component: ListLayout,
          meta: { login: true },
        },
        // CONF CONNECTOR
        {
          path: 'connector/:type/:id',
          name: 'Manage Connector',
          component: FormConnector,
          meta: { login: true },
        },
        {
          path: 'connector/:type',
          name: 'Add Connector',
          component: FormConnector,
          meta: { login: true },
        },
        {
          path: 'connector',
          name: 'List Connector',
          component: ListConnector,
          meta: { login: true },
        },
        // CONF CONNECTOR ACTION
        {
          path: 'connector_action/:type/:id',
          name: 'Manage Connector Action',
          component: FormConnectorAct,
          meta: { login: true },
        },
        {
          path: 'connector_action/:type',
          name: 'Add Connector Action',
          component: FormConnectorAct,
          meta: { login: true },
        },
        {
          path: 'connector_action',
          name: 'List Connector Action',
          component: ListConnectorAct,
          meta: { login: true },
        },
      ],
    },
    // DEVELOPMENT TOOLS
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
        // BARCODE GENERATOR
        {
          path: 'barcode_generator',
          name: 'Barcode Generator (Home)',
          meta: { login: true },
          component: ListBarcodeGenerator,
        },
        {
          path: 'manual_barcode_generator',
          name: 'Manual Barcode Generator (Home)',
          meta: { login: true },
          component: ManualBarcodeGenerator,
        },
      ],
    },
    // PRODUCTION MENU
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
        // Proccess Order
        {
          path: 'proccess-order/:type/:id',
          name: 'Proccess Order (Details) ',
          component: FormProccessOrder,
          meta: { login: true },
        },
        {
          path: 'proccess-order/:type',
          name: 'Proccess Order (Details)',
          component: FormProccessOrder,
          meta: { login: true },
        },
        {
          path: 'proccess-order',
          name: 'Proccess Order (Home)',
          component: ListProccessOrder,
          meta: { login: true },
        },
      ],
    },

    // OTHER PAGE
    {
      path: 'setting/user-setting',
      name: 'Setting User',
      component: UserSetting,
    },
  ];
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',

      meta: {
        login: true,
      },
      component: TheContainer,
      children: tempRoute,
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
          component: Oops,
          meta: { login: false },
        },
        {
          path: '/404',
          name: 'Page404',
          component: Page404,
          meta: { login: false },
        },
        {
          path: '/500',
          name: 'Page500',
          component: Page500,
          meta: { login: false },
        },
        {
          path: '/login',
          name: 'Login',
          component: Login,
          meta: { login: false },
        },
        {
          path: '/register',
          name: 'Register',
          component: Register,
          meta: { login: false },
        },
      ],
    },
  ];
}
