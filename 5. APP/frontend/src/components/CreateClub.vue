<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create Club</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-alert type="error" v-if="error">{{ error }}</v-alert>
        <template v-if="editMode">
          <v-dialog v-model="uploadDialog" max-width="750">
            <UploadForm :path="`my/club/${model.id}/avatar`" @close="uploadDialog = false" />
          </v-dialog>
          <div class="text-center mb-5">
            <v-hover v-slot="{hover}">
              <v-avatar :size="200" color="grey">
                <v-img :src="model.avatar">
                  <div v-if="hover" class="d-flex align-center justify-center" style="width: 100%">
                    <v-btn fab @click="uploadDialog = true">
                      <v-icon>mdi-camera</v-icon>
                    </v-btn>
                  </div>
                </v-img>
              </v-avatar>
            </v-hover>
          </div>
        </template>
        <v-text-field required filled v-model="model.name" label="Name" />
        <SportInput required v-model="model.sport" />
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn depressed @click="close">
          <v-icon left>mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-btn depressed :disabled="!valid" @click="send">
          <v-icon left>mdi-pencil</v-icon>
          save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import API from "@/plugins/API";
import Club from "@/models/Club";
import SportInput from "@/components/input/SportInput.vue";
import UploadForm from "@/components/UploadForm.vue";

@Component({
  components: {UploadForm, SportInput}
})
export default class CreateClub extends Vue {
  @Prop() prefill!: Club;
  private valid = false;
  private loading = false;
  private error: string | null = null;
  private player = new Club();
  private uploadDialog = false;

  private get editMode() {
    return !!this.prefill;
  }

  private request(path: string) {
    return this.editMode
      ? API.axios.patch<Club>(`${path}/${this.model.primaryKey}`, this.model)
      : API.axios.put<Club>(`${path}`, this.model);
  }

  private get model(): Club {
    return this.prefill ? this.prefill : this.player;
  }

  private send() {
    this.loading = true;
    this.request("my/club")
      .then(() => {
        this.close();
        this.$emit("confirm");
      })
      .catch((e) => {
        this.error = e?.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private close() {
    this.player = new Club();
    this.$emit("close");
  }
}
</script>
