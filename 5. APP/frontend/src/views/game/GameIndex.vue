<template>
  <v-container fluid style="max-width: 1500px" v-if="game">
    <Header>
      <v-row align="center" no-gutters>
        <v-col align="center">
          <v-chip>{{ game.startAt.toLocaleString() }}</v-chip>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col class="text-right text-h6 text-md-h5 text-uppercase">
          <v-row align="center" no-gutters>
            <v-col>
              <v-avatar size="64" tile class="ma-3">
                <v-img :src="game.teamHome.avatar" />
              </v-avatar>
            </v-col>
            <v-col cols="12" class="text-break">{{ game.teamHome.name }}</v-col>
          </v-row>
        </v-col>
        <v-col class="text-center text-h3 text-md-h1 font-weight-bold"> {{ game.scoreHome }}:{{ game.scoreGuest }} </v-col>
        <v-col class="text-left text-h6 text-md-h5 text-uppercase">
          <v-row align="center" no-gutters>
            <v-col>
              <v-avatar size="64" tile class="ma-3">
                <v-img :src="game.teamGuest.avatar" />
              </v-avatar>
            </v-col>
            <v-col cols="12" class="text-break">{{ game.teamGuest.name }}</v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row align="center" no-gutters>
        <v-col align="center">
          <v-chip>{{ game.stadium.name }}</v-chip>
        </v-col>
      </v-row>
    </Header>
    <v-row>
      <v-col cols="12" md="6" v-for="team in teams" :key="team.team.id">
        <v-card flat outlined>
          <v-card :to="{name: 'TeamIndex', params: {id: team.team.id}}" dark flat>
            <v-card-title class="text-uppercase">
              <v-avatar size="64" tile class="mr-3">
                <v-img :src="team.team.avatar" />
              </v-avatar>
              {{ team.team.name }}
            </v-card-title>
          </v-card>
          <v-list two-line>
            <v-card v-for="player in team.players" :key="player.uid" class="ma-3" flat outlined>
              <v-list-item :to="{name: 'PlayerIndex', params: {id: player.uid}}" link>
                <v-list-item-avatar color="grey">
                  <v-img :src="player.avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ player.firstname }} {{ player.lastname }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip label small>
                      <v-icon small left>mdi-tshirt-crew</v-icon>
                      {{ player.jerseyNumber }}
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
import Game from "@/models/Game";
import PlayerTeam from "@/models/PlayerTeam";
import Team from "@/models/Team";
import Header from "@/components/Header.vue";
import {RedirectError} from "@/plugins/Utils";

@Component({
  components: {Header}
})
export default class GameIndex extends Vue {
  private game: Game | null = null;
  private teams: {team: Team; players: PlayerTeam[]}[] = [];

  async mounted() {
    try {
      const {id} = this.$route.params;
      this.game = await API.get<Game>(Game, `game/${id}`);
      if (this.game) {
        this.teams = [
          {
            team: this.game.teamHome,
            players: await API.get<PlayerTeam[]>(PlayerTeam, `team/${this.game?.teamHome.id}/player`)
          },
          {
            team: this.game.teamGuest,
            players: await API.get<PlayerTeam[]>(PlayerTeam, `team/${this.game?.teamGuest.id}/player`)
          }
        ];
      }
    } catch (e) {
      return RedirectError(e);
    }
  }
}
</script>

<style>
.blur {
  backdrop-filter: blur(20px);
}
</style>
