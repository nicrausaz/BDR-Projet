<template>
  <v-container v-if="championship" fluid style="max-width: 1500px">
    <Header>
      <v-row align="center" no-gutters>
        <v-col align="center">
          <v-chip>{{ championship.league.level }} ({{ championship.league.gender }})</v-chip>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col class="text-center text-h3 text-md-h1 font-weight-bold">{{ championship.name }}</v-col>
      </v-row>
      <v-row align="center" no-gutters>
        <v-col align="center">
          <v-chip>{{ championship.startAt.toLocaleDateString() }} - {{ championship.endAt.toLocaleDateString() }}</v-chip>
        </v-col>
      </v-row>
    </Header>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card flat outlined>
          <v-card dark flat>
            <v-card-title class="text-uppercase">Games</v-card-title>
          </v-card>
          <v-list two-line>
            <v-card v-if="!games.length" class="ma-3 justify-center" flat>No game</v-card>
            <v-card v-for="game in games" :key="game.uid" class="ma-3" flat outlined>
              <v-list-item :to="{name: 'GameIndex', params: {id: game.uid}}" link>
                <v-list-item-content>
                  <v-list-item-title>{{ game.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip label small class="mr-2">
                      <v-icon left small>mdi-clock</v-icon>
                      {{ game.startAt.toLocaleString() }}
                    </v-chip>
                    <v-chip label small class="mr-2">
                      <v-icon left small>mdi-stadium</v-icon>
                      {{ game.stadium.name }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import API from "@/plugins/API";
import {RedirectError} from "@/plugins/Utils";
import GamesChart from "@/components/GamesChart.vue";
import Championship from "@/models/Championship";
import Header from "@/components/Header.vue";
import Game from "@/models/Game";

@Component({
  components: {Header, GamesChart}
})
export default class ChampionshipIndex extends Vue {
  private championship: Championship | null = null;
  private games: Game[] = [];

  async mounted() {
    try {
      const {id} = this.$route.params;
      this.championship = await API.get<Championship>(Championship, `championship/${id}`);
      this.games = await API.get<Game[]>(Game, `championship/${id}/games`);
    } catch (e) {
      return RedirectError(e);
    }
  }
}
</script>
