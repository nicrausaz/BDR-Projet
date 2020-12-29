<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create Player</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-text-field required filled v-model="model.firstname" label="Firstname" />
        <v-text-field required filled v-model="model.lastname" label="Lastname" />
        <BirthdateInput v-model="model.birthdate" />
        <v-radio-group required label="Sex" v-model="model.sex" row mandatory>
          <v-radio label="Male" value="M"></v-radio>
          <v-radio label="Female" value="F"></v-radio>
        </v-radio-group>
        <v-slider required label="Height" v-model="model.height" step="1" thumb-label ticks min="100"
                  max="250"></v-slider>
        <v-slider required label="Weight" v-model="model.weight" step="1" thumb-label ticks min="30"
                  max="150"></v-slider>
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
import MyClubInput from "@/components/input/MyClubInput.vue";
import Player from "@/models/Player";
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";
import BirthdateInput from "@/components/input/BirthdateInput.vue";

@Component({
  components: {BirthdateInput, LeagueInput, MyClubInput}
})
export default class CreatePlayer extends Vue {
  @Prop() prefill!: Player;

  private valid = false;
  private loading = false;
  private player = new Player();

  private request() {
    return this.prefill
      ? API.axios.patch<Player>(`my/player/${this.model.uid}`, this.model)
      : API.axios.put<Player>(`my/player`, this.model);
  }

  get model(): Player {
    return this.prefill ? this.prefill : this.player;
  }

  private send() {
    this.loading = true;
    this.request()
      .then((e) => console.log(e))
      .catch((e) => console.log(e))
      .finally(() => {
        this.loading = false;
        this.close();
        this.$emit("confirm");
      });
  }

  async mounted() {
    console.log("Mounted");
  }

  private close() {
    this.player = new Player();
    this.$emit("close");
  }
}
</script>
