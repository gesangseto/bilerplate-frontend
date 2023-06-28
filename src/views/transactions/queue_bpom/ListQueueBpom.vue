<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Queue BPOM</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <!-- :filter="[
              'All',
              'Product',
              'Warehouse',
              'Supplier',
              'Customer',
              'User',
              'Approval',
              'Exp Date',
              'Min Stock',
              'Max Stock',
            ]" -->
              <HeaderFilterTransactionV3
                :costume_filter="[
                  {
                    value: 'transaction',
                    code: 'transaction',
                    label: 'Type',
                    data: [
                      { value: 'inbound', label: 'Production ' },
                      { value: 'outbound', label: 'Release ' },
                      { value: 'picking', label: 'Distribution ' },
                    ],
                  },
                ]"
                :filter="['All', 'id']"
                status_code="generate_csv"
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
                    <ButtonPermission
                      :permission="'read'"
                      @click="rowReadClicked(item, index)"
                    />
                    <ButtonPermission
                      v-if="item.status != 'success'"
                      :permission="'update'"
                      @click="rowUpdateClicked(item, index)"
                      :buttonProperty="btn_updateProp"
                    />
                    &nbsp;
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
import $axiosMertrack from "../../../apiMertrack";
import {
  calculatePaginationV3,
  exportDataV3,
  getToken,
  getUserId,
} from "../../../utils";
import { dateFilter } from "../../../constants";
import moment from "moment";
export default {
  name: "ListQueueBpom",
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
      btn_downloadProp: {
        size: "sm",
        class: "float-right",
        color: "secondary",
        icon: "download",
        text: "",
        tooltip: "Download csv",
      },
      btn_updateProp: {
        size: "sm",
        class: "float-right",
        color: "success",
        icon: "paper-plane",
        text: "",
        tooltip: "Send via API now",
      },
      user_id: getUserId(),
      items: [],
      tempItems: [],
      buttonStatus: null,
      dataUsers: [],
      fields: [
        {
          key: "trx_ref_name",
          label: "Trx Name",
          _classes: "font-weight-bold",
        },
        {
          key: "nie",
          label: "Nie",
        },
        {
          key: "batch_no",
          label: "Batch No",
        },
        {
          key: "lot_no",
          label: "Batch No",
        },
        {
          key: "exp_date",
          label: "Exp Date",
        },
        {
          key: "gtin",
          label: "GTIN",
        },
        {
          key: "id_kemasan",
          label: "Kemasan",
        },
        {
          key: "status",
          label: "Status",
        },
        {
          key: "modified_date",
          label: "Last API Sent Date",
        },
        {
          key: "action",
          _style: "width:10%",
          label: "Action",
        },
      ],
    };
  },
  methods: {
    loadData() {
      this.items = [];
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/transaction/queue-bpom?${param}`;
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
        url: "/v3/transaction/queue-bpom",
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
    handleDownloadClick(item) {
      let body = {};
      body.id = item.id;
      body.PrintTo = "csv";
      body.MertrackApiToken = getToken();
      let url = `${new URLSearchParams(body).toString()}`;
      url = `${process.env.VUE_APP_URL_API_MERTRACK}/api/v3/transaction/bpom?raw=true&${url}`;
      window.open(url, "_blank").focus();
    },
    rowUpdateClicked(item) {
      this.$toast.open({
        message: `This Action is currently unavailable`,
        type: "success",
        dissmissible: true,
        position: "top-right",
        duration: 5000,
      });
    },
    rowReadClicked(item) {
      this.$toast.open({
        message: `This Action is currently unavailable`,
        type: "danger",
        dissmissible: true,
        position: "top-right",
        duration: 5000,
      });
    },
  },
  computed: {
    dataTableItem() {
      return this.items.map((item) => {
        return {
          ...item,
          // transaction_desc: item.transaction_desc.charAt(0).toUpperCase(),
          modified_date: moment(item.modified_date).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        };
      });
    },
  },
};
</script>
