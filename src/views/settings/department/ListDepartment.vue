<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader _style="padding:10px;">
          <ButtonPermission
            v-if="can_create"
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
import {
  deleteMstDepartment,
  getMstDepartment,
} from '../../../resource/MstDepartment';
import { getLimitation } from '../../../utils';

export default {
  name: 'ListDepartment',

  mounted() {},
  data() {
    return {
      can_create: true,
      totalData: 0,
      items: [],
      fields: [
        { key: 'id', label: 'ID', _classes: 'font-weight-bold' },
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'status', _classes: 'font-weight-bold' },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:15%',
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
    protectCreateData(_res) {
      let max = getLimitation('total_department');
      let count = _res.grand_total - _res.grand_total_is_sys;
      if (max) {
        if (max <= count) {
          this.can_create = false;
        }
      }
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getMstDepartment(filter);
      if (res) {
        this.totalData = res.grand_total;
        this.items = res.data;
      }
      this.protectCreateData(res);
    },
    rowUpdate(item) {
      this.$router.push({
        path: `department/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `department/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({ path: `department/create` });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id };
        let _res = await deleteMstDepartment(param);
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
        };
      });
    },
  },
};
</script>
