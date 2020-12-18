<template>
  <div>
    <v-card @drop.prevent="addFile" @dragover.prevent width="325" height="325" class="d-flex justify-center fill-height">
      <v-img v-if="src" :src="src" class="fill-height" />
      <v-icon v-else size="100">mdi-file-image</v-icon>
    </v-card>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class Upload extends Vue {
  file: File | null = null;
  src: string | null = null;

  async addFile(e: DragEvent) {
    const file = e.dataTransfer.files.item(0);
    if (!(file.type === "image/png" || file.type === "image/jpeg")) return;
    this.file = file;
    URL.revokeObjectURL(this.src);
    this.src = URL.createObjectURL(this.file);
  }
}
</script>
