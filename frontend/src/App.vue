<template>
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
</template>


<style>
</style>
