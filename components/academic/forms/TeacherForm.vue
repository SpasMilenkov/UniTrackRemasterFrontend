<!-- components/forms/TeacherForm.vue -->
<template>
  <div class="teacher-form-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="flex items-center gap-3 mb-2">
        <div class="header-icon">
          <Icon name="ph:chalkboard-teacher" class="text-xl" />
        </div>
        <div>
          <h2 class="form-title">
            {{ isEditing ? 'Edit' : 'Add' }}
            {{ isHigherEducationComputed ? 'Faculty Member' : 'Teacher' }}
          </h2>
          <p class="form-subtitle">
            {{
              isHigherEducationComputed
                ? 'Register a new faculty member with academic credentials'
                : 'Add a new teacher to the school staff'
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
            :name="
              isHigherEducationComputed
                ? 'ph:university'
                : 'ph:chalkboard-teacher'
            "
            class="mr-1"
          />
          {{ institutionTypeLabel }}
        </n-tag>
      </div>
    </div>

    <n-divider class="my-6" />

    <!-- Form Content -->
    <n-form @submit.prevent="onSubmit">
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
            class="themed-form-item"
          >
            <n-input
              v-model:value="firstName"
              placeholder="Enter first name"
              :disabled="loading"
              size="large"
              class="themed-input"
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
            class="themed-form-item"
          >
            <n-input
              v-model:value="lastName"
              placeholder="Enter last name"
              :disabled="loading"
              size="large"
              class="themed-input"
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
            class="md:col-span-2 themed-form-item"
          >
            <n-input
              v-model:value="email"
              placeholder="Enter email address"
              :disabled="loading || isEditing"
              size="large"
              class="themed-input"
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

      <!-- Professional Information Card -->
      <n-card title="Professional Information" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:identification-badge" class="text-gray-400" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Academic Title -->
          <n-form-item
            :label="isHigherEducationComputed ? 'Academic Title' : 'Title'"
            path="title"
            v-bind="titleProps"
            class="themed-form-item"
          >
            <n-input
              v-model:value="title"
              :placeholder="
                isHigherEducationComputed
                  ? 'e.g., Professor, Assistant Professor, Dr.'
                  : 'e.g., Mr., Ms., Dr.'
              "
              :disabled="loading"
              size="large"
              class="themed-input"
            >
              <template #prefix>
                <Icon name="ph:graduation-cap" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                {{
                  isHigherEducationComputed
                    ? 'Academic rank or professional title'
                    : 'Professional title or honorific'
                }}
              </div>
            </template>
          </n-form-item>

          <!-- Employee ID Display -->
          <n-form-item
            :label="isHigherEducationComputed ? 'Faculty ID' : 'Employee ID'"
            class="themed-form-item"
          >
            <n-input
              :value="generatedEmployeeId"
              placeholder="Auto-generated after creation"
              readonly
              size="large"
              class="themed-input"
            >
              <template #prefix>
                <Icon name="ph:identification-card" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                Employee ID will be automatically generated upon creation
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Institution Assignment Card -->
      <n-card title="Institution Assignment" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:buildings" class="text-gray-400" />
        </template>

        <!-- Institution Selection -->
        <n-form-item
          label="Institution"
          path="institutionId"
          v-bind="institutionIdProps"
          class="mb-6 themed-form-item"
        >
          <n-select
            v-model:value="institutionId"
            :options="[
              {
                label: activeInstitution?.name || 'No Institution Selected',
                value: activeInstitution?.id || '',
              },
            ]"
            placeholder="Select institution"
            disabled
            size="large"
            class="themed-select"
          >
            <template #arrow>
              <Icon name="ph:caret-down" />
            </template>
          </n-select>
          <template #feedback>
            <div class="form-help-text">
              {{ isHigherEducationComputed ? 'Faculty members' : 'Teachers' }}
              are automatically assigned to the currently active institution
            </div>
          </template>
        </n-form-item>

        <!-- Assignment Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- K-12: Homeroom Class Assignment -->
          <n-form-item
            v-if="!isHigherEducationComputed"
            label="Homeroom Class (Optional)"
            path="classGradeId"
            v-bind="classGradeIdProps"
            class="themed-form-item"
          >
            <n-select
              v-model:value="classGradeId"
              :options="gradeOptions"
              placeholder="Select homeroom class"
              clearable
              :disabled="loading || gradeOptions.length === 0"
              :loading="loadingGrades"
              size="large"
              class="themed-select"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="ph:chalkboard-x"
                    class="text-2xl text-gray-400 mb-2"
                  />
                  <p class="text-gray-500">No classes available</p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Optional: Assign as homeroom teacher for a specific class
              </div>
            </template>
          </n-form-item>

          <!-- Higher Education: Department Assignment -->
          <n-form-item
            v-if="isHigherEducationComputed"
            label="Department (Optional)"
            path="departmentId"
            v-bind="departmentIdProps"
            class="themed-form-item"
          >
            <n-select
              v-model:value="departmentId"
              :options="departmentOptions"
              placeholder="Select department"
              clearable
              :disabled="loading || departmentOptions.length === 0"
              :loading="loadingDepartments"
              size="large"
              class="themed-select"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="ph:building-apartment-x"
                    class="text-2xl text-gray-400 mb-2"
                  />
                  <p class="text-gray-500">No departments available</p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Optional: Assign to a specific department
              </div>
            </template>
          </n-form-item>

          <!-- Subject Specialization for K-12 -->
          <n-form-item
            v-if="!isHigherEducationComputed"
            label="Subject Specialization"
            path="specialization"
            v-bind="specializationProps"
            class="themed-form-item"
          >
            <n-input
              v-model:value="specialization"
              placeholder="e.g., Mathematics, English, Science"
              :disabled="loading"
              size="large"
              class="themed-input"
            >
              <template #prefix>
                <Icon name="ph:book-open" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                Primary subject area or teaching specialization
              </div>
            </template>
          </n-form-item>
        </div>
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
            {{ isEditing ? 'Update' : 'Add' }}
            {{ isHigherEducationComputed ? 'Faculty' : 'Teacher' }}
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
import { useInstitutionStore } from '~/stores/institution';
import { useGradeStore } from '~/stores/grade';
import { useDepartmentStore } from '~/stores/department';
import { isHigherEducation as checkIsHigherEducation } from '~/utils/institution-helper';
import { teacherFormSchema } from '~/schemas/teacher.schema';
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
const departmentStore = useDepartmentStore();

// Loading states
const loadingGrades = ref(false);
const loadingDepartments = ref(false);

// Institution type detection
const activeInstitution = computed(() => institutionStore.activeInstitution);
const isHigherEducationComputed = computed(() =>
  checkIsHigherEducation(activeInstitution.value?.type)
);
const institutionTypeLabel = computed(() =>
  isHigherEducationComputed.value ? 'Higher Education' : 'K-12 School'
);

// Form setup with VeeValidate - same pattern as login form
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(teacherFormSchema),
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    institutionId: activeInstitution.value?.id || '',
    classGradeId: null,
    specialization: '',
    departmentId: null,
    ...props.initialValues,
  },
});

// Define form fields with naiveUiFormsConfig - same pattern as login form
const [firstName, firstNameProps] = defineField(
  'firstName',
  naiveUiFormsConfig
);
const [lastName, lastNameProps] = defineField('lastName', naiveUiFormsConfig);
const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [title, titleProps] = defineField('title', naiveUiFormsConfig);
const [institutionId, institutionIdProps] = defineField(
  'institutionId',
  naiveUiFormsConfig
);
const [classGradeId, classGradeIdProps] = defineField(
  'classGradeId',
  naiveUiFormsConfig
);
const [specialization, specializationProps] = defineField(
  'specialization',
  naiveUiFormsConfig
);
const [departmentId, departmentIdProps] = defineField(
  'departmentId',
  naiveUiFormsConfig
);

// Computed options
const gradeOptions = computed<SelectOption[]>(() => {
  if (!gradeStore.grades?.length) return [];

  return gradeStore.grades.map((grade) => ({
    label: grade.name || `Class ${grade.id.substring(0, 4)}`,
    value: grade.id,
  }));
});

const departmentOptions = computed<SelectOption[]>(() => {
  if (!departmentStore.departments?.length) return [];

  return departmentStore.departments.map((dept) => ({
    label: dept.name || `Department ${dept.id.substring(0, 4)}`,
    value: dept.id,
  }));
});

// Generated employee ID for display
const generatedEmployeeId = computed(() => {
  if (props.isEditing && props.initialValues?.employeeId) {
    return props.initialValues.employeeId;
  }
  return isHigherEducationComputed.value ? 'FAC-XXXX-XXXX' : 'TCH-XXXX-XXXX';
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

const loadDepartments = async () => {
  if (!isHigherEducationComputed.value) return;

  loadingDepartments.value = true;
  try {
    await departmentStore.fetchDepartments();
  } catch (error) {
    console.error('Error loading departments:', error);
    message.error('Failed to load departments');
  } finally {
    loadingDepartments.value = false;
  }
};

// Submit form handler - same pattern as login form
const onSubmit = handleSubmit(async (values) => {
  try {
    console.log('Form submitted with values:', values);

    // Convert null values to undefined for optional fields
    const submissionData = { ...values };
    Object.keys(submissionData).forEach((key) => {
      if (submissionData[key] === null) {
        submissionData[key] = undefined;
      }
    });

    console.log('Final submission data:', submissionData);
    emit('submit', submissionData);
  } catch (error: any) {
    console.error('Form submission error:', error);
    message.error(`An error occurred: ${error.message}`);
  }
});

// Initialize data when component mounts
onMounted(async () => {
  console.log('TeacherForm mounted', {
    activeInstitution: activeInstitution.value,
    isHigherEducation: isHigherEducationComputed.value,
    initialValues: props.initialValues,
  });

  if (activeInstitution.value?.id) {
    // Load institution-specific data based on type
    if (isHigherEducationComputed.value) {
      await loadDepartments();
    } else {
      await loadGrades();
    }
  }
});

// Watch for props changes to update form
watch(
  () => props.initialValues,
  (newValues) => {
    if (newValues) {
      console.log('Initial values changed:', newValues);
      // Let VeeValidate handle the reset automatically
    }
  },
  { deep: true, immediate: true }
);

// Watch for active institution changes to update institutionId
watch(
  () => activeInstitution.value?.id,
  (newInstitutionId) => {
    if (newInstitutionId && !props.isEditing) {
      institutionId.value = newInstitutionId;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.teacher-form-container {
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

.institution-display .institution-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.form-help-text {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 4px;
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

/* Same theming pattern as login form */
:deep(.themed-form-item .n-form-item-label) {
  color: var(--color-text-primary) !important;
  font-weight: 600;
}

:deep(.themed-input .n-input__input) {
  background-color: var(--color-background-secondary) !important;
  color: var(--color-text-primary) !important;
}

:deep(.themed-input .n-input__placeholder) {
  color: var(--color-text-muted) !important;
}

:deep(.themed-select .n-base-selection) {
  background-color: var(--color-background-secondary) !important;
}

:deep(.themed-select .n-base-selection .n-base-selection__placeholder) {
  color: var(--color-text-muted) !important;
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
