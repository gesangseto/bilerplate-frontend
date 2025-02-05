<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [VIEW]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="6">
              <table style="width: 100%">
                <tr style="height: 50px">
                  <td style="width: 40%">ID</td>
                  <td style="width: 60%">
                    <input
                      class="form-control"
                      readonly
                      v-model="formData.id"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td style="width: 40%">Trx Ref ID</td>
                  <td style="width: 60%">
                    <input
                      class="form-control"
                      readonly
                      v-model="formData.trx_ref_id"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Trx Date</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="formData.created_date"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Created By</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="formData['created_full_name']"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Process Order No</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="formData.process_order_erp"
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
                  <td>Het</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="formData.het"
                    />
                  </td>
                </tr>

                <tr style="height: 50px">
                  <td>Mfg Date</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="formData.mfg_date"
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
            <CCol md="6">
              <table style="width: 100%">
                <tr style="height: 50px">
                  <td style="width: 40%">Production Report</td>
                  <td style="width: 60%">
                    <ButtonDownloadFilePath :file_path="formData.file_path" />
                  </td>
                </tr>
                <tr>
                  <td>Remark</td>
                  <td>
                    <textarea
                      class="form-control"
                      readonly
                      v-model="formData.remark"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="formData.status_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="formData.modified_full_name">
                  <td>Last Action By</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="formData.modified_full_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="formData.modified_full_name">
                  <td>Last Action Date</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="formData.modified_date"
                    />
                  </td>
                </tr>

                <tr style="height: 50px" v-for="index in 1" :key="index">
                  <td
                    style="width: 40%"
                    v-if="formData[`quantity_lvl_${index}`] > 0"
                  >
                    {{ 'L' + index }} Quantity
                  </td>
                  <td
                    style="width: 60%"
                    v-if="formData[`quantity_lvl_${index}`] > 0"
                  >
                    <input
                      class="form-control"
                      readonly
                      v-model="formData[`quantity_lvl_${index}`]"
                    />
                  </td>
                </tr></table
            ></CCol>
          </CRow>
          <CDataTable
            tableFilter
            hover
            striped
            sorter
            border
            :pagination="true"
            :items-per-page="10"
            :items="detailItems"
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
        </CCardBody>
        <CCardFooter>
          <ButtonBack />
          <ButtonPermission
            exportType="excel"
            :permission="'print'"
            @click="handleClickExport('xls')"
          />
          <ButtonPopover
            permission="print"
            exportType="pdf"
            :popover_list="['Summary', 'Details', 'Weighing']"
            @handleClick="handleExportPdf($event)"
            mt="-10"
          />
        </CCardFooter>
      </CCard>
    </CCol>
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
import { exportDataV3 } from '../../../utils';

export default {
  name: 'DetailInbound',
  mounted() {
    if (this.$route.params.id !== undefined) {
      let param = `id=${this.$route.params.id}`;
      $axiosMertrack
        .get(`/v3/transaction/pre-inbound?${param}`)
        .then((response) => {
          let data = response.data.data[0];
          this.formData = data;
          this.items = data.items;
        });
    }
  },
  data() {
    return {
      detail_item: {},
      datas: [],
      viewModal: false,
      popupButtonPrintPdf: false,
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
      formData: {},
      pages: null,
      page: null,
      totalPages: 0,
      size: null,
      keyword: '',
      search: false,
      items: [],
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
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page);
        }
      },
    },
  },
  methods: {
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
      this.view.productId = '';
      this.view.productName = '';
      this.view.batch = '';
      this.view.gtin = '';
      this.view.nie = '';
      this.view.expiredDate = '';
      this.datas = [];
      this.viewModal = false;
    },
    cancel() {
      this.$router.back();
    },
    handleExportPdf(type) {
      if (type == 'Weighing') type = 'timbangan';
      if (type == 'Details') type = 'detail';
      if (type == 'Summary') type = 'summary';
      exportDataV3({
        alert: true,
        param: {
          id: this.$route.params.id,
          ptintType: type,
        },
        exportType: 'pdf',
        url: '/v4/transaction/pre-inbound',
      });
    },
    handleClickExport(type) {
      if (type == 'pdf') {
        this.popupButtonPrintPdf = true;
        return;
      }
      exportDataV3({
        alert: true,
        param: {
          id: this.$route.params.id,
        },
        exportType: type,
        url: '/v4/transaction/pre-inbound',
      });
    },
  },
  computed: {
    detailItems() {
      return this.items.map((item) => {
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
          gtin_cp:
            item.epc_type == 'sscc' ? item.company_prefix : item.gtin_sscc,
        };
      });
    },
  },
};
</script>
