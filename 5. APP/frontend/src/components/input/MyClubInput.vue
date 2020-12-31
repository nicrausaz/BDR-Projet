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
import Pagination from "@/models/Pagination";

@Component
export default class MyClubInput extends Vue {
  private isLoading = false;
  private items: Club[] = [];
  private search: Club | null = null;
  private select: number | null = null;
  @Prop() private value!: Club;

  @Watch("value")
  async valueChanged() {
    await this.searchChange();
    this.select = this.value?.id;
  }

  @Watch("select")
  public onSelect() {
    this.$emit(
      "input",
      this.items.find((i) => i.id === this.select)
    );
  }

  @Watch("search")
  public async searchChange() {
    if (this.items.length > 0) return;
    this.isLoading = true;
    return API.get<Pagination<Club>>(Pagination, `my/club`)
      .then(({result}) => {
        this.items = result;
      })
      .finally(() => (this.isLoading = false));
  }

  public async mounted() {
    await this.valueChanged();
  }
}
</script>
