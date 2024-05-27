<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Outbound</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <HeaderFilterTransactionV3
                :costume_filter="[
                  {
                    value: 'Type',
                    code: 'Type',
                    label: 'Type',
                    data: [
                      // { value: 'Transfer', label: 'Transfer' },
                      { value: 'Picking', label: 'Picking' },
                      // { value: 'Return', label: 'Return' },
                    ],
                  },
                ]"
                :filter="[
                  'All',
                  'id',
                  'product_id',
                  'source_warehouse',
                  'destination_customer',
                ]"
                :order="[
                  'All',
                  'id',
                  'product_id',
                  'Type',
                  'source_warehouse',
                  'destination_customer',
                ]"
                status_code="trx_outbound"
                v-on:handleClickFilter="handleClickFilter($event)"
                v-on:handleChangeSize="handleChangeSize($event)"
              />
              <!-- INI BATAS HEADER TABLE -->
              <CDataTable
                hover
                striped
                sorter
                border
                :items="dataOutbound"
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
import {
  toTitleCase,
  calculatePaginationV3,
  exportDataV3,
} from '../../../utils';
import { dateFilter } from '../../../constants';
export default {
  name: 'ListOutbound',
  mounted() {
    this.page = 1;
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
          key: 'product_name_batch',
          label: 'Product Name [Batch No, L1 Qty]',
        },
        {
          key: 'type',
          label: 'Type',
          _classes: 'font-weight-bold',
        },
        {
          key: 'trx_ref_id',
          label: 'Trx Ref ID',
          _classes: 'font-weight-bold',
        },
        {
          key: 'from',
          label: 'Source',
        },
        {
          key: 'to',
          label: 'Destination',
        },
        {
          key: 'created_full_name',
          label: 'Created By',
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
      let url = `/v3/transaction/outbound?raw=true&${param}`;

      $axiosMertrack.get(url).then((res) => {
        let data = res.data.data;
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
        url: '/v3/transaction/outbound',
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
      this.$router.push({ path: `outbound/read/${item.id}` });
    },
    addNew() {
      this.$router.push({ path: `outbound/create` });
    },
    deleteRow(item, index) {
      this.dataOutbound.splice(index, 1);
    },
  },
  computed: {
    dataOutbound() {
      return this.items.map((item) => {
        let type = toTitleCase(item.type);
        return {
          ...item,
          created_full_name: item.created_full_name || '-',
          type: type,
        };
      });
    },
  },
};
</script>
