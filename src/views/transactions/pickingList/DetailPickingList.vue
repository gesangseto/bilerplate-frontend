<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="6">
              <table style="width: 100%">
                <tr style="height: 50px">
                  <td style="width: 40%">ID</td>
                  <td style="width: 60%">
                    <input readonly class="form-control" v-model="picking.id" />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Trx Date</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.created_date"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Requsted By</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.created_full_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>SO No</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.so_number"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>SO Date</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.so_date"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>SO File</td>
                  <td>
                    <ButtonDownloadFilePath :file_path="picking.file_path_1" />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>ERP Picking List No</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.erp_number"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>ERP PL File</td>
                  <td>
                    <ButtonDownloadFilePath :file_path="picking.file_path_2" />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Warehouse</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.warehouse_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Customer</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.customer_name"
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
                      readonly
                      class="form-control"
                      v-model="picking.status_desc"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="picking.status != 0">
                  <td>Last Action By</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="picking.modified_full_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="picking.status != 0">
                  <td>Last Action Date</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="picking.modified_date"
                    />
                  </td>
                </tr>
                <tr
                  style="height: 50px"
                  v-if="picking.status != 0 && picking.remark"
                >
                  <td>Remark</td>
                  <td>
                    <textarea
                      class="form-control"
                      readonly
                      v-model="picking.remark"
                    />
                  </td>
                </tr>
                <tr
                  style="height: 50px"
                  v-if="picking.status != 0 && picking.do_number"
                >
                  <td>DO No</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="picking.do_number"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="picking.status == 2">
                  <td>Reason</td>
                  <td>
                    <textarea
                      class="form-control"
                      readonly
                      v-model="picking.reason"
                    />
                  </td>
                </tr>

                <tr style="height: 50px" v-for="index in 1" :key="index">
                  <td
                    style="width: 40%"
                    v-if="picking[`quantity_lvl_${index}`] > 0"
                  >
                    {{ 'L' + index }} Quantity
                  </td>
                  <td
                    style="width: 60%"
                    v-if="picking[`quantity_lvl_${index}`] > 0"
                  >
                    <input
                      class="form-control"
                      readonly
                      v-model="picking[`quantity_lvl_${index}`]"
                    />
                  </td>
                </tr>

                <tr style="height: 50px">
                  <td style="width: 40%" colspan="2">
                    <br />
                    <br />
                    <strong> Requested Batch Item</strong>
                    <CDataTable
                      :items="pickingBatch"
                      :fields="fieldPickingBatch"
                      hover
                      sorter
                      striped
                      tableFilter
                    />
                  </td>
                </tr>
              </table>
            </CCol>
          </CRow>
          <div class="my-4">
            <div class="row my-3">
              <div class="col-lg-12 col-md-12 col-sm-12 col-xl-12">
                <h5>Picked Items</h5>
                <CDataTable
                  table-filter
                  hover
                  striped
                  sorter
                  border
                  :items="renderDetailItem"
                  :fields="fieldItem"
                  class="text-left"
                  style="font-size: 12px"
                >
                  <template #action="{ item, index }">
                    <td>
                      <Button
                        v-c-tooltip="'View'"
                        v-if="item.packaging_level > 1"
                        :type="'read'"
                        @click="rowClicked(item, index)"
                      />
                    </td>
                  </template>
                </CDataTable>
              </div>
            </div>
          </div>
        </CCardBody>
        <CCardFooter>
          <button
            v-if="action === 'EDIT' && picking.status == 99"
            class="btn btn-sm btn-success"
            type="button"
            @click="inputDo()"
          >
            <CIcon name="cil-pencil" /> Input DO
          </button>

          <ButtonBack />
          <ButtonPermission
            v-if="picking.status == 1 && picking.generate_bpom_report == 0"
            exportType="bpom-report"
            :permission="'print'"
            @click="handleClickExportBPOM()"
          />
          <ButtonPermission
            v-if="picking.items.length > 0"
            exportType="excel"
            :permission="'print'"
            @click="handleClickExport('xls')"
          />
          <ButtonPermission
            v-if="picking.items.length > 0"
            exportType="pdf"
            :permission="'print'"
            @click="handleClickExport('pdf')"
          />
        </CCardFooter>
      </CCard>
    </div>
    <!-- START DO MODAL -->
    <CModal
      size="lg"
      centered="centered"
      :show.sync="modalDO"
      title="Add DO Number"
      color="primary"
    >
      <CRow>
        <CCol sm="12" md="12" lg="12">
          <CRow>
            <CCol sm="2" md="2" lg="2">
              <label for="reason"
                >DO Number <span style="color: red">*</span></label
              >
            </CCol>
            <CCol sm="8" md="8" lg="8">
              <CInput
                placeholder="Enter DO number"
                type="text"
                v-model="doNumber"
                :add-input-classes="{
                  'is-invalid': !initial_load && !this.doNumber,
                }"
                invalid-feedback="DO number is required"
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <template #footer>
        <CButton color="primary" class="text-white" @click="saveDO()">
          Submit
        </CButton>
        <CButton @click="modalDO = false" color="danger">Cancel</CButton>
      </template>
    </CModal>
    <!-- Modal View Barang -->
    <CModal
      size="xl"
      centered="centered"
      :show.sync="viewModal"
      title="Detail"
      color="warning"
    >
      <DetailTransactionV3 v-if="viewModal == true" :item="detail_item" />
      <template #footer>
        <CButton size="sm" color="danger" type="button" @click="closeModal()">
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { CDataTable } from '@coreui/vue';
import $axiosMertrack from '../../../apiMertrack';
import { exportDataV3, handleBack } from '../../../utils';
import { getPicking, isBpomGenerated } from '../../../resource/TrxPicking';
export default {
  name: 'DetailPicking',
  data() {
    return {
      initial_load: true,
      action: '',
      status: '',
      datas: [],
      detail_item: {},
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
      modalDO: false,
      doNumber: '',
      serial: '',
      picking: {
        status: '',
        createdDate: '',
        soDate: '',
        warehouse: {
          id: '',
          name: '',
        },
        customer: {
          id: '',
          name: '',
        },
        file_1_name: '',
        file_2_name: '',
        items: [],
        picking_batch: [],
      },
      item: [],
      items: [],
      fieldItem: [
        {
          key: 'nomor',
          label: 'No',
        },
        {
          key: 'no',
          label: 'Item No ERP',
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
      fieldPickingBatch: [
        {
          key: 'nomor',
          label: 'No',
        },
        {
          key: 'product_no',
          label: 'Item No ERP',
        },
        {
          key: 'product_name',
          label: 'Product',
        },
        {
          key: 'batch_no',
          label: 'Batch No',
        },
        {
          key: 'quantity',
          label: 'L1 Qty',
        },
      ],
    };
  },
  async mounted() {
    this.action = this.$route.params.type == 'read' ? 'VIEW' : 'EDIT';
    let getData = await getPicking({ id: this.$route.params.id });
    if (getData && !getData?.error) {
      let data = getData.data[0];
      this.picking = data;
      this.items = data.items;
    }
    console.log(getData);
  },
  methods: {
    back() {
      handleBack(this.$router, this.$route);
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
    async inputDo() {
      let getData = await isBpomGenerated({ id: this.$route.params.id });
      if (getData.error) {
        if (confirm(`${getData.message} Would you like to continue?`)) {
          this.modalDO = true;
        }
      } else {
        this.modalDO = true;
      }
    },
    saveDO() {
      this.initial_load = false;
      if (!this.doNumber) {
        return;
      }
      let message =
        'You are about to finalize this transaction. This operation cannot be undone. Would you like to continue?';
      if (confirm(message)) {
        let param = {
          id: this.$route.params.id,
          approved: true,
          do_number: this.doNumber,
          reason: '',
        };
        var _url = `/v4.2/transaction/picking/finish`;
        $axiosMertrack
          .post(_url, param)
          .then((result) => {
            let res = result.data;
            this.$isLoading(false);
            this.$toast.open({
              message: res.error
                ? res.message
                : 'Data has been saved successfully ',
              type: res.error ? 'error' : 'success',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
            if (!res.error) {
              handleBack(this.$router, this.$route);
            }
          })
          .catch((err) => {
            this.$toast.open({
              message: `Error : ${err}`,
              type: 'error',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
          });
        this.modalDO = false;
        return;
      }
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: {
          id: this.$route.params.id,
        },
        exportType: type,
        url: '/v4.2/transaction/picking',
      });
    },
    handleClickExportBPOM(type) {
      exportDataV3({
        alert: true,
        param: {
          id: this.$route.params.id,
        },
        exportType: type,
        url: '/v4.2/transaction/picking/bpom-report',
      });
    },
  },
  computed: {
    pickingBatch() {
      return this.picking.picking_batch.map((item) => {
        let no = 0;
        return {
          ...item,
          nomor: (no += 1),
        };
      });
    },

    renderDetailItem() {
      return this.items.map((item) => {
        let no = 0;
        return {
          ...item,
          nomor: (no += 1),
          nie: item.nie || '-',
          gtin: item.gtin || '-',
        };
      });
    },
  },
};
</script>
