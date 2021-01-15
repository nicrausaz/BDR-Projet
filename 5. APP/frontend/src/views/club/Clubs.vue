<template>
  <v-container fluid style="max-width: 1500px">
    <v-toolbar class="mb-3" flat outlined rounded>
      <v-toolbar-title>My clubs</v-toolbar-title>
      <v-spacer />
      <v-text-field v-model="searchQuery" dense hide-details outlined prepend-inner-icon="mdi-magnify" single-line></v-text-field>
      <v-btn icon @click="addClub">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" max-width="750" persistent>
      <CreateClub @confirm="afterConfirm" @close="() => (this.dialog = false)" :prefill="editedClub" />
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
        <v-card v-for="club in pagination.result" :key="club.id" class="ma-3" outlined>
          <v-list-item :to="{name: 'ClubIndex', params: {id: club.id}}" link>
            <v-list-item-content>
              <v-list-item-title>{{ club.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn class="mx-1" color="error" elevation="0" fab x-small @click.prevent="deleteClub(club)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="primary" elevation="0" fab x-small @click.prevent="editClub(club)">
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
import MyClubInput from "@/components/input/ClubInput.vue";
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";
import Pagination from "@/models/Pagination";
import CreateTeam from "@/components/CreateTeam.vue";
import Club from "@/models/Club";
import CreateClub from "@/components/CreateClub.vue";

@Component({
  components: {CreateClub, CreateTeam, LeagueInput, MyClubInput}
})
export default class Clubs extends Vue {
  private dialog = false;
  private page = 1;
  private limit = 20;
  private pagination: Pagination<Club> | null = null;
  private editedClub: Club | null = null;
  private searchQuery = "";

  private get nbPage(): number {
    if (!this.pagination) return 0;
    return Math.ceil(this.pagination.total / this.pagination.limit);
  }

  private async addClub() {
    this.editedClub = null;
    this.dialog = true;
  }

  private async editClub(club: Club) {
    this.editedClub = new Club(club);
    this.dialog = true;
  }

  @Watch("searchQuery") onQuery() {
    this.setPage();
  }

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    const query = this.searchQuery.trim();
    this.pagination = await API.get<Pagination<Club>>(Pagination, `my/club?q=${query}&limit=${limit}&offset=${offset}`);
  }

  private async deleteClub(club: Club) {
    await API.delete<Club>(Club, `my/club/${club.id}`);
    await this.setPage();
  }

  private async afterConfirm() {
    this.editedClub = null;
    await this.setPage();
  }

  async mounted() {
    await this.setPage();
  }
}
</script>
