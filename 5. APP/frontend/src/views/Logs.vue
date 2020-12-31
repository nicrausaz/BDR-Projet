<template>
  <v-container fluid style="max-width: 1000px" v-if="pagination">
    <v-list>
      <v-list-item v-for="item in pagination.result" :key="item.id">
        <v-list-item-avatar color="warning">
          <v-icon dark>mdi-alert</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ item.event }} ({{ item.resourceId }})</v-list-item-title>
          <v-list-item-subtitle
          >{{ item.executedAt.toLocaleDateString() }} at {{ item.executedAt.toLocaleTimeString() }}
          </v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-footer app inset elevation="20" class="justify-center" v-if="pagination.nbPage > 1">
      <v-pagination @input="setPage" v-model="page" circle :length="pagination.nbPage"></v-pagination>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import API from "@/plugins/API";
import Pagination from "@/models/Pagination";
import Log from "@/models/Log";

@Component
export default class Logs extends Vue {
  private page = 1;
  private limit = 20;
  private pagination: Pagination<Log> = null;

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    this.pagination = await API.get<Pagination<Log>>(Pagination, `log/?limit=${limit}&offset=${offset}`);
  }

  async mounted() {
    await this.setPage();
  }
}
</script>
