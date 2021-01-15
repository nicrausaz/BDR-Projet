<template>
  <v-list>
    <v-card flat outlined>
      <v-card dark flat>
        <v-card-title class="text-uppercase">
          Players
          <v-spacer />
          <TeamAddPlayers @added="addPlayer" />
        </v-card-title>
      </v-card>
      <v-list two-line>
        <v-card v-if="!players.length" class="ma-3 justify-center" flat>No player</v-card>
        <v-card v-for="player in players" :key="player.uid" class="ma-3" flat outlined>
          <v-list-item :to="{name: 'PlayerIndex', params: {id: player.uid}}" link>
            <v-list-item-avatar color="grey">
              <v-img :src="player.avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ player.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip label small>
                  <v-icon left small>mdi-tshirt-crew</v-icon>
                  {{ player.jerseyNumber }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn class="mx-1" color="error" elevation="0" fab x-small @click.prevent="removePlayer(player)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="primary" elevation="0" fab x-small @click.prevent="editPlayer(player)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-list>
    </v-card>
  </v-list>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import API from "@/plugins/API";
import PlayerTeam from "@/models/PlayerTeam";
import Team from "@/models/Team";
import TeamAddPlayers from "@/components/TeamAddPlayers.vue";
import Player from "@/models/Player";

@Component({
  components: {TeamAddPlayers}
})
export default class TeamManagerPlayers extends Vue {
  @Prop({required: true}) readonly team!: Team;
  private players: PlayerTeam[] = [];

  @Watch("team")
  async setPage() {
    console.log(this.team.id);
    this.players = await API.get<PlayerTeam[]>(PlayerTeam, `my/team/${this.team.id}/player`);
    console.log(this.players);
  }

  mounted() {
    this.setPage();
  }

  async removePlayer(player: PlayerTeam) {
    console.log("delete", player);
    await API.delete<PlayerTeam>(PlayerTeam, `my/team/${this.team.id}/player`, {
      data: {
        playerUid: player.uid
      }
    });
    await this.setPage();
  }

  async addPlayer({player, jerseyNumber}: {player: Player; jerseyNumber: number}) {
    console.log("add", player);
    await API.put<PlayerTeam>(PlayerTeam, `my/team/${this.team.id}/player`, {
      playerUid: player?.uid,
      jerseyNumber
    });
    await this.setPage();
  }

  async editPlayer(player: PlayerTeam) {
    console.log(player);
  }
}
</script>
