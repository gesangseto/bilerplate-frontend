<template>
  <div>
    <!-- ===== Filter bar: session, rentang tanggal, periode grafik ===== -->
    <CCard class="mb-3">
      <CCardBody>
        <CRow>
          <CCol sm="12" md="3">
            <label class="d-block small text-muted mb-1">Session</label>
            <select class="form-control" v-model="filters.session_id">
              <option :value="null">Semua Session</option>
              <option v-for="s in sessionList" :key="s.id" :value="s.id">
                {{ s.session_no }} • {{ s.country || '-' }} ({{ s.status }})
              </option>
            </select>
          </CCol>
          <CCol sm="6" md="2">
            <label class="d-block small text-muted mb-1">Dari Tanggal</label>
            <input
              type="date"
              class="form-control"
              v-model="filters.date_from"
            />
          </CCol>
          <CCol sm="6" md="2">
            <label class="d-block small text-muted mb-1">Sampai Tanggal</label>
            <input type="date" class="form-control" v-model="filters.date_to" />
          </CCol>
          <CCol sm="6" md="2">
            <label class="d-block small text-muted mb-1">Periode Grafik</label>
            <select class="form-control" v-model="filters.chart_limit">
              <option :value="3">3 session</option>
              <option :value="6">6 session</option>
              <option :value="12">12 session</option>
            </select>
          </CCol>
          <CCol sm="6" md="3" class="d-flex align-items-end">
            <CButton color="primary" :disabled="loading" @click="applyFilters">
              Terapkan
            </CButton>
            <CButton color="light" class="ml-2" @click="resetFilters">
              Reset
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- ===== Section: Per Session Jastip ===== -->
    <div class="session-section">
      <div class="section-header">
        <div class="section-icon" style="background-color: #553b9c">
          <CalendarRange :size="18" class="text-white" />
        </div>
        <div>
          <div class="section-title">Per Session Jastip</div>
          <div class="section-sub">Ringkasan berdasarkan session terpilih</div>
        </div>
      </div>

      <!-- Hero: Total Penjualan -->
      <div class="hero-card">
        <div class="hero-top">
          <div class="hero-icon">
            <Wallet :size="20" class="text-white" />
          </div>
          <span class="hero-label">
            {{
              selectedSession
                ? `Session ${selectedSession.session_no}`
                : 'Total Penjualan'
            }}
          </span>
        </div>
        <div class="hero-value">
          Rp {{ fmt(sessionData ? sessionData.total_selling : totalSelling) }}
        </div>
        <div class="hero-divider"></div>
        <div class="hero-stats">
          <div class="flex-1">
            <div class="hero-stat-label">Modal</div>
            <div class="hero-stat-value">
              Rp {{ fmt(sessionData ? sessionData.total_cost : totalCost) }}
            </div>
          </div>
          <div class="flex-1">
            <div class="hero-stat-label">Profit</div>
            <div class="hero-stat-value profit">
              Rp {{ fmt(sessionData ? sessionData.total_profit : totalProfit) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Mini stat cards -->
      <div class="mini-row">
        <div class="mini-card" style="background-color: #f6f4fb">
          <PackageVariant :size="18" style="color: #553b9c" />
          <div class="mini-value">
            {{ sessionData ? sessionData.total_items || 0 : totalItems || 0 }}
          </div>
          <div class="mini-label">Item</div>
        </div>
        <div class="mini-card" style="background-color: #e0f2fe">
          <AccountGroup :size="18" style="color: #0ea5e9" />
          <div class="mini-value">{{ totalCustomer || 0 }}</div>
          <div class="mini-label">Customer</div>
        </div>
        <div class="mini-card" style="background-color: #d1fae5">
          <Layers :size="18" style="color: #10b981" />
          <div class="mini-value">
            {{ sessionData ? sessionData.total_batch || 0 : totalBatch || 0 }}
          </div>
          <div class="mini-label">Batch</div>
        </div>
      </div>
    </div>

    <!-- ===== Section: Total Keseluruhan ===== -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon" style="background-color: #e8edf3">
          <ChartBar :size="18" style="color: #64748b" />
        </div>
        <div>
          <div class="section-title">Total Keseluruhan</div>
          <div class="section-sub">Akumulasi semua session jastip</div>
        </div>
      </div>

      <!-- Grafik: Pengeluaran & Keuntungan per Session -->
      <div class="card-box">
        <div class="card-header-row">
          <span class="card-title">Pengeluaran & Keuntungan</span>
          <span class="card-total">{{ filters.chart_limit }} session terakhir</span>
        </div>
        <div v-if="chartLoading" class="empty-text">Memuat grafik...</div>
        <div v-else-if="!chartData.length" class="empty-text">
          Belum ada data session
        </div>
        <div v-else>
          <CChartBar
            :datasets="chartDatasets"
            :labels="chartLabels"
            :options="chartOptions"
            height="220"
          />
        </div>
      </div>

      <!-- Status Item -->
      <div class="card-box">
        <div class="card-header-row">
          <span class="card-title">Status Item</span>
          <span class="card-total">{{ totalItems }} item</span>
        </div>
        <div v-if="totalItems > 0" class="progress-track">
          <div
            v-for="s in statusWithCount"
            :key="s.code"
            :style="{ flex: s.count, backgroundColor: s.color, height: '10px' }"
          ></div>
        </div>
        <div v-else class="empty-text">Belum ada item</div>
        <div class="legend-wrap">
          <div v-for="s in statusWithCount" :key="s.code" class="legend-item">
            <span class="legend-dot" :style="{ backgroundColor: s.color }"></span>
            <span class="legend-text">{{ s.label }} · {{ s.count }}</span>
          </div>
        </div>
      </div>

      <!-- Item Terjual -->
      <div class="card-box">
        <div class="card-header-row">
          <span class="card-title">Item Terjual</span>
          <span class="card-total">{{ itemCount(205) }} item sold</span>
        </div>
        <div class="sold-row">
          <div class="sold-box">
            <div class="sold-label">Pendapatan</div>
            <div class="sold-value">Rp {{ fmt(sold.total_selling) }}</div>
          </div>
          <div class="sold-box">
            <div class="sold-label">Profit</div>
            <div class="sold-value profit">Rp {{ fmt(soldProfit) }}</div>
          </div>
        </div>
      </div>

      <!-- Ringkasan Pembayaran (dari payment_summary) -->
      <div class="card-box">
        <div class="card-header-row">
          <span class="card-title">Ringkasan Pembayaran</span>
          <span class="card-total"
            >{{ paymentSummary.payment_count || 0 }} transaksi</span
          >
        </div>
        <div class="pay-grid">
          <div class="pay-box">
            <div class="pay-label">Total Tagihan</div>
            <div class="pay-value">Rp {{ fmt(paymentSummary.total_selling) }}</div>
          </div>
          <div class="pay-box">
            <div class="pay-label">Total Dibayar</div>
            <div class="pay-value" style="color: #10b981">
              Rp {{ fmt(paymentSummary.total_paid) }}
            </div>
          </div>
          <div class="pay-box">
            <div class="pay-label">Belum Dibayar</div>
            <div class="pay-value" style="color: #f97316">
              Rp {{ fmt(paymentSummary.total_unpaid) }}
            </div>
          </div>
          <div class="pay-box">
            <div class="pay-label">Pending</div>
            <div class="pay-value" style="color: #f59e0b">
              Rp {{ fmt(paymentSummary.total_pending) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Status Picking & Inbound -->
      <div class="card-box">
        <div class="card-header-row">
          <span class="card-title">Picking & Inbound</span>
          <span class="card-total"
            >{{ totalPicking }} picking · {{ totalInbound }} inbound</span
          >
        </div>
        <div class="two-col">
          <div class="col-box">
            <div class="col-label">Picking per Status</div>
            <div v-if="pickingByStatus.length" class="status-chip-row">
              <span
                v-for="p in pickingByStatus"
                :key="p.status"
                class="status-chip"
              >
                {{ statusLabelPicking(p.status) }} · {{ p.total }}
              </span>
            </div>
            <div v-else class="empty-text">Belum ada data picking</div>
          </div>
          <div class="col-box">
            <div class="col-label">Inbound per Status</div>
            <div v-if="inboundByStatus.length" class="status-chip-row">
              <span
                v-for="p in inboundByStatus"
                :key="p.status"
                class="status-chip"
              >
                {{ statusLabelInbound(p.status) }} · {{ p.total }}
              </span>
            </div>
            <div v-else class="empty-text">Belum ada data inbound</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CChartBar } from '@coreui/vue-chartjs';
import CalendarRange from 'vue-material-design-icons/CalendarRange.vue';
import Wallet from 'vue-material-design-icons/Wallet.vue';
import PackageVariant from 'vue-material-design-icons/PackageVariant.vue';
import AccountGroup from 'vue-material-design-icons/AccountGroup.vue';
import Layers from 'vue-material-design-icons/Layers.vue';
import ChartBar from 'vue-material-design-icons/ChartBar.vue';
import $axios from '../api';

// Mapping status item (sama dengan Android):
// 200 Draft, 201 Manifest, 202 In Transit, 203 GRN, 204 Dispatch,
// 205 Sold, 206 Disposed
const ITEM_STATUS = [
  { code: 200, label: 'Draft', color: '#9CA3AF' },
  { code: 201, label: 'Manifest', color: '#3B82F6' },
  { code: 202, label: 'In Transit', color: '#0EA5E9' },
  { code: 203, label: 'GRN', color: '#F59E0B' },
  { code: 204, label: 'Dispatch', color: '#F97316' },
  { code: 205, label: 'Sold', color: '#10B981' },
  { code: 206, label: 'Disposed', color: '#EF4444' },
];

export default {
  name: 'Dashboard',
  components: {
    CChartBar,
    CalendarRange,
    Wallet,
    PackageVariant,
    AccountGroup,
    Layers,
    ChartBar,
  },
  data() {
    return {
      sessionList: [],
      filters: {
        session_id: null, // null = Semua Session
        date_from: '',
        date_to: '',
        chart_limit: 6,
      },
      dashboard: {}, // data global /v1/jastip/dashboard
      sessionStats: [], // data grafik /session-stats?limit=
      sessionDetail: null, // detail session terpilih /session-stats?session_id=
      loading: false,
      chartLoading: false,
    };
  },
  mounted() {
    this.loadSessions();
    this.loadDashboard();
    this.loadSessionStats();
  },
  watch: {
    'filters.session_id'(val) {
      if (val) {
        this.loadSessionDetail(val);
      } else {
        this.sessionDetail = null;
      }
    },
  },
  computed: {
    itemByStatus() {
      return this.dashboard.item_by_status || [];
    },
    totalItems() {
      return this.sumBy(this.itemByStatus, 'total');
    },
    totalSelling() {
      return this.sumBy(this.itemByStatus, 'total_selling');
    },
    totalCost() {
      return this.sumBy(this.itemByStatus, 'total_cost');
    },
    totalProfit() {
      return this.totalSelling - this.totalCost;
    },
    totalBatch() {
      return this.sumBy(this.dashboard.batch_by_status || [], 'total');
    },
    totalCustomer() {
      // Saat session terpilih, pakai total_customer per session dari
      // /session-stats; fallback ke total_customer global dari /dashboard.
      const perSession =
        this.sessionData && this.sessionData.total_customer !== undefined
          ? Number(this.sessionData.total_customer || 0)
          : null;
      return perSession !== null
        ? perSession
        : this.dashboard.total_customer || 0;
    },
    sold() {
      return this.dashboard.total_sales || {};
    },
    soldProfit() {
      return Number(this.sold.total_profit || 0);
    },
    paymentSummary() {
      return this.dashboard.payment_summary || {};
    },
    pickingByStatus() {
      return this.dashboard.picking_by_status || [];
    },
    inboundByStatus() {
      return this.dashboard.inbound_by_status || [];
    },
    totalPicking() {
      return this.sumBy(this.pickingByStatus, 'total');
    },
    totalInbound() {
      return this.sumBy(this.inboundByStatus, 'total');
    },
    selectedSession() {
      return this.filters.session_id
        ? this.sessionList.find((s) => s.id === this.filters.session_id)
        : null;
    },
    sessionData() {
      return this.sessionDetail || null;
    },
    chartData() {
      return this.sessionStats.slice(0, this.filters.chart_limit).reverse();
    },
    chartLabels() {
      return this.chartData.map((d) => d.session_no);
    },
    chartDatasets() {
      return [
        {
          label: 'Pengeluaran (Modal)',
          backgroundColor: '#F59E0B',
          data: this.chartData.map((d) => Number(d.total_cost || 0)),
        },
        {
          label: 'Keuntungan',
          backgroundColor: '#10B981',
          data: this.chartData.map((d) => Number(d.total_profit || 0)),
        },
      ];
    },
    chartOptions() {
      return {
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
          labels: { fontColor: '#666', fontSize: 11 },
        },
        scales: {
          xAxes: [{ ticks: { fontColor: '#999', fontSize: 10 } }],
          yAxes: [
            {
              ticks: {
                fontColor: '#999',
                fontSize: 10,
                callback: (v) => this.fmt(v),
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            label: (item) => ` ${this.fmt(item.value)}`,
          },
        },
      };
    },
    statusWithCount() {
      return ITEM_STATUS.map((s) => ({
        ...s,
        count: this.itemCount(s.code),
      })).filter((s) => s.count > 0);
    },
  },
  methods: {
    fmt(v) {
      return Math.round(Number(v || 0)).toLocaleString('id-ID');
    },
    sumBy(arr, key) {
      return (arr || []).reduce((acc, it) => acc + Number(it[key] || 0), 0);
    },
    itemCount(code) {
      const row = this.itemByStatus.find(
        (it) => Number(it.status) === code
      );
      return row ? Number(row.total || 0) : 0;
    },
    statusLabelPicking(status) {
      // trx_picking.status: -1 Canceled, 0 Waiting, 1 Done, 2 In Courier, 3 Returned
      return (
        {
          '-1': 'Canceled',
          0: 'Waiting',
          1: 'Done',
          2: 'In Courier',
          3: 'Returned',
        }[Number(status)] || `Status ${status}`
      );
    },
    statusLabelInbound(status) {
      // trx_inbound.status: 0 Waiting, 1 Done
      return (
        {
          0: 'Waiting',
          1: 'Done',
        }[Number(status)] || `Status ${status}`
      );
    },
    async loadSessions() {
      try {
        const res = await $axios.get('/v1/jastip/session', {
          params: { limit: 100 },
        });
        const list = res.data.data || [];
        this.sessionList = list;
        // Default: session aktif (sama seperti Android)
        const active = list.find((s) => s.status === 'Active');
        this.filters.session_id = active ? active.id : null;
      } catch (e) {
        console.error(e);
      }
    },
    async loadDashboard() {
      this.loading = true;
      try {
        const params = {};
        if (this.filters.date_from) params.date_from = this.filters.date_from;
        if (this.filters.date_to) params.date_to = this.filters.date_to;
        const res = await $axios.get('/v1/jastip/dashboard', { params });
        this.dashboard = res.data.data || {};
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    },
    async loadSessionStats() {
      this.chartLoading = true;
      try {
        const res = await $axios.get('/v1/jastip/dashboard/session-stats', {
          params: { limit: this.filters.chart_limit },
        });
        this.sessionStats = res.data.data || [];
      } catch (e) {
        console.error(e);
      }
      this.chartLoading = false;
    },
    async loadSessionDetail(id) {
      try {
        const res = await $axios.get('/v1/jastip/dashboard/session-stats', {
          params: { session_id: id },
        });
        const stats = res.data.data || [];
        this.sessionDetail = stats[0] || null;
      } catch (e) {
        console.error(e);
      }
    },
    applyFilters() {
      this.loadDashboard();
      this.loadSessionStats();
    },
    resetFilters() {
      this.filters = {
        session_id: null,
        date_from: '',
        date_to: '',
        chart_limit: 6,
      };
      this.applyFilters();
    },
  },
};
</script>

<style scoped>
.session-section {
  background-color: #fbfafe;
  border: 1px solid #edeffd;
  border-radius: 20px;
  padding: 14px;
}
.section {
  margin-top: 18px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.section-title {
  font-size: 16px;
  font-weight: 800;
  color: #1f1f1f;
}
.section-sub {
  font-size: 11px;
  color: #9a9a9a;
  margin-top: 1px;
}

/* Hero card */
.hero-card {
  background-color: #553b9c;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 8px 16px rgba(85, 59, 156, 0.3);
}
.hero-top {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hero-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-label {
  font-size: 14px;
  font-weight: 600;
  color: #b1a3d2;
}
.hero-value {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  margin-top: 10px;
}
.hero-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 12px 0;
}
.hero-stats {
  display: flex;
}
.flex-1 {
  flex: 1;
}
.hero-stat-label {
  font-size: 12px;
  color: #b1a3d2;
}
.hero-stat-value {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin-top: 2px;
}
.hero-stat-value.profit {
  color: #4ade80;
}

/* Mini cards */
.mini-row {
  display: flex;
  gap: 12px;
  margin-top: 14px;
}
.mini-card {
  flex: 1;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mini-value {
  font-size: 18px;
  font-weight: 800;
  color: #333;
  margin-top: 5px;
}
.mini-label {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

/* Card umum */
.card-box {
  background-color: #fff;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  padding: 14px;
  margin-top: 14px;
}
.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}
.card-total {
  font-size: 11px;
  color: #999;
}

/* Status item */
.progress-track {
  display: flex;
  border-radius: 5px;
  overflow: hidden;
  background-color: #f0f0f0;
}
.legend-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
}
.legend-text {
  font-size: 11px;
  color: #666;
}

/* Item terjual */
.sold-row {
  display: flex;
  gap: 12px;
}
.sold-box {
  flex: 1;
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 12px;
}
.sold-label {
  font-size: 11px;
  color: #888;
}
.sold-value {
  font-size: 15px;
  font-weight: 800;
  color: #333;
  margin-top: 4px;
}
.sold-value.profit {
  color: #10b981;
}

.empty-text {
  font-size: 13px;
  color: #999;
  text-align: center;
  padding: 8px 0;
}

/* Ringkasan Pembayaran */
.pay-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}
.pay-box {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 12px;
}
.pay-label {
  font-size: 11px;
  color: #888;
}
.pay-value {
  font-size: 15px;
  font-weight: 800;
  color: #333;
  margin-top: 4px;
}

/* Picking & Inbound */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.col-box {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 12px;
}
.col-label {
  font-size: 12px;
  font-weight: 700;
  color: #555;
  margin-bottom: 8px;
}
.status-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.status-chip {
  background-color: #eef0f4;
  color: #444;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
}
@media (max-width: 640px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}
</style>