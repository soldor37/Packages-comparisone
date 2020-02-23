import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
//роутинг без загрузки страницы
import VueRouter from 'vue-router'

import VueApexCharts from 'vue-apexcharts'
// импортируем AdminPanel компонент
import AdminPanel from './components/AdminPanel'
import Comparisone from './components/Comparisone'
import vuetify from './plugins/vuetify';
Vue.component('apexchart', VueApexCharts)


// инициализируем роуты
const routes = [
  { path: '/AdminPanel', component: AdminPanel },
  { path: '/', component: Comparisone }
  ]
// Создаем экземпляр роутера и передайте опцию `routes`
const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
    vuetify,
    router,
    render: h => h(App),
}).$mount('#app')
