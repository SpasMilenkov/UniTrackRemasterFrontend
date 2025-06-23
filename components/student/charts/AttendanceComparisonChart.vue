<!-- AttendanceComparisonChart.vue -->
<template>
  <div class="w-full h-full">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import type { SubjectAttendanceInsightDto } from '~/interfaces/student';

interface Props {
  subjectInsights: SubjectAttendanceInsightDto[];
}

const props = defineProps<Props>();

const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const initChart = async () => {
  await nextTick();

  if (!chartRef.value || !props.subjectInsights?.length) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  const subjects = props.subjectInsights.map((insight) => insight.subjectName);
  const studentRates = props.subjectInsights.map(
    (insight) => insight.studentAttendanceRate * 100
  );
  const classRates = props.subjectInsights.map(
    (insight) => insight.classAvgAttendanceRate * 100
  );

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: subjects,
      datasets: [
        {
          label: 'Your Attendance',
          data: studentRates,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Class Average',
          data: classRates,
          backgroundColor: 'rgba(156, 163, 175, 0.6)',
          borderColor: 'rgb(156, 163, 175)',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
              weight: 'bold',
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function (value) {
              return value + '%';
            },
            font: {
              size: 11,
            },
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 0,
            font: {
              size: 11,
            },
          },
          grid: {
            display: false,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    },
  });
};

watch(() => props.subjectInsights, initChart, { deep: true });

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>