<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <CRow>
                <CCol md="6">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td style="width: 40%">Trx ID</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="formData.trx_id"
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
                  </table>
                </CCol>
                <CCol md="6">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td>Product Name [Batch No]</td>
                      <td>
                        <textarea
                          class="form-control"
                          readonly
                          v-model="formData.product_name_batch"
                        />
                      </td>
                    </tr>
                    <tr
                      :v-if="formData.remark ? true : false"
                      style="height: 50px"
                    >
                      <td>Submit Remark</td>
                      <td>
                        <textarea
                          class="form-control"
                          readonly
                          v-model="formData.remark"
                        />
                      </td>
                    </tr>
                  </table>
                </CCol>
              </CRow>

              <CButton
                v-if="formData.can_proccess"
                color="success"
                @click="sendToBpom(formData)"
                class="m-1 float-right"
              >
                <v-icon name="paper-plane" />
              </CButton>
              <CButton
                v-if="formData.can_proccess"
                color="info"
                @click="viewModal = true"
                class="m-1 float-right"
              >
                Submit Manual&nbsp;
                <v-icon name="clipboard-check" />
              </CButton>
              <CDataTable
                tableFilter
                hover
                striped
                sorter
                border
                :items="details"
                :fields="fields"
                class="text-left"
                style="font-size: 12px"
              />
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <ButtonBack />
          <ButtonPermission
            exportType="excel"
            :permission="'print'"
            @click="handleClickExport('xls')"
          />
        </CCardFooter>
      </CCard>
    </CCol>
    <!-- Modal Detail Barang Dipilih  -->
    <CModal title="Submit Manual" color="warning" :show.sync="viewModal">
      <CTextarea
        :is-valid="formForceUpdate.remark ? true : false"
        invalid-feedback="Remark is required"
        placeholder="Enter Remark"
        v-model="formForceUpdate.remark"
        rows="5"
      >
        <template #label>
          <p>
            Remark
            <span class="text-danger">
              <strong>*</strong>
            </span>
          </p>
        </template>
      </CTextarea>
      <template #footer>
        <CButton
          @click="submitForceUpdate()"
          :disabled="!formForceUpdate.remark"
          color="primary"
        >
          <CIcon name="cil-check-circle" /> Submit
        </CButton>
        <CButton color="danger" type="button" @click="closeModal()">
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import moment from 'moment';
import $axiosMertrack from '../../../apiMertrack';
import {
  calculatePaginationV3,
  exportDataV3,
  getUserId,
  humanize,
} from '../../../utils';

export default {
  name: 'DetailQueueBpom',
  mounted() {
    this.action = this.$route.params.type == 'read' ? 'VIEW' : 'EDIT';
    // this.loadData();
    this.loadMenu();
  },
  data() {
    return {
      action: '',
      detail_item: {},
      datas: [],
      viewModal: false,
      formForceUpdate: {
        trx_ref_id: null,
        remark: null,
      },
      formData: {},
      formConnector: {
        connector_action_id: null,
        data: {
          menu_id: null,
          trx_ref_id: null,
          created_by: getUserId(),
        },
      },
      items: [],
      fields: [
        {
          key: 'type',
          label: 'Type',
        },
        {
          key: 'level',
          label: 'Level',
        },
        {
          key: 'parent',
          label: 'Parent Barcode',
        },
        {
          key: 'batch_no',
          label: 'Batch No',
        },
        // {
        //   key: "is_active",
        //   label: "Is Active",
        // },
        // {
        //   key: "is_reject",
        //   label: "Is Reject",
        // },
        // {
        //   key: "is_sample",
        //   label: "Is Sample",
        // },
        {
          key: 'status_code',
          label: 'Res Status',
        },
        {
          key: 'message',
          label: 'Res Message',
        },
        {
          key: 'modified_date',
          label: 'Last Modified',
        },
        {
          key: 'modified_by_full_name',
          label: 'Last Modified By',
        },
        {
          key: 'status',
          label: 'Status',
        },
      ],
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        if (route.params && route.params.id) this.loadData();
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page);
        }
      },
    },
    formConnector: {
      handler(n) {
        if (n.data.menu_id) {
          this.loadConnector();
        }
      },
      deep: true,
    },
  },
  methods: {
    loadData() {
      this.formData = {};
      this.items = [];
      this.formConnector.data.trx_ref_id = this.$route.params.id;
      this.formForceUpdate.trx_ref_id = this.$route.params.id;
      let param = {};
      function isInteger(value) {
        return (
          !isNaN(value) &&
          parseInt(Number(value)) == value &&
          !isNaN(parseInt(value, 10))
        );
      }
      if (isInteger(this.$route.params.id)) {
        param.trx_id = this.$route.params.id;
      } else {
        param.trx_ref_id = this.$route.params.id;
      }
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
      let path = this.$route.fullPath;
      let params = this.$route.params;
      for (const key in params) {
        path = path.replace(params[key], '');
      }
      path = path.replace(/\/+$/, '');
      $axiosMertrack
        .get(`/v3/master/menu?link=${path}`)
        .then((res) => {
          let _data = res.data.data[0];
          this.formConnector.data.menu_id = _data.id;
        })
        .catch((e) => {
          this.$toast.open({
            message: `${e.message}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        });
      return;
    },
    loadConnector() {
      let param = { key: 'menu_id', value: this.formConnector.data.menu_id };
      param = new URLSearchParams(param).toString();
      $axiosMertrack
        .get(`/v3/connector/connector-action?${param}`)
        .then((result) => {
          let data = result.data;
          if (data.error || data.data.length === 0) {
            this.$toast.open({
              message: `The Menu you have visited is not assigned to any Connector Action.`,
              type: 'error',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
            this.formConnector.connector_action_id = null;
            return;
          } else if (data.data[0].status !== 'Active') {
            this.$toast.open({
              message: `The Menu you have selected is not assigned to Active Connector Action.`,
              type: 'error',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
            this.formConnector.connector_action_id = null;
            return;
          }
          this.formConnector.connector_action_id = data.data[0].id;
        })
        .catch((e) => {
          this.$toast.open({
            message: `${e.message}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        });
    },
    sendToBpom(item) {
      let param = this.formConnector;
      param.data.trx_ref_id = item.trx_ref_id;
      $axiosMertrack
        .post('/v3/connector/connector-action/execute', param)
        .then((result) => {
          this.$isLoading(false);
          this.$toast.open({
            message: result.data.error
              ? `${result.data.message}`
              : 'Data has been saved successfully.',
            type: result.data.error ? 'error' : 'success',
            dissmissible: true,
            position: 'top-right',
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
            position: 'top-right',
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
          type: 'error',
          dissmissible: true,
          position: 'top-right',
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
    submitForceUpdate() {
      $axiosMertrack
        .post(`/v3/transaction/queue-bpom`, this.formForceUpdate)
        .then((res) => {
          let data = res.data;
          if (data.error) {
            this.$toast.open({
              message: data.message,
              type: 'error',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
          }
          this.loadData();
          this.viewModal = false;
        });
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: {
          trx_ref_id: this.formData.trx_ref_id,
        },
        exportType: type,
        url: '/v3/transaction/queue-bpom',
      });
    },
  },
  computed: {
    details() {
      return this.items.map((item) => {
        let level = '';
        if (item.barcode_level) {
          level = item.barcode_level;
        } else if (item.parent_type) {
          level = item.parent_type;
        }
        return {
          ...item,
          modified_by_full_name: item.modified_by_full_name || '',
          type: humanize(item.type),
          level: humanize(level),
          status: humanize(item.status),
          status_code: item.status_code || '',
          message: item.message || '',
          parent: item.parent || '',
          modified_date: moment
            .utc(item.modified_date)
            .format('YYYY-MM-DD HH:mm'),
        };
      });
    },
  },
};
</script>
