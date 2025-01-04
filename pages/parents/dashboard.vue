<template>
  <n-space vertical :size="12" class="min-h-screen md:px-6 px-2 py-4">
    <h1 class="md:px-0 text-3xl text-center lg:text-left">
      Good evening, Mihail's parent
    </h1>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 px-8 md:px-0"
    >
      <n-statistic
        label="Your average marks"
        :value="99"
        class="dark:hover:bg-[hsl(240,8%,13%)] duration-150 px-6 py-8 dark:bg-[#18181c] dark:text-white rounded min-h-32 flex flex-col justify-center"
      >
        <template #prefix>
          <Icon
            name="material-symbols:school-outline"
            class="text-primary"
            size="56"
          />
        </template>
        <template #suffix> / 100 </template>
      </n-statistic>
      <n-statistic
        label="Class average marks"
        :value="99"
        class="dark:hover:bg-[hsl(240,8%,13%)] duration-150 px-6 py-8 dark:bg-[#18181c] dark:text-white rounded min-h-32 flex flex-col justify-center"
      >
        <template #prefix>
          <Icon name="ph:student" class="text-primary" size="56" />
        </template>
        <template #suffix> / 100 </template>
      </n-statistic>
      <n-statistic
        label="School average marks"
        :value="99"
        class="dark:hover:bg-[hsl(240,8%,13%)] duration-150 px-6 py-8 dark:bg-[#18181c] dark:text-white rounded min-h-32 flex flex-col justify-center"
      >
        <template #prefix>
          <Icon name="bx:bxs-school" class="text-primary" size="56" />
        </template>
        <template #suffix> / 100 </template>
      </n-statistic>
      <n-statistic
        label="Your absence count"
        :value="99"
        class="dark:hover:bg-[hsl(240,8%,13%)] duration-150 px-6 py-8 dark:bg-[#18181c] dark:text-white rounded min-h-32 flex flex-col justify-center"
      >
        <template #prefix>
          <Icon name="ph:calendar-x" class="text-primary" size="56" />
        </template>
        <template #suffix> / 100 </template>
      </n-statistic>
      <n-statistic
        label="Class Average absence"
        :value="99"
        class="dark:hover:bg-[hsl(240,8%,13%)] duration-150 px-6 py-8 dark:bg-[#18181c] dark:text-white rounded min-h-32 flex flex-col justify-center"
      >
        <template #prefix>
          <Icon name="ph:calendar-x" class="text-primary" size="56" />
        </template>
        <template #suffix> / 100 </template>
      </n-statistic>
      <n-statistic
        label="School Average absence"
        :value="99"
        class="dark:hover:bg-[hsl(240,8%,13%)] duration-150 px-6 py-8 dark:bg-[#18181c] dark:text-white rounded min-h-32 flex flex-col justify-center"
      >
        <template #prefix>
          <Icon name="ph:calendar-x" class="text-primary" size="56" />
        </template>
        <template #suffix> / 100 </template>
      </n-statistic>
    </div>
    <!-- Remove client only when implementing fetching from the server, the random generation is currently causing hydration errors -->
    <client-only>
      <n-data-table
        :bordered="false"
        :single-line="false"
        :columns="columns"
        :data="data"
        size="large"
      />
    </client-only>
  </n-space>
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui';

const { createTags } = useTags();

definePageMeta({
  layout: 'dashboard-layout',
});

interface RowData {
  key: string;
  subject: string;
  firstTerm: number[];
  firstTermGrade: number;
  secondTerm: number[];
  secondTermGrade: number;
  yearlyGrade: number;
}

//Methods

const createColumns = (): DataTableColumns<RowData> => {
  return [
    {
      title: 'Subject',
      key: 'subject',
    },
    {
      title: 'Term I',
      key: 'firstTerm',
      render(row) {
        return createTags(row.firstTerm);
      },
    },
    {
      title: 'Term I Grade',
      key: 'firstTermGrade',
      render(row) {
        return createTags(row.firstTermGrade);
      },
    },
    {
      title: 'Term II',
      key: 'secondTerm',
      render(row) {
        return createTags(row.secondTerm);
      },
    },
    {
      title: 'Term II Grade',
      key: 'secondTermGrade',
      render(row) {
        return createTags(row.secondTermGrade);
      },
    },
    {
      title: 'Year Grade',
      key: 'yearlyGrade',
      render(row) {
        return createTags(row.yearlyGrade);
      },
    },
  ];
};

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

// Variables
const columns = createColumns();
const data = generateData();
</script>

<style>
.n-statistic .n-statistic__label {
  color: var(--n-value-suffix-text-color);
  font-size: 1.125rem;
}

.n-statistic-value {
  display: flex;
  align-items: center;
}

.n-statistic .n-statistic-value .n-statistic-value__prefix {
  margin-right: 0.5rem;
  font-size: 1.5rem;
}

.n-statistic .n-statistic-value .n-statistic-value__suffix {
  font-size: 1.5rem;
}

.n-data-table:not(.n-data-table--single-line) .n-data-table-td {
  font-size: 1.25rem;
}
</style>
