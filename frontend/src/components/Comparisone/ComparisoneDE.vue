  
<template>

  

  <div id="comparisone">
    <router-view></router-view>
    <v-app-bar app color="green lighten-1"> 
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="caption" color = "green"
        >Программный комплекс для сравнения полимерных пленок по экологическим характеристикам</v-toolbar-title>

      <v-spacer></v-spacer>
      <table border="0">
        <tr>
          <th>
            <v-list-item to="/ComparisoneRU"> <!-- русский-->
              <v-list-item-title>RU</v-list-item-title>
            </v-list-item> 
          </th>
          <th>
            <v-list-item to="/ComparisoneDE"> <!--немецкий -->
              <v-list-item-title>DE</v-list-item-title>
            </v-list-item>
          </th>
          <td>
            <v-list-item to="/frontend/src/components/Comparisone/Comparisone.vue">
              <v-list-item-title>EN</v-list-item-title>
            </v-list-item>
          </td>
        </tr>
      </table>

      <!--/frontend/src/components/Comparisone/ComparisoneRU.vue--> <!--попробовать сделать таблицу, чтоб исправить размер ссылок
    <v-list-item to="/ComparisoneRU"> 
            <v-list-item-title>RU</v-list-item-title>
    </v-list-item> 
    <v-list-item to="/ComparisoneRU"> 
            <v-list-item-title>DE</v-list-item-title>
    </v-list-item> 
    <v-list-item to="/frontend/src/components/Comparisone/Comparisone.vue">
            <v-list-item-title>EN</v-list-item-title>
    </v-list-item>
    -->
      <v-btn class="ma-2" color="brown lighten-1" to="/login" v-if="!isLoggedIn">
        Вход
        <v-icon>mdi-login-variant</v-icon>
      </v-btn>

      <v-btn class="ma-2" color="brown lighten-1" v-if="isLoggedIn" @click="logout">
        Выход
        <v-icon>mdi-logout</v-icon>
      </v-btn>
  </v-app-bar>

 <v-container fluid>
      <v-row>
        <v-col md="3" sm="12">
          <!-- выбор группы упаковок -->
          <v-row class="pa-2">
            <territory-selection
              @updateCountry="pickedCountry = $event"
              @updateYear="pickedYear = $event"
              :myCountry = "'Belarus'"
            ></territory-selection>

 
            <v-select
              v-model="selectedGroup"
              :items="packGroups" 
              item-value="packs"
              item-text="name"
              :menu-props="{ maxHeight: '400' }"
              label="Выберите группу упаковок"
              outlined
              hint="Выберите существующую группу упаковок" 
              persistent-hint
            ></v-select>
          </v-row>
            
          <!-- выбор упаковки в группе -->
          <v-row class="pa-2">
            <v-select
              v-model="selectedPack"
              :items="selectedGroup"
              item-value="idpack"
              item-text="pack_name"
              :menu-props="{ maxHeight: '400' }"
              label="Выберите упаковки"
              multiple
              chips
              outlined
              hint="Выберите юольше одной упаковки"
              persistent-hint
            ></v-select>
          </v-row>

          <v-row class="pa-2">
            <v-subheader v-text="'Создать новую группу упаковок'"></v-subheader>
            <v-btn color="brown lighten-3" @click.stop="dialog = true" block
              >Новое сравнение</v-btn
            >
          </v-row>
          <hr />
          <v-row class="pa-2">
            <v-btn color="brown lighten-3" @click="calc()" block
              >Рассчитать</v-btn
            >
            <!-- показывает предупреждение об ошибке при создании или редактировании упаковки -->
            <v-alert
              :value="alertForm"
              dense
              type="warning"
              transition="scale-transition"
              >{{ alertMessage }}</v-alert
            >
          </v-row>
        </v-col>
        <v-col md="9" sm="12">
          <!-- графики -->
          <!-- <v-col :cols="9" lg="8" sm="6" xs="5"> -->
          <v-card color = "white lighten-3">
            <v-card-title class="text-center justify-center py-6" >
              <h1 class="font-weight-bold title basil--text" >
                Результаты рассчетов
              </h1>
            </v-card-title>

            <v-tabs v-model="tab" background-color="transparent" grow>
              <v-tab v-for="item in tabs" :key="item">{{ item }}</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item >
                <v-card flat v-if="chart1.series[0] !== undefined && chart1.series[1] !== undefined">
                  <apexchart
                    type="bar"
                    :options="chart1.chartOptions"
                    :series="chart1.series"
                  ></apexchart>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <apexchart
                    type="radar"
                    :options="chart2.chartOptions"
                    :series="chart1.series"
                  ></apexchart>
                </v-card>
              </v-tab-item>
              
              <!-- table tab -->
              <!-- МОЖНО СДЕЛАТЬ ЧЕРЕЗ DATA-ITERATORS VUETIFY -->
              <v-tab-item>
                <v-card flat>
                  <v-simple-table
                    :dense="true"
                    :fixed-header="true"
                    class="table-bordered"
                  >
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Имя упаковки</th>
                          <th class="text-left">Материал, г</th>
                          <th class="text-left">Относительные значения</th>
                          <th class="text-left">Итоговый индекс</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in forTable" :key="item.name">
                          <td class="text-left">{{ item.name }}</td>
                          <td class="text-left">
                            <tr
                              v-for="material in item.materials"
                              :key="material.name"
                            >
                              {{
                                material.name
                              }}:
                              {{
                                material.value
                              }}
                            </tr>
                          </td>

                          <td class="text-left">
                            <tr v-for="ecol in item.ecols" :key="ecol.name">
                              {{
                                ecol.name
                              }}:
                              {{
                                ecol.value
                              }},
                              {{
                                ecol.measure
                              }}
                            </tr>
                          </td>

                          <td class="text-left">{{ item.totalIndex }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
        <!-- </v-col> -->

        <!-- добавление новой группы -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Выберите упаковки для нового сравнения</span>
            </v-card-title>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="newGroup.groupName"
                    label="Имя сравнения"
                    hint="Вы можете заполнить это поле позже, если решите сохранить сравнение"
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
                    label="Упаковки"
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
                >Cancel</v-btn
              >
              <v-btn
                color="light-blue lighten-4"
                :disabled="btnSaveSelection"
                @click="saveGroup()"
                >Save group</v-btn
              >
              <v-btn color="blue darken-1" text @click="createGroup"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import territoryNyearSelection from "./_territoryNyearSelection";
export default {
  components: {
    "territory-selection": territoryNyearSelection,
  },
  name: "comparisone",
  data() {
    return {
      // --------------выбор страны и года
      pickedCountry: "",
      pickedYear: 0,
      // --------------форма с результатами(графики и таблица)
      tab: null,

      
      tabs: ["Гистаграмма", "Диаграмма", "Таблица"], 
      


      // ----------для селектов упаковок
      packages: [], 

      selectedPack: [], 
      // ------------для групп упаковок
      packGroups: [],
      selectedGroup: undefined,
      btnSaveSelection: false,
      newGroup: {
        groupName: "",
        packIDs: [],
      },
      dialog: false,
      //показывает предупреждение об ошибке при создании или редактировании упаковки
      alertForm: false,
      alertMessage: "",
      // --------------для таблицы с результатами
      headers: [
        {
          text: "Имя упаковки",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Материалы" },
        { text: "Относительные значения" },
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
                delay: 150,
              },
              dynamicAnimation: {
                enabled: true,
                speed: 350,
              },
            },
          },
          legend: {
            show: true,
            formatter: function(seriesName) {
              return seriesName;
            },
            fontSize: "16px",
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: "center",
              },
              horizontal: false,
              columnWidth: "80%",
              // endingShape: "rounded"
            },
          },
          //уменьшение размера графика на мобильных устройствах
          responsive: [
            {
              breakpoint: 1000,
              options: {
                chart: {
                  height: "250",
                  width: "100%",
                },
                plotOptions: {
                  bar: {
                    dataLabels: {
                      position: "center",
                    },
                    horizontal: false,
                    columnWidth: "80%",
                  },
                },
                legend: {
                  show: true,
                  formatter: function(seriesName) {
                    return seriesName;
                  },
                  fontSize: "8px",
                },
                dataLabels: {
                  enabled: false,
                },
                yaxis: {
                  max: 1,
                  min: 0,
                  tickAmount: 2,
                  decimalsInFloat: 1,
                  title: {
                    text: "Относительные значения экологических характеристик",
                    style: {
                      fontSize: "7px",
                      //colors: ['#333']
                    },
                  },
                },
                xaxis: {
                  labels: {
                    show: true,
                    rotate: -90,
                    rotateAlways: false,
                    trim: true,
                    minHeight: undefined,
                    maxHeight: 120,
                    style: {
                      colors: [],
                      fontSize: "6px",
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: 400,
                      cssClass: "apexcharts-xaxis-label",
                    },
                    offsetX: 0,
                    offsetY: 0,
                  },
                },
              },
            },
          ],
          dataLabels: {
            enabled: true,
            dropShadow: {
              enabled: true,
              left: 2,
              top: 2,
              opacity: 0.5,
            },
            style: {
              fontSize: "18px",
              //colors: ['#333']
            },
          },
          stroke: {
            show: true,
            width: 4,
            colors: ["transparent"],
          },
          xaxis: {
            categories: [
              "Энергия, мДж/кг",
              "CO2, м³/кг",
              "Вода, л/кг",
              "Расход нефти, л/кг",
              "Мусор, кг/кг",
              "Расход воды, л/кг",
              "Итоговый индекс",
            ],
          },
          yaxis: {
            max: 1,
            min: 0,
            tickAmount: 6,
            decimalsInFloat: 2,
            title: {
              text: "Относительные значения экологических характеристик",
              style: {
                fontSize: "15px",
                //colors: ['#333']
              },
            },
          },
          fill: {
            opacity: 1,
          },
          // tooltip: {
          //   y: {
          //     formatter: function(val) {
          //       return Number(val).toFixed(2);
          //     }
          //   }
          // }
        },
      },
      // --------лепестковая диаграмма
      chart2: {
        chartOptions: {
          chart: {
            type: "radar",
            dropShadow: {
              enabled: true,
              blur: 1,
              left: 1,
              top: 1,
            },
          },
          title: {
            text: "Относительные значения экологических характеристик",
            align: "center",
            margin: 10,
            offsetY: 50,
            style: {
              fontSize: "15px",
              //colors: ['#333']
            },
          },
          stroke: {
            width: 2,
          },
          fill: {
            opacity: 0.1,
          },
          markers: {
            size: 5,
          },
          xaxis: {
            categories: [
              "Энергия, мДж/кг",
              "CO2, м³/кг",
              "Вода, л/кг",
              "Расход нефти, л/кг",
              "Мусор, кг/кг",
              "Расход воды, л/кг",
              "Итоговый индекс",
            ],
            labels: {
              style: {
                colors: [],
                fontSize: "16px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 400,
                cssClass: "apexcharts-xaxis-label",
              },
            },
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
                cssClass: "apexcharts-yaxis-label",
              },
              // formatter: function(val) {
              //   return val.toFixed(2);
              // }
            },
          },
          responsive: [
            {
              breakpoint: 1000,
              options: {
                chart: {
                  height: "250",
                  width: "100%",
                },
                title: {
                  text: "Относительные значения экологических характеристик",
                  align: "center",
                  margin: 10,
                  offsetY: 10,
                  style: {
                    fontSize: "6px",
                  },
                },
                markers: {
                  size: 1,
                },
                xaxis: {
                  labels: {
                    style: {
                      colors: [],
                      fontSize: "6px",
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: 400,
                      cssClass: "apexcharts-xaxis-label",
                    },
                  },
                },
                yaxis: {
                  min: 0,
                  tickAmount: 2,
                  decimalsInFloat: 1,
                  labels: {
                    style: {
                      fontSize: "6px",
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: 400,
                      cssClass: "apexcharts-yaxis-label",
                    },
                    // formatter: function(val) {
                    //   return val.toFixed(2);
                    // }
                  },
                },
              },
            },
          ],
        },
      },
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
    },
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
        .then((response) => {
          //console.log(response);
          app.packages = response.data;
        })
        .catch((error) => {
          alert(error + "\n Ошибка подключения к базе данных");
          console.log("-----error-------");
          console.log(error);
        });
    },

    getGroups() {
      const app = this;
      var hostname = window.location.hostname;
      return new Promise((resolve, reject) => {
        axios
          .get(`http://${hostname}:3000/posts/groups`)
          .then((response) => {
            app.packGroups = response.data;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
            alert(error + "\n Ошибка подключения к базе данных");
            console.log("-----error-------");
            console.log(error);
          });
      });
    },
    // ----------- пост запросы в бд
    calc() {
      var app = this;
      if (app.selectedPack.length >= 2) {
        app.alertForm = false;
        var hostname = window.location.hostname;
        let select = app.selectedPack;
        app.forTable = [];
        //console.log(select);
        axios
          .post(`http://${hostname}:3000/posts/calc`, {
            params: {
              ID: select,
              country: this.pickedCountry,
              year: this.pickedYear
            },
          })
          .then((response) => {
            console.log(response.data);
            app.chart1.series = response.data[0];
            app.forTable = response.data[1];
            app.chart1.chartOptions.xaxis.categories = response.data[2];
            app.chart2.chartOptions.xaxis.categories = response.data[2];
          })
          .catch((error) => {
            this.chart1Status = "ERROR"
            console.log("-----error-------");
            console.log(error);
          });
      } else {
        app.alertMessage = "Pick more than 1 package for comparisone";
        app.alertForm = true;
      }
    },
    saveGroup() {
      var app = this;
      var hostname = window.location.hostname;
      this.dialog = false;
      axios
        .post(`http://${hostname}:3000/posts/newGroup`, app.newGroup)
        .then((response) => {
          console.log(response);
          this.getData();
        })
        .catch((error) => {
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
    },
    // groupIndex(groups){
    //   //console.log(groups,this.selectedGroup)
    //   if (this.selectedGroup == 0){
    //     this.selectedGroup = groups[0].idgroup
    //   }
    //   return groups.findIndex(i => i.idgroup === this.selectedGroup)
    // }
  },
};
</script>

