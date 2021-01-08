<template>
  <v-container v-if="pagination" fluid style="max-width: 1500px">
    <v-toolbar class="mb-3" flat outlined rounded>
      <v-toolbar-title>Logs</v-toolbar-title>
      <v-spacer />
      <v-text-field v-model="searchQuery" dense hide-details outlined prepend-inner-icon="mdi-magnify" single-line></v-text-field>
    </v-toolbar>
    <v-card flat outlined>
      <v-list>
        <v-card v-for="item in pagination.result" :key="item.id" class="ma-3" flat outlined>
          <v-list-item>
            <v-list-item-avatar color="warning">
              <v-icon dark>{{ getIcon(item).icon }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ item.operation }} {{ item.tableName }} ({{ item.resourceId }})</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-calendar</v-icon>
                  {{ item.executedAt.toLocaleDateString() }}
                </v-chip>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-clock</v-icon>
                  {{ item.executedAt.toLocaleTimeString() }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-list>
    </v-card>

    <v-footer app inset elevation="20" class="justify-center" v-if="pagination.nbPage > 1">
      <v-pagination @input="setPage" v-model="page" circle :length="pagination.nbPage"></v-pagination>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import API from "@/plugins/API";
import Pagination from "@/models/Pagination";
import Log from "@/models/Log";

@Component
export default class Logs extends Vue {
  private page = 1;
  private limit = 20;
  private pagination: Pagination<Log> | null = null;
  private searchQuery = "";

  @Watch("searchQuery") onQuery() {
    this.setPage();
  }

  async setPage() {
    const limit = this.limit;
    const offset = (this.page - 1) * limit;
    const query = this.searchQuery.trim();
    this.pagination = await API.get<Pagination<Log>>(Pagination, `log/?q=${query}&limit=${limit}&offset=${offset}`);
  }

  async mounted() {
    await this.setPage();
  }

  private getIcon(log: Log) {
    switch (log.operation) {
      case "delete":
        return {icon: "mdi-delete-circle-outline"};
      case "insert":
        return {icon: "mdi-plus-circle-outline"};
      case "update":
        return {icon: "mdi-circle-edit-outline"};
      default:
        return {icon: "mdi-bell"};
    }
  }
}
</script>
