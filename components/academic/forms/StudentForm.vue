<!-- components/forms/StudentForm.vue -->
<template>
  <div class="student-form-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="flex items-center gap-3 mb-2">
        <div class="header-icon">
          <Icon name="ph:student" class="text-xl" />
        </div>
        <div>
          <h2 class="form-title">
            {{ isEditing ? 'Edit' : 'Create' }} Student
          </h2>
          <p class="form-subtitle">
            {{
              isHigherEducationComputed
                ? 'Register a new university student with academic details'
                : 'Add a new K-12 student to the school system'
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
      <!-- Personal Information Card -->
      <n-card title="Personal Information" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:user" class="text-gray-400" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- First Name -->
          <n-form-item
            label="First Name"
            path="firstName"
            v-bind="firstNameProps"
            required
          >
            <n-input
              v-model:value="firstName"
              placeholder="Enter first name"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:user" class="text-gray-400" />
              </template>
            </n-input>
          </n-form-item>

          <!-- Last Name -->
          <n-form-item
            label="Last Name"
            path="lastName"
            v-bind="lastNameProps"
            required
          >
            <n-input
              v-model:value="lastName"
              placeholder="Enter last name"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:user" class="text-gray-400" />
              </template>
            </n-input>
          </n-form-item>

          <!-- Email -->
          <n-form-item
            label="Email Address"
            path="email"
            v-bind="emailProps"
            required
            class="md:col-span-2"
          >
            <n-input
              v-model:value="email"
              placeholder="Enter email address"
              :disabled="loading || isEditing"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:envelope" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                {{
                  isEditing
                    ? 'Email cannot be changed after creation'
                    : 'This will be used for login and communications'
                }}
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Academic Assignment Card -->
      <n-card title="Academic Assignment" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:graduation-cap" class="text-gray-400" />
        </template>

        <!-- Institution Display (Read-only) -->
        <n-form-item label="Institution" class="mb-6">
          <div class="institution-display">
            <div
              class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border"
            >
              <div class="institution-icon">
                <Icon
                  :name="
                    isHigherEducationComputed ? 'ph:university' : 'ph:student'
                  "
                  class="text-xl text-primary"
                />
              </div>
              <div class="flex-1">
                <div class="font-medium text-text-primary">
                  {{ activeInstitution?.name || 'No Institution Selected' }}
                </div>
                <div class="text-sm text-text-secondary">
                  {{ institutionTypeLabel }}
                </div>
              </div>
              <n-tag
                :type="isHigherEducationComputed ? 'info' : 'success'"
                size="small"
              >
                {{ isHigherEducationComputed ? 'Higher Ed' : 'K-12' }}
              </n-tag>
            </div>
          </div>
          <template #feedback>
            <div class="form-help-text">
              Students are automatically assigned to the currently active
              institution
            </div>
          </template>
        </n-form-item>

        <!-- Grade/Class Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <n-form-item
            :label="isHigherEducationComputed ? 'Class Level' : 'Grade Level'"
            path="gradeId"
            v-bind="gradeIdProps"
            required
          >
            <n-select
              v-model:value="gradeId"
              :options="gradeOptions"
              :placeholder="`Select ${isHigherEducationComputed ? 'class' : 'grade'} level`"
              :disabled="loading || gradeOptions.length === 0"
              :loading="loadingGrades"
              size="large"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="ph:graduation-cap-x"
                    class="text-2xl text-gray-400 mb-2"
                  />
                  <p class="text-gray-500">
                    No
                    {{
                      isHigherEducationComputed ? 'classes' : 'grades'
                    }}
                    available
                  </p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                {{
                  gradeOptions.length === 0
                    ? `Please create ${isHigherEducationComputed ? 'classes' : 'grades'} first before adding students`
                    : `Assign student to a ${isHigherEducationComputed ? 'class' : 'grade'} level`
                }}
              </div>
            </template>
          </n-form-item>

          <!-- Student ID (Auto-generated display) -->
          <n-form-item label="Student ID" class="student-id-display">
            <n-input
              :value="generatedStudentId"
              placeholder="Auto-generated after creation"
              readonly
              size="large"
            >
              <template #prefix>
                <Icon name="ph:identification-badge" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                Student ID will be automatically generated upon creation
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Higher Education Specific Information -->
      <n-card
        v-if="isHigherEducationComputed"
        title="University Details"
        class="form-card mb-6"
      >
        <template #header-extra>
          <Icon name="ph:university" class="text-gray-400" />
        </template>

        <n-alert type="info" class="mb-4">
          <Icon name="ph:info" />
          University students will be automatically enrolled in the
          institution's academic programs. Course selections and major
          declarations can be managed after student creation.
        </n-alert>
      </n-card>

      <!-- K-12 Specific Information -->
      <n-card
        v-if="!isHigherEducationComputed"
        title="School Details"
        class="form-card mb-6"
      >
        <template #header-extra>
          <Icon name="ph:student" class="text-gray-400" />
        </template>

        <n-alert type="info" class="mb-4">
          <Icon name="ph:info" />
          K-12 students will be assigned to their grade level and can
          participate in school activities, clubs, and academic programs
          appropriate for their age group.
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
              <Icon :name="isEditing ? 'ph:pencil' : 'ph:user-plus'" />
            </template>
            {{ isEditing ? 'Update' : 'Create' }} Student
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
import { z } from 'zod';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import { useInstitutionStore } from '~/stores/institution';
import { useGradeStore } from '~/stores/grade';
import { isHigherEducation as checkIsHigherEducation } from '~/utils/institution-helper';
import type { SelectOption } from 'naive-ui';

interface Props {
  initialValues?: any;
  isEditing?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  loading: false,
});

const emit = defineEmits<{
  (e: 'submit', data: any): void;
  (e: 'cancel'): void;
}>();

// Stores and utilities
const message = useMessage();
const institutionStore = useInstitutionStore();
const gradeStore = useGradeStore();

// Form reference
const formRef = ref();

// Loading states
const loadingGrades = ref(false);

// Institution type detection
const activeInstitution = computed(() => institutionStore.activeInstitution);
const isHigherEducationComputed = computed(() =>
  checkIsHigherEducation(activeInstitution.value?.type)
);
const institutionTypeLabel = computed(() =>
  isHigherEducationComputed.value ? 'Higher Education' : 'K-12 School'
);

// Define the student form schema
const studentFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  gradeId: z.string().min(1, 'Grade/Class is required'),
  // Higher education specific fields
  expectedGraduationYear: z.number().nullable().optional(),
  enrollmentStatus: z.string().nullable().optional(),
  // K-12 specific fields
  guardianContact: z.string().optional(),
  emergencyContact: z.string().optional(),
});

// Form data reactive object
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  gradeId: '',
  expectedGraduationYear: null,
  enrollmentStatus: null,
  guardianContact: '',
  emergencyContact: '',
  ...props.initialValues,
});

// Form setup with VeeValidate
const { handleSubmit, defineField, resetForm } = useForm({
  validationSchema: toTypedSchema(studentFormSchema),
  initialValues: formData.value,
});

// Define form fields
const [firstName, firstNameProps] = defineField(
  'firstName',
  naiveUiFormsConfig
);
const [lastName, lastNameProps] = defineField('lastName', naiveUiFormsConfig);
const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [gradeId, gradeIdProps] = defineField('gradeId', naiveUiFormsConfig);

// Computed options
const gradeOptions = computed<SelectOption[]>(() => {
  if (!gradeStore.grades?.length) return [];

  return gradeStore.grades.map((grade) => ({
    label:
      grade.name ||
      `${isHigherEducationComputed.value ? 'Class' : 'Grade'} ${grade.id.substring(0, 4)}`,
    value: grade.id,
  }));
});

// Generated student ID for display
const generatedStudentId = computed(() => {
  if (props.isEditing && props.initialValues?.studentId) {
    return props.initialValues.studentId;
  }
  return isHigherEducationComputed.value ? 'UNI-XXXX-XXXX' : 'SCH-XXXX-XXXX';
});

// Watch gradeId changes to load associated data if needed
watch(gradeId, async (newValue) => {
  if (newValue) {
    // Additional logic for grade-specific data loading can be added here
    console.log('Grade selected:', newValue);
  }
});

// Helper functions
const loadGrades = async () => {
  if (!activeInstitution.value?.id) return;

  loadingGrades.value = true;
  try {
    await gradeStore.fetchGradesByInstitution(activeInstitution.value.id);
  } catch (error) {
    console.error('Error loading grades:', error);
    message.error('Failed to load grades');
  } finally {
    loadingGrades.value = false;
  }
};

// Submit form handler
const onSubmit = handleSubmit((formValues) => {
  try {
    // Prepare submission data based on institution type
    const submissionData = {
      ...formValues,
      // Add institution-specific flags
      isSchoolStudent: !isHigherEducationComputed.value,
      isUniversityStudent: isHigherEducationComputed.value,
      // Set institution IDs based on type
      ...(isHigherEducationComputed.value
        ? { universityId: activeInstitution.value?.id }
        : { schoolId: activeInstitution.value?.id }),
    };

    // Clean up unused fields based on institution type
    if (isHigherEducationComputed.value) {
      delete submissionData.guardianContact;
      delete submissionData.emergencyContact;
    } else {
      delete submissionData.expectedGraduationYear;
      delete submissionData.enrollmentStatus;
    }

    emit('submit', submissionData);
  } catch (error: any) {
    message.error(`An error occurred: ${error.message}`);
  }
});

// Initialize data when component mounts
onMounted(async () => {
  if (activeInstitution.value?.id) {
    await loadGrades();

    // Set first grade as default if available and not editing
    if (!props.isEditing && gradeStore.grades.length > 0 && !gradeId.value) {
      gradeId.value = gradeStore.grades[0].id;
    }
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
.student-form-container {
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
  color: var(--text-color-1, #1f2937);
}

.form-subtitle {
  font-size: 14px;
  color: var(--text-color-2, #6b7280);
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

.institution-display .institution-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(var(--primary-color-rgb, 74, 222, 128), 0.1);
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
  min-width: 140px;
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
  color: var(--text-color-1, #1f2937);
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
    color: var(--text-color-1, #f9fafb);
  }

  .form-subtitle {
    color: var(--text-color-2, #d1d5db);
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
