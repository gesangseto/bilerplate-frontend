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
            status_code="report_stock"
            status_code_default="include_pending"
            :remove_all_status_code="true"
            :removeTrxDate="true"
            :filterBy="[
              'All',
              'product_id',
              'warehouse_id',
              'mfg_date',
              'expired_date',
              'minimum',
              'maximum',
            ]"
            v-on:handleReload="loadData($event)"
          />
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
  </CRow>
</template>

<script>
import $axios from '../../api';
import { exportDataV3 } from '../../utils';

export default {
  name: 'ReportStock',
  mounted() {},
  data() {
    return {
      items: [],
      filter: null,
      totalData: 0,
      fields: [
        {
          key: 'no',
          label: 'No',
        },
        {
          key: 'warehouse_name',
          label: 'Warehouse',
        },
        {
          key: 'sn_non_sn',
          label: 'SN / NON-SN',
        },
        {
          key: 'product_no',
          label: 'Item No',
          _classes: 'font-weight-bold',
        },
        {
          key: 'product_name',
          label: 'Product Name',
          _classes: 'font-weight-bold',
        },
        {
          key: 'batch_no',
          label: 'Batch No',
          _classes: 'font-weight-bold',
        },
        {
          key: 'expired_date',
          label: 'Exp Date',
        },
        {
          key: 'mfg_date',
          label: 'Mfg Date',
        },
        {
          key: 'product_nie',
          label: 'NIE',
        },
        {
          key: 'product_gtin',
          label: 'L1 GTIN',
          // _classes: "font-weight-bold",
        },
        {
          key: 'quantity_l1',
          label: 'L1 Qty',
        },
      ],
    };
  },
  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      if (filter) this.filter = filter;
      let param = `${new URLSearchParams(filter).toString()}`;
      let url = `/v1/report/stock?raw=true&${param}`;
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
        url: '/v1/report/stock',
      });
    },
    getNumber(num) {
      num = (this.filter.page - 1) * this.filter.limit + num;
      return num;
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item, index) => {
        return {
          ...item,
          nie: item.nie || '-',
          product_gtin: item.product_gtin || item.gtin || '-',
          no: this.getNumber(index + 1),
        };
      });
    },
  },
};
</script>
