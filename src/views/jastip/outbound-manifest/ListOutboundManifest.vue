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
                :status_code="'item_batch'"
                :action="['read', 'update']"
                :filterBy="['All', 'id', 'batch_no', 'status']"
                :orderFilter="['All', 'id', 'batch_no', 'status']"
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

export default {
  name: 'ListOutboundManifest',
  data() {
    return {
      totalData: 0,
      items: [],
      fields: [
        { key: 'id', label: 'ID', _classes: 'font-weight-bold' },
        { key: 'batch_no', label: 'Batch No' },
        { key: 'warehouse_name', label: 'Warehouse' },
        { key: 'supplier_name', label: 'Supplier' },
        { key: 'quantity', label: 'Qty' },
        { key: 'weight', label: 'Weight' },
        { key: 'shipment_number', label: 'Shipment No' },
        { key: 'shipment_price', label: 'Shipment Price' },
        { key: 'status', label: 'Status' },
        { key: 'created_full_name', label: 'Created By' },
        { key: 'action', label: 'Action', sorter: false, filter: false },
      ],
    };
  },
  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      $axios.get(`/v1/jastip/outbound-manifest?${param}`).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
      });
    },
    handleAdd() {
      this.$router.push({ path: '/jastip/outbound-manifest/add' });
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
          warehouse_name: item.warehouse_name || '-',
          supplier_name: item.supplier_name || '-',
          shipment_number: item.shipment_number || '-',
          shipment_price: item.shipment_price
            ? this.formatCurrency(item.shipment_price)
            : '-',
          created_full_name: item.created_full_name || '-',
        };
      });
    },
  },
};
</script>
