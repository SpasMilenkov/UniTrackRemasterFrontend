<!-- components/teacher/attendance/AtRiskStudents.vue -->
<template>
  <n-card class="bg-background-card border-border">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="ph:warning" class="text-xl text-orange-500" />
          <span class="text-text-primary">Students at Risk</span>
          <span v-if="semesterName" class="text-sm text-text-muted">
            ({{ semesterName }})
          </span>
          <n-badge
            v-if="totalAtRiskStudents > 0"
            :value="totalAtRiskStudents"
            type="warning"
            show-zero
          />
        </div>
        <div class="flex items-center gap-2">
          <n-button text size="small" :loading="loading" @click="refreshData">
            <Icon
              name="ph:arrows-clockwise"
              class="text-text-secondary hover:text-primary"
            />
          </n-button>
          <n-dropdown :options="actionOptions" @select="handleAction">
            <n-button text size="small">
              <Icon
                name="ph:dots-three"
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
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
              High Risk (%)
            </label>
            <n-input-number
              v-model:value="highRiskThreshold"
              :min="1"
              :max="100"
              :precision="0"
              @update:value="handleThresholdChange"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Medium Risk (%)
            </label>
            <n-input-number
              v-model:value="mediumRiskThreshold"
              :min="1"
              :max="100"
              :precision="0"
              @update:value="handleThresholdChange"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Total Class Days
            </label>
            <n-input-number
              v-model:value="totalClassDays"
              :min="1"
              :max="200"
              :precision="0"
              @update:value="handleThresholdChange"
            />
          </div>
        </div>

        <!-- Risk Level Legend -->
        <div class="mt-4 flex items-center gap-4 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <span class="text-text-secondary">
              High Risk (≥{{ highRiskThreshold }}% absences)
            </span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-orange-500"></div>
            <span class="text-text-secondary">
              Medium Risk ({{ mediumRiskThreshold }}-{{
                highRiskThreshold - 1
              }}% absences)
            </span>
          </div>
        </div>
      </div>

      <!-- Summary Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-red-700 mb-1">High Risk</p>
              <p class="text-2xl font-bold text-red-500">
                {{ highRiskStudents.length }}
              </p>
            </div>
            <div class="rounded-lg p-3 bg-red-500/20">
              <Icon name="ph:warning-circle" class="text-xl text-red-500" />
            </div>
          </div>
        </div>

        <div
          class="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-orange-700 mb-1">Medium Risk</p>
              <p class="text-2xl font-bold text-orange-500">
                {{ mediumRiskStudents.length }}
              </p>
            </div>
            <div class="rounded-lg p-3 bg-orange-500/20">
              <Icon name="ph:warning" class="text-xl text-orange-500" />
            </div>
          </div>
        </div>

        <div
          class="p-4 rounded-lg bg-background-secondary border border-border"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-text-secondary mb-1">Total at Risk</p>
              <p class="text-2xl font-bold text-text-primary">
                {{ totalAtRiskStudents }}
              </p>
            </div>
            <div class="rounded-lg p-3 bg-primary/10">
              <Icon name="ph:users" class="text-xl text-primary" />
            </div>
          </div>
        </div>

        <div
          class="p-4 rounded-lg bg-background-secondary border border-border"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-text-secondary mb-1">Avg Absence Rate</p>
              <p class="text-2xl font-bold text-text-primary">
                {{ averageAbsenceRate }}%
              </p>
            </div>
            <div class="rounded-lg p-3 bg-secondary/10">
              <Icon name="ph:chart-pie" class="text-xl text-secondary" />
            </div>
          </div>
        </div>
      </div>

      <!-- No Data State -->
      <div
        v-if="totalAtRiskStudents === 0"
        class="text-center py-12 text-text-secondary"
      >
        <Icon name="ph:smiley" class="text-6xl mb-4 text-green-500" />
        <h3 class="text-lg font-semibold text-text-primary mb-2">
          Great! No Students at Risk
        </h3>
        <p class="text-text-secondary max-w-md mx-auto">
          Based on current thresholds, no students are showing concerning
          absence patterns. Keep monitoring attendance regularly.
        </p>
      </div>

      <!-- Risk Level Tabs -->
      <div v-else class="space-y-6">
        <n-tabs v-model:value="activeRiskTab" type="line">
          <n-tab name="all" :tab="`All (${totalAtRiskStudents})`">
            <template #icon>
              <Icon name="ph:users" />
            </template>
          </n-tab>
          <n-tab name="high" :tab="`High Risk (${highRiskStudents.length})`">
            <template #icon>
              <Icon name="ph:warning-circle" />
            </template>
          </n-tab>
          <n-tab
            name="medium"
            :tab="`Medium Risk (${mediumRiskStudents.length})`"
          >
            <template #icon>
              <Icon name="ph:warning" />
            </template>
          </n-tab>
        </n-tabs>

        <!-- Students List -->
        <div class="space-y-4">
          <div
            v-for="student in filteredStudents"
            :key="student.id"
            class="p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer"
            :class="getStudentCardClass(student.riskLevel)"
            @click="selectStudent(student)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-2">
                  <h4 class="font-semibold text-text-primary">
                    {{ student.firstName }} {{ student.lastName }}
                  </h4>
                  <n-tag
                    :type="student.riskLevel === 'high' ? 'error' : 'warning'"
                    size="small"
                  >
                    {{ student.riskLevel.toUpperCase() }} RISK
                  </n-tag>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p class="text-text-muted">Grade</p>
                    <p class="font-medium text-text-primary">
                      {{ student.gradeName }}
                    </p>
                  </div>
                  <div>
                    <p class="text-text-muted">Total Absences</p>
                    <p class="font-medium text-text-primary">
                      {{ student.totalAbsences }}
                    </p>
                  </div>
                  <div>
                    <p class="text-text-muted">Absence Rate</p>
                    <p class="font-medium text-text-primary">
                      {{ Math.round(student.absenceRate) }}%
                    </p>
                  </div>
                  <div>
                    <p class="text-text-muted">Recent Pattern</p>
                    <div class="flex items-center gap-1 mt-1">
                      <div
                        v-for="(day, index) in student.recentPattern.slice(-7)"
                        :key="index"
                        class="w-3 h-3 rounded-full"
                        :class="getPatternDayClass(day)"
                        :title="getPatternDayTitle(day)"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 ml-4">
                <n-button
                  size="small"
                  type="primary"
                  ghost
                  @click.stop="contactStudent(student)"
                >
                  <template #icon>
                    <Icon name="ph:envelope" />
                  </template>
                  Contact
                </n-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="canLoadMore" class="text-center pt-4">
          <n-button :loading="loadingMore" @click="loadMoreStudents">
            Load More Students
          </n-button>
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
  NBadge,
  NDropdown,
  NTabs,
  NTab,
  NModal,
  useNotification,
} from 'naive-ui';
import { useTeacherStore } from '@/stores/teacher';
import StudentAttendanceDetails from '~/components/student/StudentAttendanceDetails.vue';
import type {
  AtRiskStudentsFilterParams,
  AtRiskStudentDto,
  AtRiskStudentsResponseDto,
} from '@/stores/teacher';

interface Props {
  teacherId: string;
  semesterId?: string | null;
  gradeId?: string;
  subjectId?: string;
  fromDate?: string;
  toDate?: string;
}

const props = withDefaults(defineProps<Props>(), {});

const teacherStore = useTeacherStore();
const notification = useNotification();

// Local state
const loading = ref(false);
const loadingMore = ref(false);
const error = ref<string | null>(null);
const activeRiskTab = ref('all');
const selectedGradeId = ref<string | null>(props.gradeId || null);
const selectedSubjectId = ref<string | null>(props.subjectId || null);
const highRiskThreshold = ref(20);
const mediumRiskThreshold = ref(10);
const totalClassDays = ref(30);
const showStudentModal = ref(false);
const selectedStudent = ref<AtRiskStudentDto | null>(null);
const displayLimit = ref(20);

// Build filter parameters
const filterParams = computed((): AtRiskStudentsFilterParams => {
  const params: AtRiskStudentsFilterParams = {
    semesterId: props.semesterId || undefined,
    highRiskThreshold: highRiskThreshold.value,
    mediumRiskThreshold: mediumRiskThreshold.value,
    totalClassDays: totalClassDays.value,
  };

  if (selectedGradeId.value) params.gradeId = selectedGradeId.value;
  if (selectedSubjectId.value) params.subjectId = selectedSubjectId.value;
  if (props.fromDate) params.fromDate = props.fromDate;
  if (props.toDate) params.toDate = props.toDate;

  return params;
});

// Queries
const atRiskStudentsQuery = computed(() =>
  teacherStore.atRiskStudentsQuery(
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
const atRiskData = computed(
  () => atRiskStudentsQuery.value?.data?.value || null
);
const dashboardData = computed(() => dashboardQuery.value?.data?.value || null);

// Computed properties
const semesterName = computed(() => {
  if (atRiskData.value?.semesterName) {
    return atRiskData.value.semesterName;
  }
  if (dashboardData.value?.semesterName) {
    return dashboardData.value.semesterName;
  }
  return null;
});

const allAtRiskStudents = computed(() => atRiskData.value?.atRiskStudents || []);

const highRiskStudents = computed(() =>
  allAtRiskStudents.value.filter((student) => student.riskLevel === 'high')
);

const mediumRiskStudents = computed(() =>
  allAtRiskStudents.value.filter((student) => student.riskLevel === 'medium')
);

const totalAtRiskStudents = computed(() => allAtRiskStudents.value.length);

const averageAbsenceRate = computed(() => {
  if (totalAtRiskStudents.value === 0) return 0;

  const totalRate = allAtRiskStudents.value.reduce(
    (sum, student) => sum + student.absenceRate,
    0
  );
  return Math.round(totalRate / totalAtRiskStudents.value);
});

const filteredStudents = computed(() => {
  let students = allAtRiskStudents.value;

  switch (activeRiskTab.value) {
    case 'high':
      students = highRiskStudents.value;
      break;
    case 'medium':
      students = mediumRiskStudents.value;
      break;
    default:
      students = allAtRiskStudents.value;
  }

  return students.slice(0, displayLimit.value);
});

const canLoadMore = computed(() => {
  let totalStudents = 0;

  switch (activeRiskTab.value) {
    case 'high':
      totalStudents = highRiskStudents.value.length;
      break;
    case 'medium':
      totalStudents = mediumRiskStudents.value.length;
      break;
    default:
      totalStudents = allAtRiskStudents.value.length;
  }

  return displayLimit.value < totalStudents;
});

// Filter options
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

const actionOptions = [
  { label: 'Export Risk Report', key: 'export' },
  { label: 'Send Notifications', key: 'notify' },
  { label: 'Generate Intervention Plan', key: 'intervene' },
];

// Methods
const refreshData = async () => {
  loading.value = true;
  error.value = null;

  try {
    await Promise.all([
      atRiskStudentsQuery.value?.refetch(),
      dashboardQuery.value?.refetch(),
    ]);
  } catch (err: any) {
    error.value = err.message || 'Failed to load at-risk students data';
    notification.error({
      title: 'Error',
      content: error.value,
      duration: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = async () => {
  displayLimit.value = 20; // Reset display limit when filters change
  await refreshData();
};

const handleThresholdChange = async () => {
  // Debounce threshold changes
  setTimeout(async () => {
    displayLimit.value = 20;
    await refreshData();
  }, 500);
};

const loadMoreStudents = () => {
  loadingMore.value = true;

  setTimeout(() => {
    displayLimit.value += 20;
    loadingMore.value = false;
  }, 300);
};

const selectStudent = (student: AtRiskStudentDto) => {
  selectedStudent.value = student;
  showStudentModal.value = true;
};

const contactStudent = (student: AtRiskStudentDto) => {
  notification.info({
    title: 'Contact Student',
    content: `Contact feature for ${student.firstName} ${student.lastName} will be available soon`,
    duration: 3000,
  });
};

const handleAction = async (key: string) => {
  switch (key) {
    case 'export':
      await exportRiskReport();
      break;
    case 'notify':
      await sendNotifications();
      break;
    case 'intervene':
      await generateInterventionPlan();
      break;
  }
};

const exportRiskReport = async () => {
  try {
    const csvContent = [
      ['Name', 'Grade', 'Risk Level', 'Total Absences', 'Absence Rate'].join(
        ','
      ),
      ...allAtRiskStudents.value.map((student) =>
        [
          `${student.firstName} ${student.lastName}`,
          student.gradeName,
          student.riskLevel,
          student.totalAbsences,
          Math.round(student.absenceRate),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `at-risk-students-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    notification.success({
      title: 'Export Successful',
      content: 'At-risk students report exported to CSV',
      duration: 3000,
    });
  } catch (error: any) {
    notification.error({
      title: 'Export Failed',
      content: error.message || 'Failed to export report',
      duration: 5000,
    });
  }
};

const sendNotifications = async () => {
  notification.info({
    title: 'Feature Coming Soon',
    content: 'Automated notification system will be available soon',
    duration: 3000,
  });
};

const generateInterventionPlan = async () => {
  notification.info({
    title: 'Feature Coming Soon',
    content: 'Intervention plan generator will be available soon',
    duration: 3000,
  });
};

// Style helpers
const getStudentCardClass = (riskLevel: string) => {
  switch (riskLevel) {
    case 'high':
      return 'border-red-500/30 bg-red-500/5 hover:border-red-500/50';
    case 'medium':
      return 'border-orange-500/30 bg-orange-500/5 hover:border-orange-500/50';
    default:
      return 'border-border bg-background-secondary hover:border-primary/30';
  }
};

const getPatternDayClass = (day: string) => {
  switch (day) {
    case 'present':
      return 'bg-green-500';
    case 'absent':
      return 'bg-red-500';
    case 'late':
      return 'bg-orange-500';
    default:
      return 'bg-gray-300';
  }
};

const getPatternDayTitle = (day: string) => {
  switch (day) {
    case 'present':
      return 'Present';
    case 'absent':
      return 'Absent';
    case 'late':
      return 'Late';
    default:
      return 'Unknown';
  }
};

// Watch for prop changes
watch(() => props.semesterId, refreshData);
watch(() => props.teacherId, refreshData);

watch(
  () => activeRiskTab.value,
  () => {
    displayLimit.value = 20; // Reset display limit when changing tabs
  }
);

// Initialize
onMounted(async () => {
  await refreshData();
});
</script>

<style scoped>
/* Component-specific styles */
</style>
