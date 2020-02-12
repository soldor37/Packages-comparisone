<template>
  <div id="app">
    <b-container class="mt-2">
      <b-row>
        <b-col cols="4">
          <b-form-select v-model="selectedPack1" :options="packages" value-field="idpack" text-field="pack_name" class="mb-2"></b-form-select>
          <b-form-select v-model="selectedPack2" :options="packages" value-field="idpack" text-field="pack_name" class="mb-2"></b-form-select>
          <b-button @click="calc();">Рассчитать</b-button>
        </b-col>
        <b-col cols="8">
          <apexchart type="bar" :options="chart1.chartOptions" :series="chart1.series" ></apexchart>
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
      selectedPack1: 1,
      selectedPack2: 2,
      chart1: {
        series:[],
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
              "air",
              "water",
              "energy",
              "oil"
            ]
          },
          yaxis: {
            title: {
              text: "Measure"
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
      let select = [app.selectedPack1, app.selectedPack2];
      console.log(select);
      axios
        .post("http://localhost:3000/posts/calc",{
          params: {
            ID : select
          }
        })
        .then(response => {
          app.chart1.series = response.data;
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
