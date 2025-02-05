<template>
  <div>
    <CRow>
      <CCol col="12" xl="12">
        <CCard>
          <CCardHeader>
            <ButtonPermission
              :permission="'create'"
              @click="addNew()"
              :useHref="true"
            />
            <h5>{{ $activeMenu.name }}</h5>
          </CCardHeader>
          <CCardBody>
            <HeaderFilterTransactionV3
              :save_filtering="true"
              :filter="[
                'All',
                'id',
                'product_id',
                'from_warehouse',
                'to_warehouse',
              ]"
              status_code="trx_transfer"
              v-on:handleClickFilter="handleClickFilter($event)"
              v-on:handleChangeSize="handleChangeSize($event)"
            />
            <!-- INI BATAS HEADER TABLE -->
            <CDataTable
              hover
              striped
              sorter
              border
              :items="renderList"
              :fields="fields"
              class="text-left"
              style="font-size: 12px"
            >
              <template #action="{ item, index }">
                <td>
                  <ButtonPermission
                    :id="item.id"
                    :useHref="true"
                    :permission="'read'"
                    @click="rowClicked(item, index)"
                  />
                  <ButtonPermission
                    v-if="item.status === 0"
                    :permission="'delete'"
                    :buttonProperty="btn_deleteProperty"
                    @click="modalCancel(item, index)"
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
    </CRow>

    <!-- START REJECT MODAL -->
    <CancelModal
      type="cancel"
      :property="cancelProperty"
      v-on:handleSubmit="handleCancel()"
    />
    <!-- END REJECT MODAL -->
  </div>
</template>

<script>
import $axiosMertrack from '../../../apiMertrack';
import { calculatePaginationV3, exportDataV3 } from '../../../utils';
import { dateFilter } from '../../../constants';
export default {
  name: 'ListStockTransfer',
  mounted() {
    this.page = 1;
  },
  data() {
    return {
      cancelProperty: {
        title: 'Stock Transfer',
        modal: false,
        id: null,
        reason: '',
      },
      btn_deleteProperty: {
        size: 'sm',
        class: 'float-right',
        color: 'danger',
        icon: 'window-close',
        text: '',
        tooltip: 'Cancel',
      },
      path: this.$route.path,
      filter: {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalData: 0,
        StartDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].start,
        EndDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].end,
      },
      items: [],
      tempItems: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
          _classes: 'font-weight-bold',
        },
        { key: 'created_date', label: 'Trx Date' },
        {
          key: 'product_name_batch',
          label: 'Product Name [Batch No]',
        },
        { key: 'from_warehouse_name', label: 'Source WH' },
        { key: 'to_warehouse_name', label: 'Destination WH' },
        { key: 'status_desc', label: 'Status', _classes: 'font-weight-bold' },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:10%',
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/transaction/transfer?raw=true&${param}`;
      $axiosMertrack.get(url).then((res) => {
        this.items = res.data.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: res,
        });
      });
    },
    handleClickFilter(val) {
      this.filter = Object.assign(this.filter, val);
      this.loadData();
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: this.filter,
        exportType: type,
        url: '/v3/transaction/transfer',
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
    addNew() {
      this.$router.push({ path: `${this.path}/create` });
    },
    rowClicked(item) {
      this.$router.push({ path: `${this.path}/read/${item.id}` });
    },
    modalCancel(item, index) {
      this.cancelProperty.modal = true;
      this.cancelProperty.id = item.id;
    },
    handleCancel() {
      this.$isLoading(true);
      let data = {
        id: this.cancelProperty.id,
        approved: false,
        reason: `[CANCEL] ${this.cancelProperty.reason}`,
      };

      let url = `/v3/transaction/transfer`;
      $axiosMertrack
        .post(url, data)
        .then((result) => {
          this.$isLoading(false);
          this.loadData();
          this.$toast.open({
            message: result.data.error
              ? `${result.data.message}`
              : 'Transaction has been canceled successfully',
            type: result.data.error ? 'error' : 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        })
        .catch((err) => {
          this.$isLoading(false);
          this.$toast.open({
            message: `Error : ${err}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        });
      this.cancelProperty.id = null;
      this.cancelProperty.reason = '';
      this.cancelProperty.modal = false;
    },
  },
  computed: {
    renderList() {
      return this.items.map((item) => {
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
        };
      });
    },
  },
};
</script>
