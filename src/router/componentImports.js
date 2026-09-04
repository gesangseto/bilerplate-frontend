// Shared lazy component imports for router modules
export const TheContainer = () => import('@/containers/TheContainer');

export const Home = () => import('@/views/Home');
export const ChangePassword = () => import('@/views/pages/ChangePassword');
export const Dashboard = () => import('@/views/Dashboard');

export const Oops = () => import('@/views/pages/Oops');
export const Page404 = () => import('@/views/pages/Page404');
export const Page500 = () => import('@/views/pages/Page500');
export const Login = () => import('@/views/pages/Login');
export const Register = () => import('@/views/pages/Register');

// MASTER
export const FormSupplier = () => import('@/views/master/supplier/FormSupplier');
export const ListSupplier = () => import('@/views/master/supplier/ListSupplier');
export const FormCustomer = () => import('@/views/master/customer/FormCustomer');
export const ListCustomer = () => import('@/views/master/customer/ListCustomer');
export const ListWarehouse = () => import('@/views/master/warehouse/ListWarehouse');
export const FormWarehouse = () => import('@/views/master/warehouse/FormWarehouse');
export const ListProductCategory = () =>
  import('@/views/master/product_category/ListProductCategory');
export const FormProductCategory = () =>
  import('@/views/master/product_category/FormProductCategory');
export const ListProduct = () => import('@/views/master/product/ListProduct');
export const FormProduct = () =>
  import('@/views/master/product/FormProduct');
export const ListPackaging = () => import('@/views/master/packaging/ListPackaging');
export const FormPackaging = () => import('@/views/master/packaging/FormPackaging');

// SETTING
export const UserSetting = () => import('@/views/settings/user/Setting');
export const ListUser = () => import('@/views/settings/user/ListUser');
export const FormUser = () => import('@/views/settings/user/FormUser');
export const ListRole = () => import('@/views/settings/role/ListRole');
export const FormRole = () => import('@/views/settings/role/FormRole');
export const ListRoleStation = () =>
  import('@/views/settings/role-station/ListRoleStation');
export const FormRoleStation = () =>
  import('@/views/settings/role-station/FormRoleStation');
export const ListWorkflow = () => import('@/views/settings/workflow/ListWorkflow');
export const FormWorkflow = () => import('@/views/settings/workflow/FormWorkflow');
export const ListDepartment = () =>
  import('@/views/settings/department/ListDepartment');
export const FormDepartment = () =>
  import('@/views/settings/department/FormDepartment');
export const ListSection = () => import('@/views/settings/section/ListSection');
export const FormSection = () => import('@/views/settings/section/FormSection');

// PRODUCTION
export const ListProcessOrder = () =>
  import('@/views/production/process_order/ListProcessOrder');
export const FormProcessOrder = () =>
  import('@/views/production/process_order/FormProcessOrder');

// TRANSACTION
export const ListPickingList = () =>
  import('@/views/transactions/pickingList/ListPickingList');
export const FormPickingList = () =>
  import('@/views/transactions/pickingList/FormPickingList');
export const DetailPickingList = () =>
  import('@/views/transactions/pickingList/DetailPickingList');
export const FormUploadXML = () => import('@/views/transactions/upload/FormUploadXML');
export const DetailUploadXML = () =>
  import('@/views/transactions/upload/DetailUploadXML');
export const ListUploadXML = () => import('@/views/transactions/upload/ListUploadXML');
export const ListPreInbound = () =>
  import('@/views/transactions/pre-inbound/ListPreInbound');
export const DetailPreInbound = () =>
  import('@/views/transactions/pre-inbound/DetailPreInbound');
export const ListInbound = () => import('@/views/transactions/inbound/ListInbound');
export const DetailInbound = () =>
  import('@/views/transactions/inbound/DetailInbound');
export const ListOutbound = () => import('@/views/transactions/outbound/ListOutbound');
export const DetailOutbound = () =>
  import('@/views/transactions/outbound/DetailOutbound');
export const ListReturn = () => import('@/views/transactions/return/ListReturn');
export const DetailReturn = () => import('@/views/transactions/return/DetailReturn');
export const ListDisposal = () => import('@/views/transactions/disposal/ListDisposal');
export const DetailDisposal = () =>
  import('@/views/transactions/disposal/DetailDisposal');
export const ListRework = () => import('@/views/transactions/rework/ListRework');
export const DetailRework = () => import('@/views/transactions/rework/DetailRework');
export const ListStockTransfer = () =>
  import('@/views/transactions/transfer/ListStockTransfer');
export const FormStockTransfer = () =>
  import('@/views/transactions/transfer/FormStockTransfer');
export const DetailStockTransfer = () =>
  import('@/views/transactions/transfer/DetailStockTransfer');
export const ListStockOpname = () =>
  import('@/views/transactions/stockOpname/ListStockOpname');
export const FormStockOpname = () =>
  import('@/views/transactions/stockOpname/FormStockOpname');
export const DetailStockOpname = () =>
  import('@/views/transactions/stockOpname/DetailStockOpname');
export const ListSampling = () => import('@/views/transactions/sampling/ListSampling');
export const DetailSampling = () =>
  import('@/views/transactions/sampling/DetailSampling');
export const ListAggregation = () =>
  import('@/views/transactions/aggregation/ListAggregation');
export const DetailAggregation = () =>
  import('@/views/transactions/aggregation/DetailAggregation');
export const ListReaggregation = () =>
  import('@/views/transactions/reaggregation/ListReaggregation');
export const DetailReaggregation = () =>
  import('@/views/transactions/reaggregation/DetailReaggregation');
export const ListDecommissioning = () =>
  import('@/views/transactions/decommissioning/ListDecommissioning');
export const DetailDecommissioning = () =>
  import('@/views/transactions/decommissioning/DetailDecommissioning');
export const ListPacking = () => import('@/views/transactions/packing/ListPacking');
export const DetailPacking = () =>
  import('@/views/transactions/packing/DetailPacking');
export const FormPacking = () => import('@/views/transactions/packing/FormPacking');
export const ListRepack = () => import('@/views/transactions/repack/ListRepack');
export const DetailRepack = () => import('@/views/transactions/repack/DetailRepack');
export const ListBpom = () => import('@/views/transactions/bpom/ListBpom');
export const ListQueueBpom = () =>
  import('@/views/transactions/queue_bpom/ListQueueBpom');
export const DetailQueueBpom = () =>
  import('@/views/transactions/queue_bpom/DetailQueueBpom');

// REPORT
export const ReportProductBatch = () => import('@/views/reports/ReportProductBatch');
export const ReportStock = () => import('@/views/reports/ReportStock');
export const ItemStock = () => import('@/views/reports/ItemStock');
export const ListAuditTrail = () =>
  import('@/views/reports/AuditTrail/ListAuditTrail');
export const DetailAuditTrail = () =>
  import('@/views/reports/AuditTrail/DetailAuditTrail');
export const ReportShowStatus = () => import('@/views/reports/ReportShowStatus');

// MAINTENANCE
export const MaintenanceLog = () => import('@/views/maintenance/log/List');
export const DatabaseBackup = () => import('@/views/maintenance/database-backup/Form');
export const DatabaseRestore = () =>
  import('@/views/maintenance/database-restore/Form');

// SYSTEM
export const SystemApplication = () => import('@/views/system/application/Form');
export const SystemMenu = () => import('@/views/system/menu/Form');
export const ListSystemScriptInj = () =>
  import('@/views/system/script_injection/List');
export const FormSystemScriptInj = () =>
  import('@/views/system/script_injection/Form');

// SYSTEM PROCESS
export const ListProcessSchedule = () =>
  import('@/views/system-process/process-schedule/List');
export const ListProcessQueue = () =>
  import('@/views/system-process/process-queue/List');

// CONFIGURATION
export const ListStation = () => import('@/views/configuration/station/ListStation');
export const FormStation = () => import('@/views/configuration/station/FormStation');
export const ListPattern = () => import('@/views/configuration/pattern/ListPattern');
export const FormPattern = () => import('@/views/configuration/pattern/FormPattern');
export const ListCurrency = () => import('@/views/configuration/currency/ListCurrency');
export const FormCurrency = () => import('@/views/configuration/currency/FormCurrency');
export const ListCron = () => import('@/views/configuration/cron_schedule/List');
export const FormCron = () => import('@/views/configuration/cron_schedule/Form');
export const ListMetadata = () =>
  import('@/views/configuration/metadata/ListMetadata');
export const FormMetadata = () =>
  import('@/views/configuration/metadata/FormMetadata');
export const ListDate = () => import('@/views/configuration/date/ListDate');
export const FormDate = () => import('@/views/configuration/date/FormDate');
export const ListLayout = () => import('@/views/configuration/layout/ListLayout');
export const FormLayout = () => import('@/views/configuration/layout/FormLayout');
export const ListConnector = () =>
  import('@/views/configuration/connector/ListConnector');
export const FormConnector = () =>
  import('@/views/configuration/connector/FormConnector');
export const ListConnectorAct = () =>
  import('@/views/configuration/connector_action/ListConnectorAct');
export const FormConnectorAct = () =>
  import('@/views/configuration/connector_action/FormConnectorAct');

// DEVELOPMENT TOOLS
export const ListBarcodeGenerator = () =>
  import('@/views/development_tools/BarcodeGenerator/ListBarcodeGenerator');
export const ManualBarcodeGenerator = () =>
  import('@/views/development_tools/ManualBarcodeGenerator/ManualBarcodeGenerator');
export const BpomCompareTool = () =>
  import('@/views/development_tools/BpomCompareTool/BpomCompareTool');

// JASTIP
export const JastipDashboard = () => import('@/views/jastip/dashboard/Dashboard');
export const JastipListItemRegistry = () =>
  import('@/views/jastip/item-registry/ListItemRegistry');
export const JastipFormItemRegistry = () =>
  import('@/views/jastip/item-registry/FormItemRegistry');
export const JastipListOutboundManifest = () =>
  import('@/views/jastip/outbound-manifest/ListOutboundManifest');
export const JastipFormOutboundManifest = () =>
  import('@/views/jastip/outbound-manifest/FormOutboundManifest');
export const JastipListInbound = () =>
  import('@/views/jastip/inbound/ListInbound');
export const JastipListPicking = () =>
  import('@/views/jastip/picking/ListPicking');
export const JastipFormPicking = () =>
  import('@/views/jastip/picking/FormPicking');
export const JastipListItemStock = () =>
  import('@/views/jastip/item-stock/ListItemStock');
export const JastipListItemDisposal = () =>
  import('@/views/jastip/disposal/ListItemDisposal');
export const JastipFormItemDisposal = () =>
  import('@/views/jastip/disposal/FormItemDisposal');
