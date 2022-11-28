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
              <div class="form-group row mb-2">
                <label
                  for="from-warehouse"
                  class="col-sm-4 col-md-4 col-lg-24 form-label"
                >
                  Warehouse <strong class="text-danger">*</strong>
                </label>
                <div class="col-sm-8 col-md-8 col-lg-8">
                  <v-select
                    :options="warehouseOptions"
                    v-model="data_header.warehouse"
                    :value.sync="data_header.warehouse"
                    @input="getBatch"
                  >
                  </v-select>
                  <p style="color: red" v-if="required.warehouse.error">
                    {{ required.warehouse.message }}
                  </p>
                </div>
              </div>

              <div class="form-group row mb-2">
                <label
                  for="product-name"
                  class="col-sm-4 col-md-4 col-lg-24 form-label"
                >
                  Product Name <strong class="text-danger">*</strong>
                </label>
                <div class="col-sm-8 col-md-8 col-lg-8">
                  <v-select
                    :options="productOptions"
                    v-model="data_header.product"
                    :value.sync="data_header.product"
                    @input="getBatch"
                  >
                  </v-select>
                  <p style="color: red" v-if="required.product.error">
                    {{ required.product.message }}
                  </p>
                </div>
              </div>

              <div class="form-group row mb-2">
                <label
                  for="batch-number"
                  class="col-sm-4 col-md-4 col-lg-24 form-label"
                >
                  Batch No <strong class="text-danger">*</strong>
                </label>
                <div class="col-sm-8 col-md-8 col-lg-8">
                  <v-select
                    :options="batchNumberOptions"
                    v-model="data_header.batch"
                    :value.sync="data_header.batch"
                    @input="getSerialNumber"
                  >
                  </v-select>
                  <p style="color: red" v-if="required.batch.error">
                    {{ required.batch.message }}
                  </p>
                </div>
              </div>

              <div class="form-group row mb-2">
                <label
                  for="batch-number"
                  class="col-sm-4 col-md-4 col-lg-24 form-label"
                >
                  L2 Full Qty
                </label>
                <div class="col-sm-8 col-md-8 col-lg-8">
                  {{ full_box }} {{ full_box && "Sack" }}
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
                  <input
                    type="text"
                    class="form-control"
                    readonly
                    v-model="last_stock"
                  />
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
          <CButton type="reset" size="sm" @click="cancel()" color="danger"
            ><CIcon name="cil-ban" /> Cancel</CButton
          >
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
import $axiosMertrack from "../../../apiMertrack";
import "vue-select/dist/vue-select.css";
import moment from "moment";
export default {
  name: "FormPacking",
  watch: {
    data_header: {
      deep: true,
      handler(n, o) {
        if (!this.initial_load) {
          this.checkValidation();
        }
      },
    },
  },
  data() {
    return {
      initial_load: true,
      today: moment().format("DD-MMM-YYYY"),
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
      full_box: "",
      serialNumber: "",
      temp_item: [],
      productId: "",
      items: [],
      datas: [],
      detailModal: false,
      detailSerialOrAggregation: {
        productId: "",
        productName: "",
        batch: "",
        serial: [],
        gtin: "",
        nie: "",
        expiredDate: "",
      },
      item: [],
      customerOptions: [],
      warehouseError: false,
      productName: "",
      productOptions: [],
      batchNumberOptions: [],
      fields: [
        {
          key: "no",
          label: "No",
          sorter: false,
        },
        {
          key: "product_no",
          label: "Item No",
          sorter: false,
        },
        {
          key: "product_name",
          label: "Product Name",
          sorter: false,
        },
        {
          key: "batch_no",
          label: "Batch No",
          sorter: false,
        },
        {
          key: "exp",
          label: "Exp Date",
          sorter: false,
        },
        {
          key: "remark",
          label: "Remark",
          sorter: false,
        },
        {
          key: "quantity",
          label: "L1 Qty",
          sorter: false,
        },
        {
          key: "type",
          label: "Type",
          _classes: "font-weight-bold",
          sorter: false,
        },
        {
          key: "action",
          label: "Action",
          sorter: false,
          filter: false,
          // _style: "width:15%",
        },
      ],
      modalAdd: false,
      warehouseOptions: [],
      detail: {
        product: {
          id: "",
          name: "",
        },
        batch: {
          id: "",
          name: "",
        },
        serial: "",
      },
      error: {
        so: "",
        ref1: "",
        ref2: "",
        from: "",
        to: "",
      },
      action: "",
      required: {
        warehouse: { error: false, message: "Warehouse is required" },
        product: { error: false, message: "Customer is required" },
        batch: { error: false, message: "Batch No is required" },
      },
    };
  },
  mounted() {
    // cek parameter url
    this.action = this.$route.params.type == "read" ? "VIEW" : "ADD";
    // get from warehouse
    let param_warehouse = `ApiName=ListWarehouse&Params={"status":"Active"}&StatusCode=Active`;
    $axiosMertrack.get(`/general/mobile?${param_warehouse}`).then((result) => {
      let data = result.data.data;
      for (const it of data) {
        this.warehouseOptions.push({
          value: it.id,
          label: it.name,
        });
      }
    });
    // get product
    let param_product = `ApiName=ListProduct&Params={product_type:1}&StatusCode=Active`;
    $axiosMertrack.get(`/general/mobile?${param_product}`).then((result) => {
      var temp = result.data.data;
      for (const it of temp) {
        this.productOptions.push({
          value: it.id,
          name: it.name,
          label: `[${it.no}] ${it.name}`,
          no: it.no,
        });
      }
    });
  },
  methods: {
    getSerialNumber() {
      this.item = [];
      // this.bacthNumber_=""
      let param = `ApiName=GetStock&Params={date_format:"web",serial:"0000000000",product_id:${this.data_header.product.value},batch_no:"${this.data_header.batch.value}",warehouse_id:${this.data_header.warehouse.value}}&Id= `;
      $axiosMertrack.get(`/general/mobile?${param}`).then((result) => {
        this.error.batch = "";
        var temp = result.data.data[0];
        this.detail = temp;
        if (result.data.data.length > 0) {
          if (temp.stocks.length != 1) {
            this.$toast.open({
              message: `Product Batch cannot be found`,
              type: "error",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
            return;
          }
          this.full_box = temp.qty_packagingl2;
          this.last_stock = temp.stocks[0].quantity;
        } else {
          this.last_stock = "0";
          this.error.batch =
            "This batch dont have any stocks on that warehouse";
        }
      });
    },
    // checklist product before set data
    checkSerial(checked) {},
    getBatch() {
      if (this.data_header.warehouse && this.data_header.product) {
        this.batchNumberOptions = [];
        this.error.product = "";
        this.data_header.batch = null;
        let param_product = `ApiName=GetProductBatch&Params={product_id:${this.data_header.product.value},warehouse_id:${this.data_header.warehouse.value}}&Id= `;
        $axiosMertrack
          .get(`/general/mobile?${param_product}`)
          .then((result) => {
            if (result.data.data.length > 0) {
              var temp = result.data.data;
              for (const it of temp) {
                this.batchNumberOptions.push({
                  value: it.id,
                  label: `${it.id} <=> ${it.expired_date}`,
                });
              }
            } else {
              this.last_stock = "0";
              this.error.product =
                "This product dont have any batch on that warehouse";
            }
          });
      }
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
      let body = {
        ApiName: "PackNS",
        Params: {
          remark: "",
          items: this.items,
        },
      };
      // return;
      var message = `You are about to create this new transaction. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack.post(`/general/mobile`, body).then((result) => {
          this.$toast.open({
            message: result.data.error
              ? result.data.message
              : `Data has been saved succesfully `,
            type: result.data.error ? "error" : "success",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          let res = result.data.data;
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
      let isError = false;
      if (!this.data_header.warehouse) {
        this.error.from = "Warehouse field is required";
        isError = true;
      } else {
        this.error.from = "";
      }
      if (!this.data_header.product) {
        this.error.product = "Product field is required";
        isError = true;
      } else {
        this.error.product = "";
      }
      if (!this.data_header.batch) {
        this.error.batch = "Batch field is required";
        isError = true;
      } else {
        this.error.batch = "";
      }
      if (isError) {
        return false;
      }

      var res = this.data_header.batch.label.split(" <=> ");
      this.items = [];
      let temp_item = {};
      var total_stock = this.last_stock;
      var full_box = this.full_box;
      var total_full_box = total_stock / full_box;
      var incomplete_box = total_stock % full_box;
      for (var i = 0; i < parseInt(total_full_box); i++) {
        temp_item.no = i + 1;
        temp_item.warehouse = this.data_header.warehouse.value;
        temp_item.exp = res[1];
        temp_item.serial = "0000000000";
        temp_item.product_id = this.data_header.product.value;
        temp_item.batch_no = this.data_header.batch.value;
        temp_item.quantity = full_box;
        temp_item.remark = "Generated on Web";
        temp_item.product_no = this.data_header.product.no;
        temp_item.product_name = this.data_header.product.name;
        temp_item.type = "Full";
        this.can_proccess = true;
        this.items.push(temp_item);
        temp_item = {};
      }
      if (incomplete_box != 0) {
        temp_item.no = i + 1;
        temp_item.warehouse = this.data_header.warehouse.value;
        temp_item.exp = res[1];
        temp_item.serial = "0000000000";
        temp_item.product_id = this.data_header.product.value;
        temp_item.batch_no = this.data_header.batch.value;
        temp_item.quantity = incomplete_box;
        temp_item.remark = "Generated on Web";
        temp_item.product_no = this.data_header.product.no;
        temp_item.product_name = this.data_header.product.name;
        temp_item.type = "Partial";
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
      this.initial_load = false;
      let have_error = false;
      for (const rq in this.required) {
        if (!this.data_header[rq]) {
          this.required[rq].error = true;
          have_error = true;
        } else {
          this.required[rq].error = false;
        }
      }
      // If any error
      if (have_error) {
        return false;
      } else {
        return true;
      }
    },
    save() {
      // // cek semua input yang mandatory

      if (this.items.length == 0) {
        this.$toast.open({
          message: `Please add at least 1 product item to continue`,
          type: "error",
          dissmissible: true,
          position: "top-right",
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
