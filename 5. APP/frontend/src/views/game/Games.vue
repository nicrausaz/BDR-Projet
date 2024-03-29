<template>
  <v-container fluid style="max-width: 1500px" v-if="pagination">
    <v-toolbar class="mb-3" flat outlined rounded>
      <v-toolbar-title>My games</v-toolbar-title>
      <v-spacer />
      <v-text-field v-model="searchQuery" dense hide-details outlined prepend-inner-icon="mdi-magnify" single-line></v-text-field>
      <v-btn icon @click="addGame">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" max-width="750" persistent>
      <CreateGame :prefill="editedGame" @close="() => (this.dialog = false)" @confirm="afterConfirm" />
    </v-dialog>
    <v-card flat outlined>
      <v-list two-line>
        <v-card v-if="pagination.result.length === 0" class="ma-3" outlined>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>We are sorry, we have no result with this request</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card v-for="game in pagination.result" :key="game.uid" class="ma-3" flat outlined>
          <v-list-item :to="{name: 'GameIndex', params: {id: game.uid}}" link>
            <v-list-item-content>
              <v-list-item-title>{{ game.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-calendar</v-icon>
                  {{ game.startAt.toLocaleDateString() }}
                </v-chip>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-stadium</v-icon>
                  {{ game.stadium.name }}
                </v-chip>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-shield-star</v-icon>
                  {{ game.championship.name }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn class="mx-1" color="error" elevation="0" fab x-small @click.prevent="prepareDelete(game)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="primary" elevation="0" fab x-small @click.prevent="editGame(game)">
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
      text="Are you sure ? This action cannot be undone."
      @close="cancelDelete"
      @confirm="deleteGame"
    ></ConfirmModal>
    <v-footer v-if="nbPage > 1" app class="justify-center" elevation="20" inset>
      <v-pagination v-model="page" :length="nbPage" circle @input="setPage"></v-pagination>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import API from "@/plugins/API";
import Game from "@/models/Game";
import Pagination from "@/models/Pagination";
import CreateGame from "@/components/CreateGame.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

@Component({
  components: {CreateGame, ConfirmModal}
})
export default class Games extends Vue {
  private dialog = false;
  private openConfirm = false;
  private page = 1;
  private limit = 20;
  private pagination: Pagination<Game> | null = null;
  private editedGame: Game | null = null;
  private deletedGame: Game | null = null;
  private searchQuery = "";

  @Watch("searchQuery") onQuery() {
    this.setPage();
  }

  private get nbPage(): number {
    if (!this.pagination) return 0;
    return Math.ceil(this.pagination.total / this.pagination.limit);
  }

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    const query = this.searchQuery.trim();
    this.pagination = await API.get<Pagination<Game>>(Pagination, `my/game?q=${query}&limit=${limit}&offset=${offset}`);
  }

  private async afterConfirm() {
    this.editedGame = null;
    await this.setPage();
  }

  private async addGame() {
    this.editedGame = null;
    this.dialog = true;
  }

  private async editGame(game: Game) {
    this.editedGame = new Game(game);
    this.dialog = true;
  }

  private async deleteGame() {
    this.openConfirm = false;
    if (this.deletedGame) {
      await API.delete<Game>(Game, `my/game/${this.deletedGame.uid}`);
      await this.setPage();
    }
  }

  private async cancelDelete() {
    this.openConfirm = false;
    this.deletedGame = null;
  }

  private async prepareDelete(game: Game) {
    this.openConfirm = true;
    this.deletedGame = game;
  }

  async mounted() {
    await this.setPage();
  }
}
</script>

<style>
.blur {
  backdrop-filter: blur(20px);
}
</style>
