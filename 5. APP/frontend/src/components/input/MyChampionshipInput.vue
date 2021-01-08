<template>
  <v-autocomplete
    v-model="select"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    cache-items
    filled
    item-text="name"
    item-value="id"
    label="Championship"
    @focus="searchChange"
  >
    <template v-slot:selection="data">{{ data.item.name }}</template>
    <template v-slot:item="data">{{ data.item.name }}</template>
  </v-autocomplete>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import Championship from "@/models/Championship";
import API from "@/plugins/API";
import Pagination from "@/models/Pagination";

@Component
export default class ChampionshipInput extends Vue {
  private isLoading = false;
  private items: Championship[] = [];
  private search: Championship | null = null;
  private select: number | null = null;
  @Prop() private value!: Championship;

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
    return API.get<Pagination<Championship>>(Pagination, `my/championship?q=${q}`)
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
