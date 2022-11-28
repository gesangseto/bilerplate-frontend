import { mixins, Pie } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ["options", "chartData"],
  mounted() {
    this.options.scales = {};
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    options: {
      handler: function (newChartOptions) {
        this.$data._chart.destroy();
        this.renderChart(this.chartData, newChartOptions);
      },
    },
  },
};
