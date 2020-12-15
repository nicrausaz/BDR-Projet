<template>
  <div class="home">
    <v-btn @click="fetchAll">Coucou</v-btn>
    <li v-for="player in players" :key="player.uid">
      {{ player.firstname }}
    </li>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
const player = namespace('player')

@Component
export default class Home extends Vue {
  @player.State
  public players!: any[]

  @player.Action
  public fetchAll!: () => void
}
</script>
