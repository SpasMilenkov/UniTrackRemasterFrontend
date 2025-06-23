<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import Chart from 'chart.js/auto';
import type { ChartType, ChartData, ChartOptions } from 'chart.js';

interface Props {
  chartType: ChartType;
  chartData: ChartData;
  options?: ChartOptions;
  height?: string;
  width?: string;
}

const props = withDefaults(defineProps<Props>(), {
  chartType: 'line' as ChartType,
  options: () => ({}),
  height: '100%',
  width: '100%',
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

// Initialize chart
const initChart = (): void => {
  if (!chartCanvas.value) return;

  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy();
  }

  // Create new chart
  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  // Merge default options with provided options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    ...props.options,
  };

  // Create the chart
  chart = new Chart(ctx, {
    type: props.chartType,
    data: props.chartData,
    options: chartOptions,
  });
};

// Update chart when data or type changes
const updateChart = (): void => {
  if (!chart) return;

  chart.data = props.chartData;
  chart.options = {
    responsive: true,
    maintainAspectRatio: false,
    ...props.options,
  };

  if (chart.config.type !== props.chartType) {
    // If chart type has changed, we need to re-initialize
    initChart();
    return;
  }

  chart.update();
};

// Dark mode / theme responsive chart
const updateChartTheme = (): void => {
  if (!chart) return;

  // Get current theme from HTML
  const isDarkMode = document.documentElement.classList.contains('dark');

  // Update grid and text colors based on theme
  if (chart.options.scales) {
    const textColor = isDarkMode
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(0, 0, 0, 0.7)';
    const gridColor = isDarkMode
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)';

    // Update all scales with theme colors
    Object.values(chart.options.scales).forEach((scale) => {
      if (scale.ticks) {
        scale.ticks.color = textColor;
      }
      if (scale.grid) {
        scale.grid.color = gridColor;
      }
    });

    // Update for radar charts
    if (props.chartType === 'radar' && chart.options.scales.r) {
      if (chart.options.scales.r.pointLabels) {
        chart.options.scales.r.pointLabels.color = textColor;
      }
      if (chart.options.scales.r.grid) {
        chart.options.scales.r.grid.color = gridColor;
      }
    }
  }

  // Update legend text color
  if (chart.options.plugins && chart.options.plugins.legend) {
    if (!chart.options.plugins.legend.labels) {
      chart.options.plugins.legend.labels = {};
    }
    chart.options.plugins.legend.labels.color = isDarkMode
      ? 'rgba(255, 255, 255, 0.9)'
      : 'rgba(0, 0, 0, 0.9)';
  }

  chart.update();
};

// Observe theme changes
let themeObserver: MutationObserver | null = null;
const observeThemeChanges = (): void => {
  // Watch for class changes on the HTML element to detect theme changes
  themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        updateChartTheme();
      }
    });
  });

  themeObserver.observe(document.documentElement, { attributes: true });
};

// Handle window resize to make charts responsive
const handleResize = (): void => {
  if (chart) {
    chart.resize();
  }
};

// Lifecycle hooks
onMounted(() => {
  initChart();
  observeThemeChanges();
  updateChartTheme(); // Apply theme immediately after initialization
  window.addEventListener('resize', handleResize);
});

// Watch for changes in props
watch(
  () => props.chartData,
  () => {
    updateChart();
  },
  { deep: true }
);

watch(
  () => props.chartType,
  () => {
    initChart(); // Re-initialize when chart type changes
  }
);

watch(
  () => props.options,
  () => {
    updateChart();
  },
  { deep: true }
);

// Clean up
onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
  }
  if (themeObserver) {
    themeObserver.disconnect();
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: v-bind(width);
  height: v-bind(height);
}

/* Ensure canvas fills container */
.chart-container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
