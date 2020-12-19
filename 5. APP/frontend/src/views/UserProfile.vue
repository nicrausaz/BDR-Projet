<template>
  <v-container fluid v-if="administrator" style="max-width: 1500px">
    <v-card class="mx-auto" dark>
      <v-parallax :src="require('@/assets/background.jpg')" height="400">
        <v-row align="end">
          <v-col class="align-self-middle text-center" cols="12">
            <v-avatar class="profile elevation-24" color="grey" :size="$vuetify.breakpoint.xs ? 200 : 250">
              <v-img :src="administrator.avatar"></v-img>
            </v-avatar>
          </v-col>
          <v-col class="py-7 text-center">
            <span class="text-h4">{{ administrator.firstname }} {{ administrator.lastname }}</span>
          </v-col>
        </v-row>
      </v-parallax>
    </v-card>
    <v-card class="mx-auto mt-4">
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo"> mdi-email</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ administrator.email }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {namespace} from "vuex-class";
import Administrator from "@/models/Administrator"; // @ is an alias to /src
import Header from "@/components/Header.vue";

const administrator = namespace("administrator");
@Component({
  components: {Header}
})
export default class UserProfile extends Vue {
  @administrator.State
  administrator?: Administrator;
}
</script>
