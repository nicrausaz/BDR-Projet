<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create Championship</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="model.name" filled label="Name" required />
          </v-col>
          <v-col cols="12">
            <DateInput v-model="model.startAt" label="Start At" />
          </v-col>
          <v-col cols="12">
            <DateInput v-model="model.endAt" label="End At" />
          </v-col>
          <v-col cols="12">
            <LeagueInput v-model="model.league" restricted="true" />
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
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";
import DateInput from "@/components/input/DateInput.vue";
import Header from "@/components/Header.vue";
import Championship from "@/models/Championship";

@Component({
  components: {Header, DateInput, LeagueInput}
})
export default class CreateChampionship extends Vue {
  @Prop() prefill!: Championship;
  private valid = false;
  private loading = false;
  private error: string | null = null;
  private game = new Championship();

  private get editMode() {
    return !!this.prefill;
  }

  private get model(): Championship {
    return this.prefill ? this.prefill : this.game;
  }

  private request(path: string) {
    return this.editMode
      ? API.axios.patch<Championship>(`${path}/${this.model.primaryKey}`, this.model)
      : API.axios.put<Championship>(`${path}`, this.model);
  }

  private send() {
    this.loading = true;
    this.request("my/championship")
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
    this.game = new Championship();
    this.$emit("close");
  }
}
</script>
