<template>
  <v-container fluid style="max-width: 1500px" v-if="pagination">
    <v-list two-line>
      <v-list-item link v-for="game in pagination.result" :key="game.uid"
                   :to="{name: 'GameResult', params: {id: game.uid}}">
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
    <v-footer app inset elevation="20" class="justify-center">
      <v-pagination @input="setPage" v-model="page" circle
                    :length="Math.ceil(pagination.total / pagination.limit)"></v-pagination>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import API from "@/plugins/API";
import Game from "@/models/Game";
import Pagination from "@/models/Pagination";

@Component
export default class GameList extends Vue {
  private page = 1;
  private limit = 20;
  private pagination: Pagination<Game> | null = null;

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    this.pagination = (await API.axios.get<Pagination<Game>>(`game?limit=${limit}&offset=${offset}`)).data;
  }

  async mounted() {
    await this.setPage();
  }
}
</script>

<style>
.blur {
  backdrop-filter: blur(20px);
}
</style>
