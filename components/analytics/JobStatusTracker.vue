<!-- components/analytics/JobStatusTracker.vue -->
<template>
  <div class="space-y-4">
    <div
      v-for="job in jobs"
      :key="job.id"
      class="border border-border rounded-lg p-4 bg-card"
    >
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <Icon
              :name="getStatusIcon(job.status)"
              :class="getStatusColor(job.status)"
              class="text-xl"
            />
          </div>

          <div>
            <h4 class="text-sm font-medium text-text-primary">
              {{ job.reportType }} Report - {{ job.institutionName }}
            </h4>
            <div
              class="flex items-center space-x-4 text-xs text-text-secondary mt-1"
            >
              <span>{{ formatJobPeriod(job) }}</span>
              <span>Scheduled: {{ formatDateTime(job.scheduledFor) }}</span>
              <span v-if="job.startedAt"
                >Running for: {{ getDuration(job.startedAt) }}</span
              >
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <n-tag :type="getStatusTagType(job.status)" size="small">
            {{ job.status }}
          </n-tag>

          <n-dropdown
            :options="getJobActions(job)"
            @select="handleJobAction($event, job)"
          >
            <n-button quaternary circle size="small">
              <template #icon>
                <Icon name="ph:dots-three-vertical" />
              </template>
            </n-button>
          </n-dropdown>
        </div>
      </div>

      <!-- Progress Bar -->
      <div
        v-if="job.status === 'Running' && job.progress !== undefined"
        class="mb-3"
      >
        <div
          class="flex items-center justify-between text-xs text-text-secondary mb-1"
        >
          <span>Progress</span>
          <span>{{ job.progress }}%</span>
        </div>
        <n-progress :percentage="job.progress" :show-indicator="false" />
      </div>

      <!-- Running Animation for Jobs without Progress -->
      <div v-else-if="job.status === 'Running'" class="mb-3">
        <div class="flex items-center text-xs text-text-secondary mb-1">
          <Icon name="ph:spinner" class="animate-spin mr-1" />
          <span>Processing...</span>
        </div>
        <n-progress
          :percentage="undefined"
          :show-indicator="false"
          processing
        />
      </div>

      <!-- Error Message -->
      <div v-if="job.status === 'Failed' && job.errorMessage" class="mt-2">
        <n-alert type="error" size="small">
          {{ job.errorMessage }}
        </n-alert>
      </div>

      <!-- Pending Message -->
      <div v-if="job.status === 'Pending'" class="mt-2">
        <n-alert type="info" size="small">
          <template #icon>
            <Icon name="ph:clock" />
          </template>
          This report is queued for processing. It will start automatically.
        </n-alert>
      </div>
    </div>

    <div v-if="jobs.length === 0" class="text-center py-8">
      <Icon name="ph:clock" class="text-3xl text-text-secondary mb-2" />
      <p class="text-sm text-text-secondary">No active report jobs</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NTag,
  NProgress,
  NAlert,
  NButton,
  NDropdown,
  type DropdownOption,
} from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsFormatters } from '~/composables/useAnalyticsPolling';
import type { ReportJobDto } from '~/stores/analytics';

interface Props {
  jobs: ReportJobDto[];
}

interface Emits {
  (e: 'job-cancelled', jobId: string): void;
  (e: 'job-retry', jobId: string): void;
  (e: 'job-updated', job: ReportJobDto): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const { formatDateTime, formatDuration } = useAnalyticsFormatters();

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'ph:clock';
    case 'Running':
      return 'ph:spinner';
    case 'Completed':
      return 'ph:check-circle';
    case 'Failed':
      return 'ph:x-circle';
    default:
      return 'ph:question';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'text-warning';
    case 'Running':
      return 'text-info animate-spin';
    case 'Completed':
      return 'text-success';
    case 'Failed':
      return 'text-error';
    default:
      return 'text-text-secondary';
  }
};

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'Running':
      return 'info';
    case 'Completed':
      return 'success';
    case 'Failed':
      return 'error';
    default:
      return 'default';
  }
};

const formatJobPeriod = (job: ReportJobDto) => {
  return `${job.periodType} Period`;
};

const getDuration = (startTime: string) => {
  return formatDuration(startTime);
};

const getJobActions = (job: ReportJobDto): DropdownOption[] => {
  const actions: DropdownOption[] = [];

  if (job.status === 'Running' || job.status === 'Pending') {
    actions.push({
      label: 'Cancel Job',
      key: 'cancel',
      icon: () => h(Icon, { name: 'ph:x' }),
    });
  }

  if (job.status === 'Failed') {
    actions.push({
      label: 'Retry Job',
      key: 'retry',
      icon: () => h(Icon, { name: 'ph:arrow-clockwise' }),
    });
  }

  return actions;
};

const handleJobAction = (key: string, job: ReportJobDto) => {
  console.log('📋 Job action in tracker:', key, 'for job:', job.id);

  switch (key) {
    case 'cancel':
      emit('job-cancelled', job.id);
      break;
    case 'retry':
      emit('job-retry', job.id);
      break;
  }
};
</script>
