<template>
  <v-container>
    <v-card :loading="loading">
      <v-toolbar flat>
        <v-icon>mdi-account</v-icon>
        <v-toolbar-title class="font-weight-light"> Login</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-container>
        <v-text-field filled label="Email" type="email" v-model="email" />
        <v-text-field filled label="Password" type="password" v-model="password" />
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn depressed @click="log">
          <v-icon left> mdi-login</v-icon>
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {namespace} from "vuex-class";
const administrator = namespace("administrator");

@Component({
  components: {}
})
export default class Login extends Vue {
  private email = "";
  private password = "";
  private loading = false;

  @administrator.Action
  public login!: ({email, password}: {email: string; password: string}) => Promise<boolean>;

  public log() {
    this.loading = true;
    this.login({email: this.email, password: this.password}).finally(() => {
      this.loading = false;
    });
  }
}
</script>
