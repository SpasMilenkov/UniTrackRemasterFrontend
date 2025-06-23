<!-- components/analytics/ReportGenerator.vue -->
<template>
  <div class="space-y-6">
    <div v-if="showHeader" class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-text-primary">Generate New Report</h3>
    </div>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="top"
      size="medium"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Institution Selection -->
        <n-form-item label="Institution" path="institutionId">
          <n-select
            v-model:value="formData.institutionId"
            placeholder="Select institution"
            :options="institutionOptions"
            filterable
            :disabled="!!currentInstitutionId"
          />
        </n-form-item>

        <!-- Report Type -->
        <n-form-item label="Report Type" path="reportType">
          <n-select
            v-model:value="formData.reportType"
            placeholder="Select report type"
            :options="reportTypeOptions"
          />
        </n-form-item>

        <!-- Period Type -->
        <n-form-item label="Period Type" path="periodType">
          <n-select
            v-model:value="formData.periodType"
            placeholder="Select period"
            :options="periodTypeOptions"
          />
        </n-form-item>

        <!-- Custom Date Range (only if Custom period selected) -->
        <n-form-item
          v-if="formData.periodType === 'Custom'"
          label="Date Range"
          path="dateRange"
        >
          <n-date-picker
            v-model:value="formData.dateRange"
            type="daterange"
            clearable
            format="yyyy-MM-dd"
            placeholder="Select date range"
            class="w-full"
          />
        </n-form-item>
      </div>

      <!-- Advanced Options -->
      <n-collapse>
        <n-collapse-item title="Advanced Options" name="advanced">
          <div class="space-y-4">
            <n-checkbox v-model:checked="formData.includeAIInsights">
              Include AI-powered insights and analysis
            </n-checkbox>

            <n-checkbox v-model:checked="formData.generateRecommendations">
              Generate actionable recommendations
            </n-checkbox>

            <n-checkbox v-model:checked="formData.includeComparisons">
              Include peer institution comparisons
            </n-checkbox>

            <n-checkbox v-model:checked="formData.includeVisualizations">
              Include charts and visualizations
            </n-checkbox>
          </div>
        </n-collapse-item>
      </n-collapse>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4">
        <n-button v-if="showCancel" @click="$emit('cancel')"> Cancel </n-button>

        <n-button type="primary" :loading="generating" @click="handleGenerate">
          <template #icon>
            <Icon name="ph:file-arrow-down" />
          </template>
          Generate Report
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  NButton,
  useMessage,
  type FormInst,
  type FormRules,
} from 'naive-ui';
import { Icon } from '#components';
import {
  useAnalyticsStore,
  type GenerateReportRequestDto,
  type ReportJobDto,
} from '~/stores/analytics';

interface Props {
  currentInstitutionId?: string | null;
  showHeader?: boolean;
  showCancel?: boolean;
}

interface Emits {
  (e: 'report-generated', job: ReportJobDto): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showCancel: false,
});

const emit = defineEmits<Emits>();

// Stores and composables
const analyticsStore = useAnalyticsStore();
const institutionStore = useInstitutionStore();
const message = useMessage();

// State
const formRef = ref<FormInst | null>(null);
const generating = ref(false);

const formData = ref({
  institutionId: props.currentInstitutionId || '',
  reportType: 'Analytics' as const,
  periodType: 'Quarterly' as GenerateReportRequestDto['periodType'],
  dateRange: null as [number, number] | null,
  includeAIInsights: true,
  generateRecommendations: true,
  includeComparisons: false,
  includeVisualizations: true,
});

// Form rules
const formRules: FormRules = {
  institutionId: {
    required: true,
    message: 'Please select an institution',
    trigger: ['blur', 'change'],
  },
  reportType: {
    required: true,
    message: 'Please select a report type',
    trigger: ['blur', 'change'],
  },
  periodType: {
    required: true,
    message: 'Please select a period type',
    trigger: ['blur', 'change'],
  },
  dateRange: {
    required: true,
    message: 'Please select a date range for custom period',
    trigger: ['blur', 'change'],
    validator: (rule, value) => {
      if (formData.value.periodType === 'Custom' && !value) {
        return new Error('Date range is required for custom period');
      }
      return true;
    },
  },
};

// Options
const institutionOptions = computed(() => {
  // This would come from the institution store
  const activeInstitution = institutionStore.activeInstitution;
  if (activeInstitution) {
    return [
      {
        label: activeInstitution.name,
        value: activeInstitution.id,
      },
    ];
  }
  return [];
});

const reportTypeOptions = [
  { label: 'Analytics Overview', value: 'Analytics' },
  { label: 'Performance Report', value: 'Performance' },
  { label: 'Comparison Report', value: 'Comparison' },
  { label: 'Market Analysis', value: 'Market' },
];

const periodTypeOptions = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Yearly', value: 'Yearly' },
  { label: 'Custom Range', value: 'Custom' },
];

// Methods
const handleGenerate = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    generating.value = true;

    const request: GenerateReportRequestDto = {
      institutionId: formData.value.institutionId,
      periodType: formData.value.periodType,
      includeAIInsights: formData.value.includeAIInsights,
      generateRecommendations: formData.value.generateRecommendations,
    };

    // Add custom date range if specified
    if (formData.value.periodType === 'Custom' && formData.value.dateRange) {
      request.fromDate = new Date(formData.value.dateRange[0]).toISOString();
      request.toDate = new Date(formData.value.dateRange[1]).toISOString();
    }

    const job = await analyticsStore.generateReport(request);

    message.success('Report generation started successfully');
    emit('report-generated', job);

    // Reset form
    resetForm();
  } catch (error: any) {
    if (error.message) {
      message.error('Failed to generate report: ' + error.message);
    }
  } finally {
    generating.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    institutionId: props.currentInstitutionId || '',
    reportType: 'Analytics',
    periodType: 'Quarterly',
    dateRange: null,
    includeAIInsights: true,
    generateRecommendations: true,
    includeComparisons: false,
    includeVisualizations: true,
  };
};

// Watch for changes in current institution
watch(
  () => props.currentInstitutionId,
  (newId) => {
    if (newId) {
      formData.value.institutionId = newId;
    }
  },
  { immediate: true }
);

// Clear date range when period type changes
watch(
  () => formData.value.periodType,
  (newType) => {
    if (newType !== 'Custom') {
      formData.value.dateRange = null;
    }
  }
);
</script>



