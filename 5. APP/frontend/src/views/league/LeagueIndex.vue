<template>
  <v-container v-if="league" fluid style="max-width: 1500px">
    <Header>
      <v-row align="center" justify="center">
        <v-col class="text-center text-h3 text-md-h1 font-weight-bold">{{ league.level }} ({{ league.gender }})</v-col>
      </v-row>
      <v-row align="center" no-gutters>
        <v-col align="center">
          <v-chip>{{ league.federation.name }}</v-chip>
        </v-col>
      </v-row>
    </Header>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card flat outlined>
          <v-card dark flat>
            <v-card-title class="text-uppercase">Championships</v-card-title>
          </v-card>
          <v-list two-line>
            <v-card v-if="!championships.length" class="ma-3 justify-center" flat>No championship</v-card>
            <v-card v-for="champ in championships" :key="champ.id" class="ma-3" flat outlined>
              <v-list-item :to="{name: 'ChampionshipIndex', params: {id: champ.id}}" link>
                <v-list-item-content>
                  <v-list-item-title>{{ champ.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip label small class="mr-2">
                      <v-icon left small>mdi-clock</v-icon>
                      {{ champ.league.level }}
                    </v-chip>
                    <v-chip label small class="mr-2">
                      <v-icon left small>mdi-clock</v-icon>
                      {{ champ.startAt.toLocaleDateString() }} - {{ champ.endAt.toLocaleDateString() }}
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
import League from "@/models/League";
import Championship from "@/models/Championship";
import Header from "@/components/Header.vue";

@Component({
  components: {Header}
})
export default class LeagueIndex extends Vue {
  private league: League | null = null;
  private championships: Championship[] = [];

  async mounted() {
    try {
      const {id} = this.$route.params;
      this.league = await API.get<League>(League, `league/${id}`);
      this.championships = await API.get<Championship[]>(Championship, `league/${id}/championships`);
    } catch (e) {
      return RedirectError(e);
    }
  }
}
</script>
