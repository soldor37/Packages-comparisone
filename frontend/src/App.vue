<!--<template>
<div>
  <div id="menu" class="mt-1" md="3">
    <b-row class="text-center">
      <b-col>
      <b-button-group size="lg" >
      <b-button variant="outline-dark"><router-link to="/" tag="nav">Comparisone</router-link></b-button>
      <b-button variant="outline-dark"><router-link to="/AdminPanel" tag="nav">Database</router-link></b-button>
    </b-button-group>
        </b-col>
      </b-row>
  </div>
  <div id="app">
    <router-view></router-view>
  </div>
</div>
</template> -->

<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      v-if="isLoggedIn"
    >
      <v-list dense >
        <v-list-item link >
          <v-list-item-action>
            <v-icon>mdi-chart-bar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="title"><router-link to="/" tag="nav">Comparisone</router-link></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="is_admin == 1">
          <v-list-item-action>
            <v-icon>mdi-database-edit</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="title"><router-link to="/AdminPanel" tag="nav">Database</router-link></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
       </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
<v-spacer></v-spacer>
      <v-btn class="ma-2" color="primary" to="/login" v-if="!isLoggedIn"> 
        Login
        <v-icon>mdi-login-variant</v-icon>
      </v-btn>

      <v-btn class="ma-2" color="primary" v-if="isLoggedIn" @click="logout">
        Logout
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col class="text-center">
           <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
      is_admin: null,
    }),
    computed : {
      isLoggedIn : function(){
        this.isAdmin();
         return this.$store.getters.isLoggedIn
         },
    },
    methods: {
      isAdmin: function () {
        this.is_admin = localStorage.is_admin;
      },
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      }
    },
    created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout")
        }
        throw err;
      });
    });
  },
  }
</script>
<style>
</style>
