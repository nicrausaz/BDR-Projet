<template>
  <div class="teams">
    <h1>This will show all user's teams</h1>
    <template>
      <v-data-table :headers="headers" :items="teams" :items-per-page="5" class="elevation-1"></v-data-table>
    </template>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {namespace} from "vuex-class";
import Team from "@/models/Team";
const team = namespace("team");

@Component
export default class Teams extends Vue {
  headers = [
    {text: "Name", value: "team.name"},
    {text: "Club", value: "club.name"},
    {text: "League", value: "league.level"}
  ];

  @team.State
  public teams!: Team[];

  @team.Action
  public fetchTeams!: (uid: string) => void;

  public mounted() {
    // Faut passer l'id du joueur quand on aura fait les accès
    this.fetchTeams("2724fe4b-02cf-4a49-a7e2-0a2c100fa277");
  }
}
</script>
