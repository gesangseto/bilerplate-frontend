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
</style>

<template>
  <div>
    <CRow>
      <CCol class="ContainerDashboard" sm="4" md="2" lg="2" style="">
        <CCard>
          <CCardHeader
            class="HeaderDashboard"
            style="background-color: #e45054ff"
          >
            <div class="float-left title-dashboard">Stock &ge; Expiry Date</div>
            <CalendarAlert class="float-right" :size="30" />
          </CCardHeader>
          <CCardBody style="padding: 0px">
            <table class="tb-table">
              <tr class="icon-table">
                <td>
                  <PackageVariantClosed fillColor="#E45054FF" :size="30" />
                </td>
                <td><TrayFull fillColor="#E45054FF" :size="30" /></td>
                <td><TagTextOutline fillColor="#E45054FF" :size="30" /></td>
              </tr>
              <tr class="content-table">
                <td>
                  {{
                    dataDefault.stock_expired ? dataDefault.stock_expired : 0
                  }}
                </td>
                <td>
                  {{
                    dataDefault.batch_expired ? dataDefault.batch_expired : 0
                  }}
                </td>
                <td>
                  {{
                    dataDefault.product_expired
                      ? dataDefault.product_expired
                      : 0
                  }}
                </td>
              </tr>
              <tr class="title-table">
                <th width="33%">L1 Qty</th>
                <th width="33%">Batch</th>
                <th width="33%">Product</th>
              </tr>
            </table>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol class="ContainerDashboard" sm="4" md="2" lg="2">
        <CCard>
          <CCardHeader
            class="HeaderDashboard"
            style="background-color: #f7af30"
          >
            <div class="float-left title-dashboard">Stock &le; Minimum</div>
            <DatabaseAlertOutline class="float-right" :size="30" />
          </CCardHeader>
          <CCardBody style="padding: 0px">
            <table class="tb-table">
              <tr class="icon-table">
                <td></td>
                <td><TagTextOutline fillColor="#F7AF30" :size="30" /></td>
                <td></td>
              </tr>
              <tr class="content-table">
                <td></td>
                <td>
                  {{
                    dataDefault.product_below_max
                      ? dataDefault.product_below_max
                      : 0
                  }}
                </td>
                <td></td>
              </tr>
              <tr class="title-table">
                <th width="33%"></th>
                <th width="33%">Product</th>
                <th width="33%"></th>
              </tr>
            </table>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol class="ContainerDashboard" sm="4" md="2" lg="2">
        <CCard>
          <CCardHeader
            class="HeaderDashboard"
            style="background-color: #42b886"
          >
            <div class="float-left title-dashboard">Stock &ge; Maximum</div>
            <DatabaseAlert class="float-right" :size="30" />
          </CCardHeader>
          <CCardBody style="padding: 0px">
            <table class="tb-table">
              <tr class="icon-table">
                <td></td>
                <td><TagTextOutline fillColor="#F7AF30" :size="30" /></td>
                <td></td>
              </tr>
              <tr class="content-table">
                <td></td>
                <td>
                  {{
                    dataDefault.product_exceed_max
                      ? dataDefault.product_exceed_max
                      : 0
                  }}
                </td>
                <td></td>
              </tr>
              <tr class="title-table">
                <th width="33%"></th>
                <th width="33%">Product</th>
                <th width="33%"></th>
              </tr>
            </table>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol class="ContainerDashboard" sm="4" md="2" lg="2">
        <CCard>
          <CCardHeader
            class="HeaderDashboard"
            style="background-color: #419bfc"
          >
            <div class="float-left title-dashboard">Stock in Quarantine</div>
            <GarageVariantLock class="float-right" :size="30" />
          </CCardHeader>
          <CCardBody style="padding: 0px">
            <table class="tb-table">
              <tr class="icon-table">
                <td><PackageVariantClosed fillColor="#419BFC" :size="30" /></td>
                <td><TrayFull fillColor="#419BFC" :size="30" /></td>
                <td><TagTextOutline fillColor="#419BFC" :size="30" /></td>
              </tr>
              <tr class="content-table">
                <td>
                  {{
                    dataDefault.stock_quarantine
                      ? dataDefault.stock_quarantine
                      : 0
                  }}
                </td>
                <td>
                  {{
                    dataDefault.batch_quarantine
                      ? dataDefault.batch_quarantine
                      : 0
                  }}
                </td>
                <td>
                  {{
                    dataDefault.product_quarantine
                      ? dataDefault.product_quarantine
                      : 0
                  }}
                </td>
              </tr>
              <tr class="title-table">
                <th width="33%">L1 Qty</th>
                <th width="33%">Batch</th>
                <th width="33%">Product</th>
              </tr>
            </table>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol class="ContainerDashboard" sm="4" md="2" lg="2">
        <CCard>
          <CCardHeader
            class="HeaderDashboard"
            style="background-color: #0018ab"
          >
            <div class="float-left title-dashboard">Stock in Ready To Sell</div>
            <GarageOpenVariant class="float-right" :size="30" />
          </CCardHeader>
          <CCardBody style="padding: 0px">
            <table class="tb-table">
              <tr class="icon-table">
                <td><PackageVariantClosed fillColor="#0018AB" :size="30" /></td>
                <td><TrayFull fillColor="#0018AB" :size="30" /></td>
                <td><TagTextOutline fillColor="#0018AB" :size="30" /></td>
              </tr>
              <tr class="content-table">
                <td>
                  {{
                    dataDefault.stock_ready_to_sell
                      ? dataDefault.stock_ready_to_sell
                      : 0
                  }}
                </td>
                <td>
                  {{
                    dataDefault.batch_ready_to_sell
                      ? dataDefault.batch_ready_to_sell
                      : 0
                  }}
                </td>
                <td>
                  {{
                    dataDefault.product_ready_to_sell
                      ? dataDefault.product_ready_to_sell
                      : 0
                  }}
                </td>
              </tr>
              <tr class="title-table">
                <th width="33%">L1 Qty</th>
                <th width="33%">Batch</th>
                <th width="33%">Product</th>
              </tr>
            </table>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol class="ContainerDashboard" sm="4" md="2" lg="2">
        <CCard>
          <CCardHeader
            class="HeaderDashboard"
            style="background-color: #000060"
          >
            <div class="float-left title-dashboard">Total Stock</div>
            <Warehouse class="float-right" :size="30" />
          </CCardHeader>
          <CCardBody style="padding: 0px">
            <table class="tb-table">
              <tr class="icon-table">
                <td><PackageVariantClosed fillColor="#000060" :size="30" /></td>
                <td><TrayFull fillColor="#000060" :size="30" /></td>
                <td><TagTextOutline fillColor="#000060" :size="30" /></td>
              </tr>
              <tr class="content-table">
                <td>
                  {{ dataDefault.total_stock ? dataDefault.total_stock : 0 }}
                </td>
                <td>
                  {{ dataDefault.total_batch ? dataDefault.total_batch : 0 }}
                </td>
                <td>
                  {{
                    dataDefault.total_product ? dataDefault.total_product : 0
                  }}
                </td>
              </tr>
              <tr class="title-table">
                <th width="33%">L1 Qty</th>
                <th width="33%">Batch</th>
                <th width="33%">Product</th>
              </tr>
            </table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <!-- <CRow>
      <CCol class="ContainerDashboard" sm="6" lg="6">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol md="6">
                <h5 class="text-center" style="color: black">Stock L1</h5>
              </CCol>
              <CCol md="6">
                <h5 class="text-center" style="color: black">Stock Batch</h5>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="6">
                <PieChart
                  :height="425"
                  :chart-data="chartPieData1"
                  :options="chartOption"
                ></PieChart>
              </CCol>
              <CCol md="6">
                <PieChart
                  :height="425"
                  :chart-data="chartPieData2"
                  :options="chartOption"
                ></PieChart>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol class="ContainerDashboard" sm="6" lg="6">
        <CCard>
          <CCardHeader>
            <h5 class="text-center" style="color: black">
              Incoming - Outgoing Batch
            </h5>
          </CCardHeader>
          <CCardBody>
            <div>
              <BarChart
                :height="200"
                :chart-data="chartLineData"
                :options="chartOption"
              ></BarChart>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow> -->
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
import { CChartPie, CChartLine } from '@coreui/vue-chartjs';
import moment from 'moment';
import PieChart from './charts/PieChart';
import CChartLineSimple from './charts/CChartLineSimple.vue';
import BarChart from './charts/BarChart';
import CalendarAlert from 'vue-material-design-icons/CalendarAlert.vue';
import DatabaseAlertOutline from 'vue-material-design-icons/DatabaseAlertOutline.vue';
import DatabaseAlert from 'vue-material-design-icons/DatabaseAlert.vue';
import GarageVariantLock from 'vue-material-design-icons/GarageVariantLock.vue';
import GarageOpenVariant from 'vue-material-design-icons/GarageOpenVariant.vue';
import Warehouse from 'vue-material-design-icons/Warehouse.vue';
import TrayFull from 'vue-material-design-icons/TrayFull.vue';
import PackageVariantClosed from 'vue-material-design-icons/PackageVariantClosed.vue';
import TagTextOutline from 'vue-material-design-icons/TagTextOutline.vue';
import { getDashboard, getInOutDashboard } from '../resource/Helper';
// import MainChartExample from "./charts/MainChartExample";
// import WidgetsDropdown from "./widgets/WidgetsDropdown";
// import WidgetsBrand from "./widgets/WidgetsBrand";
// import CChartBarStockAll from "./charts/CChartBarStockAll";
import $axiosMertrack from '../apiMertrack';
import { getProfile } from '../utils';

const interval_date = 11;
export default {
  name: 'Dashboard',
  components: {
    CChartPie,
    CChartLine,
    BarChart,
    PieChart,
    CalendarAlert,
    DatabaseAlertOutline,
    DatabaseAlert,
    GarageVariantLock,
    GarageOpenVariant,
    Warehouse,
    TrayFull,
    PackageVariantClosed,
    TagTextOutline,
    CChartLineSimple,
  },
  data() {
    return {
      profile: getProfile(),
      in_out_month: { labels: [], datasets: [] },
      in_out_day: { labels: [], datasets: [] },
      dataDefault: {
        pie: [],
      },
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
    let _res = await getDashboard({
      date_from: this.conf_date.start,
      date_to: this.conf_date.end,
    });
    if (_res) {
      this.dataDefault = _res.data[0];
      // this.generateAllMonth();
      // this.getDataBarChart();
      // this.getDataPieChart1();
      // this.getDataPieChart2();
    }
    await this.getInOut('months');
    await this.getInOut('days');
  },
  methods: {
    async getInOut(type = 'months') {
      let data = await getInOutDashboard({ interval: type });
      if (data && !data.error) {
        data = data.data[0];
        if (type == 'months') {
          this.in_out_month.labels = data.labels;
          this.in_out_month.datasets = data.datasets;
        } else if (type == 'days') {
          this.in_out_day.labels = data.labels;
          this.in_out_day.datasets = data.datasets;
        }
      }
    },
    getDataPieChart1() {
      let serial = this.dataDefault.pie[0];
      let nonserial = this.dataDefault.pie[1];
      let label = this.dataDefault.pie.map((it) => it.type);
      this.chartPieData1 = {
        labels: label,
        datasets: [
          {
            yAxisID: 'yAxis',
            xAxisID: 'xAxis',
            label: 'My First Dataset',
            data: [serial['stock_l1'], nonserial['stock_l1']],
            backgroundColor: ['#0018AB', '#F7AF30'],
            hoverOffset: 4,
          },
        ],
      };
    },
    getDataPieChart2() {
      let serial = this.dataDefault.pie[0];
      let nonserial = this.dataDefault.pie[1];
      let label = this.dataDefault.pie.map((it) => it.type);
      this.chartPieData2 = {
        labels: label,
        datasets: [
          {
            yAxisID: 'yAxis',
            xAxisID: 'xAxis',
            label: 'My First Dataset',
            data: [serial['stock_batch'], nonserial['stock_batch']],
            backgroundColor: ['#0018AB', '#F7AF30'],
            hoverOffset: 4,
          },
        ],
      };
    },
    getDataBarChart() {
      this.chartLineData = {
        labels: this.conf_date.all,
        datasets: [
          {
            label: 'Incoming Batch',
            backgroundColor: '#0018AB',
            data: this.dataDefault['bar_incoming'].map((it) => it.batch),
            // borderColor: 'red'
          },
          {
            label: 'Outgoing Batch',
            backgroundColor: '#F7AF30',
            data: this.dataDefault['bar_outgoing'].map((it) => it.batch),
            // borderColor: 'green'
          },
        ],
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    generateAllMonth() {
      this.conf_date.all = [];
      for (var i = interval_date; i >= 0; i--) {
        let m = moment()
          .subtract(i, 'months')
          .endOf('month')
          .format('MMM YYYY');
        this.conf_date.all.push(m);
      }
      return;
    },
  },
  computed: {
    defaultDatasets() {
      return null;
    },
  },
};
</script>
