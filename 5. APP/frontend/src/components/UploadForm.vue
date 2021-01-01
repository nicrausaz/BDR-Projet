<template>
  <v-card>
    <v-overlay absolute v-if="isUploading">
      <v-progress-circular :size="70" :width="7" :value="percent" :indeterminate="percent >= 100" />
    </v-overlay>
    <v-form :disabled="isUploading">
      <v-container>
        <v-alert type="error" v-if="error">{{ error }}</v-alert>
        <v-row>
          <v-col cols="12" align="center">
            <Upload v-model="file" />
          </v-col>
          <v-col cols="12">
            <v-file-input
              v-model="file"
              accept="image/png, image/jpeg"
              label="Upload file"
              prepend-icon=""
              prepend-inner-icon="mdi-camera"
              show-size
              solo
            />
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="close">cancel</v-btn>
        <v-btn @click="upload">upload</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import Upload from "@/components/Upload.vue";
import API from "@/plugins/API";

@Component({
  components: {Upload}
})
export default class UploadForm extends Vue {
  private file: File | null = null;
  @Prop({required: true}) private path!: string;

  private percent = 0;
  private isUploading = false;
  private error: string | null = null;

  private close() {
    this.file = null;
    this.error = null;
    this.isUploading = false;
    this.percent = 0;
    this.$emit("close");
  }

  private upload() {
    if (!(this.file instanceof File) || this.isUploading) return;
    this.isUploading = true;
    this.error = null;
    const formData = new FormData();
    formData.append("file", this.file);
    API.axios
      .post(this.path, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (e: ProgressEvent) => {
          this.percent = (100 * e.loaded) / e.total;
        }
      })
      .then(() => {
        this.$emit("upload", this.file);
        this.close();
      })
      .catch((e: Error) => {
        this.error = e.message;
      })
      .finally(() => {
        this.isUploading = false;
        this.percent = 0;
      });
  }
}
</script>
