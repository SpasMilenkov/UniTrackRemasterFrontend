<!-- components/analytics/InstitutionTypesDonutChart.vue -->
<template>
  <div class="w-full h-64">
    <Doughnut
      v-if="hasData"
      :data="chartData"
      :options="chartOptions"
      class="w-full h-full"
    />
    <div v-else class="flex items-center justify-center h-full">
      <div class="text-center">
        <Icon
          name="ph:chart-donut"
          class="text-4xl text-text-secondary mb-2 mx-auto"
        />
        <p class="text-text-secondary text-sm">No data available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Icon } from '#components';
import {
  useChartTheme,
  useAnalyticsFormatters,
} from '~/composables/useAnalyticsPolling';

// Props
interface Props {
  data: Record<string, number>;
}

const props = defineProps<Props>();

// Composables
const { getChartOptions, chartColors } = useChartTheme();
const { formatNumber, formatPercentage } = useAnalyticsFormatters();

// Computed
const hasData = computed(() => {
  return (
    Object.keys(props.data).length > 0 &&
    Object.values(props.data).some((value) => value > 0)
  );
});

const totalInstitutions = computed(() => {
  return Object.values(props.data).reduce((sum, count) => sum + count, 0);
});

const chartData = computed(() => {
  const entries = Object.entries(props.data);

  // Sort by count descending
  const sortedEntries = entries.sort(([, a], [, b]) => b - a);

  const colors = [
    chartColors.value.primary,
    chartColors.value.success,
    chartColors.value.warning,
    chartColors.value.error,
    chartColors.value.info,
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#ef4444', // red
  ];

  return {
    labels: sortedEntries.map(([type]) => formatTypeName(type)),
    datasets: [
      {
        data: sortedEntries.map(([, count]) => count),
        backgroundColor: colors.slice(0, sortedEntries.length),
        borderColor: chartColors.value.background,
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverBorderColor: chartColors.value.text,
        // Add some spacing between segments
        spacing: 2,
      },
    ],
  };
});

const chartOptions = computed(() =>
  getChartOptions({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%', // Makes it a donut instead of pie
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          },
          generateLabels: (chart: any) => {
            const original = chart.data;
            const labels = chart._metasets[0].data.map(
              (arc: any, index: number) => {
                const count = original.datasets[0].data[index];
                const percentage = (
                  (count / totalInstitutions.value) *
                  100
                ).toFixed(1);

                return {
                  text: `${original.labels[index]} (${percentage}%)`,
                  fillStyle: original.datasets[0].backgroundColor[index],
                  strokeStyle: original.datasets[0].borderColor,
                  lineWidth: original.datasets[0].borderWidth,
                  hidden: arc.hidden,
                  index: index,
                };
              }
            );

            return labels;
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = (
              (value / totalInstitutions.value) *
              100
            ).toFixed(1);

            return [
              `${label}: ${formatNumber(value)} institutions`,
              `Percentage: ${percentage}%`,
            ];
          },
        },
        displayColors: true,
        backgroundColor: chartColors.value.background,
        titleColor: chartColors.value.text,
        bodyColor: chartColors.value.text,
        borderColor: chartColors.value.grid,
        borderWidth: 1,
      },
    },
    // Add hover animations
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    hover: {
      animationDuration: 300,
    },
    elements: {
      arc: {
        borderRadius: 4,
      },
    },
  })
);

// Helper methods
const formatTypeName = (type: string) => {
  // Convert 'School' to 'Schools', etc.
  const formatted = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return formatted.endsWith('s') ? formatted : formatted + 's';
};
</script>
