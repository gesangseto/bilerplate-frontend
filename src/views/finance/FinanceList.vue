<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ExportButtons @export="handleClickExport" />
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
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axios from '../../api';
import { exportDataV3 } from '../../utils';

const CONFIG = {
  invoice: {
    title: 'Invoice',
    endpoint: '/v1/finance/invoice',
    fields: ['id', 'customer_id', 'quantity', 'selling_price', 'invoice_number', 'status_name'],
  },
  payments: {
    title: 'Payments',
    endpoint: '/v1/finance/payments',
    fields: ['id', 'invoice_number', 'customer_id', 'selling_price', 'modified_date'],
  },
  ledger: {
    title: 'Ledger',
    endpoint: '/v1/finance/ledger',
    fields: ['date', 'reference_type', 'reference_number', 'customer_id', 'account', 'debit', 'credit'],
  },
  'accounts-receivable': {
    title: 'Accounts Receivable',
    endpoint: '/v1/finance/accounts-receivable',
    fields: ['customer_id', 'invoice_count', 'outstanding_amount'],
  },
  revenue: {
    title: 'Revenue Report',
    endpoint: '/v1/finance/revenue',
    fields: [],
  },
  reports: {
    title: 'Financial Reports',
    endpoint: '/v1/finance/reports',
    fields: [],
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
      return this.$route.params.view || 'invoice';
    },
    config() {
      return CONFIG[this.view] || CONFIG.invoice;
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
