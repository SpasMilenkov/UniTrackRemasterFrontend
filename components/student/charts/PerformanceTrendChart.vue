<template>
  <div class="performance-trend-chart">
    <div v-if="!hasValidData" class="no-data-placeholder">
      <Icon name="ph:chart-line" class="text-3xl text-text-muted mb-2" />
      <p class="text-text-muted text-sm">{{ emptyMessage }}</p>
    </div>
    <div v-else-if="isClient" class="chart-container">
      <canvas ref="chartRef" />
    </div>
    <div v-else class="loading-placeholder">
      <div class="animate-pulse bg-background-secondary rounded-lg h-full" />
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
  type ChartConfiguration,
  type ChartOptions,
} from 'chart.js';
import type { PerformanceTrendDto } from '~/interfaces/student/analytics/performance-trend.dto';

// Register Chart.js components
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
  performanceTrend?: PerformanceTrendDto | null;
  options?: Partial<ChartOptions<'line'>>;
  emptyMessage?: string;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  performanceTrend: null,
  emptyMessage: 'No performance trend data available',
  height: 300,
});

// Refs
const chartRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<ChartJS | null>(null);
const isClient = ref(false);

// Computed data
const hasValidData = computed(() => {
  return (
    props.performanceTrend &&
    props.performanceTrend.terms &&
    props.performanceTrend.terms.length > 1 &&
    props.performanceTrend.studentAverages &&
    props.performanceTrend.studentAverages.length > 0
  );
});

const chartData = computed(() => {
  if (!hasValidData.value || !props.performanceTrend) {
    return null;
  }

  const trend = props.performanceTrend;

  return {
    labels: trend.terms,
    datasets: [
      {
        label: 'Your Performance',
        data: trend.studentAverages,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#22c55e',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Class Average',
        data: trend.classAverages || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
        borderDash: [5, 5],
      },
    ],
  };
});

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color:
          getComputedStyle(document.documentElement).getPropertyValue(
            '--color-text-primary'
          ) || '#f5f5f5',
        font: {
          size: 12,
          family: 'Inter, system-ui, sans-serif',
          weight: '500',
        },
        padding: 20,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#ffffff',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        title: function (context) {
          return `${context[0].label}`;
        },
        label: function (context) {
          const label = context.dataset.label || '';
          const value =
            typeof context.parsed.y === 'number'
              ? context.parsed.y.toFixed(2)
              : 'N/A';
          return `${label}: ${value}`;
        },
        afterBody: function (context) {
          if (context.length >= 2) {
            const studentScore = context[0].parsed.y;
            const classScore = context[1].parsed.y;
            if (
              typeof studentScore === 'number' &&
              typeof classScore === 'number'
            ) {
              const difference = studentScore - classScore;
              const sign = difference >= 0 ? '+' : '';
              return [
                `Difference: ${sign}${difference.toFixed(2)} from class average`,
              ];
            }
          }
          return [];
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color:
          getComputedStyle(document.documentElement).getPropertyValue(
            '--color-text-secondary'
          ) || '#9ca3af',
        font: {
          size: 11,
          family: 'Inter, system-ui, sans-serif',
        },
      },
    },
    y: {
      suggestedMin: 0,
      suggestedMax: 4,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color:
          getComputedStyle(document.documentElement).getPropertyValue(
            '--color-text-secondary'
          ) || '#9ca3af',
        font: {
          size: 11,
          family: 'Inter, system-ui, sans-serif',
        },
        callback: function (value) {
          return typeof value === 'number' ? value.toFixed(1) : value;
        },
      },
      title: {
        display: true,
        text: 'GPA',
        color:
          getComputedStyle(document.documentElement).getPropertyValue(
            '--color-text-secondary'
          ) || '#9ca3af',
        font: {
          size: 12,
          family: 'Inter, system-ui, sans-serif',
          weight: '500',
        },
      },
    },
  },
  animation: {
    duration: 1500,
    easing: 'easeInOutQuart',
  },
  elements: {
    line: {
      capBezierPoints: false,
    },
  },
  ...props.options,
}));

// Chart management
const createChart = async () => {
  if (!isClient.value || !chartRef.value || !chartData.value) {
    return;
  }

  destroyChart();

  await nextTick();

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: chartData.value,
    options: chartOptions.value,
  };

  try {
    chartInstance.value = new ChartJS(chartRef.value, config);
  } catch (error) {
    console.error('Error creating performance trend chart:', error);
  }
};

const updateChart = () => {
  if (!chartInstance.value || !chartData.value) {
    return;
  }

  chartInstance.value.data = chartData.value;
  chartInstance.value.options = chartOptions.value;
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
  () => props.performanceTrend,
  () => {
    if (isClient.value && hasValidData.value) {
      if (chartInstance.value) {
        updateChart();
      } else {
        createChart();
      }
    } else {
      destroyChart();
    }
  },
  { deep: true }
);

watch(
  () => props.options,
  () => {
    if (isClient.value && chartInstance.value) {
      updateChart();
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(async () => {
  isClient.value = true;
  await nextTick();

  if (hasValidData.value) {
    createChart();
  }
});

onBeforeUnmount(() => {
  destroyChart();
});
</script>

<style scoped>
.performance-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.no-data-placeholder,
.loading-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-placeholder {
  min-height: 200px;
}
</style>
