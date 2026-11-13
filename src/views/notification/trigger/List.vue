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
            :status_code="'notification_trigger'"
            :action="['read', 'update', 'delete']"
            v-on:handleDelete="deleteRow($event)"
            v-on:handleUpdate="rowUpdate($event)"
            v-on:handleRead="rowRead($event)"
            v-on:handleReload="loadData($event)"
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import {
  deleteNotificationTrigger,
  getNotificationTrigger,
} from '../../../resource/NotificationTrigger';

export default {
  name: 'ListNotificationTrigger',
  watch: {
    $route: {
      deep: true,
      handler(route) {
        let query = route.query;
        this.loadData({ ...query });
      },
    },
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
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
          key: 'model',
          label: 'Model',
        },
        {
          key: 'status_from_name',
          label: 'Status From',
        },
        {
          key: 'status_to_name',
          label: 'Status To',
        },
        {
          key: 'template_name',
          label: 'Template',
        },
        {
          key: 'template_channel',
          label: 'Channel',
        },
        {
          key: 'receiver_menu_label',
          label: 'Receiver Menu',
        },
        {
          key: 'receiver_access',
          label: 'Receiver Access',
        },
        {
          key: 'status',
          label: 'Status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:15%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getNotificationTrigger(filter);
      if (res && !res.error) {
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
      }
    },
    rowUpdate(item) {
      this.$router.push({ path: `update/${item.id}` });
    },
    rowRead(item) {
      this.$router.push({ path: `read/${item.id}` });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data.\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id, reason: item?.reason || '' };
        let res = await deleteNotificationTrigger(param);
        this.$isLoading(false);
        this.$toast.open({
          message:
            res && !res.error
              ? 'Data has been deleted successfully '
              : `${res?.message || 'Failed to delete data'}`,
          type: res && !res.error ? 'success' : 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (res && !res.error) this.loadData();
      }
    },
  },
  computed: {
    reformatDatas() {
      return this.items.map((item) => {
        return {
          ...item,
          status_from_name: item.status_from_name || item.status_from || 'All',
          status_to_name: item.status_to_name || item.status_to || '-',
          template_name: item.template_name || '-',
          template_channel: item.template_channel || '-',
          receiver_menu_label: item.receiver_menu_label || '-',
          receiver_access: item.receiver_access || '-',
        };
      });
    },
  },
};
</script>
