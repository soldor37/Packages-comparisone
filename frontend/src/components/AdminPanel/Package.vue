<template>
<div>
  <v-data-table
    :headers="headers"
    :items="packfull"
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
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
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
                                    >
                                </v-autocomplete>

                                <v-data-table
                                    :headers="headers_material"
                                    :items="material_items_for_table"
                                    sort-by="ID"
                                    :single-expand="singleExpand"
                                    :expanded.sync="expanded1"
                                    item-key="name"
                                    show-expand
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
                                    <template v-slot:expanded-item="{ item }" >
                                        <v-list-item>
                                            <v-list-item-content> 
                                                <v-list-item-title v-for="(el, key) in item.ecols" v-bind:key="key">
                                                    {{el.ecol_name}} : {{el.value}}
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>

                                </v-data-table>





                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            


            <!-- редактирование записи в таблице-->
            <v-card-text v-if="editedIndex >= 0">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="8" md="8">
                    <v-text-field v-model="editedItem.name" label="Package name"></v-text-field>                    
                    <div v-for="(mat, mat_key) in editedItem.materials" v-bind:key="mat_key" >
                      <v-text-field  v-model="editedItem.materials[mat_key].mass" :label="mat.name + ', (kg)'"></v-text-field>
                      <br>
                      <v-text-field  class="ml-5" v-for="(eco, eco_key) in mat.ecolcharacts" v-model="editedItem.materials[mat_key].ecolcharacts[eco_key].value" :label="eco.name +', ('+ eco.measure+')'" v-bind:key="eco_key"></v-text-field>
                      <br>
                    </div>
                    <div>
                        <v-text-field v-for="(koeff, koeff_key) in editedItem.ecolkoeff" v-bind:key="koeff_key" v-model="editedItem.ecolkoeff[koeff_key].value" :label="editedItem.materials[0].ecolcharacts[koeff_key].name + ' criteria'"></v-text-field>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save(onInsert,onEdit)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        big
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil-outline
      </v-icon>
      <v-icon
        big
        @click="deleteItem(item, onDelete)"
      >
        mdi-delete-circle-outline
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="getPackages">Reset</v-btn>
    </template>
    <!--Выпадающий список для элементов таблицы-->
    <template v-slot:expanded-item="{ headers, item }" >
      <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title v-for="(mat, key) in item.materials" v-bind:key="key">
          {{mat.name }} : {{mat.mass}}, (kg)
          <v-list-item-subtitle v-for="(ecol, eco_key) in mat.ecolcharacts" v-bind:key="eco_key">{{ecol.name}} : {{ecol.value}}, ({{ecol.measure}})</v-list-item-subtitle>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
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
      expanded: [],
      expanded1: [],
      snack: false,
      snackColor: '',
      snackText: '',
      dialog: false,
      singleExpand: true,
      headers: [
        {
          text: 'Package name',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: 'ID', value: 'id' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      headers_material: [
          {
          text: 'Material name',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: 'value', value: 'value' }
      ],
      editedIndex: -1,
      editedItem: {
        pack_name: '',
        idpack: '',
      },
      defaultItem: {
        pack_name: '',
      },
      packages: [],
      materials: [],
      select_materials: [],
      weight: [],
      ecolchar: [],
      ecolkoeff: [],
      ecoldict: [],
    };
  },
  computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      material_items_for_table () {
          return this.select_materials.map(el => {
              return {
                  name: el,
                  value: 0,
                  ecols: this.ecoldict
              };
          })
      },
      material_for_select (){
        return this.materials.map(el => {return el.material_name})
      },
      packfull (){
        if(this.packages == null && this.materials == null && this.weight == null){
          return null;
        }
        let app = this;
        return this.packages.map(function(pk){
            return {
              'id': pk.idpack,
              'name': pk.pack_name,
              'ecolkoeff': app.ecolkoeff,
              'materials': app.materials.map(function(material){
                let mass = 0;
                app.weight.forEach(function(w){
                    if(w.fk_id_pack ==  pk.idpack && w.fk_id_material == material.idmaterials)
                    {
                      mass = w.material_weight;
                    }
                });
                let ecolcharacts = [];
                app.ecolchar.forEach(function(e){
                  if(e.fk_id_material == material.idmaterials){                    
                    let tmp = {
                      'idecol': e.idecol,
                      'name': e.ecol_name,
                      'value': e.ecol_value,
                      'measure': e.ecol_measure
                    }
                    ecolcharacts.push(tmp);
                  }
                });

                return {
                  'idmaterials': material.idmaterials,
                  'name': material.material_name,
                  'mass': mass,
                  'ecolcharacts': ecolcharacts
                }
              }),
            }
        });




      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    created () {
      this.getData();
    },
  methods: {
    getData() {
      this.getPackages();
      this.getMaterials();
      this.getWeight();
      this.getEcolchar();
      this.getEcolkoeff();
      this.getEcolDict();      
    },
    saveInput () {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancelInput () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    openInput () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    closeInput () {
      console.log('Dialog closed')
    },
    editItem (item) {
        this.editedIndex = item.id;
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item, funcDelete) {
        const index = this.packages.indexOf(item.id)
        confirm('Are you sure you want to delete this item?') && this.packages.splice(index, 1)
        funcDelete(item)
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save (funcInsert,funcEdit) {
        //если было редактирование
        if (this.editedIndex > -1) {
          Object.assign(this.packages[this.editedIndex], this.editedItem)
          funcEdit(this.editedItem)
        }
        //если было добавление новой записи 
        else {
          this.packages.push(this.editedItem)
          funcInsert(this.editedItem)
          //console.log(this.editedItem)
        }
        this.close()
        
      },
      onInsert(item){
        var hostname = window.location.hostname;
        //var app = this;
        axios
        .post(`http://${hostname}:3000/posts/insert`, item)
        .then(response => {
          this.getData()
          console.log(response);
        })
        .catch(error => {
          alert(error + "\n Failed to POST on server");
          console.log("-----error-------");
          console.log(error);
        });
      },
      onEdit(editedItem){
        var hostname = window.location.hostname;
        axios
        .post(`http://${hostname}:3000/posts/edit`, editedItem)
        .then(response => {
          this.getData()
          console.log(response);
        })
        .catch(error => {
          alert(error + "\n Failed to POST on server");
          console.log("-----error-------");
          console.log(error);
        });
      },
      onDelete(item){
        var hostname = window.location.hostname;
        axios
        .post(`http://${hostname}:3000/posts/delete`, item)
        .then(response => {
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
    getEcolkoeff() {
      var app = this;
      var hostname = window.location.hostname;
      axios
        .get(`http://${hostname}:3000/posts/DBecolkoeff`)
        .then(response => {
          console.log(response);
          app.ecolkoeff = response.data;
        })
        .catch(error => {
          alert(error + "\n Failed connect to DB");
          console.log("-----error-------");
          console.log(error);
        });
    },
    getEcolDict() {
      var app = this;
      var hostname = window.location.hostname;
      axios
        .get(`http://${hostname}:3000/posts/ecol_dict`)
        .then(response => {
          console.log(response);
          app.ecoldict = response.data;
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