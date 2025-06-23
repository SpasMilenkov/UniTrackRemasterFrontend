<template>
  <div class="grade-distribution-chart">
    <div v-if="!hasValidData" class="no-data-placeholder">
      <Icon name="ph:chart-pie" class="text-3xl text-text-muted mb-2" />
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
  ArcElement,
  Tooltip,
  Legend,
  type ChartConfiguration,
  type ChartOptions,
} from 'chart.js';
import type { CourseGradeDto } from '~/interfaces/student/analytics/course-grade.dto';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  courses?: CourseGradeDto[];
  options?: Partial<ChartOptions<'doughnut'>>;
  emptyMessage?: string;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  courses: () => [],
  emptyMessage: 'No grade data available',
  height: 300,
});

// Refs
const chartRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<ChartJS | null>(null);
const isClient = ref(false);

// Computed data
const hasValidData = computed(() => {
  return (
    props.courses &&
    props.courses.length > 0 &&
    props.courses.some((course) => course.grade)
  );
});

const chartData = computed(() => {
  if (!hasValidData.value) {
    return null;
  }

  const gradeCount: Record<string, number> = {};

  props.courses.forEach((course) => {
    if (course.grade && course.grade.trim()) {
      const letter = course.grade.charAt(0).toUpperCase();
      gradeCount[letter] = (gradeCount[letter] || 0) + 1;
    }
  });

  const labels = Object.keys(gradeCount).sort();
  const data = labels.map((label) => gradeCount[label]);
  const colors = labels.map((grade) => getGradeColor(grade));

  return {
    labels: labels.map((label) => `Grade ${label}`),
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 5,
      },
    ],
  };
});

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 20,
        usePointStyle: true,
        color:
          getComputedStyle(document.documentElement).getPropertyValue(
            '--color-text-primary'
          ) || '#f5f5f5',
        font: {
          size: 12,
          family: 'Inter, system-ui, sans-serif',
        },
        generateLabels: (chart) => {
          const data = chart.data;
          if (data.labels && data.datasets[0]) {
            return data.labels.map((label, i) => ({
              text: `${label}: ${data.datasets[0].data[i]}`,
              fillStyle: data.datasets[0].backgroundColor?.[i] as string,
              strokeStyle: '#ffffff',
              lineWidth: 2,
              pointStyle: 'circle',
              index: i,
            }));
          }
          return [];
        },
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
        label: function (context) {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} courses (${percentage}%)`;
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

// Utility function
const getGradeColor = (grade: string): string => {
  const colors: Record<string, string> = {
    A: '#22c55e', // Green
    B: '#3b82f6', // Blue
    C: '#f59e0b', // Amber
    D: '#f97316', // Orange
    F: '#ef4444', // Red
  };
  return colors[grade] || '#6b7280'; // Gray fallback
};

// Chart management
const createChart = async () => {
  if (!isClient.value || !chartRef.value || !chartData.value) {
    return;
  }

  destroyChart();

  await nextTick();

  const config: ChartConfiguration<'doughnut'> = {
    type: 'doughnut',
    data: chartData.value,
    options: chartOptions.value,
  };

  try {
    chartInstance.value = new ChartJS(chartRef.value, config);
  } catch (error) {
    console.error('Error creating grade distribution chart:', error);
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
  () => props.courses,
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
.grade-distribution-chart {
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
