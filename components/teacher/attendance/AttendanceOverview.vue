<!-- components/teacher/attendance/AttendanceOverview.vue -->
<template>
  <n-card class="bg-background-card border-border">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="ph:chart-line-up" class="text-xl text-secondary" />
          <span class="text-text-primary">Attendance Overview</span>
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
              Date Range
            </label>
            <n-select
              v-model:value="selectedDateRange"
              :options="dateRangeOptions"
              @update:value="handleDateRangeChange"
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
              Days to Show
            </label>
            <n-input-number
              v-model:value="selectedDaysToShow"
              :min="1"
              :max="90"
              @update:value="handleFilterChange"
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
              <p class="text-2xl font-bold text-orange-500">
                {{ attendanceData?.totalAbsences || 0 }}
              </p>
            </div>
            <div class="rounded-lg p-3 bg-orange-500/10">
              <Icon name="ph:calendar-x" class="text-xl text-orange-500" />
            </div>
          </div>
        </div>

        <div
          class="p-4 rounded-lg bg-background-secondary border border-border"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-text-secondary mb-1">Recent Absences</p>
              <p class="text-2xl font-bold text-red-500">
                {{ attendanceData?.recentAbsences || 0 }}
              </p>
              <p class="text-xs text-text-muted">Last 7 days</p>
            </div>
            <div class="rounded-lg p-3 bg-red-500/10">
              <Icon name="ph:trend-up" class="text-xl text-red-500" />
            </div>
          </div>
        </div>

        <div
          class="p-4 rounded-lg bg-background-secondary border border-border"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-text-secondary mb-1">Attendance Rate</p>
              <p class="text-2xl font-bold text-primary">
                {{ attendanceRate }}%
              </p>
            </div>
            <div class="rounded-lg p-3 bg-primary/10">
              <Icon name="ph:chart-pie" class="text-xl text-primary" />
            </div>
          </div>
        </div>

        <div
          class="p-4 rounded-lg bg-background-secondary border border-border"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-text-secondary mb-1">Status Breakdown</p>
              <div class="flex items-center gap-2 mt-2">
                <div
                  v-for="(count, status) in attendanceData?.absencesByStatus ||
                  {}"
                  :key="status"
                  class="text-xs"
                >
                  <n-tag :type="getStatusTagType(status)" size="small">
                    {{ status }}: {{ count }}
                  </n-tag>
                </div>
              </div>
            </div>
            <div class="rounded-lg p-3 bg-secondary/10">
              <Icon name="ph:list-bullets" class="text-xl text-secondary" />
            </div>
          </div>
        </div>
      </div>

      <!-- Trend Chart -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <Icon name="ph:chart-line" class="text-lg text-primary" />
          <h3 class="text-lg font-semibold text-text-primary">
            Absence Trends
          </h3>
        </div>

        <div v-if="hasChartData" class="h-64">
          <ClientOnly>
            <AttendanceTrendChart :chart-data="chartData" :loading="loading" />
          </ClientOnly>
        </div>
        <div
          v-else
          class="flex items-center justify-center h-64 text-text-secondary"
        >
          <div class="text-center">
            <Icon name="ph:chart-line" class="text-4xl mb-2" />
            <p>No attendance data available for the selected period</p>
          </div>
        </div>
      </div>

      <!-- Recent Absence Details -->
      <div v-if="recentAbsenceDetails.length > 0">
        <div class="flex items-center gap-2 mb-4">
          <Icon name="ph:clock" class="text-lg text-orange-500" />
          <h3 class="text-lg font-semibold text-text-primary">
            Recent Absences
          </h3>
        </div>

        <div class="space-y-3">
          <div
            v-for="absence in recentAbsenceDetails"
            :key="absence.id"
            class="flex items-center justify-between p-3 rounded-lg bg-background-secondary border border-border hover:border-primary/30 transition-all"
          >
            <div class="flex-1 min-w-0">
              <p class="font-medium truncate text-text-primary">
                {{ absence.studentName }}
              </p>
              <p class="text-sm text-text-secondary truncate">
                {{ absence.subjectName }} • {{ formatDate(absence.date) }}
              </p>
              <p v-if="absence.reason" class="text-xs text-text-muted truncate">
                {{ absence.reason }}
              </p>
            </div>
            <div class="text-right ml-3">
              <n-tag
                :type="absence.isExcused ? 'warning' : 'error'"
                size="small"
              >
                {{ absence.isExcused ? 'Excused' : 'Unexcused' }}
              </n-tag>
              <p class="text-xs text-text-muted mt-1">
                {{ absence.status }}
              </p>
            </div>
          </div>
        </div>
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
  NInputNumber,
  NSpin,
  NTag,
  NDropdown,
  useNotification,
} from 'naive-ui';
import { useTeacherStore } from '@/stores/teacher';
import AttendanceTrendChart from '../charts/AttendanceTrendChart.vue';
import type {
  AttendanceFilterParams
} from '@/stores/teacher';

interface Props {
  teacherId: string;
  semesterId?: string | null;
  daysToShow?: number;
  gradeId?: string;
  subjectId?: string;
  fromDate?: string;
  toDate?: string;
}

const props = withDefaults(defineProps<Props>(), {
  daysToShow: 14,
});

const teacherStore = useTeacherStore();
const notification = useNotification();

// Local state
const loading = ref(false);
const error = ref<string | null>(null);
const selectedDateRange = ref('14days');
const selectedGradeId = ref<string | null>(props.gradeId || null);
const selectedSubjectId = ref<string | null>(props.subjectId || null);
const selectedDaysToShow = ref(props.daysToShow);

// Build filter parameters
const filterParams = computed((): AttendanceFilterParams => {
  const params: AttendanceFilterParams = {
    semesterId: props.semesterId || undefined,
    daysToShow: selectedDaysToShow.value,
  };

  if (selectedGradeId.value) params.gradeId = selectedGradeId.value;
  if (selectedSubjectId.value) params.subjectId = selectedSubjectId.value;

  // Handle date range selection
  if (selectedDateRange.value !== 'custom') {
    const days = parseInt(selectedDateRange.value.replace('days', ''));
    params.daysToShow = days;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    params.toDate = endDate.toISOString().split('T')[0];
    params.fromDate = startDate.toISOString().split('T')[0];
  } else if (props.fromDate && props.toDate) {
    params.fromDate = props.fromDate;
    params.toDate = props.toDate;
  }

  return params;
});

// Queries
const attendanceOverviewQuery = computed(() =>
  teacherStore.attendanceOverviewQuery(
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

const teacherAbsencesQuery = computed(() =>
  teacherStore.teacherAbsencesQuery(
    ref(props.teacherId),
    ref(filterParams.value)
  )
);

// Data
const attendanceData = computed(
  () => attendanceOverviewQuery.value?.data?.value || null
);
const dashboardData = computed(() => dashboardQuery.value?.data?.value || null);
const recentAbsenceDetails = computed(
  () => teacherAbsencesQuery.value?.data?.value?.slice(0, 10) || []
);

// Computed properties
const semesterName = computed(() => {
  if (attendanceData.value?.semesterName) {
    return attendanceData.value.semesterName;
  }
  if (dashboardData.value?.semesterName) {
    return dashboardData.value.semesterName;
  }
  return null;
});

const attendanceRate = computed(() => {
  if (!attendanceData.value) return 0;

  const totalPossibleAttendance =
    selectedDaysToShow.value * (dashboardData.value?.totalStudents || 1);
  const totalAbsences = attendanceData.value.totalAbsences;
  const actualAttendance = totalPossibleAttendance - totalAbsences;

  return Math.round((actualAttendance / totalPossibleAttendance) * 100);
});

const hasChartData = computed(() => {
  console.log('attendanceData', attendanceData.value);
  console.log('absenceTrend', attendanceData.value?.dailyAbsenceTrend);
  return (
    attendanceData.value?.dailyAbsenceTrend &&
    Object.keys(attendanceData.value.dailyAbsenceTrend).length > 0
  );
});

const chartData = computed(() => {
  if (!hasChartData.value) return [];

  const entries = Object.entries(attendanceData.value!.dailyAbsenceTrend);

  return entries
    .map(([dateKey, count]) => ({
      date: formatChartDate(dateKey),
      absences: count,
      originalKey: dateKey,
    }))
    .sort((a, b) => a.originalKey.localeCompare(b.originalKey))
    .map(({ date, absences }) => ({ date, absences }));
});

const formatChartDate = (dateKey: string): string => {
  try {
    // Handle MM/dd format (like "06/07")
    if (dateKey.includes('/') && dateKey.length === 5) {
      const currentYear = new Date().getFullYear();
      const [month, day] = dateKey.split('/');
      const date = new Date(currentYear, parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }

    // Handle full date strings
    const date = new Date(dateKey);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }

    // If all fails return the original key ¯\_(ツ)_/¯
    return dateKey;
  } catch {
    return dateKey;
  }
};

// Filter options
const dateRangeOptions = [
  { label: '7 Days', value: '7days' },
  { label: '14 Days', value: '14days' },
  { label: '30 Days', value: '30days' },
  { label: '60 Days', value: '60days' },
  { label: '90 Days', value: '90days' },
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
      attendanceOverviewQuery.value?.refetch(),
      teacherAbsencesQuery.value?.refetch(),
      dashboardQuery.value?.refetch(),
    ]);
  } catch (err: any) {
    error.value = err.message || 'Failed to load attendance data';
    notification.error({
      title: 'Error',
      content: error.value,
      duration: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const handleDateRangeChange = async (value: string) => {
  selectedDateRange.value = value;
  const days = parseInt(value.replace('days', ''));
  selectedDaysToShow.value = days;
  await refreshData();
};

const handleFilterChange = async () => {
  await refreshData();
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
  if (!recentAbsenceDetails.value.length) return;

  const csvContent = [
    ['Date', 'Student', 'Subject', 'Status', 'Type', 'Reason'].join(','),
    ...recentAbsenceDetails.value.map((absence) =>
      [
        absence.date,
        absence.studentName || '',
        absence.subjectName || '',
        absence.status,
        absence.isExcused ? 'Excused' : 'Unexcused',
        absence.reason || '',
      ]
        .map((field) => `"${field}"`)
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `attendance-overview-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  notification.success({
    title: 'Export Successful',
    content: 'Attendance data exported to CSV',
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

const getStatusTagType = (status: string) => {
  switch (status.toLowerCase()) {
    case 'absent':
      return 'error';
    case 'late':
      return 'warning';
    case 'sick':
      return 'info';
    case 'emergency':
      return 'warning';
    default:
      return 'default';
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
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
