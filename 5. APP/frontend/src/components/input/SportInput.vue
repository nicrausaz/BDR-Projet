<template>
  <v-autocomplete
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    @focus="searchChange"
    cache-items
    item-text="name"
    item-value="id"
    label="Sport"
    filled
    v-model="select"
  >
    <template v-slot:selection="data">{{ data.item.name }}</template>
    <template v-slot:item="data">{{ data.item.name }}</template>
  </v-autocomplete>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import API from "@/plugins/API";
import Sport from "@/models/Sport";
import Pagination from "@/models/Pagination";

@Component
export default class SportInput extends Vue {
  private isLoading = false;
  private items: Sport[] = [];
  private search: Sport | null = null;
  private select: number | null = null;
  private value!: number;

  @Watch("value") valueChanged(newVal: Sport) {
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
      .get<Pagination<Sport>>(`sport`)
      .then(({data}) => {
        this.items = data.result;
      })
      .finally(() => (this.isLoading = false));
  }

  public mounted() {
    this.select = this.value;
  }
}
</script>
