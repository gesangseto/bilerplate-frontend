<template>
  <CRow>
    <CCol col="12" xl="12" sm="12">
      <CCard>
        <CCardHeader>
          <h5>Stock Transfer [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody class="mb-5 mt-2">
          <CForm novalidate>
            <CRow>
              <CCol sm="12">
                <CSelect
                  label="Warehouse"
                  placeholder="--Select--"
                  horizontal
                  :options="listWarehouseFrom"
                  @change="getFromWarehouse()"
                  v-model="data_header.fromWarehouse"
                  :disabled="disableWarehouse"
                  :value.sync="data_header.fromWarehouse"
                  :invalid-feedback="required.fromWarehouse.message"
                  :add-input-classes="{
                    'is-invalid': required.fromWarehouse.error,
                  }"
                >
                  >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Source Warehouse
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CSelect>
                <CSelect
                  :options="listWarehouseTo"
                  horizontal
                  placeholder="--Select--"
                  :disabled="disableWarehouse"
                  :value.sync="data_header.toWarehouse"
                  v-model="data_header.toWarehouse"
                  @change="getToWarehouse()"
                  :invalid-feedback="required.toWarehouse.message"
                  :add-input-classes="{
                    'is-invalid': required.toWarehouse.error,
                  }"
                >
                  >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Destination Warehouse
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CSelect>
              </CCol>
            </CRow>
            <CRow>
              <CCol col="12" xl="12">
                <CButton
                  size="sm"
                  class="float-right m-1"
                  color="success"
                  @click="Add()"
                >
                  <CIcon name="cil-plus" /> Add
                </CButton>
              </CCol>
            </CRow>
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
              >
                <template #action="{ item, index }">
                  <td>
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
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CButton @click="save()" color="primary" size="sm" type="submit">
            <CIcon name="cil-check-circle" /> Submit
          </CButton>
          <CButton
            @click="cancel()"
            class="m-1"
            color="danger"
            size="sm"
            type="button"
          >
            <CIcon name="cil-ban" /> Cancel
          </CButton>
        </CCardFooter>
      </CCard>
    </CCol>
    <CModal
      title="Add Item (Stock Transfer)"
      centered="centered"
      color="info"
      :show.sync="modalAdd"
      size="xl"
    >
      <FormAddItem
        :currentItem="items"
        :filter="data_header"
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
    <CModal title="Detail" color="warning" :show.sync="detailModal" size="lg">
      <DetailStockSerial v-if="detailModal == true" :item="detail_item" />
      <template #footer>
        <CButton
          size="sm"
          color="danger"
          type="button"
          @click="
            closeDetailModal();
            detailModal = false;
          "
        >
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import "../../../assets/js/jquery-ui";
import $axiosMertrack from "../../../apiMertrack";
import { parsingBarcode } from "../../../utils";
// import vueSelect from 'vue-select';

export default {
  name: "FormStockTransfer",
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
      data_header: {
        warehouse_id: null,
        fromWarehouse: null,
        toWarehouse: null,
        product: null,
        batch: null,
      },
      detail_item: {},
      disableWarehouse: false,
      listTempChecked: [],
      listChecked: [],
      itemsSerial: [],
      serialChecked: [],
      checked: [],
      batchExpiredDate: [],
      qty: 0,
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
      item: [],
      modalAdd: false,
      action: "Edit",
      close: false,
      items: [],
      temp_items: [],
      productId: [],
      productName: "",
      transfer: {
        fromWarehouse: "",
        toWarehouse: "",
        detailProduct: {
          product: {},
          batchNumber: {},
          packaging: "",
          serial: "",
          quantity: "",
        },
      },
      options: [],
      idArticles: [],
      BatchNo: [],
      listWarehouseFrom: [],
      listWarehouseTo: [],
      listProductName: [],
      listBatchNumber: [],
      listPackagingLevel: [],
      checkedBatch: [],
      warehouseError: false,
      fields: [
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
          key: "expired_date",
          label: "Exp Date",
          sorter: false,
        },
        {
          key: "product_nie",
          label: "NIE",
          sorter: false,
        },
        {
          key: "gtin_cp",
          label: "GTIN / CP",
          sorter: false,
        },
        {
          key: "serial",
          label: "SN",
          sorter: false,
        },
        {
          key: "packaging_level",
          label: "Pkg Level",
          sorter: false,
        },
        {
          key: "packaging_name",
          label: "Pkg Name",
          sorter: false,
        },
        {
          key: "quantity",
          label: "L1 Qty",
          sorter: false,
        },
        {
          key: "action",
          label: "Action",
          sorter: false,
        },
      ],
      required: {
        fromWarehouse: {
          error: false,
          message: "Source warehouse is required",
        },
        toWarehouse: {
          error: false,
          message: "Destination warehouse is required",
        },
      },
    };
  },
  mounted() {
    //ambil list warehouse
    this.loadListWarehouse();

    // aksi add dan edit
    this.action = this.$route.params.id === undefined ? "ADD" : "EDIT";
  },
  methods: {
    getFromWarehouse() {
      this.data_header.warehouse_id = this.data_header.fromWarehouse;
    },
    getToWarehouse() {},
    closeDetailModal() {
      this.datas = [];
      this.detailSerialOrAggregation = {};
    },
    Add() {
      this.data_header.batch = null;
      this.data_header.product = null;
      //   pengecekan jika tidak pilih warehouse
      if (!this.checkValidation()) {
        return;
      }

      this.modalAdd = true;
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
      return;
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
      return;
    },
    closeModalAdd() {
      this.temp_items = [];
      this.modalAdd = false;
    },
    loadListWarehouse() {
      let from_warehouse = `ApiName=ListWarehouse&Params={"status":"Active","category_id":1}&StatusCode=Active`;
      $axiosMertrack.get(`/general/mobile?${from_warehouse}`).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.listWarehouseFrom.push({
            value: it.id,
            label: it.name,
          });
        }
      });
      let to_warehouse = `ApiName=ListWarehouse&Params={"status":"Active","category_id":3}&StatusCode=Active`;
      $axiosMertrack.get(`/general/mobile?${to_warehouse}`).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.listWarehouseTo.push({
            value: it.id,
            label: it.name,
          });
        }
      });
      return;
    },
    updateData() {
      let index = this.editPicking.index;
      let editPicking = this.editPicking;
      this.items.splice(index, 1, editPicking);
    },
    deleteRow(item, index) {
      this.items.splice(index, 1);
      if (this.listChecked.length == 0) {
        this.disableWarehouse = false;
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
      if (!this.checkValidation()) {
        return;
      }
      if (this.items.length <= 0) {
        this.$toast.open({
          message: "Please add at least 1 product item to continue",
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        return;
      }

      // Mapping data baru untuk di save
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
            warehouse: this.data_header.warehouse_id,
          });
        }
      }
      let fixDataTransfer = {
        ApiName: "TransferInput",
        Params: {
          fromWarehouse: this.data_header.fromWarehouse,
          toWarehouse: this.data_header.toWarehouse,
          remark: "",
          items: items,
        },
      };
      var message = `You are about to create this new transaction. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack
          .post("/general/web", fixDataTransfer)
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
              fixDataTransfer = [];
              this.$router.back();
            }
          })
          .catch((err) => {
            this.$isLoading(false);
            this.$toast.open({
              message: `Error : ${err}`,
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
    detailItems() {
      return this.item.map((item) => {
        let packaging_name = item[`name_packaging_l${item.packaging_level}`];
        return {
          ...item,
          packaging_name: packaging_name,
          gtin_cp:
            item.epc_type == "sscc" ? item.company_prefix : item.gtin_sscc,
        };
      });
    },
  },
};
</script>
