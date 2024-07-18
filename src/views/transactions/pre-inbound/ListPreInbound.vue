<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Pre Inbound</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <HeaderFilterTransactionV3
                :filter="['All', 'id', 'product_id']"
                :order="['All', 'id', 'product_id']"
                status_code="pre_inbound"
                v-on:handleClickFilter="handleClickFilter($event)"
                v-on:handleChangeSize="handleChangeSize($event)"
              />
              <!-- INI BATAS HEADER TABLE -->
              <CDataTable
                hover
                striped
                sorter
                border
                :items="reformatItems"
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
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axiosMertrack from '../../../apiMertrack';
import { calculatePaginationV3, exportDataV3 } from '../../../utils';
import { dateFilter } from '../../../constants';
export default {
  name: 'ListInbound',
  mounted() {
    this.pages = [10, 20, 50, 100];
    this.page = 1;
    this.size = this.pages[0];
    this.loadData();
  },
  data() {
    return {
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
          _classes: 'font-weight-bold',
        },
        {
          key: 'created_date',
          label: 'Trx Date',
        },
        {
          key: 'trx_ref_id',
          label: 'Trx ID',
        },
        {
          key: 'process_order_erp',
          label: 'PO. No',
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
          key: 'lot_no',
          label: 'Lot No',
        },
        {
          key: 'quantity_lvl_1',
          label: 'L1 Qty',
        },
        {
          key: 'created_full_name',
          label: 'Created By',
        },
        {
          key: 'status_desc',
          label: 'Status',
        },
        {
          key: 'action',
          label: 'Action',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      $axiosMertrack
        .get(`/v3/transaction/pre-inbound?${param}&raw=true`)
        .then((res) => {
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
        url: '/v4/transaction/pre-inbound',
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
    rowClicked(item) {
      this.$router.push({
        path: `inbound/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `add-inbound`,
      });
    },
    deleteRow(item, index) {
      this.dataInbound.splice(index, 1);
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>
