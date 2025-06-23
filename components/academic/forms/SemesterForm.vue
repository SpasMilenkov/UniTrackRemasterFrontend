<!-- components/academic/forms/SemesterForm.vue -->
<template>
  <div class="semester-form-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="flex items-center gap-3 mb-2">
        <div class="header-icon">
          <Icon name="carbon:calendar" class="text-xl" />
        </div>
        <div>
          <h2 class="form-title">
            {{ formTitle }}
          </h2>
          <p class="form-subtitle">
            {{ formSubtitle }}
          </p>
        </div>
      </div>

      <!-- Institution Type Indicator -->
      <div class="institution-indicator">
        <n-tag
          :type="isHigherEducationComputed ? 'info' : 'success'"
          size="small"
        >
          <Icon
            :name="isHigherEducationComputed ? 'ph:university' : 'ph:student'"
            class="mr-1"
          />
          {{ institutionTypeLabel }}
        </n-tag>
      </div>
    </div>

    <n-divider class="my-6" />

    <!-- Form Content -->
    <n-form
      ref="formRef"
      :model="formData"
      label-placement="top"
      require-mark-placement="right-hanging"
      @submit.prevent="onSubmit"
    >
      <!-- Basic Information Card -->
      <n-card title="Basic Information" class="form-card mb-6">
        <template #header-extra>
          <Icon name="carbon:information" class="text-gray-400" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Term/Semester Name -->
          <n-form-item
            :label="nameFieldLabel"
            path="name"
            v-bind="nameProps"
            required
          >
            <n-input
              v-model:value="name"
              :placeholder="namePlaceholder"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="carbon:text-font" class="text-gray-400" />
              </template>
            </n-input>
          </n-form-item>

          <!-- Academic Year -->
          <n-form-item
            label="Academic Year"
            path="academicYearId"
            v-bind="academicYearIdProps"
            required
          >
            <n-select
              v-model:value="academicYearId"
              :options="academicYearOptions"
              placeholder="Select academic year"
              filterable
              :disabled="loading || academicYearOptions.length === 0"
              :loading="academicYearStore.loadingAcademicYears"
              size="large"
            >
              <template #arrow>
                <Icon name="carbon:chevron-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="carbon:calendar"
                    class="text-2xl text-gray-400 mb-2"
                  />
                  <p class="text-gray-500">No academic years available</p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                {{
                  academicYearOptions.length === 0
                    ? `Please create academic years first before adding ${termText.toLowerCase()}s`
                    : `Select the academic year this ${termText.toLowerCase()} belongs to`
                }}
              </div>
            </template>
          </n-form-item>

          <!-- Term/Semester Type -->
          <n-form-item
            :label="typeFieldLabel"
            path="type"
            v-bind="typeProps"
            required
          >
            <n-select
              v-model:value="type"
              :options="typeOptions"
              :placeholder="typePlaceholder"
              :disabled="loading"
              size="large"
            >
              <template #arrow>
                <Icon name="carbon:chevron-down" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                {{ typeHelpText }}
              </div>
            </template>
          </n-form-item>

          <!-- Status -->
          <n-form-item
            label="Status"
            path="status"
            v-bind="statusProps"
            required
          >
            <n-select
              v-model:value="status"
              :options="statusOptions"
              placeholder="Select status"
              :disabled="loading"
              size="large"
            >
              <template #arrow>
                <Icon name="carbon:chevron-down" />
              </template>
            </n-select>
          </n-form-item>

          <!-- Start Date -->
          <n-form-item
            label="Start Date"
            path="startDate"
            v-bind="startDateProps"
            required
          >
            <n-date-picker
              v-model:value="startDateTimestamp"
              type="date"
              clearable
              placeholder="Select start date"
              :disabled="loading"
              size="large"
              class="w-full"
              @update:value="handleStartDateChange"
            />
          </n-form-item>

          <!-- End Date -->
          <n-form-item
            label="End Date"
            path="endDate"
            v-bind="endDateProps"
            required
          >
            <n-date-picker
              v-model:value="endDateTimestamp"
              type="date"
              clearable
              placeholder="Select end date"
              :disabled="loading"
              size="large"
              class="w-full"
              @update:value="handleEndDateChange"
            />
          </n-form-item>

          <!-- Week Count -->
          <n-form-item
            label="Week Count"
            path="weekCount"
            v-bind="weekCountProps"
            required
          >
            <n-input-number
              v-model:value="weekCount"
              :min="1"
              :max="52"
              placeholder="Number of weeks"
              :disabled="loading"
              size="large"
              class="w-full"
            >
              <template #prefix>
                <Icon name="carbon:time" class="text-gray-400" />
              </template>
            </n-input-number>
            <template #feedback>
              <div class="form-help-text">
                Automatically calculated from start and end dates
              </div>
            </template>
          </n-form-item>

          <!-- Description -->
          <n-form-item
            label="Description (Optional)"
            path="description"
            v-bind="descriptionProps"
            class="md:col-span-2"
          >
            <n-input
              v-model:value="description"
              type="textarea"
              :placeholder="descriptionPlaceholder"
              :autosize="{ minRows: 2, maxRows: 4 }"
              :disabled="loading"
              size="large"
            />
          </n-form-item>
        </div>
      </n-card>

      <!-- Academic Calendar Card - Only show for Higher Education -->
      <n-card
        v-if="isHigherEducationComputed && showAdvancedOptions"
        :title="advancedOptionsTitle"
        class="form-card mb-6"
      >
        <template #header-extra>
          <Icon name="carbon:calendar-tools" class="text-gray-400" />
        </template>

        <n-alert type="info" class="mb-4">
          <Icon name="carbon:information" />
          Configure important academic dates for this semester. All dates are
          optional but help with better planning.
        </n-alert>

        <n-tabs type="line" animated>
          <!-- Registration Period -->
          <n-tab-pane name="registration" tab="Registration Period">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <n-form-item
                label="Registration Start Date"
                path="registrationStartDate"
                v-bind="registrationStartDateProps"
              >
                <n-date-picker
                  v-model:value="registrationStartDateTimestamp"
                  type="date"
                  clearable
                  placeholder="Select date"
                  :disabled="loading"
                  size="large"
                  class="w-full"
                  @update:value="handleRegistrationStartDateChange"
                />
              </n-form-item>

              <n-form-item
                label="Registration End Date"
                path="registrationEndDate"
                v-bind="registrationEndDateProps"
              >
                <n-date-picker
                  v-model:value="registrationEndDateTimestamp"
                  type="date"
                  clearable
                  placeholder="Select date"
                  :disabled="loading"
                  size="large"
                  class="w-full"
                  @update:value="handleRegistrationEndDateChange"
                />
              </n-form-item>
            </div>
          </n-tab-pane>

          <!-- Academic Deadlines -->
          <n-tab-pane name="deadlines" tab="Academic Deadlines">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <n-form-item
                label="Add/Drop Deadline"
                path="addDropDeadline"
                v-bind="addDropDeadlineProps"
              >
                <n-date-picker
                  v-model:value="addDropDeadlineTimestamp"
                  type="date"
                  clearable
                  placeholder="Select date"
                  :disabled="loading"
                  size="large"
                  class="w-full"
                  @update:value="handleAddDropDeadlineChange"
                />
              </n-form-item>

              <n-form-item
                label="Withdrawal Deadline"
                path="withdrawalDeadline"
                v-bind="withdrawalDeadlineProps"
              >
                <n-date-picker
                  v-model:value="withdrawalDeadlineTimestamp"
                  type="date"
                  clearable
                  placeholder="Select date"
                  :disabled="loading"
                  size="large"
                  class="w-full"
                  @update:value="handleWithdrawalDeadlineChange"
                />
              </n-form-item>
            </div>
          </n-tab-pane>

          <!-- Exam Periods -->
          <n-tab-pane name="exams" tab="Exam Periods">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <n-form-item
                label="Midterm Start Date"
                path="midtermStartDate"
                v-bind="midtermStartDateProps"
              >
                <n-date-picker
                  v-model:value="midtermStartDateTimestamp"
                  type="date"
                  clearable
                  placeholder="Select date"
                  :disabled="loading"
                  size="large"
                  class="w-full"
                  @update:value="handleMidtermStartDateChange"
                />
              </n-form-item>

              <n-form-item
                label="Midterm End Date"
                path="midtermEndDate"
                v-bind="midtermEndDateProps"
              >
                <n-date-picker
                  v-model:value="midtermEndDateTimestamp"
                  type="date"
                  clearable
                  placeholder="Select date"
                  :disabled="loading"
                  size="large"
                  class="w-full"
                  @update:value="handleMidtermEndDateChange"
                />
              </n-form-item>

              <n-form-item
                label="Final Exam Start Date"
                path="finalExamStartDate"
                v-bind="finalExamStartDateProps"
              >
                <n-date-picker
                  v-model:value="finalExamStartDateTimestamp"
                  type="date"
                  clearable
                  placeholder="Select date"
                  :disabled="loading"
                  size="large"
                  class="w-full"
                  @update:value="handleFinalExamStartDateChange"
                />
              </n-form-item>

              <n-form-item
                label="Final Exam End Date"
                path="finalExamEndDate"
                v-bind="finalExamEndDateProps"
              >
                <n-date-picker
                  v-model:value="finalExamEndDateTimestamp"
                  type="date"
                  clearable
                  placeholder="Select date"
                  :disabled="loading"
                  size="large"
                  class="w-full"
                  @update:value="handleFinalExamEndDateChange"
                />
              </n-form-item>
            </div>
          </n-tab-pane>

          <!-- Grade Submission -->
          <n-tab-pane name="grades" tab="Grade Submission">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <n-form-item
                label="Grade Submission Deadline"
                path="gradeSubmissionDeadline"
                v-bind="gradeSubmissionDeadlineProps"
              >
                <n-date-picker
                  v-model:value="gradeSubmissionDeadlineTimestamp"
                  type="date"
                  clearable
                  placeholder="Select date"
                  :disabled="loading"
                  size="large"
                  class="w-full"
                  @update:value="handleGradeSubmissionDeadlineChange"
                />
              </n-form-item>
            </div>
          </n-tab-pane>
        </n-tabs>
      </n-card>

      <!-- Show Advanced Options Toggle for K-12 -->
      <div v-if="!isHigherEducationComputed" class="mb-6 text-center">
        <n-button
          text
          type="primary"
          @click="showAdvancedOptions = !showAdvancedOptions"
        >
          <template #icon>
            <Icon
              :name="
                showAdvancedOptions
                  ? 'carbon:chevron-up'
                  : 'carbon:chevron-down'
              "
            />
          </template>
          {{ showAdvancedOptions ? 'Hide' : 'Show' }} Advanced Options
        </n-button>
      </div>

      <!-- K-12 Advanced Options (Simplified) -->
      <n-card
        v-if="!isHigherEducationComputed && showAdvancedOptions"
        title="Additional Term Settings"
        class="form-card mb-6"
      >
        <template #header-extra>
          <Icon name="carbon:settings" class="text-gray-400" />
        </template>

        <n-alert type="info" class="mb-4">
          <Icon name="carbon:information" />
          Optional settings for this academic term. These can help with better
          term management.
        </n-alert>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Grade Submission Deadline for K-12 -->
          <n-form-item
            label="Report Card Deadline"
            path="gradeSubmissionDeadline"
            v-bind="gradeSubmissionDeadlineProps"
          >
            <n-date-picker
              v-model:value="gradeSubmissionDeadlineTimestamp"
              type="date"
              clearable
              placeholder="Select date"
              :disabled="loading"
              size="large"
              class="w-full"
              @update:value="handleGradeSubmissionDeadlineChange"
            />
            <template #feedback>
              <div class="form-help-text">
                Deadline for teachers to submit final grades
              </div>
            </template>
          </n-form-item>

          <!-- Midterm period for K-12 -->
          <n-form-item
            label="Mid-Term Assessment Date"
            path="midtermStartDate"
            v-bind="midtermStartDateProps"
          >
            <n-date-picker
              v-model:value="midtermStartDateTimestamp"
              type="date"
              clearable
              placeholder="Select date"
              :disabled="loading"
              size="large"
              class="w-full"
              @update:value="handleMidtermStartDateChange"
            />
            <template #feedback>
              <div class="form-help-text">
                When mid-term assessments/reports are due
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Term Preview Card -->
      <n-card :title="previewCardTitle" class="form-card mb-6">
        <template #header-extra>
          <Icon name="carbon:view" class="text-gray-400" />
        </template>

        <div
          v-if="!startDate || !endDate"
          class="text-center text-text-secondary py-8"
        >
          <Icon name="carbon:calendar" class="text-4xl mb-4" />
          <p>{{ previewEmptyMessage }}</p>
        </div>

        <div v-else class="semester-preview">
          <div class="preview-header">
            <div class="semester-info">
              <h3 class="semester-name">{{ name || termText }}</h3>
              <div class="semester-meta">
                <n-tag :type="getTypeTagType(type)" size="small">
                  {{ getTypeDisplayText(type) }}
                </n-tag>
                <n-tag :type="getStatusTagType(status)" size="small">
                  {{ status || 'Status' }}
                </n-tag>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <!-- Basic Dates -->
            <div class="preview-section">
              <h4 class="section-title">
                <Icon name="carbon:calendar" class="mr-2" />
                Basic Information
              </h4>
              <div class="space-y-2">
                <div class="date-item">
                  <span class="label">Duration:</span>
                  <span class="value"
                    >{{ formatDate(startDate) }} -
                    {{ formatDate(endDate) }}</span
                  >
                </div>
                <div class="date-item">
                  <span class="label">Weeks:</span>
                  <span class="value">{{ weekCount || 0 }}</span>
                </div>
                <div v-if="selectedAcademicYear" class="date-item">
                  <span class="label">Academic Year:</span>
                  <span class="value">{{ selectedAcademicYear.label }}</span>
                </div>
              </div>
            </div>

            <!-- Important Dates -->
            <div class="preview-section">
              <h4 class="section-title">
                <Icon name="carbon:event-schedule" class="mr-2" />
                {{
                  isHigherEducationComputed ? 'Important Dates' : 'Key Dates'
                }}
              </h4>
              <div class="space-y-2">
                <div
                  v-if="
                    isHigherEducationComputed &&
                    registrationStartDate &&
                    registrationEndDate
                  "
                  class="date-item"
                >
                  <span class="label">Registration:</span>
                  <span class="value">
                    {{ formatDate(registrationStartDate) }} -
                    {{ formatDate(registrationEndDate) }}
                  </span>
                </div>
                <div
                  v-if="isHigherEducationComputed && addDropDeadline"
                  class="date-item"
                >
                  <span class="label">Add/Drop Deadline:</span>
                  <span class="value">{{ formatDate(addDropDeadline) }}</span>
                </div>
                <div
                  v-if="isHigherEducationComputed && withdrawalDeadline"
                  class="date-item"
                >
                  <span class="label">Withdrawal Deadline:</span>
                  <span class="value">{{
                    formatDate(withdrawalDeadline)
                  }}</span>
                </div>
                <div v-if="midtermStartDate" class="date-item">
                  <span class="label">{{
                    isHigherEducationComputed
                      ? 'Midterms:'
                      : 'Mid-term Assessment:'
                  }}</span>
                  <span class="value">
                    {{ formatDate(midtermStartDate) }}
                    <span v-if="midtermEndDate && isHigherEducationComputed">
                      - {{ formatDate(midtermEndDate) }}</span
                    >
                  </span>
                </div>
                <div
                  v-if="
                    isHigherEducationComputed &&
                    finalExamStartDate &&
                    finalExamEndDate
                  "
                  class="date-item"
                >
                  <span class="label">Final Exams:</span>
                  <span class="value">
                    {{ formatDate(finalExamStartDate) }} -
                    {{ formatDate(finalExamEndDate) }}
                  </span>
                </div>
                <div v-if="gradeSubmissionDeadline" class="date-item">
                  <span class="label">{{
                    isHigherEducationComputed
                      ? 'Grade Submission:'
                      : 'Report Card Deadline:'
                  }}</span>
                  <span class="value">{{
                    formatDate(gradeSubmissionDeadline)
                  }}</span>
                </div>
                <div v-if="!hasImportantDates" class="date-item">
                  <span class="value text-text-secondary"
                    >No additional dates configured</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-card>

      <!-- Form Actions -->
      <div class="form-actions">
        <n-space justify="end" size="medium">
          <n-button
            size="large"
            :disabled="loading"
            class="cancel-button"
            @click="emit('cancel')"
          >
            <template #icon>
              <Icon name="carbon:close" />
            </template>
            Cancel
          </n-button>
          <n-button
            type="primary"
            :loading="loading"
            attr-type="submit"
            size="large"
            class="submit-button"
          >
            <template #icon>
              <Icon :name="isEditing ? 'carbon:edit' : 'carbon:add'" />
            </template>
            {{ submitButtonText }}
          </n-button>
        </n-space>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useMessage } from 'naive-ui';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import { useAcademicYearStore } from '~/stores/academic-year';
import { useInstitutionStore } from '~/stores/institution';
import { isHigherEducation as checkIsHigherEducation } from '~/utils/institution-helper';
import {
  createSemesterSchema,
  type CreateSemesterSchema,
} from '~/schemas/semester.schema';
import {
  SemesterType,
  SemesterStatus,
  getTermsForInstitutionType,
  getTermDisplayName,
} from '~/interfaces/academic/semester';
import { Icon } from '#components';

// Define props interface
interface Props {
  initialValues?: Record<string, any>;
  isEditing?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  loading: false,
});

// Define emit interface
const emit = defineEmits<{
  submit: [data: CreateSemesterSchema];
  cancel: [];
}>();

// Stores and utilities
const message = useMessage();
const academicYearStore = useAcademicYearStore();
const institutionStore = useInstitutionStore();

// Form reference
const formRef = ref();

// Institution type detection
const activeInstitution = computed(() => institutionStore.activeInstitution);
const isHigherEducationComputed = computed(() =>
  checkIsHigherEducation(activeInstitution.value?.type)
);
const institutionTypeLabel = computed(() =>
  isHigherEducationComputed.value ? 'Higher Education' : 'K-12 School'
);

// Dynamic terminology
const termText = computed(() =>
  isHigherEducationComputed.value ? 'Semester' : 'Term'
);

const formTitle = computed(
  () => `${props.isEditing ? 'Edit' : 'Create'} ${termText.value}`
);

const formSubtitle = computed(() =>
  isHigherEducationComputed.value
    ? 'Configure semester details and academic calendar dates'
    : 'Configure term details and important dates'
);

const nameFieldLabel = computed(() => `${termText.value} Name`);

const namePlaceholder = computed(() =>
  isHigherEducationComputed.value ? 'e.g. Fall 2025' : 'e.g. Fall Quarter 2025'
);

const typeFieldLabel = computed(() => `${termText.value} Type`);

const typePlaceholder = computed(
  () => `Select ${termText.value.toLowerCase()} type`
);

const typeHelpText = computed(() =>
  isHigherEducationComputed.value
    ? 'Choose the semester type (Fall, Spring, Summer, etc.)'
    : 'Choose the term type (quarters or trimesters)'
);

const descriptionPlaceholder = computed(
  () => `${termText.value} description (optional)`
);

const advancedOptionsTitle = computed(() =>
  isHigherEducationComputed.value
    ? 'Academic Calendar (Optional)'
    : 'Additional Settings'
);

const previewCardTitle = computed(() => `${termText.value} Preview`);

const previewEmptyMessage = computed(
  () =>
    `Select start and end dates to preview the ${termText.value.toLowerCase()} calendar`
);

const submitButtonText = computed(
  () => `${props.isEditing ? 'Update' : 'Create'} ${termText.value}`
);

// Advanced options visibility
const showAdvancedOptions = ref(isHigherEducationComputed.value);

// Timestamp refs for NaiveUI datepickers
const startDateTimestamp = ref<number | null>(null);
const endDateTimestamp = ref<number | null>(null);
const registrationStartDateTimestamp = ref<number | null>(null);
const registrationEndDateTimestamp = ref<number | null>(null);
const addDropDeadlineTimestamp = ref<number | null>(null);
const withdrawalDeadlineTimestamp = ref<number | null>(null);
const midtermStartDateTimestamp = ref<number | null>(null);
const midtermEndDateTimestamp = ref<number | null>(null);
const finalExamStartDateTimestamp = ref<number | null>(null);
const finalExamEndDateTimestamp = ref<number | null>(null);
const gradeSubmissionDeadlineTimestamp = ref<number | null>(null);

// Options for selects
const academicYearOptions = computed(() => {
  return academicYearStore.academicYearOptions;
});

// Dynamic term type options based on institution type
const typeOptions = computed(() => {
  const terms = getTermsForInstitutionType(isHigherEducationComputed.value);

  // Group options for better UX
  if (isHigherEducationComputed.value) {
    return terms.map((term) => ({
      label: term.label,
      value: term.value,
    }));
  } else {
    // For K-12, group by system type
    const grouped: any[] = [];
    const quarters = terms.filter((t) => t.group === 'Quarter System');
    const trimesters = terms.filter((t) => t.group === 'Trimester System');

    if (quarters.length > 0) {
      grouped.push({
        type: 'group',
        label: 'Quarter System',
        key: 'quarters',
        children: quarters.map((t) => ({ label: t.label, value: t.value })),
      });
    }

    if (trimesters.length > 0) {
      grouped.push({
        type: 'group',
        label: 'Trimester System',
        key: 'trimesters',
        children: trimesters.map((t) => ({ label: t.label, value: t.value })),
      });
    }

    return grouped;
  }
});

// Define semester status options for the form
const statusOptions = computed(() => [
  { label: 'Upcoming', value: SemesterStatus.Upcoming },
  { label: 'Active', value: SemesterStatus.Active },
  { label: 'Completed', value: SemesterStatus.Completed },
  { label: 'Archived', value: SemesterStatus.Archived },
  { label: 'Cancelled', value: SemesterStatus.Cancelled },
]);

// Determine default values
const defaultValues: Partial<CreateSemesterSchema> = {
  name: '',
  academicYearId:
    academicYearOptions.value.length > 0
      ? academicYearOptions.value[0].value
      : '',
  type: isHigherEducationComputed.value
    ? SemesterType.Fall
    : SemesterType.FirstQuarter,
  status: SemesterStatus.Upcoming,
  weekCount: isHigherEducationComputed.value ? 16 : 9, // Typical quarter length
  description: '',
  startDate: '',
  endDate: '',
  ...props.initialValues,
};

// Form data reactive object
const formData = ref({
  ...defaultValues,
});

// Form setup with VeeValidate
const { handleSubmit, defineField, setFieldValue, resetForm } = useForm({
  validationSchema: toTypedSchema(createSemesterSchema),
  initialValues: formData.value,
});

// Define form fields
const [name, nameProps] = defineField('name', naiveUiFormsConfig);
const [academicYearId, academicYearIdProps] = defineField(
  'academicYearId',
  naiveUiFormsConfig
);
const [startDate, startDateProps] = defineField(
  'startDate',
  naiveUiFormsConfig
);
const [endDate, endDateProps] = defineField('endDate', naiveUiFormsConfig);
const [type, typeProps] = defineField('type', naiveUiFormsConfig);
const [status, statusProps] = defineField('status', naiveUiFormsConfig);
const [weekCount, weekCountProps] = defineField(
  'weekCount',
  naiveUiFormsConfig
);
const [description, descriptionProps] = defineField(
  'description',
  naiveUiFormsConfig
);
const [registrationStartDate, registrationStartDateProps] = defineField(
  'registrationStartDate',
  naiveUiFormsConfig
);
const [registrationEndDate, registrationEndDateProps] = defineField(
  'registrationEndDate',
  naiveUiFormsConfig
);
const [addDropDeadline, addDropDeadlineProps] = defineField(
  'addDropDeadline',
  naiveUiFormsConfig
);
const [withdrawalDeadline, withdrawalDeadlineProps] = defineField(
  'withdrawalDeadline',
  naiveUiFormsConfig
);
const [midtermStartDate, midtermStartDateProps] = defineField(
  'midtermStartDate',
  naiveUiFormsConfig
);
const [midtermEndDate, midtermEndDateProps] = defineField(
  'midtermEndDate',
  naiveUiFormsConfig
);
const [finalExamStartDate, finalExamStartDateProps] = defineField(
  'finalExamStartDate',
  naiveUiFormsConfig
);
const [finalExamEndDate, finalExamEndDateProps] = defineField(
  'finalExamEndDate',
  naiveUiFormsConfig
);
const [gradeSubmissionDeadline, gradeSubmissionDeadlineProps] = defineField(
  'gradeSubmissionDeadline',
  naiveUiFormsConfig
);

// Computed properties
const selectedAcademicYear = computed(() => {
  return academicYearOptions.value.find(
    (option) => option.value === academicYearId.value
  );
});

const hasImportantDates = computed(() => {
  if (isHigherEducationComputed.value) {
    return !!(
      registrationStartDate.value ||
      registrationEndDate.value ||
      addDropDeadline.value ||
      withdrawalDeadline.value ||
      midtermStartDate.value ||
      midtermEndDate.value ||
      finalExamStartDate.value ||
      finalExamEndDate.value ||
      gradeSubmissionDeadline.value
    );
  } else {
    return !!(midtermStartDate.value || gradeSubmissionDeadline.value);
  }
});

// Initialize timestamp values from props on mount
onMounted(() => {
  if (props.initialValues) {
    // Convert Date objects to timestamps for NaiveUI datepickers
    if (props.initialValues.startDate) {
      startDateTimestamp.value = props.initialValues.startDate.getTime();
    }
    if (props.initialValues.endDate) {
      endDateTimestamp.value = props.initialValues.endDate.getTime();
    }
    if (props.initialValues.registrationStartDate) {
      registrationStartDateTimestamp.value =
        props.initialValues.registrationStartDate.getTime();
    }
    if (props.initialValues.registrationEndDate) {
      registrationEndDateTimestamp.value =
        props.initialValues.registrationEndDate.getTime();
    }
    if (props.initialValues.addDropDeadline) {
      addDropDeadlineTimestamp.value =
        props.initialValues.addDropDeadline.getTime();
    }
    if (props.initialValues.withdrawalDeadline) {
      withdrawalDeadlineTimestamp.value =
        props.initialValues.withdrawalDeadline.getTime();
    }
    if (props.initialValues.midtermStartDate) {
      midtermStartDateTimestamp.value =
        props.initialValues.midtermStartDate.getTime();
    }
    if (props.initialValues.midtermEndDate) {
      midtermEndDateTimestamp.value =
        props.initialValues.midtermEndDate.getTime();
    }
    if (props.initialValues.finalExamStartDate) {
      finalExamStartDateTimestamp.value =
        props.initialValues.finalExamStartDate.getTime();
    }
    if (props.initialValues.finalExamEndDate) {
      finalExamEndDateTimestamp.value =
        props.initialValues.finalExamEndDate.getTime();
    }
    if (props.initialValues.gradeSubmissionDeadline) {
      gradeSubmissionDeadlineTimestamp.value =
        props.initialValues.gradeSubmissionDeadline.getTime();
    }
  }
});

// Date change handlers
function handleStartDateChange(value: number | null) {
  if (value) {
    const date = new Date(value);
    setFieldValue('startDate', date.toISOString());
  } else {
    setFieldValue('startDate', '');
  }
  calculateWeeks();
}

function handleEndDateChange(value: number | null) {
  if (value) {
    const date = new Date(value);
    setFieldValue('endDate', date.toISOString());
  } else {
    setFieldValue('endDate', '');
  }
  calculateWeeks();
}

function handleRegistrationStartDateChange(value: number | null) {
  if (value) {
    const date = new Date(value);
    setFieldValue('registrationStartDate', date.toISOString());
  } else {
    setFieldValue('registrationStartDate', undefined);
  }
}

function handleRegistrationEndDateChange(value: number | null) {
  if (value) {
    const date = new Date(value);
    setFieldValue('registrationEndDate', date.toISOString());
  } else {
    setFieldValue('registrationEndDate', undefined);
  }
}

function handleAddDropDeadlineChange(value: number | null) {
  if (value) {
    const date = new Date(value);
    setFieldValue('addDropDeadline', date.toISOString());
  } else {
    setFieldValue('addDropDeadline', undefined);
  }
}

function handleWithdrawalDeadlineChange(value: number | null) {
  if (value) {
    const date = new Date(value);
    setFieldValue('withdrawalDeadline', date.toISOString());
  } else {
    setFieldValue('withdrawalDeadline', undefined);
  }
}

function handleMidtermStartDateChange(value: number | null) {
  if (value) {
    const date = new Date(value);
    setFieldValue('midtermStartDate', date.toISOString());
  } else {
    setFieldValue('midtermStartDate', undefined);
  }
}

function handleMidtermEndDateChange(value: number | null) {
  if (value) {
    const date = new Date(value);
    setFieldValue('midtermEndDate', date.toISOString());
  } else {
    setFieldValue('midtermEndDate', undefined);
  }
}

function handleFinalExamStartDateChange(value: number | null) {
  if (value) {
    const date = new Date(value);
    setFieldValue('finalExamStartDate', date.toISOString());
  } else {
    setFieldValue('finalExamStartDate', undefined);
  }
}

function handleFinalExamEndDateChange(value: number | null) {
  if (value) {
    const date = new Date(value);
    setFieldValue('finalExamEndDate', date.toISOString());
  } else {
    setFieldValue('finalExamEndDate', undefined);
  }
}

function handleGradeSubmissionDeadlineChange(value: number | null) {
  if (value) {
    const date = new Date(value);
    setFieldValue('gradeSubmissionDeadline', date.toISOString());
  } else {
    setFieldValue('gradeSubmissionDeadline', undefined);
  }
}

// Function to calculate weeks between dates
function calculateWeeks() {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    if (start >= end) {
      message.warning('Start date must be before end date');
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setFieldValue('weekCount', Math.ceil(diffDays / 7));
  }
}

// Helper functions for UI
function formatDate(date: Date | string | null): string {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
}

function getTypeTagType(semesterType: SemesterType | null): string {
  if (!semesterType) return 'default';

  // K-12 terms get different colors
  if (!isHigherEducationComputed.value) {
    switch (semesterType) {
      case SemesterType.FirstQuarter:
      case SemesterType.FirstTrimester:
        return 'success';
      case SemesterType.SecondQuarter:
      case SemesterType.SecondTrimester:
        return 'info';
      case SemesterType.ThirdQuarter:
      case SemesterType.ThirdTrimester:
        return 'warning';
      case SemesterType.FourthQuarter:
        return 'error';
      default:
        return 'default';
    }
  }

  // Higher-ed semesters
  switch (semesterType) {
    case SemesterType.Fall:
      return 'warning';
    case SemesterType.Spring:
      return 'success';
    case SemesterType.Summer:
      return 'error';
    case SemesterType.Winter:
      return 'info';
    default:
      return 'default';
  }
}

function getStatusTagType(semesterStatus: SemesterStatus | null): string {
  if (!semesterStatus) return 'default';
  switch (semesterStatus) {
    case SemesterStatus.Active:
      return 'success';
    case SemesterStatus.Upcoming:
      return 'info';
    case SemesterStatus.Completed:
      return 'default';
    case SemesterStatus.Archived:
      return 'warning';
    case SemesterStatus.Cancelled:
      return 'error';
    default:
      return 'default';
  }
}

function getTypeDisplayText(semesterType: SemesterType | null): string {
  if (!semesterType) return 'Type';
  return getTermDisplayName(semesterType, isHigherEducationComputed.value);
}

// Submit form handler
const onSubmit = handleSubmit((formValues) => {
  try {
    // Ensure required fields are properly formatted
    const submissionData: CreateSemesterSchema = {
      name: formValues.name || '',
      academicYearId: formValues.academicYearId || '',
      type: formValues.type as SemesterType,
      status: formValues.status as SemesterStatus,
      startDate: formValues.startDate || '',
      endDate: formValues.endDate || '',
      weekCount: formValues.weekCount || 0,
      description: formValues.description,

      // Only include advanced options if they're relevant for the institution type
      registrationStartDate: isHigherEducationComputed.value
        ? formValues.registrationStartDate
        : undefined,
      registrationEndDate: isHigherEducationComputed.value
        ? formValues.registrationEndDate
        : undefined,
      addDropDeadline: isHigherEducationComputed.value
        ? formValues.addDropDeadline
        : undefined,
      withdrawalDeadline: isHigherEducationComputed.value
        ? formValues.withdrawalDeadline
        : undefined,
      midtermStartDate: formValues.midtermStartDate,
      midtermEndDate: isHigherEducationComputed.value
        ? formValues.midtermEndDate
        : undefined,
      finalExamStartDate: isHigherEducationComputed.value
        ? formValues.finalExamStartDate
        : undefined,
      finalExamEndDate: isHigherEducationComputed.value
        ? formValues.finalExamEndDate
        : undefined,
      gradeSubmissionDeadline: formValues.gradeSubmissionDeadline,
    };

    emit('submit', submissionData);
  } catch (error: any) {
    message.error(`An error occurred: ${error.message}`);
  }
});

// Watch for props changes to update form
watch(
  () => props.initialValues,
  (newValues) => {
    if (newValues) {
      Object.assign(formData.value, newValues);
      resetForm({ values: formData.value });
    }
  },
  { deep: true }
);

// Watch institution type changes
watch(
  () => isHigherEducationComputed.value,
  (isHigherEd) => {
    // Reset advanced options visibility based on institution type
    showAdvancedOptions.value = isHigherEd;

    // Adjust default week count
    if (!weekCount.value || weekCount.value === 16 || weekCount.value === 9) {
      setFieldValue('weekCount', isHigherEd ? 16 : 9);
    }

    // Reset type if it's not appropriate for the institution
    if (type.value) {
      const currentTypeOptions = typeOptions.value;
      const hasCurrentType = currentTypeOptions.some((option) => {
        if (option.children) {
          return option.children.some(
            (child: any) => child.value === type.value
          );
        }
        return option.value === type.value;
      });

      if (!hasCurrentType) {
        setFieldValue(
          'type',
          isHigherEd ? SemesterType.Fall : SemesterType.FirstQuarter
        );
      }
    }
  }
);
</script>

<style scoped>
.semester-form-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 100%
  );
  color: white;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary);
}

.form-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 4px 0 0 0;
}

.institution-indicator {
  flex-shrink: 0;
}

.form-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all var(--animation-duration) ease;
  background: var(--color-background-card);
}

.form-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-help-text {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.semester-preview {
  padding: 20px;
  background: var(--color-background-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.semester-info {
  flex: 1;
}

.semester-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--color-text-primary);
}

.semester-meta {
  display: flex;
  gap: 8px;
}

.preview-section {
  padding: 16px;
  background: var(--color-background-secondary);
  border-radius: 8px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
}

.date-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.label {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.value {
  font-size: 13px;
  color: var(--color-text-primary);
  text-align: right;
}

.form-actions {
  background: var(--color-background-card);
  border-top: 1px solid var(--color-border);
  padding: 24px;
  margin: 0 -24px -24px -24px;
  border-radius: 0 0 12px 12px;
}

.cancel-button {
  min-width: 100px;
}

.submit-button {
  min-width: 140px;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 100%
  );
  border: none;
}

.submit-button:hover {
  background: linear-gradient(
    135deg,
    var(--color-primary-dark) 0%,
    var(--color-secondary-dark) 100%
  );
}

/* NaiveUI theming */
:deep(.n-card .n-card-header) {
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid var(--color-border);
}

:deep(.n-card .n-card-header .n-card-header__main) {
  font-weight: 600;
  color: var(--color-text-primary);
}

:deep(.n-card .n-card__content) {
  padding: 24px;
}

:deep(.n-form-item .n-form-item-label) {
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

:deep(.n-form-item-feedback-wrapper) {
  min-height: 24px;
}

:deep(.n-form-item) {
  margin-bottom: 20px;
}

:deep(.n-input.n-input--large .n-input-wrapper) {
  padding: 0 16px;
  min-height: 44px;
}

:deep(.n-base-selection.n-base-selection--large) {
  min-height: 44px;
}

:deep(.n-input .n-input__border) {
  border-radius: 8px;
}

:deep(.n-base-selection .n-base-selection__border) {
  border-radius: 8px;
}

:deep(.n-date-picker) {
  width: 100%;
}

:deep(.n-input-number) {
  width: 100%;
}

:deep(.n-divider) {
  margin: 24px 0;
}

:deep(.n-tabs .n-tabs-nav) {
  padding: 0;
}

:deep(.n-tabs .n-tab-pane) {
  padding: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .institution-indicator {
    align-self: flex-start;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  :deep(.n-card .n-card-header),
  :deep(.n-card .n-card__content) {
    padding: 16px;
  }

  .form-actions {
    padding: 16px;
    margin: 0 -16px -16px -16px;
  }

  .semester-preview {
    padding: 16px;
  }

  .preview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
