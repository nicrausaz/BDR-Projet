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
  @Prop() private restricted!: boolean;

  @Watch("value")
  async valueChanged() {
    await this.searchChange(this.value?.name);
    this.select = this.value?.id;
  }

  @Watch("select")
  public onSelect() {
    const item = this.items.find((i) => i.id === this.select);
    if (item) this.$emit("input", item);
  }

  @Watch("search")
  public async searchChange(query?: string) {
    const q = query ?? this.search ?? "";
    this.isLoading = true;
    const url = this.restricted ? `my/club?q=${q}` : `club?q=${q}`;

    return API.get<Pagination<Club>>(Pagination, url)
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
