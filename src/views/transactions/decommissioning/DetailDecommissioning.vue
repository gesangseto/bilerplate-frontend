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
                      <td style="width: 40%">ID</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="decomissioning.id"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Trx Date</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="decomissioning.created_date"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Created By</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="decomissioning.created_full_name"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Remark</td>
                      <td>
                        <textarea
                          class="form-control"
                          readonly
                          v-model="decomissioning.remark"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Warehouse</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="decomissioning.warehouse_name"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Operation</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="decomissioning.activate_desc"
                        />
                      </td>
                    </tr>
                  </table>
                </CCol>
                <CCol md="6">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td style="width: 40%">Status</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="decomissioning.status_desc"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td style="width: 40%">Last Approval By</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="decomissioning['last_approval_full_name']"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td style="width: 40%">Last Approval Date</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="decomissioning['last_approval_date']"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px" v-if="decomissioning.status == 2">
                      <td style="width: 40%">Reason</td>
                      <td style="width: 60%">
                        <textarea
                          class="form-control"
                          readonly
                          v-model="decomissioning.reason"
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
                :items="detailDecomissioning"
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
                      style="font-size: 10px"
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
            v-if="
              decomissioning.status == 0 &&
              decomissioning.approval_id == section_id &&
              $route.params.type == 'approve'
            "
            type="submit"
            size="sm"
            color="success"
            @click="save()"
          >
            <CIcon name="cil-check-circle" /> Approve
          </CButton>
          <CButton
            v-if="
              decomissioning.status == 0 &&
              decomissioning.approval_id == section_id &&
              $route.params.type == 'approve'
            "
            type="button"
            size="sm"
            class="m-1"
            color="danger"
            @click="handleClickReject()"
          >
            <CIcon name="cil-ban" /> Reject
          </CButton>
          <ButtonBack />
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
        </CCardFooter>
      </CCard>
    </CCol>

    <!-- START REJECT MODAL -->
    <CancelModal
      type="reject"
      :property="rejectProperty"
      v-on:handleSubmit="handleSubmitReject()"
    />
    <!-- END REJECT MODAL -->

    <!-- Modal Detail Barang Dipilih  -->
    <CModal title="Detail" color="warning" :show.sync="viewModal" size="xl">
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
import $axiosMertrack from '../../../apiMertrack';
import { exportDataV3, getSectionId, getUserId } from '../../../utils';

export default {
  name: 'DetailDecommissioning',
  data() {
    return {
      rejectProperty: {
        title: 'Comm / Decomm',
        modal: false,
        id: null,
        reason: '',
      },
      action: '',
      detail_item: {},
      section_id: getSectionId(),
      datas: [],
      viewModal: false,
      view: {
        productId: '',
        productName: '',
        batch: '',
        serial: [],
        gtin: '',
        nie: '',
        expiredDate: '',
      },
      sn: false,
      test: null,
      status: '',
      reason: '',
      decomissioning: {
        id: '',
        wrk_id: null,
        dateTrx: '',
        status: 0,
        remark: '',
        reason: '',
        aggregationNo: [],
        activate: '',
        warehouse: {},
        last_approval: { full_name: '' },
      },
      pages: null,
      page: null,
      totalPages: 0,
      size: null,
      keyword: '',
      search: false,
      items: [],
      darkModal: false,
      fields: [
        {
          key: 'no',
          label: 'Item No',
        },
        {
          key: 'name',
          label: 'Product Name',
        },
        {
          key: 'batch_no',
          label: 'Batch No',
        },
        {
          key: 'expired_date',
          label: 'Exp Date',
        },
        {
          key: 'nie',
          label: 'NIE',
        },
        {
          key: 'epc_key',
          label: 'EPC Key',
        },
        {
          key: 'serial',
          label: 'SN',
        },
        {
          key: 'packaging_level',
          label: 'Pkg Level',
        },
        {
          key: 'packaging_name',
          label: 'Pkg Name',
        },
        {
          key: 'quantity',
          label: 'L1 Qty',
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
  },
  mounted() {
    this.action = this.$route.params.type == 'read' ? 'VIEW' : 'EDIT';
  },
  methods: {
    loadData() {
      this.decomissioning = {};
      this.items = [];
      let url = `/v3/transaction/comm-decomm?id=${this.$route.params.id}`;
      $axiosMertrack.get(url).then((response) => {
        let data = response.data.data[0];
        this.decomissioning = data;
        // Last Approval
        if (data.items.length > 0) {
          this.items = data.items;
        } else {
          this.$toast.open({
            message: `No data to be viewed`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        }
      });
    },
    save() {
      let message = `You are about to approve this transaction (ID: ${this.decomissioning.id}). This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        let data = {
          id: this.decomissioning.wrk_id,
          trx_ref_id: this.decomissioning.id,
          approved: true,
          reason: '',
        };
        let url = `/v3/transaction/approval/comm-decomm`;
        this.$isLoading(true);
        $axiosMertrack
          .post(url, data)
          .then((result) => {
            this.$isLoading(false);
            if (!result.data.error) this.$router.back();
            this.$toast.open({
              message: result.data.error
                ? `${result.data.message}`
                : 'Data has been saved successfully ',
              type: result.data.error ? 'error' : 'success',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
          })
          .catch((err) => {
            this.$isLoading(false);
            this.$toast.open({
              message: `Error : ${err}`,
              type: 'error',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
          });
      }
    },
    handleClickReject() {
      this.rejectProperty.modal = true;
      this.rejectProperty.id = this.decomissioning.id;
    },
    handleSubmitReject() {
      let data = {
        id: this.decomissioning.wrk_id,
        trx_ref_id: this.decomissioning.id,
        approved: false,
        reason: `[REJECT] ${this.rejectProperty.reason}`,
      };
      let url = `/v3/transaction/approval/comm-decomm`;
      this.$isLoading(true);
      $axiosMertrack
        .post(url, data)
        .then((result) => {
          this.$isLoading(false);
          this.$router.back();
          this.$toast.open({
            message: result.data.error
              ? `${result.data.message}`
              : 'Transaction has been rejected successfully',
            type: result.data.error ? 'error' : 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        })
        .catch((err) => {
          this.$isLoading(false);
          this.$toast.open({
            message: `Error : ${err}`,
            type: 'error',
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
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: {
          id: this.$route.params.id,
        },
        exportType: type,
        url: '/v3/transaction/comm-decomm',
      });
    },
  },
  computed: {
    detailDecomissioning() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>
