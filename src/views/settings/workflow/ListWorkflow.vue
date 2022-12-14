<template>
  <CRow>
    <CCol col="12" xl="12" md="12" sm="12">
      <CCard>
        <CCardHeader _style="padding:10px;">
          <h5>Workflow</h5>
        </CCardHeader>
        <CCardBody>
          <!-- INI BATAS HEADER TABLE -->
          <HeaderFilterDefault
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->

          <CDataTable
            hover
            striped
            sorter
            border
            :items="workflowDetail"
            :fields="fields"
            class="data-table"
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
          <template>
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
import {
  exportData,
  calculatePagination,
  calculatePaginationV3,
} from "../../../utils";

export default {
  name: "ListWorkflow",

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
          key: "_transaction.label",
          label: "Transaction",
          _classes: "font-weight-bold",
        },
        { key: "_approval_1.full_name", label: "Approval 1" },
        { key: "_approval_2.full_name", label: "Approval 2" },
        { key: "_approval_3.full_name", label: "Approval 3" },
        { key: "_approval_4.full_name", label: "Approval 4" },
        {
          key: "action",
          label: "Action",
          _classes: "font-weight-bold",
          _style: "width:12%",
          sorter: false,
          filter: false,
        },
      ],
    };
  },

  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/master/workflow?raw=true&${param}`;
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
      this.$router.push({ path: `workflow/update/${item.id}` });
    },
    rowRead(item) {
      this.$router.push({ path: `workflow/read/${item.id}` });
    },
    addNew() {
      this.$router.push({ path: `workflow/create` });
    },
  },
  computed: {
    workflowDetail() {
      var no = 0;
      return this.items.map((item) => {
        return {
          ...item,
          ["_approval_1.full_name"]: item["_approval_1.full_name"] ?? "-",
          ["_approval_2.full_name"]: item["_approval_2.full_name"] ?? "-",
          ["_approval_3.full_name"]: item["_approval_3.full_name"] ?? "-",
          ["_approval_4.full_name"]: item["_approval_4.full_name"] ?? "-",
          nomor: (no += 1),
        };
      });
    },
  },
};
</script>
