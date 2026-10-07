<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission :permission="'create'" :useHref="false" @click="addNew" />
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <TableDefault
            :totalData="totalData"
            :fields="fields"
            :items="reformatDatas"
            :status_code="'sys_tenant'"
            :filterAction="customActionFilter"
            :action="['copy', 'read', 'update', 'delete']"
            :filterBy="['All', 'Active', 'Trial', 'Suspended', 'Cancelled', 'Pending']"
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
  deleteSysTenant,
  getSysTenant,
} from '../../../resource/SysTenant';
import { getProfile, getUserId } from '../../../utils';

export default {
  name: 'ListSysTenant',
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
          key: 'subdomain',
          label: 'Subdomain',
        },
        {
          key: 'status',
          label: 'Status',
          _style: 'width:10%',
          _classes: 'font-weight-bold',
        },
        {
          key: 'plan_code',
          label: 'Plan',
        },
        {
          key: 'contact_email',
          label: 'Contact Email',
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
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getSysTenant(filter);
      if (!res.error) {
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
      }
    },
    rowUpdate(item) {
      this.$router.push({
        path: `system/tenant/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `system/tenant/read/${item.id}`,
      });
    },
    rowCopy(item) {
      this.$router.push({
        path: `system/tenant/copy/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `system/tenant/create`,
      });
    },
    async deleteRow(item) {
      let message = `You are about to delete this tenant. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let _param = { id: item.id };
        let res = await deleteSysTenant(_param);
        this.$isLoading(false);
        this.$toast.open({
          message: res.error
            ? `${res.message}`
            : 'Data has been deleted successfully ',
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
        let statusClass = '';
        switch (item.status) {
          case 'Active':
            statusClass = 'badge-success';
            break;
          case 'Trial':
            statusClass = 'badge-info';
            break;
          case 'Suspended':
            statusClass = 'badge-warning';
            break;
          case 'Cancelled':
            statusClass = 'badge-danger';
            break;
          case 'Pending':
            statusClass = 'badge-secondary';
            break;
        }
        return {
          ...item,
          status: item.status ? `<span class="badge ${statusClass}">${item.status}</span>` : '-',
          plan_code: item.plan_code || '-',
          contact_email: item.contact_email || '-',
        };
      });
    },
  },
};
</script>