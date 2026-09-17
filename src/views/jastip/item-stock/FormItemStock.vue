<template>
  <CRow>
    <CCol col="12" xl="12" sm="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [READ]</h5>
        </CCardHeader>
        <CCardBody class="mb-5 mt-2">
          <CForm novalidate>
            <CCol sm="12">
              <InputDefault title="Barcode" :value="formData.barcode" disabled />
              <InputDefault
                title="Batch No"
                :value="formData.batch_no"
                disabled
              />
              <InputDefault
                title="Customer"
                :value="formData.customer_name"
                disabled
              />
              <InputDefault
                title="Phone"
                :value="formData.customer_phone"
                disabled
              />
              <InputDefault
                title="Product"
                :value="formData.product_name"
                disabled
              />
              <InputDefault
                title="Warehouse"
                :value="formData.warehouse_name"
                disabled
              />
              <InputDefault
                title="Quantity"
                :value="formData.quantity"
                disabled
              />
              <InputDefault
                title="Cost Price"
                :value="formData.cost_price"
                disabled
              />
              <InputDefault
                title="Selling Price"
                :value="formData.selling_price"
                disabled
              />
              <InputDefault
                title="Shipment Price"
                :value="formData.shipment_price"
                disabled
              />
              <InputDefault
                title="Cost Code"
                :value="formData.cost_code"
                disabled
              />
              <InputDefault
                title="Selling Code"
                :value="formData.selling_code"
                disabled
              />
              <InputDefault
                title="Status"
                :value="formData.status_name"
                disabled
              />
              <InputDefault
                title="Payment"
                :value="formData.payment_status"
                disabled
              />
              <InputDefault
                title="Created By"
                :value="formData.created_full_name"
                disabled
              />
            </CCol>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <ButtonBack />
          <ExportButtons @export="handleClickExport" />
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
  name: 'FormItemStock',
  data() {
    return {
      formData: {
        barcode: null,
        batch_no: null,
        customer_name: null,
        customer_phone: null,
        product_name: null,
        warehouse_name: null,
        quantity: null,
        cost_price: null,
        selling_price: null,
        shipment_price: null,
        cost_code: null,
        selling_code: null,
        status_name: null,
        payment_status: null,
        created_full_name: null,
      },
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    handleClickExport(type) {
      exportDataV3({
        param: { id: this.$route.params.id },
        exportType: type,
        url: '/v1/jastip/item-stock',
      });
    },
    loadData() {
      let id = this.$route.params.id;
      $axios.get(`/v1/jastip/item-stock?id=${id}`).then((res) => {
        let item = res.data.data[0];
        if (item) {
          let payment = '-';
          if (item.payment_status === 0) payment = 'Waiting';
          else if (item.payment_status === 1) payment = 'Paid';
          this.formData = {
            barcode: item.barcode || '-',
            batch_no: item.batch_no || '-',
            customer_name: item.customer_name || '-',
            customer_phone: item.customer_phone || '-',
            product_name: item.product_name || '-',
            warehouse_name: item.warehouse_name || '-',
            quantity: item.quantity,
            cost_price: item.cost_price
              ? this.formatCurrency(item.cost_price)
              : '-',
            selling_price: item.selling_price
              ? this.formatCurrency(item.selling_price)
              : '-',
            shipment_price: item.shipment_price
              ? this.formatCurrency(item.shipment_price)
              : '-',
            cost_code: item.cost_code || '-',
            selling_code: item.selling_code || '-',
            status_name: STATUS_ITEM[item.status] || item.status_name || '-',
            payment_status: payment,
            created_full_name: item.created_full_name || '-',
          };
        }
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
};
</script>