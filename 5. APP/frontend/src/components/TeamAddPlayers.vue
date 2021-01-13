<template>
  <div>
    <v-btn @click="open">Add Player</v-btn>
    <v-dialog v-model="dialog" max-width="750" persistent>
      <v-card>
        <v-form v-model="valid">
          <v-container>
            <PlayerInput v-model="player" />
            <v-text-field v-model="jerseyNumber" filled label="jerseyNumber" type="number" />
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn depressed @click="close">
              <v-icon left>mdi-close</v-icon>
              Cancel
            </v-btn>
            <v-btn :disabled="!valid" depressed @click="send">
              <v-icon left>mdi-pencil</v-icon>
              save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Vue} from "vue-property-decorator";
import PlayerInput from "@/components/input/PlayerInput.vue";
import Player from "@/models/Player";

@Component({
  components: {PlayerInput}
})
export default class TeamAddPlayers extends Vue {
  private dialog = false;
  private valid = false;
  private player: Player | null = null;
  private jerseyNumber = 0;

  open() {
    this.dialog = true;
  }

  close() {
    this.dialog = false;
    this.jerseyNumber = 0;
    this.player = null;
  }

  @Emit("added")
  send() {
    const data = {
      player: this.player,
      jerseyNumber: this.jerseyNumber
    };
    this.close();
    return data;
  }
}
</script>
