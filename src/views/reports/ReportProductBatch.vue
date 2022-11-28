<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Product Batch Report</h5>
        </CCardHeader>
        <CCardBody>
          <HeaderFilterTransaction
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
import { exportDataReport, calculatePagination } from "../../utils";
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
        ApiName: "Report_ProductBatch",
        StartDate: dateFilter.last_3_month.start,
        EndDate: dateFilter.last_3_month.end,
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
          key: "no",
          label: "Item No",
          _classes: "font-weight-bold",
        },
        {
          key: "name",
          label: "Product Name",
          _classes: "font-weight-bold",
        },
        {
          key: "id",
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
          key: "nie",
          label: "NIE",
        },
        {
          key: "gtin",
          label: "L1 GTIN",
          // _classes: "font-weight-bold",
        },
        {
          key: "quantity",
          label: "L1 Qty",
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      $axiosMertrack.get(`/general/report?${param}`).then((res) => {
        this.items = res.data.data;
        this.filter = calculatePagination({
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
