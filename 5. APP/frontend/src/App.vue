<template>
  <v-app id="inspire">
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
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout" color="error"> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app dense>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu bottom left>
        <template v-slot:activator="{on, attrs}">
          <v-btn v-bind="attrs" v-on="on" icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue";
import {namespace} from "vuex-class";
import Administrator from "@/models/Administrator"; // @ is an alias to /src

const administrator = namespace("administrator");

@Component({
  components: {
    HelloWorld
  }
})
export default class App extends Vue {
  drawer = false;
  items = [
    {
      text: "Mes équipes",
      icon: "mdi-domain"
    }
  ];

  @administrator.State
  administrator?: Administrator;

  @administrator.Action
  logout!: () => void;
}
</script>
