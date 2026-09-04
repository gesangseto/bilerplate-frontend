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
                :filterBy="['All', 'id', 'customer_name', 'status']"
                :orderFilter="['All', 'id', 'customer_name', 'status']"
                v-on:handleReload="loadData($event)"
              />
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

export default {
  name: 'ListItemStock',
  data() {
    return {
      totalData: 0,
      items: [],
      fields: [
        { key: 'id', label: 'ID', _classes: 'font-weight-bold' },
        { key: 'barcode', label: 'Barcode' },
        { key: 'customer_name', label: 'Customer' },
        { key: 'product_name', label: 'Product' },
        { key: 'warehouse_name', label: 'Warehouse' },
        { key: 'quantity', label: 'Qty' },
        { key: 'cost_price', label: 'Cost' },
        { key: 'selling_price', label: 'Selling' },
        { key: 'status_name', label: 'Status' },
        { key: 'payment_status', label: 'Payment' },
        { key: 'action', label: 'Action', sorter: false, filter: false },
      ],
    };
  },
  methods: {
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
          cost_price: item.cost_price
            ? this.formatCurrency(item.cost_price)
            : '-',
          selling_price: item.selling_price
            ? this.formatCurrency(item.selling_price)
            : '-',
          status_name: STATUS_ITEM[item.status] || item.status_name || '-',
          payment_status: payment,
        };
      });
    },
  },
};
</script>
