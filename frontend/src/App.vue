<template>
  <div id="app">
    <b-container class="mt-2">
      <b-row>
        <b-col cols="4">
          <b-form-select v-model="selectedPack1" :options="packages" class="mb-2"></b-form-select>
          <b-form-select v-model="selectedPack2" :options="packages" class="mb-2"></b-form-select>
          <b-button>Расчитать</b-button>
        </b-col>
        <b-col cols="8">
          <apexchart type="bar" :options="chart1.chartOptions" :series="chart1.series"></apexchart>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "app",
  // components: {
  //   apexchart: VueApexCharts
  // },
  data() {
    return {
      selectedPack1: null,
      selectedPack2: null,
      chart1: {
        series: [
          {
            name: "Net Profit",
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
          },
          {
            name: "Revenue",
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
          },
          {
            name: "Free Cash Flow",
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
          }
        ],
        chartOptions: {
          chart: {
            type: "bar"
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "95%",
              // endingShape: "rounded"
            }
          },
          dataLabels: {
            enabled: true
          },
          stroke: {
            show: true,
            width: 4,
            colors: ["transparent"]
          },
          xaxis: {
            categories: [
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct"
            ]
          },
          yaxis: {
            title: {
              text: "$ (thousands)"
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return "$ " + val + " thousands";
              }
            }
          }
        }
      },
      packages: []
    };
  },
  created() {
    this.getPackages();
  },
  methods: {
    getPackages() {
      var app = this;
      axios
        .get("http://localhost:3000/posts")
        .then(response => {
          console.log(response);
          app.packages = response.data;
        })
        .catch(error => {
          console.log("-----error-------");
          console.log(error);
        });
    },
    calc() {
      var app = this;
      axios
        .get("http://localhost:3000/calc")
        .then(response => {
          app.chart1.series = response.data.series;

        })
        .catch(error => {
          console.log("-----error-------");
          console.log(error);
        });
    }
  }
};
</script>

<style>
</style>
