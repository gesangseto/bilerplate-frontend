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
          <CCol md="1" v-if="costume_filter.length > 0 || filterBy.length > 0">
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
              :isDisabled="!extendFilter"
              :options="listExtendFilter"
              v-model="filter.SearchVal1"
              @input="handleChangeFilter()"
              placeholder="--Select--"
            >
            </model-select>
          </CCol>
          <CCol md="4"> </CCol>
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
        :key="JSON.stringify(items)"
        :items="items"
        :fields="fields"
        style="font-size: 12px"
      >
        <template #action="{ item, index }" v-if="action.length > 0">
          <td>
            <ButtonPermission
              v-if="getActions(item).includes('delete')"
              :buttonProperty="actionProperty.delete || null"
              :permission="'delete'"
              @click="
                delete_reason ? openModal(item, index) : rowDelete(item, index)
              "
            />
            <ButtonPermission
              v-if="getActions(item).includes('update')"
              :buttonProperty="actionProperty.update || null"
              :id="item.id"
              :useHref="true"
              :permission="'update'"
              @click="rowUpdate(item, index)"
            />
            <ButtonPermission
              v-if="getActions(item).includes('read')"
              :buttonProperty="actionProperty.read || null"
              :id="item.id"
              :useHref="true"
              :permission="'read'"
              @click="rowRead(item, index)"
            />
            <ButtonPermission
              v-if="getActions(item).includes('print')"
              :buttonProperty="actionProperty.print || null"
              :id="item.id"
              :useHref="true"
              :permission="'print'"
              @click="rowPrint(item, index)"
            />
            <ButtonPermission
              v-if="getActions(item).includes('approve')"
              :buttonProperty="actionProperty.approve || null"
              :id="item.id"
              :useHref="true"
              :permission="'approve'"
              @click="rowApprove(item, index)"
            />
            <ButtonPermission
              v-if="getActions(item).includes('copy')"
              :buttonProperty="btn_copy"
              :permission="'create'"
              @click="rowCopy(item, index)"
              :id="item.id"
              :useHref="true"
            />
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
    <CancelModal
      :skip_confirmation="true"
      type="delete"
      :is_master="is_master"
      :property="modal_property"
      v-on:handleSubmit="rowDelete(modal_property)"
    />
  </CRow>
</template>

<script>
import { ModelSelect } from 'vue-search-select';
import 'vue-search-select/dist/VueSearchSelect.css';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import { getMstProductCategory } from '../../resource/MstProductCategory';
import { getStatusDesc } from '../../resource/StatusDesc';
import _ from 'lodash';
export default {
  name: 'TableDefault',
  props: {
    fields: { type: Array },
    items: { type: Array, default: () => [] },
    is_master: { type: Boolean, default: true },
    // Action Property
    delete_reason: { type: Boolean, default: true }, // digunakan untuk tombol yang ingin menggunakan reason saat delete
    action: { type: Array, default: () => [] },
    filterAction: { type: Function, default: null },
    actionProperty: { type: Object, default: () => ({}) },
    // Ini baru
    totalData: { type: Number, default: () => 0 },
    status_code: { type: String },
    costume_filter: { type: Array, default: () => [] },
    filterBy: { type: Array, default: () => [] },
    save_filtering: { type: Boolean, default: false },
  },

  components: { ModelSelect },
  watch: {
    items: {
      handler(datas) {
        this.filter.totalPages =
          Math.ceil(this.totalData / this.filter.limit) || 0;
      },
      deep: true,
    },
  },
  beforeMount() {
    let query = this.$route.query;
    if (this.$route && Object.keys(query).length > 0) {
      this.filter = { ...query, page: parseInt(query.page || 1) };
      this.applyFilter();
    } else {
      this.resetFilter();
    }
  },
  mounted() {
    this.getSatusCode();
  },
  data() {
    return {
      modal_property: {
        title: 'Record',
        modal: false,
        id: null,
        reason: '',
      },
      filtering: {},
      filter: {
        totalPages: 1,
        page: 1,
        limit: 10,
        StatusCode: '',
        StatusCodeText: 'All',
        SearchType: 'All',
        searchText: '',
        StartDate: '',
        EndDate: '',
        SearchVal1: '',
        SearchVal2: '',
        SearchVal1Text: '',
        SearchVal2Text: '',
      },
      pages: [10, 20, 50, 100],
      is_visible: false,
      listFilterStatusCode: [],
      extendFilter: false,
      listExtendFilter: [],
      listFilter: [
        {
          value: 'All',
          label: 'All',
        },
        {
          value: 'mst_product_category_id',
          label: 'Product Category',
        },
      ],
      btn_copy: {
        size: 'sm',
        class: 'float-right',
        color: 'secondary',
        icon: 'copy',
        text: '',
        tooltip: 'Copy data',
      },
    };
  },
  methods: {
    getActions(item) {
      if (typeof this.filterAction === 'function') {
        return this.filterAction(item); // gunakan fungsi dari parent
      }
      return this.action || [];
    },
    openModal(item, index) {
      this.modal_property.id = item.id;
      this.modal_property.modal = true;
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
      // this.handleChangeType();
      let query = this.$route.query;
      const currentQuery = { ...query };
      const targetQuery = { ...this.filter }; // Contoh
      // Cek apakah query sudah sama
      const isSameRoute = _.isEqual(
        this.normalizeObject(currentQuery),
        this.normalizeObject(targetQuery),
      );

      /*
         Karen error dibawah maka gunakan handleReload untuk load query.param?:
         NavigationDuplicated {_name: 'NavigationDuplicated', name: 'NavigationDuplicated', message: 'Navigating to current location
        */

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

    resetFilter() {
      this.filter = {
        totalPages: 1,
        page: 1,
        limit: 10,
        StatusCode: '',
        StatusCodeText: 'All',
        SearchType: 'All',
        searchText: '',
        StartDate: '',
        EndDate: '',
        SearchVal1: '',
        SearchVal2: '',
        SearchVal1Text: '',
        SearchVal2Text: '',
      };
      this.$emit('handleReload', this.filter);
    },
    handleChangeType(reset = false) {
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
          (i) => i.value === this.filter.SearchType.toLowerCase(),
        );

      if (~idx) {
        this.filter.SearchTypeText = this.listFilter[idx].label;
      } else {
        this.filter.SearchTypeText = 'All';
      }
      if (this.filter.SearchType) {
        if (this.filter.SearchType.toLowerCase() == 'all') {
          this.extendFilter = false;
          this.filter.SearchVal1 = '';
          this.filter.SearchVal1Text = 'All';
        } else if (
          this.filter.SearchType.toLowerCase() == 'mst_product_category_id'
        ) {
          this.extendFilter = true;
          this.getProductCategory();
        } else if (this.costume_filter.length > 0) {
          for (const it of this.costume_filter) {
            if (
              this.filter.SearchType.toLowerCase() == it.value.toLowerCase()
            ) {
              this.getCostumeFilter(it);
              this.extendFilter = true;
            }
          }
        }
      }
    },
    handleChangeSize() {
      this.applyFilter();
    },
    handleEnterSearchText() {
      this.applyFilter();
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
    async getSatusCode() {
      this.listFilterStatusCode = [{ value: '', label: 'All' }];
      if (this.status_code) {
        let _res = await getStatusDesc({ table_name: this.status_code });
        let data = _res.data || [];
        for (const it of data) {
          let tmp = it;
          tmp.value = it.status_code;
          tmp.label = it.status_desc;
          tmp.text = it.status_desc;
          this.listFilterStatusCode.push(tmp);
        }
      }
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
    getCostumeFilter(item) {
      for (const it of item.data) {
        let tmp = it;
        tmp.value = it.value;
        tmp.label = it.label;
        tmp.text = it.label;
        this.listExtendFilter.push(tmp);
      }
    },
  },
};
</script>
