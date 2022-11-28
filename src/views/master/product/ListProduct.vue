<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader id="card-header">
          <ButtonPermission :permission="'create'" @click="addNew()" />
          <h5>Product</h5>
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
          <HeaderFilterDefault
            :filter="['All', 'Product Category']"
            status_code="mst_product"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <CRow id="card-header">
            <CCol sm="12" md="12" lg="12" xl="12">
              <CDataTable
                hover
                striped
                sorter
                border
                :items="productArticles"
                :fields="fields"
                style="font-size: 12px"
              >
                <template #action="{ item, index }">
                  <td>
                    <ButtonPermission
                      :permission="'delete'"
                      @click="deleteRow(item, index)"
                    />
                    <ButtonPermission
                      :permission="'update'"
                      @click="rowUpdate(item, index)"
                    />
                    <ButtonPermission
                      :permission="'read'"
                      @click="rowRead(item, index)"
                    />
                  </td>
                </template>
              </CDataTable>
            </CCol>
          </CRow>
          <template id="card-header">
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
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import { exportData } from "../../../utils";
import { calculatePagination } from "../../../utils";

export default {
  name: "ListProduct",

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
        ApiName: "ProductList",
        StartDate: "",
        EndDate: "",
      },
      items: [],
      fields: [
        {
          key: "itemNo",
          label: "Item No",
          sorter: false,
        },
        {
          key: "name",
          label: "Product Name",
          _classes: "font-weight-bold",
        },
        {
          key: "gtin",
          label: "L1 GTIN",
        },
        {
          key: "nie",
          label: "NIE",
        },
        // {
        //   key: "size",
        // },
        {
          key: "mst_product_category_name",
          label: "Category",
        },
        {
          key: "packagingl2_name",
          label: "L2 Pkg",
        },
        {
          key: "qty_packagingl2",
          label: "L2 Qty",
        },
        {
          key: "product_type",
          label: "Product Type",
          sorter: false,
          filter: false,
        },
        {
          key: "status",
          label: "Status",
          _classes: "font-weight-bold",
        },
        {
          key: "show_status",
          label: "Show",
          _classes: "font-weight-bold",
        },
        {
          key: "action",
          label: "Action",
          _style: "width:15%",
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      $axiosMertrack.get(`/general/web?${param}`).then((res) => {
        this.items = res.data.data;
        this.filter = calculatePagination({
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
    rowUpdate(item) {
      this.$router.push({
        path: `product/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `product/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `product/create`,
      });
    },
    deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = {
          ApiName: "DeleteProduct",
          Params: {
            id: item.id,
          },
        };
        $axiosMertrack
          .post("/general/web", param)
          .then((result) => {
            this.$isLoading(false);
            this.loadData();
            this.$toast.open({
              message: result.data.error
                ? `${result.data.message}`
                : "Data has been deleted succesfully",
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
      }
    },
  },
  computed: {
    productArticles() {
      return this.items.map((item) => {
        return {
          ...item,
          show_status: item.show_status ? "Yes" : "No",
          itemNo: item.no,
          product_type: item.product_type == 0 ? "Serial" : "Non-Serial",
          categoryName: item.category ? item.category.name : "",
          packagingL1Name: item.packagingL1 ? item.packagingL1.name : "",
          gtin: item.gtin ? item.gtin : "",
        };
      });
    },
  },
};
</script>
