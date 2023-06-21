<template id="print-hide">
  <CRow id="print-hide">
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader id="print-hide">
          <h5>Aggregation</h5>
        </CCardHeader>
        <CCardBody>
          <CRow id="print-hide">
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
                status_code="trx_aggregation"
                v-on:handleClickFilter="handleClickFilter($event)"
                v-on:handleChangeSize="handleChangeSize($event)"
              />
              <!-- INI BATAS HEADER TABLE -->
              <CDataTable
                hover
                striped
                sorter
                border
                :items="aggregation"
                :fields="fields"
                class="text-left"
                style="font-size: 12px"
              >
                <template #action="{ item, index }">
                  <td>
                    <ButtonPermission
                      :permission="'read'"
                      @click="rowClicked(item, index)"
                    />
                    &nbsp;
                    <ButtonPermission
                      :buttonProperty="btn_printProp"
                      :permission="'print'"
                      @click="printV3(item, index)"
                    />
                    &nbsp;
                    <ButtonPermission
                      v-if="user_id == 0"
                      :buttonProperty="btn_printProp2"
                      :permission="'print'"
                      @click="selected_data = item"
                    />
                  </td>
                </template>
              </CDataTable>
            </CCol>
          </CRow>
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
    <ModalPrintLabelV3
      :item="selected_data"
      v-on:onClose="selected_data = {}"
    />
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import {
  printLabelV3,
  calculatePaginationV3,
  exportDataV3,
  getUserId,
} from "../../../utils";
import { dateFilter } from "../../../constants";
export default {
  name: "ListAggregation",
  mounted() {
    this.page = 1;
    this.loadData();
  },
  data() {
    return {
      user_id: getUserId(),
      filter: {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalData: 0,
        StartDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].start,
        EndDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].end,
      },
      btn_printProp: {
        size: "sm",
        class: "float-right",
        color: "secondary",
        icon: "print",
        text: "",
        tooltip: "Print this label",
      },
      btn_printProp2: {
        size: "sm",
        class: "float-right",
        color: "danger",
        icon: "print",
        text: "",
        tooltip: "Print V2",
      },
      selected_data: {},
      items: [],
      fields: [
        {
          key: "id",
          label: "ID",
          _classes: "font-weight-bold",
        },
        {
          key: "created_date",
          label: "Trx Date",
        },
        {
          key: "product_name_batch",
          label: "Product Name [Batch No]",
        },
        {
          key: "_warehouse.name",
          label: "Warehouse",
        },
        {
          key: "gtin_cp",
          label: "GTIN / CP",
        },
        {
          key: "serial",
          label: "Aggregation SN",
        },
        {
          key: "quantity_lvl_1",
          label: "Qty L1",
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
          key: "_created.full_name",
          label: "Created By",
        },
        {
          key: "action",
          label: "Action",
          _style: "width:10%",
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/transaction/aggregation?raw=true&${param}`;
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
        url: "/v3/transaction/aggregation",
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
      this.$router.push({ path: `aggregation/read/${item.id}` });
    },
    addNew() {
      this.$router.push({ path: `aggregation/create` });
    },
    printV3(item) {
      let _body = {
        id: item.stock_serial_id,
        serial: item.serial_no,
        gtin_sscc: item.gtin_sscc,
        validate: true,
      };
      var _url = new URLSearchParams(_body).toString();
      $axiosMertrack
        .get(`/v3/helper/print-layout/pdf?${_url}`)
        .then((response) => {
          this.$toast.open({
            message: `${response.data.message ?? "Success validate"}`,
            type: response.data.error ? "error" : "success",
            dissmissible: true,
            position: "top-right",
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
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 3000,
          });
        });
      return;
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
  },
  computed: {
    aggregation() {
      return this.items.map((item) => {
        return {
          ...item,
          ["_created.full_name"]: item["_created.full_name"] || "-",
          gtin_cp:
            item.epc_type == "sscc" ? item.company_prefix : item.gtin_sscc,
        };
      });
    },
  },
};
</script>
<style scoped>
#printMe {
  visibility: hidden;
  position: absolute;
}
@media print {
  #printMe {
    visibility: visible;
    position: absolute;
    z-index: 9999;
  }
  #print-hide {
    visibility: hidden;
    position: absolute;
  }
  header {
    visibility: hidden;
    position: absolute;
  }
}
</style>
