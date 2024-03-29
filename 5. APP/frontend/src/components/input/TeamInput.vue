<template>
  <v-autocomplete
    ref="input"
    v-model="select"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    cache-items
    filled
    item-text="name"
    item-value="id"
    label="Team"
    @focus="searchChange"
  >
    <template v-slot:selection="data">{{ data.item.name }}</template>
    <template v-slot:item="data">{{ data.item.name }}</template>
  </v-autocomplete>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue, Watch} from "vue-property-decorator";
import Team from "@/models/Team";
import API from "@/plugins/API";
import Pagination from "@/models/Pagination";

@Component
export default class TeamInput extends Vue {
  @Ref("input") private input!: Vue & {
    cacheItems: boolean;
    cachedItems: any[];
  };

  private isLoading = false;
  private items: Team[] = [];
  private search: Team | null = null;
  private select: number | null = null;
  @Prop() private value!: Team;
  @Prop() private restricted!: boolean;

  @Watch("value")
  async valueChanged() {
    await this.searchChange(this.value?.name);
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
    const url = this.restricted ? `my/team?q=${q}` : `team?q=${q}`;

    return API.get<Pagination<Team>>(Pagination, url)
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
