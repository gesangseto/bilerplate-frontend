<style type="text/css">
.KotakDashboard {
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  border-radius: 4px;
  height: 130px;
  text-align: center;
}

.JudulDashboard {
  /*color: rgba(255, 255, 255, 0.5); */
  color: rgba(0, 0, 0, 0.5);
  font-size: 15pt;
  font-weight: bold;
}

.IsiDashboard {
  color: white;
  font-size: 20pt;
  font-weight: bold;
}
</style>

<template>
  <div>
    <CRow>
      <CCol sm="4" lg="4">
        <div class="KotakDashboard" style="background-color: #e55353">
          <br /><label class="JudulDashboard">Stock > Expired Date</label>
          <br /><label class="IsiDashboard">
            {{ dataDefault.stock_expired }}
          </label>
        </div>
      </CCol>
      <CCol sm="4" lg="4">
        <div class="KotakDashboard" style="background-color: #f9b115">
          <br /><label class="JudulDashboard">Stock > Maximum Stock</label>
          <br /><label class="IsiDashboard">
            {{ dataDefault.product_exceed_max }}
          </label>
        </div>
      </CCol>
      <CCol sm="4" lg="4">
        <div class="KotakDashboard" style="background-color: #41b883">
          <br /><label class="JudulDashboard">Stock < Minimum Stock</label>
          <br /><label class="IsiDashboard">
            {{ dataDefault.product_below_max }}
          </label>
        </div>
      </CCol>
    </CRow>
    <br />

    <CRow>
      <CCol sm="4" lg="4">
        <div class="KotakDashboard" style="background-color: #3399ff">
          <br /><label class="JudulDashboard">Product in Ready to Sell</label>
          <br /><label class="IsiDashboard">
            {{ dataDefault.product_ready_to_sell }}
          </label>
        </div>
      </CCol>
      <CCol sm="4" lg="4">
        <div class="KotakDashboard" style="background-color: #3399ff">
          <br /><label class="JudulDashboard">Product in Quarantine</label>
          <br /><label class="IsiDashboard">
            {{ dataDefault.product_quarantine }}
          </label>
        </div>
      </CCol>
      <CCol sm="4" lg="4">
        <div class="KotakDashboard" style="background-color: #3399ff">
          <br /><label class="JudulDashboard">Batch</label> <br /><label
            class="IsiDashboard"
          >
            {{ dataDefault.total_batch }}
          </label>
        </div>
      </CCol>
    </CRow>
    <br />

    <CRow>
      <CCol sm="6" lg="6">
        <CCard>
          <CCardHeader
            ><h2 class="text-center">
              Stock (Non-Serial, Serial)
            </h2></CCardHeader
          >
          <CCardBody>
            <CChartPie
              :datasets="pieDataStockSNS"
              :labels="['Non-Serial', 'Serial']"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="6" lg="6">
        <CCard>
          <CCardHeader
            ><h2 class="text-center">Total Batch per Month</h2></CCardHeader
          >
          <CCardBody>
            <CChartLine
              :datasets="chartDataBPM"
              :options="defaultOptions"
              :labels="[
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'Mei',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Okt',
                'Nov',
                'Des',
              ]"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { CChartPie, CChartLine } from "@coreui/vue-chartjs";
// import MainChartExample from "./charts/MainChartExample";
// import WidgetsDropdown from "./widgets/WidgetsDropdown";
// import WidgetsBrand from "./widgets/WidgetsBrand";
// import CChartBarStockAll from "./charts/CChartBarStockAll";
import $axiosMertrack from "../apiMertrack";

export default {
  name: "Dashboard",
  components: {
    CChartPie,
    CChartLine,
  },
  data() {
    return {
      dataDefault: {},
      pieDataStockSNS: [],
      chartDataBPM: [],
    };
  },
  mounted() {
    let param = `ApiName=MertrackDashboard&Params={}`;
    $axiosMertrack.get(`/general/web?${param}`).then((res) => {
      this.dataDefault = res.data.data[0];
      this.pieDataStockSNS = this.generatePieDataStockSNS();
      this.chartDataBPM = this.generateChartDataBPM();
    });
  },
  methods: {
    generatePieDataStockSNS() {
      let temp = [
        {
          backgroundColor: ["#00d639", "#d60000"],
          data: [
            this.dataDefault.pie[0].quantity_ns,
            this.dataDefault.pie[0].quantity_s,
          ],
        },
      ];
      return temp;
    },
    generateChartDataBPM() {
      let temp = [
        {
          label: "Batch",
          backgroundColor: "#b8a7a7",
          borderColor: "#d60000",
          pointHoverBackgroundColor: "#d60000",
          borderWidth: 2,
          data: [],
        },
      ];
      for (const it of this.dataDefault.bar) {
        temp[0].data.push(it.jumlah);
      }
      return temp;
    },
    defaultOptions() {
      return {
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
                stepSize: Math.ceil(250 / 5),
                max: 250,
              },
              gridLines: {
                display: true,
              },
            },
          ],
        },
        elements: {
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
          },
        },
      };
    },
  },
  computed: {
    defaultDatasets() {
      return [
        {
          backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
          data: [40, 20, 80, 10],
        },
      ];
    },
  },
};
</script>
