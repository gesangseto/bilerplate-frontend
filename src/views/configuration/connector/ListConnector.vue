<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission :permission="'create'" @click="addNew()" />
          <h5>Connector</h5>
        </CCardHeader>
        <CCardBody>
          <!-- INI BATAS HEADER TABLE -->
          <HeaderFilterDefault
            status_code="mst_customer"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <div class="table-responsive">
            <CDataTable
              hover
              striped
              sorter
              :items="renderList"
              :fields="fields"
              class="data-table"
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
          </div>
          <template>
            <CPagination
              :activePage.sync="filter.page"
              :pages="filter.totalPages"
              size="sm"
              align="center"
              @update:activePage="pageChange"
            />
          </template>
          <!-- <ButtonPermission
            exportType="excel"
            :permission="'print'"
            @click="handleClickExport('xls')"
          />
          <ButtonPermission
            exportType="pdf"
            :permission="'print'"
            @click="handleClickExport('pdf')"
          /> -->
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import { calculatePagination, exportData } from "../../../utils";

export default {
  name: "ListConnector",
  mounted() {
    this.page = 1;
    this.loadData();
  },
  data() {
    return {
      filter: {
        page: 1,
        limit: 10,
        search: "",
        totalPages: 1,
      },
      items: [],
      fields: [
        {
          key: "id",
          label: "ID",
        },
        {
          key: "name",
          label: "Name",
          _classes: "font-weight-bold",
        },
        {
          key: "description",
          label: "Desc",
        },
        {
          key: "connector_method",
          label: "Method",
        },
        {
          key: "connector_port",
          label: "Port",
        },
        {
          key: "connector_path",
          label: "Path",
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
      let param = `${new URLSearchParams(this.filter).toString()}`;
      $axiosMertrack
        .get(`/v3/connector/connector-list?${param}`)
        .then((res) => {
          this.items = res.data.data;
          this.filter = calculatePagination({
            filter: this.filter,
            item: res,
          });
        });
    },
    handleClickFilter(val) {
      val.search = val.searchText;
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
    rowUpdate(item) {
      this.$router.push({
        path: `connector/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `connector/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `connector/create`,
      });
    },
    deleteRow(item) {},
  },
  computed: {
    renderList() {
      return this.items.map((item) => {
        return {
          ...item,
          connector_path: item.connector_path || "",
        };
      });
    },
  },
};
</script>
