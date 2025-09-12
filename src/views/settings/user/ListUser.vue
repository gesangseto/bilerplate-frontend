<template>
  <CRow>
    <CCol col="12" xl="12" md="12" sm="12">
      <CCard>
        <CCardHeader _style="padding:10px;">
          <ButtonPermission
            :permission="'create'"
            @click="addNew()"
            :useHref="true"
          />
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <TableDefault
            :totalData="totalData"
            :fields="fields"
            :items="reformatDatas"
            :status_code="'mst_product'"
            :action="['read', 'update', 'delete']"
            v-on:handleDelete="deleteRow($event)"
            v-on:handleUpdate="rowUpdate($event)"
            v-on:handleCopy="addNew($event)"
            v-on:handleReload="loadData($event)"
            :filterAction="customActionFilter"
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { deleteMstUser, getMstUser } from '../../../resource/MstUser';

export default {
  name: 'ListUser',
  mounted() {},

  data() {
    return {
      totalData: 0,
      items: [],
      fields: [
        { key: 'id', label: 'ID', _classes: 'font-weight-bold' },
        { key: 'employee_id', label: 'Global ID' },
        { key: 'username', label: 'Username' },
        { key: 'full_name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'tlp', label: 'Phone Number' },
        { key: 'department_name', label: 'Department' },
        { key: 'section_name', label: 'Section' },
        // { key: "mst_position_name", label: "Level" },
        { key: 'status', label: 'Status', _classes: 'font-weight-bold' },
        {
          key: 'action',
          label: 'Action',
          _classes: 'font-weight-bold',
          _style: 'width:15%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  watch: {
    $route: {
      deep: true,
      handler(route) {
        let query = route.query;
        this.loadData({ ...query });
      },
    },
  },
  methods: {
    customActionFilter(item) {
      let action = ['create', 'read'];
      if (!item.is_sys) {
        action.push('update');
        action.push('delete');
      }
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getMstUser(filter);
      if (res) {
        this.totalData = res.grand_total;
        this.items = res.data;
      }
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
            : 'Data has been deleted successfully',
          type: _res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!_res.error) this.loadData();
      }
    },
  },
  computed: {
    reformatDatas() {
      return this.items.map((item) => {
        return {
          ...item,
          department_name: item.department_name || '-',
          section_name: item.section_name || '-',
          employee_id: item.employee_id || '',
        };
      });
    },
  },
};
</script>
