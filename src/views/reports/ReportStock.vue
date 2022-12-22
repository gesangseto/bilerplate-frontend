<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Product Stock</h5>
        </CCardHeader>
        <CCardBody>
          <HeaderFilterTransactionV3
            :filter="[
              'All',
              'product_id',
              'warehouse_id',
              'mfg_date',
              'expired_date',
              'minimum',
              'maximum',
            ]"
            status_code="report_stock"
            status_code_default="include_pending"
            :remove_all_status_code="true"
            :removeTrxDate="true"
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
  name: "ReportStock",
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
        StatusCode: "include_pending",
        StatusCodeText: "Include Pending",
        StartDate: "",
        EndDate: "",
      },
      items: [],
      fields: [
        {
          key: "no",
          label: "No",
        },
        {
          key: "warehouse_name",
          label: "Warehouse",
        },
        {
          key: "sn_non_sn",
          label: "SN / NON-SN",
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
      let url = `/v3/report/stock?raw=true&${param}`;
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
      this.filter.StartDate = "";
      this.filter.EndDate = "";
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
          no: this.getNumber(index + 1),
        };
      });
    },
  },
};
</script>
