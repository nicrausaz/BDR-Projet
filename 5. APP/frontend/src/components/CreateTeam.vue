<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create Team</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-alert type="error" v-if="error">{{ error }}</v-alert>
        <v-text-field required filled v-model="model.name" label="Name" />
        <MyClubInput required v-model="model.club" />
        <LeagueInput required v-model="model.league" />
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn depressed @click="close">
          <v-icon left>mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-btn depressed :disabled="!valid" @click="send">
          <v-icon left>mdi-pencil</v-icon>
          save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import MyClubInput from "@/components/input/ClubInput.vue";
import Team from "@/models/Team";
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";

@Component({
  components: {LeagueInput, MyClubInput}
})
export default class CreateTeam extends Vue {
  @Prop() prefill!: Team;
  private valid = false;
  private loading = false;
  private error: string | null = null;
  private team = new Team();

  private request(path: string) {
    return this.prefill
      ? API.axios.patch<Team>(`${path}/${this.model.primaryKey}`, this.model)
      : API.axios.put<Team>(`${path}`, this.model);
  }

  private get model(): Team {
    return this.prefill ? this.prefill : this.team;
  }

  private send() {
    this.loading = true;
    this.request("my/team")
      .then(() => {
        this.close();
        this.$emit("confirm");
      })
      .catch((e) => {
        this.error = e?.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private close() {
    this.team = new Team();
    this.$emit("close");
  }
}
</script>
