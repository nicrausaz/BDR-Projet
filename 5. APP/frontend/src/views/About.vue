<template>
  <v-container style="max-width: 1500px">
    <v-card>
      <v-container class="text-center">
        <v-avatar tile size="250" class="ma-5 ghost">
          <v-img :src="require('@/assets/logo.svg')" />
        </v-avatar>
        <h1 class="heading">StarSport</h1>
        <h2 class="heading">StarSport is a study project that takes place in the BDR course of the HEIG-VD school</h2>
        <v-btn :to="{name: 'Home'}" x-large color="success" class="ma-5">Go Home</v-btn>
      </v-container>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class About extends Vue {
}
</script>
