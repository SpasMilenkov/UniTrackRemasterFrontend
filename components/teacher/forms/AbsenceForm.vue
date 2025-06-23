<!-- components/teacher/forms/AbsenceForm.vue - INTERNATIONALIZED VERSION -->
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
            {{ t(`absenceForm.header.${isEditing ? 'edit' : 'record'}Title`) }}
          </h2>
          <p class="form-subtitle">
            {{ t('absenceForm.header.subtitle') }}
          </p>
        </div>
      </div>

      <!-- Absence Type Indicator -->
      <div class="absence-indicator">
        <n-tag type="warning" size="small">
          <Icon name="ph:clock" class="mr-1" />
          {{ t('absenceForm.header.indicator') }}
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
      <n-card
        :title="t('absenceForm.sections.semesterContext')"
        class="form-card mb-6"
      >
        <template #header-extra>
          <Icon name="ph:calendar" class="text-text-secondary" />
        </template>

        <div class="grid grid-cols-1 gap-6">
          <n-form-item
            :label="t('absenceForm.labels.academicSemester')"
            path="semesterId"
          >
            <n-select
              v-model:value="formModel.semesterId"
              :options="semesterOptions"
              :placeholder="t('absenceForm.placeholders.currentSemester')"
              disabled
              size="large"
            >
              <template #arrow>
                <Icon name="ph:lock" class="text-text-muted" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                {{ t('absenceForm.helpText.autoSelectedSemester') }}
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Student Assignment Card -->
      <n-card
        :title="t('absenceForm.sections.studentSubjectDetails')"
        class="form-card mb-6"
      >
        <template #header-extra>
          <Icon name="ph:user-check" class="text-text-secondary" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Student -->
          <n-form-item
            :label="t('absenceForm.labels.student')"
            path="studentId"
            required
          >
            <n-select
              v-model:value="formModel.studentId"
              :options="studentOptions"
              :placeholder="t('absenceForm.placeholders.selectStudent')"
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
                  <p class="text-text-secondary">
                    {{ t('absenceForm.emptyStates.noStudents') }}
                  </p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                {{ t('absenceForm.helpText.selectStudent') }}
              </div>
            </template>
          </n-form-item>

          <!-- Subject (Optional) -->
          <n-form-item
            :label="t('absenceForm.labels.subjectOptional')"
            path="subjectId"
          >
            <n-select
              v-model:value="formModel.subjectId"
              :options="subjectOptions"
              :placeholder="t('absenceForm.placeholders.selectSubject')"
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
                  <p class="text-text-secondary">
                    {{ t('absenceForm.emptyStates.noSubjects') }}
                  </p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                {{ t('absenceForm.helpText.selectSubject') }}
              </div>
            </template>
          </n-form-item>

          <!-- Teacher (Read-only) -->
          <n-form-item
            :label="t('absenceForm.labels.teacher')"
            class="md:col-span-2"
          >
            <n-select
              :value="teacherId"
              :options="[teacherOption]"
              disabled
              size="large"
              :placeholder="t('absenceForm.placeholders.teacherAssignment')"
            >
              <template #arrow>
                <Icon name="ph:lock" class="text-text-muted" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                {{ t('absenceForm.helpText.autoAssignedTeacher') }}
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Attendance Information Card -->
      <n-card
        :title="t('absenceForm.sections.attendanceDetails')"
        class="form-card mb-6"
      >
        <template #header-extra>
          <Icon name="ph:calendar-check" class="text-text-secondary" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Date -->
          <n-form-item
            :label="t('absenceForm.labels.absenceDate')"
            path="date"
            required
          >
            <n-date-picker
              v-model:value="formModel.date"
              type="date"
              :placeholder="t('absenceForm.placeholders.selectAbsenceDate')"
              :disabled="loading"
              size="large"
              style="width: 100%"
              :max="new Date()"
              :is-date-disabled="isDateDisabled"
            />
            <template #feedback>
              <div class="form-help-text">
                {{ t('absenceForm.helpText.absenceDate') }}
              </div>
            </template>
          </n-form-item>

          <!-- Status -->
          <n-form-item
            :label="t('absenceForm.labels.attendanceStatus')"
            path="status"
            required
          >
            <n-select
              v-model:value="formModel.status"
              :options="absenceStatusOptions"
              :placeholder="
                t('absenceForm.placeholders.selectAttendanceStatus')
              "
              :disabled="loading"
              size="large"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                {{ t('absenceForm.helpText.attendanceStatus') }}
              </div>
            </template>
          </n-form-item>

          <!-- Is Excused -->
          <n-form-item
            :label="t('absenceForm.labels.excusedAbsence')"
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
                    t(
                      `absenceForm.excusedStatus.${formModel.isExcused ? 'excused' : 'unexcused'}Title`
                    )
                  }}
                </div>
                <div class="text-sm text-text-secondary">
                  {{
                    t(
                      `absenceForm.excusedStatus.${formModel.isExcused ? 'excused' : 'unexcused'}Description`
                    )
                  }}
                </div>
              </div>
            </div>
            <template #feedback>
              <div class="form-help-text">
                {{ t('absenceForm.helpText.excusedAbsence') }}
              </div>
            </template>
          </n-form-item>

          <!-- Reason -->
          <n-form-item
            :label="t('absenceForm.labels.reasonForAbsence')"
            path="reason"
            class="md:col-span-2"
          >
            <n-input
              v-model:value="formModel.reason"
              type="textarea"
              :placeholder="t('absenceForm.placeholders.enterReason')"
              :disabled="loading"
              :rows="4"
              :maxlength="500"
              show-count
            />
            <template #feedback>
              <div class="form-help-text">
                {{ t('absenceForm.helpText.reasonForAbsence') }}
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Semester Date Warning -->
      <n-card
        v-if="semesterDateWarning"
        :title="t('absenceForm.sections.dateRangeNotice')"
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
      <n-card
        :title="t('absenceForm.sections.attendanceStatusGuide')"
        class="form-card mb-6"
      >
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
                {{ t(`absenceForm.statusGuide.${statusInfo.value}.label`) }}
              </div>
            </div>
            <div class="text-sm text-text-secondary">
              {{ t(`absenceForm.statusGuide.${statusInfo.value}.description`) }}
            </div>
          </div>
        </div>

        <n-alert type="warning" class="mt-4">
          <Icon name="ph:warning" class="mr-2" />
          {{ t('absenceForm.warnings.unexcusedAbsencesWarning') }}
        </n-alert>
      </n-card>

      <!-- Form Actions -->
      <div class="form-actions">
        <!-- Debug Info -->
        <div class="mb-4 p-3 rounded bg-gray-800 text-xs text-white">
          <p>
            <strong>{{ t('absenceForm.debug.title') }}:</strong>
          </p>
          <p>
            {{ t('absenceForm.debug.date') }}: "{{ formModel.date || 'null' }}"
          </p>
          <p>
            {{ t('absenceForm.debug.status') }}: "{{
              formModel.status || 'null'
            }}"
          </p>
          <p>
            {{ t('absenceForm.debug.isExcused') }}: {{ formModel.isExcused }}
          </p>
          <p>
            {{ t('absenceForm.debug.reason') }}: "{{
              formModel.reason || 'null'
            }}"
          </p>
          <p>
            {{ t('absenceForm.debug.studentId') }}: "{{
              formModel.studentId || 'null'
            }}"
          </p>
          <p>
            {{ t('absenceForm.debug.subjectId') }}: "{{
              formModel.subjectId || 'null'
            }}"
          </p>
          <p>
            {{ t('absenceForm.debug.semesterId') }}: "{{
              formModel.semesterId || 'null'
            }}"
          </p>
          <p>
            {{ t('absenceForm.debug.teacherId') }}: "{{
              formModel.teacherId || 'null'
            }}"
          </p>
          <p>
            {{ t('absenceForm.debug.validationErrors') }}:
            {{ JSON.stringify(validationErrors) }}
          </p>
          <p>
            {{ t('absenceForm.debug.semesterOptions') }}:
            {{ semesterOptions.length }}
          </p>
          <p>
            {{ t('absenceForm.debug.selectedSemester') }}:
            {{ selectedSemesterName || 'null' }}
          </p>
          <p>
            {{ t('absenceForm.debug.propsSemesterId') }}: "{{
              props.semesterId || 'null'
            }}"
          </p>
          <p>
            {{ t('absenceForm.debug.propsSemesterOptionsLength') }}:
            {{ props.semesterOptions?.length || 0 }}
          </p>
          <p>
            {{ t('absenceForm.debug.validationClearTest') }}:
            {{
              Object.keys(validationErrors).length === 0
                ? t('absenceForm.debug.clean')
                : t('absenceForm.debug.hasErrors')
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
            {{ t('absenceForm.actions.clearValidation') }}
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
            {{ t('absenceForm.actions.cancel') }}
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
            {{
              t(`absenceForm.actions.${isEditing ? 'update' : 'record'}Absence`)
            }}
          </n-button>
        </n-space>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useNotification } from 'naive-ui';
import { useI18n } from 'vue-i18n';
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
const { t, locale } = useI18n();

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
  label: props.teacherName || t('absenceForm.defaultValues.currentTeacher'),
  value: props.teacherId || '',
  disabled: true,
}));

// Absence status options
const absenceStatusOptions = computed<SelectOption[]>(() => [
  { label: t('absenceForm.statusOptions.absent'), value: 'absent' },
  { label: t('absenceForm.statusOptions.late'), value: 'late' },
  { label: t('absenceForm.statusOptions.leftEarly'), value: 'left_early' },
  { label: t('absenceForm.statusOptions.sick'), value: 'sick' },
  { label: t('absenceForm.statusOptions.emergency'), value: 'emergency' },
]);

// Status guide for reference
const statusGuide = [
  {
    value: 'absent',
    icon: 'ph:x-circle',
    color: 'text-red-500',
  },
  {
    value: 'late',
    icon: 'ph:clock',
    color: 'text-orange-500',
  },
  {
    value: 'excused',
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
      title: t('absenceForm.warnings.dateBeforeSemester.title'),
      message: t('absenceForm.warnings.dateBeforeSemester.message', {
        date: formatDate(props.currentSemester.startDate),
      }),
    };
  }

  if (absenceDate > semesterEnd) {
    return {
      type: 'warning' as const,
      title: t('absenceForm.warnings.dateAfterSemester.title'),
      message: t('absenceForm.warnings.dateAfterSemester.message', {
        date: formatDate(props.currentSemester.endDate),
      }),
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
  const localeCode = locale.value === 'bg' ? 'bg-BG' : 'en-US';
  return new Date(dateString).toLocaleDateString(localeCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const validateForm = (): boolean => {
  validationErrors.value = {};

  // Validate required fields
  if (!formModel.value.studentId) {
    validationErrors.value.studentId = t(
      'absenceForm.validation.studentRequired'
    );
  }
  if (!formModel.value.status) {
    validationErrors.value.status = t('absenceForm.validation.statusRequired');
  }
  if (!formModel.value.date) {
    validationErrors.value.date = t('absenceForm.validation.dateRequired');
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
      title: t('absenceForm.notifications.validationError.title'),
      content: t('absenceForm.notifications.validationError.content'),
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
      title: t('absenceForm.notifications.validationError.title'),
      content:
        error.message ||
        t('absenceForm.notifications.validationError.fallback'),
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
