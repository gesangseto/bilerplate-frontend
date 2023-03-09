<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission :permission="'create'" @click="addNew()" />
          <h5>Connector Action</h5>
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
              :items="reformat"
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
  name: "ListConnectorAction",
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
          key: "connector_name",
          label: "Connector",
        },
        {
          key: "folder_sftp",
          label: "Folder SFTP",
        },
        {
          key: "folder_backup",
          label: "Folder Archive",
        },
        {
          key: "schedule",
          label: "Time Interval (in minute)",
        },
        {
          key: "value_name",
          label: "Key",
        },
        {
          key: "status",
          label: "Status",
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
        .get(`/v3/connector/connector-action?${param}`)
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
        path: `connector_action/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `connector_action/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `connector_action/create`,
      });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data.\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let _param = { id: item.id };
        $axiosMertrack
          .delete(`v3/connector/connector-action`, { data: _param })
          .then((result) => {
            this.$isLoading(false);
            this.loadData();
            let res = result.data;
            this.$toast.open({
              message: res.error
                ? `${res.message}`
                : "Data has been saved succesfully ",
              type: res.error ? "error" : "success",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
          });
      }
    },
  },
  computed: {
    reformat() {
      return this.items.map((item) => {
        return {
          ...item,
          description: item.description || "",
          folder_sftp: item.folder_sftp || "",
          folder_backup: item.folder_backup || "",
        };
      });
    },
  },
};
</script>
