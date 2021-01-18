<template>
  <div class="d-inline-block">
    <v-btn fab @click="inc" small class="ma-1"><v-icon>mdi-plus</v-icon></v-btn>
    <v-btn fab @click="dec" small class="ma-1"><v-icon>mdi-minus</v-icon></v-btn>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";

@Component
export default class IncrementInput extends Vue {
  private innerValue = 0;
  @Prop() private value!: number;
  @Prop({default: () => Infinity}) private maxValue!: number;
  @Prop({default: () => -Infinity}) private minValue!: number;
  @Prop({default: () => 1}) private incValue!: number;

  @Watch("value")
  async valueChanged() {
    this.innerValue = Number(this.value);
  }

  @Watch("innerValue")
  public onSelect() {
    this.$emit("input", this.innerValue);
  }

  public async mounted() {
    await this.valueChanged();
  }

  private inc() {
    this.innerValue = Math.min(this.innerValue + this.incValue, this.maxValue);
  }

  private dec() {
    this.innerValue = Math.max(this.innerValue - this.incValue, this.minValue);
  }
}
</script>
