<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create League</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-col cols="12">
          <v-text-field v-model="model.level" filled label="Level" required />
        </v-col>
        <v-col cols="12">
          <v-radio-group required label="Gender" v-model="model.gender" row mandatory>
            <v-radio label="Male" value="M"></v-radio>
            <v-radio label="Female" value="F"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12">
          <FederationInput v-model="model.federation" restricted="true" />
        </v-col>
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
import Header from "@/components/Header.vue";
import League from "@/models/League";
import FederationInput from "@/components/input/FederationInput.vue";

@Component({
  components: {Header, FederationInput}
})
export default class CreateLeague extends Vue {
  @Prop() prefill!: League;
  private valid = false;
  private loading = false;
  private error: string | null = null;
  private league = new League();

  private get editMode() {
    return !!this.prefill;
  }

  private get model(): League {
    return this.prefill ? this.prefill : this.league;
  }

  private request(path: string) {
    return this.editMode
      ? API.axios.patch<Game>(`${path}/${this.model.primaryKey}`, this.model)
      : API.axios.put<Game>(`${path}`, this.model);
  }

  private send() {
    this.loading = true;
    this.request("my/league")
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
    this.league = new League();
    this.$emit("close");
  }
}
</script>
