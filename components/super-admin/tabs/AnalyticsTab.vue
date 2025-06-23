<template>
  <div class="w-full space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <n-spin size="large" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-lg bg-red-500/10 border border-red-500/20 p-4"
    >
      <div class="flex items-center gap-2">
        <Icon name="ph:warning-circle" class="text-red-500" />
        <p class="text-red-500">{{ error }}</p>
      </div>
      <n-button class="mt-4" type="primary" @click="refreshData">
        Try Again
      </n-button>
    </div>

    <template v-else>
      <!-- System Health Card with Clean Metrics Display -->
      <n-card title="System Health" class="hover-elevate">
        <template #header-extra>
          <n-tag :type="systemHealthTagType" size="small">
            {{ systemHealthStatus }}
          </n-tag>
        </template>

        <div class="flex items-center justify-between">
          <div class="relative w-32 h-32 mx-auto">
            <!-- show spinner only while the whole page is loading -->
            <div v-if="loading" class="flex items-center justify-center h-full">
              <n-spin size="small" />
            </div>

            <div
              class="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p class="text-2xl font-bold">{{ normalizedHealthScore }}%</p>
              <p class="text-xs text-text-secondary">Health Score</p>
            </div>
          </div>

          <!-- Key Metrics with Better Display -->
          <div class="space-y-4 flex-grow pl-4">
            <!-- CPU Metric -->
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <Icon name="ph:cpu" class="text-text-secondary" />
                <span class="text-sm text-text-secondary">CPU</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-sm font-medium">{{
                  cpuMetric.formattedValue
                }}</span>
                <div class="flex items-center gap-1">
                  <div
                    class="h-2 w-2 rounded-full"
                    :style="{ backgroundColor: cpuMetric.color }"
                  />
                  <span class="text-xs text-text-secondary"
                    >{{ cpuMetric.percentage.toFixed(0) }}% load</span
                  >
                </div>
              </div>
            </div>

            <!-- Memory Metric -->
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <Icon name="ph:database" class="text-text-secondary" />
                <span class="text-sm text-text-secondary">Memory</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-sm font-medium">{{
                  memoryMetric.formattedValue
                }}</span>
              </div>
            </div>

            <!-- Requests Metric -->
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <Icon name="ph:activity" class="text-text-secondary" />
                <span class="text-sm text-text-secondary">Requests</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-sm font-medium">{{
                  requestsMetric.formattedValue
                }}</span>
                <span class="text-xs text-text-secondary">
                  <span v-if="convertedRequestMetrics.totalRequests > 0">
                    {{ formatNumber(convertedRequestMetrics.totalRequests) }}
                    total
                  </span>
                  <span v-else>No data available</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </n-card>
      <!-- Request & Traffic Analysis -->
      <n-card title="Request Analysis" class="hover-elevate mb-6">
        <!-- Stats Grid: Change to 4-column layout with top stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <n-statistic label="Total Requests">
            <template #default>
              <span class="text-xl">{{
                formatNumber(convertedRequestMetrics.totalRequests)
              }}</span>
            </template>
          </n-statistic>

          <n-statistic label="Successful Requests">
            <template #default>
              <span class="text-xl text-green-500">
                {{ formatNumber(convertedRequestMetrics.successfulRequests) }}
              </span>
            </template>
          </n-statistic>

          <n-statistic label="Failed Requests">
            <template #default>
              <span class="text-xl text-red-500">
                {{ formatNumber(convertedRequestMetrics.failedRequests) }}
              </span>
            </template>
          </n-statistic>

          <n-statistic label="Avg Response Time">
            <template #default>
              <span class="text-xl"
                >{{ convertedRequestMetrics.avgResponseTime }}ms</span
              >
            </template>
          </n-statistic>
        </div>

        <!-- Chart: Full width and taller -->
        <div class="h-80 w-full">
          <div v-if="hasRequestData" class="w-full h-full">
            <canvas ref="requestsChartRef"/>
          </div>
          <div v-else class="flex items-center justify-center h-full">
            <n-empty description="No request data available" />
          </div>
        </div>
      </n-card>
      <!-- User & Institution Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- User Distribution Card -->
        <n-card title="User Distribution" class="hover-elevate">
          <p class="text-sm text-text-secondary mb-3">
            Percentage breakdown of all system users by role.
          </p>
          <div class="h-64">
            <div v-if="hasUserData" class="w-full h-full">
              <canvas ref="userDistributionChartRef"/>
            </div>
            <div v-else class="flex items-center justify-center h-full">
              <n-empty description="No user data available" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-4">
            <n-statistic label="Total Users">
              <template #default>
                <span class="text-xl">{{
                  formatNumber(convertedUserStats.totalUsers)
                }}</span>
              </template>
            </n-statistic>

            <n-statistic label="Active Users">
              <template #default>
                <span class="text-xl">{{
                  formatNumber(convertedUserStats.activeUsers)
                }}</span>
                <span class="text-sm text-text-secondary ml-1">
                  ({{ convertedUserStats.activePercentage }}%)
                </span>
              </template>
            </n-statistic>
          </div>
        </n-card>

        <!-- Institution Distribution Card -->
        <n-card title="Institution Distribution" class="hover-elevate">
          <p class="text-sm text-text-secondary mb-3">
            Split of institutions by type (e.g. schools vs universities).
          </p>
          <div class="h-64">
            <div v-if="hasInstitutionData" class="w-full h-full">
              <canvas ref="institutionDistributionChartRef" />
            </div>
            <div v-else class="flex items-center justify-center h-full">
              <n-empty description="No institution data available" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-4">
            <n-statistic label="Total Institutions">
              <template #default>
                <span class="text-xl">{{
                  formatNumber(convertedAcademicStats.totalInstitutions)
                }}</span>
              </template>
            </n-statistic>

            <div class="flex items-center">
              <div class="flex-1">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-text-secondary">Schools</span>
                  <span class="text-xs font-medium">{{
                    formatNumber(convertedAcademicStats.schoolCount)
                  }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-text-secondary">Universities</span>
                  <span class="text-xs font-medium">{{
                    formatNumber(convertedAcademicStats.universityCount)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </n-card>
      </div>

      <!-- Activity Overview -->
      <n-card title="Activity Overview" class="hover-elevate mb-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <n-statistic label="Total Attendances">
            <template #default>
              <span class="text-xl">{{
                formatNumber(convertedActivityStats.totalAttendances)
              }}</span>
            </template>
          </n-statistic>

          <n-statistic label="Total Marks">
            <template #default>
              <span class="text-xl">{{
                formatNumber(convertedActivityStats.totalMarks)
              }}</span>
            </template>
          </n-statistic>

          <n-statistic label="Total Applications">
            <template #default>
              <span class="text-xl">{{
                formatNumber(convertedActivityStats.totalApplications)
              }}</span>
            </template>
          </n-statistic>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-base font-medium mb-3 text-text-primary">
              Attendance Status Distribution
            </h4>
            <div class="h-64 border border-border rounded-lg p-2">
              <div v-if="hasAttendanceData" class="w-full h-full">
                <canvas ref="attendanceDistributionChartRef"/>
              </div>
              <div v-else class="flex items-center justify-center h-full">
                <n-empty description="No attendance data available" />
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-base font-medium mb-3 text-text-primary">
              Application Status Distribution
            </h4>
            <div class="h-64 border border-border rounded-lg p-2">
              <div v-if="hasApplicationData" class="w-full h-full">
                <canvas ref="applicationDistributionChartRef"/>
              </div>
              <div v-else class="flex items-center justify-center h-full">
                <n-empty description="No application data available" />
              </div>
            </div>
          </div>
        </div>
      </n-card>
      <!-- System Actions -->
      <n-card title="System Actions" class="hover-elevate">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <n-button type="info" block :loading="loading" @click="refreshData">
            <template #icon>
              <Icon name="ph:arrows-clockwise" />
            </template>
            Refresh Metrics
          </n-button>

          <n-button type="success" block @click="exportReport">
            <template #icon>
              <Icon name="ph:download-simple" />
            </template>
            Export Report
          </n-button>

          <n-popconfirm
            positive-text="Yes"
            negative-text="No"
            @positive-click="clearMetricsCache"
          >
            <template #trigger>
              <n-button type="warning" block>
                <template #icon>
                  <Icon name="ph:trash" />
                </template>
                Clear Metrics Cache
              </n-button>
            </template>
            Are you sure you want to clear the metrics cache? This will reset
            all performance counters.
          </n-popconfirm>
        </div>
      </n-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  onBeforeUnmount,
  watch,
  nextTick,
  h,
} from 'vue';
import {
  NSpin,
  NCard,
  NStatistic,
  NTag,
  NButton,
  NDataTable,
  NPopconfirm,
  NEmpty,
} from 'naive-ui';
import Chart from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';
import { useMetricsStore } from '~/stores/metrics';

// Import the improved metrics normalization utilities
const formatNumber = (value: number): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  console.log(value);
  return value.toLocaleString();
};

const getResourceColor = (percentage: number, inverted = false): string => {
  if (inverted) {
    // Inverted (higher is better)
    if (percentage >= 80) return '#22c55e'; // Green
    if (percentage >= 60) return '#3b82f6'; // Blue
    if (percentage >= 40) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  } else {
    // Standard (lower is better)
    if (percentage < 50) return '#22c55e'; // Green
    if (percentage < 70) return '#3b82f6'; // Blue
    if (percentage < 90) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  }
};

// Improved normalization functions
const normalizeHealthScore = (score: any): number => {
  if (score === null || score === undefined || isNaN(Number(score))) {
    return 0;
  }

  const numScore = typeof score === 'string' ? parseFloat(score) : score;

  if (numScore < 0) return 0;
  if (numScore >= 0 && numScore <= 100) return Math.round(numScore);
  if (numScore > 0 && numScore < 1) return Math.round(numScore * 100);

  // Default fallback
  return Math.min(100, Math.round(numScore));
};

// In your setup function
const themeStore = useThemeStore();
const currentTheme = computed(() => themeStore.actualTheme);

const chartTheme = computed(() => {
  const dark = isDarkMode.value;

  return {
    backgroundColor: dark ? '#18181c' : '#ffffff',
    textColor: dark ? '#f5f5f5' : '#1f2937',
    secondaryTextColor: dark ? '#9ca3af' : '#4b5563',
    borderColor: dark ? '#374151' : '#e5e7eb',
    gridColor: dark ? 'rgba(55, 65, 81, 0.2)' : 'rgba(209, 213, 219, 0.3)',
    gridBorderColor: dark
      ? 'rgba(55, 65, 81, 0.4)'
      : 'rgba(209, 213, 219, 0.5)',
    cardBackgroundColor: dark ? '#18181c' : '#ffffff',
    chartBackgroundColor: dark ? '#18181c' : '#ffffff',
  };
});

// Helper for determining dark mode
const isDarkMode = computed(() => currentTheme.value === 'dark');

// Get the metrics store
const metricsStore = useMetricsStore();

// State variables
const loading = ref(true);
const error = ref<string | null>(null);
const refreshInterval = ref<number | null>(null);
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Chart refs
const healthGaugeRef = ref<HTMLCanvasElement | null>(null);
const requestsChartRef = ref<HTMLCanvasElement | null>(null);
const userDistributionChartRef = ref<HTMLCanvasElement | null>(null);
const institutionDistributionChartRef = ref<HTMLCanvasElement | null>(null);
const attendanceDistributionChartRef = ref<HTMLCanvasElement | null>(null);
const applicationDistributionChartRef = ref<HTMLCanvasElement | null>(null);

// Chart instances
const chartInstances = ref<Record<string, Chart | null>>({
  healthGauge: null,
  requests: null,
  userDistribution: null,
  institutionDistribution: null,
  attendanceDistribution: null,
  applicationDistribution: null,
});

// System health calculations
const normalizedHealthScore = computed(() => {
  const rawScore = metricsStore.systemHealthScore;

  if (rawScore === null || rawScore === undefined || isNaN(Number(rawScore))) {
    return 0;
  }
  return normalizeHealthScore(rawScore);
});

// System health status and tag type
const systemHealthStatus = computed(() => {
  const score = normalizedHealthScore.value;
  if (score === 0) return 'Unknown';
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  if (score >= 60) return 'Needs Attention';
  return 'Critical';
});

const systemHealthTagType = computed(() => {
  const score = normalizedHealthScore.value;
  if (score === 0) return 'default';
  if (score >= 90) return 'success';
  if (score >= 80) return 'info';
  if (score >= 70) return 'warning';
  return 'error';
});

// Process individual metrics
const cpuMetric = computed(() => {
  const health = metricsStore.healthMetrics || { cpuUsage: 0 };
  const cpuUsage = health.cpuUsage || 0;

  return {
    value: cpuUsage,
    formattedValue: cpuUsage.toFixed(1) + '%',
    percentage: cpuUsage,
    color: getResourceColor(cpuUsage),
  };
});

const memoryMetric = computed(() => {
  const health = metricsStore.healthMetrics || { memoryUsage: 0 };
  const memUsage = health.memoryUsage || 0;

  // Convert to percentage if it's a decimal
  const percentage = memUsage <= 1 ? memUsage * 100 : Math.min(100, memUsage);
  console.log(memUsage);
  // Format based on the type of value
  let formattedValue;
  if (memUsage <= 1) {
    formattedValue = `${percentage.toFixed(1)}%`;
  } else if (memUsage < 1024) {
    formattedValue = `${memUsage.toFixed(1)} MB`;
  } else {
    formattedValue = `${(memUsage / 1024).toFixed(1)} GB`;
  }

  return {
    value: memUsage,
    formattedValue,
    percentage,
    color: getResourceColor(percentage),
  };
});

const requestsMetric = computed(() => {
  const health = metricsStore.healthMetrics || { requestsPerSecond: 0 };
  const reqPerSec = health.requestsPerSecond || 0;

  // Scale for percentage display, assuming 100 req/s is 100%
  const percentage = Math.min(100, (reqPerSec / 100) * 100);
  return {
    value: reqPerSec,
    formattedValue: `${reqPerSec.toFixed(1)}/s`,
    percentage,
    color: '#3b82f6', // Always blue for requests
  };
});

// Converted request metrics
const convertedRequestMetrics = computed(() => {
  const reqMetrics = metricsStore.requestMetrics || {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
  };
  console.log(reqMetrics);
  return {
    totalRequests: reqMetrics.totalRequests || 0,
    successfulRequests: reqMetrics.successfulRequests || 0,
    failedRequests: reqMetrics.failedRequests || 0,
    avgResponseTime: (reqMetrics.averageResponseTime || 0).toFixed(1),
  };
});

// Converted user statistics
const convertedUserStats = computed(() => {
  const userStats = metricsStore.userStatistics || {
    totalUsers: 0,
    activeUsers: 0,
    usersByRole: {},
  };

  const totalUsers = userStats.totalUsers || 0;
  const activeUsers = userStats.activeUsers || 0;

  const activePercentage =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  return {
    totalUsers,
    activeUsers,
    activePercentage,
    usersByRole: userStats.usersByRole || {},
  };
});

// Converted academic statistics
const convertedAcademicStats = computed(() => {
  const academicStats = metricsStore.academicStatistics || {
    totalInstitutions: 0,
    schoolCount: 0,
    universityCount: 0,
    institutionsByType: {},
  };

  return {
    totalInstitutions: academicStats.totalInstitutions || 0,
    schoolCount: academicStats.schoolCount || 0,
    universityCount: academicStats.universityCount || 0,
    institutionsByType: academicStats.institutionsByType || {},
  };
});

// Converted activity statistics
const convertedActivityStats = computed(() => {
  const activityStats = metricsStore.activityStatistics || {
    totalAttendances: 0,
    totalMarks: 0,
    totalApplications: 0,
    attendanceByStatus: {},
    applicationsByStatus: {},
  };

  return {
    totalAttendances: activityStats.totalAttendances || 0,
    totalMarks: activityStats.totalMarks || 0,
    totalApplications: activityStats.totalApplications || 0,
    attendanceByStatus: activityStats.attendanceByStatus || {},
    applicationsByStatus: activityStats.applicationsByStatus || {},
  };
});

// Converted entity counts
const convertedEntityCounts = computed(() => {
  const entityCountsData = metricsStore.entityCountsData || [];

  return entityCountsData.map((entity: any) => ({
    name: entity.name || 'Unknown Entity',
    total: entity.total || 0,
    active: entity.active || 0,
    activePercentage:
      entity.total > 0 ? ((entity.active || 0) / entity.total) * 100 : 0,
  }));
});

// Check if we have enough data for charts
const hasUserData = computed(() => {
  const usersByRole = convertedUserStats.value.usersByRole;
  return usersByRole && Object.keys(usersByRole).length > 0;
});

const hasInstitutionData = computed(() => {
  const institutionsByType = convertedAcademicStats.value.institutionsByType;
  return institutionsByType && Object.keys(institutionsByType).length > 0;
});

const hasAttendanceData = computed(() => {
  const attendanceByStatus = convertedActivityStats.value.attendanceByStatus;
  return attendanceByStatus && Object.keys(attendanceByStatus).length > 0;
});

const hasApplicationData = computed(() => {
  const applicationsByStatus =
    convertedActivityStats.value.applicationsByStatus;
  return applicationsByStatus && Object.keys(applicationsByStatus).length > 0;
});

const hasRequestData = computed(() => {
  return convertedRequestMetrics.value.totalRequests > 0;
});

// Custom row props for hover effects
const rowProps = (row: any) => {
  return {
    style: 'transition: background-color 0.2s ease;',
  };
};

// Custom row class for hover effects
const getRowClass = (row: any, index: number) => {
  return index % 2 === 0 ? 'even-row' : 'odd-row';
};

// Entity columns with improved styling
// Theme overrides for the table
const tableThemeOverrides = computed(() => {
  return {
    thColor: isDarkMode.value
      ? 'rgba(45, 55, 72, 0.9)'
      : 'rgba(243, 244, 246, 0.8)',
    thTextColor: isDarkMode.value ? '#f5f5f5' : '#1f2937',
    thFontWeight: '600',
    tdColor: isDarkMode.value ? 'rgba(17, 24, 39, 0.6)' : '#ffffff',
    tdTextColor: isDarkMode.value ? '#f5f5f5' : '#1f2937',
    borderColor: isDarkMode.value ? '#374151' : '#e5e7eb',
    // Remove hover highlight
    tdColorHover: isDarkMode.value ? 'rgba(17, 24, 39, 0.6)' : '#ffffff',
    // Add striping for better row separation
    tdColorStriped: isDarkMode.value
      ? 'rgba(31, 41, 55, 0.4)'
      : 'rgba(249, 250, 251, 0.6)',
  };
});

// Entity columns with improved styling
const entityColumns = [
  {
    title: 'Entity',
    key: 'name',
    width: 180,
    sorter: 'default',
    align: 'left',
  },
  {
    title: 'Total Count',
    key: 'total',
    width: 120,
    sorter: (a: { total: number }, b: { total: number }) => a.total - b.total,
    align: 'center',
    render: (row: { total: number }) => {
      return h('span', { class: 'font-medium' }, formatNumber(row.total));
    },
  },
  {
    title: 'Active',
    key: 'active',
    width: 120,
    sorter: (a: { active: number }, b: { active: number }) =>
      a.active - b.active,
    align: 'center',
    render: (row: { active: number; total: number }) => {
      // Make active counts green when they match total counts (100%)
      const isComplete = row.active === row.total && row.total > 0;
      return h(
        'span',
        {
          class: isComplete ? 'font-medium text-green-500' : 'font-medium',
        },
        formatNumber(row.active)
      );
    },
  },
  {
    title: 'Active %',
    key: 'activePercentage',
    width: 240,
    sorter: (
      a: { activePercentage: number },
      b: { activePercentage: number }
    ) => a.activePercentage - b.activePercentage,
    render: (row: { activePercentage: number }) => {
      const pct = Math.round(row.activePercentage);
      const barColor = getProgressBarColor(pct);
      const bgColor = isDarkMode.value
        ? 'rgba(55, 65, 81, 0.4)'
        : 'rgba(229, 231, 235, 0.6)';

      return h(
        'div',
        {
          class: 'relative w-full h-5 rounded-full overflow-hidden',
          style: { backgroundColor: bgColor },
        },
        [
          // Progress bar
          h('div', {
            class: 'absolute left-0 top-0 h-full transition-all duration-500',
            style: {
              width: `${pct}%`,
              backgroundColor: barColor,
            },
          }),
          // Percentage text
          h(
            'span',
            {
              class:
                'absolute inset-0 flex items-center justify-center text-xs font-medium text-white',
            },
            `${pct}%`
          ),
        ]
      );
    },
  },
];

// Helper function to get progress bar color based on percentage
const getProgressBarColor = (percentage: number) => {
  if (percentage === 100) return 'rgb(34, 197, 94)'; // Green for 100%
  if (percentage >= 75) return 'rgb(59, 130, 246)'; // Blue for 75-99%
  if (percentage >= 50) return 'rgb(245, 158, 11)'; // Amber for 50-74%
  if (percentage >= 25) return 'rgb(249, 115, 22)'; // Orange for 25-49%
  return 'rgb(239, 68, 68)'; // Red for 0-24%
};

const entityCountsLastUpdated = computed(() => {
  const timestamp = metricsStore.lastUpdated?.entityCounts;
  if (!timestamp) return 'Never';

  return new Date(timestamp).toLocaleString();
});

// Methods
const refreshData = async () => {
  loading.value = true;
  error.value = null;
  try {
    await metricsStore.fetchAllMetrics();
  } catch (err: any) {
    error.value = err.message || 'Failed to load metrics data';
  } finally {
    loading.value = false;
    await nextTick();
    initializeCharts();
  }
};

const clearMetricsCache = () => {
  refreshData();
};

const exportReport = () => {
  // Export metrics as a CSV file
  console.log('Exporting metrics report...');

  // Create a CSV content string
  let csvContent = 'data:text/csv;charset=utf-8,';

  // Add headers
  csvContent += 'Metric,Value\n';

  // System health
  csvContent += `System Health Score,${normalizedHealthScore.value}%\n`;
  csvContent += `System Health Status,${systemHealthStatus.value}\n`;

  // User statistics
  csvContent += `Total Users,${convertedUserStats.value.totalUsers}\n`;
  csvContent += `Active Users,${convertedUserStats.value.activeUsers}\n`;
  csvContent += `Active Users Percentage,${convertedUserStats.value.activePercentage}%\n`;

  // Academic statistics
  csvContent += `Total Institutions,${convertedAcademicStats.value.totalInstitutions}\n`;
  csvContent += `Schools,${convertedAcademicStats.value.schoolCount}\n`;
  csvContent += `Universities,${convertedAcademicStats.value.universityCount}\n`;

  // Activity statistics
  csvContent += `Total Attendances,${convertedActivityStats.value.totalAttendances}\n`;
  csvContent += `Total Marks,${convertedActivityStats.value.totalMarks}\n`;
  csvContent += `Total Applications,${convertedActivityStats.value.totalApplications}\n`;

  // Request metrics
  csvContent += `Total Requests,${convertedRequestMetrics.value.totalRequests}\n`;
  csvContent += `Successful Requests,${convertedRequestMetrics.value.successfulRequests}\n`;
  csvContent += `Failed Requests,${convertedRequestMetrics.value.failedRequests}\n`;
  csvContent += `Average Response Time,${convertedRequestMetrics.value.avgResponseTime}ms\n`;

  // Generate timestamp
  csvContent += `\nReport generated,${new Date().toLocaleString()}\n`;

  // Create a download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `system_metrics_${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);

  // Trigger download
  link.click();

  // Clean up
  document.body.removeChild(link);
};

const setupAutoRefresh = () => {
  refreshInterval.value = window.setInterval(() => {
    metricsStore.refreshCriticalMetrics();
    updateCharts();
  }, AUTO_REFRESH_INTERVAL);
};

const cleanupCharts = () => {
  Object.values(chartInstances.value).forEach((chart) => {
    if (chart) chart.destroy();
  });
  chartInstances.value = {
    healthGauge: null,
    requests: null,
    userDistribution: null,
    institutionDistribution: null,
    attendanceDistribution: null,
    applicationDistribution: null,
  };
};

// Chart initialization
const initializeCharts = () => {
  // Clean up existing charts
  cleanupCharts();

  // Initialize health gauge
  if (healthGaugeRef.value) {
    const ctx = healthGaugeRef.value.getContext('2d');
    if (ctx) {
      try {
        chartInstances.value.healthGauge = new Chart(
          ctx,
          createHealthGaugeConfig()
        );
      } catch (err) {
        console.error('Error creating health gauge chart:', err);
      }
    }
  }

  // Initialize requests chart
  if (requestsChartRef.value && hasRequestData.value) {
    const ctx = requestsChartRef.value.getContext('2d');
    if (ctx) {
      try {
        chartInstances.value.requests = new Chart(
          ctx,
          createRequestsChartConfig()
        );
      } catch (err) {
        console.error('Error creating requests chart:', err);
      }
    }
  }

  // Initialize user distribution chart if data exists
  if (userDistributionChartRef.value && hasUserData.value) {
    const ctx = userDistributionChartRef.value.getContext('2d');
    if (ctx) {
      try {
        chartInstances.value.userDistribution = new Chart(
          ctx,
          createUserDistributionChartConfig()
        );
      } catch (err) {
        console.error('Error creating user distribution chart:', err);
      }
    }
  }

  // Initialize institution distribution chart if data exists
  if (institutionDistributionChartRef.value && hasInstitutionData.value) {
    const ctx = institutionDistributionChartRef.value.getContext('2d');
    if (ctx) {
      try {
        chartInstances.value.institutionDistribution = new Chart(
          ctx,
          createInstitutionDistributionChartConfig()
        );
      } catch (err) {
        console.error('Error creating institution distribution chart:', err);
      }
    }
  }

  // Initialize attendance distribution chart if data exists
  if (attendanceDistributionChartRef.value && hasAttendanceData.value) {
    const ctx = attendanceDistributionChartRef.value.getContext('2d');
    if (ctx) {
      try {
        chartInstances.value.attendanceDistribution = new Chart(
          ctx,
          createAttendanceDistributionChartConfig()
        );
      } catch (err) {
        console.error('Error creating attendance distribution chart:', err);
      }
    }
  }

  // Initialize application distribution chart if data exists
  if (applicationDistributionChartRef.value && hasApplicationData.value) {
    const ctx = applicationDistributionChartRef.value.getContext('2d');
    if (ctx) {
      try {
        chartInstances.value.applicationDistribution = new Chart(
          ctx,
          createApplicationDistributionChartConfig()
        );
      } catch (err) {
        console.error('Error creating application distribution chart:', err);
      }
    }
  }
};

const updateCharts = () => {
  // Update health gauge
  if (chartInstances.value.healthGauge) {
    const healthScore = normalizedHealthScore.value || 0;
    chartInstances.value.healthGauge.data.datasets[0].data = [
      healthScore,
      100 - healthScore,
    ];
    chartInstances.value.healthGauge.update();
  }

  // Update requests chart if it exists
  if (chartInstances.value.requests && hasRequestData.value) {
    chartInstances.value.requests.update();
  }

  // Update user distribution chart if it exists
  if (chartInstances.value.userDistribution && hasUserData.value) {
    chartInstances.value.userDistribution.update();
  }

  // Update institution distribution chart if it exists
  if (
    chartInstances.value.institutionDistribution &&
    hasInstitutionData.value
  ) {
    chartInstances.value.institutionDistribution.update();
  }

  // Update attendance distribution chart if it exists
  if (chartInstances.value.attendanceDistribution && hasAttendanceData.value) {
    chartInstances.value.attendanceDistribution.update();
  }

  // Update application distribution chart if it exists
  if (
    chartInstances.value.applicationDistribution &&
    hasApplicationData.value
  ) {
    chartInstances.value.applicationDistribution.update();
  }
};

// Chart configurations
const createHealthGaugeConfig = (): ChartConfiguration => {
  const healthScore = normalizedHealthScore.value || 0;

  return {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [healthScore, 100 - healthScore],
          backgroundColor: [
            healthScore >= 80
              ? '#22c55e'
              : healthScore >= 60
                ? '#f59e0b'
                : '#ef4444',
            '#e5e7eb',
          ],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
  };
};

// Improved Requests Chart Configuration
const createRequestsChartConfig = (): ChartConfiguration<'bar'> => {
  const requestMetrics = metricsStore.requestMetrics;

  // Check if we have detailed endpoint data
  const hasEndpointData =
    requestMetrics?.requestsByEndpoint &&
    Object.keys(requestMetrics.requestsByEndpoint).length > 0;

  let labels: string[] = [];
  let successData: number[] = [];
  let failureData: number[] = [];

  if (hasEndpointData && requestMetrics) {
    // Use real endpoint data
    labels = Object.keys(requestMetrics.requestsByEndpoint || {});

    // For each endpoint, calculate success and failure
    // We don't have direct success/failure per endpoint, so we'll estimate
    // based on the overall success rate
    const successRate =
      requestMetrics.successfulRequests / requestMetrics.totalRequests;

    // Use the endpoints data
    successData = labels.map((endpoint) => {
      const total = requestMetrics.requestsByEndpoint?.[endpoint] || 0;
      return Math.round(total * successRate);
    });

    failureData = labels.map((endpoint) => {
      const total = requestMetrics.requestsByEndpoint?.[endpoint] || 0;
      return total - Math.round(total * successRate);
    });

    // If we have too many endpoints, limit to the top 10-15 by request volume
    if (labels.length > 15) {
      // Sort endpoints by volume and take top 15
      const sortedEndpoints = labels
        .map((label) => ({
          label,
          total: requestMetrics.requestsByEndpoint?.[label] || 0,
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 15);

      // Update our arrays
      labels = sortedEndpoints.map((e) => e.label);
      successData = sortedEndpoints.map((e) =>
        Math.round(e.total * successRate)
      );
      failureData = sortedEndpoints.map(
        (e) => e.total - Math.round(e.total * successRate)
      );
    }

    // Simplify endpoint labels for display (remove common prefixes)
    labels = labels.map((endpoint) => {
      // Remove common API prefixes for cleaner display
      return endpoint.replace(/^\/api\//, '').replace(/^api\//, '');
    });
  } else {
    // Fallback to time-based hourly mock data if we don't have endpoint data
    labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    // Generate mock data that preserves the real success/failure ratio
    const successRatio =
      requestMetrics && requestMetrics.totalRequests > 0
        ? requestMetrics.successfulRequests / requestMetrics.totalRequests
        : 0.95; // Default 95% success rate

    const totalPerHour = Math.max(
      1,
      Math.floor((requestMetrics?.totalRequests || 100) / 24)
    );

    successData = Array.from({ length: 24 }, () =>
      Math.floor(totalPerHour * successRatio)
    );

    failureData = Array.from({ length: 24 }, () =>
      Math.ceil(totalPerHour * (1 - successRatio))
    );
  }

  const theme = chartTheme.value;

  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Successful',
          data: successData,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Failed',
          data: failureData,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            color: theme.gridColor,
          },
          ticks: {
            color: theme.secondaryTextColor,
            font: {
              size: 11,
            },
            // For endpoint data, we might need to rotate labels
            maxRotation: hasEndpointData ? 45 : 0,
            minRotation: hasEndpointData ? 45 : 0,
            autoSkip: true,
            maxTicksLimit: 15,
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: {
            color: theme.gridColor,
          },
          ticks: {
            color: theme.secondaryTextColor,
            font: {
              size: 11,
            },
          },
        },
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            color: theme.textColor,
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 16,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: theme.backgroundColor,
          titleColor: theme.textColor,
          bodyColor: theme.secondaryTextColor,
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              const value = context.raw as number;

              // Return formatted value
              return `${label}: ${value.toLocaleString()}`;
            },
          },
        },
      },
    },
  };
};

const createUserDistributionChartConfig =
  (): ChartConfiguration<'doughnut'> => {
    const usersByRole = convertedUserStats.value.usersByRole || {};
    const labels = Object.keys(usersByRole);
    const data = Object.values(usersByRole);

    // Custom colors for user roles
    const roleColors = {
      Admin: '#3b82f6', // Blue
      Teacher: '#ec4899', // Pink
      Student: '#f97316', // Orange
      Parent: '#8b5cf6', // Purple
      Guest: '#6b7280', // Gray
    };

    const backgroundColors = labels.map(
      (label) => roleColors[label] || '#6b7280'
    );

    return {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors,
            borderColor: '#18181c',
            borderWidth: 2,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        layout: {
          padding: { top: 20, bottom: 20, left: 20, right: 20 },
        },
        plugins: {
          legend: {
            position: 'bottom',
            align: 'center',
            labels: {
              color: '#f5f5f5',
              padding: 16,
              font: {
                size: 12,
              },
              boxWidth: 12,
              boxHeight: 12,
            },
          },
          tooltip: {
            backgroundColor: '#18181c',
            titleColor: '#f5f5f5',
            bodyColor: '#9ca3af',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${formatNumber(value)} (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
        },
      },
    };
  };

const createInstitutionDistributionChartConfig =
  (): ChartConfiguration<'doughnut'> => {
    const instByType = convertedAcademicStats.value.institutionsByType || {};
    const labels = Object.keys(instByType);
    const data = Object.values(instByType);

    // Custom colors for institution types
    const typeColors = {
      PublicSchool: '#3b82f6', // Blue
      PrivateSchool: '#60a5fa', // Light blue
      PublicUniversity: '#8b5cf6', // Purple
      PrivateUniversity: '#a78bfa', // Light purple
      CommunityCollege: '#14b8a6', // Teal
      TechnicalCollege: '#22d3ee', // Cyan
      CharterSchool: '#f59e0b', // Amber
      InternationalSchool: '#f97316', // Orange
    };

    const backgroundColors = labels.map(
      (label) => typeColors[label] || '#6b7280'
    );

    return {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors,
            borderColor: '#18181c',
            borderWidth: 2,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        layout: {
          padding: { top: 20, bottom: 20, left: 20, right: 20 },
        },
        plugins: {
          legend: {
            position: 'bottom',
            align: 'center',
            labels: {
              color: '#f5f5f5',
              padding: 16,
              font: {
                size: 12,
              },
              boxWidth: 12,
              boxHeight: 12,
            },
          },
          tooltip: {
            backgroundColor: '#18181c',
            titleColor: '#f5f5f5',
            bodyColor: '#9ca3af',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${formatNumber(value)} (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
        },
      },
    };
  };

const createAttendanceDistributionChartConfig =
  (): ChartConfiguration<'bar'> => {
    const attendanceByStatus =
      convertedActivityStats.value.attendanceByStatus || {};
    const labels = Object.keys(attendanceByStatus);
    const data = Object.values(attendanceByStatus);

    const statusColors = {
      Present: 'rgba(34, 197, 94, 0.85)', // Green
      Absent: 'rgba(239, 68, 68, 0.85)', // Red
      Late: 'rgba(245, 158, 11, 0.85)', // Amber
      ExcusedAbsence: 'rgba(59, 130, 246, 0.85)', // Blue
      UnexcusedAbsence: 'rgba(236, 72, 153, 0.85)', // Pink
      RemoteLearning: 'rgba(139, 92, 246, 0.85)', // Purple
    };

    const backgroundColors = labels.map(
      (label) =>
        statusColors[label as keyof typeof statusColors] ||
        'rgba(156, 163, 175, 0.85)'
    );

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) =>
              color.replace('0.85', '1')
            ),
            borderWidth: 1,
            borderRadius: 4,
            maxBarThickness: 50,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 15,
            right: 25,
            top: 15,
            bottom: 15,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(55, 65, 81, 0.2)',
              borderColor: 'rgba(55, 65, 81, 0.4)',
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 11,
              },
              callback: function (value) {
                return value + '%';
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#f5f5f5',
              font: {
                size: 12,
              },
              padding: 8,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#18181c',
            titleColor: '#f5f5f5',
            bodyColor: '#9ca3af',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const value = context.raw || 0;
                return `${value}%`;
              },
            },
          },
        },
      },
    };
  };
// Improved Application Distribution Chart Configuration
const createApplicationDistributionChartConfig =
  (): ChartConfiguration<'doughnut'> => {
    const applicationsByStatus =
      convertedActivityStats.value.applicationsByStatus || {};
    const labels = Object.keys(applicationsByStatus);
    const data = Object.values(applicationsByStatus);

    const statusColors = {
      Pending: 'rgba(245, 158, 11, 0.85)', // Amber
      Approved: 'rgba(34, 197, 94, 0.85)', // Green
      Denied: 'rgba(239, 68, 68, 0.85)', // Red
      Verified: 'rgba(59, 130, 246, 0.85)', // Blue
    };

    const backgroundColors = labels.map(
      (label) =>
        statusColors[label as keyof typeof statusColors] ||
        'rgba(156, 163, 175, 0.85)'
    );

    return {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors,
            borderColor: '#18181c',
            borderWidth: 2,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'right',
            align: 'center',
            labels: {
              color: '#f5f5f5',
              padding: 16,
              font: {
                size: 12,
              },
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: '#18181c',
            titleColor: '#f5f5f5',
            bodyColor: '#9ca3af',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${percentage}%`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 800,
        },
      },
    };
  };

// Lifecycle hooks
onMounted(async () => {
  try {
    await metricsStore.fetchAllMetrics();
  } catch (err) {
    error.value = err.message || 'Failed to load metrics data';
  } finally {
    // 1️⃣ first hide the spinner
    loading.value = false;

    // 2️⃣ then wait for the v-if="!loading" branch to render its canvas
    await nextTick();

    // 3️⃣ and only now initialize all your charts
    initializeCharts();
    setupAutoRefresh();
  }
});

onBeforeUnmount(() => {
  // Clean up
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
  cleanupCharts();
});

// Watch for changes in metrics data to update charts
watch(
  () => [
    normalizedHealthScore.value,
    convertedUserStats.value,
    convertedAcademicStats.value,
    convertedActivityStats.value,
  ],
  () => {
    nextTick(() => {
      updateCharts();
    });
  }
);
</script>
<style scoped>
.entity-column {
  font-weight: 500;
}

/* Entity indicators based on index instead of name */
.entity-indicator-0 {
  background-color: var(--color-primary, #4ade80);
}
.entity-indicator-1 {
  background-color: var(--color-secondary, #3b82f6);
}
.entity-indicator-2 {
  background-color: #8b5cf6;
}
.entity-indicator-3 {
  background-color: #ec4899;
}
.entity-indicator-4 {
  background-color: #f97316;
}
.entity-indicator-5 {
  background-color: #f59e0b;
}
.entity-indicator-6 {
  background-color: #14b8a6;
}
.entity-indicator-7 {
  background-color: #06b6d4;
}
.entity-indicator-8 {
  background-color: #ef4444;
}
.entity-indicator-9 {
  background-color: #6366f1;
}

/* Progress bar colors based on level rather than specific percentage */
.progress-color-5 {
  background-color: var(--color-primary, #22c55e);
}
.progress-color-4 {
  background-color: var(--color-secondary, #3b82f6);
}
.progress-color-3 {
  background-color: #f59e0b;
}
.progress-color-2 {
  background-color: #f97316;
}
.progress-color-1 {
  background-color: #ef4444;
}

:deep(.n-data-table .n-data-table-th) {
  font-weight: 600;
  padding: 12px 16px;
}

:deep(.n-data-table .n-data-table-td) {
  padding: 12px 16px;
}

:deep(.n-pagination) {
  margin-top: 16px;
}

:deep(.even-row:hover td),
:deep(.odd-row:hover td) {
  background-color: var(
    --color-primary-light,
    rgba(74, 222, 128, 0.1)
  ) !important;
}

.dashboard-card {
  background-color: var(--color-background-card);
  border: 1px solid var(--color-border);
}

:deep(.n-data-table .n-data-table-th) {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

:deep(.n-data-table .n-data-table-td) {
  padding: 12px 16px;
}

:deep(.n-pagination) {
  margin-top: 12px;
}
</style>
