<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <HeaderFilterTransactionV3
            :removeTrxDate="true"
            :save_filtering="true"
            :filter="['All', 'product_id', 'warehouse_id']"
            status_code="product_stock_serial"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <CDataTable
            hover
            striped
            sorter
            border
            :items="dataTableItem"
            :fields="fields"
            class="text-left"
            style="font-size: 12px"
          >
            <template #action="{ item, index }">
              <td>
                <Button
                  v-c-tooltip="'View'"
                  v-if="item.packaging_level > 1"
                  :type="'read'"
                  @click="rowClicked(item, index)"
                  class="float-right"
                />
                <Button
                  :type="'read'"
                  v-if="item.lock_trx_id"
                  v-c-tooltip="btn_2_prop.tooltip"
                  :buttonProperty="btn_2_prop"
                  v-on:click="showLockedStatus(item, index)"
                  class="float-left"
                />
              </td>
            </template>
          </CDataTable>
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
    <CModal
      size="xl"
      centered="centered"
      :show.sync="viewModal"
      title="Detail"
      color="warning"
    >
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
  </CRow>
</template>

<script>
import $axiosMertrack from '../../apiMertrack';
import { calculatePaginationV3, exportDataV3 } from '../../utils';

export default {
  name: 'ReportStock',
  mounted() {
    this.page = 1;
    this.loadData();
  },
  data() {
    return {
      property_lock_status: {
        modal: false,
        item: {},
      },
      btn_2_prop: {
        size: 'sm',
        class: 'float-right',
        color: 'danger',
        icon: 'exclamation-circle',
        text: '',
        tooltip: 'Show Locking Trx',
      },
      filter: {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalData: 0,
        StatusCode: '',
        StatusCodeText: '',
        StartDate: '',
        EndDate: '',
      },
      datas: [],
      detail_item: {},
      viewModal: false,
      items: [],
      fields: [
        {
          key: 'product_no',
          label: 'Item No',
        },
        {
          key: 'product_name',
          label: 'Product Name',
        },
        {
          key: 'batch_no',
          label: 'Batch No',
        },
        {
          key: 'expired_date',
          label: 'Exp Date',
        },
        {
          key: 'epc_key',
          label: 'EPC Key',
        },
        {
          key: 'serial',
          label: 'Serial',
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
          key: 'warehouse_name',
          label: 'Warehouse',
        },
        {
          key: 'status_name',
          label: 'Status',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:10%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v4/report/item-stock?raw=true&${param}`;
      $axiosMertrack.get(url).then((res) => {
        this.items = res.data.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: res,
        });
      });
    },

    closeModal() {
      this.detail_item = {};
      this.datas = [];
      this.viewModal = false;
    },
    showLockedStatus(item) {
      this.property_lock_status.modal = true;
      this.property_lock_status.item = item;
    },
    rowClicked(item) {
      this.datas = [];
      if (item.packaging_level == 1) {
        this.$toast.open({
          message: `No detail SN data to be viewed, SN [${item.serial_id}] is Packaging L1`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      this.detail_item = item;
      this.viewModal = true;
      return;
    },
    handleClickFilter(val) {
      this.filter = Object.assign(this.filter, val);
      this.filter.StartDate = '';
      this.filter.EndDate = '';
      this.loadData();
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: this.filter,
        exportType: type,
        url: '/v4/report/item-stock',
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
    getNumber(num) {
      num = (this.filter.page - 1) * this.filter.limit + num;
      return num;
    },
  },
  computed: {
    dataTableItem() {
      return this.items.map((item, index) => {
        return {
          ...item,
          warehouse_name: item.warehouse_name ? item.warehouse_name : '-',
          no: this.getNumber(index + 1),
        };
      });
    },
  },
};
</script>
