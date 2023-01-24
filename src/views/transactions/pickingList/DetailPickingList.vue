<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <CCard>
        <CCardHeader>
          <h5>Picking List [{{ action }}]</h5>
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
                  <td>SO File Ref Name</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.file_1_name"
                    />
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
                  <td>ERP PL File Ref Name</td>
                  <td>
                    <input
                      readonly
                      class="form-control"
                      v-model="picking.file_1_name"
                    />
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
                <tr style="height: 50px" v-if="picking.status != 0">
                  <td>Remark</td>
                  <td>
                    <textarea
                      class="form-control"
                      readonly
                      v-model="picking.remark"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="picking.status != 0">
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
              </table>
            </CCol>
          </CRow>
          <div class="my-4">
            <div class="row my-3">
              <div class="col-lg-12 col-md-12 col-sm-12 col-xl-12">
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
          <button
            class="btn btn-sm btn-primary float-right"
            type="button"
            @click="back()"
          >
            <CIcon name="cil-arrow-left" /> Back
          </button>
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
        <CButton color="primary" class="text-white" @click="saveDO()"
          >Submit</CButton
        >
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
import $axiosMertrack from "../../../apiMertrack";
export default {
  name: "DetailPicking",
  data() {
    return {
      initial_load: true,
      action: "",
      status: "",
      datas: [],
      detail_item: {},
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
      modalDO: false,
      doNumber: "",
      serial: "",
      picking: {
        status: "",
        createdDate: "",
        soDate: "",
        warehouse: {
          id: "",
          name: "",
        },
        customer: {
          id: "",
          name: "",
        },
        fileName1: "",
        fileName2: "",
      },
      item: [],
      items: [],
      fieldItem: [
        {
          key: "no",
          label: "Item No",
        },
        {
          key: "name",
          label: "Product Name",
        },
        {
          key: "batch_no",
          label: "Batch No",
        },
        {
          key: "expired_date",
          label: "Exp Date",
        },
        {
          key: "nie",
          label: "NIE",
        },
        {
          key: "gtin_cp",
          label: "GTIN / CP",
        },
        {
          key: "serial",
          label: "SN",
        },
        {
          key: "packaging_level",
          label: "Pkg Level",
        },
        {
          key: "packaging_name",
          label: "Pkg Name",
        },
        {
          key: "quantity",
          label: "L1 Qty",
        },
        {
          key: "action",
          label: "Action",
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  mounted() {
    this.action = this.$route.params.type == "read" ? "VIEW" : "EDIT";
    var _url = `/v3/transaction/picking?id=${this.$route.params.id}`;
    $axiosMertrack.get(_url).then((response) => {
      let data = response.data.data[0];
      this.picking = data;
      if (data.items.length > 0) {
        this.items = data.items;
      } else {
        this.$toast.open({
          message: `No data to be viewed`,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
      }
    });
    // get detail data
  },
  methods: {
    back() {
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
    inputDo() {
      this.modalDO = true;
    },
    saveDO() {
      this.initial_load = false;
      if (!this.doNumber) {
        return;
      }
      let message =
        "You are about to finalize this transaction. This operation cannot be undone. Would you like to continue?";
      if (confirm(message)) {
        let param = {
          id: this.$route.params.id,
          approved: true,
          do_number: this.doNumber,
          reason: "",
        };
        var _url = `/v3/transaction/picking/finish`;
        $axiosMertrack
          .post(_url, param)
          .then((result) => {
            this.$isLoading(false);
            this.$toast.open({
              message: result.data.error
                ? result.data.message
                : "Data has been saved succesfully ",
              type: result.data.error ? "error" : "success",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
            if (!result.data.error) {
              // this.generateCsv();
              this.$router.back();
            }
          })
          .catch((err) => {
            this.$toast.open({
              message: `Error : ${err}`,
              type: "error",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
          });
        this.modalDO = false;
        return;
      }
    },
  },
  computed: {
    renderDetailItem() {
      return this.items.map((item) => {
        return {
          ...item,
          gtin_cp:
            item.epc_type == "sscc" ? item.company_prefix : item.gtin_sscc,
        };
      });
    },
  },
};
</script>
