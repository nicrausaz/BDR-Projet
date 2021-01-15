<template>
  <v-container fluid style="max-width: 1500px">
    <v-card :loading="loading" class="mx-auto" max-width="500">
      <v-toolbar flat>
        <v-icon>mdi-account</v-icon>
        <v-toolbar-title class="font-weight-light">Register</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-form v-model="valid">
        <v-container>
          <v-alert type="error" v-for="(error, index) in errors" :key="index">{{ error }}</v-alert>
          <v-text-field filled label="Firstname" type="text" v-model="data.firstname" required />
          <v-text-field filled label="Lastname" type="text" v-model="data.lastname" required />
          <v-text-field filled label="Email" type="email" v-model="data.email" required />
          <v-text-field filled label="Password" type="password" v-model="data.password" required />
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed :disabled="!valid" @click="register">
            <v-icon left> mdi-login</v-icon>
            Register
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Administrator from "@/models/Administrator";
import API from "@/plugins/API";

@Component({
  components: {}
})
export default class Register extends Vue {
  private valid = false;
  private data = new Administrator();

  private loading = false;

  private errors: string[] = [];

  public register() {
    this.errors = [];
    this.loading = true;
    API.axios
      .post("/auth/register", this.data)
      .catch((e) => {
        if (e.response.data.name === "AJV_VALIDATION_ERROR") this.errors.push(...e.response.data.errors.map((e: Error) => e.message));
        else this.errors.push(e.response.data.message);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
