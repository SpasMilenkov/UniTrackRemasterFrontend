<!-- GradesTable.vue -->
<template>
  <div class="grades-table-wrapper">
    <!-- Header actions -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <n-input-group>
          <n-input
            v-model:value="searchQuery"
            placeholder="Search subjects..."
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
    <div class="overflow-hidden rounded-xl border border-gray-700 bg-[#262629]">
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NDataTable } from 'naive-ui';
// import { useDownload } from '@vueuse/core'
import * as XLSX from 'xlsx';
import { useTags } from '~/composables/useTags';

const generateData = (): RowData[] => {
  // Helper function to generate a random grade between 2 and 6
  const randomGrade = (): number => Math.floor(Math.random() * (6 - 2 + 1)) + 2;

  // Helper function to calculate average grade
  const calculateAverage = (grades: number[]): number => {
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    return Number((sum / grades.length).toFixed(0));
  };

  return [
    {
      key: '0',
      subject: 'Mathematics',
      firstTerm: [randomGrade(), randomGrade(), randomGrade()],
      firstTermGrade: 0, // Will be calculated
      secondTerm: [randomGrade(), randomGrade(), randomGrade()],
      secondTermGrade: 0, // Will be calculated
      yearlyGrade: 0, // Will be calculated
    },
    {
      key: '1',
      subject: 'Science',
      firstTerm: [randomGrade(), randomGrade(), randomGrade()],
      firstTermGrade: 0,
      secondTerm: [randomGrade(), randomGrade(), randomGrade()],
      secondTermGrade: 0,
      yearlyGrade: 0,
    },
    {
      key: '2',
      subject: 'History',
      firstTerm: [randomGrade(), randomGrade(), randomGrade()],
      firstTermGrade: 0,
      secondTerm: [randomGrade(), randomGrade(), randomGrade()],
      secondTermGrade: 0,
      yearlyGrade: 0,
    },
    {
      key: '3',
      subject: 'Physics',
      firstTerm: [randomGrade(), randomGrade(), randomGrade()],
      firstTermGrade: 0,
      secondTerm: [randomGrade(), randomGrade(), randomGrade()],
      secondTermGrade: 0,
      yearlyGrade: 0,
    },
    {
      key: '4',
      subject: 'Programming',
      firstTerm: [randomGrade(), randomGrade(), randomGrade()],
      firstTermGrade: 0,
      secondTerm: [randomGrade(), randomGrade(), randomGrade()],
      secondTermGrade: 0,
      yearlyGrade: 0,
    },
  ].map((row) => {
    const firstTermGrade = calculateAverage(row.firstTerm);
    const secondTermGrade = calculateAverage(row.secondTerm);
    const yearlyGrade = Number(
      ((firstTermGrade + secondTermGrade) / 2).toFixed(0)
    );
    return {
      ...row,
      firstTermGrade,
      secondTermGrade,
      yearlyGrade,
    };
  });
};

// Types
interface RowData {
  key: string;
  subject: string;
  firstTerm: number[];
  firstTermGrade: number;
  secondTerm: number[];
  secondTermGrade: number;
  yearlyGrade: number;
}

// Composables
const { createTags } = useTags();

// State
const dataTableRef = ref();
const searchQuery = ref('');
const selectedTerm = ref('all');
const loading = ref(false);
const data = ref<RowData[]>([]);

// Options

const pagination = {
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
};

// Computed
const filteredData = computed(() => {
  let result = [...data.value];

  // Apply search filter
  if (searchQuery.value) {
    result = result.filter((row) =>
      row.subject.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Apply term filter
  if (selectedTerm.value !== 'all') {
    const termKey =
      selectedTerm.value === 'first' ? 'firstTermGrade' : 'secondTermGrade';
    result = result.filter((row) => row[termKey] >= 4);
  }

  return result;
});

const statistics = computed(() => {
  const grades = filteredData.value.map((row) => row.yearlyGrade);
  return [
    {
      label: 'Average Grade',
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
      title: 'Subject',
      key: 'subject',
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
  // Extract only plain data to avoid cyclic references
  const plainData = filteredData.value.map((row) => ({
    Subject: row.subject,
    'Term I Grades': row.firstTerm.join(', '),
    'Term I Final': row.firstTermGrade,
    'Term II Grades': row.secondTerm.join(', '),
    'Term II Final': row.secondTermGrade,
    'Year Grade': row.yearlyGrade,
  }));

  // Create the worksheet with plain data
  const worksheet = XLSX.utils.json_to_sheet(plainData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Grades');
  XLSX.writeFile(workbook, 'grades_report.xlsx');
};

const getGradeDescription = (grade: number): string => {
  const descriptions = {
    6: 'Excellent (6)',
    5: 'Very Good (5)',
    4: 'Good (4)',
    3: 'Fair (3)',
    2: 'Poor (2)',
  };
  return descriptions[grade as keyof typeof descriptions];
};

// Lifecycle
onMounted(() => {
  generateNewData();
});

// Define columns
const columns = createColumns();
</script>

<style scoped>
.grades-table-wrapper :deep(.custom-table) {
  /* Base table styling */
  .n-data-table {
    background-color: transparent;
  }

  /* Header styling */
  .n-data-table-th {
    /* background-color: rgba(74, 222, 128, 0.1); */
    border-bottom: 1px solid rgba(74, 222, 128, 0.2);
    padding: 1rem;
    color: #4ade80;
    font-weight: 600;
  }

  /* Cell styling */
  .n-data-table-td {
    border-bottom: 1px solid rgba(75, 85, 99, 0.4);
    padding: 1rem;
    color: #9ca3af;
  }

  /* Row hover effect */
  .n-data-table-tr:hover {
    background-color: rgba(74, 222, 128, 0.05);
  }

  /* Pagination styling */
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
