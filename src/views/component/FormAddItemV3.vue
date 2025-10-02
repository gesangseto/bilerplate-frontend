<template>
  <div>
    <div class="form-group row mb-3">
      <label for="product-name" class="col-sm-3 col-md-3 col-lg-3 form-label">
        Product Name <strong class="text-danger">*</strong>
      </label>
      <div class="col-sm-7 col-md-7 col-lg-7">
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
    <!-- Batch No -->
    <div class="form-group row mb-3">
      <label for="product-name" class="col-sm-3 col-md-3 col-lg-3 form-label">
        Batch No <strong class="text-danger">*</strong>
      </label>
      <div class="col-sm-7 col-md-7 col-lg-7">
        <v-select
          placeholder="--Select--"
          :options="listBatchNo"
          :reduce="(opt) => opt.value"
          v-model="formData.batch_no"
          @input="handleChangeBatch()"
        >
          <template #no-options="{ search, searching, loading }">
            Sorry, no matching item.
          </template>
        </v-select>
        <label v-if="alertExpired" style="color: red">{{ alertExpired }}</label>
        <label v-if="onlyQuantity && formData.batch_no" style="color: green">
          Available L1 quantity {{ formData.available_quantity }}
        </label>
      </div>
    </div>
    <InputDefault
      v-if="onlyQuantity"
      required
      :col="[3, 7]"
      title="L1 Quantity"
      v-model="formData.quantity"
      :maxValue="formData.available_quantity"
    />

    <CRow v-if="!onlyQuantity">
      <CCol md="10" lg="10" xl="10">
        <div class="form-group form-check float-right">
          Total Selected L1 Qty :
          <a style="font-weight: bolder">{{ selected_quantity }}</a>
        </div>
      </CCol>
      <CCol md="2" lg="2" xl="2">
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
import { setConfig } from '../../utils';
import { getSysConfig } from '../../resource/SysConfig';
export default {
  name: 'FormAddItemV3',
  props: {
    currentItem: { type: Array, default: () => {} },
    filter: { type: Object, default: () => {} },
    useDeliveryDayLimit: { type: Boolean, default: false },
    onlyQuantity: { type: Boolean, default: false },
  },
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
    'formData.stock': {
      handler(arr) {
        // console.log(arr);
      },
      deep: true,
    },
    formData: {
      handler(arr) {
        this.returnResultQuantity();
      },
      deep: true,
    },
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
      selected_quantity: 0,
      formData: {
        product_id: null,
        batch_no: null,
        quantity: null,
        available_quantity: null,
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
      this.selected_quantity = 0;
      this.check_all = false;
      this.formData.stock = [];
      this.formData.product_id = null;
      this.formData.quantity = null;
      this.formData.available_quantity = 0;
      this.formData.batch_no = null;
      this.alertExpired = false;
    },
    async handleChangeProduct() {
      this.alertExpired = false;
      this.getBatchNo();
    },

    getDifferentDays(exp_date) {
      var date_exp = moment(new Date(exp_date)).format('YYYY-MM-DD');
      var date_now = moment(new Date()).format('YYYY-MM-DD');
      let sisa = moment(date_exp).diff(moment(date_now), 'days');
      return sisa;
    },
    async checkDeliveryLimit() {
      let data = await getSysConfig({ without_logo: true });
      let config = data.data[0];
      setConfig(config);
      this.alertExpired = false;
      let day_limit = config.delivery_day_limit ?? 0;

      for (const it of this.listBatchNo) {
        if (this.formData.batch_no == it.batch_no) {
          // if (this.formData.batch_no == it.batch_no) {
          let diff_day = this.getDifferentDays(it.expired_date);
          if (diff_day < day_limit) {
            let msg = `Cannot add item that will expire in less than ${day_limit} days. This item will expire in ${diff_day} days.`;

            if (diff_day < 0) {
              msg = `Cannot to add expired items.`;
            }
            this.alertExpired = msg;
          }
        }
        // }
      }
    },
    async handleChangeBatch() {
      if (this.useDeliveryDayLimit) {
        await this.checkDeliveryLimit();
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
    returnResultQuantity() {
      if (!this.onlyQuantity) return;
      if (!this.formData.batch_no) {
        return [];
      }
      if (!this.formData.product_id) {
        return [];
      }
      if (!this.formData.quantity) {
        return [];
      }
      let params = JSON.parse(JSON.stringify(this.formData));
      let product = this.listProduct.find((it) => it.id === params.product_id);
      let batch = this.listBatchNo.find(
        (it) => it.batch_no === params.batch_no
      );
      params = {
        ...product,
        ...params,
        exp_date: batch.expired_date,
        expired_date: batch.expired_date,
      };
      delete params.id;
      delete params.stock;
      this.$emit('handleResult', [params]);
    },
    returnResult() {
      let result = this.formData.stock.filter((e) => e.is_checked);
      this.selected_quantity = result.reduce(
        (acc, o) => acc + parseInt(o.quantity),
        0
      );
      this.$emit('handleResult', result);
    },
    getProduct() {
      let param = {
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
        let available_quantity = 0;
        for (const it of data) {
          available_quantity += it.quantity;

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
          this.formData.available_quantity = available_quantity;
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
          remark: it.remark || '',
        };
      });
    },
  },
};
</script>
