<template>
  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-12">
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
                    <input class="form-control" readonly v-model="stock.id" />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Trx Date</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="stock.created_date"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Created By</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="stock.created_full_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Warehouse</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="stock.warehouse_name"
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
                      v-model="stock.status_desc"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="stock.status != 0">
                  <td>Last Action By</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="stock.modified_full_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="stock.status != 0">
                  <td>Last Action Date</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="stock.modified_date"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="stock.status == 1">
                  <td>Remark</td>
                  <td>
                    <textarea
                      class="form-control"
                      readonly
                      v-model="stock.remark"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="stock.status == 2">
                  <td>Reason</td>
                  <td>
                    <textarea
                      class="form-control"
                      readonly
                      v-model="stock.reason"
                    />
                  </td>
                </tr>
              </table>
            </CCol>
          </CRow>
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="table-responsive mt-3">
                <CDataTable
                  tableFilter
                  hover
                  striped
                  sorter
                  border
                  :pagination="true"
                  :items-per-page="10"
                  :items="detailStock"
                  :fields="fields"
                  class="text-left"
                  style="font-size: 12px"
                >
                  <template #is_same="{ item }">
                    <td>
                      <CButton
                        class="my-2 mx-2"
                        :color="item.is_same == '=' ? 'success' : 'danger'"
                        size="sm"
                        type="button"
                      >
                        {{ item.is_same }}
                      </CButton>
                    </td>
                  </template>
                </CDataTable>
              </div>
            </div>
          </div>
        </CCardBody>
        <CCardFooter>
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
    </div>
    <!-- Modal Detail Barang Dipilih  -->
    <CModal title="Detail" color="warning" :show.sync="viewModal" size="lg">
      <CRow>
        <CCol sm="12" md="12" lg="12" xl="12">
          <CRow>
            <CCol sm="5" md="5" lg="5">
              <CInput
                horizontal
                v-model="view.productId"
                label="Product Id"
                readonly
              >
              </CInput>
            </CCol>
            <CCol sm="2" md="2" lg="2"></CCol>
            <CCol sm="5" md="5" lg="5">
              <CInput horizontal v-model="view.gtin" label="GTIN" readonly>
              </CInput>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="5" md="5" lg="5">
              <CInput
                horizontal
                v-model="view.productName"
                label="Product Name"
                readonly
              >
              </CInput>
            </CCol>
            <CCol sm="2" md="2" lg="2"></CCol>
            <CCol sm="5" md="5" lg="5">
              <CInput horizontal v-model="view.nie" label="NIE" readonly>
              </CInput>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="5" md="5" lg="5">
              <CInput horizontal v-model="view.batch" label="Batch No" readonly>
              </CInput>
            </CCol>
            <CCol sm="2" md="2" lg="2"></CCol>
            <CCol sm="5" md="5" lg="5">
              <CInput
                horizontal
                v-model="view.expiredDate"
                label="Expired Date"
                readonly
              >
              </CInput>
            </CCol>
          </CRow>
          <div class="form-group row">
            <div class="col-lg-1 col-md-1 col-sm-1">
              <label>Serial</label>
            </div>
            <div class="col-lg-10 col-md-10 col-sm-10">
              <select multiple class="form-control">
                <option v-for="item in datas" :key="item">
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
        </CCol>
      </CRow>
      <template #footer>
        <CButton size="sm" color="danger" type="button" @click="closeModal()">
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import $axiosMertrack from '../../../apiMertrack';
import { exportDataV3 } from '../../../utils';
export default {
  mounted() {
    this.action = this.$route.params.type == 'read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      let url = `/v3/transaction/stock-opname?id=${this.$route.params.id}`;
      $axiosMertrack.get(url).then((response) => {
        let data = response.data.data[0];
        this.stock = data;
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
    }
  },
  data() {
    return {
      action: '',
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
      items: [],
      fields: [
        {
          key: 'product_no',
          label: 'Item No',
        },
        {
          key: 'product_name',
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
          key: 'product_nie',
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
          key: 'actual_quantity',
          label: 'L1 Qty Actual',
        },
        {
          key: 'is_same',
          label: '',
        },
        // {
        //   key: "action",
        //   label: "",
        //   filter: false,
        //   sorter: false,
        // },
      ],
      stock: {
        id: '',
        warehouse: '',
        storage: '',
        createdDate: '',
      },
      stockOpnameDate: '',
    };
  },
  computed: {
    detailStock() {
      return this.items.map((item) => {
        let operator = '=';
        if (item.quantity < item.actual_quantity) {
          operator = '+';
        } else if (item.quantity > item.actual_quantity) {
          operator = '-';
        }
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
          is_same: operator,
          actual_quantity: item.actual_quantity ?? 0,
        };
      });
    },
  },
  methods: {
    cancel() {
      this.$router.back();
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
        url: '/v3/transaction/stock-opname',
      });
    },
  },
};
</script>
