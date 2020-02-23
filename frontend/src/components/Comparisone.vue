<template>
  <div id="comparisone">
    <router-view></router-view>
    <b-container class="mt-2">
      <b-row>
        <b-col cols="4">
          <b-form-select v-model="selectedPack1" :options="packages" value-field="idpack" text-field="pack_name" class="mb-2"></b-form-select>
          <b-form-select v-model="selectedPack2" :options="packages" value-field="idpack" text-field="pack_name" class="mb-2"></b-form-select>
          <b-button size="lg" variant="outline-dark" @click="calc();">Calculate</b-button>
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
  name: "comparisone",
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
            type: "bar",
            animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
            enabled: false,
            delay: 150
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
    }            
          },
          //TODO: вывод названия упаковки
          legend: {
            show: true,
            formatter: function(seriesName) {
              return seriesName
            },
            fontSize: '16px'
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: 'center'
              },
              horizontal: false,
              columnWidth: "95%",
              // endingShape: "rounded"
            },
          },
          dataLabels: {
              enabled: true,
              dropShadow: {
                  enabled: true,
                  left: 2,
                  top: 2,
                  opacity: 0.5
              },
              style: {
                fontSize: '18px',
                //colors: ['#333']
              },
              
            },
          stroke: {
            show: true,
            width: 4,
            colors: ["transparent"]
          },
          xaxis: {
            categories: [
              "air, m^2",
              "water, l",
              "energy, MJ",
              "oil consumption, l"
            ]
          },
          yaxis: {
            title: {
              text: "Relative values of environmental characteristics",
              style: {
                fontSize: '15px',
                //colors: ['#333']
              },
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return Number(val).toFixed(2);
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
      var hostname = window.location.hostname;
      axios
        .get(`http://${hostname}:3000/posts`)
        .then(response => {
          console.log(response);
          app.packages = response.data;
        })
        .catch(error => {
          alert(error + "\n Ошибка подключения к базе данных");
          console.log("-----error-------");
          console.log(error);
        });
    },
    calc() {
      var app = this;
      var hostname = window.location.hostname;
      let select = [app.selectedPack1, app.selectedPack2];
      console.log(select);
      axios
        .post(`http://${hostname}:3000/posts/calc`,{
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
