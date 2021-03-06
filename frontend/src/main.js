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
// импортируем Comparisone компонент
import Comparisone from './components/Comparisone/Comparisone.vue'
// импортируем Login компонент
import Login from './components/Login'


import Package from './components/AdminPanel/Package' //для администратора
import PackagesNoAdmin from './components/PackagesNoAdmin' //для не администратора
import Criteria from './components/AdminPanel/Criteria'
import Material from './components/AdminPanel/Material'
import PackGroups from './components/AdminPanel/PackGroups'
import Users from './components/AdminPanel/Users'

import store from './store.js'
import Axios from 'axios'
import vuetify from './plugins/vuetify';
Vue.component('apexchart', VueApexCharts)
//работаем с авторизацией
Vue.prototype.$http = Axios;
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}
// инициализируем роуты
const routes = [
  { 
    path: '/admin/package',
    component: Package,
    name: 'packages',
    meta: { 
      requiresAuth: true,
      is_admin: true
    } 
  },
  { 
    path: '/packages',
    component: PackagesNoAdmin,
    name: 'packagesNoAdmin',
    meta: { 
      requiresAuth: true,
      is_admin: false
    } 
  },
  { 
    path: '/admin/material',
    component: Material,
    name: 'materials',
    meta: { 
      requiresAuth: true,
      is_admin: true
    } 
  },
  { 
    path: '/admin/groups',
    component: PackGroups,
    name: 'Groups',
    meta: { 
      requiresAuth: true,
      is_admin: true
    } 
  },
  { 
    path: '/admin/criteria',
    component: Criteria,
    name: 'Criteria',
    meta: { 
      requiresAuth: true,
      is_admin: true
    } 
  },
  { 
    path: '/admin/users',
    component: Users,
    name: 'Users',
    meta: { 
      requiresAuth: true,
      is_admin: true
    } 
  },
  { path: '/',
   component: Comparisone,
   name: 'comparisone',
   meta: {
     requiresAuth: true
   } 
  },
  { path : '/login', component: Login },
  // otherwise redirect to home
  { path: '*', redirect: '/' }
  ]
// Создаем экземпляр роутера и передайте опцию `routes`
const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  let is_admin = JSON.parse(localStorage.getItem('is_admin'))
  //console.log(is_admin)
  if(to.matched.some(record => record.meta.is_admin)) {
    if(is_admin == 1){
      next()
    }
    else{
      alert("access denied")
      //next('/login')
  }
  } else if(to.matched.some(record => record.meta.requiresAuth)){
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  }
  else{
    next()
  }
})
new Vue({
    vuetify,
    router,
    store,
    render: h => h(App),
}).$mount('#app')
