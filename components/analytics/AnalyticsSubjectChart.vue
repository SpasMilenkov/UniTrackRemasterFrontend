<!-- components/analytics/AnalyticsSubjectChart.vue -->
<template>
  <div class="chart-container h-80">
    <Bar v-if="data" :data="data" :options="options" />
    <div
      v-else
      class="flex items-center justify-center h-full text-text-secondary"
    >
      No subject data available
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: any;
  benchmarks?: Record<string, number>;
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
