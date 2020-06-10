<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="packfull"
      :search="search"
      sort-by="ID"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="name"
      show-expand
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Packages</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="900px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">New item</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <!-- добавление новой упк -->
              <v-card-text v-if="editedIndex == -1">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.name" label="Package name"></v-text-field>
                      <v-autocomplete
                        v-model="select_materials"
                        :items="material_for_select"
                        outlined
                        dense
                        label="Materials"
                        multiple
                      ></v-autocomplete>

                      <v-data-table
                        :headers="headers_material"
                        :items="material_items_for_table"
                        sort-by="ID"
                        item-key="name"
                        class="elevation-1"
                      >
                        <template v-slot:item.value="props">
                          <v-edit-dialog
                            :return-value.sync="props.item.value"
                            large
                            persistent
                            @save="saveInput"
                            @cancel="cancelInput"
                            @open="openInput"
                            @close="closeInput"
                          >
                            <div>{{ props.value }}</div>
                            <template v-slot:input>
                              <div class="mt-4 title">Update value</div>
                            </template>
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.value"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save(onInsert)">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getPackages">Reset</v-btn>
      </template>
      <!--Выпадающий список для элементов таблицы-->
      <template v-slot:expanded-item="{ headers, item }">
        <v-simple-table :dense="true" class="table-bordered">
          <thead>
            <tr>
              <th class="text-left">Material</th>
              <th class="text-left">Value, g</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mat in item.materials" :key="mat.name">
              <template v-if="mat.mass > 0">
                <td class="text-left">{{ mat.name }}</td>
                <td class="text-left">{{ mat.mass }}</td>
              </template>
            </tr>
          </tbody>
        </v-simple-table>
        <!-- другой вариант отображения списка материалов -->
        <!-- <v-list-item-title two-line v-for="(mat, key) in item.materials" v-bind:key="key">
          <template v-if="mat.mass > 0">
            {{mat.name }} : {{mat.mass}}, (kg)
            <v-divider inset></v-divider>
          </template>
        </v-list-item-title>-->
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "adminpanel",
  data() {
    return {
      search: '',
      expanded: [],
      expanded1: [],
      snack: false,
      snackColor: "",
      snackText: "",
      dialog: false,
      singleExpand: true,
      headers: [
        { text: "ID", value: "id" },
        {
          text: "Package name",
          align: "left",
          sortable: false,
          value: "name"
        },
        
      ],
      headers_material: [
        {
          text: "Material name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Weight, g", value: "value" }
      ],
      editedIndex: -1,
      editedItem: {
        pack_name: "",
        idpack: ""
      },
      defaultItem: {
        pack_name: ""
      },
      packages: [],
      materials: [],
      select_materials: [],
      weight: [],
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    material_items_for_table() {
      let idmat = 0;
      return this.select_materials.map(el => {
        this.materials.forEach(function(mat) {
          if (mat.material_name == el) {
            idmat = mat.idmaterials;
          }
        });
        return {
          name: el,
          value: 0,
          id: idmat
        };
      });
    },
    material_for_select() {
      return this.materials.map(el => {
        return el.material_name;
      });
    },
    packfull() {
      if (
        this.packages == null &&
        this.materials == null &&
        this.weight == null
      ) {
        return null;
      }
      let app = this;
      return this.packages.map(function(pk) {
        return {
          id: pk.idpack,
          name: pk.pack_name,
          materials: app.materials.map(function(material) {
            let ecolcharacts = [];
            let mass = 0;
            app.weight.forEach(function(w) {
              if (
                w.fk_packaging == pk.idpack &&
                w.fk_materials == material.idmaterials
              ) {
                mass = w.material_weight;
              }
            });
            return {
              idmaterials: material.idmaterials,
              name: material.material_name,
              mass: mass,
              ecolcharacts: ecolcharacts
            };
          })
        };
      });
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.getPackages();
      this.getMaterials();
      this.getWeight();
    },
    saveInput() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
    },
    cancelInput() {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    openInput() {
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "Dialog opened";
    },
    closeInput() {
      console.log("Dialog closed");
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save(funcInsert) {
        this.packages.push(this.editedItem);

        let new_pack = {
          name: this.editedItem.name,
          materials: this.material_items_for_table.map(mat => {
            return {
              name: mat.name,
              value: mat.value,
              id: mat.id
            };
          })
        };
        funcInsert(new_pack);
      
      this.close();
    },
    onInsert(item) {
      var hostname = window.location.hostname;
      //var app = this;
      axios
        .post(`http://${hostname}:3000/posts/insert`, item)
        .then(response => {
          this.getData();
          console.log(response);
        })
        .catch(error => {
          alert(error + "\n Failed to POST on server");
          console.log("-----error-------");
          console.log(error);
        });
    },
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
          alert(error + "\n Failed connect to DB");
          console.log("-----error-------");
          console.log(error);
        });
    },
    getMaterials() {
      var app = this;
      var hostname = window.location.hostname;
      axios
        .get(`http://${hostname}:3000/posts/DBmaterials`)
        .then(response => {
          console.log(response);
          app.materials = response.data;
        })
        .catch(error => {
          alert(error + "\n Failed connect to DB");
          console.log("-----error-------");
          console.log(error);
        });
    },
    getWeight() {
      var app = this;
      var hostname = window.location.hostname;
      axios
        .get(`http://${hostname}:3000/posts/DBweight`)
        .then(response => {
          console.log(response);
          app.weight = response.data;
        })
        .catch(error => {
          alert(error + "\n Failed connect to DB");
          console.log("-----error-------");
          console.log(error);
        });
    },
    getEcolchar() {
      var app = this;
      var hostname = window.location.hostname;
      axios
        .get(`http://${hostname}:3000/posts/DBecolchar`)
        .then(response => {
          console.log(response);
          app.ecolchar = response.data;
        })
        .catch(error => {
          alert(error + "\n Failed connect to DB");
          console.log("-----error-------");
          console.log(error);
        });
    },
  }
};
</script>
<!-- инкапсулированные стили компонента -->
<style>
#adminpanel {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>