<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Role</h5>
          <!-- <ButtonPermission :permission="'create'" @click="addNew()" /> -->
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
            :items="roles"
            :fields="fields"
            class="text-left"
            style="font-size: 12px"
          >
            <template #action="{ item, index }">
              <td>
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
          <template id="card-header">
            <CPagination
              :activePage.sync="filter.page"
              :pages="filter.totalPages"
              size="sm"
              align="center"
              @update:activePage="pageChange"
            />
          </template>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import { exportData, calculatePagination } from "../../../utils";

export default {
  name: "ListRole",

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
        ApiName: "RoleList",
        StartDate: "",
        EndDate: "",
      },
      items: [],
      fields: [
        { key: "section_name", label: "Section" },
        {
          key: "department_name",
          label: "Department",
        },
        { key: "status", _classes: "font-weight-bold" },
        {
          key: "action",
          label: "Action",
          _style: "width:12%",
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
        path: `role/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `role/read/${item.id}`,
      });
    },
  },
  computed: {
    roles() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>
