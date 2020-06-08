<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      sort-by="id"
      item-key="login"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Users</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">New user</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <!-- добавление нового пользователя -->
              <v-card-text v-if="editedIndex == -1">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field 
                      v-model="newUser.login" 
                      label="Login"
                      :rules="[rules.required]"
                      ></v-text-field>

                      <v-text-field
                      v-model="newUser.password" 
                      label="Password"
                      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[rules.required, rules.min]"
                      :type="showPass ? 'text' : 'password'"
                      hint="At least 8 characters"
                      counter
                      @click:append="showPass = !showPass"
                      ></v-text-field>

                      <v-checkbox v-model="newUser.is_admin" :label="`Is admin: ${newUser.is_admin.toString()}`" selected-color="red"></v-checkbox>
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
      <template v-slot:item.action="{ item }">
        <v-icon big @click="deleteItem(item, onDelete)">mdi-delete-circle-outline</v-icon>
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
      dialog: false,
      headers: [
        { text: "ID", value: "id" },
        {
          text: "User login",
          align: "left",
          value: "login"
        },
        { text: "Admin", value: "is_admin" },
        { text: "Actions", value: "action", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      users: [],
      newUser: {
        login: '',
        password: '',
        is_admin: false
      },
      showPass: false,
      rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Minimum 8 characters',
        },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New user" : "Edit group";
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
      this.getUsers();
    },
    editItem(item) {
      this.editedIndex = this.packGroups.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item, funcDelete) {
      const index = this.users.indexOf(item);
      if(confirm("Are you sure you want to delete this item?") == true){
        this.users.splice(index, 1);
        funcDelete(item);
      } 
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save(funcInsert) {
        // this.users.push(this.editedItem);
      funcInsert();
      this.close();
    },
    onInsert() {
      var hostname = window.location.hostname;
      axios
        .post(`http://${hostname}:3000/posts/insertUser`, this.newUser)
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
        .post(`http://${hostname}:3000/posts/deleteUser`, item)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          alert(error + "\n Failed to POST on server");
          console.log("-----error-------");
          console.log(error);
        });
    },
    getUsers() {
      var app = this;
      var hostname = window.location.hostname;
      axios
        .get(`http://${hostname}:3000/posts/usersAdmPanel`)
        .then(response => {
          //console.log(response);
          app.users = response.data;
        })
        .catch(error => {
          alert(error + "\n Ошибка подключения к базе данных");
          console.log("-----error-------");
          console.log(error);
        });
    },
    is_admin(adminBool){
      if(adminBool == 1){
        return 'Yes'
      }
      else{
        return 'No'
      }
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