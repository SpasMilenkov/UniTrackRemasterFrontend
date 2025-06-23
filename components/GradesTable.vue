<template>
  <div>
    <div v-if="loadingGrades" class="flex justify-center py-8">
      <n-spin size="large" />
    </div>
    <div
      v-else-if="gradesError"
      class="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/10"
    >
      <p class="text-red-600 dark:text-red-400">{{ gradesError }}</p>
      <n-button class="mt-2" @click="loadGradeData">Retry</n-button>
    </div>
    <div v-else-if="gradeDashboard" class="space-y-6">
      <!-- Term/Year Selector -->
      <div class="flex flex-wrap gap-4 items-center">
        <n-select
          v-model:value="selectedAcademicYear"
          placeholder="Select Academic Year"
          :options="academicYearOptions"
          class="w-48"
        />
        <n-select
          v-model:value="selectedTerm"
          placeholder="Select Term"
          :options="termOptions"
          class="w-48"
        />
        <n-button type="primary" @click="loadGradeData">
          <template #icon>
            <Icon name="ph:arrows-clockwise" />
          </template>
          Refresh
        </n-button>
      </div>

      <!-- Performance Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <n-card hoverable class="bg-primary border-none text-white">
          <div class="flex flex-col items-center text-center">
            <div class="text-4xl font-bold">
              {{ gradeDashboard.gpa.toFixed(2) }}
            </div>
            <div class="mt-2 text-sm">Current GPA</div>
          </div>
        </n-card>

        <n-card hoverable>
          <div class="flex flex-col items-center text-center">
            <div class="text-4xl font-bold">
              {{ gradeDashboard.classRank || 'N/A' }}
            </div>
            <div class="mt-2 text-sm">Class Rank</div>
          </div>
        </n-card>

        <n-card hoverable>
          <div class="flex flex-col items-center text-center">
            <div class="text-4xl font-bold">
              {{
                gradeDashboard.classAverage
                  ? gradeDashboard.classAverage.toFixed(2)
                  : 'N/A'
              }}
            </div>
            <div class="mt-2 text-sm">Class Average</div>
          </div>
        </n-card>
      </div>

      <!-- Courses Table -->
      <n-card title="Course Grades" class="mt-4">
        <n-data-table
          :columns="courseColumns"
          :data="gradeDashboard.courses"
          :pagination="{ pageSize: 10 }"
          :bordered="false"
          striped
        />
      </n-card>
    </div>
    <div v-else class="p-8 text-center">
      <n-empty description="No grade data available">
        <template #extra>
          <n-button @click="loadGradeData">Load Grades</n-button>
        </template>
      </n-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, h } from 'vue';
import { useStudentStore } from '~/stores/student';

const props = defineProps({
  studentId: {
    type: String,
    required: true,
  },
});

const studentStore = useStudentStore();

// Local state
const selectedTerm = ref<string | null>(null);
const selectedAcademicYear = ref<string | null>(null);

// Computed properties from store
const loadingGrades = computed(() => studentStore.loadingGrades);
const gradesError = computed(() => studentStore.gradesError);
const gradeDashboard = computed(() => studentStore.gradeDashboard);

// Options for selectors
const termOptions = [
  { label: 'Fall', value: 'Fall' },
  { label: 'Spring', value: 'Spring' },
  { label: 'Summer', value: 'Summer' },
  { label: 'Winter', value: 'Winter' },
];

const academicYearOptions = [
  { label: '2024-2025', value: '2024-2025' },
  { label: '2023-2024', value: '2023-2024' },
  { label: '2022-2023', value: '2022-2023' },
];

// Table columns for courses
const courseColumns = [
  {
    title: 'Course Code',
    key: 'code',
  },
  {
    title: 'Course Name',
    key: 'name',
  },
  {
    title: 'Instructor',
    key: 'instructor',
  },
  {
    title: 'Grade',
    key: 'grade',
    render: (row) => {
      return h(
        'div',
        {
          class: getGradeColor(row.grade),
        },
        row.grade
      );
    },
  },
  {
    title: 'Score',
    key: 'score',
    render: (row) => {
      return h(
        'div',
        {
          class: getScoreColor(row.score),
        },
        `${row.score.toFixed(1)}%`
      );
    },
  },
  {
    title: 'Credits',
    key: 'credits',
  },
  {
    title: 'Status',
    key: 'status',
  },
];

// Utility functions
const getGradeColor = (grade) => {
  if (grade === 'A' || grade === 'A+' || grade === 'A-')
    return 'text-green-600 font-bold';
  if (grade === 'B+' || grade === 'B' || grade === 'B-')
    return 'text-blue-600 font-bold';
  if (grade === 'C+' || grade === 'C' || grade === 'C-')
    return 'text-yellow-600 font-bold';
  if (grade === 'D+' || grade === 'D' || grade === 'D-')
    return 'text-orange-600 font-bold';
  if (grade === 'F') return 'text-red-600 font-bold';
  return '';
};

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600 font-bold';
  if (score >= 80) return 'text-blue-600 font-bold';
  if (score >= 70) return 'text-yellow-600 font-bold';
  if (score >= 60) return 'text-orange-600 font-bold';
  return 'text-red-600 font-bold';
};

// Methods
const loadGradeData = async () => {
  if (!props.studentId) {
    console.error('No student ID provided');
    return;
  }

  try {
    // Load grade dashboard
    await studentStore.fetchStudentGradeDashboard(
      props.studentId,
      selectedTerm.value || undefined,
      selectedAcademicYear.value || undefined
    );
  } catch (error) {
    console.error('Error loading grade data:', error);
  }
};

// Watch for changes in filters
watch([selectedTerm, selectedAcademicYear], () => {
  loadGradeData();
});

// Initialize on component mount
onMounted(() => {
  loadGradeData();
});
</script>

<style scoped>
.dark .text-green-600 {
  color: #4ade80;
}
.dark .text-blue-600 {
  color: #3b82f6;
}
.dark .text-yellow-600 {
  color: #facc15;
}
.dark .text-orange-600 {
  color: #fb923c;
}
.dark .text-red-600 {
  color: #ef4444;
}
</style>
