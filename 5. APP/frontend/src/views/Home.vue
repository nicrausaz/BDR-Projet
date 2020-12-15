<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <v-btn @click="fetchAll">Coucou</v-btn>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import { namespace } from 'vuex-class'
const player = namespace('player')

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  @player.Action
  public fetchAll!: () => void
}
</script>
