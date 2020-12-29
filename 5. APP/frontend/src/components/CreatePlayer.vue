<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create Player</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-text-field required filled v-model="player.firstname" label="Firstname" />
        <v-text-field required filled v-model="player.lastname" label="Lastname" />
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
          <template v-slot:activator="{on, attrs}">
            <v-text-field
              required
              filled
              v-model="player.birthdate"
              label="Birthdate"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker @input="menu = false" v-model="player.birthdate"></v-date-picker>
        </v-menu>
        <v-radio-group required label="Sex" v-model="player.sex" row mandatory>
          <v-radio label="Male" value="M"></v-radio>
          <v-radio label="Female" value="F"></v-radio>
        </v-radio-group>
        <v-slider required label="Height" v-model="player.height" step="1" thumb-label ticks min="100" max="250"></v-slider>
        <v-slider required label="Weight" v-model="player.weight" step="1" thumb-label ticks min="30" max="150"></v-slider>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn v-if="prefill" depressed :disabled="!valid" @click="update">
          <v-icon left>mdi-pencil</v-icon>
          Update
        </v-btn>
        <v-btn v-else depressed :disabled="!valid" @click="create">
          <v-icon left>mdi-plus</v-icon>
          Create
        </v-btn>
      </v-card-actions>
    </v-form>
    <pre>Current data: {{ player }}</pre>
    <pre>PROPS: {{ prefill }}</pre>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import MyClubInput from "@/components/input/MyClubInput.vue";
import Player from "@/models/Player";
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";

@Component({
  components: {LeagueInput, MyClubInput}
})
export default class CreatePlayer extends Vue {
  @Prop() prefill!: Player;

  private valid = false;
  private loading = false;
  private menu = false;
  private player = this.prefill || new Player();

  private create() {
    this.loading = true;

    API.axios
      .put<Player>(`my/player`, this.player)
      .then((e) => console.log(e))
      .catch((e) => console.log(e))
      .finally(() => {
        this.loading = false;
        this.$emit("confirm");
      });
  }

  private update() {
    this.loading = true;
  }

  async mounted() {
    // TODO: A fix: Le composant est mount 1 seule fois donc player n'est pas bon
    this.player = this.prefill;
    console.log("Mounted");
  }
}
</script>
