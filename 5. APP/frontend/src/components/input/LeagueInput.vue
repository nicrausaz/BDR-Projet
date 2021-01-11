<template>
  <v-autocomplete
    ref="input"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    @focus="searchChange"
    cache-items
    item-text="level"
    item-value="id"
    label="League"
    filled
    v-model="select"
  >
    <template v-slot:selection="data">{{ data.item.level }}</template>
    <template v-slot:item="data">{{ data.item.level }}</template>
  </v-autocomplete>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue, Watch} from "vue-property-decorator";
import League from "@/models/League";
import API from "@/plugins/API";
import Pagination from "@/models/Pagination";

@Component
export default class LeagueInput extends Vue {
  @Ref("input") private input!: Vue & {
    cacheItems: boolean;
    cachedItems: any[];
  };

  private isLoading = false;
  private items: League[] = [];
  private search: League | null = null;
  private select: number | null = null;
  @Prop() private value!: League;
  @Prop() private restricted!: boolean;

  @Watch("value")
  async valueChanged() {
    await this.searchChange(this.value?.level);
    this.select = this.value?.id;
  }

  @Watch("select")
  public onSelect() {
    const items = this.input.cacheItems ? this.input.cachedItems : this.items;
    const item = items.find((i) => i.id === this.select);
    if (item) this.$emit("input", item);
  }

  @Watch("search")
  public async searchChange(query?: string) {
    const q = query ?? this.search ?? "";
    this.isLoading = true;
    const url = this.restricted ? `my/league?q=${q}` : `league?q=${q}`;

    return API.get<Pagination<League>>(Pagination, url)
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
