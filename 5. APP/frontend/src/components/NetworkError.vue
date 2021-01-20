<template>
  <v-container>
    <v-alert v-if="api.networkError" prominent type="error">
      <v-row align="center">
        <v-col class="grow">
          {{ api.networkError }}
        </v-col>
        <v-col class="shrink">
          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{on, attrs}">
              <v-btn v-bind="attrs" v-on="on">Server settings</v-btn>
            </template>

            <v-card>
              <v-card-title class="headline grey lighten-2">Server settings</v-card-title>

              <v-card-text>
                <v-text-field v-model="server" label="Server address" />
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="save"> I accept</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import API from "@/plugins/API";

@Component
export default class NetworkError extends Vue {
  private api = API;
  private dialog = false;
  private server: string = API.getServer();

  private save() {
    API.setServer(this.server);
    this.dialog = false;
    this.$router.go(0);
  }
}
</script>
