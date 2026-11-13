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
            :status_code="'notification_channel'"
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
  deleteNotificationChannel,
  getNotificationChannel,
} from '../../../resource/NotificationChannel';
import { getWhatsappStatus } from '../../../resource/Whatsapp';

export default {
  name: 'ListNotificationChannel',
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
      whatsappPairingStatus: 'Not checked',
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
          key: 'code',
          label: 'Code',
        },
        {
          key: 'whatsapp_pairing',
          label: 'Connection Status',
        },
        {
          key: 'description',
          label: 'Description',
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
      let res = await getNotificationChannel(filter);
      if (res && !res.error) {
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
        if (
          this.items.some(
            (item) => String(item.code || '').toUpperCase() === 'WHATSAPP',
          )
        ) {
          this.whatsappPairingStatus = await this.loadWhatsappPairingStatus();
        } else {
          this.whatsappPairingStatus = 'Not checked';
        }
      }
    },
    async loadWhatsappPairingStatus() {
      const res = await getWhatsappStatus();
      const status = res && !res.error && res.data && res.data[0];
      if (!status) return 'Status unavailable';
      if (status.connected) return 'Paired - Connected';
      if (status.paired) return 'Paired - Disconnected';
      if (status.session_exists) return 'Pairing in progress';
      return 'Not paired';
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
        let res = await deleteNotificationChannel(param);
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
          whatsapp_pairing:
            String(item.code || '').toUpperCase() === 'WHATSAPP'
              ? this.whatsappPairingStatus
              : 'Not applicable',
          description: item.description || '-',
        };
      });
    },
  },
};
</script>
