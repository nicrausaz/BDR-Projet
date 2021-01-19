<template>
  <v-container fluid style="max-width: 1500px" v-if="federation">
    <v-card class="mx-auto" dark flat>
      <v-parallax :src="require('@/assets/background.jpg')" height="400">
        <v-row align="end">
          <v-col class="text-center">
            <span class="text-h4">{{ federation.name }}</span>
          </v-col>
        </v-row>
        <v-row align="center" no-gutters>
          <v-col align="center">
            <v-chip>{{ federation.sport.name }}</v-chip>
          </v-col>
        </v-row>
      </v-parallax>
    </v-card>
    <v-row>
      <v-col>
        <v-list two-line>
          <v-card v-if="!leagues.length" class="ma-3 justify-center" flat>No league</v-card>
          <v-card v-for="league in leagues" :key="league.id" class="ma-3" flat outlined>
            <v-list-item :to="{name: 'LeagueIndex', params: {id: league.id}}" link>
              <v-list-item-content>
                <v-list-item-title>{{ league.level }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import API from "@/plugins/API";
import Header from "@/components/Header.vue";
import Federation from "@/models/Federation";
import {RedirectError} from "@/plugins/Utils";
import League from "@/models/League";

@Component({
  components: {Header}
})
export default class FederationIndex extends Vue {
  private federation: Federation | null = null;
  private leagues: League[] = [];

  async mounted() {
    try {
      const {id} = this.$route.params;
      this.federation = await API.get<Federation>(Federation, `federation/${id}`);
      this.leagues = await API.get<League[]>(League, `federation/${id}/leagues`);
    } catch (e) {
      return RedirectError(e);
    }
  }
}
</script>
