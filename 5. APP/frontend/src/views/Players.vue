<template>
  <v-container fluid style="max-width: 1500px">
    <v-toolbar class="mb-3" flat outlined rounded>
      <v-toolbar-title>Mes Joueurs</v-toolbar-title>
      <v-spacer />
      <v-text-field v-model="searchQuery" dense hide-details outlined prepend-inner-icon="mdi-magnify" single-line></v-text-field>
      <v-btn icon @click="addPlayer">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" max-width="750" persistent>
      <CreatePlayer @confirm="afterConfirm" @close="() => (this.dialog = false)" :prefill="editedPlayer" />
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
        <v-card v-for="player in pagination.result" :key="player.uid" class="ma-3" outlined>
          <v-list-item :to="{name: 'Player', params: {id: player.uid}}" link>
            <v-list-item-avatar color="grey">
              <v-img :src="player.avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ player.firstname }} {{ player.lastname }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn class="mx-1" color="error" elevation="0" fab x-small @click.prevent="deletePlayer(player)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="primary" elevation="0" fab x-small @click.prevent="editPlayer(player)">
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
import Player from "@/models/Player";
import CreatePlayer from "@/components/CreatePlayer.vue";

@Component({
  components: {CreatePlayer, LeagueInput, MyClubInput}
})
export default class Players extends Vue {
  private dialog = false;
  private page = 1;
  private limit = 10;
  private pagination: Pagination<Player> | null = null;
  private editedPlayer: Player | null = null;
  private searchQuery = "";

  private get nbPage(): number {
    if (!this.pagination) return 0;
    return Math.ceil(this.pagination.total / this.pagination.limit);
  }

  private async addPlayer() {
    this.editedPlayer = null;
    this.dialog = true;
  }

  private async editPlayer(player: Player) {
    this.editedPlayer = player;
    this.dialog = true;
  }

  @Watch("searchQuery") onQuery() {
    this.setPage();
  }

  private async afterConfirm() {
    this.editedPlayer = null;
    await this.setPage();
  }

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    const query = this.searchQuery.trim();
    this.pagination = await API.get<Pagination<Player>>(Pagination, `my/player?q=${query}&limit=${limit}&offset=${offset}`);
  }

  private async deletePlayer(player: Player) {
    await API.delete<Player>(Player, `my/player/${player.uid}`);
    await this.setPage();
  }

  async mounted() {
    await this.setPage();
  }
}
</script>
