<template>
  <v-autocomplete
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    @focus="searchChange"
    cache-items
    item-text="name"
    item-value="id"
    label="Club"
    filled
    v-model="select"
  >
    <template v-slot:selection="data">{{ data.item.name }}</template>
    <template v-slot:item="data">{{ data.item.name }}</template>
  </v-autocomplete>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import Club from "@/models/Club";
import API from "@/plugins/API";

@Component
export default class MyClubInput extends Vue {
  private isLoading = false;
  private items: Club[] = [];
  private search: Club | null = null;
  private select: number | null = null;
  @Prop() private value!: number;

  @Watch("value") valueChanged(newVal: Club) {
    this.select = newVal.id;
  }

  @Watch("select")
  public onSelect() {
    this.$emit(
      "input",
      this.items.find((i) => i.id === this.select)
    );
  }

  @Watch("search")
  public searchChange() {
    if (this.items.length > 0) return;
    this.isLoading = true;
    API.axios
      .get<Club[]>(`my/club`)
      .then(({data}) => {
        this.items = data;
      })
      .finally(() => (this.isLoading = false));
  }

  public mounted() {
    this.select = this.value;
  }
}
</script>
