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
                :action="['read', 'update', 'delete']"
                :filterBy="['All', 'id', 'customer_name', 'status']"
                :orderFilter="['All', 'id', 'customer_name', 'status']"
                v-on:handleReload="loadData($event)"
              />
              <ButtonPermission
                exportType="add"
                :permission="'create'"
                @click="handleAdd()"
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
  name: 'ListItemRegistry',
  data() {
    return {
      totalData: 0,
      items: [],
      fields: [
        { key: 'id', label: 'ID', _classes: 'font-weight-bold' },
        { key: 'barcode', label: 'Barcode' },
        { key: 'customer_name', label: 'Customer' },
        { key: 'customer_phone', label: 'Phone' },
        { key: 'product_name', label: 'Product' },
        { key: 'quantity', label: 'Qty' },
        { key: 'cost_price', label: 'Cost' },
        { key: 'selling_price', label: 'Selling' },
        { key: 'status_name', label: 'Status' },
        { key: 'created_full_name', label: 'Created By' },
        { key: 'action', label: 'Action', sorter: false, filter: false },
      ],
    };
  },
  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      $axios.get(`/v1/jastip/item-registry?${param}`).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
      });
    },
    handleAdd() {
      this.$router.push({ path: '/jastip/item-registry/add' });
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
        return {
          ...item,
          status_name: STATUS_ITEM[item.status] || item.status_name || '-',
          customer_name: item.customer_name || '-',
          customer_phone: item.customer_phone || '-',
          product_name: item.product_name || '-',
          cost_price: item.cost_price
            ? this.formatCurrency(item.cost_price)
            : '-',
          selling_price: item.selling_price
            ? this.formatCurrency(item.selling_price)
            : '-',
          created_full_name: item.created_full_name || '-',
        };
      });
    },
  },
};
</script>
