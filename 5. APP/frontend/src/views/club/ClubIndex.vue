<template>
  <v-container v-if="club" fluid style="max-width: 1500px">
    <v-card class="mx-auto" dark flat>
      <v-parallax :src="require('@/assets/background.jpg')" height="400">
        <v-row align="end">
          <v-col class="align-self-middle text-center" cols="12">
            <v-avatar :size="$vuetify.breakpoint.xs ? 200 : 250" tile>
              <v-img src="https://cdn-csd.swisstxt.ch/images/sport/club/logo/large/2679.png"></v-img>
            </v-avatar>
          </v-col>
          <v-col class="py-7 text-center">
            <span class="text-h4">{{ club.name }}</span>
          </v-col>
        </v-row>
      </v-parallax>
    </v-card>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card flat outlined>
          <v-card dark flat>
            <v-card-title class="text-uppercase">Teams</v-card-title>
          </v-card>
          <v-list two-line>
            <v-card v-if="!teams.length" class="ma-3 justify-center" flat>No team</v-card>
            <v-card v-for="team in teams" :key="team.id" class="ma-3" flat outlined>
              <v-list-item :to="{name: 'TeamIndex', params: {id: team.id}}" link>
                <v-list-item-content>
                  <v-list-item-title>{{ team.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <!-- <v-chip label small>-->
                    <!-- <v-icon left small>mdi-tshirt-crew</v-icon>-->
                    <!-- </v-chip>-->
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
import Club from "@/models/Club";
import Team from "@/models/Team";

@Component
export default class ClubIndex extends Vue {
  private club: Club | null = null;
  private teams: Team[] = [];

  async mounted() {
    const {id} = this.$route.params;
    try {
      this.club = await API.get<Club>(Club, `club/${id}`);
      this.teams = await API.get<Team[]>(Team, `club/${id}/teams`);
    } catch {
      return this.$router.push({name: "Error"});
    }
  }
}
</script>
