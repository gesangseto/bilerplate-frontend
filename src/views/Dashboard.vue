<style type="text/css">
.ContainerDashboard {
  padding: 5px;
}
.HeaderDashboard {
  color: white;
  text-align: center;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 6px;
  padding-right: 6px;
}
.title-dashboard {
  font-weight: bold;
  font-size: 9pt;
  padding: 7px 3px;
}

.tb-table {
  color: white;
  text-align: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 5px;
}
.title-table {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: lighter;
  font-size: 8pt;
  color: #505050;
}
.icon-table {
  height: 25px;
}
.content-table {
  height: 50px;
  font-weight: bold;
  font-size: 10pt;
  color: black;
}

.stock-alert-list {
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stock-alert-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  flex: 1 1 0;
}
.stock-alert-name {
  flex: 1 1 auto;
  font-size: 8pt;
  color: #505050;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stock-alert-count {
  font-size: 11pt;
  font-weight: 700;
  line-height: 1;
}

.bpom-stats {
  display: flex;
  gap: 6px;
  height: 100%;
}
.bpom-stat {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  border-radius: 8px;
  text-align: center;
}
.bpom-stat-icon {
  width: 34px;
  height: 34px;
  margin-bottom: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bpom-stat-value {
  font-size: 17pt;
  font-weight: 700;
  line-height: 1;
}
.bpom-stat-label {
  margin-top: 3px;
  font-size: 8.5pt;
  font-weight: 600;
  color: #505050;
}
.bpom-stat-time {
  max-width: 100%;
  margin-top: 2px;
  font-size: 7.5pt;
  color: #909090;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<template>
  <div>
    <CRow>
      <CCol class="ContainerDashboard" sm="12" md="6" lg="6">
        <CCard class="h-100">
          <CCardHeader
            class="HeaderDashboard"
            style="background-color: #000060"
          >
            <div class="float-left title-dashboard">Stock Overview</div>
            <Warehouse class="float-right" :size="30" />
          </CCardHeader>
          <CCardBody style="padding: 8px">
            <div class="d-flex mb-2" style="gap: 4px">
              <button
                v-for="metric in stockMetricButtons"
                :key="metric.key"
                type="button"
                class="btn btn-sm"
                :style="{
                  backgroundColor:
                    selectedMetric === metric.key ? metric.color : '#fff',
                  borderColor: metric.color,
                  color: selectedMetric === metric.key ? '#fff' : metric.color,
                }"
                @click="selectedMetric = metric.key"
              >
                {{ metric.label }}
              </button>
            </div>
            <div style="height: 150px">
              <CChartHorizontalBar
                :labels="stockChart.labels"
                :datasets="stockChart.datasets"
                :options="stockChart.options"
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol class="ContainerDashboard" sm="12" md="3" lg="3">
        <CCard class="h-100">
          <CCardHeader
            class="HeaderDashboard"
            style="background-color: #e45054ff"
          >
            <div class="float-left title-dashboard">Stock Alerts</div>
            <AlertCircleOutline class="float-right" :size="30" />
          </CCardHeader>
          <CCardBody style="padding: 6px">
            <ul class="stock-alert-list">
              <li
                class="stock-alert-item"
                style="background-color: rgba(228, 80, 84, 0.08)"
              >
                <PackageVariantClosed fillColor="#e45054" :size="16" />
                <span class="stock-alert-name">Expired L1 Qty</span>
                <span class="stock-alert-count" style="color: #e45054">
                  {{ dataDefault.stock_expired || 0 }}
                </span>
              </li>
              <li
                class="stock-alert-item"
                style="background-color: rgba(228, 80, 84, 0.08)"
              >
                <TrayFull fillColor="#e45054" :size="16" />
                <span class="stock-alert-name">Expired Batch</span>
                <span class="stock-alert-count" style="color: #e45054">
                  {{ dataDefault.batch_expired || 0 }}
                </span>
              </li>
              <li
                class="stock-alert-item"
                style="background-color: rgba(228, 80, 84, 0.08)"
              >
                <TagTextOutline fillColor="#e45054" :size="16" />
                <span class="stock-alert-name">Expired Product</span>
                <span class="stock-alert-count" style="color: #e45054">
                  {{ dataDefault.product_expired || 0 }}
                </span>
              </li>
              <li
                class="stock-alert-item"
                style="background-color: rgba(247, 175, 48, 0.12)"
              >
                <DatabaseAlertOutline fillColor="#f7af30" :size="16" />
                <span class="stock-alert-name">Below Minimum</span>
                <span class="stock-alert-count" style="color: #f7af30">
                  {{ dataDefault.product_below_min || 0 }}
                </span>
              </li>
              <li
                class="stock-alert-item"
                style="background-color: rgba(66, 184, 134, 0.1)"
              >
                <DatabaseAlert fillColor="#42b886" :size="16" />
                <span class="stock-alert-name">Exceed Maximum</span>
                <span class="stock-alert-count" style="color: #42b886">
                  {{ dataDefault.product_exceed_max || 0 }}
                </span>
              </li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol class="ContainerDashboard" sm="12" md="3" lg="3">
        <CCard class="h-100">
          <CCardHeader
            class="HeaderDashboard"
            style="background-color: #009603"
          >
            <div class="float-left title-dashboard">Queue BPOM</div>
            <ClipboardClockOutline class="float-right" :size="30" />
          </CCardHeader>
          <CCardBody style="padding: 8px">
            <div class="bpom-stats">
              <div
                class="bpom-stat"
                style="background-color: rgba(228, 80, 84, 0.08)"
              >
                <div
                  class="bpom-stat-icon"
                  style="background-color: rgba(228, 80, 84, 0.15)"
                >
                  <CloseNetworkOutline fillColor="#e45054" :size="22" />
                </div>
                <div class="bpom-stat-value" style="color: #e45054">
                  {{ bpomData.failed_trx || 0 }}
                </div>
                <div class="bpom-stat-label">Failed</div>
                <div class="bpom-stat-time" :title="bpomData.last_failed_time">
                  {{ formatBpomTime(bpomData.last_failed_time) }}
                </div>
              </div>

              <div
                class="bpom-stat"
                style="background-color: rgba(247, 175, 48, 0.1)"
              >
                <div
                  class="bpom-stat-icon"
                  style="background-color: rgba(247, 175, 48, 0.18)"
                >
                  <ProgressUpload fillColor="#f7af30" :size="22" />
                </div>
                <div class="bpom-stat-value" style="color: #f7af30">
                  {{ bpomData.waiting_trx || 0 }}
                </div>
                <div class="bpom-stat-label">Waiting</div>
                <div class="bpom-stat-time">In queue</div>
              </div>

              <div
                class="bpom-stat"
                style="background-color: rgba(66, 184, 134, 0.1)"
              >
                <div
                  class="bpom-stat-icon"
                  style="background-color: rgba(66, 184, 134, 0.18)"
                >
                  <UploadNetworkOutline fillColor="#42b886" :size="22" />
                </div>
                <div class="bpom-stat-value" style="color: #42b886">
                  {{ bpomData.success_trx || 0 }}
                </div>
                <div class="bpom-stat-label">Success</div>
                <div class="bpom-stat-time" :title="bpomData.last_success_time">
                  {{ formatBpomTime(bpomData.last_success_time) }}
                </div>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol class="ContainerDashboard" sm="6" md="6" lg="6">
        <CCard>
          <CCardHeader>
            <h5 class="text-center" style="color: black">
              Incoming - Outgoing Last 30 Days
            </h5></CCardHeader
          >
          <CCardBody>
            <CChartLineSimple
              :labels="in_out_day.labels"
              :datasets="in_out_day.datasets"
              pointed
              border-color="warning"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol class="ContainerDashboard" sm="6" md="6" lg="6">
        <CCard>
          <CCardHeader>
            <h5 class="text-center" style="color: black">
              Incoming - Outgoing Last 12 Months
            </h5>
          </CCardHeader>
          <CCardBody>
            <CChartLineSimple
              :labels="in_out_month.labels"
              :datasets="in_out_month.datasets"
              pointed
              border-color="warning"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { CChartHorizontalBar } from '@coreui/vue-chartjs';
import moment from 'moment';
import CChartLineSimple from './charts/CChartLineSimple.vue';
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue';
import ClipboardClockOutline from 'vue-material-design-icons/ClipboardClockOutline.vue';
import DatabaseAlertOutline from 'vue-material-design-icons/DatabaseAlertOutline.vue';
import DatabaseAlert from 'vue-material-design-icons/DatabaseAlert.vue';
import Warehouse from 'vue-material-design-icons/Warehouse.vue';
import TrayFull from 'vue-material-design-icons/TrayFull.vue';
import PackageVariantClosed from 'vue-material-design-icons/PackageVariantClosed.vue';
import TagTextOutline from 'vue-material-design-icons/TagTextOutline.vue';
import CloseNetworkOutline from 'vue-material-design-icons/CloseNetworkOutline.vue';
import ProgressUpload from 'vue-material-design-icons/ProgressUpload.vue';
import UploadNetworkOutline from 'vue-material-design-icons/UploadNetworkOutline.vue';
import {
  getInOutDashboard,
  getStockInfo,
  getBpomInfo,
} from '../resource/Dashboard';
import { getProfile } from '../utils';

const interval_date = 11;
export default {
  name: 'Dashboard',
  components: {
    CChartHorizontalBar,
    AlertCircleOutline,
    ClipboardClockOutline,
    DatabaseAlertOutline,
    DatabaseAlert,
    Warehouse,
    TrayFull,
    PackageVariantClosed,
    TagTextOutline,
    CloseNetworkOutline,
    ProgressUpload,
    UploadNetworkOutline,
    CChartLineSimple,
  },
  data() {
    return {
      profile: getProfile(),
      in_out_month: { labels: [], datasets: [] },
      in_out_day: { labels: [], datasets: [] },
      bpomData: {},
      dataDefault: {
        pie: [],
      },
      selectedMetric: 'quantity',
      chartLineData: null,
      conf_date: {
        start: moment()
          .subtract(interval_date, 'months')
          .startOf('month')
          .format('YYYY-MM-DD'),
        end: moment().endOf('month').format('YYYY-MM-DD'),
        all: [],
      },
      chartPieData1: null,
      chartPieData2: null,
      chartOption: {
        legend: {
          position: 'top',
          labels: {
            fontColor: '#505050',
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: '#505050',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: '#505050',
              },
            },
          ],
        },
      },
    };
  },
  async mounted() {
    this.getInOut30Days();
    this.getInOut12Months();
    this.getStockInfoChart();
    this.getBpomChart();
  },
  methods: {
    async getStockInfoChart() {
      let _res = await getStockInfo();
      if (_res) {
        this.dataDefault = _res.data[0];
      }
    },
    async getBpomChart() {
      let _bpom = await getBpomInfo();
      if (_bpom && !_bpom.error) {
        this.bpomData = _bpom.data[0] || {};
      }
    },
    formatBpomTime(value) {
      if (!value) {
        return '—';
      }
      const parsed = moment(value, 'YYYY-MM-DD HH:mm');
      return parsed.isValid() ? parsed.format('DD MMM HH:mm') : value;
    },
    async getInOut30Days() {
      let data = await getInOutDashboard({ type: 'daily' });
      if (data && !data.error) {
        data = data.data[0];
        this.in_out_day.labels = data.labels;
        this.in_out_day.datasets = data.datasets;
      }
    },
    async getInOut12Months() {
      let data = await getInOutDashboard({ type: 'monthly' });
      if (data && !data.error) {
        data = data.data[0];
        this.in_out_month.labels = data.labels;
        this.in_out_month.datasets = data.datasets;
      }
    },
  },
  computed: {
    stockMetricButtons() {
      return [
        { key: 'quantity', label: 'Quantity', color: '#419BFC' },
        { key: 'batch', label: 'Batch', color: '#F7AF30' },
        { key: 'product', label: 'Product', color: '#42B886' },
      ];
    },
    selectedStock() {
      const d = this.dataDefault || {};
      const num = (value) => (value ? value : 0);
      const metrics = {
        quantity: {
          label: 'Quantity',
          total: num(d.total_stock),
          quarantine: num(d.stock_quarantine),
          readyToSell: num(d.stock_ready_to_sell),
        },
        batch: {
          label: 'Batch',
          total: num(d.total_batch),
          quarantine: num(d.batch_quarantine),
          readyToSell: num(d.batch_ready_to_sell),
        },
        product: {
          label: 'Product',
          total: num(d.total_product),
          quarantine: num(d.product_quarantine),
          readyToSell: num(d.product_ready_to_sell),
        },
      };

      return metrics[this.selectedMetric] || metrics.quantity;
    },
    stockChart() {
      const selected = this.selectedStock;
      return {
        labels: [selected.label],
        datasets: [
          {
            label: 'Quarantine',
            backgroundColor: '#419BFC',
            stack: 'Stack 0',
            barPercentage: 0.6,
            categoryPercentage: 0.6,
            data: [selected.quarantine],
          },
          {
            label: 'Ready to Sell',
            backgroundColor: '#42B886',
            stack: 'Stack 0',
            barPercentage: 0.6,
            categoryPercentage: 0.6,
            data: [selected.readyToSell],
          },
          {
            label: 'Total',
            backgroundColor: '#000060',
            stack: 'Stack 0',
            barPercentage: 0.6,
            categoryPercentage: 0.6,
            data: [selected.total],
          },
        ],
        options: {
          maintainAspectRatio: false,
          legend: {
            position: 'top',
            labels: {
              fontColor: '#505050',
              boxWidth: 12,
              fontSize: 10,
            },
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  beginAtZero: true,
                  precision: 0,
                  fontColor: '#505050',
                  fontSize: 10,
                },
              },
            ],
            yAxes: [
              {
                stacked: true,
                gridLines: { display: false },
                ticks: { fontColor: '#505050', fontSize: 10 },
              },
            ],
          },
        },
      };
    },
    defaultDatasets() {
      return null;
    },
  },
};
</script>
