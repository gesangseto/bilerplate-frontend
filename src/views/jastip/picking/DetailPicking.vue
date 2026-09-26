<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <CCard>
        <CCardHeader class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">{{ $activeMenu.name }} [{{ action }}]</h5>
          <ButtonInfo :formData="picking" v-if="action !== 'Create'" />
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="6">
              <table style="width: 100%">
                <tr style="height: 50px">
                  <td style="width: 40%">ID</td>
                  <td style="width: 60%">
                    <input readonly class="form-control" v-model="picking.id" />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Trx Date</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.created_date"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Requested By</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.created_full_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Customer</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.customer_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Customer Phone</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.customer_phone"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Warehouse</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.warehouse_name"
                    />
                  </td>
                </tr>
              </table>
            </CCol>
            <CCol md="6">
              <table style="width: 100%">
                <tr style="height: 50px">
                  <td style="width: 40%">Status</td>
                  <td style="width: 60%">
                    <input readonly class="form-control" :value="statusText" />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Receiver Name</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.receiver_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Receiver Phone</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.receiver_phone"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Receiver Address</td>
                  <td>
                    <textarea
                      readonly
                      class="form-control"
                      v-model="picking.receiver_address"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Courier</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="courierText"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Resi No</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.courier_number"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Courier Price</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.courier_price"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Weight</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.weight"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Total Qty</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.quantity"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Last Action By</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.modified_full_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Last Action Date</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.modified_date"
                    />
                  </td>
                </tr>
              </table>
            </CCol>
          </CRow>
          <div class="my-4">
            <div class="row my-3">
              <div class="col-lg-12 col-md-12 col-sm-12 col-xl-12">
                <h5>Picked Items</h5>
                <CDataTable
                  table-filter
                  hover
                  striped
                  sorter
                  border
                  :items="renderDetailItem"
                  :fields="fieldItem"
                  class="text-left"
                  style="font-size: 12px"
                />
              </div>
            </div>
          </div>
        </CCardBody>
        <CCardFooter>
          <div class="float-left">
            <ButtonBack />
          </div>
          <div class="float-right">
            <ButtonPermission
              v-if="picking.id"
              exportType="excel"
              :permission="'print'"
              @click="handleClickExport('xls')"
            />
            <ButtonPermission
              v-if="picking.id"
              exportType="pdf"
              :permission="'print'"
              @click="handleClickExport('pdf')"
            />
          </div>
        </CCardFooter>
      </CCard>
    </div>
  </div>
</template>

<script>
import { exportDataV3, handleBack } from '../../../utils';
import { getPicking } from '../../../resource/TrxPicking';

const STATUS_PICKING = {
  '-1': 'Canceled',
  0: 'Waiting',
  1: 'Done',
  2: 'In Courier',
  3: 'Returned',
};

export default {
  name: 'DetailPicking',
  data() {
    return {
      initial_load: true,
      action: '',
      items: [],
      picking: {
        status: '',
        created_date: '',
        customer_name: '',
        customer_phone: '',
        warehouse_name: '',
        receiver_name: '',
        receiver_phone: '',
        receiver_address: '',
        courier_name: '',
        courier_code: '',
        courier_number: '',
        courier_price: '',
        modified_full_name: '',
        modified_date: '',
      },
      fieldItem: [
        { key: 'nomor', label: 'No' },
        { key: 'item_stock_id', label: 'Item ID' },
        { key: 'product_name', label: 'Product' },
        { key: 'barcode', label: 'Barcode' },
        { key: 'batch_no', label: 'Batch No' },
        { key: 'quantity', label: 'Qty' },
        { key: 'foreign_price', label: 'Foreign Price' },
        { key: 'local_price', label: 'Local Price' },
        { key: 'foreign_profit', label: 'Foreign Profit' },
        { key: 'local_profit', label: 'Local Profit' },
      ],
    };
  },
  async mounted() {
    this.action = this.$route.params.type == 'read' ? 'VIEW' : 'EDIT';
    let getData = await getPicking({ id: this.$route.params.id });
    if (getData && !getData?.error && getData.data && getData.data[0]) {
      let data = getData.data[0];
      this.picking = data;
      this.items = data.items || [];
    }
  },
  methods: {
    back() {
      handleBack(this.$router, this.$route);
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: {
          id: this.$route.params.id,
        },
        exportType: type,
        url: '/v1/jastip/picking',
      });
    },
    formatCurrency(val) {
      if (val === null || val === undefined || val === '') return '-';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(val);
    },
  },
  computed: {
    statusText() {
      const s = String(this.picking.status);
      return STATUS_PICKING[s] || this.picking.status_name || '-';
    },
    courierText() {
      const name = this.picking.courier_name || '';
      const code = this.picking.courier_code || '';
      if (!name && !code) return '-';
      return code ? `${name} (${code})`.trim() : name;
    },
    renderDetailItem() {
      return (this.items || []).map((item, index) => {
        return {
          ...item,
          nomor: index + 1,
          item_stock_id: item.item_stock_id || '-',
          product_name: item.product_name || '-',
          barcode: item.barcode || '-',
          batch_no: item.batch_no || '-',
          quantity: item.quantity || 0,
          foreign_price: this.formatCurrency(item.foreign_price),
          local_price: this.formatCurrency(item.local_price),
          foreign_profit: this.formatCurrency(item.foreign_profit),
          local_profit: this.formatCurrency(item.local_profit),
        };
      });
    },
  },
};
</script>
