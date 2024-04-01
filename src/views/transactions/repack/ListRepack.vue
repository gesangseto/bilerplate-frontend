<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Re-Packing</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
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
                :filter="['All', 'id', 'product_id', 'warehouse_id']"
                status_code="trx_un_pack"
                v-on:handleClickFilter="handleClickFilter($event)"
                v-on:handleChangeSize="handleChangeSize($event)"
              />
              <!-- INI BATAS HEADER TABLE -->
              <CDataTable
                hover
                striped
                sorter
                border
                :items="unpack"
                :fields="fields"
                class="text-left"
                style="font-size: 12px"
              >
                <template #action="{ item, index }">
                  <td>
                    <ButtonPermission
                      :id="item.id"
                      :useHref="true"
                      :permission="'read'"
                      @click="rowClicked(item, index)"
                    />
                    &nbsp;
                    <ButtonPermission
                      :buttonProperty="{
                        ...btn_printProp,
                        color: item.allow_print ? 'warning' : 'danger',
                      }"
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
import {
  printLabelV3,
  calculatePaginationV3,
  exportDataV3,
} from '../../../utils';
import { dateFilter } from '../../../constants';
export default {
  name: 'ListRepack',
  mounted() {
    this.page = 1;
    this.loadData();
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
      btn_printProp: {
        size: 'sm',
        class: 'float-right',
        color: 'secondary',
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
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
          _classes: 'font-weight-bold',
        },
        {
          key: 'created_date',
          label: 'Trx Date',
        },
        {
          key: 'product_name_batch',
          label: 'Product Name [Batch No]',
        },
        {
          key: '_warehouse.name',
          label: 'Warehouse',
        },
        {
          key: 'add_item_desc',
          label: 'Process',
          _classes: 'font-weight-bold',
        },
        {
          key: 'epc_key',
          label: 'EPC Key',
        },
        {
          key: 'serial',
          label: 'Packing SN',
        },
        {
          key: 'quantity_lvl_1',
          label: 'L1 Qty',
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
          key: '_created.full_name',
          label: 'Created By',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:15%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/transaction/re-packing?raw=true&${param}`;
      $axiosMertrack.get(url).then((res) => {
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
      exportDataV3({
        alert: true,
        param: this.filter,
        exportType: type,
        url: '/v3/transaction/re-packing',
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
    rowClicked(item) {
      this.$router.push({ path: `re-packing/read/${item.id}` });
    },
    // printNew(item) {
    //   let items = [item];
    //   $axios2
    //     .post("reprint/validate/v2", items)
    //     .then((response) => {
    //       this.$toast.open({
    //         message: `${response.data.message}`,
    //         type: response.data.status == 0 ? "error" : "success",
    //         dissmissible: true,
    //         position: "top-right",
    //         duration: 3000,
    //       });
    //       if (response.data.status == 0) {
    //         return;
    //       }
    //       let _data = response.data.data;
    //       printLabel({ data: _data.items, link: _data.link });
    //     })
    //     .catch((error) => {
    //       this.$toast.open({
    //         message: `${error}`,
    //         type: "error",
    //         dissmissible: true,
    //         position: "top-right",
    //         duration: 3000,
    //       });
    //     });
    //   return;
    // },
    printV3(item) {
      let _body = {
        serial: item.serial,
        gtin_sscc: item.gtin_sscc,
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
  },
  computed: {
    unpack() {
      return this.items.map((item) => {
        // END OF EDITED BY GESANG
        return {
          ...item,
          ['_created.full_name']: item['_created.full_name'] || '-',
        };
      });
    },
  },
};
</script>
