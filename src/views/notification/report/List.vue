<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <CAlert color="info" class="mb-3">
            Daftar nomor yang <strong>ditahan</strong> oleh channel WhatsApp
            default karena belum punya riwayat percakapan sama sekali (tidak
            ada chat masuk maupun keluar). Mengirim pesan pertama ke nomor
            seperti ini berisiko dilaporkan spam dan membuat nomor WhatsApp
            ter-suspend. Setelah ada percakapan, tekan
            <strong>Retry</strong> untuk mengirim ulang pesan yang tertahan.
          </CAlert>
          <TableDefault
            :totalData="totalData"
            :fields="fields"
            :items="reformatDatas"
            :action="['retry', 'delete']"
            v-on:handleRetry="retryRow($event)"
            v-on:handleDelete="deleteRow($event)"
            v-on:handleReload="loadData($event)"
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import {
  deleteNotificationReport,
  getNotificationReport,
  retryNotificationReport,
} from '../../../resource/NotificationReport';

const REASON_LABEL = {
  recipient_never_contacted: 'Belum pernah chat',
};

export default {
  name: 'NotificationReport',
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
          key: 'last_attempt',
          label: 'Terakhir Dicoba',
        },
        {
          key: 'channel_code',
          label: 'Channel',
          _classes: 'font-weight-bold',
        },
        {
          key: 'phone',
          label: 'Nomor',
          _classes: 'font-weight-bold',
        },
        {
          key: 'recipient_name',
          label: 'Customer',
        },
        {
          key: 'reason_label',
          label: 'Alasan',
        },
        {
          key: 'attempts',
          label: 'Percobaan',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:10%',
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
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getNotificationReport(filter);
      if (res) {
        this.totalData = res.grand_total;
        this.items = res.data;
      }
    },
    formatDate(value) {
      if (!value) return '-';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    },
    async retryRow(item) {
      let message = `Kirim ulang pesan ke ${item.phone}?\nNomor akan dicek ulang — kalau masih belum pernah membalas, pesan tetap ditahan.`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = await retryNotificationReport({ id: item.id });
        this.$isLoading(false);
        if (!res) {
          this.$toast.open({
            message: 'Gagal menghubungi server.',
            type: 'error',
            dismissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return;
        }
        this.$toast.open({
          message: res.message || (res.error ? 'Retry gagal.' : 'Pesan dikirim ulang.'),
          type: res.error ? 'error' : 'success',
          dismissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res.error) this.loadData();
      }
    },
    async deleteRow(item) {
      let message = `You are about to delete this data.\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = await deleteNotificationReport({ id: item.id });
        this.$isLoading(false);
        this.$toast.open({
          message: res.error
            ? `${res.message}`
            : 'Data has been deleted successfully ',
          type: res.error ? 'error' : 'success',
          dismissible: true,
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
          last_attempt: this.formatDate(
            item.last_attempt_date || item.created_date,
          ),
          reason_label: REASON_LABEL[item.reason] || item.reason,
        };
      });
    },
  },
};
</script>
