<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-sheet class="pa-4" color="grey lighten-4" v-if="administrator">
      <v-avatar class="mb-4" color="grey darken-1" size="64"></v-avatar>
      <div>{{ administrator.firstname }}</div>
      <div>{{ administrator.lastname }}</div>
      <div>{{ administrator.email }}</div>
    </v-sheet>

    <v-divider></v-divider>
    <v-list>
      <v-list-item v-for="item in items" :key="item.text" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {namespace} from "vuex-class";
import Administrator from "@/models/Administrator";

const administrator = namespace("administrator");

@Component
export default class Drawer extends Vue {
  drawer = true;
  items = [
    {
      text: "Mes équipes",
      icon: "mdi-domain"
    },
    {
      text: "Mes équipes 2",
      icon: "mdi-domain"
    }
  ];

  @administrator.State
  administrator!: Administrator;
}
</script>
