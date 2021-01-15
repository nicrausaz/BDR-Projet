<template>
  <v-container fluid style="max-width: 1500px" v-if="federation">
    <v-card class="mx-auto" dark flat>
      <v-parallax :src="require('@/assets/background.jpg')" height="400">
        <v-col align="center">
          <v-chip>test</v-chip>
        </v-col>
        <v-row align="end">
          <v-col class="text-center">
            <span class="text-h4">{{ federation.name }}</span>
          </v-col>
        </v-row>
        <v-row align="center" no-gutters>
          <v-col align="center">
            <v-chip>xx</v-chip>
          </v-col>
        </v-row>
      </v-parallax>
    </v-card>
    <v-row>
      <v-col>
        <v-card flat outlined>
          <v-card :to="{name: 'TeamIndex', params: {id: training.team.id}}" dark flat>
            <v-card-title class="text-uppercase">
              <v-avatar size="64" tile class="mr-3">
                <v-img src="https://cdn-csd.swisstxt.ch/images/sport/club/logo/large/2679.png" />
              </v-avatar>
              {{ training.team.name }}
            </v-card-title>
          </v-card>
        </v-card>
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

@Component({
  components: {Header}
})
export default class FederationIndex extends Vue {
  private federation: Federation | null = null;

  async mounted() {
    try {
      const {id} = this.$route.params;
      this.federation = await API.get<Federation>(Federation, `federation/${id}`);
    } catch (e) {
      return RedirectError(e);
    }
  }
}
</script>
