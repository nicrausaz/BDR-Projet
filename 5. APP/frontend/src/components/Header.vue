<template>
  <v-card class="mx-auto" dark flat>
    <v-parallax :height="height" :src="require('@/assets/background.jpg')">
      <v-card color="rgba(0,0,0,0.5)" class="pa-5 blur">
        <slot />
      </v-card>
    </v-parallax>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class Header extends Vue {
  @Prop({default: 400}) readonly height!: number;
}
</script>
