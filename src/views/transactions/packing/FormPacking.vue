<template>
  <div class="row">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
      <CCard>
        <CCardHeader>
          <h5>Packing [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6" md="6" lg="6">
              <CSelect
                placeholder="-Select-"
                :options="warehouseOptions"
                horizontal
                :value.sync="formData.warehouse_id"
                :is-valid="
                  initialLoad ? null : !formData.warehouse_id ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Warehouse
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>

              <CSelect
                placeholder="-Select-"
                :options="productOptions"
                horizontal
                :value.sync="formData.product_id"
                :is-valid="
                  initialLoad ? null : !formData.product_id ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Product Name
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>

              <CSelect
                placeholder="-Select-"
                :options="batchNumberOptions"
                horizontal
                :value.sync="formData.batch_no"
                @change="getSerialNumber"
                :is-valid="
                  initialLoad ? null : !formData.batch_no ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Batch No
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>
              <div class="form-group row mb-2">
                <label
                  for="batch-number"
                  class="col-sm-4 col-md-4 col-lg-24 form-label"
                >
                  L2 Full Qty
                </label>
                <div class="col-sm-8 col-md-8 col-lg-8">
                  {{ full_box }} {{ full_box && 'Sack' }}
                </div>
              </div>
              <div class="form-group row mb-2">
                <label
                  for="batch-number"
                  class="col-sm-4 col-md-4 col-lg-24 form-label"
                >
                  Available L1 Qty
                </label>
                <div class="col-sm-8 col-md-8 col-lg-8">
                  {{ last_stock }}
                </div>
              </div>
            </CCol>
            <CCol sm="6" md="6" lg="6">
              <div class="form-group row mb-2">
                <label
                  for="batch-number"
                  class="col-sm-4 col-md-4 col-lg-24 form-label"
                >
                  Trx Date
                </label>
                <div class="col-sm-8 col-md-8 col-lg-8">
                  <input
                    type="text"
                    class="form-control"
                    readonly
                    v-model="today"
                  />
                </div>
              </div>
            </CCol>
          </CRow>

          <div class="clearfix">
            <CButton
              v-if="can_generate == true"
              type="button"
              size="sm"
              class="float-right mb-4"
              color="success"
              @click="generatePacking()"
            >
              <v-icon name="cogs" /> Generate Packing
            </CButton>
          </div>

          <CDataTable
            hover
            striped
            sorter
            border
            :items="items"
            :fields="fields"
            class="text-left"
            style="font-size: 12px"
          >
            <template #action="{ item, index }">
              <td style="font-size: 12px">
                <CButton
                  v-if="can_delete == true"
                  color="danger"
                  size="sm"
                  @click="deleteRow(item, index)"
                >
                  <v-icon name="trash-alt" />
                </CButton>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
        <CCardFooter>
          <!-- <CButton type="button" size="sm" color="primary" @click="save()">
            <CIcon name="cil-check-circle" /> Submit
          </CButton> -->
          <CButton
            type="submit"
            size="sm"
            @click="proccess_all()"
            class="mr-2"
            color="primary"
            ><CIcon name="cil-check-circle" /> Submit</CButton
          >
          <ButtonBack />
          <!-- <CButton
            v-if="can_print == true"
            type="button"
            size="sm"
            class="m-1"
            color="warning"
            @click="print_all()"
          >
            <CIcon name="cil-print" /> Print
          </CButton> -->
        </CCardFooter>

        <!-- Modal Detail Barang Dipilih  -->
      </CCard>
    </div>
  </div>
</template>

<script>
let dataPost = [];
import $axiosMertrack from '../../../apiMertrack';
import 'vue-select/dist/vue-select.css';
import moment from 'moment';
import { getMstProduct } from '../../../resource/MstProduct';
import { getMstWarehouse } from '../../../resource/MstWarehouse';
export default {
  name: 'FormPacking',
  watch: {
    formData: {
      deep: true,
      handler(item) {
        if (item.warehouse_id && item.product_id) {
          this.getBatch();
        }
        if (item.batch_no) {
          let idx = this.batchNumberOptions.findIndex(
            (o) => o.value == item.batch_no
          );
          let batch = this.batchNumberOptions[idx];
          this.formData.batch_detail = batch;
          this.full_box = batch.qty_packagingl2;
          this.last_stock = batch.quantity;
        }
      },
    },
    data_header: {
      deep: true,
      handler() {
        if (!this.initial_load) {
          this.checkValidation();
        }
      },
    },
  },
  data() {
    return {
      initialLoad: true,
      formData: {
        warehouse_id: null,
        product_id: null,
        batch_no: null,
        remark: null,
        batch_detail: {},
        items: [],
      },
      initial_load: true,
      today: moment().format('DD-MMM-YYYY'),
      data_header: {
        warehouse: null,
        product: null,
        batch: null,
      },
      can_generate: true,
      can_proccess: false,
      can_delete: false,
      can_print: false,
      chekcedBatch: [],
      errors: false,
      checkedSerials: [],
      checked: [],
      val: [],
      last_stock: 0,
      full_box: '',
      serialNumber: '',
      temp_item: [],
      productId: '',
      items: [],
      datas: [],
      detailModal: false,
      detailSerialOrAggregation: {
        productId: '',
        productName: '',
        batch: '',
        serial: [],
        gtin: '',
        nie: '',
        expiredDate: '',
      },
      item: [],
      customerOptions: [],
      warehouseError: false,
      productName: '',
      productOptions: [],
      batchNumberOptions: [],
      fields: [
        {
          key: 'no',
          label: 'No',
          sorter: false,
        },
        {
          key: 'product_no',
          label: 'Item No',
          sorter: false,
        },
        {
          key: 'product_name',
          label: 'Product Name',
          sorter: false,
        },
        {
          key: 'batch_no',
          label: 'Batch No',
          sorter: false,
        },
        {
          key: 'expired_date',
          label: 'Exp Date',
          sorter: false,
        },
        {
          key: 'remark',
          label: 'Remark',
          sorter: false,
        },
        {
          key: 'quantity',
          label: 'L1 Qty',
          sorter: false,
        },
        {
          key: 'type',
          label: 'Type',
          _classes: 'font-weight-bold',
          sorter: false,
        },
        {
          key: 'action',
          label: 'Action',
          sorter: false,
          filter: false,
          // _style: "width:15%",
        },
      ],
      modalAdd: false,
      warehouseOptions: [],
      detail: {
        product: {
          id: '',
          name: '',
        },
        batch: {
          id: '',
          name: '',
        },
        serial: '',
      },
      error: {
        so: '',
        ref1: '',
        ref2: '',
        from: '',
        to: '',
      },
      action: '',
      required: {
        warehouse: { error: false, message: 'Warehouse is required' },
        product: { error: false, message: 'Customer is required' },
        batch: { error: false, message: 'Batch No is required' },
      },
    };
  },
  async mounted() {
    // cek parameter url
    this.action = this.$route.params.type == 'read' ? 'VIEW' : 'ADD';
    // get from warehouse
    let _wh = await getMstWarehouse({ status: 'Active' });
    if (_wh) {
      for (const it of _wh.data) {
        this.warehouseOptions.push({
          value: `${it.id}`,
          label: it.name,
        });
      }
    }
    // get product
    let _product = await getMstProduct({ product_type: 1, show_status: true });
    if (_product) {
      for (const it of _product.data) {
        this.productOptions.push({
          value: it.id,
          name: it.name,
          label: `[${it.no}] ${it.name}`,
          no: it.no,
        });
      }
    }
  },
  methods: {
    getSerialNumber() {
      return;
    },
    getBatch() {
      let param = {
        product_id: this.formData.product_id,
        warehouse_id: this.formData.warehouse_id,
        parent: null,
        packaging_level: 1,
      };
      param = new URLSearchParams(param).toString();
      let _url = `/v3/helper/detail-item/batch?${param}`;
      $axiosMertrack.get(_url).then((result) => {
        let _data = result.data.data;
        this.batchNumberOptions = [];
        if (_data.length > 0) {
          var temp = result.data.data;
          for (const it of temp) {
            this.batchNumberOptions.push({
              ...it,
              value: it.batch_no,
              label: `${it.batch_no} <=> ${it.expired_date}`,
            });
          }
        } else {
          this.last_stock = '0';
        }
      });
    },
    deleteRow(item, index) {
      this.items.splice(index, 1);
      this.detailSerialOrAggregation.serial.splice(index, 1);
      dataPost.splice(index, 1);
      this.checkedSerials.splice(index, 1);
      this.chekcedBatch.splice(index, 1);
      if (this.items.length == 0) {
        this.can_proccess = false;
      }
    },
    proccess_all() {
      if (!this.checkValidation()) {
        return;
      }
      // return;
      var message = `You are about to create this new transaction. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.formData.items = this.items;
        this.$isLoading(true);
        $axiosMertrack
          .put(`/v3/transaction/packing`, this.formData)
          .then((result) => {
            this.$toast.open({
              message: result.data.error
                ? result.data.message
                : `Data has been saved succesfully `,
              type: result.data.error ? 'error' : 'success',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
            this.$isLoading(false);
            if (!result.data.error) {
              this.$router.back();
            }
          });
      }
      return;
    },
    generatePacking() {
      if (!this.checkValidation()) {
        return;
      }

      this.items = [];
      let temp_item = {};
      var total_stock = this.last_stock;
      var full_box = this.full_box;
      var total_full_box = total_stock / full_box;
      var incomplete_box = total_stock % full_box;
      console.log(this.formData);
      for (var i = 0; i < parseInt(total_full_box); i++) {
        temp_item.no = i + 1;
        temp_item.expired_date = this.formData.batch_detail['expired_date'];
        temp_item.serial = '0000000000';
        temp_item.product_id = this.formData.product_id;
        temp_item.batch_no = this.formData.batch_no;
        temp_item.epc_key = this.formData.batch_detail['epc_key'];
        temp_item.epc_type = this.formData.batch_detail['epc_type'];
        temp_item.quantity = full_box;
        temp_item.remark = 'Generated on Web';
        temp_item.product_no = this.formData.batch_detail['product_no'];
        temp_item.product_name = this.formData.batch_detail['product_name'];
        temp_item.type = 'Full';
        this.can_proccess = true;
        this.items.push(temp_item);
        temp_item = {};
      }

      if (incomplete_box != 0) {
        temp_item.no = i + 1;
        temp_item.expired_date = this.formData.batch_detail['expired_date'];
        temp_item.serial = '0000000000';
        temp_item.product_id = this.formData.product_id;
        temp_item.batch_no = this.formData.batch_no;
        temp_item.epc_key = this.formData.batch_detail['epc_key'];
        temp_item.epc_type = this.formData.batch_detail['epc_type'];
        temp_item.quantity = incomplete_box;
        temp_item.remark = 'Generated on Web';
        temp_item.product_no = this.formData.batch_detail['product_no'];
        temp_item.product_name = this.formData.batch_detail['product_name'];
        temp_item.type = 'Partial';
        this.items.push(temp_item);
        this.can_proccess = true;
        temp_item = {};
      }
      if (this.items.length > 0) {
        this.can_delete = true;
        this.can_proccess = true;
      }
    },
    checkValidation() {
      this.initialLoad = false;
      if (
        !this.formData.warehouse_id ||
        !this.formData.product_id ||
        !this.formData.batch_no
      ) {
        this.$toast.open({
          message: `Please input all the required data.`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      return true;
    },
    save() {
      // // cek semua input yang mandatory

      if (this.items.length == 0) {
        this.$toast.open({
          message: `Please add at least 1 product item to continue`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
    },
    cancel() {
      this.$router.back();
    },
  },
  computed: {
    detailItems() {
      return this.item.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>
