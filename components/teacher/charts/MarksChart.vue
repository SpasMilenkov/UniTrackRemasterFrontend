<!-- components/teacher/MarksChart.vue -->
<template>
  <div class="h-64">
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center">
      <p class="text-text-secondary">No marks data available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar } from 'vue-chartjs';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  marksData: Record<string, number>;
}>();

// Chart configuration
const chartData = computed(() => {
  if (!props.marksData || Object.keys(props.marksData).length === 0) {
    return null;
  }

  const labels = Object.keys(props.marksData);
  const data = Object.values(props.marksData);

  return {
    labels,
    datasets: [
      {
        label: 'Average Mark',
        data,
        backgroundColor: [
          '#4ade80', // emerald - primary
          '#3b82f6', // blue - secondary
          '#fbbd24', // amber
          '#ec4899', // pink
          '#22d3ee', // cyan
        ],
        borderWidth: 1,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 6,
      grid: {
        color: '#374151',
      },
      ticks: {
        color: '#f5f5f5',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#f5f5f5',
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#101014',
      titleColor: '#f5f5f5',
      bodyColor: '#f5f5f5',
      borderColor: '#374151',
      borderWidth: 1,
    },
  },
};
</script>
