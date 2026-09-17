<template>
  <CRow>
    <CCol col="12" xl="12" sm="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody class="mb-5 mt-2">
          <!-- MODE ADD : Aksi GRN (pilih batch Shipping lalu konfirmasi inbound) -->
          <template v-if="action === 'ADD'">
            <CForm novalidate>
              <CCol sm="12">
                <SelectOption
                  title="Batch No"
                  placeholder="--Select Shipping Batch--"
                  required
                  :options="listBatch"
                  v-model="formData.batch_id"
                  :is-valid="
                    initialLoad ? null : !formData.batch_id ? false : true
                  "
                  @onchange="loadBatchItems($event)"
                />
              </CCol>
            </CForm>
            <CRow>
              <CCol sm="12" md="12" lg="12">
                <CDataTable
                  tableFilter
                  class="text-left"
                  hover
                  striped
                  border
                  :items="renderItems"
                  :fields="fields"
                  style="font-size: 12px"
                />
              </CCol>
            </CRow>
          </template>

          <!-- MODE READ : Detail transaksi inbound -->
          <template v-else>
            <CForm novalidate>
              <CCol sm="12">
                <InputDefault
                  title="Batch No"
                  :value="formData.batch_no"
                  disabled
                />
                <InputDefault
                  title="Warehouse"
                  :value="formData.warehouse_name"
                  disabled
                />
                <InputDefault
                  title="Supplier"
                  :value="formData.supplier_name"
                  disabled
                />
                <InputDefault
                  title="Quantity"
                  :value="formData.quantity"
                  disabled
                />
                <InputDefault
                  title="Weight"
                  :value="formData.weight"
                  disabled
                />
                <InputDefault
                  title="Shipment No"
                  :value="formData.shipment_number"
                  disabled
                />
                <InputDefault
                  title="Shipment Price"
                  :value="formData.shipment_price"
                  disabled
                />
                <InputDefault
                  title="Status"
                  :value="formData.status_name"
                  disabled
                />
                <InputDefault
                  title="Created By"
                  :value="formData.created_full_name"
                  disabled
                />
              </CCol>
            </CForm>
            <CRow>
              <CCol sm="12" md="12" lg="12">
                <CDataTable
                  tableFilter
                  class="text-left"
                  hover
                  striped
                  border
                  :items="renderItems"
                  :fields="fields"
                  style="font-size: 12px"
                />
              </CCol>
            </CRow>
          </template>
        </CCardBody>
        <CCardFooter>
          <CButton
            v-if="action === 'ADD'"
            @click="save()"
            color="primary"
            size="sm"
            type="submit"
          >
            <CIcon name="cil-check-circle" /> Confirm Inbound
          </CButton>
          <ButtonBack />
          <ExportButtons
            v-if="action !== 'ADD'"
            @export="handleClickExport"
          />
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axios from '../../../api';
import { exportDataV3, handleBack } from '../../../utils';

export default {
  name: 'FormInbound',
  data() {
    return {
      initialLoad: true,
      action: 'ADD',
      formData: {
        batch_id: null,
        batch_no: null,
        warehouse_name: null,
        supplier_name: null,
        quantity: null,
        weight: null,
        shipment_number: null,
        shipment_price: null,
        status_name: null,
        created_full_name: null,
      },
      listBatch: [],
      items: [],
      fields: [
        { key: 'barcode', label: 'Barcode' },
        { key: 'customer_name', label: 'Customer' },
        { key: 'product_name', label: 'Product' },
        { key: 'quantity', label: 'Qty' },
        { key: 'cost_price', label: 'Cost' },
        { key: 'selling_price', label: 'Selling' },
      ],
    };
  },
  mounted() {
    this.action = this.$route.params.id === undefined ? 'ADD' : 'READ';
    if (this.action === 'ADD') {
      this.loadListBatch();
    } else {
      this.loadData();
    }
  },
  methods: {
    handleClickExport(type) {
      exportDataV3({
        param: { id: this.$route.params.id },
        exportType: type,
        url: '/v1/jastip/inbound',
      });
    },
    loadListBatch() {
      let param = new URLSearchParams({ status: 'Shipping' }).toString();
      $axios.get(`/v1/jastip/outbound-manifest?${param}`).then((res) => {
        let data = res.data.data || [];
        for (const it of data) {
          this.listBatch.push({
            value: it.id,
            label: `${it.batch_no} - ${it.warehouse_name || '-'} (${
              it.quantity || 0
            } items)`,
          });
        }
      });
    },
    loadBatchItems(batchId) {
      if (!batchId) {
        this.items = [];
        return;
      }
      $axios.get(`/v1/jastip/outbound-manifest?id=${batchId}`).then((res) => {
        let item = res.data.data[0];
        this.items = (item && item.items) || [];
      });
    },
    loadData() {
      let id = this.$route.params.id;
      $axios.get(`/v1/jastip/inbound?id=${id}`).then((res) => {
        let item = res.data.data[0];
        if (item) {
          this.formData = {
            batch_id: item.batch_id,
            batch_no: item.batch_no,
            warehouse_name: item.warehouse_name,
            supplier_name: item.supplier_name,
            quantity: item.quantity,
            weight: item.weight,
            shipment_number: item.shipment_number,
            shipment_price: item.shipment_price,
            status_name: item.status_name,
            created_full_name: item.created_full_name,
          };
          this.items = item.items || [];
        }
      });
    },
    save() {
      if (!this.formData.batch_id) {
        this.$toast.open({
          message: 'Please select a Shipping batch.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      let param = { id: this.formData.batch_id };
      this.$isLoading(true);
      $axios.post('/v1/jastip/inbound', param).then((result) => {
        this.$isLoading(false);
        let res = result.data;
        this.$toast.open({
          message: res.error
            ? res.message
            : 'Inbound has been confirmed successfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res.error) {
          handleBack(this.$router, this.$route);
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
  computed: {
    renderItems() {
      return this.items.map((item) => {
        return {
          ...item,
          customer_name: item.customer_name || '-',
          product_name: item.product_name || '-',
          cost_price: item.cost_price
            ? this.formatCurrency(item.cost_price)
            : '-',
          selling_price: item.selling_price
            ? this.formatCurrency(item.selling_price)
            : '-',
        };
      });
    },
  },
};
</script>