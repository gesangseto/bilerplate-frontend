<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Product Batch Report</h5>
        </CCardHeader>
        <CCardBody>
          <HeaderFilterTransactionV3
            :filter="['All', 'Product', 'Exp Date', 'Mfg Date']"
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
</template>

<script>
import $axiosMertrack from "../../apiMertrack";
import {
  exportDataReport,
  calculatePagination,
  calculatePaginationV3,
} from "../../utils";
import { dateFilter } from "../../constants";

export default {
  name: "ReportProductBatch",
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
        StartDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].start,
        EndDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].end,
      },
      items: [],
      fields: [
        {
          key: "number",
          label: "No",
        },
        {
          key: "created_date",
          label: "Inbound Date",
        },
        {
          key: "product_no",
          label: "Item No",
          _classes: "font-weight-bold",
        },
        {
          key: "product_name",
          label: "Product Name",
          _classes: "font-weight-bold",
        },
        {
          key: "batch_no",
          label: "Batch No",
          _classes: "font-weight-bold",
        },
        {
          key: "expired_date",
          label: "Exp Date",
        },
        {
          key: "mfg_date",
          label: "Mfg Date",
        },
        {
          key: "product_nie",
          label: "NIE",
        },
        {
          key: "product_gtin",
          label: "L1 GTIN",
          // _classes: "font-weight-bold",
        },
        {
          key: "quantity_l1",
          label: "L1 Qty",
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/report/batch?raw=true&${param}`;
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
      exportDataReport({ param: this.filter, exportType: type });
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
          number: this.getNumber(index + 1),
        };
      });
    },
  },
};
</script>
