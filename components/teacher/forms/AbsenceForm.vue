<!-- components/teacher/forms/AbsenceForm.vue - SIMPLIFIED ALL-IN-ONE VERSION -->
<template>
  <div class="absence-form-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="flex items-center gap-3 mb-2">
        <div class="header-icon">
          <Icon name="ph:calendar-x" class="text-xl" />
        </div>
        <div>
          <h2 class="form-title">
            {{ isEditing ? 'Edit' : 'Record' }} Absence
          </h2>
          <p class="form-subtitle">
            Track student attendance with semester context and detailed absence
            documentation
          </p>
        </div>
      </div>

      <!-- Absence Type Indicator -->
      <div class="absence-indicator">
        <n-tag type="warning" size="small">
          <Icon name="ph:clock" class="mr-1" />
          Attendance Record
        </n-tag>
      </div>
    </div>

    <n-divider class="my-6" />

    <!-- Form Content -->
    <n-form
      ref="formRef"
      :model="formModel"
      label-placement="top"
      require-mark-placement="right-hanging"
      @submit.prevent="onSubmit"
    >
      <!-- Semester Context Card (Auto-selected and locked) -->
      <n-card title="Semester Context" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:calendar" class="text-text-secondary" />
        </template>

        <div class="grid grid-cols-1 gap-6">
          <n-form-item label="Academic Semester" path="semesterId">
            <n-select
              v-model:value="formModel.semesterId"
              :options="semesterOptions"
              placeholder="Current semester"
              disabled
              size="large"
            >
              <template #arrow>
                <Icon name="ph:lock" class="text-text-muted" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Automatically selected current semester
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Student Assignment Card -->
      <n-card title="Student & Subject Details" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:user-check" class="text-text-secondary" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Student -->
          <n-form-item label="Student" path="studentId" required>
            <n-select
              v-model:value="formModel.studentId"
              :options="studentOptions"
              placeholder="Select student"
              :disabled="loading || studentOptions.length === 0"
              :loading="loadingStudents"
              size="large"
              filterable
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="ph:user-x"
                    class="text-2xl text-text-secondary mb-2"
                  />
                  <p class="text-text-secondary">No students available</p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Select the student for this attendance record
              </div>
            </template>
          </n-form-item>

          <!-- Subject (Optional) -->
          <n-form-item label="Subject (Optional)" path="subjectId">
            <n-select
              v-model:value="formModel.subjectId"
              :options="subjectOptions"
              placeholder="Select subject (optional)"
              :disabled="loading || subjectOptions.length === 0"
              :loading="loadingSubjects"
              size="large"
              filterable
              clearable
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="ph:book-x"
                    class="text-2xl text-text-secondary mb-2"
                  />
                  <p class="text-text-secondary">No subjects available</p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Link absence to a specific subject (leave empty for general
                absence)
              </div>
            </template>
          </n-form-item>

          <!-- Teacher (Read-only) -->
          <n-form-item label="Teacher" class="md:col-span-2">
            <n-select
              :value="teacherId"
              :options="[teacherOption]"
              disabled
              size="large"
              placeholder="Teacher assignment"
            >
              <template #arrow>
                <Icon name="ph:lock" class="text-text-muted" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Automatically assigned to current teacher
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Attendance Information Card -->
      <n-card title="Attendance Details" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:calendar-check" class="text-text-secondary" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Date -->
          <n-form-item label="Absence Date" path="date" required>
            <n-date-picker
              v-model:value="formModel.date"
              type="date"
              placeholder="Select absence date"
              :disabled="loading"
              size="large"
              style="width: 100%"
              :max="new Date()"
              :is-date-disabled="isDateDisabled"
            />
            <template #feedback>
              <div class="form-help-text">Date when the student was absent</div>
            </template>
          </n-form-item>

          <!-- Status -->
          <n-form-item label="Attendance Status" path="status" required>
            <n-select
              v-model:value="formModel.status"
              :options="absenceStatusOptions"
              placeholder="Select attendance status"
              :disabled="loading"
              size="large"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Choose the appropriate attendance status
              </div>
            </template>
          </n-form-item>

          <!-- Is Excused -->
          <n-form-item
            label="Excused Absence"
            path="isExcused"
            class="md:col-span-2"
          >
            <div class="flex items-center gap-4">
              <n-switch
                v-model:value="formModel.isExcused"
                :disabled="loading"
                size="large"
              >
                <template #checked>
                  <Icon name="ph:check" />
                </template>
                <template #unchecked>
                  <Icon name="ph:x" />
                </template>
              </n-switch>
              <div class="flex-1">
                <div class="font-medium text-text-primary">
                  {{
                    formModel.isExcused
                      ? 'Excused Absence'
                      : 'Unexcused Absence'
                  }}
                </div>
                <div class="text-sm text-text-secondary">
                  {{
                    formModel.isExcused
                      ? 'This absence has a valid reason and documentation'
                      : 'This absence is unexcused and may affect academic standing'
                  }}
                </div>
              </div>
            </div>
            <template #feedback>
              <div class="form-help-text">
                Mark whether this absence is officially excused
              </div>
            </template>
          </n-form-item>

          <!-- Reason -->
          <n-form-item
            label="Reason for Absence"
            path="reason"
            class="md:col-span-2"
          >
            <n-input
              v-model:value="formModel.reason"
              type="textarea"
              placeholder="Enter reason for absence (optional)"
              :disabled="loading"
              :rows="4"
              :maxlength="500"
              show-count
            />
            <template #feedback>
              <div class="form-help-text">
                Optional: Provide additional context or documentation for the
                absence
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Semester Date Warning -->
      <n-card
        v-if="semesterDateWarning"
        title="Date Range Notice"
        class="form-card mb-6"
      >
        <template #header-extra>
          <Icon name="ph:warning" class="text-orange-500" />
        </template>

        <n-alert
          :type="semesterDateWarning.type"
          :title="semesterDateWarning.title"
        >
          <template #icon>
            <Icon name="ph:info" />
          </template>
          {{ semesterDateWarning.message }}
        </n-alert>
      </n-card>

      <!-- Attendance Status Guide -->
      <n-card title="Attendance Status Guide" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:info" class="text-text-secondary" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="statusInfo in statusGuide"
            :key="statusInfo.value"
            class="p-4 rounded-lg border border-border bg-background-secondary"
          >
            <div class="flex items-center gap-2 mb-2">
              <Icon :name="statusInfo.icon" :class="statusInfo.color" />
              <div class="font-medium text-text-primary">
                {{ statusInfo.label }}
              </div>
            </div>
            <div class="text-sm text-text-secondary">
              {{ statusInfo.description }}
            </div>
          </div>
        </div>

        <n-alert type="warning" class="mt-4">
          <Icon name="ph:warning" class="mr-2" />
          Consistent unexcused absences may affect the student's academic
          standing and progression.
        </n-alert>
      </n-card>

      <!-- Form Actions -->
      <div class="form-actions">
        <!-- Debug Info -->
        <div class="mb-4 p-3 rounded bg-gray-800 text-xs text-white">
          <p><strong>Debug Info:</strong></p>
          <p>Date: "{{ formModel.date || 'null' }}"</p>
          <p>Status: "{{ formModel.status || 'null' }}"</p>
          <p>Is Excused: {{ formModel.isExcused }}</p>
          <p>Reason: "{{ formModel.reason || 'null' }}"</p>
          <p>Student ID: "{{ formModel.studentId || 'null' }}"</p>
          <p>Subject ID: "{{ formModel.subjectId || 'null' }}"</p>
          <p>Semester ID: "{{ formModel.semesterId || 'null' }}"</p>
          <p>Teacher ID: "{{ formModel.teacherId || 'null' }}"</p>
          <p>Validation Errors: {{ JSON.stringify(validationErrors) }}</p>
          <p>Semester Options: {{ semesterOptions.length }}</p>
          <p>Selected Semester: {{ selectedSemesterName || 'null' }}</p>
          <p>Props Semester ID: "{{ props.semesterId || 'null' }}"</p>
          <p>
            Props Semester Options Length:
            {{ props.semesterOptions?.length || 0 }}
          </p>
          <p>
            Validation Clear Test:
            {{
              Object.keys(validationErrors).length === 0
                ? 'CLEAN'
                : 'HAS ERRORS'
            }}
          </p>
        </div>

        <n-space justify="end" size="medium">
          <!-- Debug: Manual validation reset button -->
          <n-button
            type="warning"
            ghost
            size="large"
            @click="
              validationErrors = {};
              console.log('Validation errors manually cleared');
            "
          >
            Clear Validation
          </n-button>

          <n-button
            size="large"
            :disabled="loading"
            class="cancel-button"
            @click="emit('cancel')"
          >
            <template #icon>
              <Icon name="ph:x" />
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
              <Icon :name="isEditing ? 'ph:pencil' : 'ph:plus'" />
            </template>
            {{ isEditing ? 'Update' : 'Record' }} Absence
          </n-button>
        </n-space>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useNotification } from 'naive-ui';
import type { SelectOption } from 'naive-ui';
import { useAuthStore } from '@/stores/auth';
import type { CreateAbsenceDto, UpdateAbsenceDto } from '@/stores/teacher';

interface Props {
  initialValues?: any;
  isEditing?: boolean;
  loading?: boolean;
  studentOptions?: SelectOption[];
  subjectOptions?: SelectOption[];
  semesterOptions?: Array<{ label: string; value: string }>;
  teacherId?: string;
  teacherName?: string;
  semesterId?: string | null;
  institutionId?: string;
  loadingStudents?: boolean;
  loadingSubjects?: boolean;
  currentSemester?: any;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  loading: false,
  loadingStudents: false,
  loadingSubjects: false,
  studentOptions: () => [],
  subjectOptions: () => [],
  semesterOptions: () => [],
});

const emit = defineEmits<{
  (e: 'submit', data: CreateAbsenceDto | UpdateAbsenceDto): void;
  (e: 'cancel'): void;
}>();

// Utilities
const notification = useNotification();
const authStore = useAuthStore();

// Form reference
const formRef = ref();

// Form state
const validationErrors = ref<Record<string, string>>({});

// Form model
const formModel = ref({
  date: new Date(),
  status: '',
  reason: '',
  isExcused: false,
  studentId: '',
  teacherId: props.teacherId || '',
  subjectId: null as string | null,
  semesterId: props.semesterId || null,
});

// Computed properties
const institutionId = computed(() => {
  return props.institutionId || authStore.user?.institutionId || '';
});

const selectedSemesterName = computed(() => {
  if (!formModel.value.semesterId) return null;
  const semester = props.semesterOptions.find(
    (s) => s.value === formModel.value.semesterId
  );
  return semester?.label || null;
});

const teacherOption = computed(() => ({
  label: props.teacherName || 'Current Teacher',
  value: props.teacherId || '',
  disabled: true,
}));

// Absence status options
const absenceStatusOptions = computed<SelectOption[]>(() => [
  { label: 'Absent', value: 'absent' },
  { label: 'Late arrival', value: 'late' },
  { label: 'Left Early', value: 'left_early' },
  { label: 'Sick Leave', value: 'sick' },
  { label: 'Emergency', value: 'emergency' },
]);

// Status guide for reference
const statusGuide = [
  {
    value: 'absent',
    label: 'Absent',
    description: 'Student was not present for the entire period/day',
    icon: 'ph:x-circle',
    color: 'text-red-500',
  },
  {
    value: 'late',
    label: 'Late',
    description: 'Student arrived after the official start time',
    icon: 'ph:clock',
    color: 'text-orange-500',
  },
  {
    value: 'excused',
    label: 'Excused',
    description: 'Absence with valid documentation and approval',
    icon: 'ph:check-circle',
    color: 'text-primary',
  },
];

// Semester date validation
const semesterDateWarning = computed(() => {
  if (!props.currentSemester || !formModel.value.date) return null;

  const absenceDate = new Date(formModel.value.date);
  const semesterStart = new Date(props.currentSemester.startDate);
  const semesterEnd = new Date(props.currentSemester.endDate);

  if (absenceDate < semesterStart) {
    return {
      type: 'warning' as const,
      title: 'Date Before Semester',
      message: `The selected date is before the semester start date (${formatDate(props.currentSemester.startDate)}).`,
    };
  }

  if (absenceDate > semesterEnd) {
    return {
      type: 'warning' as const,
      title: 'Date After Semester',
      message: `The selected date is after the semester end date (${formatDate(props.currentSemester.endDate)}).`,
    };
  }

  return null;
});

// Methods
const isDateDisabled = (date: number) => {
  const today = new Date();
  const checkDate = new Date(date);

  // Don't allow future dates beyond today
  if (checkDate > today) return true;

  // Don't allow dates more than 1 year ago
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  if (checkDate < oneYearAgo) return true;

  return false;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const validateForm = (): boolean => {
  validationErrors.value = {};

  // Validate required fields
  if (!formModel.value.studentId) {
    validationErrors.value.studentId = 'Student is required';
  }
  if (!formModel.value.status) {
    validationErrors.value.status = 'Status is required';
  }
  if (!formModel.value.date) {
    validationErrors.value.date = 'Date is required';
  }

  return Object.keys(validationErrors.value).length === 0;
};

const clearValidationError = (field: string) => {
  if (validationErrors.value[field]) {
    delete validationErrors.value[field];
  }
};

// Submit form handler
const onSubmit = () => {
  if (!validateForm()) {
    notification.error({
      title: 'Validation Error',
      content: 'Please check the form for errors',
      duration: 5000,
    });
    return;
  }

  try {
    // Prepare submission data
    const submissionData: CreateAbsenceDto | UpdateAbsenceDto = {
      date:
        typeof formModel.value.date === 'string'
          ? formModel.value.date
          : typeof formModel.value.date === 'number'
            ? new Date(formModel.value.date).toISOString().split('T')[0]
            : formModel.value.date.toISOString().split('T')[0],
      status: formModel.value.status,
      isExcused: formModel.value.isExcused,
      reason: formModel.value.reason || undefined,
      studentId: formModel.value.studentId,
      subjectId: formModel.value.subjectId || undefined,
      teacherId: formModel.value.teacherId || undefined,
      semesterId: formModel.value.semesterId || undefined,
    };

    console.log('Submitting absence data:', submissionData);
    emit('submit', submissionData);
  } catch (error: any) {
    notification.error({
      title: 'Validation Error',
      content: error.message || 'Please check your form inputs',
      duration: 5000,
    });
  }
};

const resetForm = () => {
  formModel.value = {
    date: new Date(),
    status: '',
    reason: '',
    isExcused: false,
    studentId: '',
    teacherId: props.teacherId || '',
    subjectId: null,
    semesterId: props.semesterId || null,
  };
  // FORCE CLEAR all validation errors
  validationErrors.value = {};
  console.log('Form reset, validation errors cleared:', validationErrors.value);
};

// Watch for props changes
watch(
  () => props.teacherId,
  (newTeacherId) => {
    if (newTeacherId) {
      formModel.value.teacherId = newTeacherId;
    }
  }
);

watch(
  () => props.semesterId,
  (newSemesterId) => {
    if (newSemesterId && !props.isEditing) {
      formModel.value.semesterId = newSemesterId;
    }
  }
);

watch(
  () => props.initialValues,
  (newValues) => {
    if (newValues && props.isEditing) {
      Object.assign(formModel.value, newValues);

      // Handle date properly
      if (newValues.date) {
        formModel.value.date =
          typeof newValues.date === 'string'
            ? new Date(newValues.date)
            : newValues.date;
      }
    }
  },
  { deep: true, immediate: true }
);

// Watch isExcused to clear validation errors (no validation logic needed)
watch(
  () => formModel.value.isExcused,
  () => {
    // Just clear any potential reason error when toggling
    clearValidationError('reason');
  }
);

// Watch form fields to clear validation errors
watch(
  () => formModel.value.studentId,
  () => clearValidationError('studentId')
);

watch(
  () => formModel.value.status,
  () => clearValidationError('status')
);

watch(
  () => formModel.value.date,
  () => clearValidationError('date')
);

watch(
  () => formModel.value.reason,
  () => clearValidationError('reason')
);

// Initialize on mount
onMounted(() => {
  // Auto-select current semester and lock it
  if (props.semesterId && !props.isEditing) {
    formModel.value.semesterId = props.semesterId;
  }

  // Set teacher ID
  if (props.teacherId) {
    formModel.value.teacherId = props.teacherId;
  }

  // Initialize from initial values if editing
  if (props.isEditing && props.initialValues) {
    Object.assign(formModel.value, props.initialValues);

    // Handle date properly
    if (props.initialValues.date) {
      formModel.value.date =
        typeof props.initialValues.date === 'string'
          ? new Date(props.initialValues.date)
          : props.initialValues.date;
    }
  }
});

// Expose methods
defineExpose({
  resetForm,
});
</script>

<style scoped>
.absence-form-container {
  max-width: 800px;
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
    var(--color-primary, #4ade80) 0%,
    var(--color-secondary, #3b82f6) 100%
  );
  color: white;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary, #f5f5f5);
}

.form-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary, #9ca3af);
  margin: 4px 0 0 0;
}

.absence-indicator {
  flex-shrink: 0;
}

.form-card {
  background: var(--color-background-card, #18181c);
  border: 1px solid var(--color-border, #374151);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.form-card:hover {
  border-color: var(--color-primary, #4ade80);
}

.form-help-text {
  font-size: 12px;
  color: var(--color-text-muted, rgba(156, 163, 175, 0.7));
  margin-top: 4px;
}

.form-actions {
  background: var(--color-background-card, #18181c);
  border-top: 1px solid var(--color-border, #374151);
  padding: 24px;
  margin: 0 -24px -24px -24px;
  border-radius: 0 0 12px 12px;
}

.cancel-button {
  min-width: 100px;
  color: var(--color-text-secondary, #9ca3af);
}

.submit-button {
  min-width: 140px;
  background: linear-gradient(
    135deg,
    var(--color-primary, #4ade80) 0%,
    var(--color-secondary, #3b82f6) 100%
  );
  border: none;
}

.submit-button:hover {
  background: linear-gradient(
    135deg,
    var(--color-primary-dark, #22c55e) 0%,
    var(--color-secondary-dark, #2563eb) 100%
  );
}

/* NaiveUI theming */
:deep(.n-card .n-card-header) {
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid var(--color-border, #374151);
}

:deep(.n-card .n-card-header .n-card-header__main) {
  font-weight: 600;
  color: var(--color-text-primary, #f5f5f5);
}

:deep(.n-card .n-card__content) {
  padding: 24px;
}

:deep(.n-form-item .n-form-item-label) {
  font-weight: 500;
  color: var(--color-text-primary, #f5f5f5);
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

:deep(.n-divider) {
  margin: 24px 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .absence-indicator {
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
}
</style>
