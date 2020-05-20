<template>
  <div id="comparisone">
    <router-view></router-view>
    <b-container class="mt-2">
      <b-row>
        <b-col cols="4">
          <v-container fluid>
            <v-row align="center">
              <v-col cols="12" sm="6">
                <v-subheader v-text="'Select packages for comparisone'"></v-subheader>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedPack"
                  :items="packages"
                  item-value="idpack"
                  item-text="pack_name"
                  :menu-props="{ maxHeight: '400' }"
                  label="Select"
                  multiple
                  chips
                  outlined
                  hint="Pick more than 1 packages"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <b-button size="lg" variant="outline-dark" @click="calc();">Calculate</b-button>
        </b-col>
        <!-- графики -->
        <b-col cols="8">
          <v-card>
            <v-card-title class="text-center justify-center py-6">
              <h1 class="font-weight-bold display-3 basil--text">Comparisone result</h1>
            </v-card-title>

            <v-tabs v-model="tab" background-color="transparent" grow>
              <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card flat>
                  <apexchart type="bar" :options="chart1.chartOptions" :series="chart1.series"></apexchart>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <apexchart type="radar" :options="chart2.chartOptions" :series="chart1.series"></apexchart>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <apexchart type="bar" :options="chart1.chartOptions" :series="chart1.series"></apexchart>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>

          <!-- <apexchart type="bar" :options="chart1.chartOptions" :series="chart1.series"></apexchart> -->
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
      tab: null,
      items: ["Bar chart", "Radar chart", "Table"],
      selectedPack: [],
      chart1: {
        series: [],
        chartOptions: {
          chart: {
            type: "bar",
            animations: {
              enabled: true,
              easing: "easeinout",
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
              return seriesName;
            },
            fontSize: "16px"
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: "center"
              },
              horizontal: false,
              columnWidth: "95%"
              // endingShape: "rounded"
            }
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
              fontSize: "18px"
              //colors: ['#333']
            }
          },
          stroke: {
            show: true,
            width: 4,
            colors: ["transparent"]
          },
          xaxis: {
            categories: [
              "Energy, MJ",
              "CO2, m^3",
              "Water, l",
              "Oil consumption, l",
              "Garbage, kg",
              "Water consumption, l",
              "Total index"
            ]
          },
          yaxis: {
            max: 1,
            min:0,
            tickAmount: 6,
            decimalsInFloat: 2,
            title: {
              text: "Relative values of environmental characteristics",
              style: {
                fontSize: "15px"
                //colors: ['#333']
              }
            }
          },
          fill: {
            opacity: 1
          },
          // tooltip: {
          //   y: {
          //     formatter: function(val) {
          //       return Number(val).toFixed(2);
          //     }
          //   }
          // }
        }
      },
      chart2: {
        chartOptions: {
          chart: {
            height: 350,
            type: "radar",
            dropShadow: {
              enabled: true,
              blur: 1,
              left: 1,
              top: 1
            }
          },
          title: {
            text: "Relative values of environmental characteristics",
            align: 'center',
            margin: 10,
            offsetY: 50,
            style: {
                fontSize: "15px",
                //colors: ['#333']
              }
          },
          stroke: {
            width: 2
          },
          fill: {
            opacity: 0.1
          },
          markers: {
            size: 5
          },
          xaxis: {
            categories: [
              "Energy, MJ",
              "CO2, m^3",
              "Water, l",
              "Oil consumption, l",
              "Garbage, kg",
              "Water consumption, l",
              "Total index"
            ],
            labels: {
              style: {
              colors: [],
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-xaxis-label',
          },
            }
          },
          yaxis: {
            max: 1,
            min:0,
            tickAmount: 8,
            decimalsInFloat: 2,
            labels: {
              style: {
              fontSize: '15px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-yaxis-label',
          },
              // formatter: function(val) {
              //   return val.toFixed(2);
              // }
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
      //let select = [app.selectedPack1, app.selectedPack2];
      let select = app.selectedPack;
      console.log(select);
      axios
        .post(`http://${hostname}:3000/posts/calc`, {
          params: {
            ID: select
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
