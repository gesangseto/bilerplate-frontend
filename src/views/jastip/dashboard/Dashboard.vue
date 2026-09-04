<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6" md="3" lg="3" v-for="(card, i) in statCards" :key="i">
              <CCard class="text-white" :class="card.color">
                <CCardBody class="pb-0">
                  <div class="text-value">{{ card.value }}</div>
                  <div>{{ card.label }}</div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow class="mt-4">
            <CCol sm="12" md="6" lg="6">
              <CCard>
                <CCardHeader>Item Stock per Status</CCardHeader>
                <CCardBody>
                  <CDataTable
                    :items="itemStatusRows"
                    :fields="statusFields"
                    hover
                    striped
                    border
                    style="font-size: 12px"
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="12" md="6" lg="6">
              <CCard>
                <CCardHeader>Batch per Status</CCardHeader>
                <CCardBody>
                  <CDataTable
                    :items="batchStatusRows"
                    :fields="statusFields"
                    hover
                    striped
                    border
                    style="font-size: 12px"
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow class="mt-4">
            <CCol sm="12" md="6" lg="6">
              <CCard>
                <CCardHeader>Picking per Status</CCardHeader>
                <CCardBody>
                  <CDataTable
                    :items="pickingStatusRows"
                    :fields="statusFields"
                    hover
                    striped
                    border
                    style="font-size: 12px"
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="12" md="6" lg="6">
              <CCard>
                <CCardHeader>Invoice per Status</CCardHeader>
                <CCardBody>
                  <CDataTable
                    :items="invoiceStatusRows"
                    :fields="statusFields"
                    hover
                    striped
                    border
                    style="font-size: 12px"
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axios from '../../../api';

const STATUS_ITEM = {
  200: 'Draft',
  201: 'Manifesting',
  202: 'In Transit',
  203: 'GRN',
  204: 'Dispatch',
  205: 'Sold',
};

const STATUS_BATCH = {
  Draft: 'Draft',
  Shipping: 'Shipping',
  Done: 'Done',
};

const STATUS_PICKING = {
  '-1': 'Canceled',
  0: 'Waiting',
  1: 'Done',
  2: 'In Courier',
};

const STATUS_INVOICE = {
  '-1': 'Canceled',
  0: 'Waiting',
  1: 'Done',
};

export default {
  name: 'JastipDashboard',
  data() {
    return {
      statCards: [],
      itemStatusRows: [],
      batchStatusRows: [],
      pickingStatusRows: [],
      invoiceStatusRows: [],
      statusFields: [
        { key: 'status', label: 'Status' },
        { key: 'total', label: 'Total' },
        { key: 'total_quantity', label: 'Qty' },
        { key: 'total_selling', label: 'Selling' },
      ],
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      $axios.get('/v1/jastip/dashboard').then((res) => {
        let data = res.data.data || {};
        this.buildStatCards(data);
        this.itemStatusRows = this.mapStatus(data.item_by_status, STATUS_ITEM);
        this.batchStatusRows = this.mapStatus(data.batch_by_status, STATUS_BATCH);
        this.pickingStatusRows = this.mapStatus(
          data.picking_by_status,
          STATUS_PICKING,
        );
        this.invoiceStatusRows = this.mapStatus(
          data.invoice_by_status,
          STATUS_INVOICE,
        );
      });
    },
    mapStatus(arr, map) {
      if (!Array.isArray(arr)) return [];
      return arr.map((it) => {
        let status = it.status;
        let name = map[status] || status;
        return {
          status: name,
          total: it.total || 0,
          total_quantity: it.total_quantity || '-',
          total_selling: it.total_selling
            ? this.formatCurrency(it.total_selling)
            : '-',
        };
      });
    },
    formatCurrency(val) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(val);
    },
    buildStatCards(data) {
      let totalItem = 0;
      if (Array.isArray(data.item_by_status)) {
        totalItem = data.item_by_status.reduce(
          (acc, it) => acc + parseInt(it.total || 0),
          0,
        );
      }
      let totalBatch = 0;
      if (Array.isArray(data.batch_by_status)) {
        totalBatch = data.batch_by_status.reduce(
          (acc, it) => acc + parseInt(it.total || 0),
          0,
        );
      }
      let totalPicking = 0;
      if (Array.isArray(data.picking_by_status)) {
        totalPicking = data.picking_by_status.reduce(
          (acc, it) => acc + parseInt(it.total || 0),
          0,
        );
      }
      let sales = data.total_sales || {};
      this.statCards = [
        {
          label: 'Total Item',
          value: totalItem,
          color: 'bg-primary',
        },
        {
          label: 'Total Batch',
          value: totalBatch,
          color: 'bg-info',
        },
        {
          label: 'Total Picking',
          value: totalPicking,
          color: 'bg-warning',
        },
        {
          label: 'Total Penjualan',
          value: this.formatCurrency(sales.total_selling || 0),
          color: 'bg-success',
        },
      ];
    },
  },
};
</script>
