<!-- components/teacher/StudentsChart.vue -->
<template>
  <div class="h-64">
    <Doughnut v-if="chartData" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center">
      <p class="text-text-secondary">No student data available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

// Register ChartJS components
ChartJS.register(ArcElement, Title, Tooltip, Legend);

const props = defineProps<{
  studentsData: Array<{
    gradeName: string;
    students: any[];
  }>;
}>();

// Chart configuration
const chartData = computed(() => {
  if (!props.studentsData || props.studentsData.length === 0) {
    return null;
  }

  const labels = props.studentsData.map((grade) => grade.gradeName);
  const data = props.studentsData.map((grade) => grade.students?.length || 0);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          '#4ade80', // emerald
          '#3b82f6', // blue
          '#fbbd24', // amber
          '#ec4899', // pink
          '#22d3ee', // cyan
          '#8b5cf6', // violet
          '#f472b6', // rose
          '#a3e635', // lime
        ],
        borderWidth: 1,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#f5f5f5',
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: '#101014',
      titleColor: '#f5f5f5',
      bodyColor: '#f5f5f5',
      borderColor: '#374151',
      borderWidth: 1,
      callbacks: {
        label: function (context: any) {
          const label = context.label || '';
          const value = context.raw || 0;
          return `${label}: ${value} students`;
        },
      },
    },
  },
};
</script>
