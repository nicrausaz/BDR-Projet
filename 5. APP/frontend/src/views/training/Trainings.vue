<template>
  <v-container fluid style="max-width: 1500px" v-if="pagination">
    <v-toolbar class="mb-3" flat outlined rounded>
      <v-toolbar-title>Les Entraînements</v-toolbar-title>
      <v-spacer />
      <v-text-field v-model="searchQuery" dense hide-details outlined prepend-inner-icon="mdi-magnify" single-line></v-text-field>
      <v-btn icon @click="addTraining">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" max-width="750" persistent>
      <CreateTraining :prefill="editedTraining" @close="() => (this.dialog = false)" @confirm="afterConfirm" />
    </v-dialog>
    <v-card flat outlined>
      <v-list two-line>
        <v-card v-for="training in pagination.result" :key="training.uid" class="ma-3" flat outlined>
          <v-list-item :to="{name: 'TrainingIndex', params: {id: training.uid}}" link>
            <v-list-item-content>
              <v-list-item-title>{{ training.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-calendar</v-icon>
                  {{ training.startAt.toLocaleDateString() }}
                </v-chip>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-stadium</v-icon>
                  {{ training.stadium.name }}
                </v-chip>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-account-multiple</v-icon>
                  {{ training.team.name }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn class="mx-1" color="error" elevation="0" fab x-small @click.prevent="deleteTraining(training)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="primary" elevation="0" fab x-small @click.prevent="editTraining(training)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-list>
    </v-card>
    <v-footer app inset elevation="20" class="justify-center">
      <v-pagination @input="setPage" v-model="page" circle :length="Math.ceil(pagination.total / pagination.limit)"></v-pagination>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import API from "@/plugins/API";
import Training from "@/models/Training";
import Pagination from "@/models/Pagination";
import CreateTraining from "@/components/CreateTraining.vue";

@Component({
  components: {CreateTraining}
})
export default class Trainings extends Vue {
  private dialog = false;
  private page = 1;
  private limit = 20;
  private pagination: Pagination<Training> | null = null;
  private editedTraining: Training | null = null;
  private searchQuery = "";

  @Watch("searchQuery") onQuery() {
    this.setPage();
  }

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    const query = this.searchQuery.trim();
    this.pagination = await API.get<Pagination<Training>>(Pagination, `my/training?q=${query}&limit=${limit}&offset=${offset}`);
  }

  private async afterConfirm() {
    this.editedTraining = null;
    await this.setPage();
  }

  private async addTraining() {
    this.editedTraining = null;
    this.dialog = true;
  }

  private async editTraining(training: Training) {
    this.editedTraining = new Training(training);
    this.dialog = true;
  }

  private async deleteTraining(training: Training) {
    await API.delete<Training>(Training, `my/training/${training.uid}`);
    await this.setPage();
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
