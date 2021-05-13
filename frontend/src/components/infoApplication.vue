<!--
<template>
  <div id="info">
    <router-view></router-view>
    <v-container fluid>
      <v-row>
        <v-col md="3" sm="12">
          

          
       

      </v-row>
    </v-container>
  </div>
</template>

<style>
#adminpanel {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
-->

<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="info"
      :search="search"
      
      
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>About Application</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
             </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      
      <template v-slot:item="{ item }">
        <v-icon big class="mr-2" @click="editItem(item)">mdi-pencil-outline</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getData">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<!-- инкапсулированные стили компонента -->
<style>
#adminpanel {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

