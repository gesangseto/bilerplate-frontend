<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission :permission="'create'" @click="addNew()" />
          <h5>Upload XML</h5>
        </CCardHeader>
        <CCardBody>
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
              'Production',
              'Distribution',
              'Release',
            ]" -->
          <HeaderFilterTransactionV3
            :filter="['All', 'id', 'source_id', 'supplier_id']"
            status_code="upload_file_xml"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <div class="table-responsive">
            <CDataTable
              hover
              striped
              sorter
              border
              :items="upload"
              :fields="fields"
              @page-change="pageChange"
              class="text-left"
              style="font-size: 12px"
            >
              <template #action="{ item, index }">
                <td>
                  <ButtonPermission
                    :permission="'read'"
                    @click="detailUpload(item, index)"
                  />
                  <ButtonPermission
                    v-if="item.status === 3 || item.status == 0"
                    :permission="'delete'"
                    :buttonProperty="btn_deleteProperty"
                    @click="modalCancel(item, index)"
                  />
                  <ButtonPermission
                    v-if="item.status == 0 || item.status == '0'"
                    :permission="'update'"
                    :buttonProperty="btn_updateProperty"
                    @click="inputMfgHet(item, index)"
                  />
                </td>
              </template>
            </CDataTable>
          </div>
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

    <CModal
      :show.sync="warningModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Input MFG"
      color="info"
    >
      <template #header>
        <h6 class="modal-title">
          Input Mfg Date and Postfix (ID: {{ MfgPostfix.id }})
        </h6>
        <CButtonClose @click="warningModal = false" class="text-white" />
      </template>
      <table style="width: 100%">
        <tr>
          <td style="width: 40%">File Name</td>
          <td style="width: 60%">{{ MfgPostfix.item.file_name }}</td>
        </tr>
        <tr style="height: 50px">
          <td style="width: 40%">
            Mfg Date <small style="color: red">*</small>
          </td>
          <td style="width: 60%">
            <datepicker
              :max="new Date()"
              :format="formatDate"
              v-model="MfgPostfix.mfg_date"
            ></datepicker>
            <small
              v-if="getDifferentDays(MfgPostfix.mfg_date) > 0"
              style="color: red"
            >
              Mfg Date cannot be greater than today's date.
            </small>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 15px">Mfg Postfix</td>
          <td>
            <CInput
              type="text"
              v-model="MfgPostfix.mfg_postfix"
              maxlength="3"
            ></CInput>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 15px">Het</td>
          <td>
            <CInput
              type="number"
              v-model="MfgPostfix.het"
              maxlength="8"
            ></CInput>
          </td>
        </tr>
      </table>
      <template #footer>
        <CButton @click="sendMfgHet()" color="primary">
          <CIcon name="cil-check-circle" /> Submit</CButton
        >
        <CButton @click="warningModal = false" color="danger">
          <CIcon name="cil-ban" /> Cancel</CButton
        >
      </template>
    </CModal>
    <!-- START REJECT MODAL -->
    <CancelModal
      type="cancel"
      :property="cancelProperty"
      v-on:handleSubmit="handleCancel()"
    />
    <!-- END REJECT MODAL -->
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import { exportData, calculatePaginationV3 } from "../../../utils";
import { dateFilter } from "../../../constants";
import Datepicker from "vuejs-datepicker";
import moment from "moment";
export default {
  name: "ListUploadXML",
  components: {
    Datepicker,
  },
  mounted() {
    this.pages = [10, 20, 50, 100];
    this.page = 1;
    this.size = this.pages[0];
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
      btn_deleteProperty: {
        size: "sm",
        class: "float-right",
        color: "danger",
        icon: "window-close",
        text: "",
        tooltip: "Cancel",
      },
      btn_updateProperty: {
        size: "sm",
        class: "float-right",
        color: "success",
        icon: "edit",
        text: "Mfg",
        tooltip: "Input Mfg",
      },
      cancelProperty: {
        title: "Upload XML",
        modal: false,
        id: null,
        reason: "",
      },
      reason: "",
      cancelModal: false,
      cancelId: null,
      warningModal: false,
      required: this.initial_required(),
      MfgPostfix: {
        item: {},
        id: null,
        mfg_date: new Date(),
        mfg_postfix: null,
        het: null,
      },
      items: [],
      fields: [
        {
          key: "id",
          label: "ID",
          _classes: "font-weight-bold",
        },
        {
          key: "created_date",
          label: "Upload Date",
        },
        {
          key: "file_name",
          label: "File Name",
        },
        // {
        //   key: "quantity_lvl_1",
        //   label: "Quantity L1",
        // },
        {
          key: "source_name",
          label: "Source Type",
          _classes: "font-weight-bold",
        },
        {
          key: "supplier_name",
          label: "Supplier Name",
        },
        {
          key: "status_desc",
          label: "Status",
          _classes: "font-weight-bold",
        },
        {
          key: "action",
          label: "Action",
          // _style: "width:20%",
        },
      ],
    };
  },
  methods: {
    initial_required() {
      let data = { mfgDate: { error: false, message: "Mfg date is required" } };
      return data;
    },
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      $axiosMertrack
        .get(`/v3/transaction/upload-xml?${param}&raw=true`)
        .then((res) => {
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
      exportData({ param: this.filter, exportType: type });
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
    addNew() {
      this.$router.push({
        path: `upload_xml/create`,
      });
    },
    detailUpload(item) {
      this.$router.push({
        path: `upload_xml/read/${item.id}`,
      });
    },
    inputMfgHet(item) {
      // this.required = this.initial_required();
      this.MfgPostfix.item = item;
      this.MfgPostfix.id = item.id;
      this.MfgPostfix.mfg_date = new Date();
      this.MfgPostfix.het = "";
      this.warningModal = true;
    },

    getDifferentDays(date) {
      date = moment(new Date(date), "YYYY-MM-DD");
      var date_now = moment(new Date(), "YYYY-MM-DD");
      let sisa = Math.ceil(moment.duration(date.diff(date_now)).asDays());
      return sisa;
    },

    sendMfgHet() {
      if (this.MfgPostfix.mfg_date) {
        let sisa = this.getDifferentDays(this.MfgPostfix.mfg_date);
        if (sisa > 0) {
          // this.$toast.open({
          //   message: "Mfg Date cannot be grater than today's date.",
          //   type: "error",
          //   dissmissible: true,
          //   position: "top-right",
          //   duration: 5000,
          // });
          return;
        }
      }
      let message = `You are about to submit the Mfg Date information of this Upload XML data. Once submitted, the Mfg Date information cannot be modified. Would you like to continue?`;
      if (confirm(message)) {
        $axiosMertrack
          .post("/v3/transaction/upload-xml", this.MfgPostfix)
          .then((result) => {
            this.items = [];
            this.loadData();
            this.$toast.open({
              message: result.data.error
                ? result.data.message
                : "Data has been saved succesfully",
              type: result.data.error ? "error" : "success",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
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
        this.warningModal = false;
        this.required = this.initial_required();
      }
    },

    handleCancel() {
      let body = {
        id: this.cancelProperty.id,
        approved: false,
        reason: this.cancelProperty.reason,
      };
      $axiosMertrack
        .post(`/v3/transaction/upload-xml/process`, body)
        .then((result) => {
          this.loadData();
          this.$toast.open({
            message: result.data.error
              ? result.data.message
              : "Transaction has been canceled succesfully",
            type: result.data.error ? "error" : "success",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
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
      this.cancelProperty.id = null;
      this.cancelProperty.reason = "";
      this.cancelProperty.modal = false;
    },

    modalCancel(item) {
      this.cancelProperty.id = item.id;
      this.cancelProperty.modal = true;
      return;
    },
    formatDate(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
  },
  computed: {
    upload() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>
