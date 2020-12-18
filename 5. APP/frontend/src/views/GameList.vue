<template>
  <v-container fluid style="max-width: 1500px">
    <v-list two-line>
      <v-list-item link v-for="game in games" :key="game.uid" :to="{name: 'GameResult', params: {id: game.uid}}">
        <v-list-item-content>
          <v-list-item-title>{{ game.name }}</v-list-item-title>
          <v-list-item-subtitle>
            <v-chip label small class="mr-2">
              <v-icon small left>mdi-calendar</v-icon>
              {{ game.startAt.toLocaleDateString() }}
            </v-chip>
            <v-chip label small class="mr-2">
              <v-icon small left>mdi-stadium</v-icon>
              {{ game.stadium.name }}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import API from "@/plugins/API";
import Game from "@/models/Game";

@Component
export default class GameList extends Vue {
  private games: Game[] = [];

  async mounted() {
    this.games = (await API.axios.get<Game[]>(`game`)).data;
  }
}
</script>

<style>
.blur {
  backdrop-filter: blur(20px);
}
</style>
