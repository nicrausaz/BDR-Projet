<template>
  <v-container fluid v-if="player" style="max-width: 1000px">
    <v-card class="mx-auto" dark>
      <v-img
        max-height="500"
        gradient="to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)"
        src="https://news.utexas.edu/wp-content/uploads/2017/01/football_stadium.jpg"
      >
        <v-row align="end" class="fill-height">
          <v-col class="align-self-middle text-center py-5" cols="12">
            <v-avatar class="profile elevation-24" color="grey" :size="$vuetify.breakpoint.xs ? 200 : 250">
              <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
            </v-avatar>
          </v-col>
          <v-col class="py-7 text-center">
            <span class="text-h4">{{ player.firstname }} {{ player.lastname }}</span>
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

        <template v-if="player.height">
          <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo"> mdi-human-male-height</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ player.height }} cm</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-if="player.weight">
          <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-weight-kilogram</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ player.weight }} kg</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-if="player.birthdate">
          <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-cake</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ player.birthdate.toLocaleDateString() }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
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
