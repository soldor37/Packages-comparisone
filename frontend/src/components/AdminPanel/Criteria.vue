<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="criteria"
      :search="search"
      sort-by="idecol"
      item-key="ecol_name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Criteria</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <!-- редактирование записи в таблице-->
              <v-card-text v-if="editedIndex >= 0">
                <v-container>
                  <p class="font-weight-black title text-center">{{editedItem.ecol_name}}</p>
                  <v-row>
                    <v-col cols="12" sm="8" md="8">
                      <v-text-field v-model="editedItem.ecol_criteria" label="Criteria value"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save(onEdit)">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon big class="mr-2" @click="editItem(item)">mdi-pencil-outline</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getData">Reset</v-btn>
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
      search: "",
      expanded: [],
      dialog: false,
      singleExpand: true,
      headers: [
        { text: "ID", value: "idecol" },
        {
          text: "Ecological characteristic",
          align: "left",
          sortable: false,
          value: "ecol_name"
        },
        { text: "Criteria value", value: "ecol_criteria", sortable: true },
        { text: "Actions", value: "action", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      criteria: []
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New material" : "Edit criteria";
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
      this.getCriteria();
    },
    editItem(item) {
      this.editedIndex = this.criteria.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save(funcEdit) {
      //если было редактирование
      if (this.editedIndex > -1) {
        Object.assign(this.criteria[this.editedIndex], this.editedItem);
        funcEdit(this.editedItem);
      }
      this.close();
    },
    onEdit(editedItem) {
      var hostname = window.location.hostname;
      axios
        .post(`http://${hostname}:3000/posts/editCriteria`, editedItem)
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
    getCriteria() {
      var app = this;
      var hostname = window.location.hostname;
      axios
        .get(`http://${hostname}:3000/posts/DBcriteria`)
        .then(response => {
          console.log(response);
          app.criteria = response.data;
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