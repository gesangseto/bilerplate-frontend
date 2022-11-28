<template>
  <CChartLine
    :datasets="defaultDatasets"
    :options="defaultOptions"
    :labels="[
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]"
  />
</template>

<script>
import { CChartLine } from "@coreui/vue-chartjs";

export default {
  name: "CChartBarStockAll",
  components: { CChartLine },
  computed: {
    defaultDatasets() {
      return [
        {
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,

          data: [
            this.QtyJan,
            this.QtyFeb,
            this.QtyMar,
            this.QtyApr,
            this.QtyMay,
            this.QtyJun,
            this.QtyJul,
            this.QtyAug,
            this.QtySep,
            this.QtyOct,
            this.QtyNov,
            this.QtyDec,
          ],
        },
      ];
    },

    defaultOptions() {
      return {
        responsive: true,
        maintainAspectRatio: true,
        legend: { display: false },
        scales: {
          xAxes: [{ display: true }],
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: true /*, fixedStepSize: 1*/,
                precision: 0,
                stepSize: 1,
              },
            },
          ],
        },
      };
    },
  },

  data() {
    return {
      dashboardBar: null,

      QtyJan: 0,
      QtyFeb: null,
      QtyMar: null,
      QtyApr: null,
      QtyMay: null,
      QtyJun: null,
      QtyJul: null,
      QtyAug: null,
      QtySep: null,
      QtyOct: null,
      QtyNov: null,
      QtyDec: null,
    };
  },
};
</script>
