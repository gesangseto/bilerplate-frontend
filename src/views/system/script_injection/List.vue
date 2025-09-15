<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission :permission="'create'" :useHref="true" />
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <TableDefault
            :totalData="totalData"
            :fields="fields"
            :items="reformatDatas"
            :status_code="'mst_product'"
            :filterAction="customActionFilter"
            :action="['copy', 'read', 'update', 'delete']"
            :filterBy="['All', 'mst_product_category_id']"
            v-on:handleDelete="deleteRow($event)"
            v-on:handleUpdate="rowUpdate($event)"
            v-on:handleReload="loadData($event)"
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import {
  deleteSysScriptInj,
  getSysScriptInj,
} from '../../../resource/SysScriptInj';
import { getProfile, getUserId } from '../../../utils';

export default {
  name: 'ListSysScriptInj',
  watch: {
    $route: {
      deep: true,
      handler(route) {
        let query = route.query;
        this.loadData({ ...query });
      },
    },
  },
  mounted() {},
  data() {
    return {
      userInfo: getProfile(),
      user_id: getUserId(),
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
        },
        {
          key: 'name',
          label: 'Name',
          _classes: 'font-weight-bold',
        },
        {
          key: 'description',
          label: 'Desc',
        },
        {
          key: 'last_execute',
          label: 'Code',
        },
        {
          key: 'schedule',
          label: 'Schedule',
        },
        {
          key: 'status',
          label: 'Status',
          _style: 'width:10%',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:20%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    customActionFilter(item) {
      let action = ['create', 'read', 'copy', 'update', 'delete'];
      // if (this.user_id == 0) {
      //   action.push('copy');
      // }
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getSysScriptInj(filter);
      if (!res.error) {
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
      }
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
        let res = await deleteSysScriptInj(_param);
        this.$isLoading(false);
        this.$toast.open({
          message: res.error
            ? `${res.message}`
            : 'Data has been saved successfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res.error) this.loadData();
      }
    },
  },
  computed: {
    reformatDatas() {
      return this.items.map((item) => {
        return {
          ...item,
          description: item.description || '-',
          last_execute: item.last_execute || '-',
          schedule: item.schedule || '-',
        };
      });
    },
  },
};
</script>
