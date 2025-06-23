<!-- components/analytics/ReportHistoryTable.vue -->
<template>
  <div>
    <n-data-table
      :columns="columns"
      :data="reports"
      :loading="loading"
      :pagination="{ pageSize: 10 }"
      :scroll-x="800"
    >
      <template #empty>
        <div class="text-center py-12">
          <Icon name="ph:file-text" class="text-4xl text-text-secondary mb-4" />
          <h3 class="text-lg font-medium text-text-primary mb-2">
            No Reports Yet
          </h3>
          <p class="text-text-secondary">
            Generated reports will appear here once completed
          </p>
        </div>
      </template>
    </n-data-table>
  </div>
</template>

<script setup lang="ts">
import { h, computed } from 'vue';
import {
  NDataTable,
  NButton,
  NTag,
  NSpace,
  type DataTableColumns,
} from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsFormatters } from '~/composables/useAnalyticsPolling';
import type { ReportJobDto } from '~/stores/analytics';

interface Props {
  reports: ReportJobDto[];
  loading: boolean;
}

interface Emits {
  (e: 'download-report', report: ReportJobDto): void;
  (e: 'delete-report', reportId: string): void;
  (e: 'view-report', report: ReportJobDto): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const { formatDateTime, formatDuration } = useAnalyticsFormatters();

const columns = computed(
  (): DataTableColumns<ReportJobDto> => [
    {
      title: 'Report',
      key: 'reportType',
      width: 200,
      render: (row) =>
        h('div', { class: 'space-y-1' }, [
          h('div', { class: 'font-medium text-text-primary' }, row.reportType),
          h(
            'div',
            { class: 'text-xs text-text-secondary' },
            row.institutionName
          ),
        ]),
    },
    {
      title: 'Period',
      key: 'periodType',
      width: 120,
      render: (row) =>
        h(
          NTag,
          { size: 'small', type: 'info' },
          { default: () => row.periodType }
        ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (row) =>
        h(
          NTag,
          {
            size: 'small',
            type: getStatusTagType(row.status),
          },
          { default: () => row.status }
        ),
    },
    {
      title: 'Generated',
      key: 'completedAt',
      width: 150,
      render: (row) =>
        row.completedAt ? formatDateTime(row.completedAt) : '-',
    },
    {
      title: 'Duration',
      key: 'duration',
      width: 100,
      render: (row) => {
        if (row.startedAt && row.completedAt) {
          return formatDuration(row.startedAt, row.completedAt);
        }
        return '-';
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (row) =>
        h(
          NSpace,
          { size: 'small' },
          {
            default: () =>
              [
                row.status === 'Completed'
                  ? h(
                      NButton,
                      {
                        quaternary: true,
                        size: 'small',
                        type: 'info',
                        onClick: () => emit('view-report', row),
                      },
                      {
                        icon: () => h(Icon, { name: 'ph:eye' }),
                        default: () => 'View',
                      }
                    )
                  : null,

                row.status === 'Completed'
                  ? h(
                      NButton,
                      {
                        quaternary: true,
                        size: 'small',
                        type: 'primary',
                        onClick: () => emit('download-report', row),
                      },
                      {
                        icon: () => h(Icon, { name: 'ph:download' }),
                        default: () => 'Download',
                      }
                    )
                  : null,

                h(
                  NButton,
                  {
                    quaternary: true,
                    size: 'small',
                    type: 'error',
                    onClick: () => emit('delete-report', row.id),
                  },
                  {
                    icon: () => h(Icon, { name: 'ph:trash' }),
                  }
                ),
              ].filter(Boolean),
          }
        ),
    },
  ]
);

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Failed':
      return 'error';
    default:
      return 'default';
  }
};
</script>
