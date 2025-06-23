<template>
  <div class="chart-container">
    <canvas ref="chartRef" height="300"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
  },
});

const chartRef = ref(null);
let myChart: Chart<'line', any[], any> | null = null;

const createChart = () => {
  if (!chartRef.value || props.chartData.length === 0) return;

  // Destroy existing chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  // Prepare data for Chart.js
  const terms = props.chartData.map((item) => item.term);
  const studentAverages = props.chartData.map((item) => item.studentAverage);
  const classAverages = props.chartData.map((item) => item.classAverage);

  // Create new chart
  const ctx = chartRef.value.getContext('2d');
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: terms,
      datasets: [
        {
          label: 'Your Average',
          data: studentAverages,
          borderColor: '#4ade80',
          backgroundColor: 'rgba(74, 222, 128, 0.2)',
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Class Average',
          data: classAverages,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.1,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Score (%)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Term',
          },
        },
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
      },
    },
  });
};

// Watch for data changes
watch(
  () => props.chartData,
  () => {
    createChart();
  },
  { deep: true }
);

onMounted(() => {
  createChart();
});

onBeforeUnmount(() => {
  if (myChart) {
    myChart.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
}
</style>
