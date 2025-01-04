<template>
  <n-space vertical :size="12" class="min-h-screen md:px-6 px-2 py-4">
    <h1 class="md:px-0 text-3xl text-center lg:text-left">
      Good evening, Mihail
    </h1>

    <!-- Quick Info Cards -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 px-8 md:px-0"
    >
      <n-card
        class="dark:hover:bg-[hsl(240,8%,13%)] duration-150 dark:bg-[#18181c] dark:text-white rounded"
        title="Next Class"
      >
        <template #header-extra>
          <Icon
            name="material-symbols:school-outline"
            class="text-emerald-400"
            :size="36"
          />
        </template>
        <div class="mt-2">
          <p class="font-bold">Mathematics</p>
          <p>Class: 10A</p>
          <p>Room: 301</p>
          <n-time :time="nextClassTime" type="relative" />
        </div>
      </n-card>

      <n-card
        class="dark:hover:bg-[hsl(240,8%,13%)] duration-150 dark:bg-[#18181c] dark:text-white rounded"
        title="Upcoming Exam"
      >
        <template #header-extra>
          <Icon
            name="mdi:file-document-edit-outline"
            class="text-emerald-400"
            :size="36"
          />
        </template>
        <div class="mt-2">
          <p class="font-bold">Physics Mid-term</p>
          <p>Class: 11B</p>
          <p>Topic: Mechanics</p>
          <n-time :time="upcomingExamTime" type="relative" />
        </div>
      </n-card>

      <n-card
        class="dark:hover:bg-[hsl(240,8%,13%)] duration-150 dark:bg-[#18181c] dark:text-white rounded"
        title="School Events"
      >
        <template #header-extra>
          <Icon name="mdi:calendar-star" class="text-emerald-400" :size="36" />
        </template>
        <div class="mt-2">
          <p class="font-bold">Science Fair</p>
          <p>Location: School Auditorium</p>
          <n-time :time="schoolEventTime" type="relative" />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Click for more events
          </p>
        </div>
      </n-card>
    </div>

    <!-- Grades Table Section -->
    <div class="grades-table-wrapper">
      <!-- Header actions -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <n-input-group>
            <n-input
              v-model:value="searchQuery"
              placeholder="Search students..."
              clearable
              class="w-64"
            >
              <template #prefix>
                <Icon name="ph:magnifying-glass" class="text-gray-400" />
              </template>
            </n-input>
            <n-button type="primary" color="#4ade80">
              <template #icon>
                <Icon name="ph:funnel" />
              </template>
            </n-button>
          </n-input-group>
        </div>

        <div class="flex items-center gap-2">
          <n-button type="primary" color="#4ade80" @click="generateNewData">
            <template #icon>
              <Icon name="ph:arrows-clockwise" />
            </template>
            Refresh Data
          </n-button>
          <n-button type="primary" color="#4ade80" @click="exportToExcel">
            <template #icon>
              <Icon name="ph:file-excel" />
            </template>
            Export
          </n-button>
        </div>
      </div>

      <!-- Main table -->
      <div
        class="overflow-hidden rounded-xl border border-gray-700 bg-[#262629]"
      >
        <n-data-table
          ref="dataTableRef"
          :bordered="false"
          :single-line="false"
          :columns="columns"
          :data="filteredData"
          :pagination="pagination"
          :loading="loading"
          class="custom-table"
        />
      </div>

      <!-- Summary statistics -->
      <div class="mt-4 grid grid-cols-3 gap-4">
        <div
          v-for="stat in statistics"
          :key="stat.label"
          class="rounded-lg bg-[#262629] p-4 border border-gray-700"
        >
          <div class="text-sm text-gray-400">{{ stat.label }}</div>
          <div class="mt-1 text-xl font-bold text-emerald-400">
            {{ stat.value }}
          </div>
        </div>
      </div>
    </div>

    <!-- Grade Modal -->
    <n-modal
      :show="showModal"
      style="width: 600px"
      title="Add Grades"
      :bordered="false"
      size="huge"
      @mask-click="showModal = false"
    >
      //TODO: Add missing imports
      <GradeFormComponent />
    </n-modal>
  </n-space>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import * as XLSX from 'xlsx';
import { useTags } from '~/composables/useTags';
import GradeFormComponent from '~/components/GradeFormComponent.vue';

definePageMeta({
  layout: 'dashboard-layout',
});

// Types
interface RowData {
  key: string;
  student: string;
  firstTerm: number[];
  firstTermGrade: number;
  secondTerm: number[];
  secondTermGrade: number;
  yearlyGrade: number;
}

// Composables and state
const { createTags } = useTags();
const dataTableRef = ref();
const searchQuery = ref('');
const loading = ref(false);
const showModal = ref(false);
const data = ref<RowData[]>([]);

// Example times
const nextClassTime = new Date(Date.now() + 30 * 60 * 1000).getTime();
const upcomingExamTime = new Date(
  Date.now() + 2 * 24 * 60 * 60 * 1000
).getTime();
const schoolEventTime = new Date(
  Date.now() + 5 * 24 * 60 * 60 * 1000
).getTime();

const pagination = {
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
};

// Methods to generate random data (same as your original)
const generateData = (): RowData[] => {
  const randomGrade = (): number => Math.floor(Math.random() * (6 - 2 + 1)) + 2;
  const calculateAverage = (grades: number[]): number => {
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    return Number((sum / grades.length).toFixed(0));
  };

  const studentNames = [
    'Elden Mesho',
    'K. Honda',
    'Almond Lover',
    'Marto Koleff',
    'Marto Borisov',
  ];

  return studentNames.map((name, index) => {
    const firstTerm = [randomGrade(), randomGrade(), randomGrade()];
    const secondTerm = [randomGrade(), randomGrade(), randomGrade()];
    const firstTermGrade = calculateAverage(firstTerm);
    const secondTermGrade = calculateAverage(secondTerm);
    const yearlyGrade = Number(
      ((firstTermGrade + secondTermGrade) / 2).toFixed(0)
    );

    return {
      key: index.toString(),
      student: name,
      firstTerm,
      firstTermGrade,
      secondTerm,
      secondTermGrade,
      yearlyGrade,
    };
  });
};

// Computed
const filteredData = computed(() => {
  let result = [...data.value];
  if (searchQuery.value) {
    result = result.filter((row) =>
      row.student.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return result;
});

const statistics = computed(() => {
  const grades = filteredData.value.map((row) => row.yearlyGrade);
  return [
    {
      label: 'Class Average',
      value: (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1),
    },
    {
      label: 'Highest Grade',
      value: Math.max(...grades),
    },
    {
      label: 'Passing Rate',
      value: `${((grades.filter((g) => g >= 4).length / grades.length) * 100).toFixed(0)}%`,
    },
  ];
});

// Column definition
const createColumns = (): DataTableColumns<RowData> => {
  return [
    {
      title: 'Student',
      key: 'student',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Term I',
      key: 'firstTerm',
      width: 200,
      render(row) {
        return createTags(row.firstTerm);
      },
    },
    {
      title: 'Term I Grade',
      key: 'firstTermGrade',
      width: 120,
      render(row) {
        return createTags(row.firstTermGrade);
      },
    },
    {
      title: 'Term II',
      key: 'secondTerm',
      width: 200,
      render(row) {
        return createTags(row.secondTerm);
      },
    },
    {
      title: 'Term II Grade',
      key: 'secondTermGrade',
      width: 120,
      render(row) {
        return createTags(row.secondTermGrade);
      },
    },
    {
      title: 'Year Grade',
      key: 'yearlyGrade',
      width: 120,
      render(row) {
        return createTags(row.yearlyGrade);
      },
    },
  ];
};

const columns = createColumns();

// Methods
const generateNewData = async () => {
  loading.value = true;
  try {
    data.value = generateData();
  } finally {
    loading.value = false;
  }
};

const exportToExcel = () => {
  const plainData = filteredData.value.map((row) => ({
    Student: row.student,
    'Term I Grades': row.firstTerm.join(', '),
    'Term I Final': row.firstTermGrade,
    'Term II Grades': row.secondTerm.join(', '),
    'Term II Final': row.secondTermGrade,
    'Year Grade': row.yearlyGrade,
  }));

  const worksheet = XLSX.utils.json_to_sheet(plainData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Grades');
  XLSX.writeFile(workbook, 'grades_report.xlsx');
};

// Lifecycle
onMounted(() => {
  generateNewData();
});
</script>

<style scoped>
.grades-table-wrapper :deep(.custom-table) {
  .n-data-table {
    background-color: transparent;
  }

  .n-data-table-th {
    border-bottom: 1px solid rgba(74, 222, 128, 0.2);
    padding: 1rem;
    color: #4ade80;
    font-weight: 600;
  }

  .n-data-table-td {
    border-bottom: 1px solid rgba(75, 85, 99, 0.4);
    padding: 1rem;
    color: #9ca3af;
  }

  .n-data-table-tr:hover {
    background-color: rgba(74, 222, 128, 0.05);
  }

  .n-pagination {
    background-color: transparent;
    padding: 1rem;
  }

  .n-pagination .n-button {
    background-color: rgba(74, 222, 128, 0.1);
    border: 1px solid rgba(74, 222, 128, 0.2);
    color: #4ade80;

    &:hover {
      background-color: rgba(74, 222, 128, 0.2);
    }
  }
}
</style>
