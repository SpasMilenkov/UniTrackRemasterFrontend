<!-- components/academic/forms/FacultyForm.vue -->
<template>
  <div class="faculty-form-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="flex items-center gap-3 mb-2">
        <div class="header-icon">
          <Icon name="ph:buildings" class="text-xl" />
        </div>
        <div>
          <h2 class="form-title">
            {{ isEditing ? 'Edit' : 'Create' }} Faculty
          </h2>
          <p class="form-subtitle">
            {{
              isEditing
                ? 'Update faculty information and administrative details'
                : 'Add a new faculty to the university with all necessary details'
            }}
          </p>
        </div>
      </div>

      <!-- Institution Type Indicator -->
      <div class="institution-indicator">
        <n-tag type="info" size="small">
          <Icon name="ph:university" class="mr-1" />
          University Faculty
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <!-- Faculty Name -->
          <n-form-item
            label="Faculty Name"
            path="name"
            v-bind="nameProps"
            required
            class="col-span-1 md:col-span-2"
          >
            <n-input
              v-model:value="name"
              placeholder="Enter faculty name (e.g., Faculty of Engineering)"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:buildings" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">The official name of the faculty</div>
            </template>
          </n-form-item>

          <!-- Faculty Code -->
          <n-form-item label="Faculty Code" path="code" v-bind="codeProps">
            <n-input
              v-model:value="code"
              placeholder="Enter faculty code (e.g., ENG, MED)"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:hash" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                Short code for faculty identification (optional)
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
              placeholder="Select faculty status"
              :disabled="loading"
              size="large"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Current operational status of the faculty
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Institution Assignment Card -->
      <n-card title="Institution Assignment" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:university" class="text-gray-400" />
        </template>

        <!-- University Display (Read-only) -->
        <n-form-item label="University">
          <div class="institution-display">
            <div class="flex items-center gap-3 p-4 rounded-lg border">
              <div class="institution-icon">
                <Icon name="ph:university" class="text-xl" />
              </div>
              <div class="flex-1">
                <div class="font-medium">
                  {{ universityOptions[0]?.label || 'No University Selected' }}
                </div>
                <div class="text-sm text-secondary">Active University</div>
              </div>
              <n-tag type="info" size="small">University</n-tag>
            </div>
          </div>
          <template #feedback>
            <div class="form-help-text">
              Faculty will be automatically assigned to the currently active
              university
            </div>
          </template>
        </n-form-item>
      </n-card>

      <!-- Description Information Card -->
      <n-card title="Description & Details" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:note-pencil" class="text-gray-400" />
        </template>

        <div class="space-y-6">
          <!-- Short Description -->
          <n-form-item
            label="Short Description"
            path="shortDescription"
            v-bind="shortDescriptionProps"
          >
            <n-input
              v-model:value="shortDescription"
              placeholder="Brief description of the faculty"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:text-aa" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                A concise overview of the faculty (used in listings and
                previews)
              </div>
            </template>
          </n-form-item>

          <!-- Detailed Description -->
          <n-form-item
            label="Detailed Description"
            path="detailedDescription"
            v-bind="detailedDescriptionProps"
          >
            <n-input
              v-model:value="detailedDescription"
              type="textarea"
              placeholder="Comprehensive description of the faculty, its programs, and objectives"
              :autosize="{ minRows: 4, maxRows: 8 }"
              :disabled="loading"
              size="large"
            />
            <template #feedback>
              <div class="form-help-text">
                Detailed information about the faculty's mission, programs, and
                academic offerings
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
          <!-- Website -->
          <n-form-item
            label="Website"
            path="website"
            v-bind="websiteProps"
            class="col-span-1 md:col-span-2"
          >
            <n-input
              v-model:value="website"
              placeholder="https://faculty.university.edu"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:globe" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                Official website URL for the faculty (optional)
              </div>
            </template>
          </n-form-item>

          <!-- Contact Email -->
          <n-form-item
            label="Contact Email"
            path="contactEmail"
            v-bind="contactEmailProps"
          >
            <n-input
              v-model:value="contactEmail"
              placeholder="contact@faculty.university.edu"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:envelope" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                Main contact email for faculty inquiries (optional)
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
                Main contact phone number for the faculty office (optional)
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
            {{ isEditing ? 'Update' : 'Create' }} Faculty
          </n-button>
        </n-space>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useMessage } from 'naive-ui';
import { FacultyStatus } from '~/enums/faculty-status.enum';
import { useInstitutionStore } from '~/stores/institution';
import { useUniversityStore } from '~/stores/university';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import {
  facultyFormSchema,
  type FacultyFormSchema,
} from '~/schemas/faculty.schema';

const props = defineProps<{
  initialValues?: Partial<FacultyFormSchema>;
  isEditing?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: FacultyFormSchema): void;
  (e: 'cancel'): void;
}>();

const message = useMessage();
const institutionStore = useInstitutionStore();
const universityStore = useUniversityStore();

// Form reference
const formRef = ref();

// Status options
const statusOptions = [
  { label: 'Active', value: FacultyStatus.Active },
  { label: 'Inactive', value: FacultyStatus.Inactive },
  { label: 'Under Review', value: FacultyStatus.UnderReview },
];

// Get active university ID
const activeUniversityId = computed(() => {
  return (
    universityStore.activeUniversity?.id ||
    institutionStore.activeInstitution?.id ||
    ''
  );
});

// University options from store
const universityOptions = computed(() => {
  if (universityStore.activeUniversity) {
    return [
      {
        label: universityStore.activeUniversity.name || 'Active University',
        value: universityStore.activeUniversity.id,
      },
    ];
  } else if (institutionStore.activeInstitution) {
    return [
      {
        label: institutionStore.activeInstitution.name || 'Active Institution',
        value: institutionStore.activeInstitution.id,
      },
    ];
  }

  return [];
});

// Determine default values - prioritizing provided initialValues
const defaultValues = {
  name: '',
  code: '',
  universityId: activeUniversityId.value || '',
  status: FacultyStatus.Active,
  shortDescription: '',
  detailedDescription: '',
  website: '',
  contactEmail: '',
  contactPhone: '',
  ...props.initialValues,
};

// Form setup with VeeValidate
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(facultyFormSchema),
  initialValues: defaultValues,
});

// Define form fields
const [name, nameProps] = defineField('name', naiveUiFormsConfig);
const [code, codeProps] = defineField('code', naiveUiFormsConfig);
const [universityId, _universityIdProps] = defineField(
  'universityId',
  naiveUiFormsConfig
);
const [status, statusProps] = defineField('status', naiveUiFormsConfig);
const [shortDescription, shortDescriptionProps] = defineField(
  'shortDescription',
  naiveUiFormsConfig
);
const [detailedDescription, detailedDescriptionProps] = defineField(
  'detailedDescription',
  naiveUiFormsConfig
);
const [website, websiteProps] = defineField('website', naiveUiFormsConfig);
const [contactEmail, contactEmailProps] = defineField(
  'contactEmail',
  naiveUiFormsConfig
);
const [contactPhone, contactPhoneProps] = defineField(
  'contactPhone',
  naiveUiFormsConfig
);

// Submit form handler
const onSubmit = handleSubmit((formValues) => {
  try {
    // Ensure universityId is set
    if (!formValues.universityId && activeUniversityId.value) {
      formValues.universityId = activeUniversityId.value;
    }

    emit('submit', formValues as FacultyFormSchema);
  } catch (error: any) {
    message.error(`An error occurred: ${error.message}`);
  }
});

// Initialize form
onMounted(() => {
  // Ensure universityId is set to the active university
  if (!universityId.value && activeUniversityId.value) {
    universityId.value = activeUniversityId.value;
  }
});
</script>

<style scoped>
.faculty-form-container {
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

.institution-display {
  width: 100%;
}

.institution-display .flex {
  background: var(--color-background-secondary);
  border-color: var(--color-border);
}

.institution-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--color-primary);
  color: white;
}

.text-secondary {
  color: var(--color-text-secondary);
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
  .faculty-form-container {
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
  .faculty-form-container {
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
