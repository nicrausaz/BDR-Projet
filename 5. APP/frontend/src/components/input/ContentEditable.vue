<template>
  <span contenteditable="true" class="ma-0 pa-0" ref="input" @input.passive="update" />
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue, Watch} from "vue-property-decorator";

@Component
export default class ContentEditable extends Vue {
  @Prop() private value!: number;
  @Ref("input") private input!: HTMLSpanElement;

  update() {
    const num = Number(this.input.innerText);
    if (!isNaN(num)) this.$emit("input", num);
  }

  @Watch("value")
  valueChanged() {
    this.input.innerText = this.value.toString();
  }

  public async mounted() {
    await this.valueChanged();
  }
}
</script>
