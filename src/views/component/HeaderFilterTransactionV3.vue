<template>
  <div>
    <CRow style="margin-bottom: -10px">
      <CCol md="4">
        <CSelect
          label="Status"
          :options="listFilterStatusCode"
          :value.sync="result.StatusCode"
          horizontal
          @update:value="handleChangeStatus()"
        />
      </CCol>
      <CCol md="4">
        <CInput
          v-on:keyup.enter="handleEnterSearchText()"
          v-model="result.searchText"
          placeholder="Search text..."
        >
        </CInput>
      </CCol>

      <CCol md="3">
        <CButton v-on:click="handleClickFilter()" color="primary">
          <v-icon name="filter" /> Filter
        </CButton>
        &nbsp;
        <CButton
          v-on:click="handleResetFilter()"
          style="background-color: #f9b115; color: white"
        >
          <v-icon name="broom" /> Reset
        </CButton>
      </CCol>
      <CCol md="1">
        <CButton v-on:click="is_visible = !is_visible">
          <v-icon v-if="!is_visible" name="angle-right" />
          <v-icon v-if="is_visible" name="angle-down" />
        </CButton>
      </CCol>
    </CRow>
    <CRow style="margin-bottom: -10px" v-if="is_visible">
      <CCol md="4">
        <CSelect
          label="Filter By"
          :options="listFilter"
          :value.sync="result.SearchType"
          horizontal
          @update:value="handleChangeType()"
        />
      </CCol>
      <CCol md="4">
        <model-select
          v-if="!use_type_date && !use_normal_form"
          :isDisabled="!extendFilter"
          :options="listExtendFilter"
          v-model="result.SearchVal1"
          @input="handleChangeFilter()"
          placeholder="--Select--"
        >
        </model-select>

        <date-range-picker
          v-if="use_type_date && !use_normal_form"
          style="width: 100%"
          :show-dropdowns="true"
          :locale-data="{ format: 'yyyy-mm-dd' }"
          v-model="extend_default_date"
          opens="center"
          :linkedCalendars="false"
          :ranges="ranges"
          @finishSelection="handleChangeDate()"
          @update="handleChangeDate()"
        >
          <template #input="picker" style="min-width: 350px">
            {{ humanizeText(result.SearchType) }}:
            {{ picker.startDate | date }} ~
            {{ picker.endDate | date }}
          </template>
          <div slot="header" class="slot">
            <div style="margin: 15px; text-align: center">
              <strong>{{ result.SearchType }} </strong>
            </div>
          </div>
        </date-range-picker>

        <CInput
          v-if="use_normal_form && !use_type_date"
          v-model="result.SearchVal1"
          type="number"
          placeholder="Enter ID"
          @change="handleTextInput(result.SearchVal1)"
        ></CInput>
      </CCol>
      <CCol md="4">
        <date-range-picker
          v-if="useTransactionDate"
          style="width: 100%"
          :show-dropdowns="true"
          :locale-data="{ format: 'yyyy-mm-dd' }"
          v-model="default_date"
          opens="left"
          :linkedCalendars="false"
          :ranges="ranges"
          @finishSelection="handleChangeDate()"
          @update="handleChangeDate()"
        >
          <template #input="picker" style="min-width: 350px">
            Transaction Date: {{ picker.startDate | date }} ~
            {{ picker.endDate | date }}
          </template>
          <div slot="header" class="slot">
            <div style="margin: 15px; text-align: center">
              <strong>Transaction Date</strong>
            </div>
          </div>
        </date-range-picker>
      </CCol>
    </CRow>
    <hr />
    <CRow>
      <CCol md="9"></CCol>
      <CCol md="3">
        <CSelect
          :options="pages"
          :value.sync="result.limit"
          @update:value="handleChangeSize()"
        >
          <template #append-content>Per Page</template>
        </CSelect>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import $axiosMertrack from '../../apiMertrack';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import 'vue-search-select/dist/VueSearchSelect.css';
import { ModelSelect } from 'vue-search-select';
import moment from 'moment';
import { dateFilter } from '../../constants';
import { getStatusDesc } from '../../resource/StatusDesc';
import { getFiltering, setFiltering } from '../../utils/storage';

export default {
  name: 'HeaderFilterTransactionV3',
  props: {
    filter: Array,
    status_code: String,
    status_code_default: String,
    remove_all_status_code: String,
    costume_filter: Array,
    removeTrxDate: Boolean,
    order: Array,
    save_filtering: { type: Boolean, default: false },
  },

  components: { ModelSelect, DateRangePicker },
  watch: {
    filtering: {
      handler(item) {
        setFiltering(this.$route.path, item);
      },
      deep: true,
    },
  },
  mounted() {
    this.getSatusCode();
    if (this.filter && this.filter.constructor === Array) {
      let new_list = [];
      for (const it of this.listFilter) {
        let code = it.code.toLowerCase();
        let idx = this.filter.findIndex((o) => o.toLowerCase() == code);
        if (idx >= 0) new_list.push(it);
      }
      // for (const fil of this.filter) {
      //   for (const it of this.listFilter) {
      //     if (it.code.toLowerCase() == fil.toLowerCase()) {
      //       new_list.push(it);
      //     }
      //   }
      // }
      this.listFilter = new_list;
    }
    if (this.costume_filter && this.costume_filter.constructor === Array) {
      for (const it of this.costume_filter) {
        if (it.data && it.data.constructor === Array) {
          this.listFilter.push(it);
        }
      }
    }
    if (this.removeTrxDate) {
      this.result.StartDate = '';
      this.result.EndDate = '';
      this.useTransactionDate = false;
    }
    if (!this.title) {
      this.title = 'Report';
    }
    if (this.order && this.order.constructor === Array) {
      let temp_arr = this.listFilter;
      this.listFilter = [];
      for (let ord of this.order) {
        ord = ord.toLowerCase();
        let idx = temp_arr.findIndex((it) => it.code.toLowerCase() == ord);
        if (idx >= 0) this.listFilter.push(temp_arr[idx]);
      }
    }

    // Load filter kemudian trigering
    let fil = getFiltering(this.$route.path);
    if (fil) {
      this.result = fil;
      this.fill_date(this.result.StartDate, this.result.EndDate);
    }
    if (this.save_filtering) this.handleClickFilter();
  },
  data() {
    return {
      filtering: {},
      ranges: {
        Today: [
          new Date(dateFilter.today.start),
          new Date(dateFilter.today.end),
        ],
        'This week': [
          new Date(dateFilter.this_week.start),
          new Date(dateFilter.this_week.end),
        ],
        'This month': [
          new Date(dateFilter.this_month.start),
          new Date(dateFilter.this_month.end),
        ],
        'Last month': [
          new Date(dateFilter.last_month.start),
          new Date(dateFilter.last_month.end),
        ],
        'Last 3 month': [
          new Date(dateFilter.last_3_month.start),
          new Date(dateFilter.last_3_month.end),
        ],
        'Last 6 month': [
          new Date(dateFilter.last_6_month.start),
          new Date(dateFilter.last_6_month.end),
        ],
        'This year': [
          new Date(dateFilter.this_year.start),
          new Date(dateFilter.this_year.end),
        ],
        All: ['', ''],
      },
      useTransactionDate: true,
      result: this.initial_result(),
      default_date: this.initial_date(),
      use_type_date: false,
      use_normal_form: false,
      extend_default_date: this.initial_date(),
      is_visible: false,
      pages: [10, 20, 50, 100],
      extendFilter: false,
      extendFilterTitle: '',
      listExtendFilter: [],
      listFilterStatusCode: [],
      listFilter: [
        {
          value: 'All',
          code: 'All',
          label: 'All',
        },
        // V3 MULAI
        {
          value: 'source_id',
          code: 'source_id',
          label: 'Source',
        },
        {
          value: 'id',
          code: 'id',
          label: 'ID',
        },
        {
          value: 'supplier_id',
          code: 'supplier_id',
          label: 'Supplier',
        },
        {
          value: 'product_id',
          code: 'product_id',
          label: 'Product',
        },
        {
          value: 'warehouse_id',
          code: 'warehouse_id',
          label: 'Warehouse',
        },
        {
          value: 'customer_id',
          code: 'customer_id',
          label: 'Customer',
        },
        {
          value: 'from_supplier',
          code: 'from_supplier',
          label: 'From Supplier',
        },
        {
          value: 'from_supplier',
          code: 'source_supplier',
          label: 'Source',
        },
        {
          value: 'from_warehouse',
          code: 'from_warehouse',
          label: 'From Warehouse',
        },
        {
          value: 'from_warehouse',
          code: 'source_warehouse',
          label: 'Source',
        },
        {
          value: 'from_customer',
          code: 'from_customer',
          label: 'From Customer',
        },
        {
          value: 'from_customer',
          code: 'destination_customer',
          label: 'Destination',
        },
        {
          value: 'to_warehouse',
          code: 'to_warehouse',
          label: 'To Warehouse',
        },
        {
          value: 'to_warehouse',
          code: 'destination_warehouse',
          label: 'Destination',
        },
        {
          value: 'to_customer',
          code: 'to_customer',
          label: 'To Customer',
        },
        {
          value: 'created_by',
          code: 'created_by',
          label: 'Created By',
        },
        {
          value: 'created_by',
          code: 'requested_by',
          label: 'Requested By',
        },
        {
          value: 'approval_id',
          code: 'approval_id',
          label: 'Next Approval',
        },
        {
          value: 'mfg_date',
          code: 'mfg_date',
          label: 'MFG Date',
        },
        {
          value: 'expired_date',
          code: 'expired_date',
          label: 'EXP Date',
        },
        {
          value: 'minimum',
          code: 'minimum',
          label: 'Minimum Stock',
        },
        {
          value: 'maximum',
          code: 'maximum',
          label: 'Maximum Stock',
        },
        // {
        //   value: "Product",
        //   code: "Product",
        //   label: "Product",
        // },
        // {
        //   value: "Supplier",
        //   code: "Supplier",
        //   label: "Supplier",
        // },
        // {
        //   value: "Supplier",
        //   code: "Source Supplier",
        //   label: "Source Supplier",
        // },
        // {
        //   value: "Customer",
        //   code: "Customer",
        //   label: "Customer",
        // },
        // {
        //   value: "User",
        //   code: "User",
        //   label: "User",
        // },
        // {
        //   value: "Warehouse",
        //   code: "Warehouse",
        //   label: "Warehouse",
        // },
        // {
        //   value: "Warehouse",
        //   code: "Destination Warehouse",
        //   label: "Destination Warehouse",
        // },
        // {
        //   value: "Approval",
        //   code: "Approval",
        //   label: "Approval",
        // },
        // {
        //   value: "Mfg Date",
        //   code: "Mfg Date",
        //   label: "Mfg Date",
        // },
        // {
        //   value: "Exp Date",
        //   code: "Exp Date",
        //   label: "Exp Date",
        // },
        // {
        //   value: "Min Stock",
        //   code: "Min Stock",
        //   label: "Min Stock",
        // },
        // {
        //   value: "Max Stock",
        //   code: "Max Stock",
        //   label: "Max Stock",
        // },
        // {
        //   value: "Transaction",
        //   code: "Transaction",
        //   label: "Transaction Bpom",
        // },
        // {
        //   value: "User",
        //   code: "Requested By",
        //   label: "Requested By",
        // },
        // {
        //   value: "Next Approval",
        //   code: "Next Approval",
        //   label: "Next Approval",
        // },
        // {
        //   value: "source_type",
        //   code: "Source Type",
        //   label: "Source Type",
        // },
        // {
        //   value: "destination_wh",
        //   code: "destination_wh",
        //   label: "Destination Warehouse",
        // },
        // {
        //   value: "source_wh",
        //   code: "source_wh",
        //   label: "Source Warehouse",
        // },
        // {
        //   value: "Customer",
        //   code: "source_customer",
        //   label: "Source Customer",
        // },
        // {
        //   value: "Customer",
        //   code: "destination_customer",
        //   label: "Destination Customer",
        // },
      ],
    };
  },
  methods: {
    initial_result() {
      let initial = {
        page: 1,
        limit: 10,
        StatusCode: this.status_code_default ?? '',
        StatusCodeText: 'All',
        SearchType: 'All',
        SearchTypeText: 'All',
        StartDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].start,
        EndDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].end,
        searchText: '',
        SearchVal1: '',
        SearchVal2: '',
        SearchVal1Text: '',
        SearchVal2Text: '',
      };
      return initial;
    },
    initial_date() {
      let initial = (this.default_date = {
        startDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].start,
        endDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].end,
      });
      return initial;
    },
    fill_date(start, end) {
      let date = (this.default_date = {
        startDate: start,
        endDate: end,
      });
      return date;
    },
    handleResetFilter() {
      this.result = this.initial_result();
      if (!this.useTransactionDate) {
        this.result.StartDate = '';
        this.result.EndDate = '';
      }
      this.default_date = this.initial_date();
      this.extendFilter = false;
      this.use_type_date = false;
      this.use_normal_form = false;
      this.handleClickFilter();
    },
    handleChangeDate() {
      this.result.StartDate = '';
      this.result.EndDate = '';
      if (this.default_date.startDate && this.default_date.endDate) {
        this.result.StartDate = moment(this.default_date.startDate).format(
          'YYYY-MM-DD'
        );
        this.result.EndDate = moment(this.default_date.endDate).format(
          'YYYY-MM-DD'
        );
      }

      if (this.use_type_date) {
        this.set_extend_date();
      }

      this.handleChangeFilter();
    },
    set_extend_date() {
      let start_date = '';
      let end_date = '';
      if (
        this.extend_default_date.startDate &&
        this.extend_default_date.endDate
      ) {
        start_date = moment(this.extend_default_date.startDate).format(
          'YYYY-MM-DD'
        );
        end_date = moment(this.extend_default_date.endDate).format(
          'YYYY-MM-DD'
        );
      }
      this.result.SearchVal1 = start_date;
      this.result.SearchVal2 = end_date;
      this.result.SearchVal1Text = start_date;
      this.result.SearchVal2Text = end_date;
    },
    handleChangeType() {
      this.result.SearchVal1 = '';
      this.result.SearchVal2 = '';
      let idx = this.listFilter.findIndex(
        (i) => i.value === this.result.SearchType.toLowerCase()
      );
      if (~idx) this.result.SearchTypeText = this.listFilter[idx].label;
      else this.result.SearchTypeText = 'All';
      if (this.result.SearchType) {
        this.use_type_date = false;
        this.use_normal_form = false;
        this.listExtendFilter = [];
        this.extendFilterTitle = this.result.SearchType;
        if (this.result.SearchType.toLowerCase() == 'all') {
          this.extendFilter = false;
          this.result.SearchVal1 = '';
          this.result.SearchVal1Text = 'All';
        } else if (this.result.SearchType.toLowerCase() == 'id') {
          this.use_normal_form = true;
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'source_id') {
          this.getSource();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'supplier_id') {
          this.getSupplier();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'product_id') {
          this.getProduct();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'warehouse_id') {
          this.getWarehouse();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'customer_id') {
          this.getCustomer();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'from_supplier') {
          this.getSupplier();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'from_warehouse') {
          this.getWarehouse();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'from_customer') {
          this.getCustomer();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'to_warehouse') {
          this.getWarehouse();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'to_customer') {
          this.getCustomer();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'created_by') {
          this.getUser();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'approval_id') {
          this.getUser();
          this.extendFilter = true;
        } else if (this.result.SearchType.toLowerCase() == 'mfg_date') {
          this.use_type_date = true;
          this.extendFilter = false;
          this.set_extend_date();
        } else if (this.result.SearchType.toLowerCase() == 'expired_date') {
          this.use_type_date = true;
          this.extendFilter = false;
          this.set_extend_date();
        }

        //  else if (this.result.SearchType.toLowerCase() == "product") {
        //   this.getProduct();
        //   this.extendFilter = true;
        // }
        //  else if (this.result.SearchType.toLowerCase() == "warehouse") {
        //   this.getWarehouse();
        //   this.extendFilter = true;
        // } else if (this.result.SearchType.toLowerCase() == "supplier") {
        //   this.getSupplier();
        //   this.extendFilter = true;
        // }
        //  else if (this.result.SearchType.toLowerCase() == "customer") {
        //   this.getCustomer();
        //   this.extendFilter = true;
        // } else if (this.result.SearchType.toLowerCase() == "user") {
        //   this.getUser();
        //   this.extendFilter = true;
        // } else if (this.result.SearchType.toLowerCase() == "approval") {
        //   this.getUser();
        //   this.extendFilter = true;
        // } else if (this.result.SearchType.toLowerCase() == "next approval") {
        //   this.getUser();
        //   this.extendFilter = true;
        // } else if (this.result.SearchType.toLowerCase() == "mfg date") {
        //   this.use_type_date = true;
        //   this.extendFilter = false;
        //   this.set_extend_date();
        // } else if (this.result.SearchType.toLowerCase() == "source_type") {
        //   this.getSourceType();
        //   this.extendFilter = true;
        // } else if (this.result.SearchType.toLowerCase() == "source_wh") {
        //   this.getWarehouse();
        //   this.extendFilter = true;
        // } else if (this.result.SearchType.toLowerCase() == "destination_wh") {
        //   this.getWarehouse();
        //   this.extendFilter = true;
        // } else if (this.result.SearchType.toLowerCase() == "source_customer") {
        //   this.getCustomer();
        //   this.extendFilter = true;
        // } else if (
        //   this.result.SearchType.toLowerCase() == "destination_customer"
        // ) {
        //   this.getCustomer();
        //   this.extendFilter = true;
        // }
        else {
          if (this.costume_filter) {
            for (const it of this.costume_filter) {
              if (
                this.result.SearchType.toLowerCase() == it.value.toLowerCase()
              ) {
                this.getCostumeFilter(it);
                this.extendFilter = true;
              }
            }
          } else {
            this.extendFilter = false;
          }
        }
        this.handleChangeFilter();
      }
    },
    handleChangeSize() {
      this.$emit('handleChangeSize', this.result.limit);
    },
    handleEnterSearchText() {
      this.handleClickFilter();
    },
    handleChangeFilter() {
      for (const it of this.listExtendFilter) {
        if (this.result.SearchVal1 == it.value)
          this.result.SearchVal1Text = it.label;
      }
      this.$emit('handleChangeFilter', this.result);
    },
    handleTextInput(val) {
      this.result.SearchVal1Text = val;
    },
    handleChangeStatus() {
      for (const it of this.listFilterStatusCode) {
        if (this.result.StatusCode == it.value)
          this.result.StatusCodeText = it.label;
      }
    },
    handleClickFilter() {
      if (this.extendFilter && !this.result.SearchVal1) {
        this.$toast.open({
          message: `Please input ${this.result.SearchTypeText} to filter the data`,
          type: 'info',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.filtering = this.result;
      this.$emit('handleClickFilter', this.result);
    },
    getProduct() {
      let url = `/v3/master/product`;
      $axiosMertrack.get(url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let ext = it.delete_flag == 1 ? '(X)' : '';
          let tmp = it;
          tmp.value = it.id;
          tmp.label = `${ext} [${it.no}] ${it.name}`;
          tmp.text = `${ext} [${it.no}] ${it.name}`;
          this.listExtendFilter.push(tmp);
        }
      });
    },
    getSource() {
      let url = `/v3/master/source`;
      $axiosMertrack.get(url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let tmp = it;
          tmp.value = it.id;
          tmp.label = `${it.name}`;
          tmp.text = `${it.name}`;
          this.listExtendFilter.push(tmp);
        }
      });
    },
    getWarehouse(type = null) {
      let param = {};
      if (type == 'qa') param.category_id = 1;
      if (type == 'rts') param.category_id = 3;
      param = new URLSearchParams(param).toString();
      let url = `/v3/master/warehouse?${param}`;
      $axiosMertrack.get(url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let ext = it.delete_flag == 1 ? '(X)' : '';
          let tmp = it;
          tmp.value = it.id;
          tmp.label = `${ext} ${it.name}`;
          tmp.text = `${ext} ${it.name}`;
          this.listExtendFilter.push(tmp);
        }
      });
    },
    getSupplier() {
      let url = `/v3/master/supplier`;
      $axiosMertrack.get(url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let ext = it.delete_flag == 1 ? '(X)' : '';
          let tmp = it;
          tmp.value = it.id;
          tmp.label = `${ext} ${it.name}`;
          tmp.text = `${ext} ${it.name}`;
          this.listExtendFilter.push(tmp);
        }
      });
    },
    getCustomer() {
      let url = `/v3/master/customer`;
      $axiosMertrack.get(url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let ext = it.delete_flag == 1 ? '(X)' : '';
          let tmp = it;
          tmp.value = it.id;
          tmp.label = `${ext} ${it.name}`;
          tmp.text = `${ext} ${it.name}`;
          this.listExtendFilter.push(tmp);
        }
      });
    },
    getUser() {
      let url = `/v3/master/user?raw=true`;
      $axiosMertrack.get(url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let ext = it.delete_flag == 1 ? '(X)' : '';
          let tmp = it;
          tmp.value = it.id;
          tmp.label = `${ext} ${it.full_name} (${it['department_name']} - ${it['section_name']})`;
          tmp.text = `${ext} ${it.full_name} (${it['department_name']} - ${it['section_name']})`;
          this.listExtendFilter.push(tmp);
        }
      });
    },
    getCostumeFilter(item) {
      for (const it of item.data) {
        let tmp = it;
        tmp.value = it.value;
        tmp.label = it.label;
        tmp.text = it.label;
        this.listExtendFilter.push(tmp);
      }
    },
    getSourceType() {
      let source = [
        { value: 1, label: 'Production', text: 'Production' },
        { value: 2, label: 'Import', text: 'Import' },
        { value: 3, label: 'Toll Manufacturing', text: 'Toll Manufacturing' },
      ];
      this.listExtendFilter = source;
    },
    async getSatusCode() {
      this.listFilterStatusCode = [];
      if (!this.remove_all_status_code) {
        this.listFilterStatusCode = [{ value: '', label: 'All' }];
      }
      if (!this.status_code) {
        return;
      }
      let _res = await getStatusDesc({ table_name: this.status_code });
      for (const it of _res.data) {
        let tmp = it;
        if (this.status_code_default == it.status_code) {
          this.result.StatusCodeText = it.status_desc;
        }
        tmp.value = it.status_code;
        tmp.label = it.status_desc;
        tmp.text = it.status_desc;
        this.listFilterStatusCode.push(tmp);
      }
    },
    humanizeText(str) {
      var i;
      if (!str) return;
      var frags = str.split('_');
      for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(' ');
    },
  },
  filters: {
    date(val) {
      return val ? moment(val).format('DD-MMM-YYYY') : '';
    },
  },
};
</script>
