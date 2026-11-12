<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <CAlert color="info" class="mb-3">
            Antrean pesan WhatsApp yang diproses worker (jeda anti-ban 5–10
            detik). Halaman ini hanya untuk memantau: pesan yang masih
            <strong>menunggu</strong>, sedang <strong>dikirim</strong>, sudah
            <strong>terkirim</strong>, atau <strong>gagal</strong> setelah
            beberapa percobaan.
          </CAlert>

          <div class="mb-3 d-flex flex-wrap">
            <CBadge
              v-for="chip in statusChips"
              :key="chip.key"
              :color="status === chip.key ? 'primary' : 'light'"
              class="mr-2 mb-1"
              style="cursor: pointer; padding: 8px 12px; font-size: 12px"
              @click.native="selectStatus(chip.key)"
            >
              {{ chip.label }}: {{ chip.total }}
            </CBadge>
            <CButton
              size="sm"
              color="secondary"
              variant="outline"
              class="mb-1 ml-auto"
              :disabled="loading"
              @click="loadData"
            >
              Refresh
            </CButton>
          </div>

          <CDataTable
            :items="reformatDatas"
            :fields="fields"
            hover
            striped
            bordered
            table-filter
            pagination
            :items-per-page="10"
            :loading="loading"
          >
            <template #status_label="{ item }">
              <td>
                <CBadge :color="item.status_color">
                  {{ item.status_label }}
                </CBadge>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import {
  getNotificationQueue,
  getNotificationQueueSummary,
} from '../../../resource/NotificationQueue';

const STATUS_LABEL = {
  pending: 'Menunggu',
  processing: 'Dikirim',
  sent: 'Terkirim',
  failed: 'Gagal',
};

const STATUS_COLOR = {
  pending: 'warning',
  processing: 'info',
  sent: 'success',
  failed: 'danger',
};

const STATUS_ORDER = ['pending', 'processing', 'sent', 'failed'];

const truncate = (value, max) => {
  if (!value) return '';
  const text = String(value).replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

export default {
  name: 'NotificationQueue',
  data() {
    return {
      loading: false,
      status: '',
      items: [],
      summary: [],
      fields: [
        { key: 'created_date', label: 'Dibuat' },
        {
          key: 'customer_name',
          label: 'Customer',
          _classes: 'font-weight-bold',
        },
        { key: 'phone', label: 'Nomor' },
        { key: 'channel_code', label: 'Channel' },
        { key: 'message_type', label: 'Tipe' },
        { key: 'preview', label: 'Pesan' },
        { key: 'status_label', label: 'Status' },
        { key: 'attempts', label: 'Percobaan' },
        { key: 'sent_label', label: 'Terkirim' },
        { key: 'error_label', label: 'Error' },
      ],
    };
  },
  computed: {
    statusChips() {
      const total = this.summary.reduce(
        (acc, row) => acc + Number(row.total || 0),
        0,
      );
      const chips = [{ key: '', label: 'Semua', total }];
      STATUS_ORDER.forEach((key) => {
        const row = this.summary.find((item) => item.status === key);
        chips.push({
          key,
          label: STATUS_LABEL[key],
          total: row ? Number(row.total || 0) : 0,
        });
      });
      return chips;
    },
    reformatDatas() {
      return this.items.map((item) => ({
        ...item,
        status_label: STATUS_LABEL[item.status] || item.status || '-',
        status_color: STATUS_COLOR[item.status] || 'secondary',
        preview: truncate(item.message_preview, 60) || '-',
        error_label: truncate(item.last_error, 40) || '-',
        sent_label: this.formatDate(item.sent_date),
      }));
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    formatDate(value) {
      if (!value) return '-';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    },
    selectStatus(status) {
      if (this.status === status) return;
      this.status = status;
      this.loadData();
    },
    async loadData() {
      this.loading = true;
      const [list, summary] = await Promise.all([
        getNotificationQueue({ status: this.status, page: 1, limit: 200 }),
        getNotificationQueueSummary(),
      ]);
      this.loading = false;
      if (list) {
        this.items = list.data || [];
      } else {
        this.items = [];
      }
      if (summary) {
        this.summary = summary.data || [];
      }
    },
  },
};
</script>
