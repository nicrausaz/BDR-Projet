<template>
  <v-container fluid v-if="administrator" style="max-width: 1500px">
    <v-card class="mx-auto" dark>
      <v-parallax :src="require('@/assets/background.jpg')" height="400">
        <v-row align="end">
          <v-col class="align-self-middle text-center" cols="12">
            <v-hover v-slot="{hover}">
              <v-avatar class="profile elevation-24" color="grey" :size="$vuetify.breakpoint.xs ? 200 : 250">
                <v-img :src="administrator.avatar">
                  <div v-if="hover" class="d-flex align-center justify-center" style="width: 100%">
                    <v-btn fab @click="uploadDialog = true">
                      <v-icon>mdi-camera</v-icon>
                    </v-btn>
                  </div>
                </v-img>
              </v-avatar>
            </v-hover>
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
            <v-icon color="primary"> mdi-email</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ administrator.email }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <v-dialog v-model="uploadDialog" max-width="750">
      <UploadForm @close="uploadDialog = false" @upload="setPicture" path="my/account/avatar" />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {namespace} from "vuex-class";
import Administrator from "@/models/Administrator"; // @ is an alias to /src
import Header from "@/components/Header.vue";
import Upload from "@/components/Upload.vue";
import UploadForm from "@/components/UploadForm.vue";

const administrator = namespace("administrator");
@Component({
  components: {UploadForm, Upload, Header}
})
export default class UserProfile extends Vue {
  @administrator.State
  administrator?: Administrator;

  @administrator.Mutation
  setAvatar!: (url: string) => void;

  uploadDialog = false;

  private setPicture(file: File) {
    this.setAvatar(URL.createObjectURL(file));
  }
}
</script>
