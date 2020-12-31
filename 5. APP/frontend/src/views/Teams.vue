<template>
  <v-container fluid style="max-width: 1500px">
    <v-toolbar rounded>
      <v-toolbar-title>Mes équipes</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="addTeam">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" max-width="750" persistent>
      <CreateTeam @confirm="afterConfirm" @close="() => (this.dialog = false)" :prefill="editedTeam" />
    </v-dialog>
    <v-list two-line v-if="pagination">
      <v-list-item link v-for="team in pagination.result" :key="team.id" :to="{name: 'Team', params: {id: team.id}}">
        <v-list-item-content>
          <v-list-item-title>{{ team.name }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn small @click.prevent="editTeam(team)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-footer app inset elevation="20" class="justify-center" v-if="nbPage > 1">
      <v-pagination @input="setPage" v-model="page" circle :length="nbPage"></v-pagination>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import MyClubInput from "@/components/input/MyClubInput.vue";
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";
import Pagination from "@/models/Pagination";
import Team from "@/models/Team";
import CreateTeam from "@/components/CreateTeam.vue";

@Component({
  components: {CreateTeam, LeagueInput, MyClubInput}
})
export default class Teams extends Vue {
  private dialog = false;
  private page = 1;
  private limit = 20;
  private pagination: Pagination<Team> | null = null;
  private editedTeam: Team | null = null;

  private get nbPage(): number {
    if (!this.pagination) return 0;
    return Math.ceil(this.pagination.total / this.pagination.limit);
  }

  private async addTeam() {
    this.editedTeam = null;
    this.dialog = true;
  }

  private async editTeam(team: Team) {
    this.editedTeam = team;
    this.dialog = true;
  }

  private async afterConfirm() {
    this.editedTeam = null;
    await this.setPage();
  }

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    this.pagination = await API.get<Pagination<Team>>(Pagination, `my/team?limit=${limit}&offset=${offset}`);
  }

  async mounted() {
    await this.setPage();
  }
}
</script>
