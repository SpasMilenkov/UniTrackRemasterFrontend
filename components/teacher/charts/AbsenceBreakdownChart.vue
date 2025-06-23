<!-- components/teacher/charts/AbsenceBreakdownPieChart.vue -->
<template>
  <div class="absence-breakdown-pie-chart">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <n-spin size="large" />
    </div>

    <div
      v-else-if="!hasData"
      class="flex items-center justify-center h-full text-text-secondary"
    >
      <div class="text-center">
        <Icon name="ph:chart-donut" class="text-4xl mb-2" />
        <p class="text-sm">No data to display</p>
      </div>
    </div>

    <div v-else class="w-full h-full flex items-center justify-center">
      <div class="relative">
        <canvas
          ref="chartCanvas"
          :width="canvasSize"
          :height="canvasSize"
        ></canvas>

        <!-- Center Text -->
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div class="text-center">
            <p class="text-2xl font-bold text-text-primary">{{ totalCount }}</p>
            <p class="text-xs text-text-secondary">Total</p>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="ml-6 space-y-3">
        <div
          v-for="item in chartData"
          :key="item.name"
          class="flex items-center gap-3"
        >
          <div
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: item.color }"
          ></div>
          <div class="text-sm">
            <p class="font-medium text-text-primary">{{ item.name }}</p>
            <p class="text-text-secondary">
              {{ item.value }} ({{ getPercentage(item.value) }}%)
            </p>
          </div>
        </div>
      </div>
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

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface Props {
  chartData: ChartDataItem[];
  loading?: boolean;
  size?: number;
  cutout?: string;
  showTooltips?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  size: 200,
  cutout: '60%',
  showTooltips: true,
});

// Refs
const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<Chart | null>(null);

// Computed
const hasData = computed(() => props.chartData && props.chartData.length > 0);

const canvasSize = computed(() => props.size);

const totalCount = computed(() => {
  if (!hasData.value) return 0;
  return props.chartData.reduce((sum, item) => sum + item.value, 0);
});

const chartConfig = computed(() => {
  if (!hasData.value) return null;

  const labels = props.chartData.map((item) => item.name);
  const data = props.chartData.map((item) => item.value);
  const colors = props.chartData.map((item) => item.color);

  return {
    type: 'doughnut' as const,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: '#ffffff',
          cutout: props.cutout,
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // We'll use custom legend
        },
        tooltip: {
          enabled: props.showTooltips,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: (context: any) => {
              const value = context.parsed;
              const percentage = getPercentage(value);
              return `${context.label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
      interaction: {
        intersect: false,
      },
      animation: {
        animateRotate: true,
        animateScale: false,
        duration: 1000,
        easing: 'easeInOutQuart',
      },
      onHover: (event: any, elements: any[]) => {
        const canvas = chartCanvas.value;
        if (canvas) {
          canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        }
      },
    },
  };
});

// Methods
const getPercentage = (value: number): number => {
  if (totalCount.value === 0) return 0;
  return Math.round((value / totalCount.value) * 100);
};

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
    console.error('Failed to create absence breakdown pie chart:', error);
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
  () => [props.cutout, props.showTooltips],
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
.absence-breakdown-pie-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
