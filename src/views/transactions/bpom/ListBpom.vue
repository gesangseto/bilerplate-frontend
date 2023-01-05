<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>BPOM Reporting</h5>
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
                    <!-- <CButton
                      tpye="button"
                      size="sm"
                      class="float-right"
                      color="secondary"
                      @click="handleDownloadClick(item)"
                    >
                      <v-icon style="align-self: center" name="download" />
                    </CButton> -->

                    <ButtonPermission
                      :permission="'print'"
                      @click="handleDownloadClick(item)"
                      :buttonProperty="btn_downloadProp"
                    />
                    <ButtonPermission
                      v-if="item.status_send_api != 'Success'"
                      :permission="'delete'"
                      :buttonProperty="btn_deleteProp"
                      @click="rowDeleteClicked(item, index)"
                    />
                    <ButtonPermission
                      v-if="item.status_send_api != 'Success'"
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
import { calculatePaginationV3, exportDataV3 } from "../../../utils";
import { dateFilter } from "../../../constants";
export default {
  name: "ListBpom",
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
      btn_deleteProp: {
        size: "sm",
        class: "float-right",
        color: "danger",
        icon: "window-close",
        text: "",
        tooltip: "Cancel sending via API",
      },
      user_id: localStorage.getItem("user_id"),
      items: [],
      tempItems: [],
      buttonStatus: null,
      dataUsers: [],
      fields: [
        {
          key: "id",
          label: "ID",
          _classes: "font-weight-bold",
        },
        {
          key: "generate_date",
          label: "Generated Date",
        },
        {
          key: "id_trx",
          label: "Trx Ref ID",
          _classes: "font-weight-bold",
        },
        {
          key: "transaction_desc",
          label: "Type",
          _style: "text-transform: capitalize;",
          _classes: "font-weight-bold",
        },
        {
          key: "csv_name",
          label: "CSV Name",
        },
        {
          key: "status_desc",
          label: "Approval Status",
          _classes: "font-weight-bold",
        },
        {
          key: "approval_date",
          label: "Approval Date",
        },
        {
          key: "approved_by_name",
          label: "Approval By",
        },
        {
          key: "date_send_api",
          label: "Last API Sent Date",
        },
        {
          key: "status_send_api",
          label: "API Sent Status",
          _classes: "font-weight-bold",
        },
        {
          key: "action",
          _style: "width:16%",
          label: "Action",
        },
      ],
    };
  },
  methods: {
    loadData() {
      this.items = [];
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/transaction/bpom?raw=true&${param}`;
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
        param: this.filter,
        exportType: type,
        url: "/v3/transaction/bpom",
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
      console.log(item);
      let body = {};
      body.id = item.id;
      body.PrintTo = "csv";
      body.MertrackApiToken = localStorage.getItem("token");
      let url = `${new URLSearchParams(body).toString()}`;
      url = `${process.env.VUE_APP_URL_API_SUPPORT}/api/v3/transaction/bpom?raw=true&${url}`;
      console.log(url);
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
    rowDeleteClicked(item) {
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
          status_send_api: item.status_send_api ?? " ",
          date_send_api: item.date_send_api ?? " ",
          approved_by_name: item.approved_by_name ?? " ",
          approval_date: item.approval_date ?? " ",
        };
      });
    },
  },
};
</script>
