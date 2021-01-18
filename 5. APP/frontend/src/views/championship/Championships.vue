<template>
  <v-container fluid style="max-width: 1500px">
    <v-toolbar class="mb-3" flat outlined rounded>
      <v-toolbar-title>My championships</v-toolbar-title>
      <v-spacer />
      <v-text-field v-model="searchQuery" dense hide-details outlined prepend-inner-icon="mdi-magnify" single-line></v-text-field>
      <v-btn icon @click="addChampionship">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" max-width="750" persistent>
      <CreateChampionship @confirm="afterConfirm" @close="() => (this.dialog = false)" :prefill="editedChampionship" />
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
        <v-card v-for="championship in pagination.result" :key="championship.id" class="ma-3" outlined>
          <v-list-item :to="{name: 'ChampionshipIndex', params: {id: championship.id}}" link>
            <v-list-item-content>
              <v-list-item-title>{{ championship.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-shield-star</v-icon>
                  {{ championship.league.level }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn class="mx-1" color="error" elevation="0" fab x-small @click.prevent="prepareDelete(championship)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="primary" elevation="0" fab x-small @click.prevent="editTeam(championship)">
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
      @confirm="deleteChampionship"
    ></ConfirmModal>
    <v-footer app inset elevation="20" class="justify-center" v-if="nbPage > 1">
      <v-pagination @input="setPage" v-model="page" circle :length="nbPage"></v-pagination>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import API from "@/plugins/API";
import Pagination from "@/models/Pagination";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Championship from "@/models/Championship";
import CreateChampionship from "@/components/CreateChampionship.vue";

@Component({
  components: {ConfirmModal, CreateChampionship}
})
export default class Championships extends Vue {
  private dialog = false;
  private openConfirm = false;
  private page = 1;
  private limit = 20;
  private pagination: Pagination<Championship> | null = null;
  private editedChampionship: Championship | null = null;
  private deletedChampionship: Championship | null = null;
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
    this.pagination = await API.get<Pagination<Championship>>(Pagination, `my/championship?q=${query}&limit=${limit}&offset=${offset}`);
  }

  private async editTeam(championship: Championship) {
    this.editedChampionship = new Championship(championship);
    this.dialog = true;
  }

  private async deleteChampionship() {
    this.openConfirm = false;
    if (this.deletedChampionship) {
      await API.delete<Championship>(Championship, `my/championship/${this.deletedChampionship.id}`);
      await this.setPage();
    }
  }

  private async afterConfirm() {
    this.editedChampionship = null;
    await this.setPage();
  }

  private async addChampionship() {
    this.editedChampionship = null;
    this.dialog = true;
  }

  private async cancelDelete() {
    this.openConfirm = false;
    this.deletedChampionship = null;
  }

  private async prepareDelete(championship: Championship) {
    this.openConfirm = true;
    this.deletedChampionship = championship;
  }

  async mounted() {
    await this.setPage();
  }
}
</script>
