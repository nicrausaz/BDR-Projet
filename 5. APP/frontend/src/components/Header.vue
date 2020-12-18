<template>
  <v-card class="mx-auto" dark>
    <v-parallax :src="require('@/assets/background.jpg')" height="400">
      <v-card color="rgba(0,0,0,0.5)" class="pa-5 blur">
        <slot />
      </v-card>
    </v-parallax>
  </v-card>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class Header extends Vue {}
</script>
