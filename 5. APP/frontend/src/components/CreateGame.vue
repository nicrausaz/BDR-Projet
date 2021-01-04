<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create Game</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <template v-if="editMode">
          <h1>Score</h1>
        </template>
        <v-text-field v-model="model.name" filled label="Name" required />
        <v-text-field v-model="model.gameId" filled label="Game ID" required />
        <DateInput v-model="model.startAt" label="Start At" />
        <DateInput v-model="model.endAt" label="End At" />
        <StadiumInput v-model="model.stadium" />
        <MyChampionshipInput v-model="model.championship" />
        <TeamInput v-model="model.teamHome" />
        <TeamInput v-model="model.teamGuest" />
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
import MyClubInput from "@/components/input/MyClubInput.vue";
import Game from "@/models/Game";
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";
import DateInput from "@/components/input/DateInput.vue";
import TeamInput from "@/components/input/TeamInput.vue";
import StadiumInput from "@/components/input/StadiumInput.vue";
import MyChampionshipInput from "@/components/input/MyChampionshipInput.vue";

@Component({
  components: {MyChampionshipInput, StadiumInput, TeamInput, DateInput, LeagueInput, MyClubInput}
})
export default class CreateGame extends Vue {
  @Prop() prefill!: Game;
  private valid = false;
  private loading = false;
  private error: string | null = null;
  private game = new Game();

  private get editMode() {
    return !!this.prefill;
  }

  private get model(): Game {
    return this.prefill ? this.prefill : this.game;
  }

  private request(path: string) {
    return this.editMode
      ? API.axios.patch<Game>(`${path}/${this.model.primaryKey}`, this.model)
      : API.axios.put<Game>(`${path}`, this.model);
  }

  private send() {
    this.loading = true;
    this.request("my/event/game")
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
    this.game = new Game();
    this.$emit("close");
  }
}
</script>
