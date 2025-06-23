<!-- components/analytics/TrendingMajorsChart.vue -->
<template>
  <div class="h-full">
    <div v-if="trends.length > 0" class="h-full flex flex-col">
      <!-- Chart Controls -->
      <div class="flex items-center justify-between mb-4">
        <n-select
          v-model:value="chartType"
          :options="chartTypeOptions"
          style="width: 140px"
          size="small"
        />

        <n-button-group size="small">
          <n-button
            :type="sortBy === 'growth' ? 'primary' : 'default'"
            @click="sortBy = 'growth'"
          >
            Growth
          </n-button>
          <n-button
            :type="sortBy === 'enrollment' ? 'primary' : 'default'"
            @click="sortBy = 'enrollment'"
          >
            Enrollment
          </n-button>
          <n-button
            :type="sortBy === 'score' ? 'primary' : 'default'"
            @click="sortBy = 'score'"
          >
            Score
          </n-button>
        </n-button-group>
      </div>

      <!-- Chart Container -->
      <div class="flex-1 relative">
        <Bar
          v-if="chartType === 'bar'"
          :data="chartData"
          :options="chartOptions"
          class="w-full h-full"
        />

        <Doughnut
          v-else-if="chartType === 'doughnut'"
          :data="doughnutData"
          :options="doughnutOptions"
          class="w-full h-full"
        />

        <Line
          v-else
          :data="lineData"
          :options="lineOptions"
          class="w-full h-full"
        />
      </div>

      <!-- Legend/Summary -->
      <div class="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div class="text-center">
          <p class="text-text-secondary">Highest Growth</p>
          <p class="font-semibold text-success">
            {{ topGrowthMajor?.name || 'N/A' }}
          </p>
          <p class="text-success">
            {{ formatPercentage(topGrowthMajor?.growthRate || 0) }}
          </p>
        </div>
        <div class="text-center">
          <p class="text-text-secondary">Largest Program</p>
          <p class="font-semibold text-primary">
            {{ topEnrollmentMajor?.name || 'N/A' }}
          </p>
          <p class="text-primary">
            {{ formatNumber(topEnrollmentMajor?.currentEnrollment || 0) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="h-full flex items-center justify-center">
      <div class="text-center">
        <Icon
          name="ph:graduation-cap"
          class="text-4xl text-text-secondary mb-2 mx-auto"
        />
        <p class="text-text-secondary">No trending majors data</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Bar, Doughnut, Line } from 'vue-chartjs';
import { NSelect, NButton, NButtonGroup } from 'naive-ui';
import { Icon } from '#components';
import {
  useChartTheme,
  useAnalyticsFormatters,
} from '~/composables/useAnalyticsPolling';
import type { MajorTrendDto } from '~/stores/analytics';

// Props
interface Props {
  trends: MajorTrendDto[];
}

const props = defineProps<Props>();

// Composables
const { getChartOptions, getTrendColor, chartColors } = useChartTheme();
const { formatPercentage, formatNumber } = useAnalyticsFormatters();

// State
const chartType = ref<'bar' | 'doughnut' | 'line'>('bar');
const sortBy = ref<'growth' | 'enrollment' | 'score'>('growth');

// Options
const chartTypeOptions = [
  { label: 'Bar Chart', value: 'bar' },
  { label: 'Donut Chart', value: 'doughnut' },
  { label: 'Line Chart', value: 'line' },
];

// Computed
const sortedTrends = computed(() => {
  const sorted = [...props.trends];

  switch (sortBy.value) {
    case 'growth':
      return sorted.sort((a, b) => b.growthRate - a.growthRate);
    case 'enrollment':
      return sorted.sort((a, b) => b.currentEnrollment - a.currentEnrollment);
    case 'score':
      return sorted.sort((a, b) => b.averageScore - a.averageScore);
    default:
      return sorted;
  }
});

const topGrowthMajor = computed(
  () => [...props.trends].sort((a, b) => b.growthRate - a.growthRate)[0]
);

const topEnrollmentMajor = computed(
  () =>
    [...props.trends].sort(
      (a, b) => b.currentEnrollment - a.currentEnrollment
    )[0]
);

// Chart Data
const chartData = computed(() => {
  const topTrends = sortedTrends.value.slice(0, 8); // Show top 8

  return {
    labels: topTrends.map((trend) => trend.name),
    datasets: [
      {
        label:
          sortBy.value === 'growth'
            ? 'Growth Rate (%)'
            : sortBy.value === 'enrollment'
              ? 'Current Enrollment'
              : 'Average Score',
        data: topTrends.map((trend) => {
          switch (sortBy.value) {
            case 'growth':
              return trend.growthRate;
            case 'enrollment':
              return trend.currentEnrollment;
            case 'score':
              return trend.averageScore;
            default:
              return trend.growthRate;
          }
        }),
        backgroundColor: topTrends.map((trend) => getTrendColor(trend.trend)),
        borderColor: topTrends.map((trend) => getTrendColor(trend.trend)),
        borderWidth: 1,
      },
    ],
  };
});

const doughnutData = computed(() => {
  const topTrends = sortedTrends.value.slice(0, 6);

  return {
    labels: topTrends.map((trend) => trend.name),
    datasets: [
      {
        data: topTrends.map((trend) => trend.currentEnrollment),
        backgroundColor: [
          chartColors.value.primary,
          chartColors.value.success,
          chartColors.value.warning,
          chartColors.value.error,
          chartColors.value.info,
          '#8b5cf6',
        ],
        borderWidth: 2,
        borderColor: chartColors.value.background,
      },
    ],
  };
});

const lineData = computed(() => {
  // Simulate trend data over time for line chart
  const topTrends = sortedTrends.value.slice(0, 5);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return {
    labels: months,
    datasets: topTrends.map((trend, index) => ({
      label: trend.name,
      data: months.map((_, monthIndex) => {
        // Simulate enrollment growth over months
        const baseEnrollment = trend.currentEnrollment;
        const monthlyGrowth = trend.growthRate / 12;
        return (
          baseEnrollment + (baseEnrollment * monthlyGrowth * monthIndex) / 100
        );
      }),
      borderColor: [
        chartColors.value.primary,
        chartColors.value.success,
        chartColors.value.warning,
        chartColors.value.error,
        chartColors.value.info,
      ][index % 5],
      backgroundColor: [
        chartColors.value.primary + '20',
        chartColors.value.success + '20',
        chartColors.value.warning + '20',
        chartColors.value.error + '20',
        chartColors.value.info + '20',
      ][index % 5],
      tension: 0.3,
      fill: false,
    })),
  };
});

// Chart Options
const chartOptions = computed(() =>
  getChartOptions({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            const label = context.dataset.label;

            if (sortBy.value === 'growth') {
              return `${label}: ${formatPercentage(value)}`;
            } else if (sortBy.value === 'enrollment') {
              return `${label}: ${formatNumber(value)} students`;
            } else {
              return `${label}: ${value.toFixed(1)}`;
            }
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            if (sortBy.value === 'growth') {
              return formatPercentage(value);
            } else if (sortBy.value === 'enrollment') {
              return formatNumber(value);
            }
            return value;
          },
        },
      },
    },
  })
);

const doughnutOptions = computed(() =>
  getChartOptions({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            return `${context.label}: ${formatNumber(value)} students`;
          },
        },
      },
    },
  })
);

const lineOptions = computed(() =>
  getChartOptions({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 10,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatNumber(value),
        },
      },
    },
  })
);
</script>
