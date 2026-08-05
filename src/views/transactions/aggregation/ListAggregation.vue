<template id="print-hide">
  <CRow id="print-hide">
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader id="print-hide">
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <TableTransaction
            :totalData="totalData"
            :fields="fields"
            :items="reformatItems"
            :actionProperty="{ print: btn_print }"
            :filterAction="customActionFilter"
            :status_code="'trx_aggregation'"
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
    <ModalPrintLabelToZebra
      :item="selected_data"
      v-on:onClose="selected_data = {}"
    />
  </CRow>
</template>

<script>
import $axios from '../../../api';
import { exportDataV3, getUserId, printLabelV3 } from '../../../utils';
export default {
  name: 'ListAggregation',
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
      selected_data: {},
      selected_barcode: {},
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
      let url = `/v1/transaction/aggregation?raw=true&${param}`;
      this.items = [];
      $axios.get(url).then((res) => {
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
        url: '/v1/transaction/aggregation',
      });
    },
    rowClicked(item) {
      this.$router.push({ path: `aggregation/read/${item.id}` });
    },
    addNew() {
      this.$router.push({ path: `aggregation/create` });
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
<style scoped>
#printMe {
  visibility: hidden;
  position: absolute;
}
@media print {
  #printMe {
    visibility: visible;
    position: absolute;
    z-index: 9999;
  }
  #print-hide {
    visibility: hidden;
    position: absolute;
  }
  header {
    visibility: hidden;
    position: absolute;
  }
}
</style>
