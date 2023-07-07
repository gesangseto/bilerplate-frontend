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
              <CSelect
                placeholder="-Select-"
                :options="warehouseOptions"
                horizontal
                :value.sync="stock.warehouse_id"
                :is-valid="
                  initialLoad ? null : !stock.warehouse_id ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-2">
                    Warehouse
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>
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
            <ButtonBack />
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <!-- Modal Detail Barang Dipilih  -->
    <CModal title="Detail" color="warning" :show.sync="viewModal" size="xl">
      <DetailTransactionV3 v-if="viewModal == true" :item="detail_item" />
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
      initialLoad: true,
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
        { key: "product_no", label: "Item No" },
        {
          key: "product_name",
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
        { key: "product_nie", label: "NIE" },
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
        warehouse_id: null,
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
      let _url = `/v3/master/warehouse?status=Active`;
      $axiosMertrack.get(_url).then((result) => {
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
      this.stock.warehouse_id = null;
      this.stock.type = null;
    },
    validation() {
      if (!this.stock.warehouse_id) return false;
      return true;
    },
    generateProduct() {
      //
      this.initialLoad = false;
      if (!this.validation()) {
        return this.$toast.open({
          message: `Please input all the required data.`,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
      }
      this.items = [];
      this.views = false;
      let _url = `/v3/transaction/stock-opname/generate?raw=true&warehouse_id=${this.stock.warehouse_id}`;
      $axiosMertrack.get(_url).then((res) => {
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
      //
      this.initialLoad = false;
      if (!this.validation()) {
        return this.$toast.open({
          message: `Please input all the required data.`,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
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
      let param = {
        warehouse: this.stock.warehouse_id,
      };
      var message = `You are about to create this new transaction. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack
          .put("/v3/transaction/stock-opname", param)
          .then((result) => {
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
        };
      });
    },
  },
};
</script>
