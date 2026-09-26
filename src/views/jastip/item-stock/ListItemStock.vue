<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <TableTransaction
                :totalData="totalData"
                :fields="fields"
                :items="reformatItems"
                :status_code="'item_stock'"
                :action="['read']"
                :filterBy="['All', 'id', 'customer_name', 'status', 'session_id']"
                :orderFilter="['All', 'id', 'customer_name', 'status', 'session_id']"
                :costumeFilter="costumeFilter"
                v-on:handleReload="loadData($event)"
              />
            </CCol>
          </CRow>
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
import $axios from '../../../api';
import { exportDataV3 } from '../../../utils';

const STATUS_ITEM = {
  200: 'Draft',
  201: 'Manifesting',
  202: 'In Transit',
  203: 'GRN',
  204: 'Dispatch',
  205: 'Sold',
};

export default {
  name: 'ListItemStock',
  data() {
    return {
      totalData: 0,
      items: [],
      sessionOptions: [],
      costumeFilter: [
        {
          value: 'session_id',
          label: 'Session',
          data: [],
        },
      ],
      fields: [
        { key: 'barcode', label: 'Barcode' },
        { key: 'customer_name', label: 'Customer' },
        { key: 'product_name', label: 'Product' },
        { key: 'quantity', label: 'Qty' },
        { key: 'foreign_cost', label: 'Cost (F)' },
        { key: 'foreign_price', label: 'Price (F)' },
        { key: 'local_cost', label: 'Cost (L)' },
        { key: 'local_price', label: 'Selling (L)' },
        { key: 'local_shipping', label: 'Shipping (L)' },
        { key: 'local_profit', label: 'Profit (L)' },
        { key: 'status_name', label: 'Status' },
        { key: 'payment_status', label: 'Payment' },
        { key: 'action', label: 'Action', sorter: false, filter: false },
      ],
    };
  },
  mounted() {
    this.loadSessions();
  },
  methods: {
    async loadSessions() {
      try {
        const res = await $axios.get('/v1/jastip/session', {
          params: { limit: 100 },
        });
        const list = res.data.data || [];
        this.sessionOptions = list.map((s) => ({
          value: s.id,
          label: `${s.session_no} (${s.country || '-'} - ${s.status})`,
          text: `${s.session_no} (${s.country || '-'} - ${s.status})`,
        }));
        // Isi data session ke costumeFilter (sudah terdaftar static di data())
        if (this.costumeFilter.length > 0) {
          this.costumeFilter[0].data = this.sessionOptions;
        }
      } catch (e) {
        console.error(e);
      }
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v1/jastip/item-stock',
      });
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      $axios.get(`/v1/jastip/item-stock?${param}`).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
      });
    },
    formatCurrency(val) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(val);
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        let payment = '-';
        if (item.payment_status === 0) payment = 'Waiting';
        else if (item.payment_status === 1) payment = 'Paid';
        return {
          ...item,
          customer_name: item.customer_name || '-',
          product_name: item.product_name || '-',
          warehouse_name: item.warehouse_name || '-',
          foreign_cost: item.foreign_cost
            ? this.formatCurrency(item.foreign_cost)
            : '-',
          foreign_price: item.foreign_price
            ? this.formatCurrency(item.foreign_price)
            : '-',
          local_cost: item.local_cost
            ? this.formatCurrency(item.local_cost)
            : '-',
          local_price: item.local_price
            ? this.formatCurrency(item.local_price)
            : '-',
          local_shipping: item.local_shipping
            ? this.formatCurrency(item.local_shipping)
            : '-',
          local_profit: item.local_profit
            ? this.formatCurrency(item.local_profit)
            : '-',
          status_name: STATUS_ITEM[item.status] || item.status_name || '-',
          payment_status: payment,
        };
      });
    },
  },
};
</script>
