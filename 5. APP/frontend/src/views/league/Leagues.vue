<template>
  <v-container fluid style="max-width: 1500px">
    <v-toolbar class="mb-3" flat outlined rounded>
      <v-toolbar-title>My leagues</v-toolbar-title>
      <v-spacer />
      <v-text-field v-model="searchQuery" dense hide-details outlined prepend-inner-icon="mdi-magnify" single-line></v-text-field>
      <v-btn icon @click="addLeague">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" max-width="750" persistent>
      <CreateLeague @confirm="afterConfirm" @close="() => (this.dialog = false)" :prefill="editedLeague" />
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
        <v-card v-for="league in pagination.result" :key="league.id" class="ma-3" outlined>
          <v-list-item :to="{name: 'LeagueIndex', params: {id: league.id}}" link>
            <v-list-item-content>
              <v-list-item-title>{{ league.level }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn class="mx-1" color="error" elevation="0" fab x-small @click.prevent="prepareDelete(league)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="primary" elevation="0" fab x-small @click.prevent="editLeague(league)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-list>
    </v-card>
    <ConfirmModal
      :open="openConfirm"
      text="Are you sure ? This action cannot be undone. Related championships will be delete."
      @close="cancelDelete"
      @confirm="deleteLeague"
    ></ConfirmModal>
    <v-footer app inset elevation="20" class="justify-center" v-if="nbPage > 1">
      <v-pagination @input="setPage" v-model="page" circle :length="nbPage"></v-pagination>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import MyClubInput from "@/components/input/ClubInput.vue";
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";
import Pagination from "@/models/Pagination";
import ConfirmModal from "@/components/ConfirmModal.vue";
import League from "@/models/League";
import CreateLeague from "@/components/CreateLeague.vue";

@Component({
  components: {CreateLeague, LeagueInput, MyClubInput, ConfirmModal}
})
export default class Leagues extends Vue {
  private dialog = false;
  private openConfirm = false;
  private page = 1;
  private limit = 20;
  private pagination: Pagination<League> | null = null;
  private editedLeague: League | null = null;
  private deletedLeague: League | null = null;
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
    this.pagination = await API.get<Pagination<League>>(Pagination, `my/league?q=${query}&limit=${limit}&offset=${offset}`);
  }

  private async editLeague(league: League) {
    this.editedLeague = new League(league);
    this.dialog = true;
  }

  private async deleteLeague() {
    this.openConfirm = false;
    if (this.deletedLeague) {
      await API.delete<League>(League, `my/league/${this.deletedLeague.id}`);
      await this.setPage();
    }
  }

  private async afterConfirm() {
    this.editedLeague = null;
    await this.setPage();
  }

  private async addLeague() {
    this.editedLeague = null;
    this.dialog = true;
  }

  private async cancelDelete() {
    this.openConfirm = false;
    this.deletedLeague = null;
  }

  private async prepareDelete(league: League) {
    this.openConfirm = true;
    this.deletedLeague = league;
  }

  async mounted() {
    await this.setPage();
  }
}
</script>
