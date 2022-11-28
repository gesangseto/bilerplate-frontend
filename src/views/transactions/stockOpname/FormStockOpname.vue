<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="12" xl="12">
        <CCard>
          <CCardHeader>
            <h5>Stock Opname [{{ action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm class="my-3">
              <div class="form-group row">
                <div class="col-sm-2 col-md-2 col-lg-2">
                  <label>
                    Warehouse <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7">
                  <v-select
                    :options="warehouseOptions"
                    id="warehouse"
                    v-model="stock.warehouse"
                    :value.sync="stock.warehouse"
                  >
                  </v-select>
                  <span
                    id="error-warehouse"
                    class="text-danger"
                    style="font-size: 12px"
                  ></span>
                </div>
              </div>
            </CForm>
            <div class="my-3 clearfix">
              <CButton
                class="float-lg-right ml-2"
                type="button"
                @click="removeGenerateProduct()"
                color="warning"
                style="color: white"
              >
                <v-icon name="broom" /> Clear List</CButton
              >
              <CButton
                class="float-lg-right"
                type="button"
                @click="generateProduct()"
                color="success"
              >
                <v-icon name="cogs" /> Generate List</CButton
              >
            </div>
            <div v-if="views == true" class="my-3">
              <div class="table-responsive">
                <CDataTable
                  tableFilter
                  hover
                  striped
                  sorter
                  border
                  :items="productItems"
                  :fields="productFields"
                  class="text-left"
                  style="font-size: 12px"
                >
                  <template #action="{ item, index }">
                    <td>
                      <Button
                        v-c-tooltip="btn_1_prop.tooltip"
                        :key="item.gtin_cp"
                        v-if="item.packaging_level > 1"
                        :buttonProperty="btn_1_prop"
                        v-on:click="rowClicked(item, index)"
                      />
                      <CButton
                        :key="item.gtin_cp"
                        v-if="item.packaging_level == 1"
                        style="
                          margin-bottom: -1px;
                          margin-left: 2px;
                          cursor: default;
                          opacity: 0;
                        "
                        size="sm"
                        class="float-right"
                      >
                        <v-icon name="eye" />
                      </CButton>
                      <Button
                        v-if="item.status != 1"
                        v-c-tooltip="btn_2_prop.tooltip"
                        :buttonProperty="btn_2_prop"
                        v-on:click="showLockedStatus(item, index)"
                      />
                    </td>
                  </template>
                </CDataTable>
              </div>
            </div>
          </CCardBody>
          <CCardFooter>
            <CButton
              type="submit"
              size="sm"
              @click="save()"
              class="mr-2"
              color="primary"
              ><CIcon name="cil-check-circle" /> Submit</CButton
            >
            <CButton type="reset" size="sm" @click="cancel()" color="danger"
              ><CIcon name="cil-ban" /> Cancel</CButton
            >
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <!-- Modal Detail Barang Dipilih  -->
    <CModal title="Detail" color="warning" :show.sync="viewModal" size="lg">
      <DetailStockSerial v-if="viewModal == true" :item="detail_item" />
      <template #footer>
        <CButton size="sm" color="danger" type="button" @click="closeModal()">
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>
    <ShowLockedStatus
      :property="property_lock_status"
      v-on:handleSubmit="handleCancel()"
    />
  </div>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import "vue-select/dist/vue-select.css";
import $ from "jquery";
import { convertTableName } from "../../../utils";
export default {
  name: "FormStockOpname",
  data() {
    return {
      property_lock_status: {
        modal: false,
        item: {},
      },
      btn_1_prop: {
        size: "sm",
        class: "float-right",
        color: "info",
        icon: "eye",
        text: "",
        tooltip: "View",
      },
      btn_2_prop: {
        size: "sm",
        class: "float-right",
        color: "danger",
        icon: "exclamation-circle",
        text: "",
        tooltip: "Show Locking Trx",
      },
      detail_item: {},
      product_on_proccess: 0,
      datas: [],
      viewModal: false,
      view: {
        articleId: "",
        productId: "",
        productName: "",
        batch: "",
        serial: [],
        gtin: "",
        nie: "",
        expiredDate: "",
      },
      optionType: [
        { value: 1, label: "Aggregation" },
        { value: 2, label: "Serialization" },
      ],
      items: [],
      modalAdd: false,
      action: "",
      idArticleOptions: [],
      views: false,
      add: {
        product: { id: "", name: "" },
        article: { id: "", value: "" },
      },
      warehouseOptions: [],
      productFields: [
        { key: "no", label: "Item No" },
        {
          key: "name",
          label: "Product Name",
        },
        {
          key: "batch_no",
          label: "Batch No",
        },
        {
          key: "expired_date",
          label: "Exp Date",
        },
        { key: "nie", label: "NIE" },
        { key: "gtin_cp", label: "GTIN / CP" },
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
        { key: "quantity", label: "L1 Qty" },
        {
          key: "action",
          label: "Action",
          _style: "width:10%",
        },
      ],
      productOptions: [],
      stock: {
        warehouse: null,
        type: null,
      },
    };
  },
  mounted() {
    this.loadListWarehouse();
    //   cek apakah ada parameter yang dikirim
    this.action = this.$route.params.id === undefined ? "ADD" : "EDIT";
  },
  methods: {
    loadListWarehouse() {
      let param = `ApiName=ListWarehouse&Params={"status":"Active"}&StatusCode=Active`;
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
    showLockedStatus(item, index) {
      this.property_lock_status.modal = true;
      this.property_lock_status.item = item;
    },
    removeGenerateProduct() {
      this.view = false;
      this.items = [];
      this.stock.warehouse = null;
      this.stock.type = null;
    },
    generateProduct() {
      // warehouse validasi
      if (!this.stock.warehouse) {
        $("#error-warehouse").text("Warehouse is required");
        return false;
      } else {
        $("#error-warehouse").text("");
      }
      this.items = [];
      this.views = false;
      let param = `ApiName=OpnameGenerate&Params={"warehouse_id":${this.stock.warehouse.value}}`;
      $axiosMertrack.get(`/general/web?${param}`).then((res) => {
        this.items = res.data.data;
        this.views = true;
      });
      return;
    },
    rowClicked(item) {
      // if (item.status != 1) {
      //   this.$toast.open({
      //     message: `This item SN [${item.gtin_cp}] ${
      //       item.serial
      //     } is currently on pending proccess in ${convertTableName(
      //       item.locked_trx
      //     )} transaction (ID: ${item.locked_trx_id})`,
      //     type: "error",
      //     dissmissible: true,
      //     position: "top-right",
      //     duration: 5000,
      //   });
      // }
      if (item.packaging_level == 1) {
        return;
      }
      this.detail_item = item;
      this.viewModal = true;
      return;
    },
    closeModal() {
      this.datas = [];
      this.viewModal = false;
    },
    save() {
      if (!this.stock.warehouse) {
        $("#error-warehouse").text("Warehouse is required");
        return false;
      } else {
        $("#error-warehouse").text("");
      }
      for (const it of this.items) {
        if (it.status != 1) {
          this.$toast.open({
            message: `This Stock Opname cannot be saved. Please complete the pending process first.`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          return;
        }
      }
      // ngecek data ditable list stock opname
      if (this.items.length == 0) {
        this.$toast.open({
          message: `This Stock Opname cannot be saved. There is no stock item in this warehouse.`,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        return false;
      }
      let paramBody = {
        ApiName: "OpnameInput",
        Params: {
          warehouse: this.stock.warehouse.value,
        },
      };
      var message = `You are about to create this new transaction. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack.post("/general/web", paramBody).then((result) => {
          this.$isLoading(false);
          let res = result.data;
          this.$toast.open({
            message: res.error
              ? `${res.message}`
              : "Data has been saved succesfully",
            type: res.error ? "error" : "success",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          if (!res.error) {
            this.$router.back();
          }
        });
      }
      return;
    },
    cancel() {
      // kembali kehalaman sebelumnya
      this.$router.back();
    },
  },
  computed: {
    productItems() {
      return this.items.map((item) => {
        return {
          ...item,
          gtin_cp:
            item.epc_type == "sscc" ? item.company_prefix : item.gtin_sscc,
          packaging_name: item[`name_packaging_l${item.packaging_level}`],
        };
      });
    },
  },
};
</script>
