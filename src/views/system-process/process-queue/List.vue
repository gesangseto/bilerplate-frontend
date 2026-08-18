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
            :filterAction="customActionFilter"
            :action="['read', 'delete']"
            v-on:handleDelete="deleteRow($event)"
            v-on:handleReload="loadData($event)"
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import moment from 'moment';
import {
  deleteProcessQueue,
  getProcessQueue,
} from '../../../resource/ProcessQueue';
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
          key: 'trx_ref_name',
          label: 'Model',
          _classes: 'font-weight-bold',
        },
        {
          key: 'trx_ref_id',
          label: 'Reference ID',
          _classes: 'font-weight-bold',
        },
        {
          key: 'created_date',
          label: 'Created Date',
        },
        {
          key: 'created_full_name',
          label: 'Created By',
        },
        {
          key: 'status_name',
          label: 'Status',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:15%',
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
      let res = await getProcessQueue(filter);
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
        let param = { id: item.id, reason: item?.reason || '' };
        let res = await deleteProcessQueue(param);
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
          last_execute: item.last_execute
            ? moment(item.last_execute).format('YYYY-MM-DD HH:mm::ss:SSS')
            : '-',
          next_execute: item.next_execute
            ? moment(item.next_execute).format('YYYY-MM-DD HH:mm::ss:SSS')
            : '-',
          schedule: item.schedule || '-',
        };
      });
    },
  },
};
</script>
