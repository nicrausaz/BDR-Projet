<template>
  <v-container fluid style="max-width: 1500px" v-if="pagination">
    <v-toolbar class="mb-3" flat outlined rounded>
      <v-toolbar-title>Federations</v-toolbar-title>
      <v-spacer />
      <v-text-field v-model="searchQuery" dense hide-details outlined prepend-inner-icon="mdi-magnify" single-line></v-text-field>
      <v-btn icon @click="addFederation">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" max-width="750" persistent>
      <CreateFederation :prefill="editedFederation" @close="() => (this.dialog = false)" @confirm="afterConfirm" />
    </v-dialog>
    <v-card flat outlined>
      <v-list two-line>
        <v-card v-for="federation in pagination.result" :key="federation.id" class="ma-3" flat outlined>
          <v-list-item :to="{name: 'FederationIndex', params: {id: federation.id}}" link>
            <v-list-item-content>
              <v-list-item-title>{{ federation.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-basketball</v-icon>
                  {{ federation.sport.name }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn class="mx-1" color="error" elevation="0" fab x-small @click.prevent="deleteFederation(federation)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="primary" elevation="0" fab x-small @click.prevent="editFederation(federation)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-list>
    </v-card>
    <v-footer app inset elevation="20" class="justify-center">
      <!--<v-pagination @input="setPage" v-model="page" circle :length="Math.ceil(pagination.total / pagination.limit)"></v-pagination>-->
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import API from "@/plugins/API";
import Pagination from "@/models/Pagination";
import Federation from "@/models/Federation";
import CreateFederation from "@/components/input/CreateFederation.vue";

@Component({
  components: {CreateFederation}
})
export default class Federations extends Vue {
  private dialog = false;
  private page = 1;
  private limit = 20;
  private pagination: Pagination<Federation> | null = null;
  private editedFederation: Federation | null = null;
  private searchQuery = "";

  @Watch("searchQuery") onQuery() {
    this.setPage();
  }

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    const query = this.searchQuery.trim();
    this.pagination = await API.get<Pagination<Federation>>(Pagination, `my/federation?q=${query}&limit=${limit}&offset=${offset}`);
  }

  private async afterConfirm() {
    this.editedFederation = null;
    await this.setPage();
  }

  private async addFederation() {
    this.editedFederation = null;
    this.dialog = true;
  }

  private async editFederation(federation: Federation) {
    this.editedFederation = new Federation(federation);
    this.dialog = true;
  }

  private async deleteFederation(federation: Federation) {
    await API.delete<Federation>(Federation, `my/federation/${federation.id}`);
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
