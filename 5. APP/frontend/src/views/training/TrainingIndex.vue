<template>
  <v-container fluid style="max-width: 1500px" v-if="training">
    <Header>
      <v-row align="center" no-gutters>
        <v-col align="center">
          <v-chip class="mx-2">{{ training.startAt.toLocaleDateString() }}</v-chip>
          <v-chip class="mx-2">{{ training.endAt.toLocaleDateString() }}</v-chip>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col class="text-center text-h3 text-md-h1 font-weight-bold"> {{ training.name }} </v-col>
      </v-row>
      <v-row align="center" no-gutters>
        <v-col align="center">
          <v-chip>{{ training.stadium.name }}</v-chip>
        </v-col>
      </v-row>
    </Header>
    <v-row>
      <v-col cols="12" md="6">
        <v-card flat outlined>
          <v-card dark flat>
            <v-card-title class="text-uppercase"> Description </v-card-title>
          </v-card>
          <v-list>
            <v-card v-for="(info, i) in infos" :key="i" class="ma-3" flat outlined>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary" v-text="info.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ info.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ info.subtitle }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card flat outlined>
          <v-card :to="{name: 'TeamIndex', params: {id: training.team.id}}" dark flat>
            <v-card-title class="text-uppercase">
              <v-avatar size="64" tile class="mr-3">
                <v-img src="https://cdn-csd.swisstxt.ch/images/sport/club/logo/large/2679.png" />
              </v-avatar>
              {{ training.team.name }}
            </v-card-title>
          </v-card>
          <v-list two-line>
            <v-card v-for="player in players" :key="player.uid" class="ma-3" flat outlined>
              <v-list-item :to="{name: 'PlayerIndex', params: {id: player.uid}}" link>
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
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import API from "@/plugins/API";
import Header from "@/components/Header.vue";
import Training from "@/models/Training";
import {RedirectError} from "@/plugins/Utils";
import PlayerTeam from "@/models/PlayerTeam";

@Component({
  components: {Header}
})
export default class TrainingIndex extends Vue {
  private training: Training | null = null;
  private players: PlayerTeam[] = [];

  private get infos() {
    return [
      {icon: "mdi-stadium", title: this.training?.stadium.name, subtitle: this.training?.stadium.address},
      {icon: "mdi-sort-clock-ascending-outline", title: this.training?.startAt.toLocaleString(), subtitle: ""},
      {icon: "mdi-sort-clock-descending-outline", title: this.training?.endAt.toLocaleString(), subtitle: ""},
      {icon: "mdi-text", title: this.training?.description, subtitle: ""}
    ];
  }

  async mounted() {
    try {
      const {id} = this.$route.params;
      this.training = await API.get<Training>(Training, `my/training/${id}`);
      if (this.training) {
        this.players = await API.get<PlayerTeam[]>(PlayerTeam, `team/${this.training?.team.id}/player`);
      }
    } catch (e) {
      return RedirectError(e);
    }
  }
}
</script>
