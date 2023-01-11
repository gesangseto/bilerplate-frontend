<template>
  <CRow>
    <CCol col="12" xl="12" md="12" sm="12">
      <CCard>
        <CCardHeader _style="padding:10px;">
          <ButtonPermission :permission="'create'" @click="addNew()" />
          <h5>User</h5>
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
            :items="usersDetail"
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
import { deleteMstUser, getMstUser } from "../../../resource/MstUser";
import { exportData, calculatePaginationV3 } from "../../../utils";

export default {
  name: "ListUser",
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
        ApiName: "UserList",
        StartDate: "",
        EndDate: "",
      },
      items: [],
      fields: [
        { key: "username", label: "Username" },
        { key: "full_name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "tlp", label: "Phone Number" },
        { key: "department_name", label: "Department" },
        { key: "section_name", label: "Section" },
        // { key: "mst_position_name", label: "Level" },
        { key: "status", label: "Status", _classes: "font-weight-bold" },
        {
          key: "action",
          label: "Action",
          _classes: "font-weight-bold",
          _style: "width:15%",
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    async loadData() {
      let _res = await getMstUser(this.filter);
      if (_res) {
        this.items = _res.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: _res,
        });
      }
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
        path: `user/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `user/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({ path: `user/create` });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.full_name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id };
        let _res = await deleteMstUser(param);
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
  computed: {
    usersDetail() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>
