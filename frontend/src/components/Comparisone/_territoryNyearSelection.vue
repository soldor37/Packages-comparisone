<!-- Выбор страны и года -->
<template>
  <div class="territorySelection">
    
    <v-select
      :items="countries"
      item-value="id"
      item-text="value"
      v-model="pickedCountry"
    ></v-select>
    
    <v-select
      :items="years"
      item-value="id"
      item-text="value"
      v-model="pickedYear"
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
          id: 1,
          value: "Russia",
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

<style scoped></style>

