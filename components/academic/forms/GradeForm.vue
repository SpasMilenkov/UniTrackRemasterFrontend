<!-- components/forms/GradeForm.vue -->
<template>
  <div class="grade-form-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="flex items-center gap-3 mb-2">
        <div class="header-icon">
          <Icon name="ph:graduation-cap" class="text-xl" />
        </div>
        <div>
          <h2 class="form-title">
            {{ isEditing ? 'Edit' : 'Create' }}
            {{ isHigherEducationComputed ? 'Class' : 'Grade' }}
          </h2>
          <p class="form-subtitle">
            {{
              isHigherEducationComputed
                ? 'Configure class details for university courses'
                : 'Set up grade level information for K-12 students'
            }}
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
          <Icon name="ph:info" class="text-gray-400" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Grade/Class Name -->
          <n-form-item
            :label="isHigherEducationComputed ? 'Class Name' : 'Grade Name'"
            path="name"
            v-bind="nameProps"
            required
          >
            <n-input
              v-model:value="name"
              :placeholder="
                isHigherEducationComputed ? 'e.g., CS-101-A' : 'e.g., Grade 5A'
              "
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:text-aa" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                {{
                  isHigherEducationComputed
                    ? 'Enter the class identifier (e.g., course code and section)'
                    : 'Enter the grade level name (e.g., Grade 1, Kindergarten)'
                }}
              </div>
            </template>
          </n-form-item>

          <!-- Institution Selection -->
          <n-form-item
            label="Institution"
            path="institutionId"
            v-bind="institutionIdProps"
            required
          >
            <n-select
              v-model:value="institutionId"
              :options="institutionOptions"
              placeholder="Select institution"
              :disabled="loading || isEditing"
              size="large"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
            </n-select>
          </n-form-item>
        </div>
      </n-card>

      <!-- Academic Configuration Card -->
      <n-card title="Academic Configuration" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:calendar" class="text-gray-400" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              :disabled="loading || !institutionId"
              :loading="loadingAcademicYears"
              size="large"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="ph:calendar-x"
                    class="text-2xl text-gray-400 mb-2"
                  />
                  <p class="text-gray-500">No academic years available</p>
                </div>
              </template>
            </n-select>
          </n-form-item>

          <!-- Home Room Teacher (School Only) -->
          <n-form-item
            v-if="!isHigherEducationComputed"
            label="Home Room Teacher"
            path="homeRoomTeacherId"
            v-bind="homeRoomTeacherIdProps"
          >
            <n-select
              v-model:value="homeRoomTeacherId"
              :options="teacherOptions"
              placeholder="Select home room teacher (optional)"
              clearable
              :disabled="loading || !institutionId"
              :loading="loadingTeachers"
              size="large"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon name="ph:user-x" class="text-2xl text-gray-400 mb-2" />
                  <p class="text-gray-500">No teachers available</p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                The main teacher responsible for this grade's homeroom
                activities
              </div>
            </template>
          </n-form-item>

          <!-- Placeholder for Higher Education (to maintain grid) -->
          <div v-if="isHigherEducationComputed" class="hidden md:block" />
        </div>
      </n-card>

      <!-- Additional Information for Higher Education -->
      <n-card
        v-if="isHigherEducationComputed"
        title="Class Details"
        class="form-card mb-6"
      >
        <template #header-extra>
          <Icon name="ph:graduation-cap" class="text-gray-400" />
        </template>

        <n-alert type="info" class="mb-4">
          <Icon name="ph:info" />
          For university classes, homeroom teachers are not applicable. Course
          instructors are managed separately through the course assignment
          system.
        </n-alert>
      </n-card>

      <!-- Form Actions -->
      <div class="form-actions">
        <n-space justify="end" size="medium" class="bg-card-color">
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
            {{ isEditing ? 'Update' : 'Create' }}
            {{ isHigherEducationComputed ? 'Class' : 'Grade' }}
          </n-button>
        </n-space>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useMessage } from 'naive-ui';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import { gradeFormSchema, type GradeFormSchema } from '~/schemas/grade.schema';
import { useInstitutionStore } from '~/stores/institution';
import { useAcademicYearStore } from '~/stores/academic-year';
import { useTeacherStore } from '~/stores/teacher';
import { isHigherEducation as checkIsHigherEducation } from '~/utils/institution-helper';
import type { SelectOption } from 'naive-ui';

interface Props {
  initialValues?: Partial<GradeFormSchema>;
  isEditing?: boolean;
  loading?: boolean;
  institutionType?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  loading: false,
});

const emit = defineEmits<{
  (e: 'submit', data: GradeFormSchema): void;
  (e: 'cancel'): void;
}>();

// Stores and utilities
const message = useMessage();
const institutionStore = useInstitutionStore();
const academicYearStore = useAcademicYearStore();
const teacherStore = useTeacherStore();

// Form reference
const formRef = ref();

// Loading states
const loadingAcademicYears = ref(false);
const loadingTeachers = ref(false);

// Institution type detection
const activeInstitution = computed(() => institutionStore.activeInstitution);
const isHigherEducationComputed = computed(() =>
  checkIsHigherEducation(activeInstitution.value?.type)
);
const institutionTypeLabel = computed(() =>
  isHigherEducationComputed.value ? 'Higher Education' : 'K-12 School'
);

// Form data reactive object
const formData = ref({
  name: '',
  institutionId: activeInstitution.value?.id || '',
  academicYearId: '',
  homeRoomTeacherId: null,
  ...props.initialValues,
});

// Form setup with VeeValidate
const { handleSubmit, defineField, resetForm } = useForm({
  validationSchema: toTypedSchema(gradeFormSchema),
  initialValues: formData.value,
});

// Define form fields
const [name, nameProps] = defineField('name', naiveUiFormsConfig);
const [institutionId, institutionIdProps] = defineField(
  'institutionId',
  naiveUiFormsConfig
);
const [academicYearId, academicYearIdProps] = defineField(
  'academicYearId',
  naiveUiFormsConfig
);
const [homeRoomTeacherId, homeRoomTeacherIdProps] = defineField(
  'homeRoomTeacherId',
  naiveUiFormsConfig
);

// Computed options
const institutionOptions = computed<SelectOption[]>(() => {
  if (activeInstitution.value) {
    return [
      {
        label: activeInstitution.value.name || 'Active Institution',
        value: activeInstitution.value.id,
      },
    ];
  }
  return [];
});

const academicYearOptions = computed<SelectOption[]>(() => {
  if (!academicYearStore.academicYears?.length) return [];

  return academicYearStore.academicYears.map((year) => ({
    label: year.name || `Year ${year.id.substring(0, 4)}`,
    value: year.id,
  }));
});

const teacherOptions = computed<SelectOption[]>(() => {
  if (!teacherStore.teachers?.length) return [];

  return teacherStore.teachers.map((teacher) => ({
    label:
      `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() ||
      'Unnamed Teacher',
    value: teacher.id,
  }));
});

// Watch institutionId changes to load associated data
watch(
  institutionId,
  async (newValue) => {
    if (newValue) {
      await Promise.all([loadAcademicYears(newValue), loadTeachers(newValue)]);
    }
  },
  { immediate: true }
);

// Helper functions
const loadAcademicYears = async (institutionId: string) => {
  loadingAcademicYears.value = true;
  try {
    await academicYearStore.fetchAcademicYearsByInstitution(institutionId);
  } catch (error) {
    console.error('Error loading academic years:', error);
    message.error('Failed to load academic years');
  } finally {
    loadingAcademicYears.value = false;
  }
};

const loadTeachers = async (institutionId: string) => {
  // Only load teachers for K-12 schools since universities don't use homeroom teachers
  if (isHigherEducationComputed.value) return;

  loadingTeachers.value = true;
  try {
    await teacherStore.teachersByInstitutionQuery(institutionId);
  } catch (error) {
    console.error('Error loading teachers:', error);
    message.error('Failed to load teachers');
  } finally {
    loadingTeachers.value = false;
  }
};

// Submit form handler
const onSubmit = handleSubmit((formValues) => {
  try {
    // For higher education, remove homeRoomTeacherId if it exists
    const submissionData = { ...formValues };
    if (isHigherEducationComputed.value) {
      delete submissionData.homeRoomTeacherId;
    }

    emit('submit', submissionData as GradeFormSchema);
  } catch (error: any) {
    message.error(`An error occurred: ${error.message}`);
  }
});

// Initialize data when component mounts
onMounted(async () => {
  if (props.isEditing && institutionId.value) {
    await Promise.all([
      loadAcademicYears(institutionId.value),
      loadTeachers(institutionId.value),
    ]);
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
</script>

<style scoped>
.grade-form-container {
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
    var(--primary-color, #4ade80) 0%,
    var(--secondary-color, #3b82f6) 100%
  );
  color: white;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary, #1f2937);
}

.form-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary, #6b7280);
  margin: 4px 0 0 0;
}

.institution-indicator {
  flex-shrink: 0;
}

.form-card {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.form-card:hover {
  border-color: var(--primary-color, #4ade80);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-help-text {
  font-size: 12px;
  color: var(--text-color-3, #9ca3af);
  margin-top: 4px;
}

.form-actions {
  background: var(--card-color);
  border-top: 1px solid var(--border-color);
  padding: 24px;
  margin: 0 -24px -24px -24px;
  border-radius: 0 0 12px 12px;
}

.cancel-button {
  min-width: 100px;
}

.submit-button {
  min-width: 120px;
  background: linear-gradient(
    135deg,
    var(--primary-color, #4ade80) 0%,
    var(--secondary-color, #3b82f6) 100%
  );
  border: none;
}

.submit-button:hover {
  background: linear-gradient(
    135deg,
    var(--primary-color, #22c55e) 0%,
    var(--secondary-color, #2563eb) 100%
  );
}

/* NaiveUI theming */
:deep(.n-card .n-card-header) {
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid var(--border-color, #f3f4f6);
}

:deep(.n-card .n-card-header .n-card-header__main) {
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
}

:deep(.n-card .n-card__content) {
  padding: 24px;
}

:deep(.n-form-item .n-form-item-label) {
  font-weight: 500;
  color: var(--text-color-1, #374151);
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

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .form-title {
    color: var(--color-text-primary, #f9fafb);
  }

  .form-subtitle {
    color: var(--color-text-secondary, #d1d5db);
  }

  .form-card {
    background: var(--card-color, #1f2937);
    border-color: var(--border-color, #374151);
  }
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
}
</style>
