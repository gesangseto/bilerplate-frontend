<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <TableTransaction
            :totalData="totalData"
            :fields="fields"
            :items="reformatItems"
            :actionProperty="{ print: btn_print }"
            :filterAction="customActionFilter"
            :status_code="'trx_reaggregation'"
            :action="['read', 'print']"
            :filterBy="['All', 'id', 'product_id', 'warehouse_id']"
            v-on:handleReload="loadData($event)"
            v-on:handlePrint="selected_data = $event"
          >
            <template #extra-action="{ item, index }">
              <ButtonPermission
                :buttonProperty="btn_showBarcode"
                :permission="'read'"
                @click="selected_barcode = item"
              />
            </template>
          </TableTransaction>
          <ButtonPermission
            exportType="excel"
            :permission="'print'"
            @click="handleClickExport('xls')"
          />
          <ButtonPermission
            exportType="pdf"
            :permission="'print'"
            @click="handleClickExport('pdf')"
          />
        </CCardBody>
      </CCard>
    </CCol>
    <ModalBarcodeGenerator
      :property="selected_barcode"
      v-on:onClose="selected_barcode = {}"
    />
    <ModalPrintLabelV3
      :item="selected_data"
      v-on:onClose="selected_data = {}"
    />
  </CRow>
</template>

<script>
import $axiosMertrack from '../../../apiMertrack';
import { exportDataV3, getUserId, printLabelV3 } from '../../../utils';
export default {
  name: 'ListReaggregation',
  mounted() {},
  data() {
    return {
      user_id: getUserId(),
      btn_print: {
        size: 'sm',
        class: 'float-right',
        color: 'secondary',
        icon: 'print',
        text: '',
        tooltip: 'Print Label',
        useHref: false,
      },
      btn_showBarcode: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'barcode',
        text: '',
        tooltip: 'Show Barcode',
      },
      selected_barcode: {},
      selected_data: {},
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
          _classes: 'font-weight-bold',
        },
        {
          key: 'created_date',
          label: 'Trx Date',
        },
        {
          key: 'product_name_batch',
          label: 'Product Name [Batch No]',
        },
        {
          key: 'warehouse_name',
          label: 'Warehouse',
        },
        {
          key: 'add_item_desc',
          label: 'Process',
          _classes: 'font-weight-bold',
        },
        {
          key: 'epc_key',
          label: 'EPC Key',
        },
        {
          key: 'serial',
          label: 'Aggregation SN',
        },
        {
          key: 'quantity_lvl_1',
          label: 'L1 Qty',
        },
        {
          key: 'packaging_level',
          label: 'Pkg Level',
        },
        {
          key: 'packaging_name',
          label: 'Pkg Name',
        },
        {
          key: 'created_full_name',
          label: 'Created By',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:15%',
        },
      ],
    };
  },
  methods: {
    customActionFilter(item) {
      let action = ['read', 'print'];
      if (item.allow_print) {
        this.btn_print.color = 'warning';
      } else {
        this.btn_print.color = 'danger';
      }
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      let url = `/v3/transaction/re-aggregation?raw=true&${param}`;
      $axiosMertrack.get(url).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || 0;
      });
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: this.$route.query,
        exportType: type,
        url: '/v3/transaction/re-aggregation',
      });
    },
    rowClicked(item) {
      this.$router.push({ path: `re-aggregation/read/${item.id}` });
    },
    addNew() {
      this.$router.push({ path: `re-aggregation/create` });
    },
    deleteRow(item, index) {
      this.dataReaggregation.splice(index, 1);
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
          ['created_full_name']: item['created_full_name'] || '-',
        };
      });
    },
  },
};
</script>
