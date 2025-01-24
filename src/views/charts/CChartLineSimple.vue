<template>
  <CChartLine
    :datasets="computedDatasets"
    :options="computedOptions"
    :labels="labels"
  />
</template>

<script>
import { CChartLine } from '@coreui/vue-chartjs';

export default {
  name: 'CChartLineSimple',
  components: { CChartLine },
  props: {
    ...CChartLine.props,
    borderColor: {
      type: String,
      default: 'rgba(255,255,255,.55)',
    },
    backgroundColor: {
      type: String,
      default: 'transparent',
    },
    labels: {
      type: Array,
      default: [],
    },
    datasets: {
      type: Array,
      default: () => [
        {
          data: [10, 22, 34, 46, 58, 70, 46, 23, 45, 78, 34, 12],
          borderColor: 'red',
          backgroundColor: 'transparent',
          label: 'Inbound',
        },
        {
          data: [1, 15, 78, 66, 85, 3, 1, 44, 45, 15, 20, 10],
          borderColor: 'green',
          backgroundColor: 'transparent',
          label: 'Outbound',
        },
      ],
    },
    label: {
      type: String,
      default: 'Sales',
    },
    pointed: Boolean,
    pointHoverBackgroundColor: String,
  },
  computed: {
    computedDatasets() {
      for (const it of this.datasets) {
        let color = `#` + ((Math.random() * 0xffffff) << 0).toString(16);
        if (it.label == 'Inbound') {
          color = '#ff0000';
        } else if (it.label == 'Outbound') {
          color = '#00ff0d';
        }
        it.borderColor = color;
        it.backgroundColor = 'transparent';
      }

      return this.datasets;
    },
    computedOptions() {
      return {
        maintainAspectRatio: true,
        legend: {
          display: true,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: true,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                display: true,
                min: 0,
              },
            },
          ],
        },
        elements: {
          line: {
            borderWidth: 1,
          },
          hover: true,
          point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4,
          },
        },
      };
    },
  },
};
</script>
