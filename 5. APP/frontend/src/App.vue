<template>
  <v-app id="inspire">
    <v-progress-linear v-if="routeIsLoading" fixed indeterminate style="z-index: 10" />
    <v-navigation-drawer v-model="drawer" app width="300">
      <v-container class="pa-4" v-if="administrator">
        <v-card outlined>
          <v-list-item dense>
            <v-list-item-avatar color="gray">
              <v-img :src="administrator.avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ administrator.firstname }} {{ administrator.lastname }}</v-list-item-title>
              <v-list-item-subtitle>{{ administrator.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-container>
      <v-divider></v-divider>

      <v-list rounded>
        <v-list-item v-for="item in items" :key="item.text" link :to="item.path">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout" color="error"> Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app elevate-on-scroll fixed>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-avatar tile>
        <v-img :src="require('@/assets/logo.svg')" />
      </v-avatar>
      <v-toolbar-title>StarSport</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="toggleDarkMode">
        <v-icon>{{ darkMode ? "mdi-weather-sunny" : "mdi-weather-night" }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {namespace} from "vuex-class";
import Administrator from "@/models/Administrator"; // @ is an alias to /src

const administrator = namespace("administrator");
const router = namespace("router");

@Component
export default class App extends Vue {
  drawer = false;
  items = [
    {
      text: "Mon compte",
      icon: "mdi-account-circle",
      path: {name: "Account"}
    },
    {
      text: "Mes équipes",
      icon: "mdi-account-group",
      path: {name: "Teams"}
    },
    {
      text: "Mes clubs",
      icon: "mdi-domain",
      path: {name: "Clubs"}
    },
    {
      text: "Mes joueurs",
      icon: "mdi-account-multiple",
      path: {name: "Players"}
    },
    {
      text: "Les matchs",
      icon: "mdi-basketball",
      path: {name: "Game"}
    },
    {
      text: "Les entraînements",
      icon: "mdi-weight-lifter",
      path: {name: "Training"}
    },
    {
      text: "Calendrier",
      icon: "mdi-calendar",
      path: {name: "Calendar"}
    },
    {
      text: "Logs",
      icon: "mdi-alert",
      path: {name: "Logs"}
    },
    {
      text: "About",
      icon: "mdi-information",
      path: {name: "About"}
    }
  ];

  @administrator.State
  administrator?: Administrator;

  @administrator.Action
  logout!: () => void;

  @router.State
  private routeIsLoading!: boolean;

  get darkMode() {
    return this.$vuetify.theme.dark;
  }

  toggleDarkMode() {
    this.$vuetify.theme.dark = !this.darkMode;
  }
}
</script>
