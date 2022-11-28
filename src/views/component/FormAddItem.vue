<template>
  <div>
    <div class="form-group row mb-2">
      <label for="product-name" class="col-sm-2 col-md-2 col-lg-2 form-label">
        Product Name <strong class="text-danger">*</strong>
      </label>
      <div class="col-sm-5 col-md-5 col-lg-5">
        <v-select
          placeholder="--Select--"
          :options="listProduct"
          :reduce="(opt) => opt.value"
          v-model="formData.product_id"
          @input="handleChangeProduct()"
        >
        </v-select>
      </div>
    </div>
    <!-- Bacth No -->
    <div class="form-group row mb-2">
      <label for="product-name" class="col-sm-2 col-md-2 col-lg-2 form-label">
        Batch No <strong class="text-danger">*</strong>
      </label>
      <div class="col-sm-5 col-md-5 col-lg-5">
        <v-select
          placeholder="--Select--"
          :options="listBatchNo"
          :reduce="(opt) => opt.value"
          v-model="formData.batch_id"
          @input="handleChangeBatch()"
        >
        </v-select>
        <label v-if="alertExpired" style="color: red">{{ alertExpired }}</label>
      </div>
    </div>

    <CRow>
      <CCol sm="12" md="12" lg="12" xl="12">
        <div
          class="form-group form-check float-right"
          style="padding-right: 50px"
        >
          <input
            :disabled="formData.stock.length === 0 || alertExpired"
            type="checkbox"
            class="form-check-input"
            v-model="check_all"
            @change="checkAll(check_all)"
          />
          <p style="font-size: bold">Select All</p>
        </div>
      </CCol>
      <CCol sm="12" md="12" lg="12" xl="12">
        <CDataTable
          class="text-left"
          style="font-size: 12px"
          hover
          striped
          border
          :items="detailItems"
          :fields="stockField"
        >
          <template #action="{ item, index }">
            <td>
              <div class="form-group form-check">
                <input
                  :disabled="item.is_disabled || alertExpired"
                  type="checkbox"
                  class="form-check-input"
                  v-model="item.is_checked"
                  @change="checkSerial(item, index)"
                />
              </div>
            </td>
          </template>
        </CDataTable>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import $axiosMertrack from "../../apiMertrack";
import "vue-select/dist/vue-select.css";
import moment from "moment";
export default {
  name: "FormAddItem",
  props: { currentItem: Array, filter: Object, useDeliveryDayLimit: Boolean },
  watch: {
    currentItem: {
      handler(n, o) {
        this.resetForm();
      },
      deep: true,
    },
    filter: {
      handler(n, o) {
        if (n.hasOwnProperty("warehouse_id") && n.warehouse_id)
          this.getProduct();
      },
      deep: true,
    },
  },
  mounted() {
    this.getProduct();
  },
  data() {
    return {
      check_all: false,
      listProduct: [],
      listBatchNo: [],
      alertExpired: false,
      formData: {
        product_id: null,
        batch_id: null,
        stock: [],
      },
      result: [],
      stockField: [
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
          label: "Selection",
        },
      ],
    };
  },
  methods: {
    resetForm() {
      this.check_all = false;
      this.formData.stock = [];
      this.formData.product_id = null;
      this.formData.batch_id = null;
      this.alertExpired = false;
    },
    handleChangeProduct() {
      this.alertExpired = false;
      this.getBatchNo();
    },

    getDifferentDays(exp_date) {
      var date_exp = moment(new Date(exp_date), "YYYY-MM-DD");
      var date_now = moment(new Date(), "YYYY-MM-DD");
      let sisa = Math.ceil(moment.duration(date_exp.diff(date_now)).asDays());
      return sisa;
    },
    checkDeliveryLimit() {
      this.alertExpired = false;
      for (const it of this.listBatchNo) {
        if (this.formData.batch_id == it.id) {
          let day_limit = JSON.parse(localStorage.getItem("configuration"));
          day_limit = day_limit.delivery_day_limit ?? 0;
          let diff_day = this.getDifferentDays(it.expired_date);
          if (diff_day < day_limit) {
            let msg = `Cannot add item that will expire in less than ${day_limit} days. This item will expire in ${diff_day} days.`;

            if (diff_day < 0) {
              msg = `Cannot to add expired items.`;
            }
            this.alertExpired = msg;
          }
        }
      }
    },
    handleChangeBatch() {
      if (this.useDeliveryDayLimit) {
        this.checkDeliveryLimit();
      }
      this.getProductStockSerial();
    },
    checkSerial(item, index) {
      if (this.formData.stock[index].is_checked) {
        this.formData.stock[index].is_checked = false;
      } else {
        this.formData.stock[index].is_checked = true;
      }
      this.returnResult();
    },
    checkAll(check_all) {
      let datas = [];
      for (const it of this.formData.stock) {
        let data = it;
        if (!it.is_disabled) {
          data.is_checked = check_all;
        }
        datas.push(data);
      }
      this.formData.stock = datas;
      this.returnResult();
    },
    returnResult() {
      let result = [];
      for (const it of this.formData.stock) {
        if (it.is_checked) {
          result.push(it);
        }
      }
      this.$emit("handleResult", result);
    },
    getProduct() {
      let param = { product_type: this.filter.product_type };
      var defaultParam = {
        ApiName: "ListProduct",
        Params: JSON.stringify(param),
      };
      var query_string = new URLSearchParams(defaultParam).toString();
      let url = `/general/mobile?${query_string}`;
      this.listProduct = [];
      $axiosMertrack.get(url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let tmp = it;
          tmp.value = it.id;
          tmp.label = `[${it.no}] ${it.name}`;
          this.listProduct.push(tmp);
        }
      });
    },
    getBatchNo() {
      this.check_all = false;
      this.formData.stock = [];
      this.formData.batch_id = null;
      if (!this.filter.warehouse_id) {
        this.$toast.open({
          message: `Please select Warehouse to continue`,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        return;
      }
      let param = {
        warehouse_id: this.filter.warehouse_id ?? null,
        product_id: this.formData.product_id ?? null,
      };
      var defaultParam = {
        ApiName: "GetProductBatch",
        Params: JSON.stringify(param),
      };
      var query_string = new URLSearchParams(defaultParam).toString();
      let url = `/general/mobile?${query_string}`;
      this.listBatchNo = [];
      $axiosMertrack.get(url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let tmp = it;
          tmp.value = it.id;
          tmp.label = `${it.id} <=> ${it.expired_date}`;
          this.listBatchNo.push(tmp);
        }
      });
    },
    getProductStockSerial() {
      let param = {
        warehouse_id: this.filter.warehouse_id ?? null,
        product_id: this.formData.product_id ?? null,
        batch_no: this.formData.batch_id ?? null,
        status: 1,
        flag_parent: 1,
        date_format: "web",
      };
      var defaultParam = {
        ApiName: "GetStock",
        Params: JSON.stringify(param),
      };
      var query_string = new URLSearchParams(defaultParam).toString();
      this.formData.stock = [];
      $axiosMertrack.get(`/general/mobile?${query_string}`).then((result) => {
        let data = result.data.data;
        if (data[0] && data[0].stocks) {
          for (const it of data[0].stocks) {
            let stock = it;
            for (const cur of this.currentItem) {
              if (it.barcode_2d == cur.barcode_2d) {
                stock.is_checked = true;
                stock.is_disabled = true;
              }
            }
            this.formData.stock.push(stock);
          }
        }
      });
    },
  },
  computed: {
    detailItems() {
      return this.formData.stock.map((it) => {
        return {
          ...it,
          packaging_name: it[`name_packaging_l${it.packaging_level}`],
          gtin_cp: it.epc_type == "sscc" ? it.company_prefix : it.gtin_sscc,
        };
      });
    },
  },
};
</script>
