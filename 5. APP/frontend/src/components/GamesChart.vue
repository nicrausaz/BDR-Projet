<template>
  <div>
    <canvas id="doughnut" />
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import Chart from "chart.js";
import API from "@/plugins/API";

@Component({})
export default class GamesChart extends Vue {
  @Prop({
    default: () => {
      return Chart.defaults.doughnut;
    }
  })
  readonly options: any | undefined;

  private data!: Array<number>;
  private loaded!: boolean;

  async mounted() {
    const {id} = this.$route.params;
    this.loaded = false;
    try {
      this.data = await API.get(Array, `team/${id}/stats`);
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }

    this.createChart({
      labels: ["Wins", "Draws", "Loses"],
      datasets: [
        {
          data: this.data,
          backgroundColor: ["Green", "Blue", "Red"]
        }
      ]
    });
  }

  createChart(chartData: any) {
    const canvas = document.getElementById("doughnut") as HTMLCanvasElement;
    const options = {
      type: "doughnut",
      data: chartData,
      options: this.options
    };
    // eslint-disable-next-line no-new
    new Chart(canvas, options);
  }
}
</script>
