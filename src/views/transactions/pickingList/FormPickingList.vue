<template>
  <div class="row">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
      <CCard>
        <CCardHeader>
          <h5>Picking List [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <div class="mb-5">
            <div class="form-group row mb-2">
              <label for="so" class="col-sm-2 col-md-2 col-lg-2 form-label">
                SO No <strong class="text-danger">*</strong>
              </label>
              <div class="col-sm-5 col-md-5 col-lg-5">
                <input
                  type="text"
                  id="so"
                  class="form-control"
                  v-model="picking.soNumber"
                />
                <p style="color: red" v-if="required.soNumber.error">
                  {{ required.soNumber.message }}
                </p>
              </div>
              <label
                for="refFile1"
                class="col-sm-2 col-md-2 col-lg-2 col form-label"
              >
                SO Ref
              </label>
              <div class="col-sm-2 col-md-2 col-lg-2">
                <input
                  type="file"
                  class="custom-file-input"
                  @change="uploadRef1"
                  id="refFile1"
                />
                <label
                  class="custom-file-label"
                  id="label-ref1"
                  for="refFile1"
                  >{{ file.ref1 }}</label
                >
                <span
                  ><strong class="text-danger" style="font-size: 11px">{{
                    error.ref1
                  }}</strong></span
                >
              </div>
              <div class="col-sm-1 col-md-1 col-lg-1"></div>
            </div>

            <div class="form-group row mb-2">
              <label
                for="so-date"
                class="col-sm-2 col-md-2 col-lg-2 form-label"
              >
                SO Date <strong class="text-danger">*</strong>
              </label>
              <div class="col-sm-8 col-md-8 col-lg-8">
                <datepicker
                  :format="formatDate"
                  v-model="picking.soDate"
                ></datepicker>
              </div>
            </div>

            <div class="form-group row mb-2">
              <label for="erp" class="col-sm-2 col-md-2 col-lg-2 form-label">
                ERP Picking List No
              </label>
              <div class="col-sm-5 col-md-5 col-lg-5">
                <input
                  type="text"
                  id="erp"
                  class="form-control"
                  v-model="picking.erpNumber"
                />
              </div>
              <label
                for="refFile2"
                class="col-sm-2 col-md-2 col-lg-2 col form-label"
              >
                ERP PL Ref
              </label>
              <div class="col-sm-2 col-md-2 col-lg-2">
                <input
                  type="file"
                  class="custom-file-input"
                  @change="uploadRef2"
                  id="refFile2"
                />
                <label
                  class="custom-file-label"
                  id="label-ref2"
                  for="refFile2"
                  >{{ file.ref2 }}</label
                >
                <span
                  ><strong class="text-danger" style="font-size: 11px">{{
                    error.ref2
                  }}</strong></span
                >
              </div>
              <div class="col-sm-1 col-md-1 col-lg-1"></div>
            </div>

            <div class="form-group row mb-2">
              <label
                for="from-warehouse"
                class="col-sm-2 col-md-2 col-lg-2 form-label"
              >
                Warehouse <strong class="text-danger">*</strong>
              </label>
              <div class="col-sm-5 col-md-5 col-lg-5">
                <v-select
                  :disabled="items.length != 0 ? true : false"
                  :options="warehouseOptions"
                  :reduce="(opt) => opt.value"
                  v-model="picking.warehouse_id"
                >
                </v-select>
                <p style="color: red" v-if="required.warehouse_id.error">
                  {{ required.warehouse_id.message }}
                </p>
              </div>
            </div>

            <div class="form-group row mb-2">
              <label
                for="to-warehouse"
                class="col-sm-2 col-md-2 col-lg-2 form-label"
              >
                Customer <strong class="text-danger">*</strong>
              </label>
              <div class="col-sm-5 col-md-5 col-lg-5">
                <v-select
                  :options="customerOptions"
                  :reduce="(opt) => opt.value"
                  v-model="picking.customer_id"
                >
                </v-select>
                <p style="color: red" v-if="required.customer_id.error">
                  {{ required.customer_id.message }}
                </p>
              </div>
            </div>
          </div>

          <div class="clearfix">
            <CButton
              type="button"
              size="sm"
              class="float-right mb-4"
              color="success"
              @click="addProduct()"
            >
              <CIcon name="cil-plus" /> Add
            </CButton>
          </div>

          <CDataTable
            tableFilter
            hover
            striped
            sorter
            border
            :items="renderItems"
            :fields="fields"
            class="text-left"
            style="font-size: 12px"
          >
            <template #action="{ item, index }">
              <td style="font-size: 12px">
                <Button
                  v-c-tooltip="'Delete'"
                  :type="'delete'"
                  @click="deleteRow(item, index)"
                />
                <Button
                  v-c-tooltip="'View'"
                  v-if="item.packaging_level > 1"
                  :type="'read'"
                  @click="detailRow(item, index)"
                />
              </td>
            </template>
          </CDataTable>
        </CCardBody>
        <CCardFooter>
          <CButton type="button" size="sm" color="primary" @click="save()">
            <CIcon name="cil-check-circle" /> Submit
          </CButton>
          <CButton
            type="button"
            size="sm"
            class="m-1"
            color="danger"
            @click="cancel()"
          >
            <CIcon name="cil-ban" /> Cancel
          </CButton>
        </CCardFooter>

        <CModal
          title="Add Item (Picking List)"
          color="info"
          :show.sync="modalAdd"
          size="xl"
        >
          <FormAddItem
            :useDeliveryDayLimit="true"
            :currentItem="items"
            :filter="picking"
            v-on:handleResult="handleResult($event)"
          />
          <template #footer>
            <CButton type="button" size="sm" color="primary" @click="setData()">
              <CIcon name="cil-plus" /> Set Data
            </CButton>
            <CButton
              type="button"
              size="sm"
              color="danger"
              @click="closeModalAdd()"
            >
              <CIcon name="cil-ban" /> Cancel
            </CButton>
          </template>
        </CModal>
        <!-- Modal Detail Barang Dipilih  -->
        <CModal
          title="Detail"
          color="warning"
          :show.sync="detailModal"
          size="lg"
        >
          <DetailStockSerial v-if="detailModal == true" :item="detail_item" />
          <template #footer>
            <CButton
              size="sm"
              color="danger"
              type="button"
              @click="
                closeModalDetail();
                detailModal = false;
              "
            >
              <CIcon name="cil-x-circle" /> Close
            </CButton>
          </template>
        </CModal>
      </CCard>
    </div>
  </div>
</template>

<script>
const ekstensiFileValid = ["pdf", "doc", "docx", "xls", "xlsx"];
import $axiosMertrack from "../../../apiMertrack";
import { parsingBarcode } from "../../../utils";
let fileRef1;
let fileRef2;
let ekstensiFileRef1;
let ekstensiFileRef2;
let sizeFileRef1, sizeFileRef2;
const reader = new FileReader();
import Datepicker from "vuejs-datepicker";
import moment from "moment";
export default {
  name: "FormPickingList",
  components: {
    Datepicker,
  },
  watch: {
    picking: {
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
      maxFileSize: 500,
      chekcedBatch: [],
      errors: false,
      checkedSerials: [],
      checked: [],
      val: [],
      packingL1: "",
      packingL2: "",
      packingL3: "",
      packingL4: "",
      qty: 0,
      manyProductId: [],
      manyExpired: [],
      manyNie: [],
      manyGtin: [],
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
      detailItemsFields: [
        {
          key: "gtin_cp",
          label: "GTIN / CP",
        },
        {
          key: "serial",
          label: "SN",
        },
        {
          key: "packaging_level",
          label: "Pkg Level",
        },
        {
          key: "packaging_name",
          label: "Pkg Name",
        },
        {
          key: "quantity",
          label: "L1 Qty",
        },
        {
          key: "action",
          label: "Action",
        },
      ],
      detail_item: {},
      item: [],
      customerOptions: [],
      warehouseError: false,
      productName: "",
      productOptions: [],
      batchNumberOptions: [],
      items: [],
      temp_items: [],
      fields: [
        {
          key: "product_no",
          label: "Item No",
        },
        {
          key: "product_name",
          label: "Product Name",
        },
        {
          key: "batch_no",
          label: "Batch No",
          _classes: "font-weight-bold",
        },
        {
          key: "expired_date",
          label: "Exp Date",
        },
        {
          key: "product_nie",
          label: "NIE",
        },
        {
          key: "gtin_cp",
          label: "GTIN / CP",
        },
        {
          key: "serial",
          label: "SN",
        },
        {
          key: "packaging_level",
          label: "Pkg Level",
        },
        {
          key: "packaging_name",
          label: "Pkg Name",
        },
        {
          key: "quantity",
          label: "L1 Qty",
        },
        {
          key: "action",
          label: "Action",
          sorter: false,
          filter: false,
          _style: "width:12%",
        },
      ],
      modalAdd: false,
      warehouseOptions: [],
      picking: {
        soNumber: "",
        soDate: "",
        fileName1: "",
        fileContent1: "",
        fileName2: "",
        fileContent2: "",
        erpNumber: "",
        warehouse_id: null,
        customer_id: null,
        items: [],
      },
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
        soNumber: "",
        ref1: "",
        ref2: "",
        warehouseId: "",
        customerId: "",
      },
      inputError: false,
      file: {
        ref1: "Choose file...",
        ref2: "Choose file...",
      },
      action: "",
      newPickingData: {},
      required: {
        warehouse_id: { error: false, message: "Warehouse is required" },
        customer_id: { error: false, message: "Customer is required" },
        soNumber: { error: false, message: "SO No is required" },
      },
    };
  },
  mounted() {
    //ambil list warehouse
    this.loadListWarehouse();
    this.loadListCustomer();
    // cek parameter url
    this.action = this.$route.params.id === undefined ? "ADD" : "Edit";
    this.picking.soDate = new Date();
    this.formatDate(this.picking.soDate);
  },
  methods: {
    loadListWarehouse() {
      let param = `ApiName=ListWarehouse&Params={"category_id":3,"status":"Active"}&StatusCode=Active `;
      $axiosMertrack.get(`/general/mobile?${param}`).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.warehouseOptions.push({
            value: it.id,
            label: it.name,
          });
        }
      });
      return;
    },
    loadListCustomer() {
      let param = `ApiName=ListCustomer&Params{"status":"Active"}&StatusCode=Active`;
      $axiosMertrack.get(`/general/mobile?${param}`).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.customerOptions.push({
            value: it.id,
            label: it.name,
          });
        }
      });
      return;
    },
    closeModalDetail() {
      this.datas = [];
    },
    detailRow(item) {
      if (item.packaging_level == 1) {
        return false;
      }
      this.detail_item = item;
      this.detailModal = true;
    },
    removeDuplicateData(data) {
      data = data.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.barcode_2d === value.barcode_2d)
      );
      return data;
    },

    handleResult(data) {
      // this.temp_items = this.temp_items.concat(data);
      this.temp_items = this.removeDuplicateData(data);
    },
    setData() {
      if (this.temp_items.length == 0) {
        this.$toast.open({
          message: `No data to be set`,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        return;
      }
      this.items = this.items.concat(this.temp_items);
      this.items = this.removeDuplicateData(this.items);
      this.temp_items = [];
      this.modalAdd = false;
    },
    closeModalAdd() {
      this.checked = [];
      this.item = [];
      this.detail.batch.name = "";
      this.detail.product.name = "";
      this.modalAdd = false;
    },
    deleteRow(item, index) {
      this.items.splice(index, 1);
    },
    addProduct() {
      if (!this.checkValidation()) {
        return;
      }
      this.modalAdd = true;
      return;
    },
    formatDate(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
    uploadRef1(event) {
      fileRef1 = event.target.files[0];
      if (fileRef1 != undefined || fileRef1 != null) {
        this.file.ref1 = event.target.files[0].name;
        sizeFileRef1 = event.target.files[0].size;
        this.picking.fileName1 = event.target.files[0].name;
        let pecah = this.picking.fileName1.split(".").reverse();
        ekstensiFileRef1 = pecah[0];
        if (!ekstensiFileValid.includes(ekstensiFileRef1)) {
          this.$toast.open({
            message: `You have selected an unsupported Ref 1 file type. Please select the following supported file types (pdf, doc, docx, xls, xlsx)`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          this.file.ref1 = "Choose file...";
          this.errors = true;
          return false;
        }
        if (sizeFileRef1 > this.maxFileSize * 1000) {
          this.$toast.open({
            message: `The Ref 1 file you have selected exceed the maximum supported file size of ${this.maxFileSize} KB`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          this.file.ref1 = "Choose file...";
          this.errors = true;
          return false;
        }
        this.errors = false;
        this.convertBase64(fileRef1);
      } else {
        this.file.ref1 = "Choose file...";
        this.errors = false;
      }
    },
    uploadRef2(event) {
      fileRef2 = event.target.files[0];
      if (fileRef2) {
        this.file.ref2 = event.target.files[0].name;
        sizeFileRef2 = event.target.files[0].size;
        this.picking.fileName2 = event.target.files[0].name;
        let pecah = this.picking.fileName2.split(".").reverse();
        ekstensiFileRef2 = pecah[0];
        if (!ekstensiFileValid.includes(ekstensiFileRef2)) {
          this.$toast.open({
            message: `You have selected an unsupported Ref 2 file type. Please select the following supported file types (pdf, doc, docx, xls, xlsx)`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          this.file.ref2 = "Choose file...";
          this.errors = true;
          return false;
        }
        if (sizeFileRef2 > this.maxFileSize * 1000) {
          this.$toast.open({
            message: `The Ref 2 file you have selected exceed the maximum supported file size of ${this.maxFileSize} KB`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          this.file.ref2 = "Choose file...";
          this.errors = true;
          return false;
        }
        this.errors = false;
        this.convertBase64Ref2(fileRef2);
      } else {
        this.file.ref2 = "Choose file...";
        this.errors = false;
      }
    },
    convertBase64(file) {
      reader.onload = (e) => {
        this.picking.fileContent1 = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    convertBase64Ref2(file) {
      reader.onload = (e) => {
        this.picking.fileContent2 = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    checkValidation() {
      this.initial_load = false;
      let have_error = false;
      for (const rq in this.required) {
        if (!this.picking[rq]) {
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
      if (!this.checkValidation()) {
        return;
      }
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
      let items = [];
      for (const it of this.items) {
        if (it.barcode_2d && it.serial != "0000000000") {
          items.push(parsingBarcode(it.barcode_2d));
        } else {
          items.push({
            batch_no: it.batch_no,
            exp: it.expired_date,
            serial: it.serial,
            quantity: it.quantity,
            remark: "",
            warehouse: this.picking.warehouse_id,
          });
        }
      }
      let dataPost = {
        ApiName: "PickingInput",
        Params: {
          warehouseId: this.picking.warehouse_id,
          customerId: this.picking.customer_id,
          soDate: this.picking.soDate,
          soNumber: this.picking.soNumber,
          erpNumber: this.picking.erpNumber,
          fileName1: this.picking.fileName1,
          fileContent1: this.picking.fileContent1,
          fileName2: this.picking.fileName2,
          fileContent2: this.picking.fileContent2,
          items: items,
        },
      };
      var message = `You are about to create this new transaction. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack
          .post("/general/web", dataPost)
          .then((result) => {
            this.$isLoading(false);
            let res = result.data;
            this.$toast.open({
              message: res.error
                ? res.message
                : "Data has been saved succesfully ",
              type: res.error ? "error" : "success",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
            if (!res.error) {
              this.items = [];
              dataPost = [];
              this.$router.back();
            }
          })
          .catch((err) => {
            this.$isLoading(false);
            this.$toast.open({
              message: `${err}`,
              type: "error",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
          });
      }
      return;
    },
    cancel() {
      this.$router.back();
    },
  },
  computed: {
    renderItems() {
      return this.items.map((item) => {
        return {
          ...item,
          packaging_name: item[`name_packaging_l${item.packaging_level}`],
          gtin_cp:
            item.epc_type == "sscc" ? item.company_prefix : item.gtin_sscc,
        };
      });
    },
  },
};
</script>

<style>
#label-ref1 {
  overflow: hidden;
}

#label-ref2 {
  overflow: hidden;
}
</style>
