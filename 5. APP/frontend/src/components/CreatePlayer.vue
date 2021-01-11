<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">Create Player</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-alert type="error" v-if="error">{{ error }}</v-alert>
        <template v-if="editMode">
          <v-dialog v-model="uploadDialog" max-width="750">
            <UploadForm :path="`my/player/${model.uid}/avatar`" @close="uploadDialog = false" />
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
        <v-text-field required filled v-model="model.firstname" label="Firstname" />
        <v-text-field required filled v-model="model.lastname" label="Lastname" />
        <DateInput v-model="model.birthdate" label="Birthdate" />
        <v-radio-group required label="Sex" v-model="model.sex" row mandatory>
          <v-radio label="Male" value="M"></v-radio>
          <v-radio label="Female" value="F"></v-radio>
        </v-radio-group>
        <v-slider v-model="model.height" label="Height" max="250" min="100" required step="1" thumb-label ticks></v-slider>
        <v-slider v-model="model.weight" label="Weight" max="150" min="30" required step="1" thumb-label ticks></v-slider>
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
import MyClubInput from "@/components/input/ClubInput.vue";
import Player from "@/models/Player";
import API from "@/plugins/API";
import LeagueInput from "@/components/input/LeagueInput.vue";
import DateInput from "@/components/input/DateInput.vue";
import UploadForm from "@/components/UploadForm.vue";

@Component({
  components: {UploadForm, DateInput, LeagueInput, MyClubInput}
})
export default class CreatePlayer extends Vue {
  @Prop() prefill!: Player;
  private valid = false;
  private loading = false;
  private error: string | null = null;
  private player = new Player();
  private uploadDialog = false;

  private get editMode() {
    return !!this.prefill;
  }

  private request(path: string) {
    return this.editMode
      ? API.axios.patch<Player>(`${path}/${this.model.primaryKey}`, this.model)
      : API.axios.put<Player>(`${path}`, this.model);
  }

  private get model(): Player {
    return this.prefill ? this.prefill : this.player;
  }

  private send() {
    this.loading = true;
    this.request("my/player")
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
    this.player = new Player();
    this.$emit("close");
  }
}
</script>
