<template>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="green lighten-1"
                
                flat
              >
                <v-toolbar-title >Authorization</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form >
                  <v-text-field
                    label="Login"
                    name="login"
                    type="text"
                    v-model="login"
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    v-model="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="green lighten-2" @click="submit" >Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
</template>


<script>
export default {
    data(){
        return{
            login: "",
            password: ""
        }
    },
    methods: {
      submit() {
        let login = this.login 
        let password = this.password
        this.$store.dispatch('login', { login, password })
       .then(() => this.$router.push('/'))
       .catch(err => console.log(err))
      }
    }
}
</script>

<style> 
body{
    background-color: #947272; /**/
   }

 </style>