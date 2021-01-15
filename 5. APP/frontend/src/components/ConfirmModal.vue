<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> Confirm delete </v-card-title>
        <v-card-text>{{ text }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="close(false)"> Cancel </v-btn>
          <v-btn color="red darken-1" text @click="close(true)"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class ConfirmModal extends Vue {
  @Prop() text!: string;
  @Prop() open!: boolean;

  private close(confirm: boolean) {
    confirm ? this.$emit("confirm") : this.$emit("close");
  }
}
</script>
