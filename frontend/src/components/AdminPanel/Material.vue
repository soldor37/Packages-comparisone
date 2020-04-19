<template>
<div>
  <v-data-table
    :headers="headers"
    :items="packfull"
    sort-by="ID"
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    item-key="material_name"
    show-expand
    class="elevation-1"
  >
  
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Materials</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New material</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <!-- редактирование записи в таблице-->
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.material_name" label="Material name"></v-text-field>
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
      <v-btn color="primary" @click="getMaterials">Reset</v-btn>
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
      dialog: false,
      singleExpand: true,
      headers: [
        {
          text: 'Material name',
          align: 'left',
          sortable: false,
          value: 'material_name',
        },
        { text: 'ID', value: 'idmaterials' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
      },
      defaultItem: {
        pack_name: '',
      },
      materials: [],
    };
  },
  computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New material' : 'Edit material'
      },
      packfull (){
        if(this.materials == null){
          return null;
        }
        let app = this;

        return app.materials;
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
      this.getMaterials()
    },
    editItem (item) {
        this.editedIndex = item.idmaterials;
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item, funcDelete) {
        const index = this.materials.indexOf(item.id)
        confirm('Are you sure you want to delete this item?') && this.materials.splice(index, 1)
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
          Object.assign(this.materials[this.editedIndex], this.editedItem)
          funcEdit(this.editedItem)
        }
        //если было добавление новой записи 
        else {
          this.materials.push(this.editedItem)
          funcInsert(this.editedItem)
          //console.log(this.editedItem)
        }
        this.close()
        
      },
      onInsert(item){
        var hostname = window.location.hostname;
        //var app = this;
        axios
        .post(`http://${hostname}:3000/posts/insertMaterial`, item)
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
        .post(`http://${hostname}:3000/posts/editMaterial`, editedItem)
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
        .post(`http://${hostname}:3000/posts/deleteMaterial`, item)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          alert(error + "\n Failed to POST on server");
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