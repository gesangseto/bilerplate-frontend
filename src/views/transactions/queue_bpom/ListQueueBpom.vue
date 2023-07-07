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
              <HeaderFilterTransactionV3
                :costume_filter="[
                  {
                    value: 'trx_ref_name',
                    code: 'trx_ref_name',
                    label: 'Trx Name',
                    data: [
                      { value: 'Transfer', label: 'Transfer ' },
                      { value: 'Re-Aggregation', label: 'Re-Aggregation ' },
                      { value: 'Aggregation', label: 'Aggregation ' },
                      { value: 'Picking', label: 'Picking ' },
                    ],
                  },
                ]"
                :filter="['All']"
                status_code="bpom_transaction"
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
                      :id="item.trx_ref_id"
                      :useHref="true"
                      :permission="'read'"
                      @click="rowReadClicked(item, index)"
                    />
                    <ButtonPermission
                      v-if="item.can_proccess"
                      :permission="'update'"
                      @click="sendToBpom(item, index)"
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
  humanize,
} from "../../../utils";
import { dateFilter } from "../../../constants";
import moment from "moment";
export default {
  name: "ListQueueBpom",
  mounted() {
    this.page = 1;
    this.loadData();
    this.loadMenu();
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
      formData: {
        connector_action_id: null,
        data: {
          menu_id: null,
          trx_ref_id: null,
          created_by: getUserId(),
        },
      },
      items: [],
      tempItems: [],
      buttonStatus: null,
      dataUsers: [],
      fields: [
        {
          key: "trx_id",
          label: "Trx ID",
          _classes: "font-weight-bold",
        },
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
  watch: {
    formData: {
      handler(n, o) {
        if (n.data.menu_id) {
          this.loadConnector();
        }
      },
      deep: true,
    },
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
    loadMenu() {
      let path = this.$route.fullPath;
      $axiosMertrack
        .get(`/v3/master/menu?link=${path}`)
        .then((res) => {
          let _data = res.data.data[0];
          this.formData.data.menu_id = _data.id;
        })
        .catch((e) => {
          this.$toast.open({
            message: `${e.message}`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
        });
      return;
    },
    loadConnector() {
      let param = { key: "menu_id", value: this.formData.data.menu_id };
      param = new URLSearchParams(param).toString();
      $axiosMertrack
        .get(`/v3/connector/connector-action?${param}`)
        .then((result) => {
          let data = result.data;
          if (data.error || data.data.length === 0) {
            this.$toast.open({
              message: `The Menu you have visited is not assigned to any Connector Action.`,
              type: "error",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
            this.formData.connector_action_id = null;
            return;
          } else if (data.data[0].status !== "Active") {
            this.$toast.open({
              message: `The Menu you have selected is not assigned to Active Connector Action.`,
              type: "error",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
            this.formData.connector_action_id = null;
            return;
          }
          this.formData.connector_action_id = data.data[0].id;
        })
        .catch((e) => {
          this.$toast.open({
            message: `${e.message}`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
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
    handleDownloadClick(item) {},
    sendToBpom(item) {
      let param = this.formData;
      param.data.trx_ref_id = item.trx_ref_id;
      $axiosMertrack
        .post("/v3/connector/connector-action/execute", param)
        .then((result) => {
          this.$isLoading(false);
          this.$toast.open({
            message: result.data.error
              ? `${result.data.message}`
              : "Data has been saved successfully.",
            type: result.data.error ? "error" : "success",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          if (!result.data.error) this.loadData();
        })
        .catch((err) => {
          this.$isLoading(false);
          this.$toast.open({
            message: `${err}`,
            type: `error`,
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
        });
    },
    rowReadClicked(item) {
      this.$router.push({ path: `queue-bpom/read/${item.trx_ref_id}` });
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
          status: humanize(item.status),
        };
      });
    },
  },
};
</script>
