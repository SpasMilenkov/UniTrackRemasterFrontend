<!-- components/analytics/AnalyticsPeerComparisonTable.vue -->
<template>
  <div class="peer-comparison-table">
    <n-data-table
      :columns="columns"
      :data="tableData"
      :pagination="false"
      :row-key="(row: any) => row.institutionId"
      size="small"
      class="rounded-lg"
    >
      <template #empty>
        <div class="text-center py-8">
          <Icon
            name="ph:users"
            class="text-4xl text-text-secondary mb-2 mx-auto"
          />
          <p class="text-text-secondary">No peer institutions found</p>
        </div>
      </template>
    </n-data-table>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { NDataTable, NButton, NProgress, NTag } from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsFormatters } from '~/composables/useAnalyticsPolling';

interface Props {
  institutions: Array<{
    institutionId: string;
    name: string;
    score: number;
    similarity: number;
    type: string;
    keyMetrics: Record<string, number>;
  }>;
  currentInstitution: {
    institutionId: string;
    name: string;
    overallScore: number;
  };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  compare: [institution: Props['institutions'][0]];
}>();

const { formatScore, formatPercentage } = useAnalyticsFormatters();

const tableData = computed(() => [
  // Add current institution at top
  {
    institutionId: props.currentInstitution.institutionId,
    name: props.currentInstitution.name + ' (You)',
    score: props.currentInstitution.overallScore,
    similarity: 100,
    type: 'Current',
    keyMetrics: {},
    isCurrent: true,
  },
  // Add peer institutions
  ...props.institutions.map((inst) => ({
    ...inst,
    isCurrent: false,
  })),
]);

const columns = computed(() => [
  {
    title: 'Institution',
    key: 'name',
    width: 250,
    render(row: any) {
      return h('div', { class: 'flex items-center space-x-2' }, [
        h('div', {}, [
          h(
            'div',
            {
              class: row.isCurrent
                ? 'font-semibold text-primary'
                : 'font-medium',
            },
            row.name
          ),
          h('div', { class: 'text-xs text-text-secondary' }, row.type),
        ]),
      ]);
    },
  },
  {
    title: 'Overall Score',
    key: 'score',
    width: 120,
    render(row: any) {
      return h('div', { class: 'text-center' }, [
        h(
          'div',
          {
            class: row.isCurrent ? 'font-semibold text-primary' : 'font-medium',
          },
          formatScore(row.score)
        ),
        h('div', { class: 'text-xs text-text-secondary' }, '/100'),
      ]);
    },
  },
  {
    title: 'Similarity',
    key: 'similarity',
    width: 150,
    render(row: any) {
      if (row.isCurrent) {
        return h(NTag, { type: 'primary', size: 'small' }, () => 'Current');
      }

      return h('div', { class: 'space-y-1' }, [
        h(NProgress, {
          percentage: row.similarity,
          showIndicator: false,
          height: 6,
          color:
            row.similarity > 80
              ? '#10b981'
              : row.similarity > 60
                ? '#f59e0b'
                : '#6b7280',
        }),
        h(
          'div',
          { class: 'text-xs text-center text-text-secondary' },
          formatPercentage(row.similarity)
        ),
      ]);
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 100,
    render(row: any) {
      if (row.isCurrent) return null;

      return h(
        NButton,
        {
          size: 'tiny',
          quaternary: true,
          type: 'primary',
          onClick: () => emit('compare', row),
        },
        () => 'Compare'
      );
    },
  },
]);
</script>

<style scoped>
.peer-comparison-table :deep(.n-data-table-thead) {
  background-color: var(--n-merged-th-color);
}
</style>
