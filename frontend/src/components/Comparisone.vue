<template>
  <div id="comparisone">
    <router-view></router-view>
    <b-container class="mt-2">
      <b-row>
        <b-col cols="4">
          <v-container fluid>
            <v-row align="center">
              <!-- выбор группы упаковок -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedGroup"
                  :items="packGroups"
                  item-value="packs"
                  item-text="name"
                  :menu-props="{ maxHeight: '400' }"
                  label="Select"
                  outlined
                  hint="Select an existing package group"
                  persistent-hint
                ></v-select>
              </v-col>
              <!-- выбор упаковки в группе -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedPack"
                  :items="selectedGroup"
                  item-value="idpack"
                  item-text="pack_name"
                  :menu-props="{ maxHeight: '400' }"
                  label="Select"
                  multiple
                  chips
                  outlined
                  hint="Pick more than 1 package"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <v-col>
            <hr />
            <v-subheader v-text="'Create a new package group'"></v-subheader>
            <b-button size="md" variant="outline-dark" @click.stop="dialog = true">New comparisone</b-button>
            <v-divider class="mx-10" :inset="false" vertical></v-divider>
            <hr />
            <b-button size="lg" variant="outline-dark" @click="calc();">Calculate</b-button>
          </v-col>
        </b-col>
        <!-- доавление новой группы -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Select packages for new comparisone</span>
            </v-card-title>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="newGroup.groupName"
                    label="Comparisone name"
                    hint="You can fill this field later, if you decide to save comparisone"
                    persistent-hint
                  ></v-text-field>
                  <hr />
                  <v-autocomplete
                    v-model="selectedGroup"
                    :items="packages"
                    return-object
                    item-text="pack_name"
                    outlined
                    dense
                    label="Packages"
                    multiple
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :absolute="true"
                :left="true"
                color="blue darken-1"
                text
                @click="dialog = false"
              >Cancel</v-btn>
              <v-btn
                color="light-blue lighten-4"
                :disabled="btnSaveSelection"
                @click="saveGroup()"
              >Save group</v-btn>
              <v-btn color="blue darken-1" text @click="createGroup">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- графики -->
        <b-col cols="8">
          <v-card>
            <v-card-title class="text-center justify-center py-6">
              <h1 class="font-weight-bold display-3 basil--text">Comparisone result</h1>
            </v-card-title>

            <v-tabs v-model="tab" background-color="transparent" grow>
              <v-tab v-for="item in tabs" :key="item">{{ item }}</v-tab>
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
              <!-- table tab -->
              <!-- МОЖНО СДЕЛАТЬ ЧЕРЕЗ DATA-ITERATORS VUETIFY -->
              <v-tab-item>
                <v-card flat>
                  <v-simple-table
                   height="600px"
                   :dense="true" 
                   :fixed-header="true" 
                   class="table-bordered">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Package name</th>
                          <th class="text-left">Materials, kg</th>
                          <th class="text-left">Relative values</th>
                          <th class="text-left">Total index</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in forTable" :key="item.name">
                          <td class="text-left">
                            {{ item.name }}
                          </td>
                          <td class="text-left">
                            <tr v-for="material in item.materials" :key="material.name">
                              {{material.name}}: {{material.value}}
                            </tr>
                          </td>
                          <td class="text-left">
                          <tr v-for="ecol in item.ecols" :key="ecol.name">
                              {{ecol.name}}: {{ecol.value}}, {{ecol.measure}}
                            </tr>
                          </td>
                          <td class="text-left">
                          {{item.totalIndex}}
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
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
      // --------------форма с результатами(графики и таблица)
      tab: null,
      tabs: ["Bar chart", "Radar chart", "Table"],
      // ----------для селектов упаковок
      packages: [],
      selectedPack: [],
      // ------------для групп упаковок
      packGroups: [],
      selectedGroup: undefined,
      btnSaveSelection: false,
      newGroup: {
        groupName: "",
        packIDs: []
      },
      dialog: false,
      // --------------для таблицы с результатами
      headers: [
          {
            text: 'Package name',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Materials' },
          { text: 'Relative values'},
        ],
      forTable: [],
      // -----гистограмма
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
              "Energy, MJ/kg",
              "CO2, m^3/kg",
              "Water, l/kg",
              "Oil consumption, l/kg",
              "Garbage, kg",
              "Water consumption, l/kg",
              "Total index"
            ]
          },
          yaxis: {
            max: 1,
            min: 0,
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
          }
          // tooltip: {
          //   y: {
          //     formatter: function(val) {
          //       return Number(val).toFixed(2);
          //     }
          //   }
          // }
        }
      },
      // --------лепестковая диаграмма
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
            align: "center",
            margin: 10,
            offsetY: 50,
            style: {
              fontSize: "15px"
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
                fontSize: "16px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 400,
                cssClass: "apexcharts-xaxis-label"
              }
            }
          },
          yaxis: {
            max: 1,
            min: 0,
            tickAmount: 8,
            decimalsInFloat: 2,
            labels: {
              style: {
                fontSize: "15px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 400,
                cssClass: "apexcharts-yaxis-label"
              }
              // formatter: function(val) {
              //   return val.toFixed(2);
              // }
            }
          }
        }
      }
    };
  },
  watch: {
    // newGroup: function(){
    //   this.btnSaveSelection = false
    //   // if(this.newGroup.groupName != "" && this.newGroup.packIDs.lenght >=2){
    //   //   this.btnSaveSelection = false
    //   // }
    //   // else{
    //   //   this.btnSaveSelection = true
    //   // }
    // },
    selectedGroup: function() {
      this.selectedPack = [];
      let tmp = [];
      this.selectedGroup.map(function(item) {
        tmp.push(item.idpack);
      });
      this.newGroup.packIDs = tmp;
    },
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.getData();
  },
  methods: {
    // -----получение данных из бд
    getData() {
      this.getPackages();
      this.getGroups();
    },
    getPackages() {
      var app = this;
      var hostname = window.location.hostname;
      axios
        .get(`http://${hostname}:3000/posts`)
        .then(response => {
          //console.log(response);
          app.packages = response.data;
        })
        .catch(error => {
          alert(error + "\n Ошибка подключения к базе данных");
          console.log("-----error-------");
          console.log(error);
        });
    },
    getGroups() {
      var app = this;
      var hostname = window.location.hostname;
      axios
        .get(`http://${hostname}:3000/posts/groups`)
        .then(response => {
          //console.log(response);
          app.packGroups = response.data;
        })
        .catch(error => {
          alert(error + "\n Ошибка подключения к базе данных");
          console.log("-----error-------");
          console.log(error);
        });
    },
    // ----------- пост запросы в бд
    calc() {
      var app = this;
      var hostname = window.location.hostname;
      let select = app.selectedPack;
      //console.log(select);
      axios
        .post(`http://${hostname}:3000/posts/calc`, {
          params: {
            ID: select
          }
        })
        .then(response => {
          app.chart1.series = response.data[0];
          app.forTable = response.data[1]
        })
        .catch(error => {
          console.log("-----error-------");
          console.log(error);
        });
    },
    saveGroup() {
      var app = this;
      var hostname = window.location.hostname;
      this.dialog = false;
      axios
        .post(`http://${hostname}:3000/posts/newGroup`, app.newGroup)
        .then(response => {
          console.log(response);
          this.getData();
        })
        .catch(error => {
          console.log("-----error-------");
          console.log(error);
        });
    },
    // ------функциии
    createGroup() {
      let tmp = [];
      this.selectedGroup.map(function(item) {
        tmp.push(item.idpack);
      });
      this.selectedPack = tmp;
      this.dialog = false;
    },
    close() {
      this.dialog = false;
    }
    // groupIndex(groups){
    //   //console.log(groups,this.selectedGroup)
    //   if (this.selectedGroup == 0){
    //     this.selectedGroup = groups[0].idgroup
    //   }
    //   return groups.findIndex(i => i.idgroup === this.selectedGroup)
    // }
  }
};
</script>
