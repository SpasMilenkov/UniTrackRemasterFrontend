<template>
  <n-space vertical :size="12" class="min-h-screen md:px-6 px-2 py-4">
    <TitleComponent title="Good evening, Mihail" />
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 px-8 md:px-0"
    >
      <StatisticCardComponent
        icon="material-symbols:school-outline"
        label="Your average marks"
        :value="99"
        suffix="/ 100"
      />
      <StatisticCardComponent
        icon="ph:student"
        label="Class average marks"
        :value="99"
        suffix="/ 100"
      />
      <StatisticCardComponent
        icon="bx:bxs-school"
        label="School average marks"
        :value="99"
        suffix="/ 100"
      />
      <StatisticCardComponent
        icon="ph:calendar-x"
        label="Your absence count"
        :value="99"
        suffix="/ 100"
      />
      <StatisticCardComponent
        icon="ph:calendar-x"
        label="Class Average absence"
        :value="99"
        suffix="/ 100"
      />
      <StatisticCardComponent
        icon="ph:calendar-x"
        label="School Average absence"
        :value="99"
        suffix="/ 100"
      />
    </div>

    <!-- Your existing data table -->
    <client-only>
      <GradesTableComponent />
    </client-only>
  </n-space>
</template>

<script lang="ts" setup>
import TitleComponent from '~/components/TitleComponent.vue';
definePageMeta({
  layout: 'dashboard-layout',
});
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
