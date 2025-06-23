<!-- components/analytics/RegionalBreakdown.vue -->
<template>
  <div class="space-y-6">
    <!-- View Toggle -->
    <div class="flex items-center justify-between">
      <n-button-group>
        <n-button
          :type="viewMode === 'table' ? 'primary' : 'default'"
          @click="viewMode = 'table'"
        >
          <template #icon>
            <Icon name="ph:table" />
          </template>
          Table View
        </n-button>
        <n-button
          :type="viewMode === 'chart' ? 'primary' : 'default'"
          @click="viewMode = 'chart'"
        >
          <template #icon>
            <Icon name="ph:chart-bar" />
          </template>
          Chart View
        </n-button>
        <n-button
          :type="viewMode === 'heatmap' ? 'primary' : 'default'"
          @click="viewMode = 'heatmap'"
        >
          <template #icon>
            <Icon name="ph:map-pin" />
          </template>
          Heat Map
        </n-button>
      </n-button-group>

      <div class="flex items-center space-x-2">
        <span class="text-sm text-text-secondary">Sort by:</span>
        <n-select
          v-model:value="sortBy"
          :options="sortOptions"
          style="width: 140px"
          size="small"
        />
      </div>
    </div>

    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="overflow-hidden">
      <n-data-table
        :columns="tableColumns"
        :data="sortedRegionalData"
        :pagination="{ pageSize: 10 }"
        :row-key="(row: any) => row.region"
        class="rounded-lg"
      />
    </div>

    <!-- Chart View -->
    <div
      v-else-if="viewMode === 'chart'"
      class="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <!-- Regional Scores -->
      <n-card title="Average Scores by Region" class="h-80">
        <Bar
          :data="scoresChartData"
          :options="scoresChartOptions"
          class="w-full h-full"
        />
      </n-card>

      <!-- Growth Rates -->
      <n-card title="Growth Rates by Region" class="h-80">
        <Bar
          :data="growthChartData"
          :options="growthChartOptions"
          class="w-full h-full"
        />
      </n-card>

      <!-- Institution Distribution -->
      <n-card title="Institution Distribution" class="h-80">
        <Doughnut
          :data="institutionDistributionData"
          :options="doughnutOptions"
          class="w-full h-full"
        />
      </n-card>

      <!-- Student Distribution -->
      <n-card title="Student Distribution" class="h-80">
        <Doughnut
          :data="studentDistributionData"
          :options="doughnutOptions"
          class="w-full h-full"
        />
      </n-card>
    </div>

    <!-- Heat Map View -->
    <div v-else-if="viewMode === 'heatmap'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Heat Map Controls -->
        <n-select
          v-model:value="heatMapMetric"
          :options="heatMapMetricOptions"
          placeholder="Select metric"
        />
      </div>

      <!-- Heat Map Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="region in sortedRegionalData"
          :key="region.region"
          class="relative p-4 rounded-lg text-white font-medium text-center transition-all cursor-pointer hover:scale-105"
          :style="{ backgroundColor: getHeatMapColor(region) }"
          @click="selectedRegion = region"
        >
          <div class="font-semibold text-sm mb-1">{{ region.region }}</div>
          <div class="text-xs opacity-90">
            {{ getHeatMapValue(region) }}
          </div>

          <!-- Overlay for better readability -->
          <div class="absolute inset-0 bg-black bg-opacity-20 rounded-lg"/>
          <div class="relative z-10">
            <div class="font-semibold text-sm mb-1">{{ region.region }}</div>
            <div class="text-xs opacity-90">
              {{ getHeatMapValue(region) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Heat Map Legend -->
      <div class="flex items-center justify-center space-x-4 text-sm">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-red-500 rounded"/>
          <span class="text-text-secondary">Low</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-yellow-500 rounded"/>
          <span class="text-text-secondary">Medium</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-500 rounded"/>
          <span class="text-text-secondary">High</span>
        </div>
      </div>
    </div>

    <!-- Regional Details Modal -->
    <n-modal
      v-model:show="showRegionModal"
      preset="card"
      style="width: 600px"
      :title="`${selectedRegion?.region} - Regional Details`"
    >
      <div v-if="selectedRegion" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-4 bg-background-secondary rounded-lg">
            <p class="text-sm text-text-secondary">Institutions</p>
            <p class="text-2xl font-bold text-primary">
              {{ formatNumber(selectedRegion.institutionCount) }}
            </p>
          </div>
          <div class="text-center p-4 bg-background-secondary rounded-lg">
            <p class="text-sm text-text-secondary">Students</p>
            <p class="text-2xl font-bold text-info">
              {{ formatNumber(selectedRegion.studentCount) }}
            </p>
          </div>
          <div class="text-center p-4 bg-background-secondary rounded-lg">
            <p class="text-sm text-text-secondary">Average Score</p>
            <p class="text-2xl font-bold text-success">
              {{ formatScore(selectedRegion.averageScore) }}
            </p>
          </div>
          <div class="text-center p-4 bg-background-secondary rounded-lg">
            <p class="text-sm text-text-secondary">Growth Rate</p>
            <p
              class="text-2xl font-bold"
              :class="
                selectedRegion.growthRate >= 0 ? 'text-success' : 'text-error'
              "
            >
              {{ formatPercentage(selectedRegion.growthRate) }}
            </p>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, watch } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import {
  NDataTable,
  NCard,
  NButton,
  NButtonGroup,
  NSelect,
  NModal,
  NTag,
  type DataTableColumns,
} from 'naive-ui';
import { Icon } from '#components';
import {
  useChartTheme,
  useAnalyticsFormatters,
} from '~/composables/useAnalyticsPolling';
import type { RegionalStatsDto } from '~/stores/analytics';

// Props
interface Props {
  regionalData: RegionalStatsDto[];
}

const props = defineProps<Props>();

// Composables
const { getChartOptions, getTrendColor, chartColors } = useChartTheme();
const { formatNumber, formatScore, formatPercentage } =
  useAnalyticsFormatters();

// State
const viewMode = ref<'table' | 'chart' | 'heatmap'>('table');
const sortBy = ref('averageScore');
const heatMapMetric = ref('averageScore');
const selectedRegion = ref<RegionalStatsDto | null>(null);
const showRegionModal = ref(false);

// Watch for region selection
watch(selectedRegion, (newRegion) => {
  if (newRegion) {
    showRegionModal.value = true;
  }
});

// Options
const sortOptions = [
  { label: 'Average Score', value: 'averageScore' },
  { label: 'Growth Rate', value: 'growthRate' },
  { label: 'Institution Count', value: 'institutionCount' },
  { label: 'Student Count', value: 'studentCount' },
  { label: 'Region Name', value: 'region' },
];

const heatMapMetricOptions = [
  { label: 'Average Score', value: 'averageScore' },
  { label: 'Growth Rate', value: 'growthRate' },
  { label: 'Institution Count', value: 'institutionCount' },
  { label: 'Student Count', value: 'studentCount' },
];

// Computed
const sortedRegionalData = computed(() => {
  const sorted = [...props.regionalData];

  return sorted.sort((a, b) => {
    if (sortBy.value === 'region') {
      return a.region.localeCompare(b.region);
    }
    return (b as any)[sortBy.value] - (a as any)[sortBy.value];
  });
});

// Table columns
const tableColumns: DataTableColumns<RegionalStatsDto> = [
  {
    title: 'Region',
    key: 'region',
    render: (row) => h('span', { class: 'font-medium' }, row.region),
  },
  {
    title: 'Institutions',
    key: 'institutionCount',
    render: (row) => formatNumber(row.institutionCount),
    sorter: (a, b) => a.institutionCount - b.institutionCount,
  },
  {
    title: 'Students',
    key: 'studentCount',
    render: (row) => formatNumber(row.studentCount),
    sorter: (a, b) => a.studentCount - b.studentCount,
  },
  {
    title: 'Average Score',
    key: 'averageScore',
    render: (row) =>
      h('span', { class: 'font-semibold' }, formatScore(row.averageScore)),
    sorter: (a, b) => a.averageScore - b.averageScore,
  },
  {
    title: 'Growth Rate',
    key: 'growthRate',
    render: (row) =>
      h(
        NTag,
        {
          type: row.growthRate >= 0 ? 'success' : 'error',
          size: 'small',
        },
        () => formatPercentage(row.growthRate)
      ),
    sorter: (a, b) => a.growthRate - b.growthRate,
  },
];

// Chart Data
const scoresChartData = computed(() => ({
  labels: sortedRegionalData.value.map((region) => region.region),
  datasets: [
    {
      label: 'Average Score',
      data: sortedRegionalData.value.map((region) => region.averageScore),
      backgroundColor: chartColors.value.primary,
      borderColor: chartColors.value.primary,
      borderWidth: 1,
    },
  ],
}));

const growthChartData = computed(() => ({
  labels: sortedRegionalData.value.map((region) => region.region),
  datasets: [
    {
      label: 'Growth Rate (%)',
      data: sortedRegionalData.value.map((region) => region.growthRate),
      backgroundColor: sortedRegionalData.value.map((region) =>
        region.growthRate >= 0
          ? chartColors.value.success
          : chartColors.value.error
      ),
      borderColor: sortedRegionalData.value.map((region) =>
        region.growthRate >= 0
          ? chartColors.value.success
          : chartColors.value.error
      ),
      borderWidth: 1,
    },
  ],
}));

const institutionDistributionData = computed(() => ({
  labels: sortedRegionalData.value.map((region) => region.region),
  datasets: [
    {
      data: sortedRegionalData.value.map((region) => region.institutionCount),
      backgroundColor: [
        chartColors.value.primary,
        chartColors.value.success,
        chartColors.value.warning,
        chartColors.value.error,
        chartColors.value.info,
        '#8b5cf6',
        '#f59e0b',
        '#ef4444',
      ],
      borderWidth: 2,
      borderColor: chartColors.value.background,
    },
  ],
}));

const studentDistributionData = computed(() => ({
  labels: sortedRegionalData.value.map((region) => region.region),
  datasets: [
    {
      data: sortedRegionalData.value.map((region) => region.studentCount),
      backgroundColor: [
        chartColors.value.info,
        chartColors.value.primary,
        chartColors.value.success,
        chartColors.value.warning,
        chartColors.value.error,
        '#8b5cf6',
        '#f59e0b',
        '#ef4444',
      ],
      borderWidth: 2,
      borderColor: chartColors.value.background,
    },
  ],
}));

// Chart Options
const scoresChartOptions = computed(() =>
  getChartOptions({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  })
);

const growthChartOptions = computed(() =>
  getChartOptions({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
          padding: 10,
        },
      },
    },
  })
);

// Heat Map Methods
const getHeatMapValue = (region: RegionalStatsDto) => {
  const value = (region as any)[heatMapMetric.value];

  switch (heatMapMetric.value) {
    case 'averageScore':
      return formatScore(value);
    case 'growthRate':
      return formatPercentage(value);
    case 'institutionCount':
    case 'studentCount':
      return formatNumber(value);
    default:
      return value.toString();
  }
};

const getHeatMapColor = (region: RegionalStatsDto) => {
  const value = (region as any)[heatMapMetric.value];
  const values = props.regionalData.map((r) => (r as any)[heatMapMetric.value]);
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Normalize value to 0-1 range
  const normalized = (value - min) / (max - min);

  // Generate color based on normalized value
  if (normalized < 0.33) {
    return `rgb(239, 68, 68, ${0.7 + normalized * 0.3})`; // Red spectrum
  } else if (normalized < 0.66) {
    return `rgb(245, 158, 11, ${0.7 + normalized * 0.3})`; // Yellow spectrum
  } else {
    return `rgb(16, 185, 129, ${0.7 + normalized * 0.3})`; // Green spectrum
  }
};
</script>
