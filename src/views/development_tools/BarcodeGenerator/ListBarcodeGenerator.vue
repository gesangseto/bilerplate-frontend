<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Stock Data Barcode Generator</h5>
        </CCardHeader>
        <CCardBody>
          <TableTransaction
            :totalData="totalData"
            :fields="fields"
            :items="reformatItems"
            :status_code="'product_stock_serial'"
            :filterBy="[
              'All',
              'product_id',
              'supplier_id',
              'warehouse_id',
              'customer_id',
            ]"
            v-on:handleReload="loadData($event)"
            v-on:handlePrint="selected_data = $event"
          >
            <template #extra-action="{ item, index }">
              <ButtonPermission
                v-if="item.serial !== '0000000000'"
                :permission="'read'"
                @click="rowClicked(item, index)"
              />
            </template>
          </TableTransaction>
        </CCardBody>
      </CCard>
    </CCol>
    <DetailBarcodeGenerator :property="selected_data" />
  </CRow>
</template>

<script>
import $axios from '../../../api';
import { calculatePaginationV3, exportData } from '../../../utils';
export default {
  name: 'ListBarcodeGenerator',
  mounted() {},
  data() {
    return {
      filter: null,
      totalData: 0,
      items: [],
      selected_data: { modal: false, item: {} },
      fields: [
        {
          key: 'product_no',
          label: 'Item No',
          _classes: 'font-weight-bold',
        },
        {
          key: 'product_name',
          label: 'Product Name',
        },
        {
          key: 'batch_no',
          label: 'Batch No',
        },
        {
          key: 'expired_date',
          label: 'Exp Date',
        },
        {
          key: 'epc_key',
          label: 'EPC Key',
        },
        {
          key: 'serial',
          label: 'SN',
        },
        {
          key: 'packaging_level',
          label: 'Pkg Level',
        },
        {
          key: 'packaging_name',
          label: 'Pkg Name',
        },
        // {
        //   key: 'supplier_name',
        //   label: 'Supplier Name',
        // },
        {
          key: 'last_location',
          label: 'Location',
        },
        // {
        //   key: 'customer_name',
        //   label: 'Customer',
        // },
        {
          key: 'quantity',
          label: 'L1 Qty',
        },
        {
          key: 'status_desc',
          label: 'Status',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:10%',
        },
      ],
    };
  },

  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      delete filter['StartDate'];
      delete filter['EndDate'];
      filter['parent'] = null;
      filter['advanced'] = true;
      let param = `${new URLSearchParams(filter).toString()}`;
      let url = `/v1/transaction/stock?show_barcode=true&${param}`;
      $axios.get(url).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || 0;
      });
    },
    handleClickExport(type) {
      exportData({ param: this.$route.query, exportType: type });
    },
    rowClicked(item) {
      this.selected_data.modal = true;
      this.selected_data.item = item;
      // this.$router.push({
      //   path: `inbound/read/${item.id}`,
      // });
    },
    addNew() {
      this.$router.push({
        path: `add-inbound`,
      });
    },
    deleteRow(item, index) {
      this.dataInbound.splice(index, 1);
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        return {
          ...item,
          last_location: item.customer_name || item.warehouse_name || '-',
          supplier_name: item.supplier_name ?? '',
          warehouse_name: item.warehouse_name ?? '',
          customer_name: item.customer_name ?? '',
          gtin_cp:
            item.epc_type == 'sscc' ? item.company_prefix : item.gtin_sscc,
        };
      });
    },
  },
};
</script>
