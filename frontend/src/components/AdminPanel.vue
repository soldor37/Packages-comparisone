<template>
<div>
  <v-data-table
    :headers="headers"
    :items="packages"
    sort-by="ID"
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
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <!-- что лежит в таблице-->
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.pack_name" label="Package name"></v-text-field>
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
  </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "adminpanel",
  data() {
    return {
      dialog: false,
      headers: [
        {
          text: 'Package name',
          align: 'left',
          sortable: false,
          value: 'pack_name',
        },
        { text: 'ID', value: 'idpack' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        pack_name: '',
        idpack: '',
      },
      defaultItem: {
        pack_name: '',
      },
      packages: []
    };
  },
  computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    created () {
      this.getPackages()
    },
  methods: {
    editItem (item) {
        this.editedIndex = this.packages.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item, funcDelete) {
        const index = this.packages.indexOf(item)
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
          this.getPackages()
          console.log(response);
        })
        .catch(error => {
          alert(error + "\n Failed to POST on server");
          console.log("-----error-------");
          console.log(error);
        });
      },
      onEdit(item){
        var hostname = window.location.hostname;
        //var app = this;
        axios
        .post(`http://${hostname}:3000/posts/edit`, item)
        .then(response => {
          this.getPackages()
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
    }
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