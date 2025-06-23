<!-- components/analytics/ComparisonTable.vue -->
<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-border">
          <th
            class="text-left py-3 px-4 text-sm font-medium text-text-secondary"
          >
            Metric
          </th>
          <th
            class="text-center py-3 px-4 text-sm font-medium text-text-secondary"
          >
            {{ institution1.name }}
          </th>
          <th
            class="text-center py-3 px-4 text-sm font-medium text-text-secondary"
          >
            {{ institution2.name }}
          </th>
          <th
            class="text-center py-3 px-4 text-sm font-medium text-text-secondary"
          >
            Difference
          </th>
          <th
            class="text-center py-3 px-4 text-sm font-medium text-text-secondary"
          >
            Winner
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in comparisonData"
          :key="index"
          class="border-b border-border hover:bg-background-soft"
        >
          <td class="py-3 px-4 text-sm font-medium text-text-primary">
            {{ item.metric }}
          </td>
          <td class="py-3 px-4 text-center">
            <span class="text-sm text-text-primary">{{
              item.institution1
            }}</span>
          </td>
          <td class="py-3 px-4 text-center">
            <span class="text-sm text-text-primary">{{
              item.institution2
            }}</span>
          </td>
          <td class="py-3 px-4 text-center">
            <span
              class="text-sm font-medium"
              :class="getDifferenceColor(item.difference)"
            >
              {{ formatDifference(item.difference) }}
            </span>
          </td>
          <td class="py-3 px-4 text-center">
            <n-tag
              :type="item.winner === 'institution1' ? 'success' : 'info'"
              size="small"
            >
              {{
                item.winner === 'institution1'
                  ? institution1.name
                  : institution2.name
              }}
            </n-tag>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui';
import type { InstitutionSummaryDto } from '~/stores/analytics';

interface ComparisonDataItem {
  metric: string;
  institution1: string;
  institution2: string;
  difference: string;
  winner: 'institution1' | 'institution2';
}

interface Props {
  institution1: InstitutionSummaryDto;
  institution2: InstitutionSummaryDto;
  comparisonData: ComparisonDataItem[];
}

defineProps<Props>();

const getDifferenceColor = (difference: string) => {
  const numDiff = parseFloat(difference);
  if (numDiff > 0) return 'text-success';
  if (numDiff < 0) return 'text-error';
  return 'text-text-secondary';
};

const formatDifference = (difference: string) => {
  const numDiff = parseFloat(difference);
  if (numDiff > 0) return `+${difference}`;
  return difference;
};
</script>




