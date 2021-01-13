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
    item-value="uid"
    label="Player"
    @focus="searchChange"
  >
    <template v-slot:item="data">
      <v-list-item-avatar>
        <img :src="data.item.avatar" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-html="data.item.name"></v-list-item-title>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue, Watch} from "vue-property-decorator";
import Player from "@/models/Player";
import API from "@/plugins/API";
import Pagination from "@/models/Pagination";

@Component
export default class PlayerInput extends Vue {
  @Ref("input") private input!: Vue & {
    cacheItems: boolean;
    cachedItems: any[];
  };

  private isLoading = false;
  private items: Player[] = [];
  private search: Player | null = null;
  private select: string | null = null;
  @Prop() private value!: Player;
  @Prop() private restricted!: boolean;

  @Watch("value")
  async valueChanged() {
    await this.searchChange(this.value?.name);
    this.select = this.value?.uid;
  }

  @Watch("select")
  public onSelect() {
    const items: Player[] = this.input.cacheItems ? this.input.cachedItems : this.items;
    const item = items.find((i) => i.uid === this.select);
    if (item) this.$emit("input", item);
  }

  @Watch("search")
  public async searchChange(query?: string) {
    const q = query ?? this.search ?? "";
    this.isLoading = true;
    const url = this.restricted ? `my/player?q=${q}` : `player?q=${q}`;

    return API.get<Pagination<Player>>(Pagination, url)
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
