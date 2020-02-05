import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import VueApexCharts from 'vue-apexcharts'

Vue.component('apexchart', VueApexCharts)

new Vue({
  el: '#app',
  render: h => h(App)
})
