<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Re-Aggregation [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <CRow>
                <CCol md="6">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td style="width: 40%">ID</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="formData.trx_ref_id"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Trx Name</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="formData.trx_ref_name"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td style="width: 40%">Nie</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="formData.nie"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td style="width: 40%">GTIN</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="formData.gtin"
                        />
                      </td>
                    </tr>
                  </table>
                </CCol>
                <CCol md="6">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td>ID Kemasan</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="formData.id_kemasan"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Batch No</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="formData.batch_no"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Lot No</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="formData.lot_no"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Exp Date</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="formData.exp_date"
                        />
                      </td>
                    </tr>
                  </table>
                </CCol>
              </CRow>
              <CDataTable
                tableFilter
                hover
                striped
                sorter
                border
                :items="detailReaggregation"
                :fields="fields"
                class="text-left"
                style="font-size: 12px"
              >
                <template #action="{ item, index }">
                  <td>
                    <CButton
                      v-if="item.packaging_level > 1"
                      color="info"
                      size="sm"
                      @click="rowClicked(item, index)"
                      class="px-2 mx-2"
                    >
                      <v-icon name="eye" />
                    </CButton>
                  </td>
                </template>
              </CDataTable>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CButton
            type="reset"
            size="sm"
            class="m-1 float-right"
            color="primary"
            @click="cancel()"
          >
            <CIcon name="cil-arrow-left" /> Back
          </CButton>
        </CCardFooter>
      </CCard>
    </CCol>
    <!-- Modal Detail Barang Dipilih  -->
    <CModal title="Detail" color="warning" :show.sync="viewModal" size="lg">
      <DetailTransactionV3 v-if="viewModal == true" :item="detail_item" />
      <template #footer>
        <CButton size="sm" color="danger" type="button" @click="closeModal()">
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import { calculatePaginationV3, humanize } from "../../../utils";

export default {
  name: "DetailQueueBpom",
  mounted() {
    this.action = this.$route.params.type == "read" ? "VIEW" : "EDIT";
    this.loadData();
    // this.loadMenu();
  },
  data() {
    return {
      action: "",
      detail_item: {},
      datas: [],
      viewModal: false,
      view: {
        productId: "",
        productName: "",
        batch: "",
        serial: [],
        gtin: "",
        nie: "",
        expiredDate: "",
      },
      sn: false,
      test: null,
      status: "",
      formData: {},
      reaggregation: {
        id: "",
        add: "",
        serial: "",
        warehouse: {},
        packaging_level: "",
      },
      pages: null,
      page: null,
      totalPages: 0,
      size: null,
      keyword: "",
      search: false,
      items: [],
      fields: [
        {
          key: "type",
          label: "Type",
        },
        {
          key: "level",
          label: "Level",
        },
        {
          key: "is_active",
          label: "Is Active",
        },
        {
          key: "is_reject",
          label: "Is Reject",
        },
        {
          key: "is_sample",
          label: "Is Sample",
        },
        {
          key: "status_code",
          label: "Res Status",
        },
        {
          key: "message",
          label: "Res Message",
        },
        {
          key: "status",
          label: "Status",
        },
      ],
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page);
        }
      },
    },
  },
  methods: {
    loadData() {
      this.items = [];
      let param = { trx_ref_id: this.$route.params.id };
      let url = `/v3/transaction/queue-bpom?${new URLSearchParams(param)}`;
      $axiosMertrack.get(url).then((res) => {
        let data = res.data.data;
        this.formData = data[0];
        this.items = this.formData.details;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: res,
        });
      });
    },
    loadMenu() {
      let path = this.$router.currentRoute.fullPath;
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
    cancel() {
      this.$router.back();
    },
    rowClicked(item) {
      this.datas = [];
      if (item.packaging_level == 1) {
        this.$toast.open({
          message: `No detail SN data to be viewed, SN [${item.serial_id}] is Packaging L1`,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        return false;
      }
      this.detail_item = item;
      this.viewModal = true;
      return;
    },
    closeModal() {
      this.datas = [];
      this.viewModal = false;
    },
  },
  computed: {
    detailReaggregation() {
      return this.items.map((item) => {
        let level = "";
        if (item.barcode_level) {
          level = item.barcode_level;
        } else if (item.parent_type) {
          level = item.parent_type;
        }
        return {
          ...item,
          type: humanize(item.type),
          level: humanize(level),
          status: humanize(item.status),
        };
      });
    },
  },
};
</script>
