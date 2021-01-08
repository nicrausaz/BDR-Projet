<template>
  <v-container fluid style="max-width: 1500px">
    <v-toolbar class="mb-3" flat outlined rounded>
      <v-toolbar-title>Mes Équipes</v-toolbar-title>
      <v-spacer />
      <v-text-field v-model="searchQuery" dense hide-details outlined prepend-inner-icon="mdi-magnify" single-line></v-text-field>
      <v-btn icon @click="addTeam">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" max-width="750" persistent>
      <CreateTeam @confirm="afterConfirm" @close="() => (this.dialog = false)" :prefill="editedTeam" />
    </v-dialog>
    <v-card outlined>
      <v-list v-if="pagination" two-line>
        <v-card v-if="pagination.result.length === 0" class="ma-3" outlined>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>We are sorry, we have no result with this request</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card v-for="team in pagination.result" :key="team.id" class="ma-3" outlined>
          <v-list-item :to="{name: 'Team', params: {id: team.id}}" link>
            <v-list-item-content>
              <v-list-item-title>{{ team.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="mr-2" label small>
                  {{ team.club.name }}
                </v-chip>
                <v-chip class="mr-2" label small>
                  {{ team.league.level }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn class="mx-1" color="error" elevation="0" fab x-small @click.prevent="deleteTeam(team)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="primary" elevation="0" fab x-small @click.prevent="editTeam(team)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-list>
    </v-card>
    <v-footer app inset elevation="20" class="justify-center" v-if="nbPage > 1">
      <v-pagination @input="setPage" v-model="page" circle :length="nbPage"></v-pagination>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
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
  private searchQuery = "";

  private get nbPage(): number {
    if (!this.pagination) return 0;
    return Math.ceil(this.pagination.total / this.pagination.limit);
  }

  @Watch("searchQuery") onQuery() {
    this.setPage();
  }

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    const query = this.searchQuery.trim();
    this.pagination = await API.get<Pagination<Team>>(Pagination, `my/team?q=${query}&limit=${limit}&offset=${offset}`);
  }

  private async editTeam(team: Team) {
    this.editedTeam = new Team(team);
    this.dialog = true;
  }

  private async deleteTeam(team: Team) {
    await API.delete<Team>(Team, `my/team/${team.id}`);
    await this.setPage();
  }

  private async afterConfirm() {
    this.editedTeam = null;
    await this.setPage();
  }

  private async addTeam() {
    this.editedTeam = null;
    this.dialog = true;
  }

  async mounted() {
    await this.setPage();
  }
}
</script>
