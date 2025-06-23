<!-- pages/analytics/reports.vue -->
<template>
  <div class="p-6 space-y-6">
    <!-- Debug Panel (Remove in production) -->
    <div
      v-if="showDebug"
      class="border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg"
    >
      <h4 class="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
        🐛 Debug Information
      </h4>
      <div class="text-sm space-y-1 text-yellow-700 dark:text-yellow-300">
        <p><strong>Current Institution:</strong> {{ currentInstitutionId }}</p>
        <p><strong>Total Jobs:</strong> {{ reportJobs.length }}</p>
        <p><strong>Active Jobs:</strong> {{ activeJobs.length }}</p>
        <p><strong>Completed Jobs:</strong> {{ completedJobs.length }}</p>
        <p><strong>Failed Jobs:</strong> {{ failedJobs.length }}</p>
        <p><strong>Loading Reports:</strong> {{ loadingReports }}</p>
        <p>
          <strong>Loading Report Jobs:</strong>
          {{ analyticsStore.loadingReportJobs }}
        </p>
        <p>
          <strong>Loading Operations:</strong>
          {{ analyticsStore.loadingJobOperations }}
        </p>
        <details class="mt-2">
          <summary class="cursor-pointer font-medium">
            View Raw Jobs Data
          </summary>
          <pre
            class="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40"
            >{{ JSON.stringify(reportJobs, null, 2) }}</pre
          >
        </details>
      </div>
      <button
        @click="showDebug = false"
        class="mt-2 px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded text-xs"
      >
        Hide Debug
      </button>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-text-primary mb-2">
          Analytics Reports
        </h2>
        <p class="text-text-secondary">
          Generate and manage detailed analytics reports
        </p>
      </div>

      <div class="flex items-center space-x-3">
        <n-button quaternary size="small" @click="showDebug = !showDebug">
          🐛 Debug
        </n-button>

        <n-button
          quaternary
          :loading="loadingReports || analyticsStore.loadingReportJobs"
          @click="refreshReports"
        >
          <template #icon>
            <Icon name="ph:arrow-clockwise" />
          </template>
          Refresh
        </n-button>
      </div>
    </div>

    <!-- Job Status Cards - Always show if we have ANY jobs -->
    <div
      v-if="reportJobs.length > 0"
      class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
    >
      <!-- Active Jobs Card -->
      <n-card
        size="small"
        :class="activeJobs.length > 0 ? 'border-l-4 border-l-blue-500' : ''"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-text-secondary">Active Jobs</p>
            <p class="text-2xl font-bold text-blue-600">
              {{ activeJobs.length }}
            </p>
          </div>
          <Icon
            name="ph:spinner"
            class="text-xl text-blue-500"
            :class="{ 'animate-spin': activeJobs.length > 0 }"
          />
        </div>
      </n-card>

      <!-- Completed Jobs Card -->
      <n-card
        size="small"
        :class="completedJobs.length > 0 ? 'border-l-4 border-l-green-500' : ''"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-text-secondary">Completed</p>
            <p class="text-2xl font-bold text-green-600">
              {{ completedJobs.length }}
            </p>
          </div>
          <Icon name="ph:check-circle" class="text-xl text-green-500" />
        </div>
      </n-card>

      <!-- Failed Jobs Card -->
      <n-card
        size="small"
        :class="failedJobs.length > 0 ? 'border-l-4 border-l-red-500' : ''"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-text-secondary">Failed</p>
            <p class="text-2xl font-bold text-red-600">
              {{ failedJobs.length }}
            </p>
          </div>
          <Icon name="ph:x-circle" class="text-xl text-red-500" />
        </div>
      </n-card>

      <!-- Total Jobs Card -->
      <n-card size="small">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-text-secondary">Total Jobs</p>
            <p class="text-2xl font-bold text-text-primary">
              {{ reportJobs.length }}
            </p>
          </div>
          <Icon name="ph:file-text" class="text-xl text-text-secondary" />
        </div>
      </n-card>
    </div>

    <!-- Job Status Summary -->
    <div v-if="reportJobs.length > 0" class="mb-6">
      <n-alert type="info" size="small">
        <template #icon>
          <Icon name="ph:info" />
        </template>
        <div class="flex items-center gap-4 text-sm">
          <span>Status Summary:</span>
          <span v-if="jobStatusSummary.pending > 0">
            {{ jobStatusSummary.pending }} Pending
          </span>
          <span v-if="jobStatusSummary.running > 0">
            {{ jobStatusSummary.running }} Running
          </span>
          <span v-if="jobStatusSummary.completed > 0">
            {{ jobStatusSummary.completed }} Completed
          </span>
          <span v-if="jobStatusSummary.failed > 0">
            {{ jobStatusSummary.failed }} Failed
          </span>
          <span v-if="jobStatusSummary.cancelled > 0">
            {{ jobStatusSummary.cancelled }} Cancelled
          </span>
        </div>
      </n-alert>
    </div>

    <!-- Active Jobs Tracker - Show if there are active jobs -->
    <div v-if="activeJobs.length > 0">
      <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
        <Icon name="ph:spinner" class="animate-spin" />
        Active Report Jobs ({{ activeJobs.length }})
      </h3>
      <div class="space-y-3">
        <n-card
          v-for="job in activeJobs"
          :key="job.id"
          size="small"
          class="border-l-4 border-l-blue-500"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <Icon name="ph:spinner" class="animate-spin text-blue-500" />
                <span class="font-medium"
                  >{{ job.reportType }} - {{ job.institutionName }}</span
                >
                <n-tag type="info" size="small">{{ job.status }}</n-tag>
              </div>
              <div class="text-xs text-text-secondary">
                Started: {{ formatDateTime(job.startedAt || job.scheduledFor) }}
              </div>
              <div v-if="job.progress !== undefined" class="mt-2">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{{ job.progress }}%</span>
                </div>
                <n-progress
                  :percentage="job.progress"
                  :show-indicator="false"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <n-button
                v-if="analyticsStore.canCancelJob(job.id)"
                size="small"
                type="error"
                quaternary
                :loading="analyticsStore.loadingCancel"
                @click="handleCancelJob(job.id)"
              >
                Cancel
              </n-button>
            </div>
          </div>
        </n-card>
      </div>
    </div>

    <!-- Reports Tabs -->
    <n-tabs v-model:value="activeTab" type="line" animated size="large">
      <!-- Generate New Report Tab -->
      <n-tab-pane name="generate" tab="Generate Report">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:plus-circle" />
            Generate Report
          </div>
        </template>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Report Generator -->
          <div class="lg:col-span-2">
            <n-card title="Create New Report">
              <div class="space-y-4">
                <!-- Report Type Selection -->
                <div>
                  <label class="block text-sm font-medium mb-2"
                    >Report Type</label
                  >
                  <n-select
                    v-model:value="reportForm.reportType"
                    :options="reportTypeOptions"
                    placeholder="Select report type"
                  />
                </div>

                <!-- Period Type Selection -->
                <div>
                  <label class="block text-sm font-medium mb-2"
                    >Period Type</label
                  >
                  <n-select
                    v-model:value="reportForm.periodType"
                    :options="periodTypeOptions"
                    placeholder="Select period"
                  />
                </div>

                <!-- Date Range (Optional) -->
                <div>
                  <label class="block text-sm font-medium mb-2"
                    >Date Range (Optional)</label
                  >
                  <n-date-picker
                    v-model:value="reportForm.dateRange"
                    type="daterange"
                    clearable
                    placeholder="Select custom date range"
                  />
                </div>

                <!-- Options -->
                <div class="space-y-2">
                  <n-checkbox v-model:checked="reportForm.includeAIInsights">
                    Include AI Insights
                  </n-checkbox>
                  <n-checkbox
                    v-model:checked="reportForm.generateRecommendations"
                  >
                    Generate Recommendations
                  </n-checkbox>
                </div>

                <!-- Generate Button -->
                <n-button
                  type="primary"
                  block
                  :loading="analyticsStore.loadingReports"
                  :disabled="!canGenerateReport"
                  @click="handleGenerateReport"
                >
                  <template #icon>
                    <Icon name="ph:play" />
                  </template>
                  Generate Report
                </n-button>
              </div>
            </n-card>
          </div>

          <!-- Quick Templates -->
          <div>
            <n-card title="Quick Templates">
              <div class="space-y-3">
                <div
                  v-for="template in reportTemplates"
                  :key="template.id"
                  class="border border-border rounded-lg p-3 hover:bg-background-hover cursor-pointer transition-colors"
                  @click="handleTemplateGenerate(template)"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <Icon :name="template.icon" class="text-primary" />
                    <span class="font-medium">{{ template.name }}</span>
                  </div>
                  <p class="text-xs text-text-secondary">
                    {{ template.description }}
                  </p>
                </div>
              </div>
            </n-card>
          </div>
        </div>
      </n-tab-pane>

      <!-- Report History Tab -->
      <n-tab-pane name="history" tab="Report History">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:clock-clockwise" />
            History
            <n-badge
              v-if="reportJobs.length > 0"
              :value="reportJobs.length"
              :max="99"
              type="info"
            />
          </div>
        </template>

        <!-- Filters -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <n-select
              v-model:value="historyFilters.status"
              placeholder="Filter by status"
              :options="statusFilterOptions"
              clearable
            >
              <template #prefix>
                <Icon name="ph:funnel" />
              </template>
            </n-select>

            <n-select
              v-model:value="historyFilters.reportType"
              placeholder="Filter by type"
              :options="typeFilterOptions"
              clearable
            >
              <template #prefix>
                <Icon name="ph:file-text" />
              </template>
            </n-select>

            <n-date-picker
              v-model:value="historyFilters.dateRange"
              type="daterange"
              clearable
              placeholder="Date range"
            />

            <n-input
              v-model:value="historyFilters.search"
              placeholder="Search reports..."
              clearable
            >
              <template #prefix>
                <Icon name="ph:magnifying-glass" />
              </template>
            </n-input>
          </div>
        </div>

        <!-- Reports Table/List -->
        <n-card>
          <div
            v-if="loadingReports || analyticsStore.loadingReportJobs"
            class="text-center py-8"
          >
            <Icon
              name="ph:spinner"
              class="text-3xl text-text-secondary mb-2 animate-spin"
            />
            <p class="text-sm text-text-secondary">Loading reports...</p>
          </div>

          <div
            v-else-if="filteredReports.length === 0"
            class="text-center py-8"
          >
            <Icon name="ph:file-x" class="text-3xl text-text-secondary mb-2" />
            <p class="text-sm text-text-secondary">
              {{
                reportJobs.length === 0
                  ? 'No reports found'
                  : 'No reports match your filters'
              }}
            </p>
            <n-button
              v-if="reportJobs.length === 0"
              type="primary"
              @click="activeTab = 'generate'"
              class="mt-3"
            >
              Generate Your First Report
            </n-button>
          </div>

          <div v-else class="space-y-4">
            <!-- Report Items -->
            <div
              v-for="report in filteredReports"
              :key="report.id"
              class="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3 flex-1">
                  <div class="flex-shrink-0">
                    <Icon
                      :name="getStatusIcon(report.status)"
                      :class="getStatusColor(report.status)"
                      class="text-xl"
                    />
                  </div>

                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-text-primary">
                      {{ report.reportType }} Report -
                      {{ report.institutionName }}
                    </h4>
                    <div
                      class="flex items-center space-x-4 text-xs text-text-secondary mt-1"
                    >
                      <span>{{ report.periodType }} Period</span>
                      <span
                        >Scheduled:
                        {{ formatDateTime(report.scheduledFor) }}</span
                      >
                      <span v-if="report.startedAt">
                        Started: {{ formatDateTime(report.startedAt) }}
                      </span>
                      <span v-if="report.completedAt">
                        Completed: {{ formatDateTime(report.completedAt) }}
                      </span>
                      <span
                        v-if="
                          report.status === 'Running' ||
                          report.status === 'Pending'
                        "
                      >
                        Duration:
                        {{
                          formatDuration(
                            report.startedAt || report.scheduledFor
                          )
                        }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <n-tag :type="getStatusTagType(report.status)" size="small">
                    {{ report.status }}
                  </n-tag>

                  <n-dropdown
                    :options="getJobActions(report)"
                    @select="handleJobAction($event, report)"
                  >
                    <n-button quaternary circle size="small">
                      <template #icon>
                        <Icon name="ph:dots-three-vertical" />
                      </template>
                    </n-button>
                  </n-dropdown>
                </div>
              </div>

              <!-- Progress Bar for Running Jobs -->
              <div
                v-if="
                  report.status === 'Running' && report.progress !== undefined
                "
                class="mt-3"
              >
                <div
                  class="flex items-center justify-between text-xs text-text-secondary mb-1"
                >
                  <span>Progress</span>
                  <span>{{ report.progress }}%</span>
                </div>
                <n-progress
                  :percentage="report.progress"
                  :show-indicator="false"
                />
              </div>

              <!-- Error Message for Failed Jobs -->
              <div
                v-if="report.status === 'Failed' && report.errorMessage"
                class="mt-3"
              >
                <n-alert type="error" size="small">
                  {{ report.errorMessage }}
                </n-alert>
              </div>

              <!-- Success Message for Completed Jobs -->
              <div v-if="report.status === 'Completed'" class="mt-3">
                <n-alert type="success" size="small">
                  <template #icon>
                    <Icon name="ph:check-circle" />
                  </template>
                  Report generated successfully and is ready for download.
                </n-alert>
              </div>
            </div>
          </div>
        </n-card>
      </n-tab-pane>

      <!-- Scheduled Reports Tab -->
      <n-tab-pane name="scheduled" tab="Scheduled">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:calendar" />
            Scheduled
          </div>
        </template>

        <div class="text-center py-12">
          <Icon
            name="ph:calendar-plus"
            class="text-6xl text-text-secondary mb-4"
          />
          <h3 class="text-lg font-medium text-text-primary mb-2">
            Scheduled Reports
          </h3>
          <p class="text-text-secondary mb-4">
            Automated report scheduling will be available in a future update
          </p>
          <n-button type="primary" disabled>
            <template #icon>
              <Icon name="ph:plus" />
            </template>
            Schedule Report
          </n-button>
        </div>
      </n-tab-pane>
    </n-tabs>

    <!-- Report Preview Modal -->
    <n-modal
      v-model:show="showPreviewModal"
      preset="card"
      style="width: 90%; max-width: 1200px; max-height: 90vh"
      title="Report Preview"
      :closable="true"
      :mask-closable="true"
    >
      <div v-if="selectedReport" class="space-y-4">
        <div class="text-center">
          <h3 class="text-lg font-medium">
            {{ selectedReport.reportType }} Report
          </h3>
          <p class="text-sm text-text-secondary">
            {{ selectedReport.institutionName }}
          </p>
        </div>

        <div class="flex justify-center gap-3">
          <n-button
            type="primary"
            :loading="analyticsStore.loadingDownload"
            @click="handleDownloadReport(selectedReport, 'pdf')"
          >
            <template #icon>
              <Icon name="ph:download" />
            </template>
            Download PDF
          </n-button>

          <n-button
            :loading="analyticsStore.loadingDownload"
            @click="handleDownloadReport(selectedReport, 'xlsx')"
          >
            <template #icon>
              <Icon name="ph:download" />
            </template>
            Download Excel
          </n-button>
        </div>

        <div class="text-center text-sm text-text-secondary">
          Report preview functionality will be available in a future update
        </div>
      </div>
    </n-modal>

    <!-- Delete Confirmation -->
    <n-modal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      type="error"
      title="Delete Report"
      positive-text="Delete"
      negative-text="Cancel"
      :loading="analyticsStore.loadingDelete"
      @positive-click="confirmDelete"
      @negative-click="cancelDelete"
    >
      <template #icon>
        <Icon name="ph:warning-diamond" class="text-red-500" />
      </template>
      <p>
        Are you sure you want to delete this report? This action cannot be
        undone.
      </p>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, h } from 'vue';
import {
  NTabs,
  NTabPane,
  NCard,
  NButton,
  NBadge,
  NSelect,
  NDatePicker,
  NInput,
  NModal,
  NTag,
  NProgress,
  NAlert,
  NDropdown,
  NCheckbox,
  useMessage,
  type DropdownOption,
} from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsStore, type ReportJobDto } from '~/stores/analytics';
import {
  useReportPolling,
  useReportJobs,
  useAnalyticsNotifications,
  useAnalyticsFormatters,
} from '~/composables/useAnalyticsPolling';

// Stores and composables
const analyticsStore = useAnalyticsStore();
const institutionStore = useInstitutionStore();
const message = useMessage();

// Use the enhanced composables
const { startPolling } = useReportPolling();
const {
  downloadReport,
  cancelJob,
  retryJob,
  deleteJob,
  refreshJobs,
  generateReport,
} = useReportJobs();
const { showSuccessNotification, handleApiError } = useAnalyticsNotifications();
const { formatDateTime, formatDuration } = useAnalyticsFormatters();

// State
const activeTab = ref('history'); // Start with history to see existing reports
const showPreviewModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedReport = ref<ReportJobDto | null>(null);
const reportToDelete = ref<string | null>(null);
const showDebug = ref(true); // Show debug by default

// Report generation form
const reportForm = ref({
  reportType: 'InstitutionAnalytics',
  periodType: 'Quarterly',
  dateRange: null as [number, number] | null,
  includeAIInsights: true,
  generateRecommendations: true,
});

// Filters for history
const historyFilters = ref({
  status: null as string | null,
  reportType: null as string | null,
  dateRange: null as [number, number] | null,
  search: '',
});

// Computed
const reportJobs = computed(() => {
  console.log(
    '🔄 Computing reportJobs, length:',
    analyticsStore.reportJobs.length
  );
  return analyticsStore.reportJobs;
});

const loadingReports = computed(() => analyticsStore.loadingReports);
const currentInstitutionId = computed(
  () => institutionStore.activeInstitution?.id
);

const activeJobs = computed(() => {
  const jobs = analyticsStore.activeJobs;
  console.log('🔄 Computing activeJobs:', jobs.length);
  return jobs;
});

const completedJobs = computed(() => {
  const jobs = analyticsStore.completedJobs;
  console.log('✅ Computing completedJobs:', jobs.length);
  return jobs;
});

const failedJobs = computed(() => {
  const jobs = analyticsStore.failedJobs;
  console.log('❌ Computing failedJobs:', jobs.length);
  return jobs;
});

const jobStatusSummary = computed(() => analyticsStore.getJobStatusSummary);

const canGenerateReport = computed(() => {
  return !!(
    currentInstitutionId.value &&
    reportForm.value.reportType &&
    reportForm.value.periodType
  );
});

const filteredReports = computed(() => {
  let filtered = [...reportJobs.value];
  console.log('🔍 Filtering reports, starting with:', filtered.length);

  // Filter by status
  if (historyFilters.value.status) {
    filtered = filtered.filter(
      (report) => report.status === historyFilters.value.status
    );
    console.log('🔍 After status filter:', filtered.length);
  }

  // Filter by type
  if (historyFilters.value.reportType) {
    filtered = filtered.filter(
      (report) => report.reportType === historyFilters.value.reportType
    );
    console.log('🔍 After type filter:', filtered.length);
  }

  // Filter by date range
  if (historyFilters.value.dateRange) {
    const [start, end] = historyFilters.value.dateRange;
    filtered = filtered.filter((report) => {
      const reportDate = new Date(report.scheduledFor).getTime();
      return reportDate >= start && reportDate <= end;
    });
    console.log('🔍 After date filter:', filtered.length);
  }

  // Filter by search
  if (historyFilters.value.search) {
    const search = historyFilters.value.search.toLowerCase();
    filtered = filtered.filter(
      (report) =>
        report.institutionName.toLowerCase().includes(search) ||
        report.reportType.toLowerCase().includes(search)
    );
    console.log('🔍 After search filter:', filtered.length);
  }

  // Sort by scheduled date (newest first)
  const sorted = filtered.sort(
    (a, b) =>
      new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime()
  );

  console.log('🔍 Final filtered reports:', sorted.length);
  return sorted;
});

// Options
const reportTypeOptions = [
  { label: 'Institution Analytics', value: 'InstitutionAnalytics' },
  { label: 'Market Analytics', value: 'MarketAnalytics' },
  { label: 'Comparative Analytics', value: 'ComparativeAnalytics' },
];

const periodTypeOptions = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Semester', value: 'Semester' },
  { label: 'Yearly', value: 'Yearly' },
];

const statusFilterOptions = [
  { label: 'Completed', value: 'Completed' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Running', value: 'Running' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Cancelled', value: 'Cancelled' },
];

const typeFilterOptions = reportTypeOptions;

// Report templates
const reportTemplates = ref([
  {
    id: 'quarterly-overview',
    name: 'Quarterly Overview',
    description: 'Comprehensive quarterly performance report',
    icon: 'ph:chart-line',
    config: {
      reportType: 'InstitutionAnalytics',
      periodType: 'Quarterly',
      includeAIInsights: true,
      generateRecommendations: true,
    },
  },
  {
    id: 'yearly-report',
    name: 'Annual Report',
    description: 'Complete yearly performance analysis',
    icon: 'ph:calendar',
    config: {
      reportType: 'InstitutionAnalytics',
      periodType: 'Yearly',
      includeAIInsights: true,
      generateRecommendations: true,
    },
  },
  {
    id: 'market-analysis',
    name: 'Market Analysis',
    description: 'Current market trends and comparisons',
    icon: 'ph:trend-up',
    config: {
      reportType: 'MarketAnalytics',
      periodType: 'Quarterly',
      includeAIInsights: true,
      generateRecommendations: false,
    },
  },
]);

// Helper methods
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
    case 'Cancelled':
      return 'ph:stop-circle';
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
    case 'Cancelled':
      return 'text-text-secondary';
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
    case 'Cancelled':
      return 'default';
    default:
      return 'default';
  }
};

const getJobActions = (job: ReportJobDto): DropdownOption[] => {
  const actions: DropdownOption[] = [];

  if (analyticsStore.canCancelJob(job.id)) {
    actions.push({
      label: 'Cancel Job',
      key: 'cancel',
      icon: () => h(Icon, { name: 'ph:x' }),
    });
  }

  if (analyticsStore.canRetryJob(job.id)) {
    actions.push({
      label: 'Retry Job',
      key: 'retry',
      icon: () => h(Icon, { name: 'ph:arrow-clockwise' }),
    });
  }

  if (analyticsStore.canDownloadJob(job.id)) {
    actions.push({
      label: 'Download PDF',
      key: 'download-pdf',
      icon: () => h(Icon, { name: 'ph:download' }),
    });
    actions.push({
      label: 'Download Excel',
      key: 'download-xlsx',
      icon: () => h(Icon, { name: 'ph:download' }),
    });
    actions.push({
      label: 'View Report',
      key: 'view',
      icon: () => h(Icon, { name: 'ph:eye' }),
    });
  }

  actions.push({
    label: 'Delete',
    key: 'delete',
    icon: () => h(Icon, { name: 'ph:trash' }),
  });

  return actions;
};

// Methods
const refreshReports = async () => {
  try {
    console.log('🔄 Refreshing reports...');
    await refreshJobs();
  } catch (error) {
    // Error handling is done in the composable
  }
};

const handleGenerateReport = async () => {
  if (!currentInstitutionId.value) {
    message.error('No active institution selected');
    return;
  }

  try {
    const request = {
      institutionId: currentInstitutionId.value,
      periodType: reportForm.value.periodType,
      includeAIInsights: reportForm.value.includeAIInsights,
      generateRecommendations: reportForm.value.generateRecommendations,
      ...(reportForm.value.dateRange && {
        fromDate: new Date(reportForm.value.dateRange[0]).toISOString(),
        toDate: new Date(reportForm.value.dateRange[1]).toISOString(),
      }),
    };

    const job = await generateReport(request);
    handleReportGenerated(job);
  } catch (error) {
    // Error handling is done in the composable
  }
};

const handleTemplateGenerate = async (template: any) => {
  if (!currentInstitutionId.value) {
    message.error('No active institution selected');
    return;
  }

  try {
    console.log('📋 Generating template report:', template);
    const job = await generateReport({
      institutionId: currentInstitutionId.value,
      ...template.config,
    });

    handleReportGenerated(job);
  } catch (error) {
    // Error handling is done in the composable
  }
};

const handleReportGenerated = (job: ReportJobDto) => {
  console.log('🚀 Report generation started:', job);
  startPolling(job.id);
  activeTab.value = 'history';
};

const handleCancelJob = async (jobId: string) => {
  try {
    await cancelJob(jobId);
  } catch (error) {
    // Error handling is done in the composable
  }
};

const handleRetryJob = async (jobId: string) => {
  try {
    const job = await retryJob(jobId);
    if (job) {
      startPolling(job.id);
    }
  } catch (error) {
    // Error handling is done in the composable
  }
};

const handleJobAction = async (key: string, job: ReportJobDto) => {
  console.log('🔧 Job action:', key, 'for job:', job.id);

  switch (key) {
    case 'cancel':
      await handleCancelJob(job.id);
      break;
    case 'retry':
      await handleRetryJob(job.id);
      break;
    case 'download-pdf':
      await handleDownloadReport(job, 'pdf');
      break;
    case 'download-xlsx':
      await handleDownloadReport(job, 'xlsx');
      break;
    case 'view':
      handleViewReport(job);
      break;
    case 'delete':
      handleDeleteReport(job.id);
      break;
  }
};

const handleDownloadReport = async (
  report: ReportJobDto,
  format: string = 'pdf'
) => {
  if (!analyticsStore.canDownloadJob(report.id)) {
    message.warning('Report is not ready for download');
    return;
  }
  console.log('Downloading from reports page with id', report.reportId)
  console.log('Report:', report)
  try {
    await downloadReport(report.id, format, report.reportId);
  } catch (error) {
    // Error handling is done in the composable
  }
};

const handleViewReport = (report: ReportJobDto) => {
  console.log('👁️ Viewing report:', report.id);
  selectedReport.value = report;
  showPreviewModal.value = true;
};

const handleDeleteReport = (reportId: string) => {
  console.log('🗑️ Initiating delete for report:', reportId);
  reportToDelete.value = reportId;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!reportToDelete.value) return;

  try {
    await deleteJob(reportToDelete.value);
  } catch (error) {
    // Error handling is done in the composable
  } finally {
    showDeleteConfirm.value = false;
    reportToDelete.value = null;
  }
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  reportToDelete.value = null;
};

// Initialize
onMounted(async () => {
  console.log('🚀 Reports page mounted');
  console.log('🏢 Current institution:', currentInstitutionId.value);
  console.log('📋 Current report jobs:', reportJobs.value.length);

  if (!reportJobs.value.length) {
    console.log('📋 No report jobs found, fetching...');
    await refreshReports();
  }
});

// Watch for active jobs and start polling
watch(
  activeJobs,
  (newActiveJobs, oldActiveJobs) => {
    console.log('👁️ Active jobs changed:', newActiveJobs.length, 'jobs');
    newActiveJobs.forEach((job) => {
      if (!oldActiveJobs?.find((oldJob) => oldJob.id === job.id)) {
        console.log('🔄 Starting polling for new active job:', job.id);
        startPolling(job.id);
      }
    });
  },
  { immediate: true }
);

// Watch for institution changes
watch(currentInstitutionId, (newId, oldId) => {
  console.log('🏢 Institution changed from', oldId, 'to', newId);
  if (newId && newId !== oldId) {
    refreshReports();
  }
});

// SEO
useHead({
  title: 'Analytics Reports',
  meta: [
    {
      name: 'description',
      content:
        'Generate, manage and download comprehensive analytics reports for your institution.',
    },
  ],
});

definePageMeta({
  layout: 'default',
});
</script>
