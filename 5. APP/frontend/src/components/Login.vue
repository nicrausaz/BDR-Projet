<template>
  <v-container>
    <v-card>
      <v-toolbar flat>
        <v-icon>mdi-account</v-icon>
        <v-toolbar-title class="font-weight-light">
          Login
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-container>
        <v-text-field filled type="email" label="Email"/>
        <v-text-field filled type="password" label="Password"/>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn depressed>
          <v-icon left>
            mdi-login
          </v-icon>
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Login extends Vue {
}
</script>
