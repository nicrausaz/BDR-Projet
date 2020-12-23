<template>
  <v-container fluid style="max-width: 1500px">
    <v-toolbar rounded>
      <v-toolbar-title>Mes Clubs</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="dialog = true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" max-width="750">
      <CreateClub />
    </v-dialog>
    <v-list two-line>
      <v-list-item link v-for="club in pagination.result" :key="club.id">
        <v-list-item-content>
          <v-list-item-title>{{ club.name }}</v-list-item-title>
        </v-list-item-content>
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

  private get nbPage(): number {
    if (!this.pagination) return 0;
    return Math.ceil(this.pagination.total / this.pagination.limit);
  }

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    this.pagination = (await API.axios.get<Pagination<Club>>(`my/club?limit=${limit}&offset=${offset}`)).data;
  }

  async mounted() {
    await this.setPage();
  }
}
</script>
