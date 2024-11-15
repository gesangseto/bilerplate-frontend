<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission
            :permission="'create'"
            @click="addNew()"
            :useHref="true"
          />
          <h5>Process Order</h5>
        </CCardHeader>
        <CCardBody>
          <HeaderFilterTransactionV3
            :save_filtering="true"
            :filter="['All', 'id', 'product_id']"
            :order="['All', 'id', 'product_id']"
            status_code="production_batch_list"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <CDataTable
                hover
                striped
                sorter
                border
                :items="reformat"
                :fields="fields"
                style="font-size: 12px"
              >
                <template #action="{ item, index }">
                  <td>
                    <ButtonPermission
                      v-if="[0, 3].includes(item.status)"
                      :permission="'delete'"
                      :buttonProperty="btn_delete_prop"
                      @click="handleClickDelete(item, index)"
                    />
                    <ButtonPermission
                      v-if="item.status == 0 || item.status == 4"
                      :id="item.id"
                      :useHref="true"
                      :permission="'update'"
                      @click="rowUpdate(item, index)"
                    />
                    <ButtonPermission
                      :buttonProperty="approve_property"
                      v-if="item.status == 0"
                      :id="item.id"
                      :useHref="true"
                      :permission="'approve'"
                      @click="rowUpdate(item, index)"
                    />
                    <ButtonPermission
                      :id="item.id"
                      :useHref="true"
                      :permission="'read'"
                      @click="rowRead(item, index)"
                    />
                  </td>
                </template>
              </CDataTable>
            </CCol>
          </CRow>
          <template>
            <CPagination
              :activePage.sync="filter.page"
              :pages="filter.totalPages"
              size="sm"
              align="center"
              @update:activePage="pageChange"
            />
          </template>
          <ButtonPermission
            exportType="excel"
            :permission="'print'"
            @click="handleClickExport('xls')"
          />
          <ButtonPermission
            exportType="pdf"
            :permission="'print'"
            @click="handleClickExport('pdf')"
          />
        </CCardBody>
      </CCard>
    </CCol>
    <!-- START DELETE MODAL -->
    <CancelModal
      type="cancel"
      :property="rejectProperty"
      v-on:handleSubmit="handleCancel()"
    />
  </CRow>
</template>

<script>
import moment from 'moment';
import {
  deleteProcessOrder,
  getProcessOrder,
} from '../../../resource/ProcessOrder';
import { calculatePaginationV3, exportDataV3 } from '../../../utils';
import { dateFilter } from '../../../constants';

export default {
  name: 'ListSupplier',

  mounted() {
    this.pages = [10, 20, 50, 100];
    this.page = 1;
    this.size = this.pages[0];
    // this.loadData();
  },
  data() {
    return {
      rejectProperty: {
        title: 'Process Order',
        modal: false,
        id: null,
        reason: '',
      },
      btn_delete_prop: {
        size: 'sm',
        class: 'float-right',
        color: 'danger',
        icon: 'trash-alt',
        text: '',
        tooltip: 'Cancel',
      },
      approve_property: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'clipboard-check',
        text: '',
        tooltip: 'Generate Serial',
      },
      filter: {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalData: 0,
        StartDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].start,
        EndDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].end,
      },
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
        },
        {
          key: 'created_date',
          label: 'Trx Date',
        },
        {
          key: 'batch_no',
          label: 'Batch No',
        },
        {
          key: 'process_order_erp',
          label: 'ERP PO No',
        },
        {
          key: 'product_name',
          label: 'Product Name',
        },
        {
          key: 'product_gtin',
          label: 'L1 GTIN / NIE',
        },
        {
          key: 'generate_count_level_1',
          label: 'Target L1 Qty',
        },
        {
          key: 'status_name',
          label: 'Status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:17%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    async loadData() {
      let res = await getProcessOrder(this.filter);
      this.items = [];
      if (!res.error) {
        this.items = res.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: res,
        });
      }
    },
    handleClickFilter(val) {
      this.filter = Object.assign(this.filter, val);
      this.loadData();
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.filter,
        exportType: type,
        url: '/v4/production/process-order',
      });
    },
    pageChange(page) {
      this.filter.page = page;
      this.loadData();
    },
    handleChangeSize($event) {
      this.filter.limit = $event;
      this.filter.page = 1;
      this.loadData();
    },
    rowUpdate() {},
    rowRead() {},
    addNew() {},
    handleClickDelete(item) {
      this.rejectProperty.modal = true;
      this.rejectProperty.id = item.id;
    },
    async handleCancel() {
      this.$isLoading(true);
      let param = {
        id: this.rejectProperty.id,
        approved: false,
        reason: `[CANCEL] ${this.rejectProperty.reason}`,
      };
      let _res = await deleteProcessOrder(param);
      this.rejectProperty.id = null;
      this.rejectProperty.reason = null;
      this.$isLoading(false);
      this.$toast.open({
        message: _res.error
          ? `${_res.message}`
          : 'Data has been canceled succesfully',
        type: _res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      if (!_res.error) this.loadData();
    },
  },
  computed: {
    reformat() {
      return this.items.map((item) => {
        return {
          ...item,
          product_gtin: item.product_gtin || item.product_nie,
          created_date: moment(item.created_date).format('YYYY-MM-DD HH:mm'),
        };
      });
    },
  },
};
</script>

<style scoped>
#printMe {
  visibility: hidden;
  position: fixed;
}

@media print {
  #printMe {
    visibility: visible;
    position: fixed;
  }
}
</style>
