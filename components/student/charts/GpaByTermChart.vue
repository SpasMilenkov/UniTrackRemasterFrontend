<template>
  <div class="gpa-by-term-chart">
    <div v-if="!hasValidData" class="no-data-placeholder">
      <Icon name="ph:chart-bar" class="text-3xl text-text-muted mb-2" />
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartConfiguration,
  type ChartOptions,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  gpaByTerm?: Record<string, number> | null;
  options?: Partial<ChartOptions<'bar'>>;
  emptyMessage?: string;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  gpaByTerm: null,
  emptyMessage: 'No GPA data available',
  height: 300,
});

// Refs
const chartRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<ChartJS | null>(null);
const isClient = ref(false);

// Computed data
const hasValidData = computed(() => {
  return (
    props.gpaByTerm &&
    Object.keys(props.gpaByTerm).length > 0 &&
    Object.values(props.gpaByTerm).some(
      (value) => typeof value === 'number' && !isNaN(value)
    )
  );
});

const chartData = computed(() => {
  if (!hasValidData.value || !props.gpaByTerm) {
    return null;
  }

  const gpaData = props.gpaByTerm;
  const terms = Object.keys(gpaData).sort();
  const gpas = terms.map((term) => {
    const value = gpaData[term];
    return typeof value === 'number' && !isNaN(value) ? value : 0;
  });

  // Generate colors based on GPA values
  const colors = gpas.map((gpa) => getGpaColor(gpa));

  return {
    labels: terms,
    datasets: [
      {
        label: 'GPA',
        data: gpas,
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 'flex',
        maxBarThickness: 60,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
      },
    ],
  };
});

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#ffffff',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        title: function (context) {
          return `${context[0].label}`;
        },
        label: function (context) {
          const value =
            typeof context.parsed.y === 'number'
              ? context.parsed.y.toFixed(2)
              : 'N/A';
          return `GPA: ${value}`;
        },
        afterBody: function (context) {
          const gpa = context[0].parsed.y;
          if (typeof gpa === 'number') {
            return [getGpaDescription(gpa)];
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
        maxRotation: 45,
        minRotation: 0,
      },
    },
    y: {
      beginAtZero: true,
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
        stepSize: 0.5,
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
    duration: 1000,
    easing: 'easeInOutQuart',
  },
  ...props.options,
}));

// Utility functions
const getGpaColor = (gpa: number): string => {
  if (gpa >= 3.7) return 'rgba(34, 197, 94, 0.8)'; // Green - Excellent
  if (gpa >= 3.3) return 'rgba(59, 130, 246, 0.8)'; // Blue - Good
  if (gpa >= 3.0) return 'rgba(168, 85, 247, 0.8)'; // Purple - Satisfactory
  if (gpa >= 2.7) return 'rgba(245, 158, 11, 0.8)'; // Amber - Below Average
  if (gpa >= 2.0) return 'rgba(249, 115, 22, 0.8)'; // Orange - Poor
  return 'rgba(239, 68, 68, 0.8)'; // Red - Failing
};

const getGpaDescription = (gpa: number): string => {
  if (gpa >= 3.7) return 'Excellent Performance';
  if (gpa >= 3.3) return 'Good Performance';
  if (gpa >= 3.0) return 'Satisfactory Performance';
  if (gpa >= 2.7) return 'Below Average Performance';
  if (gpa >= 2.0) return 'Poor Performance';
  return 'Failing Performance';
};

// Chart management
const createChart = async () => {
  if (!isClient.value || !chartRef.value || !chartData.value) {
    return;
  }

  destroyChart();

  await nextTick();

  const config: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: chartData.value,
    options: chartOptions.value,
  };

  try {
    chartInstance.value = new ChartJS(chartRef.value, config);
  } catch (error) {
    console.error('Error creating GPA by term chart:', error);
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
  () => props.gpaByTerm,
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
.gpa-by-term-chart {
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
