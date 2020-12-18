<template>
  <div class="home">
    <Upload />
    <v-btn @click="fetchAll">Coucou</v-btn>
    <li v-for="player in players" :key="player.uid">
      {{ player.firstname }}
    </li>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {namespace} from "vuex-class";
import Player from "@/models/Player";
import Upload from "@/views/Upload.vue";

const player = namespace("player");
@Component({
  components: {Upload}
})
export default class Home extends Vue {
  @player.State
  public players!: Player[];

  @player.Action
  public fetchAll!: () => void;
}
</script>
