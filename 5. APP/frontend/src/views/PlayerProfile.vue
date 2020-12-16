<template>
  <v-container fluid v-if="player">
    <v-card class="mx-auto" dark>
      <v-img
        height="100%"
        gradient="to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)"
        src="https://news.utexas.edu/wp-content/uploads/2017/01/football_stadium.jpg"
      >
        <v-row align="end" class="fill-height">
          <v-col class="align-self-middle text-center py-5" cols="12">
            <v-avatar class="profile" color="grey" size="250">
              <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
            </v-avatar>
          </v-col>
          <v-col class="py-5 text-center">
            <span class="headline">{{ player.firstname }} {{ player.lastname }}</span>
          </v-col>
        </v-row>
      </v-img>
    </v-card>
    <v-card class="mx-auto mt-4">
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo"> {{ player.sex === "M" ? "mdi-gender-male" : "mdi-gender-female" }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ player.sex === "M" ? "Male" : "Female" }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo"> mdi-human-male-height</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ player.height }} cm</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo"> mdi-weight-kilogram</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ player.weight }} kg</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo"> mdi-cake</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ player.birthdate }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Player from "@/models/Player";
import API from "@/plugins/API";

@Component
export default class PlayerProfile extends Vue {
  private player: Player | null = null;

  async mounted() {
    const {id} = this.$route.params;
    this.player = (await API.axios.get<Player>(`player/${id}`)).data;
  }
}
</script>
