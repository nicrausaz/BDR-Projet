<template>
  <Header>
    <h1>StarSport</h1>
  </Header>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Header from "@/components/Header.vue";

@Component({
  components: {Header}
})
export default class Home extends Vue {
}
</script>
