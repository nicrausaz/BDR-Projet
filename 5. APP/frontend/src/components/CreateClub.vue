<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create Club</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-alert type="error" v-if="error">{{ error }}</v-alert>
        <v-text-field required filled v-model="model.name" label="Name" />
        <SportInput required v-model="model.sport" />
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
import API from "@/plugins/API";
import Club from "@/models/Club";
import SportInput from "@/components/input/SportInput.vue";

@Component({
  components: {SportInput}
})
export default class CreateClub extends Vue {
  @Prop() prefill!: Club;
  private valid = false;
  private loading = false;
  private error: string | null = null;
  private player = new Club();

  private request(path: string) {
    return this.prefill
      ? API.axios.patch<Club>(`${path}/${this.model.primaryKey}`, this.model)
      : API.axios.put<Club>(`${path}`, this.model);
  }

  private get model(): Club {
    return this.prefill ? this.prefill : this.player;
  }

  private send() {
    this.loading = true;
    this.request("my/club")
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
    this.player = new Club();
    this.$emit("close");
  }
}
</script>
