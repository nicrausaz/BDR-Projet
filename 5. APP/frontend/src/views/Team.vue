<template>
  <v-container v-if="team" fluid style="max-width: 1500px">
    <v-card class="mx-auto" dark flat>
      <v-parallax :src="require('@/assets/background.jpg')" height="400">
        <v-row align="end">
          <v-col class="align-self-middle text-center" cols="12">
            <v-avatar :size="$vuetify.breakpoint.xs ? 200 : 250" tile>
              <v-img src="https://cdn-csd.swisstxt.ch/images/sport/club/logo/large/2679.png"></v-img>
            </v-avatar>
          </v-col>
          <v-col class="py-7 text-center">
            <span class="text-h4">{{ team.name }}</span>
          </v-col>
        </v-row>
      </v-parallax>
    </v-card>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card flat outlined>
          <v-card dark flat>
            <v-card-title class="text-uppercase">Players</v-card-title>
          </v-card>
          <v-list two-line>
            <v-card v-for="player in players" :key="player.uid" class="ma-3" flat outlined>
              <v-list-item :to="{name: 'Player', params: {id: player.uid}}" link>
                <v-list-item-avatar color="grey">
                  <v-img :src="player.avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ player.firstname }} {{ player.lastname }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip label small>
                      <v-icon left small>mdi-tshirt-crew</v-icon>
                      {{ player.jerseyNumber }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card flat outlined>
          <v-card dark flat>
            <v-card-title class="text-uppercase"> Events</v-card-title>
          </v-card>
          <v-list two-line>
            <v-list-item link v-for="j in 5" :key="j">
              <v-list-item-avatar color="grey">
                <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>boby</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip label small>
                    <v-icon small left>mdi-tshirt-crew</v-icon>
                    1
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
import Team from "@/models/Team";
import PlayerTeam from "@/models/PlayerTeam";

@Component
export default class TeamIndex extends Vue {
  private team: Team | null = null;
  private players: PlayerTeam[] | null = null;

  async mounted() {
    const {id} = this.$route.params;
    this.team = await API.get<Team>(Team, `team/${id}`);
    this.players = await API.get<PlayerTeam[]>(PlayerTeam, `team/${id}/player`);
  }
}
</script>
