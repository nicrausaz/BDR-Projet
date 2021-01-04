<template>
  <v-container fluid style="max-width: 1500px" v-if="pagination">
    <v-toolbar class="mb-3" flat outlined rounded>
      <v-toolbar-title>Les Matchs</v-toolbar-title>
      <v-spacer />
      <v-text-field v-model="searchQuery" dense hide-details outlined prepend-inner-icon="mdi-magnify" single-line></v-text-field>
    </v-toolbar>
    <v-card flat outlined>
      <v-list two-line>
        <v-card v-for="game in pagination.result" :key="game.uid" class="ma-3" flat outlined>
          <v-list-item :to="{name: 'GameResult', params: {id: game.uid}}" link>
            <v-list-item-content>
              <v-list-item-title>{{ game.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-calendar</v-icon>
                  {{ game.startAt.toLocaleDateString() }}
                </v-chip>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-stadium</v-icon>
                  {{ game.stadium.name }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-list>
    </v-card>
    <v-footer app inset elevation="20" class="justify-center">
      <v-pagination @input="setPage" v-model="page" circle :length="Math.ceil(pagination.total / pagination.limit)"></v-pagination>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import API from "@/plugins/API";
import Game from "@/models/Game";
import Pagination from "@/models/Pagination";

@Component
export default class GameList extends Vue {
  private page = 1;
  private limit = 20;
  private pagination: Pagination<Game> | null = null;
  private searchQuery = "";

  @Watch("searchQuery") onQuery() {
    this.setPage();
  }

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    const query = this.searchQuery.trim();
    this.pagination = (await API.axios.get<Pagination<Game>>(`game?q=${query}&limit=${limit}&offset=${offset}`)).data;
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
