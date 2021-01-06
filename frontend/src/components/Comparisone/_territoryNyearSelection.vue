<!-- Выбор страны и года -->
<template>
  
    <div class="territorySelection">
    
      <v-select
        :items="countries"
        item-value="id"
        item-text="country_name"
        v-model="pickedCountry"
        :menu-props = "{maxHeight:'400'}"
        label = "countries"
        outlined
        hint = "Select country of ecological criteries"
        persistent-hint
      ></v-select>
    
    
      <v-select
        :items="years"
        item-value="id"
        item-text="year"
        v-model="pickedYear"
        :menu-props = "{maxHeight:'400'}"
        label = "year"
        outlined
        hint = "Select year of ecological criteries"
        persistent-hint
      ></v-select>
    </div>
  
</template>


<script>
import axios from "axios"
export default {
    props:{
        myCountry:{
            type: String,
            default: 'None'
        }
    },
  data() {
    return {
      pickedYear: undefined,
      pickedCountry: undefined,
      countries: [
        {
          id: "id",
          value: "country_name" ,
        },
        {
          id: 2,
          value: this.myCountry,
        },
      ],
      years: [
        {
          id: "id",
          value: "year",
        },
        
      ],
    };
  }, 
  methods: {
      getCountries(){
          var hostname = window.location.hostname;
          return new Promise((resolve,reject)=>{
              axios.get(`http://${hostname}:3000/posts/country`)
              .then((resp)=>{
                  this.countries = resp.data;
                  resolve(resp)
              })
              .catch((err)=>{
                  reject(err)
                  console.log(err);
              })
          })
      }
  },
  watch: {
    pickedCountry() {
      this.$emit("updateCountry", this.pickedCountry);
    },
    pickedYear() {
      this.$emit("updateYear", this.pickedYear);
    },
  },
};
</script>


<!-- <script>
import axios from "axios"
export default {
    props:{
        myCountry:{
            type: String,
            default: 'None'
        }
    },
  data() {
    return {
      pickedYear: undefined,
      pickedCountry: undefined,
      countries: [
        {
          id: 1,
          value: "value" ,
        },
        {
          id: 2,
          value: this.myCountry,
        },
      ],
      years: [
        {
          id: 1,
          value: 1997,
        },
        {
          id: 2,
          value: 2000,
        },
      ],
    };
  }, 
  methods: {
      getCountries(){
          var hostname = window.location.hostname;
          return new Promise((resolve,reject)=>{
              axios.get(`http://${hostname}:3000/posts/DBcountries`)
              .then((resp)=>{
                  this.countries = resp.data;
                  resolve(resp)
              })
              .catch((err)=>{
                  reject(err)
                  console.log(err);
              })
          })
      }
  },
  watch: {
    pickedCountry() {
      this.$emit("updateCountry", this.pickedCountry);
    },
    pickedYear() {
      this.$emit("updateYear", this.pickedYear);
    },
  },
};
</script>
-->

<style scoped></style>

