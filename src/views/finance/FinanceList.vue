<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ title }}</h5>
        </CCardHeader>
        <CCardBody>
          <CAlert v-if="error" color="danger">{{ error }}</CAlert>
          <CDataTable
            v-if="Array.isArray(rows)"
            :items="rows"
            :fields="fields"
            hover
            striped
            bordered
            table-filter
            pagination
            :items-per-page="10"
          />
          <pre v-else class="mb-0">{{ JSON.stringify(rows, null, 2) }}</pre>
        </CCardBody>
        <CCardFooter>
          <div class="float-right">
            <ExportButtons @export="handleClickExport" />
          </div>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axios from '../../api';
import { exportDataV3 } from '../../utils';

const CONFIG = {
  payments: {
    title: 'Payments',
    endpoint: '/v1/finance/payments',
    fields: ['id', 'invoice_number', 'customer_id', 'selling_price', 'modified_date'],
  },
};

export default {
  name: 'FinanceList',
  data() {
    return {
      rows: [],
      error: '',
    };
  },
  computed: {
    view() {
      return this.$route.params.view || 'payments';
    },
    config() {
      return CONFIG[this.view] || CONFIG.payments;
    },
    title() {
      return this.config.title;
    },
    fields() {
      return this.config.fields;
    },
  },
  watch: {
    '$route.params.view': {
      immediate: true,
      handler() {
        this.loadData();
      },
    },
  },
  methods: {
    handleClickExport(type) {
      const param = this.$route.query;
      const endpoint = this.config.endpoint.replace('/api', '');
      exportDataV3({
        param,
        exportType: type,
        url: endpoint,
      });
    },
    async loadData() {
      this.error = '';
      try {
        const result = await $axios.get(this.config.endpoint);
        this.rows = result.data?.data || [];
        if (result.data?.error) this.error = result.data.message;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        this.rows = [];
      }
    },
  },
};
</script>
