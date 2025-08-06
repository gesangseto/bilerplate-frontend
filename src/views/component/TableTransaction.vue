<template>
  <!-- INI BATAS HEADER TABLE -->
  <CRow id="card-header">
    <CCol sm="12" md="12" lg="12" xl="12">
      <div>
        <CRow style="margin-bottom: -10px">
          <CCol md="4">
            <CSelect
              label="Status"
              :options="listFilterStatusCode"
              :value.sync="filter.StatusCode"
              horizontal
              @update:value="handleChangeStatus($event)"
            />
          </CCol>
          <CCol md="4">
            <CInput
              v-on:keyup.enter="handleEnterSearchText()"
              v-model="filter.searchText"
              placeholder="Search text..."
            >
            </CInput>
          </CCol>

          <CCol md="3">
            <CButton v-on:click="applyFilter()" color="primary">
              <v-icon name="filter" /> Filter
            </CButton>
            &nbsp;
            <CButton
              v-on:click="resetFilter()"
              style="background-color: #f9b115; color: white"
            >
              <v-icon name="broom" /> Reset
            </CButton>
          </CCol>
          <CCol md="1" v-if="costumeFilter.length > 0 || filterBy.length > 0">
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
              :value.sync="filter.SearchType"
              horizontal
              @update:value="handleChangeType()"
            />
          </CCol>
          <CCol md="4">
            <model-select
              v-if="!use_type_date && !use_normal_form"
              :isDisabled="!extendFilter"
              :options="listExtendFilter"
              v-model="filter.SearchVal1"
              @input="handleChangeFilter()"
              placeholder="--Select--"
            />

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
                {{ humanizeText(filter.SearchType) }}:
                {{ picker.startDate | date }} ~
                {{ picker.endDate | date }}
              </template>
              <div slot="header" class="slot">
                <div style="margin: 15px; text-align: center">
                  <strong>{{ filter.SearchType }} </strong>
                </div>
              </div>
            </date-range-picker>

            <CInput
              v-if="use_normal_form && !use_type_date"
              v-model="filter.SearchVal1"
              type="number"
              placeholder="Enter ID"
              @change="handleTextInput(filter.SearchVal1)"
            />
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
              :value.sync="filter.limit"
              @update:value="handleChangeSize()"
            >
              <template #append-content>Per Page</template>
            </CSelect>
          </CCol>
        </CRow>
      </div>
      <CDataTable
        hover
        striped
        sorter
        border
        :items="items"
        :fields="fields"
        style="font-size: 12px"
      >
        <template #action="{ item, index }">
          <td>
            <ButtonPermission
              v-if="getActions(item).includes('delete')"
              :buttonProperty="actionProperty.delete || null"
              :permission="'delete'"
              @click="rowDelete(item, index)"
            />
            <ButtonPermission
              v-if="getActions(item).includes('update')"
              :buttonProperty="actionProperty.update || null"
              :id="getActionId('update', item)"
              :useHref="getActionHref('update')"
              :permission="'update'"
              @click="rowUpdate(item, index)"
            />
            <ButtonPermission
              v-if="getActions(item).includes('read')"
              :buttonProperty="actionProperty.read || null"
              :id="getActionId('read', item)"
              :useHref="getActionHref('read')"
              :permission="'read'"
              @click="rowRead(item, index)"
            />
            <ButtonPermission
              v-if="getActions(item).includes('print')"
              :buttonProperty="actionProperty.print || null"
              :id="getActionId('print', item)"
              :useHref="getActionHref('print')"
              :permission="'print'"
              @click="rowPrint(item, index)"
            />
            <ButtonPermission
              v-if="getActions(item).includes('approve')"
              :buttonProperty="actionProperty.approve || null"
              :id="getActionId('approve', item)"
              :useHref="getActionHref('approve')"
              :permission="'approve'"
              @click="rowApprove(item, index)"
            />
            <ButtonPermission
              v-if="getActions(item).includes('copy')"
              :buttonProperty="actionProperty.copy || null"
              :id="getActionId('copy', item)"
              :useHref="getActionHref('copy')"
              :permission="'create'"
              @click="rowCopy(item, index)"
            />
            <slot name="extra-action" :item="item" :index="index" />
          </td>
        </template>
      </CDataTable>
      <template>
        <CPagination
          v-if="filter.totalPages > 0"
          :activePage.sync="filter.page"
          :pages="parseInt(filter.totalPages)"
          size="sm"
          align="center"
          @update:activePage="changePage"
        />
      </template>
    </CCol>
  </CRow>
</template>

<script>
import $axiosMertrack from '../../apiMertrack';
import DateRangePicker from 'vue2-daterange-picker';
import { ModelSelect } from 'vue-search-select';
import 'vue-search-select/dist/VueSearchSelect.css';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import { getMstProductCategory } from '../../resource/MstProductCategory';
import { getStatusDesc } from '../../resource/StatusDesc';
import moment from 'moment';
import { dateFilter } from '../../constants';
import _ from 'lodash';
export default {
  name: 'TableTransaction',
  props: {
    fields: { type: Array },
    items: { type: Array, default: () => [] },
    // Action Property
    action: { type: Array, default: () => [] },
    filterAction: { type: Function, default: null },
    actionProperty: { type: Object, default: () => ({}) },
    // Ini baru
    totalData: { type: Number, default: () => 0 },
    status_code: { type: String },
    status_code_default: { type: String },
    costumeFilter: { type: Array, default: () => [] },
    orderFilter: { type: Array, default: () => [] },
    filterBy: { type: Array, default: () => [] },
    save_filtering: { type: Boolean, default: false },
    removeTrxDate: { type: Boolean, default: false },
  },

  components: { ModelSelect, DateRangePicker },
  watch: {
    $route: {
      deep: true,
      handler(route) {
        let query = route.query;
        if (route && Object.keys(query).length > 0) {
          this.$emit('handleReload', query);
        } else {
          this.resetFilter();
        }
      },
    },
    items: {
      handler(datas) {
        this.filter.totalPages =
          Math.ceil(this.totalData / this.filter.limit) || 0;
      },
      deep: true,
    },
  },
  async beforeMount() {
    await this.getStatusCode();
    let query = this.$route.query;
    if (this.$route && Object.keys(query).length > 0) {
      this.filter = { ...query, page: parseInt(query.page || 1) };
      this.applyFilter();
    } else {
      this.resetFilter();
    }
  },
  async mounted() {
    // Jika disertakan filterBy
    if (this.filterBy.length > 0) {
      let new_list = [];
      for (const it of this.listFilter) {
        let code = it.code.toLowerCase();
        let idx = this.filterBy.findIndex((o) => o.toLowerCase() == code);
        if (idx >= 0) new_list.push(it);
      }
      this.listFilter = new_list;
    }
    // Jika disertakan costumeFilter
    if (this.costumeFilter.length > 0) {
      for (const it of this.costumeFilter) {
        if (it.data && it.data.constructor === Array) {
          this.listFilter.push(it);
        }
      }
    }
    if (this.removeTrxDate) {
      this.filter.StartDate = '';
      this.filter.EndDate = '';
      this.useTransactionDate = false;
    }
    if (!this.title) {
      this.title = 'Report';
    }
    if (this.orderFilter.length > 0) {
      let temp_arr = this.listFilter;
      this.listFilter = [];
      for (let ord of this.orderFilter) {
        ord = ord.toLowerCase();
        let idx = temp_arr.findIndex((it) => it.code.toLowerCase() == ord);
        if (idx >= 0) this.listFilter.push(temp_arr[idx]);
      }
    }

    // Load filter kemudian trigering
    let fil = this.$route.query;
    if (Object.keys(fil).length > 0) {
      this.filter = { ...fil, page: parseInt(fil.page) };
      this.fill_date(this.filter.StartDate, this.filter.EndDate);
    }
    this.handleChangeType(false);
  },
  data() {
    return {
      filtering: {},
      useTransactionDate: true,
      pages: [10, 20, 50, 100],
      is_visible: false,
      filter: this.initialFilter(),
      default_date: this.initial_date(),
      extend_default_date: this.initial_date(),
      ranges: {
        Today: [
          new Date(dateFilter.today.start),
          new Date(dateFilter.today.end),
        ],
        'This week': [
          new Date(dateFilter.this_week.start),
          new Date(dateFilter.this_week.end),
        ],
        'Last 1 week': [
          new Date(dateFilter.last_1_week.start),
          new Date(dateFilter.last_1_week.end),
        ],
        'Last 2 week': [
          new Date(dateFilter.last_2_week.start),
          new Date(dateFilter.last_2_week.end),
        ],
        'This month': [
          new Date(dateFilter.this_month.start),
          new Date(dateFilter.this_month.end),
        ],
        'Last month': [
          new Date(dateFilter.last_month.start),
          new Date(dateFilter.last_month.end),
        ],
        'Last 1 month': [
          new Date(dateFilter.last_1_month.start),
          new Date(dateFilter.last_1_month.end),
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
      listFilterStatusCode: [],
      use_type_date: false,
      use_normal_form: false,
      extendFilter: false,
      listExtendFilter: [],
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
      ],
    };
  },
  methods: {
    getActionId(action, item) {
      if (
        this.actionProperty &&
        this.actionProperty[action] &&
        this.actionProperty[action].hasOwnProperty('id')
      ) {
        return item[this.actionProperty[action].id];
      }
      return item.id;
    },
    getActionHref(action) {
      if (
        this.actionProperty &&
        this.actionProperty[action] &&
        this.actionProperty[action].hasOwnProperty('useHref')
      ) {
        return this.actionProperty[action].useHref;
      }
      return true;
    },
    getActions(item) {
      if (typeof this.filterAction === 'function') {
        return this.filterAction(item); // gunakan fungsi dari parent
      }
      return this.action || [];
    },
    initialFilter() {
      let initial = {
        totalPages: 1,
        page: 1,
        limit: 10,
        StatusCode: '',
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
    handleChangeDate() {
      this.filter.StartDate = '';
      this.filter.EndDate = '';
      if (this.default_date.startDate && this.default_date.endDate) {
        this.filter.StartDate = moment(this.default_date.startDate).format(
          'YYYY-MM-DD'
        );
        this.filter.EndDate = moment(this.default_date.endDate).format(
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
      this.filter.SearchVal1 = start_date;
      this.filter.SearchVal2 = end_date;
      this.filter.SearchVal1Text = start_date;
      this.filter.SearchVal2Text = end_date;
    },
    initial_date() {
      let initial = (this.default_date = {
        startDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].start,
        endDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].end,
      });
      return initial;
    },
    async rowCopy(item) {
      this.$emit('handleCopy', item);
    },
    async rowDelete(item) {
      this.$emit('handleDelete', item);
    },
    async rowUpdate(item) {
      this.$emit('handleUpdate', item);
    },
    async rowRead(item) {
      this.$emit('handleRead', item);
    },
    async rowPrint(item) {
      this.$emit('handlePrint', item);
    },
    async rowApprove(item) {
      this.$emit('handleApprove', item);
    },
    normalizeObject(obj) {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = String(obj[key]); // ubah semua ke string
        return acc;
      }, {});
    },
    applyFilter() {
      let query = this.$route.query;
      const currentQuery = { ...query };
      const targetQuery = { ...this.filter }; // Contoh
      // Cek apakah query sudah sama
      const isSameRoute = _.isEqual(
        this.normalizeObject(currentQuery),
        this.normalizeObject(targetQuery)
      );

      /*
         Karen error dibawah maka gunakan handleReload untuk load query.param?:
         NavigationDuplicated {_name: 'NavigationDuplicated', name: 'NavigationDuplicated', message: 'Navigating to current location
        */

      console.log('================APPLY FILTER================');
      // console.log(targetQuery);
      if (!isSameRoute) {
        // console.log('Reload Normal');
        this.$router.push({ path: this.$route.path, query: targetQuery });
      } else if (this.items.length == 0) {
        // console.log('Reload pake triger');
        this.$emit('handleReload', targetQuery);
        this.handleChangeType();
      }
    },
    changePage() {
      this.filter = { ...this.$route.query, ...this.filter };
      this.applyFilter();
    },

    handleClickFilter() {
      if (this.extendFilter && !this.filter.SearchVal1) {
        this.$toast.open({
          message: `Please input ${this.filter.SearchTypeText} to filter the data`,
          type: 'info',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.filtering = this.filter;
      this.$emit('handleClickFilter', this.filter);
    },
    resetFilter() {
      this.filter = this.initialFilter();
      if (!this.useTransactionDate) {
        this.filter.StartDate = '';
        this.filter.EndDate = '';
      }
      this.default_date = this.initial_date();
      this.extendFilter = false;
      this.use_type_date = false;
      this.use_normal_form = false;

      if (this.status_code_default) {
        this.filter.StatusCode = this.status_code_default;
        this.handleChangeStatus();
      }
      this.$emit('handleReload', this.filter);
    },
    handleChangeType(reset = true) {
      if (reset) {
        this.filter.SearchVal1 = '';
        this.filter.SearchVal2 = '';
      }

      if (this.filter.SearchVal1 && !this.is_visible) {
        this.is_visible = true;
      }
      this.extendFilter = true;
      let idx = -1;
      if (this.filter.SearchType)
        idx = this.listFilter.findIndex(
          (i) => i.value === this.filter.SearchType.toLowerCase()
        );

      if (~idx) {
        this.filter.SearchTypeText = this.listFilter[idx].label;
      } else {
        this.filter.SearchTypeText = 'All';
      }

      if (this.filter.SearchType) {
        this.use_type_date = false;
        this.use_normal_form = false;
        this.listExtendFilter = [];
        this.extendFilterTitle = this.filter.SearchType;
        if (this.filter.SearchType.toLowerCase() == 'all') {
          this.extendFilter = false;
          this.filter.SearchVal1 = '';
          this.filter.SearchVal1Text = 'All';
        } else if (this.filter.SearchType.toLowerCase() == 'id') {
          this.use_normal_form = true;
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'source_id') {
          this.getSource();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'supplier_id') {
          this.getSupplier();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'product_id') {
          this.getProduct();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'warehouse_id') {
          this.getWarehouse();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'customer_id') {
          this.getCustomer();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'from_supplier') {
          this.getSupplier();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'from_warehouse') {
          this.getWarehouse();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'from_customer') {
          this.getCustomer();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'to_warehouse') {
          this.getWarehouse();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'to_customer') {
          this.getCustomer();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'created_by') {
          this.getUser();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'approval_id') {
          this.getUser();
          this.extendFilter = true;
        } else if (this.filter.SearchType.toLowerCase() == 'mfg_date') {
          this.use_type_date = true;
          this.extendFilter = false;
          this.set_extend_date();
        } else if (this.filter.SearchType.toLowerCase() == 'expired_date') {
          this.use_type_date = true;
          this.extendFilter = false;
          this.set_extend_date();
        } else {
          if (this.costumeFilter) {
            for (const it of this.costumeFilter) {
              if (
                this.filter.SearchType.toLowerCase() == it.value.toLowerCase()
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
      this.applyFilter();
    },
    handleEnterSearchText() {
      this.applyFilter();
    },
    handleTextInput(val) {
      this.filter.SearchVal1Text = val;
    },
    handleChangeFilter() {
      for (const it of this.listExtendFilter) {
        if (this.filter.SearchVal1 == it.value)
          this.filter.SearchVal1Text = it.label;
      }
    },
    handleChangeStatus() {
      for (const it of this.listFilterStatusCode) {
        if (this.filter.StatusCode == it.value)
          this.filter.StatusCodeText = it.label;
      }
    },
    fill_date(start, end) {
      let date = (this.default_date = {
        startDate: start,
        endDate: end,
      });
      return date;
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
    async getStatusCode() {
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
          this.filter.StatusCodeText = it.status_desc;
          this.filter.StatusCode = it.status_code;
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
    async getProductCategory() {
      this.listExtendFilter = [];
      let _res = await getMstProductCategory({ include_delete: 1 });
      let data = _res.data || [];
      for (const it of data) {
        let ext = it.delete_flag == 1 ? '(X)' : '';
        let tmp = it;
        tmp.value = it.id;
        tmp.label = `${ext} ${it.name}`;
        tmp.text = `${ext} ${it.name}`;
        this.listExtendFilter.push(tmp);
      }
    },
  },
  filters: {
    date(val) {
      return val ? moment(val).format('DD-MMM-YYYY') : '';
    },
  },
};
</script>
