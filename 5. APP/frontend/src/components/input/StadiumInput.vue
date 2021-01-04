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
    label="Stadium"
    @focus="searchChange"
  >
    <template v-slot:selection="data">{{ data.item.name }}</template>
    <template v-slot:item="data">{{ data.item.name }}</template>
  </v-autocomplete>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import Stadium from "@/models/Stadium";
import API from "@/plugins/API";
import Pagination from "@/models/Pagination";

@Component
export default class StadiumInput extends Vue {
  private isLoading = false;
  private items: Stadium[] = [];
  private search: Stadium | null = null;
  private select: number | null = null;
  @Prop() private value!: Stadium;

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
    return API.get<Pagination<Stadium>>(Pagination, `stadium`)
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
