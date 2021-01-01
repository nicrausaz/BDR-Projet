<template>
  <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" min-width="290px" offset-y
          transition="scale-transition">
    <template v-slot:activator="{on, attrs}">
      <v-text-field
        required
        filled
        v-model="date"
        label="Birthdate"
        prepend-inner-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker @input="menu = false" v-model="date"></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";

@Component
export default class BirthdateInput extends Vue {
  @Prop() private value!: Date | string;
  private date = "";
  private menu = false;

  @Watch("date") dateChanged() {
    this.$emit("input", new Date(this.date));
  }

  @Watch("value") valueChanged() {
    this.date = new Date(this.value).toISOString().substr(0, 10);
  }

  public mounted() {
    this.valueChanged();
  }
}
</script>
