<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create Club</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-text-field required filled v-model="club.name" label="Name" />
        <SportInput required v-model="club.sport" />
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
import Team from "@/models/Team";
import API from "@/plugins/API";
import Club from "@/models/Club";
import SportInput from "@/components/input/SportInput.vue";

@Component({
  components: {SportInput}
})
export default class CreateClub extends Vue {
  private valid = false;
  private loading = false;
  private club = new Club();

  private create() {
    this.loading = true;
    API.axios
      .put<Team>(`my/club`, this.club)
      .then((e) => console.log(e))
      .catch((e) => console.log(e))
      .finally(() => {
        this.loading = false;
        this.$emit("confirm");
      });
  }
}
</script>
