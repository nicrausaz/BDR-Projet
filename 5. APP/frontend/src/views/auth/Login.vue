<template>
  <v-container fluid style="max-width: 1500px">
    <v-card :loading="loading" class="mx-auto" max-width="500">
      <v-toolbar flat>
        <v-icon>mdi-account</v-icon>
        <v-toolbar-title class="font-weight-light">Login</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-form v-model="valid" @submit.prevent="login">
        <v-container>
          <v-alert type="error" v-if="error">{{ error }}</v-alert>
          <v-text-field filled label="Email" type="email" v-model="data.email" required />
          <v-text-field filled label="Password" type="password" v-model="data.password" required />
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed :to="{name: 'Register'}">
            <v-icon left>mdi-account-plus</v-icon>
            Register
          </v-btn>
          <v-btn :disabled="!valid" depressed type="submit">
            <v-icon left>mdi-login</v-icon>
            Login
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {namespace} from "vuex-class";
import Credentials from "@/models/Credentials";

const administrator = namespace("administrator");

@Component({
  components: {}
})
export default class Login extends Vue {
  private valid = false;
  private data = new Credentials();

  private loading = false;

  private error: string | null = null;

  @administrator.Action("login")
  public log!: ({email, password}: Credentials) => Promise<true | Error>;

  public login() {
    this.error = null;
    this.loading = true;
    this.log(this.data)
      .then((e) => {
        if (e instanceof Error) {
          return (this.error = e.message);
        }
        this.$router.push((this.$route.query.to as string) ?? "/");
      })
      .finally(() => {
        this.data = new Credentials();
        this.loading = false;
      });
  }
}
</script>
