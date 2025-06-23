<!-- components/analytics/AnalyticsRadarChart.vue -->
<template>
  <div class="chart-container h-full">
    <Radar v-if="data" :data="data" :options="options" />
    <div
      v-else
      class="flex items-center justify-center h-full text-text-secondary"
    >
      No data available
    </div>
  </div>
</template>

<script setup lang="ts">
import { Radar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  data: any;
  options?: any;
}

defineProps<Props>();
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
