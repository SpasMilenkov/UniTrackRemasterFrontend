<!-- components/analytics/AnalyticsReportModal.vue -->
<template>
  <n-modal
    v-model:show="localShow"
    preset="card"
    style="width: 600px"
    title="Generate Analytics Report"
    :closable="!isGenerating"
    :mask-closable="!isGenerating"
  >
    <n-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="top"
      label-width="auto"
      class="space-y-4"
    >
      <!-- Report Type -->
      <n-form-item label="Report Type" path="reportType">
        <n-select
          v-model:value="formData.reportType"
          :options="reportTypeOptions"
          placeholder="Select report type"
        />
      </n-form-item>

      <!-- Period Type -->
      <n-form-item label="Period Type" path="periodType">
        <n-select
          v-model:value="formData.periodType"
          :options="periodTypeOptions"
          placeholder="Select period"
          @update:value="handlePeriodTypeChange"
        />
      </n-form-item>

      <!-- Custom Date Range (only for Custom period) -->
      <div
        v-if="formData.periodType === 'Custom'"
        class="grid grid-cols-2 gap-4"
      >
        <n-form-item label="From Date" path="fromDate">
          <n-date-picker
            v-model:value="formData.fromDate"
            type="date"
            placeholder="Select start date"
            class="w-full"
          />
        </n-form-item>

        <n-form-item label="To Date" path="toDate">
          <n-date-picker
            v-model:value="formData.toDate"
            type="date"
            placeholder="Select end date"
            class="w-full"
          />
        </n-form-item>
      </div>

      <!-- Options -->
      <n-form-item label="Report Options">
        <div class="space-y-3">
          <n-checkbox v-model:checked="formData.includeAIInsights">
            Include AI-powered insights and analysis
          </n-checkbox>

          <n-checkbox v-model:checked="formData.generateRecommendations">
            Generate improvement recommendations
          </n-checkbox>

          <n-checkbox v-model:checked="formData.includePeerComparison">
            Include peer institution comparisons
          </n-checkbox>

          <n-checkbox v-model:checked="formData.includeHistoricalTrends">
            Include historical trend analysis
          </n-checkbox>
        </div>
      </n-form-item>

      <!-- Format Selection -->
      <n-form-item label="Output Format" path="outputFormat">
        <n-radio-group v-model:value="formData.outputFormat">
          <n-space>
            <n-radio value="pdf">
              <div class="flex items-center space-x-2">
                <Icon name="ph:file-pdf" class="text-red-500" />
                <span>PDF Report</span>
              </div>
            </n-radio>

            <n-radio value="excel">
              <div class="flex items-center space-x-2">
                <Icon name="ph:microsoft-excel-logo" class="text-green-600" />
                <span>Excel Workbook</span>
              </div>
            </n-radio>

            <n-radio value="powerpoint">
              <div class="flex items-center space-x-2">
                <Icon
                  name="ph:microsoft-powerpoint-logo"
                  class="text-orange-500"
                />
                <span>PowerPoint</span>
              </div>
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <!-- Estimated Generation Time -->
      <n-alert v-if="estimatedTime" type="info" class="mb-4">
        <template #icon>
          <Icon name="ph:clock" />
        </template>
        Estimated generation time: {{ estimatedTime }}
      </n-alert>

      <!-- Generation Progress -->
      <div v-if="isGenerating" class="space-y-3">
        <n-progress
          type="line"
          :percentage="generationProgress"
          :status="generationStatus"
          processing
        />
        <div class="text-center text-sm text-text-secondary">
          {{ generationStatusText }}
        </div>
      </div>
    </n-form>

    <template #footer>
      <div class="flex justify-between items-center">
        <div class="text-sm text-text-secondary">
          Report will be emailed when ready
        </div>

        <div class="flex space-x-3">
          <n-button @click="handleCancel" :disabled="isGenerating">
            Cancel
          </n-button>

          <n-button
            type="primary"
            @click="handleGenerate"
            :loading="isGenerating"
            :disabled="!canGenerate"
          >
            <template #icon>
              <Icon name="ph:file-arrow-down" />
            </template>
            {{ isGenerating ? 'Generating...' : 'Generate Report' }}
          </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  NModal,
  NForm,
  NFormItem,
  NSelect,
  NDatePicker,
  NCheckbox,
  NRadioGroup,
  NRadio,
  NSpace,
  NButton,
  NProgress,
  NAlert,
  useMessage,
  type FormInst,
  type FormRules,
} from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsNotifications } from '~/composables/useAnalyticsPolling';
import { useAnalyticsStore } from '~/stores/analytics';

interface Props {
  show: boolean;
  institutionId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:show': [value: boolean];
  'report-generated': [job: any];
}>();

// Stores and composables
const analyticsStore = useAnalyticsStore();
const message = useMessage();
const { showSuccessNotification, showErrorNotification } =
  useAnalyticsNotifications();

// Local state
const localShow = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
});

const formRef = ref<FormInst | null>(null);
const isGenerating = ref(false);
const generationProgress = ref(0);
const generationStatus = ref<'default' | 'success' | 'error' | 'warning'>(
  'default'
);

// Form data
const formData = ref({
  reportType: 'comprehensive',
  periodType: 'Quarterly',
  fromDate: null as number | null,
  toDate: null as number | null,
  includeAIInsights: true,
  generateRecommendations: true,
  includePeerComparison: true,
  includeHistoricalTrends: true,
  outputFormat: 'pdf',
});

// Form options
const reportTypeOptions = [
  { label: 'Comprehensive Analytics', value: 'comprehensive' },
  { label: 'Performance Summary', value: 'performance' },
  { label: 'Trend Analysis', value: 'trends' },
  { label: 'Peer Comparison', value: 'comparison' },
  { label: 'Custom Report', value: 'custom' },
];

const periodTypeOptions = [
  { label: 'Current Month', value: 'Monthly' },
  { label: 'Current Quarter', value: 'Quarterly' },
  { label: 'Current Year', value: 'Yearly' },
  { label: 'Custom Range', value: 'Custom' },
];

// Form validation rules
const formRules: FormRules = {
  reportType: {
    required: true,
    message: 'Please select a report type',
    trigger: 'change',
  },
  periodType: {
    required: true,
    message: 'Please select a period type',
    trigger: 'change',
  },
  fromDate: {
    required: false,
    validator: (rule, value) => {
      if (formData.value.periodType === 'Custom' && !value) {
        return new Error('Please select a start date');
      }
      return true;
    },
    trigger: 'change',
  },
  toDate: {
    required: false,
    validator: (rule, value) => {
      if (formData.value.periodType === 'Custom') {
        if (!value) {
          return new Error('Please select an end date');
        }
        if (formData.value.fromDate && value <= formData.value.fromDate) {
          return new Error('End date must be after start date');
        }
      }
      return true;
    },
    trigger: 'change',
  },
  outputFormat: {
    required: true,
    message: 'Please select an output format',
    trigger: 'change',
  },
};

// Computed properties
const estimatedTime = computed(() => {
  if (!formData.value.reportType) return null;

  let baseTime = 2; // minutes

  // Add time for different options
  if (formData.value.includeAIInsights) baseTime += 3;
  if (formData.value.generateRecommendations) baseTime += 2;
  if (formData.value.includePeerComparison) baseTime += 2;
  if (formData.value.includeHistoricalTrends) baseTime += 1;

  // Add time for different formats
  if (formData.value.outputFormat === 'powerpoint') baseTime += 2;
  if (formData.value.outputFormat === 'excel') baseTime += 1;

  return `${baseTime}-${baseTime + 2} minutes`;
});

const canGenerate = computed(() => {
  if (
    !props.institutionId ||
    !formData.value.reportType ||
    !formData.value.periodType
  ) {
    return false;
  }

  if (formData.value.periodType === 'Custom') {
    return !!(formData.value.fromDate && formData.value.toDate);
  }

  return true;
});

const generationStatusText = computed(() => {
  if (generationProgress.value < 20) return 'Initializing report generation...';
  if (generationProgress.value < 40) return 'Gathering analytics data...';
  if (generationProgress.value < 60) return 'Processing AI insights...';
  if (generationProgress.value < 80) return 'Generating visualizations...';
  if (generationProgress.value < 95) return 'Finalizing report...';
  return 'Report generation complete!';
});

// Methods
const handlePeriodTypeChange = () => {
  if (formData.value.periodType !== 'Custom') {
    formData.value.fromDate = null;
    formData.value.toDate = null;
  }
};

const handleGenerate = async () => {
  if (!formRef.value || !props.institutionId) return;

  try {
    await formRef.value.validate();

    isGenerating.value = true;
    generationProgress.value = 0;
    generationStatus.value = 'default';

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      if (generationProgress.value < 90) {
        generationProgress.value += Math.random() * 15;
      }
    }, 500);

    // Prepare request data
    const requestData = {
      institutionId: props.institutionId,
      periodType: formData.value.periodType as any,
      fromDate: formData.value.fromDate
        ? new Date(formData.value.fromDate).toISOString()
        : undefined,
      toDate: formData.value.toDate
        ? new Date(formData.value.toDate).toISOString()
        : undefined,
      includeAIInsights: formData.value.includeAIInsights,
      generateRecommendations: formData.value.generateRecommendations,
    };

    // Generate report
    const job = await analyticsStore.generateReport(requestData);

    clearInterval(progressInterval);
    generationProgress.value = 100;
    generationStatus.value = 'success';

    showSuccessNotification(
      'Report Generation Started',
      "Your report is being generated. You will be notified when it's ready."
    );

    emit('report-generated', job);

    setTimeout(() => {
      handleCancel();
    }, 2000);
  } catch (error: any) {
    isGenerating.value = false;
    generationStatus.value = 'error';
    showErrorNotification(
      'Generation Failed',
      error.message || 'Failed to generate report'
    );
  }
};

const handleCancel = () => {
  if (isGenerating.value) {
    message.warning('Report generation is in progress and cannot be cancelled');
    return;
  }

  // Reset form
  formData.value = {
    reportType: 'comprehensive',
    periodType: 'Quarterly',
    fromDate: null,
    toDate: null,
    includeAIInsights: true,
    generateRecommendations: true,
    includePeerComparison: true,
    includeHistoricalTrends: true,
    outputFormat: 'pdf',
  };

  isGenerating.value = false;
  generationProgress.value = 0;
  generationStatus.value = 'default';

  localShow.value = false;
};

// Watch for modal close to reset state
watch(localShow, (newValue) => {
  if (!newValue && !isGenerating.value) {
    handleCancel();
  }
});
</script>

<style scoped>
:deep(.n-form-item-label) {
  font-weight: 500;
}

:deep(.n-radio) {
  display: flex;
  align-items: center;
}
</style>
