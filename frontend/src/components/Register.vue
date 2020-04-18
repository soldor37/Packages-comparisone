<template>
  <div>
    <h4>Registration</h4>
    <form @submit.prevent="register">
      <div>
          <v-text-field label="Login"  hide-details="auto" id="login" type="login" v-model="login" required></v-text-field>
      </div>
      <div>
          <v-text-field label="Password"  hide-details="auto" id="password" type="password" v-model="password" required></v-text-field>
      </div>
      <div>
          <v-text-field label="Confirm Password"  hide-details="auto" id="password-confirm" type="password" v-model="password_confirmation" required></v-text-field>
      </div>
      <div>
        <v-btn class="ma-2" color="primary" type="submit" > 
        Register
        <v-icon>mdi-register</v-icon>
      </v-btn>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        login : "",
        password : "",
        password_confirmation : "",
        is_admin : null
      }
    },
    methods: {
      register: function () {
        let data = {
          login: this.login,
          password: this.password,
          is_admin: this.is_admin
        }
        this.$store.dispatch('register', data)
       .then(() => this.$router.push('/'))
       .catch(err => console.log(err))
      }
    }
  }
</script>