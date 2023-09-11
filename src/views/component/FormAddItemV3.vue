<template>
  <div>
    <div class="form-group row mb-2">
      <label for="product-name" class="col-sm-2 col-md-2 col-lg-2 form-label">
        Product Name <strong class="text-danger">*</strong>
      </label>
      <div class="col-sm-5 col-md-5 col-lg-5">
        <v-select
          key="value"
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
          v-model="formData.batch_no"
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
import $axiosMertrack from '../../apiMertrack';
import 'vue-select/dist/vue-select.css';
import moment from 'moment';
import { getConfig } from '../../utils';
export default {
  name: 'FormAddItemV3',
  props: { currentItem: Array, filter: Object, useDeliveryDayLimit: Boolean },
  watch: {
    currentItem: {
      handler() {
        this.resetForm();
      },
      deep: true,
    },
    // filter: {
    //   handler(n) {
    //     if (n.hasOwnProperty('warehouse_id') && n.warehouse_id) {
    //       this.resetForm();
    //       this.getProduct();
    //     } else if (n.hasOwnProperty('from_warehouse') && n.from_warehouse) {
    //       this.resetForm();
    //       this.getProduct();
    //     }
    //   },
    //   deep: true,
    // },
    'filter.from_warehouse': {
      handler() {
        this.resetForm();
        this.getProduct();
      },
      deep: true,
    },
    'filter.warehouse_id': {
      handler() {
        this.resetForm();
        this.getProduct();
      },
      deep: true,
    },
  },
  mounted() {
    // this.getProduct();
  },
  data() {
    return {
      check_all: false,
      listProduct: [],
      listBatchNo: [],
      alertExpired: false,
      formData: {
        product_id: null,
        batch_no: null,
        stock: [],
      },
      result: [],
      stockField: [
        {
          key: 'epc_key',
          label: 'EPC Key',
        },
        {
          key: 'serial',
          label: 'SN',
        },
        {
          key: 'packaging_level',
          label: 'Pkg Level',
        },
        {
          key: 'packaging_name',
          label: 'Pkg Name',
        },
        {
          key: 'quantity',
          label: 'L1 Qty',
        },
        {
          key: 'remark',
          label: 'Remark',
        },
        {
          key: 'action',
          label: 'Selection',
        },
      ],
    };
  },
  methods: {
    resetForm() {
      this.check_all = false;
      this.formData.stock = [];
      this.formData.product_id = null;
      this.formData.batch_no = null;
      this.alertExpired = false;
    },
    handleChangeProduct() {
      this.alertExpired = false;
      this.getBatchNo();
    },

    getDifferentDays(exp_date) {
      var date_exp = moment(new Date(exp_date), 'YYYY-MM-DD');
      var date_now = moment(new Date(), 'YYYY-MM-DD');
      let sisa = Math.ceil(moment.duration(date_exp.diff(date_now)).asDays());
      return sisa;
    },
    checkDeliveryLimit() {
      this.alertExpired = false;
      for (const it of this.listBatchNo) {
        // if (this.formData.batch_no == it.batch_no) {
        let day_limit = getConfig();
        day_limit = day_limit.delivery_day_limit ?? 0;
        let diff_day = this.getDifferentDays(it.expired_date);
        if (diff_day < day_limit) {
          let msg = `Cannot add item that will expire in less than ${day_limit} days. This item will expire in ${diff_day} days.`;

          if (diff_day < 0) {
            msg = `Cannot to add expired items.`;
          }
          this.alertExpired = msg;
        }
        // }
      }
    },
    handleChangeBatch() {
      console.log('TERLOAD', this.useDeliveryDayLimit);
      if (this.useDeliveryDayLimit) {
        this.checkDeliveryLimit();
      }
      this.getProductStockSerial();
    },
    checkSerial(item, index) {
      let check = this.formData.stock[index].is_checked;
      this.formData.stock[index].is_checked = !check;
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
      let result = this.formData.stock.filter((e) => e.is_checked);
      this.$emit('handleResult', result);
    },
    getProduct() {
      let param = {
        status: 'Active',
        show_status: true,
      };
      if (this.filter.product_type) {
        param.product_type = this.filter.product_type;
      }
      param = new URLSearchParams(param).toString();
      let _url = `/v3/master/product?${param}`;
      this.listProduct = [];
      $axiosMertrack.get(_url).then((result) => {
        let data = result.data.data;
        let temps = [];
        for (const it of data) {
          let tmp = it;
          tmp.value = it.id;
          tmp.label = `[${it.no}] ${it.name}`;
          tmp.item = it;
          temps.push(tmp);
        }
        this.listProduct = temps;
      });
    },
    getBatchNo() {
      this.check_all = false;
      this.formData.stock = [];
      this.formData.batch_no = null;
      let param = {
        product_id: this.formData.product_id,
        warehouse_id: this.filter.warehouse_id || this.filter.from_warehouse,
        parent: null,
      };
      param = new URLSearchParams(param).toString();
      let _url = `/v3/helper/detail-item/batch?${param}`;
      this.listBatchNo = [];
      $axiosMertrack.get(_url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let tmp = it;
          tmp.value = it.batch_no;
          tmp.label = `${it.batch_no} <=> ${it.expired_date}`;
          this.listBatchNo.push(tmp);
        }
      });
    },
    getProductStockSerial() {
      this.formData.stock = [];
      let param = {
        warehouse_id:
          this.filter.warehouse_id || this.filter.from_warehouse || null,
        product_id: this.formData.product_id || null,
        batch_no: this.formData.batch_no || null,
        status: 1,
        parent: null,
        raw: true,
        show_remark: true,
      };
      param = new URLSearchParams(param).toString();
      let _url = `/v3/helper/detail-item/stock?${param}`;
      $axiosMertrack.get(`${_url}`).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let idx = this.currentItem.findIndex(
            (e) =>
              e.gtin_sscc === it.gtin_sscc &&
              e.serial === it.serial &&
              e.batch_id === it.batch_id
          );
          if (idx >= 0) {
            it.is_checked = true;
            it.is_disabled = true;
          }
          this.formData.stock.push(it);
        }
      });
    },
  },
  computed: {
    detailItems() {
      return this.formData.stock.map((it) => {
        return {
          ...it,
          gtin_cp: it.epc_type == 'sscc' ? it.company_prefix : it.gtin_sscc,
        };
      });
    },
  },
};
</script>
