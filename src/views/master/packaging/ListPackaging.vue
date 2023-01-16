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
import {
  deleteMstPackaging,
  getMstPackaging,
} from "../../../resource/MstPackaging";
import { calculatePaginationV3, exportDataV3 } from "../../../utils";

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
    async loadData() {
      let res = await getMstPackaging(this.filter);
      if (!res.error) {
        this.items = res.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: res,
        });
      }
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
    async deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id };
        let _res = await deleteMstPackaging(param);
        this.$isLoading(false);
        this.$toast.open({
          message: _res.error
            ? `${_res.message}`
            : "Data has been deleted succesfully",
          type: _res.error ? "error" : "success",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        if (!_res.error) this.loadData();
      }
    },
  },
};
</script>
