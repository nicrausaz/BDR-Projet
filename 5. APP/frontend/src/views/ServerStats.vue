<template>
  <v-container fluid style="max-width: 1500px">
    <v-list>
      <v-card v-for="item in items" :key="item.id" class="ma-3" flat outlined>
        <v-list-item>
          <v-list-item-avatar>
            <v-avatar color="primary" size="36">
              <span class="white--text font-weight-bold text-center">
                {{ item.statusCode }}
              </span>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.path }}</v-list-item-title>
            <v-list-item-subtitle>
              <v-chip-group show-arrows center-active>
                <v-chip class="mr-2" label small>
                  {{ item.method }}
                </v-chip>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-clock</v-icon>
                  {{ item.duration }} ms
                </v-chip>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-calendar</v-icon>
                  {{ item.at.toLocaleDateString() }}
                </v-chip>
                <v-chip class="mr-2" label small>
                  <v-icon left small>mdi-clock</v-icon>
                  {{ item.at.toLocaleTimeString() }}
                </v-chip>
                <v-chip class="mr-2" label small>
                  {{ item.ip }}
                </v-chip>
                <v-chip class="mr-2" label small v-if="item.user">
                  {{ item.user }}
                </v-chip>
              </v-chip-group>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import API from "@/plugins/API";

interface ApiRequestInterface {
  id: string;
  path: string;
  ip: string;
  statusCode: number;
  method: string;
  at: Date;
  duration: number;
  user: string;
}

@Component
export default class ServerStats extends Vue {
  items: ApiRequestInterface[] = [];

  async mounted() {
    API.socket?.on("apiRequest", (data: ApiRequestInterface) => {
      data.at = new Date(data.at);
      this.items.unshift(data);
      this.items = this.items.slice(0, 10);
    });
  }
}
</script>
