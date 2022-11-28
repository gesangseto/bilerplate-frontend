<template>
  <CChartPie :datasets="defaultDatasets" :labels="['Non-Serial', 'Serial']" />
</template>

<script>
import { CChartPie } from "@coreui/vue-chartjs";

export default {
  name: "CChartPieStock",
  components: { CChartPie },
  computed: {
    defaultDatasets() {
      return [
        {
          backgroundColor: ["#41B883", "#E46651"],
          data: [this.QtyNs, this.QtyS],
        },
      ];
    },
  },
  data() {
    return {
      dashboardPie: null,
      QtyNs: null,
      QtyS: null,
    };
  },
};
</script>
