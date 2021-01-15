<template>
  <div>
    <canvas id="doughnut" />
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import Chart from "chart.js";
import API from "@/plugins/API";

interface StatInterface {
  wins: number;
  loses: number;
  draws: number;
}

@Component({})
export default class GamesChart extends Vue {
  @Prop({
    default: () => {
      return Chart.defaults.doughnut;
    }
  })
  private stats: StatInterface | null = null;

  private loaded!: boolean;

  async mounted() {
    const {id} = this.$route.params;
    this.loaded = false;
    try {
      this.stats = (await API.axios.get<StatInterface>(`team/${id}/stats`)).data;
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }

    this.createChart({
      labels: Object.keys(this.stats ?? {}).map((t) => t.toUpperCase()),
      datasets: [
        {
          data: Object.values(this.stats ?? {}),
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
      options: {}
    };
    // eslint-disable-next-line no-new
    new Chart(canvas, options);
  }
}
</script>
