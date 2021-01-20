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
          <Header :height="250">
            <v-row align="center" justify="center">
              <v-col class="text-right text-h6 text-md-h5 text-uppercase">
                <v-row align="center" no-gutters>
                  <v-col class="text-break" cols="12">{{ model.teamHome.name }}</v-col>
                  <v-col><IncrementInput min-value="0" v-model="model.scoreHome" /></v-col>
                </v-row>
              </v-col>
              <v-col class="text-center text-h3 text-md-h1 font-weight-bold">
                <ContentEditable v-model="model.scoreHome" />:<ContentEditable v-model="model.scoreGuest" />
              </v-col>
              <v-col class="text-left text-h6 text-md-h5 text-uppercase">
                <v-row align="center" no-gutters>
                  <v-col class="text-break" cols="12">{{ model.teamGuest.name }}</v-col>
                  <v-col><IncrementInput min-value="0" v-model="model.scoreGuest" /></v-col>
                </v-row>
              </v-col>
            </v-row>
          </Header>
        </template>
        <v-row>
          <v-col cols="8">
            <v-text-field v-model="model.name" filled label="Name" required />
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="model.gameId" filled label="Game ID" required />
          </v-col>
          <v-col cols="6">
            <DateInput v-model="model.startAt" label="Start At" />
          </v-col>
          <v-col cols="6">
            <DateInput v-model="model.endAt" label="End At" />
          </v-col>
          <v-col cols="6">
            <StadiumInput v-model="model.stadium" />
          </v-col>
          <v-col cols="6">
            <ChampionshipInput v-model="model.championship" restricted="true" />
          </v-col>
          <v-col cols="6">
            <TeamInput v-model="model.teamHome" />
          </v-col>
          <v-col cols="6">
            <TeamInput v-model="model.teamGuest" />
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
import Game from "@/models/Game";
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";
import DateInput from "@/components/input/DateInput.vue";
import TeamInput from "@/components/input/TeamInput.vue";
import StadiumInput from "@/components/input/StadiumInput.vue";
import ChampionshipInput from "@/components/input/ChampionshipInput.vue";
import Header from "@/components/Header.vue";
import IncrementInput from "@/components/input/IncrementInput.vue";
import ContentEditable from "@/components/input/ContentEditable.vue";

@Component({
  components: {
    ContentEditable,
    IncrementInput,
    Header,
    ChampionshipInput,
    StadiumInput,
    TeamInput,
    DateInput,
    LeagueInput
  }
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
    this.request("my/game")
      .then(() => {
        this.close();
        this.$emit("confirm");
      })
      .catch((e) => {
        this.error = e.response.data.message;
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
