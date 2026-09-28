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
                :filterBy="[
                  'All',
                  'id',
                  'customer_id',
                  'customer_name',
                  'status',
                  'session_id',
                ]"
                :orderFilter="[
                  'All',
                  'id',
                  'customer_id',
                  'customer_name',
                  'status',
                  'session_id',
                ]"
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
import $axios from '../../api';
import { exportDataV3, formatNumber } from '../../utils';

const STATUS_ITEM = {
  200: 'Draft',
  201: 'Manifesting',
  202: 'In Transit',
  203: 'GRN',
  204: 'Dispatch',
  205: 'Sold',
};

export default {
  name: 'ItemStock',
  data() {
    return {
      totalData: 0,
      items: [],
      sessionOptions: [],
      customerOptions: [],
      costumeFilter: [
        {
          value: 'session_id',
          label: 'Session',
          data: [],
        },
        {
          value: 'customer_id',
          label: 'Customer',
          data: [],
        },
      ],
      fields: [
        { key: 'barcode', label: 'Barcode' },
        { key: 'customer_name', label: 'Customer' },
        { key: 'item_name', label: 'Item' },
        { key: 'quantity', label: 'Qty' },
        { key: 'foreign_currency', label: 'Foreign Curr.' },
        { key: 'foreign_cost', label: '(F) Cost' },
        { key: 'foreign_price', label: '(F) Price' },
        { key: 'local_currency', label: 'Local Curr.' },
        { key: 'local_cost', label: '(L) Cost' },
        { key: 'local_price', label: '(L) Price' },
        { key: 'local_shipping', label: '(L) Shipping' },
        { key: 'local_profit', label: '(L) Profit' },
        { key: 'status_name', label: 'Status' },
        { key: 'payment_status', label: 'Payment' },
        { key: 'action', label: 'Action', sorter: false, filter: false },
      ],
    };
  },
  mounted() {
    this.loadSessions();
    this.loadCustomers();
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
    async loadCustomers() {
      try {
        const res = await $axios.get('/v1/master/customer', {
          params: { limit: 100 },
        });
        const list = res.data.data || [];
        this.customerOptions = list.map((c) => ({
          value: c.id,
          label: c.name,
          text: c.name,
        }));
        // Isi data customer ke costumeFilter index 1 (Customer)
        if (this.costumeFilter.length > 1) {
          this.costumeFilter[1].data = this.customerOptions;
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
    formatCurrency(val, currency = 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
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
          barcode: item.barcode || '-',
          customer_name: item.customer_name || '-',
          item_name: item.item_name || '-',
          warehouse_name: item.warehouse_name || '-',
          foreign_cost: formatNumber(item.foreign_cost) || '-',
          foreign_price: formatNumber(item.foreign_price) || '-',
          local_cost: formatNumber(item.local_cost) || '-',
          local_price: formatNumber(item.local_price) || '-',
          local_shipping: formatNumber(item.local_shipping) || '-',
          local_profit: formatNumber(item.local_profit) || '-',
          status_name: STATUS_ITEM[item.status] || item.status_name || '-',
          payment_status: payment,
        };
      });
    },
  },
};
</script>
