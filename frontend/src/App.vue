<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app v-if="isLoggedIn" color = "green lighten-5"> <!-- !!!!! почитать про v-navigation-drawer !!!!!! -->
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-chart-bar</v-icon>
          </v-list-item-action>
          <v-list-item-title class="font-weight-medium subtitle-1"
            >Comparison</v-list-item-title
          >
        </v-list-item>




        <!-- показывается только обычному пользователю -->
        <v-list-item link v-if="is_admin != 1" to="/packages">
          <v-list-item-action>
            <v-icon>mdi-package-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="font-weight-medium subtitle-1"
              >Packages</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-group sub-group no-action v-if="is_admin == 1">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Database</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item to="/admin/package">
            <v-list-item-title class="mx-auto">Packages</v-list-item-title>
          </v-list-item>

          <v-list-item to="/admin/material">
            <v-list-item-title>Materials</v-list-item-title>
          </v-list-item>

          <v-list-item to="/admin/groups">
            <v-list-item-title>Package groups</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/criteria">
            <v-list-item-title>Criteria</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/users">
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group sub-group no-action v-if="is_admin == 1">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Info</v-list-item-title>
            </v-list-item-content>
          </template>
          
          
          <v-list-item to="/admin/infoMaterialsAdmin">
            <v-list-item-title>About Materials</v-list-item-title>
          </v-list-item>

          <v-list-item to="/admin/infoApplicationAdmin">
            <v-list-item-title>About this application</v-list-item-title>
          </v-list-item>

        </v-list-group>

        <v-list-group sub-group no-action v-if="is_admin != 1">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Info</v-list-item-title>
            </v-list-item-content>
          </template>
          
          
          <v-list-item to="/infoMaterials">
            <v-list-item-title>About Materials</v-list-item-title>
          </v-list-item>

          <v-list-item to="/infoApplication">
            <v-list-item-title>About this application</v-list-item-title>
          </v-list-item>

        </v-list-group>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="green lighten-1"> 
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="caption" color = "green"
        >Software complex for selecting packaging materials by environmental
        parameters</v-toolbar-title
      >
      <v-spacer></v-spacer>

    
      <v-btn class="ma-2" color="brown lighten-1" to="/login" v-if="!isLoggedIn">
        Login
        <v-icon>mdi-login-variant</v-icon>
      </v-btn>

      <v-btn class="ma-2" color="brown lighten-1" v-if="isLoggedIn" @click="logout">
        Logout
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="text-center">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-footer color="green lighten-1" app>
      <span class="caption">&copy; 2021</span> <!-- было: <span class="white--text">&copy; 2020</span> -->
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    is_admin: null,

  }),
  computed: {
    isLoggedIn: function () {
      this.isAdmin();
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {
    isAdmin: function () {
      this.is_admin = localStorage.is_admin;
    },
    logout: function () {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
  },
  created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout");
        }
        throw err;
      });
    });
  },
};
</script>

<style>  </style>
