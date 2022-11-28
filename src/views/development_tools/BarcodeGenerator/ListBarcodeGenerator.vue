<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Barcode Generator</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <HeaderFilterTransaction
                :filter="[
                  'All',
                  'Product',
                  'Supplier',
                  'Warehouse',
                  'Customer',
                ]"
                :order="['All', 'Product', 'Supplier', 'Warehouse', 'Customer']"
                status_code="product_stock_serial"
                :removeTrxDate="true"
                v-on:handleClickFilter="handleClickFilter($event)"
                v-on:handleChangeSize="handleChangeSize($event)"
              />
              <!-- INI BATAS HEADER TABLE -->
              <CDataTable
                hover
                striped
                sorter
                border
                :items="reformat_datas"
                :fields="fields"
                class="text-left"
                style="font-size: 8pt"
              >
                <template #action="{ item, index }">
                  <td>
                    <ButtonPermission
                      v-if="item.serial !== '0000000000'"
                      :permission="'read'"
                      @click="rowClicked(item, index)"
                    />
                  </td>
                </template>
              </CDataTable>
              <template>
                <CPagination
                  :activePage.sync="filter.page"
                  :pages="totalPages"
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
    <DetailBarcodeGenerator :property="selected_data" />
  </CRow>
</template>

<script>
import DetailBarcodeGenerator from "../../component";
import $axiosMertrack from "../../../apiMertrack";
import { exportData, toTitleCase } from "../../../utils";
import { dateFilter } from "../../../constants";
export default {
  name: "ListBarcodeGenerator",
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
        ApiName: "GetWeb_GenerateBarcodeTools",
        StartDate: dateFilter.last_3_month.start,
        EndDate: dateFilter.last_3_month.end,
      },
      totalPages: 0,
      datas: [],
      selected_data: { modal: false, item: {} },
      fields: [
        {
          key: "no",
          label: "Item No",
          _classes: "font-weight-bold",
        },
        {
          key: "product_name",
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
          key: "name_packaging",
          label: "Pkg Name",
        },
        {
          key: "supplier_name",
          label: "Supplier Name",
        },
        {
          key: "warehouse_name",
          label: "Warehouse",
        },
        {
          key: "customer_name",
          label: "Customer",
        },
        {
          key: "quantity",
          label: "L1 Qty",
        },
        {
          key: "status_desc",
          label: "Status",
        },
        {
          key: "action",
          label: "Action",
          _style: "width:10%",
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
    loadData() {
      delete this.filter["StartDate"];
      delete this.filter["EndDate"];
      let param = `${new URLSearchParams(this.filter).toString()}`;
      $axiosMertrack.get(`/general/web?${param}`).then((res) => {
        this.datas = res.data.data;
        this.totalPages = Math.ceil(res.data.total / this.filter.limit) ?? 0;
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
      this.page = 1;
      this.loadData();
    },
    pageSizeChange($event) {
      this.size = $event;
      this.page = 1;
      this.loadData();
    },
    rowClicked(item) {
      this.selected_data.modal = true;
      this.selected_data.item = item;
      // this.$router.push({
      //   path: `inbound/read/${item.id}`,
      // });
    },
    addNew() {
      this.$router.push({
        path: `add-inbound`,
      });
    },
    deleteRow(item, index) {
      this.dataInbound.splice(index, 1);
    },
  },
  computed: {
    reformat_datas() {
      return this.datas.map((item) => {
        return {
          ...item,
          supplier_name: item.supplier_name ?? "",
          warehouse_name: item.warehouse_name ?? "",
          customer_name: item.customer_name ?? "",
          packaging_name: item[`name_packaging_l${item.packaging_level}`],
          gtin_cp:
            item.epc_type == "sscc" ? item.company_prefix : item.gtin_sscc,
        };
      });
    },
  },
};
</script>
