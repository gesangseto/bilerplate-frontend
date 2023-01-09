<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission :permission="'create'" @click="addNew()" />
          <h5>Packaging</h5>
        </CCardHeader>
        <CCardBody>
          <!-- INI BATAS HEADER TABLE -->
          <HeaderFilterDefault
            status_code="mst_customer"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <CDataTable
            hover
            striped
            sorter
            border
            :items="items"
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
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import {
  calculatePaginationV3,
  exportData,
  exportDataV3,
} from "../../../utils";

export default {
  name: "ListPackaging",

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
        ApiName: "PackagingList",
        StartDate: "",
        EndDate: "",
      },
      items: [],
      fields: [
        {
          key: "name",
          label: "Name",
          _classes: "font-weight-bold",
          _style: "width:20%",
        },
        { key: "description", label: "Description" },
        {
          key: "status",
          _style: "width:7%",
          _classes: "font-weight-bold",
        },
        {
          key: "action",
          label: "Action",
          _classes: "font-weight-bold",
          _style: "width:17%",
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/master/packaging?${param}`;
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
        param: this.filter,
        exportType: type,
        url: "/v3/master/packaging",
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
    rowUpdate(item) {
      this.$router.push({
        path: `packaging/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `packaging/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({ path: `packaging/create` });
    },
    deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        let param = {
          id: item.id,
        };
        this.$isLoading(true);
        let url = `/v3/master/packaging`;
        $axiosMertrack
          .delete(url, { data: param })
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
            this.loadData();
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
};
</script>
