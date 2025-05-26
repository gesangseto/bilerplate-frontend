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
            :filterBy="['All', 'product_id', 'expired_date', 'mfg_date']"
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
import $axiosMertrack from '../../apiMertrack';
import { exportDataV3 } from '../../utils';

export default {
  name: 'ReportProductBatch',
  mounted() {},
  data() {
    return {
      items: [],
      totalData: 0,
      filter: null,
      fields: [
        {
          key: 'number',
          label: 'No',
        },
        {
          key: 'created_date',
          label: 'Inbound Date',
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
      let url = `/v3/report/batch?raw=true&${param}`;
      $axiosMertrack.get(url).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || 0;
      });
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v3/report/batch',
        alert: true,
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
          product_nie: item.product_nie || '-',
          product_gtin: item.product_gtin || '-',
          number: this.getNumber(index + 1),
        };
      });
    },
  },
};
</script>
