<!-- components/academic/forms/DepartmentForm.vue -->
<template>
  <div class="department-form-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="flex items-center gap-3 mb-2">
        <div class="header-icon">
          <Icon name="ph:office-chair" class="text-xl" />
        </div>
        <div>
          <h2 class="form-title">
            {{ isEditing ? 'Edit' : 'Create' }} Department
          </h2>
          <p class="form-subtitle">
            {{
              isEditing
                ? 'Update department information and organizational details'
                : 'Add a new department to the faculty with all necessary details'
            }}
          </p>
        </div>
      </div>

      <!-- Institution Type Indicator -->
      <div class="institution-indicator">
        <n-tag type="info" size="small">
          <Icon name="ph:office-chair" class="mr-1" />
          Academic Department
        </n-tag>
      </div>
    </div>

    <n-divider class="my-6" />

    <!-- Form Content -->
    <n-form
      ref="formRef"
      label-placement="top"
      require-mark-placement="right-hanging"
      @submit.prevent="onSubmit"
    >
      <!-- Basic Information Card -->
      <n-card title="Basic Information" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:info" class="text-gray-400" />
        </template>

        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6"
        >
          <!-- Department Name -->
          <n-form-item
            label="Department Name"
            path="name"
            v-bind="nameProps"
            required
            class="col-span-1 md:col-span-2"
          >
            <n-input
              v-model:value="name"
              placeholder="Enter department name (e.g., Computer Science Department)"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:office-chair" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                The official name of the department
              </div>
            </template>
          </n-form-item>

          <!-- Department Code -->
          <n-form-item label="Department Code" path="code" v-bind="codeProps">
            <n-input
              v-model:value="code"
              placeholder="Enter department code (e.g., CS, ENG)"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:hash" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                Short code for identification (optional)
              </div>
            </template>
          </n-form-item>

          <!-- Department Type -->
          <n-form-item
            label="Department Type"
            path="type"
            v-bind="typeProps"
            required
          >
            <n-select
              v-model:value="type"
              :options="typeOptions"
              placeholder="Select department type"
              :disabled="loading"
              size="large"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Category that best describes this department
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Faculty Assignment Card -->
      <n-card title="Faculty Assignment" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:buildings" class="text-gray-400" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <!-- Faculty Selection -->
          <n-form-item
            label="Faculty"
            path="facultyId"
            v-bind="facultyIdProps"
            required
          >
            <n-select
              v-model:value="facultyId"
              :options="facultyOptions"
              placeholder="Select faculty"
              :disabled="loading"
              size="large"
              filterable
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="ph:buildings"
                    class="text-2xl text-gray-400 mb-2"
                  />
                  <p class="text-gray-500">No faculties available</p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                The faculty this department belongs to
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
              placeholder="Select department status"
              :disabled="loading"
              size="large"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Current operational status of the department
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Location & Details Card -->
      <n-card title="Location & Details" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:map-pin" class="text-gray-400" />
        </template>

        <div class="space-y-6">
          <!-- Location -->
          <n-form-item label="Location" path="location" v-bind="locationProps">
            <n-input
              v-model:value="location"
              placeholder="Department location (e.g., Building A, Floor 3)"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:map-pin" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                Physical location of the department (optional)
              </div>
            </template>
          </n-form-item>

          <!-- Description -->
          <n-form-item
            label="Description"
            path="description"
            v-bind="descriptionProps"
          >
            <n-input
              v-model:value="description"
              type="textarea"
              placeholder="Brief description of the department and its purpose"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :disabled="loading"
              size="large"
            />
            <template #feedback>
              <div class="form-help-text">
                A brief overview of the department's mission and activities
                (optional)
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Contact Information Card -->
      <n-card title="Contact Information" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:address-book" class="text-gray-400" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <!-- Contact Email -->
          <n-form-item
            label="Contact Email"
            path="contactEmail"
            v-bind="contactEmailProps"
          >
            <n-input
              v-model:value="contactEmail"
              placeholder="contact@department.university.edu"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:envelope" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                Main contact email for department inquiries (optional)
              </div>
            </template>
          </n-form-item>

          <!-- Contact Phone -->
          <n-form-item
            label="Contact Phone"
            path="contactPhone"
            v-bind="contactPhoneProps"
          >
            <n-input
              v-model:value="contactPhone"
              placeholder="+1 (555) 123-4567"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:phone" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                Main contact phone number for the department (optional)
              </div>
            </template>
          </n-form-item>
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
            {{ isEditing ? 'Update' : 'Create' }} Department
          </n-button>
        </n-space>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useMessage } from 'naive-ui';
import { DepartmentStatus } from '~/enums/department-status.enum';
import { DepartmentType } from '~/enums/department-type.enum';
import {
  departmentFormSchema,
  type DepartmentFormSchema,
} from '~/schemas/department.schema';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import type { Faculty } from '~/stores/faculty';

// Props for the component
const props = withDefaults(
  defineProps<{
    loading?: boolean;
    isEditing?: boolean;
    initialValues?: Partial<DepartmentFormSchema>;
    faculties: Faculty[];
  }>(),
  {
    loading: false,
    isEditing: false,
    initialValues: () => ({}),
  }
);

// Emits
const emit = defineEmits<{
  (e: 'submit', values: DepartmentFormSchema): void;
  (e: 'cancel'): void;
}>();

// Form reference and message
const formRef = ref(null);
const message = useMessage();

// Faculty options for select
const facultyOptions = computed(() => {
  if (!props.faculties || props.faculties.length === 0) {
    return [];
  }

  return props.faculties.map((faculty) => ({
    label: `${faculty.name || 'Unnamed Faculty'}${faculty.code ? ` (${faculty.code})` : ''}`,
    value: faculty.id,
  }));
});

// Department type options for select
const typeOptions = [
  { label: 'Academic', value: DepartmentType.Academic },
  { label: 'Research', value: DepartmentType.Research },
  { label: 'Administrative', value: DepartmentType.Administrative },
  { label: 'Support', value: DepartmentType.Support },
];

// Department status options for select
const statusOptions = [
  { label: 'Active', value: DepartmentStatus.Active },
  { label: 'Inactive', value: DepartmentStatus.Inactive },
  { label: 'Under Review', value: DepartmentStatus.UnderReview },
  { label: 'Restructuring', value: DepartmentStatus.Restructuring },
];

// Determine default values - prioritizing provided initialValues
const defaultValues = {
  name: '',
  code: '',
  description: '',
  facultyId: props.faculties.length === 1 ? props.faculties[0].id : '',
  type: DepartmentType.Academic,
  status: DepartmentStatus.Active,
  location: '',
  contactEmail: '',
  contactPhone: '',
  ...props.initialValues,
};

// Form setup with VeeValidate
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(departmentFormSchema),
  initialValues: defaultValues,
  validateOnMount: false,
});

// Define form fields
const [name, nameProps] = defineField('name', naiveUiFormsConfig);
const [code, codeProps] = defineField('code', naiveUiFormsConfig);
const [description, descriptionProps] = defineField(
  'description',
  naiveUiFormsConfig
);
const [facultyId, facultyIdProps] = defineField(
  'facultyId',
  naiveUiFormsConfig
);
const [type, typeProps] = defineField('type', naiveUiFormsConfig);
const [status, statusProps] = defineField('status', naiveUiFormsConfig);
const [location, locationProps] = defineField('location', naiveUiFormsConfig);
const [contactEmail, contactEmailProps] = defineField(
  'contactEmail',
  naiveUiFormsConfig
);
const [contactPhone, contactPhoneProps] = defineField(
  'contactPhone',
  naiveUiFormsConfig
);

// Form submission handler
const onSubmit = handleSubmit((values) => {
  try {
    emit('submit', values as DepartmentFormSchema);
  } catch (error: any) {
    message.error(`An error occurred: ${error.message}`);
  }
});
</script>

<style scoped>
.department-form-container {
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
  background: var(
    --gradient-primary,
    linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-secondary) 100%
    )
  );
  color: white;
  flex-shrink: 0;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.form-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 4px 0 0 0;
  line-height: 1.4;
}

.institution-indicator {
  flex-shrink: 0;
}

.form-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background-card);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all var(--animation-duration) ease;
}

.form-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-help-text {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 4px;
  line-height: 1.4;
}

.form-actions {
  background: var(--color-background-card);
  border-top: 1px solid var(--color-border);
  padding: 20px 24px;
  margin: 0 -24px -24px -24px;
  border-radius: 0 0 12px 12px;
}

.cancel-button {
  min-width: 100px;
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.cancel-button:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text-primary);
}

.submit-button {
  min-width: 140px;
  background: var(
    --gradient-primary,
    linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-secondary) 100%
    )
  );
  border: none;
  color: white;
}

.submit-button:hover {
  background: var(
    --gradient-primary,
    linear-gradient(
      135deg,
      var(--color-primary-dark) 0%,
      var(--color-secondary-dark) 100%
    )
  );
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* NaiveUI theming */
:deep(.n-card .n-card-header) {
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
}

:deep(.n-card .n-card-header .n-card-header__main) {
  font-weight: 600;
  color: var(--color-text-primary);
}

:deep(.n-card .n-card__content) {
  padding: 24px;
  background: var(--color-background-card);
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
  background: var(--color-background-input);
  border-color: var(--color-border);
}

:deep(.n-input.n-input--large .n-input-wrapper:hover) {
  border-color: var(--color-border-hover);
}

:deep(.n-input.n-input--large .n-input-wrapper:focus-within) {
  border-color: var(--color-primary);
}

:deep(.n-base-selection.n-base-selection--large) {
  min-height: 44px;
  background: var(--color-background-input);
  border-color: var(--color-border);
}

:deep(.n-base-selection.n-base-selection--large:hover) {
  border-color: var(--color-border-hover);
}

:deep(.n-input .n-input__border),
:deep(.n-base-selection .n-base-selection__border) {
  border-radius: 8px;
}

:deep(.n-divider) {
  margin: 24px 0;
  border-color: var(--color-border);
}

/* Responsive design */
@media (max-width: 1024px) {
  .department-form-container {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .institution-indicator {
    align-self: flex-start;
  }

  .header-icon {
    width: 40px;
    height: 40px;
  }

  .form-title {
    font-size: 20px;
  }

  .form-subtitle {
    font-size: 13px;
  }

  .grid {
    grid-template-columns: 1fr !important;
  }

  .col-span-1,
  .md\\:col-span-2 {
    grid-column: span 1 !important;
  }

  :deep(.n-card .n-card-header),
  :deep(.n-card .n-card__content) {
    padding: 16px;
  }

  .form-actions {
    padding: 16px;
    margin: 0 -16px -16px -16px;
    flex-direction: column-reverse;
  }

  .form-actions :deep(.n-space) {
    flex-direction: column;
    gap: 12px;
  }

  .cancel-button,
  .submit-button {
    width: 100%;
    min-width: unset;
  }
}

@media (max-width: 480px) {
  .department-form-container {
    padding: 0 4px;
  }

  .form-title {
    font-size: 18px;
  }

  .form-subtitle {
    font-size: 12px;
  }

  .gap-4,
  .md\\:gap-6 {
    gap: 12px;
  }

  :deep(.n-input.n-input--large .n-input-wrapper),
  :deep(.n-base-selection.n-base-selection--large) {
    min-height: 40px;
    font-size: 14px;
  }

  :deep(.n-card .n-card-header),
  :deep(.n-card .n-card__content) {
    padding: 12px;
  }

  .form-actions {
    padding: 12px;
    margin: 0 -12px -12px -12px;
  }
}
</style>
