<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission
            exportType="add"
            :permission="'create'"
            @click="handleAdd()"
          />
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
  206: 'Disposed',
};

export default {
  name: 'ListItemDisposal',
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
        { key: 'warehouse_name', label: 'Warehouse' },
        { key: 'created_full_name', label: 'Created By' },
        { key: 'action', label: 'Action', sorter: false, filter: false },
      ],
    };
  },
  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      $axios.get(`/v1/jastip/disposal?${param}`).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
      });
    },
    handleAdd() {
      this.$router.push({ path: '/jastip/item-disposal/create' });
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v1/jastip/disposal',
      });
    },
    formatCurrency(val) {
      if (val == null || val === '') return '-';
      const n = Math.round(Number(val));
      if (isNaN(n)) return '-';
      return n.toLocaleString('id-ID');
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
          warehouse_name: item.warehouse_name || '-',
          foreign_currency: item.foreign_currency || '-',
          local_currency: item.local_currency || '-',
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
          created_full_name: item.created_full_name || '-',
          payment_status:
            item.payment_status === 1
              ? 'Paid'
              : item.payment_status === 0
              ? 'Waiting'
              : '-',
        };
      });
    },
  },
};
</script>
