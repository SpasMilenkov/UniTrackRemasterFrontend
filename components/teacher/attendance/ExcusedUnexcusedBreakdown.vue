<!-- components/teacher/attendance/ExcusedUnexcusedBreakdown.vue -->
<template>
  <n-card class="bg-background-card border-border">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="ph:chart-pie" class="text-xl text-secondary" />
          <span class="text-text-primary">Excused vs Unexcused Absences</span>
          <span v-if="semesterName" class="text-sm text-text-muted">
            ({{ semesterName }})
          </span>
        </div>
        <div class="flex items-center gap-2">
          <n-button text size="small" :loading="loading" @click="refreshData">
            <Icon
              name="ph:arrows-clockwise"
              class="text-text-secondary hover:text-primary"
            />
          </n-button>
          <n-dropdown :options="exportOptions" @select="handleExport">
            <n-button text size="small">
              <Icon
                name="ph:download"
                class="text-text-secondary hover:text-primary"
              />
            </n-button>
          </n-dropdown>
        </div>
      </div>
    </template>

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
      <div class="mt-3">
        <n-button size="small" @click="refreshData"> Try Again </n-button>
      </div>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Filter Controls -->
      <div
        class="mb-6 p-4 rounded-lg bg-background-secondary border border-border"
      >
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Time Frame
            </label>
            <n-select
              v-model:value="selectedTimeFrame"
              :options="timeFrameOptions"
              @update:value="handleTimeFrameChange"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Grade Filter
            </label>
            <n-select
              v-model:value="selectedGradeId"
              :options="gradeFilterOptions"
              clearable
              placeholder="All grades"
              @update:value="handleFilterChange"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Subject Filter
            </label>
            <n-select
              v-model:value="selectedSubjectId"
              :options="subjectFilterOptions"
              clearable
              placeholder="All subjects"
              @update:value="handleFilterChange"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Date Range
            </label>
            <n-date-picker
              v-model:value="customDateRange"
              type="daterange"
              :disabled="selectedTimeFrame !== 'custom'"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @update:value="handleCustomDateChange"
            />
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          class="p-4 rounded-lg bg-background-secondary border border-border"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-text-secondary mb-1">Total Absences</p>
              <p class="text-2xl font-bold text-text-primary">
                {{ totalAbsences }}
              </p>
            </div>
            <div class="rounded-lg p-3 bg-gray-500/10">
              <Icon name="ph:calendar-x" class="text-xl text-gray-500" />
            </div>
          </div>
        </div>

        <div
          class="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-orange-700 mb-1">Excused</p>
              <p class="text-2xl font-bold text-orange-500">
                {{ breakdownData?.excusedCount || 0 }}
              </p>
              <p class="text-xs text-orange-600">
                {{ breakdownData?.excusedPercentage || 0 }}%
              </p>
            </div>
            <div class="rounded-lg p-3 bg-orange-500/20">
              <Icon name="ph:check-circle" class="text-xl text-orange-500" />
            </div>
          </div>
        </div>

        <div class="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-red-700 mb-1">Unexcused</p>
              <p class="text-2xl font-bold text-red-500">
                {{ breakdownData?.unexcusedCount || 0 }}
              </p>
              <p class="text-xs text-red-600">
                {{ breakdownData?.unexcusedPercentage || 0 }}%
              </p>
            </div>
            <div class="rounded-lg p-3 bg-red-500/20">
              <Icon name="ph:x-circle" class="text-xl text-red-500" />
            </div>
          </div>
        </div>

        <div
          class="p-4 rounded-lg bg-background-secondary border border-border"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-text-secondary mb-1">Excuse Rate</p>
              <p class="text-2xl font-bold text-text-primary">
                {{ excuseRate }}%
              </p>
              <p class="text-xs text-text-muted">Excused / Total</p>
            </div>
            <div class="rounded-lg p-3 bg-primary/10">
              <Icon name="ph:percent" class="text-xl text-primary" />
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Pie Chart -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <Icon name="ph:chart-donut" class="text-lg text-primary" />
            <h3 class="text-lg font-semibold text-text-primary">
              Overall Breakdown
            </h3>
          </div>

          <div class="h-64 flex items-center justify-center">
            <ClientOnly>
              <AbsenceBreakdownPieChart
                :chart-data="pieChartData"
                :loading="loading"
              />
            </ClientOnly>
          </div>
        </div>

        <!-- Trend Chart -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <Icon name="ph:chart-line" class="text-lg text-secondary" />
            <h3 class="text-lg font-semibold text-text-primary">
              Trend Over Time
            </h3>
          </div>

          <div class="h-64">
            <ClientOnly>
              <AbsenceTrendChart
                :loading="loading"
              />
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- Subject Breakdown Table -->
      <div v-if="subjectBreakdownData.length > 0" class="space-y-4">
        <div class="flex items-center gap-2">
          <Icon name="ph:table" class="text-lg text-secondary" />
          <h3 class="text-lg font-semibold text-text-primary">
            Breakdown by Subject
          </h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left p-3 text-sm font-medium text-text-primary">
                  Subject
                </th>
                <th
                  class="text-center p-3 text-sm font-medium text-text-primary"
                >
                  Total
                </th>
                <th
                  class="text-center p-3 text-sm font-medium text-text-primary"
                >
                  Excused
                </th>
                <th
                  class="text-center p-3 text-sm font-medium text-text-primary"
                >
                  Unexcused
                </th>
                <th
                  class="text-center p-3 text-sm font-medium text-text-primary"
                >
                  Excuse Rate
                </th>
                <th
                  class="text-center p-3 text-sm font-medium text-text-primary"
                >
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="subject in subjectBreakdownData"
                :key="subject.subjectId"
                class="border-b border-border hover:bg-background-secondary transition-colors"
              >
                <td class="p-3">
                  <div class="font-medium text-text-primary">
                    {{ subject.subjectName }}
                  </div>
                </td>
                <td class="text-center p-3">
                  <span class="font-medium text-text-primary">{{
                    subject.total
                  }}</span>
                </td>
                <td class="text-center p-3">
                  <div class="flex items-center justify-center gap-2">
                    <span class="font-medium text-orange-500">{{
                      subject.excusedCount
                    }}</span>
                    <span class="text-xs text-text-muted"
                      >({{ subject.excusedPercentage }}%)</span
                    >
                  </div>
                </td>
                <td class="text-center p-3">
                  <div class="flex items-center justify-center gap-2">
                    <span class="font-medium text-red-500">{{
                      subject.unexcusedCount
                    }}</span>
                    <span class="text-xs text-text-muted"
                      >({{ subject.unexcusedPercentage }}%)</span
                    >
                  </div>
                </td>
                <td class="text-center p-3">
                  <n-progress
                    type="line"
                    :percentage="subject.excusedPercentage"
                    :show-indicator="false"
                    :height="6"
                    color="#f59e0b"
                    class="w-16"
                  />
                  <span class="text-xs text-text-muted mt-1">
                    {{ subject.excusedPercentage }}%
                  </span>
                </td>
                <td class="text-center p-3">
                  <n-tag :type="getSubjectTrendType(subject)" size="small">
                    {{ getSubjectTrendLabel(subject) }}
                  </n-tag>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div
        v-if="totalAbsences === 0"
        class="text-center py-12 text-text-secondary"
      >
        <Icon name="ph:calendar-check" class="text-6xl mb-4 text-green-500" />
        <h3 class="text-lg font-semibold text-text-primary mb-2">
          Perfect Attendance!
        </h3>
        <p class="text-text-secondary max-w-md mx-auto">
          No absences recorded for the selected time period and filters. Keep up
          the excellent work!
        </p>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import {
  NCard,
  NButton,
  NSelect,
  NDatePicker,
  NSpin,
  NTag,
  NDropdown,
  NProgress,
  useNotification,
} from 'naive-ui';
import { useTeacherStore } from '@/stores/teacher';
import AbsenceBreakdownPieChart from '../charts/AbsenceBreakdownChart.vue';
import AbsenceTrendChart from '../charts/AbsenceTrendChart.vue';
import type {
  AbsenceBreakdownFilterParams,
  ExcusedUnexcusedBreakdownDto,
} from '@/stores/teacher';

interface Props {
  teacherId: string;
  semesterId?: string | null;
  timeFrame?: string;
  gradeId?: string;
  subjectId?: string;
  fromDate?: string;
  toDate?: string;
}

const props = withDefaults(defineProps<Props>(), {
  timeFrame: 'month',
});

const teacherStore = useTeacherStore();
const notification = useNotification();

// Local state
const loading = ref(false);
const error = ref<string | null>(null);
const selectedTimeFrame = ref(props.timeFrame);
const selectedGradeId = ref<string | null>(props.gradeId || null);
const selectedSubjectId = ref<string | null>(props.subjectId || null);
const customDateRange = ref<[string, string] | null>(null);

// Build filter parameters
const filterParams = computed((): AbsenceBreakdownFilterParams => {
  const params: AbsenceBreakdownFilterParams = {
    semesterId: props.semesterId || undefined,
    timeFrame: selectedTimeFrame.value,
  };

  if (selectedGradeId.value) params.gradeId = selectedGradeId.value;
  if (selectedSubjectId.value) params.subjectId = selectedSubjectId.value;

  // Handle custom date range
  if (selectedTimeFrame.value === 'custom' && customDateRange.value) {
    params.fromDate = customDateRange.value[0];
    params.toDate = customDateRange.value[1];
  } else if (props.fromDate && props.toDate) {
    params.fromDate = props.fromDate;
    params.toDate = props.toDate;
  }

  return params;
});

// Queries
const breakdownQuery = computed(() =>
  teacherStore.excusedUnexcusedBreakdownQuery(
    ref(props.teacherId),
    ref(filterParams.value)
  )
);

const dashboardQuery = computed(() =>
  teacherStore.teacherDashboardQuery(
    ref(props.teacherId),
    ref(props.semesterId)
  )
);

// Data
const breakdownData = computed(() => breakdownQuery.value?.data?.value || null);
const dashboardData = computed(() => dashboardQuery.value?.data?.value || null);

// Computed properties
const semesterName = computed(() => {
  if (breakdownData.value?.semesterName) {
    return breakdownData.value.semesterName;
  }
  if (dashboardData.value?.semesterName) {
    return dashboardData.value.semesterName;
  }
  return null;
});

const totalAbsences = computed(() => {
  if (!breakdownData.value) return 0;
  return (
    (breakdownData.value.excusedCount || 0) +
    (breakdownData.value.unexcusedCount || 0)
  );
});

const excuseRate = computed(() => {
  if (totalAbsences.value === 0) return 0;
  return Math.round(
    ((breakdownData.value?.excusedCount || 0) / totalAbsences.value) * 100
  );
});

const subjectBreakdownData = computed(
  () => breakdownData.value?.subjectBreakdown || []
);

const pieChartData = computed(() => {
  if (!breakdownData.value) return [];

  return [
    {
      name: 'Excused',
      value: breakdownData.value.excusedCount || 0,
      color: '#f59e0b',
    },
    {
      name: 'Unexcused',
      value: breakdownData.value.unexcusedCount || 0,
      color: '#ef4444',
    },
  ];
});

// Filter options
const timeFrameOptions = [
  { label: 'Last Week', value: 'week' },
  { label: 'Last Month', value: 'month' },
  { label: 'Last Quarter', value: 'quarter' },
  { label: 'This Semester', value: 'semester' },
  { label: 'Custom Range', value: 'custom' },
];

const gradeFilterOptions = computed(() => {
  if (!dashboardData.value?.studentsByGrade) return [];

  return dashboardData.value.studentsByGrade.map((grade) => ({
    label: grade.gradeName,
    value: grade.gradeId,
  }));
});

const subjectFilterOptions = computed(() => {
  if (!dashboardData.value?.subjects) return [];

  return dashboardData.value.subjects.map((subject) => ({
    label: subject.name,
    value: subject.id,
  }));
});

const exportOptions = [
  { label: 'Export as CSV', key: 'csv' },
  { label: 'Export as PDF', key: 'pdf' },
  { label: 'Print Report', key: 'print' },
];

// Methods
const refreshData = async () => {
  loading.value = true;
  error.value = null;

  try {
    await Promise.all([
      breakdownQuery.value?.refetch(),
      dashboardQuery.value?.refetch(),
    ]);
  } catch (err: any) {
    error.value = err.message || 'Failed to load breakdown data';
    notification.error({
      title: 'Error',
      content: error.value,
      duration: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const handleTimeFrameChange = async (value: string) => {
  selectedTimeFrame.value = value;
  if (value !== 'custom') {
    customDateRange.value = null;
  }
  await refreshData();
};

const handleFilterChange = async () => {
  await refreshData();
};

const handleCustomDateChange = async (dates: [string, string] | null) => {
  customDateRange.value = dates;
  if (dates && selectedTimeFrame.value === 'custom') {
    await refreshData();
  }
};

const handleExport = async (key: string) => {
  try {
    switch (key) {
      case 'csv':
        await exportToCsv();
        break;
      case 'pdf':
        await exportToPdf();
        break;
      case 'print':
        window.print();
        break;
    }
  } catch (error: any) {
    notification.error({
      title: 'Export Error',
      content: error.message || 'Failed to export data',
      duration: 5000,
    });
  }
};

const exportToCsv = async () => {
  if (!subjectBreakdownData.value.length) return;

  const csvContent = [
    ['Subject', 'Total', 'Excused', 'Unexcused', 'Excuse Rate'].join(','),
    ...subjectBreakdownData.value.map((subject) =>
      [
        subject.subjectName,
        subject.total,
        subject.excusedCount,
        subject.unexcusedCount,
        `${subject.excusedPercentage}%`,
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `absence-breakdown-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  notification.success({
    title: 'Export Successful',
    content: 'Absence breakdown data exported to CSV',
    duration: 3000,
  });
};

const exportToPdf = async () => {
  notification.info({
    title: 'Feature Coming Soon',
    content: 'PDF export functionality will be available soon',
    duration: 3000,
  });
};

const getSubjectTrendType = (subject: any) => {
  const excuseRate = subject.excusedPercentage;
  if (excuseRate >= 80) return 'success';
  if (excuseRate >= 60) return 'warning';
  return 'error';
};

const getSubjectTrendLabel = (subject: any) => {
  const excuseRate = subject.excusedPercentage;
  if (excuseRate >= 80) return 'Good';
  if (excuseRate >= 60) return 'Moderate';
  return 'Concerning';
};

// Watch for prop changes
watch(() => props.semesterId, refreshData);
watch(() => props.teacherId, refreshData);

// Initialize
onMounted(async () => {
  await refreshData();
});
</script>

<style scoped>
/* Component-specific styles */
</style>
