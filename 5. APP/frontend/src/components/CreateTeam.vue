<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create Team</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-text-field required filled v-model="team.name" label="Name" />
        <MyClubInput required v-model="team.club" />
        <LeagueInput required v-model="team.league" />
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn depressed :disabled="!valid" @click="create">
          <v-icon left>mdi-plus</v-icon>
          Create
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import MyClubInput from "@/components/input/MyClubInput.vue";
import Team from "@/models/Team";
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";

@Component({
  components: {LeagueInput, MyClubInput}
})
export default class CreateTeam extends Vue {
  private valid = false;
  private loading = false;
  private team = new Team();

  private create() {
    this.loading = true;
    API.axios
      .put<Team>(`my/team`, this.team)
      .then((e) => console.log(e))
      .catch((e) => console.log(e))
      .finally(() => {
        this.loading = false;
        this.$emit("confirm");
      });
  }
}
</script>
