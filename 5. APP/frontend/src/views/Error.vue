<template>
  <v-container style="max-width: 1000px">
    <v-card>
      <v-container class="text-center">
        <v-avatar tile size="250" class="ma-5 ghost">
          <v-img :src="require('@/assets/ghost.svg')" />
        </v-avatar>
        <h1 class="heading">Whoops!</h1>
        <h2 class="heading">It seems like we couldn't find the page you were looking for</h2>
        <v-btn :to="{name: 'Home'}" x-large color="success" class="ma-5">Go Home</v-btn>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class Error extends Vue {}
</script>

<style scoped>
@keyframes flying {
  from {
    transform: translateY(-5px);
  }

  to {
    transform: translateY(5px);
  }
}

.ghost {
  animation-duration: 2s;
  animation-name: flying;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
}
</style>
