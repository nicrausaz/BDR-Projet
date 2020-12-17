<template>
  <v-container fluid style="max-width: 1000px" v-if="game">
    <v-card class="mx-auto" dark>
      <v-parallax src="https://ysnlive.com/wp-content/uploads/2018/08/football-background.jpg" height="400">
        <v-card color="rgba(0,0,0,0.5)" class="pa-5 blur">
          <v-row align="center" no-gutters>
            <v-col align="center">
              <v-chip>{{ game.startAt.toLocaleDateString() }}</v-chip>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col class="text-right text-h6 text-md-h5 text-uppercase">
              <v-row align="center" no-gutters>
                <v-col>
                  <v-avatar size="64" tile class="ma-3">
                    <v-img src="https://cdn-csd.swisstxt.ch/images/sport/club/logo/large/2679.png" />
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
                    <v-img src="https://cdn-csd.swisstxt.ch/images/sport/club/logo/large/2688.png" />
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
        </v-card>
      </v-parallax>
    </v-card>

    <v-row>
      <v-col cols="12" md="6" v-for="team in teams" :key="team.team.id">
        <v-card>
          <v-card dark>
            <v-card-title class="text-uppercase">
              <v-avatar size="64" tile class="mr-3">
                <v-img src="https://cdn-csd.swisstxt.ch/images/sport/club/logo/large/2679.png" />
              </v-avatar>
              {{ team.team.name }}
            </v-card-title>
          </v-card>
          <v-list two-line>
            <v-list-item link v-for="player in team.players" :key="player.uid"
                         :to="{name: 'Player', params: {id: player.uid}}">
              <v-list-item-avatar>
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

@Component
export default class GameResult extends Vue {
  private game: Game | null = null;
  private teams: {team: Team; players: PlayerTeam[]}[] = [];

  async mounted() {
    const {id} = this.$route.params;
    this.game = (await API.axios.get<Game>(`game/${id}`)).data;
    if (this.game) {
      this.teams = [
        {
          team: this.game.teamHome,
          players: (await API.axios.get<PlayerTeam[]>(`team/${this.game?.teamHome.id}/player`)).data
        },
        {
          team: this.game.teamGuest,
          players: (await API.axios.get<PlayerTeam[]>(`team/${this.game?.teamGuest.id}/player`)).data
        }
      ];
    }
  }
}
</script>

<style>
.blur {
  backdrop-filter: blur(20px);
}
</style>
