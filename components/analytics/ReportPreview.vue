<!-- components/analytics/ReportPreview.vue -->
<template>
  <div class="space-y-6">
    <!-- Report Header -->
    <div class="border-b border-border pb-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-text-primary">
            {{ report.reportType }} Report
          </h3>
          <p class="text-sm text-text-secondary mt-1">
            {{ report.institutionName }} • {{ report.periodType }} Period
          </p>
        </div>

        <div class="flex items-center space-x-2">
          <n-button @click="$emit('download', report)">
            <template #icon>
              <Icon name="ph:download" />
            </template>
            Download PDF
          </n-button>

          <n-button quaternary @click="$emit('close')"> Close </n-button>
        </div>
      </div>
    </div>

    <!-- Report Metadata -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="space-y-1">
        <div class="text-xs text-text-secondary">Generated</div>
        <div class="text-sm font-medium text-text-primary">
          {{ formatDateTime(report.completedAt!) }}
        </div>
      </div>

      <div class="space-y-1">
        <div class="text-xs text-text-secondary">Duration</div>
        <div class="text-sm font-medium text-text-primary">
          {{ formatDuration(report.startedAt!, report.completedAt!) }}
        </div>
      </div>

      <div class="space-y-1">
        <div class="text-xs text-text-secondary">Status</div>
        <n-tag :type="getStatusTagType(report.status)" size="small">
          {{ report.status }}
        </n-tag>
      </div>

      <div class="space-y-1">
        <div class="text-xs text-text-secondary">Report ID</div>
        <div class="text-xs font-mono text-text-primary">
          {{ report.id.substring(0, 8) }}...
        </div>
      </div>
    </div>

    <!-- Report Preview Content -->
    <div class="bg-background-soft rounded-lg p-6 min-h-96">
      <div class="text-center py-12">
        <Icon name="ph:file-pdf" class="text-6xl text-error mb-4" />
        <h4 class="text-lg font-medium text-text-primary mb-2">
          PDF Report Preview
        </h4>
        <p class="text-text-secondary mb-4">
          Full report preview will be available in the next update
        </p>
        <n-button type="primary" @click="$emit('download', report)">
          Download to View Full Report
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NTag } from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsFormatters } from '~/composables/useAnalyticsPolling';
import type { ReportJobDto } from '~/stores/analytics';

interface Props {
  report: ReportJobDto;
}

interface Emits {
  (e: 'download', report: ReportJobDto): void;
  (e: 'close'): void;
}

defineProps<Props>();
defineEmits<Emits>();

const { formatDateTime, formatDuration } = useAnalyticsFormatters();

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
