<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="packGroups"
      sort-by="idgroup"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="name"
      show-expand
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Groups</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">New group</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <!-- добавление новой группы -->
              <v-card-text v-if="editedIndex == -1">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="newGroup.groupName" 
                      label="Group name"></v-text-field>
                      <hr>
                      <v-autocomplete
                        v-model="newGroup.packIDs"
                        :items="packages"
                        item-text="pack_name"
                        item-value= idpack
                        outlined
                        dense
                        label="Packages"
                        multiple
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <!-- редактирование записи в таблице  -->
              <!-- не работает -->
              <v-card-text v-if="editedIndex >= 0">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.name" 
                      label="Group name"></v-text-field>
                      <hr>
                      <v-autocomplete
                        v-model="editedItem.packs"
                        :items="packages"
                        item-text="pack_name"
                        item-value= idpack
                        outlined
                        dense
                        label="Packages"
                        multiple
                      ></v-autocomplete>
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
        <!-- <v-icon big class="mr-2" @click="editItem(item)">mdi-pencil-outline</v-icon> -->
        <v-icon big @click="deleteItem(item, onDelete)">mdi-delete-circle-outline</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getData">Reset</v-btn>
      </template>
      <!--Выпадающий список для элементов таблицы-->
      <template v-slot:expanded-item="{ headers, item }">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title
              v-for="(pack, pack_key) in item.packs"
              v-bind:key="pack_key"
            >ID: {{pack.idpack}}, Name: {{pack.pack_name}}</v-list-item-title>
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
      dialog: false,
      singleExpand: true,
      headers: [
        {
          text: "Group name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "ID", value: "idgroup" },
        { text: "Actions", value: "action", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      packGroups: [],
      newGroup: {
        groupName: '',
        packIDs: []
      },
      packages: [],
      selectedGroup: undefined,

    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New group" : "Edit group";
    },
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
      this.getGroups();
      this.getPackages();
    },
    editItem(item) {
      this.editedIndex = this.packGroups.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item, funcDelete) {
      const index = this.packGroups.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.packGroups.splice(index, 1);
      funcDelete(item);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save(funcInsert, funcEdit) {
      //если было редактирование
      if (this.editedIndex > -1) {
        Object.assign(this.packGroups[this.editedIndex], this.editedItem);
        funcEdit(this.editedItem);
      }
      //если было добавление новой записи
      else {
        this.packGroups.push(this.editedItem);
        funcInsert(this.editedItem);
        // console.log(this.editedItem)
      }
      this.close();
    },
    onInsert() {
      var hostname = window.location.hostname;
      //var app = this;
      axios
        .post(`http://${hostname}:3000/posts/newGroup`, this.newGroup)
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
    onEdit(editedItem) {
      var hostname = window.location.hostname;
      axios
        .post(`http://${hostname}:3000/posts/editGroup`, editedItem)
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
    onDelete(item) {
      var hostname = window.location.hostname;
      axios
        .post(`http://${hostname}:3000/posts/deleteGroup`, item)
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