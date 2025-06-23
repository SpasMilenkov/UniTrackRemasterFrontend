<!-- components/analytics/AnalyticsTrendChart.vue -->
<template>
  <div class="chart-container h-full">
    <Line v-if="data" :data="data" :options="options" />
    <div
      v-else
      class="flex items-center justify-center h-full text-text-secondary"
    >
      No trend data available
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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
