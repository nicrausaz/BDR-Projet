<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create Training</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="model.name" filled label="Name" required />
          </v-col>
          <v-col cols="6">
            <StadiumInput v-model="model.stadium" required />
          </v-col>
          <v-col cols="6">
            <TeamInput v-model="model.team" restricted="true" required />
          </v-col>
          <v-col cols="6">
            <DateInput v-model="model.startAt" label="Start At" required />
          </v-col>
          <v-col cols="6">
            <DateInput v-model="model.endAt" label="End At" required />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="model.description" filled label="Description" required />
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn depressed @click="close">
          <v-icon left>mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-btn :disabled="!valid" depressed @click="send">
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
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";
import DateInput from "@/components/input/DateInput.vue";
import TeamInput from "@/components/input/TeamInput.vue";
import StadiumInput from "@/components/input/StadiumInput.vue";
import MyChampionshipInput from "@/components/input/ChampionshipInput.vue";
import Header from "@/components/Header.vue";
import Training from "@/models/Training";

@Component({
  components: {Header, MyChampionshipInput, StadiumInput, TeamInput, DateInput, LeagueInput, MyClubInput}
})
export default class CreateTraining extends Vue {
  @Prop() prefill!: Training;
  private valid = false;
  private loading = false;
  private error: string | null = null;
  private training = new Training();

  private get editMode() {
    return !!this.prefill;
  }

  private get model(): Training {
    return this.prefill ? this.prefill : this.training;
  }

  private request(path: string) {
    return this.editMode
      ? API.axios.patch<Training>(`${path}/${this.model.primaryKey}`, this.model)
      : API.axios.put<Training>(`${path}`, this.model);
  }

  private send() {
    this.loading = true;
    this.request("my/training")
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
    this.training = new Training();
    this.$emit("close");
  }
}
</script>
