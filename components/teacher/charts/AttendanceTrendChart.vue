<!-- components/teacher/charts/AttendanceTrendChart.vue -->
<template>
  <div class="attendance-trend-chart">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <n-spin size="large" />
    </div>

    <div
      v-else-if="!hasData"
      class="flex items-center justify-center h-full text-text-secondary"
    >
      <div class="text-center">
        <Icon name="ph:chart-line" class="text-4xl mb-2" />
        <p class="text-sm">No attendance data available</p>
      </div>
    </div>

    <div v-else class="w-full h-full">
      <canvas ref="chartCanvas" class="w-full h-full"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from 'vue';
import { NSpin } from 'naive-ui';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface ChartDataPoint {
  date: string;
  absences: number;
}

interface Props {
  chartData: ChartDataPoint[];
  loading?: boolean;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  tension?: number;
  pointRadius?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  height: 250,
  showGrid: true,
  showLegend: false,
  tension: 0.4,
  pointRadius: 4,
});

// Refs
const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<Chart | null>(null);

// Computed
const hasData = computed(() => props.chartData && props.chartData.length > 0);

const chartConfig = computed(() => {
  if (!hasData.value) return null;

  const labels = props.chartData.map((item) => item.date);
  const data = props.chartData.map((item) => item.absences);

  return {
    type: 'line' as const,
    data: {
      labels,
      datasets: [
        {
          label: 'Absences',
          data,
          borderColor: 'rgb(239, 68, 68)', // red-500
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          tension: props.tension,
          fill: true,
          pointRadius: props.pointRadius,
          pointHoverRadius: props.pointRadius + 2,
          pointBackgroundColor: 'rgb(239, 68, 68)',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: 'rgb(220, 38, 38)', // red-600
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: props.showLegend,
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            color:
              getComputedStyle(document.documentElement).getPropertyValue(
                '--color-text-primary'
              ) || '#ffffff',
            font: {
              size: 12,
              family: 'Inter, sans-serif',
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: (context: any) => {
              return `Date: ${context[0].label}`;
            },
            label: (context: any) => {
              const value = context.parsed.y;
              return `Absences: ${value}`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: props.showGrid,
            color: 'rgba(255, 255, 255, 0.1)',
            lineWidth: 1,
          },
          ticks: {
            color:
              getComputedStyle(document.documentElement).getPropertyValue(
                '--color-text-secondary'
              ) || '#a1a1aa',
            font: {
              size: 11,
              family: 'Inter, sans-serif',
            },
            maxTicksLimit: 8,
          },
          border: {
            display: false,
          },
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: {
            display: props.showGrid,
            color: 'rgba(255, 255, 255, 0.1)',
            lineWidth: 1,
          },
          ticks: {
            color:
              getComputedStyle(document.documentElement).getPropertyValue(
                '--color-text-secondary'
              ) || '#a1a1aa',
            font: {
              size: 11,
              family: 'Inter, sans-serif',
            },
            stepSize: 1,
            callback: function (value: any) {
              return Number.isInteger(value) ? value : '';
            },
          },
          border: {
            display: false,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
      elements: {
        point: {
          hoverRadius: 8,
        },
      },
      animation: {
        duration: 750,
        easing: 'easeInOutQuart',
      },
    },
  };
});

// Methods
const createChart = async () => {
  if (!chartCanvas.value || !chartConfig.value) return;

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }

  // Wait for next tick to ensure canvas is ready
  await nextTick();

  try {
    chartInstance.value = new Chart(chartCanvas.value, chartConfig.value);
  } catch (error) {
    console.error('Failed to create attendance trend chart:', error);
  }
};

const updateChart = () => {
  if (!chartInstance.value || !chartConfig.value) return;

  // Update chart data
  chartInstance.value.data = chartConfig.value.data;
  chartInstance.value.options = chartConfig.value.options;
  chartInstance.value.update('active');
};

const destroyChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
};

// Watchers
watch(
  () => props.chartData,
  async () => {
    if (hasData.value && chartCanvas.value) {
      if (chartInstance.value) {
        updateChart();
      } else {
        await createChart();
      }
    } else {
      destroyChart();
    }
  },
  { deep: true }
);

watch(
  () => [props.showGrid, props.showLegend, props.tension, props.pointRadius],
  async () => {
    if (hasData.value && chartCanvas.value) {
      await createChart();
    }
  }
);

// Lifecycle
onMounted(async () => {
  if (hasData.value) {
    await createChart();
  }
});

onBeforeUnmount(() => {
  destroyChart();
});
</script>

<style scoped>
.attendance-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
