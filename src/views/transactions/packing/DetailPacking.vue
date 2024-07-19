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
                          v-model="repack.id"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Trx Date</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="repack.created_date"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Created By</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="repack.created_full_name"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Remark</td>
                      <td>
                        <textarea
                          class="form-control"
                          readonly
                          v-model="repack.remark"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Warehouse</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="repack.warehouse_name"
                        />
                      </td>
                    </tr>
                  </table>
                </CCol>
                <CCol md="6">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td>Packaging Level</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="repack.packaging_level"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Packaging Name</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="repack.packaging_name"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px" v-for="index in 1" :key="index">
                      <td
                        style="width: 40%"
                        v-if="repack[`quantity_lvl_${index}`] > 0"
                      >
                        {{ 'L' + index }} Quantity
                      </td>
                      <td
                        style="width: 60%"
                        v-if="repack[`quantity_lvl_${index}`] > 0"
                      >
                        <input
                          class="form-control"
                          readonly
                          v-model="repack[`quantity_lvl_${index}`]"
                        />
                      </td>
                    </tr>
                  </table>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="12" md="12" lg="12">
                  <!-- <ButtonPermission
                    v-if="can_print_all == true"
                    :permission="'print'"
                    :buttonProperty="print_buttonProperty"
                    @click="printAllV3()"
                  /> -->
                  &nbsp;

                  <ButtonPermission
                    v-if="can_print_all == true"
                    :permission="'print'"
                    :buttonProperty="print_buttonProperty2"
                    @click="printAllV3('zpl_mode')"
                  />
                </CCol>
              </CRow>

              <CDataTable
                tableFilter
                hover
                striped
                sorter
                border
                :items="detailRepack"
                :fields="fieldItem"
                class="text-left"
                style="font-size: 12px"
              >
                <template #action="{ item, index }">
                  <td>
                    <ButtonPermission
                      :buttonProperty="btn_printProp"
                      :permission="'print'"
                      @click="selected_data = item"
                    />
                    &nbsp;
                    <ButtonPermission
                      :buttonProperty="btn_showBarcode"
                      :permission="'print'"
                      @click="selected_barcode = item"
                    />
                  </td>
                </template>
              </CDataTable>
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
          <ButtonPermission
            exportType="pdf"
            :permission="'print'"
            @click="handleClickExport('pdf')"
          />
        </CCardFooter>
      </CCard>
    </CCol>
    <ModalBarcodeGenerator
      :property="selected_barcode"
      v-on:onClose="selected_barcode = {}"
    />
    <ModalPrintLabelV3
      :item="selected_data"
      v-on:onClose="selected_data = {}"
    />
  </CRow>
</template>

<script>
import $axiosMertrack from '../../../apiMertrack';
import { exportDataV3, getUserId, printLabelV3 } from '../../../utils';

export default {
  name: 'DetailPacking',
  mounted() {
    this.action = this.$route.params.type == 'read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      let param = { id: this.$route.params.id, raw: true };
      let url = `/v3/transaction/packing?${new URLSearchParams(param)}`;
      $axiosMertrack.get(url).then((response) => {
        let data = response.data.data[0];
        this.repack = data;
        if (data.items.length > 0) {
          this.items = data.items;
          for (const it of data.items) {
            if (!it.trx_pack_epc_key) {
              this.can_print_all = false;
            }
          }
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
      user_id: getUserId(),
      action: '',
      print_buttonProperty: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'print',
        text: 'Print All',
        tooltip: 'Print all label',
      },
      print_buttonProperty2: {
        size: 'sm',
        class: 'float-right',
        color: 'warning',
        icon: 'print',
        text: 'Print All',
        tooltip: 'Print All Label',
      },
      btn_printProp: {
        size: 'sm',
        class: 'float-right',
        color: 'warning',
        icon: 'print',
        text: '',
        tooltip: 'Print Label',
      },
      btn_showBarcode: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'barcode',
        text: '',
        tooltip: 'Show Barcode',
      },
      selected_barcode: {},
      selected_data: {},
      can_print_all: true,
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
      repack: {
        id: '',
        warehouse: '',
        remark: '',
        reason: '',
        date: '',
        serialNo: '',
      },
      pages: null,
      page: null,
      totalPages: 0,
      size: null,
      keyword: '',
      search: false,
      items: [],
      darkModal: false,
      fieldItem: [
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
          sorter: false,
          filter: false,
        },
        {
          key: 'expired_date',
          label: 'Exp Date',
          sorter: false,
          filter: false,
        },
        {
          key: 'nie',
          label: 'NIE',
        },
        {
          key: 'trx_pack_epc_key',
          label: 'EPC Key',
        },
        {
          key: 'trx_pack_serial',
          label: 'Packing SN',
        },
        {
          key: 'packaging_level',
          label: 'Child Pkg Level',
        },
        {
          key: 'packaging_name',
          label: 'Child Pkg Name',
        },
        {
          key: 'quantity',
          label: 'L1 Qty',
        },
        {
          key: 'action',
          _style: 'width:10%',
          label: 'Print',
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
    cancel() {
      this.$router.back();
    },
    printAllV3(zpl_mode = false) {
      let _body = [];
      for (const it of this.items) {
        let itm = {
          serial: it.trx_pack_serial,
          epc_key: it.trx_pack_epc_key,
        };
        _body.push(itm);
      }
      if (zpl_mode) {
        this.selected_data = { items: _body };
        return;
      }
      $axiosMertrack
        .post(`/v3/helper/print-layout/pdf`, {
          update_count: true,
          validate: true,
          items: _body,
        })
        .then((response) => {
          if (response.data.error) {
            this.$toast.open({
              message: `${response.data.message ?? 'Success validate'}`,
              type: response.data.error ? 'error' : 'success',
              dissmissible: true,
              position: 'top-right',
              duration: 3000,
            });
          } else {
            printLabelV3({
              data: _body,
              link: `${process.env.VUE_APP_URL_API_MERTRACK}/api/v3/helper/print-layout/pdf`,
            });
          }
        });
    },
    printV3(item) {
      let _body = {
        serial: item.trx_pack_serial,
        epc_key: item.trx_pack_epc_key,
        validate: true,
      };
      var _url = new URLSearchParams(_body).toString();
      $axiosMertrack
        .get(`/v3/helper/print-layout/pdf?${_url}`)
        .then((response) => {
          this.$toast.open({
            message: `${response.data.message ?? 'Success validate'}`,
            type: response.data.error ? 'error' : 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 3000,
          });
          if (response.data.error) {
            return;
          }
          let _data = [_body];
          printLabelV3({
            data: _data,
            link: `${process.env.VUE_APP_URL_API_MERTRACK}/api/v3/helper/print-layout/pdf`,
          });
        })
        .catch((error) => {
          this.$toast.open({
            message: `${error}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 3000,
          });
        });
      return;
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: {
          id: this.$route.params.id,
        },
        exportType: type,
        url: '/v3/transaction/packing',
      });
    },
  },
  computed: {
    detailRepack() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>
