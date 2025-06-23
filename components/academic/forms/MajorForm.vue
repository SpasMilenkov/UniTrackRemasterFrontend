<!-- components/academic/forms/MajorForm.vue -->
<template>
  <div class="form-container">
    <n-form
      label-placement="left"
      :label-width="120"
      require-mark-placement="right-hanging"
      @submit.prevent="onSubmit"
    >
      <!-- Basic Information Section -->
      <div class="form-section">
        <h3 class="section-title">Basic Information</h3>

        <n-form-item
          label="Faculty"
          path="facultyId"
          v-bind="facultyIdProps"
          required
        >
          <n-select
            v-model:value="facultyId"
            :options="facultyOptions"
            placeholder="Select a faculty"
            :disabled="loading"
          />
        </n-form-item>

        <n-form-item label="Name" path="name" v-bind="nameProps" required>
          <n-input
            v-model:value="name"
            placeholder="Enter major name"
            :disabled="loading"
          >
            <template #prefix>
              <Icon name="carbon:text-creation" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="Code" path="code" v-bind="codeProps">
          <n-input
            v-model:value="code"
            placeholder="Enter major code (e.g., CS, BUS, ENG)"
            :disabled="loading"
          >
            <template #prefix>
              <Icon name="carbon:code" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item
          label="Duration (years)"
          path="durationInYears"
          v-bind="durationInYearsProps"
        >
          <n-input-number
            v-model:value="durationInYears"
            :min="1"
            :max="10"
            :disabled="loading"
          />
        </n-form-item>

        <n-form-item
          label="Required Credits"
          path="requiredCredits"
          v-bind="requiredCreditsProps"
        >
          <n-input-number
            v-model:value="requiredCredits"
            :min="0"
            :max="500"
            :disabled="loading"
          />
        </n-form-item>
      </div>

      <!-- Description Section -->
      <div class="form-section">
        <h3 class="section-title">Description</h3>

        <n-form-item
          label="Short Description"
          path="shortDescription"
          v-bind="shortDescriptionProps"
        >
          <n-input
            v-model:value="shortDescription"
            placeholder="Brief description of the major"
            :disabled="loading"
          >
            <template #prefix>
              <Icon name="carbon:text-short" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item
          label="Detailed Description"
          path="detailedDescription"
          v-bind="detailedDescriptionProps"
        >
          <n-input
            v-model:value="detailedDescription"
            type="textarea"
            placeholder="Comprehensive description of the major"
            :autosize="{ minRows: 3, maxRows: 6 }"
            :disabled="loading"
          />
        </n-form-item>
      </div>

      <!-- Additional Information Section -->
      <div class="form-section">
        <h3 class="section-title">Additional Information</h3>

        <n-form-item
          label="Career Opportunities"
          path="careerOpportunities"
          v-bind="careerOpportunitiesProps"
        >
          <n-input
            v-model:value="careerOpportunities"
            type="textarea"
            placeholder="Career paths for graduates of this major"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :disabled="loading"
          />
        </n-form-item>

        <n-form-item
          label="Admission Requirements"
          path="admissionRequirements"
          v-bind="admissionRequirementsProps"
        >
          <n-input
            v-model:value="admissionRequirements"
            type="textarea"
            placeholder="Requirements for admission to this major"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :disabled="loading"
          />
        </n-form-item>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <n-button :disabled="loading" size="medium" @click="emit('cancel')">
          Cancel
        </n-button>
        <n-button
          type="primary"
          :loading="loading"
          attr-type="submit"
          size="medium"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useMessage } from 'naive-ui';
import { majorFormSchema, type MajorFormSchema } from '~/schemas/major.schema';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import type { Faculty } from '~/stores/faculty';
import type { SelectOption } from 'naive-ui';

const props = defineProps<{
  initialValues?: Partial<MajorFormSchema>;
  isEditing?: boolean;
  loading?: boolean;
  faculties: Faculty[];
}>();

const emit = defineEmits<{
  (e: 'submit', data: MajorFormSchema): void;
  (e: 'cancel'): void;
}>();

const message = useMessage();

// Faculty options from props - properly typed for NaiveUI
const facultyOptions = computed<SelectOption[]>(() => {
  if (!props.faculties || props.faculties.length === 0) {
    return [];
  }

  return props.faculties.map((faculty) => ({
    label: faculty.name || 'Unnamed Faculty',
    value: faculty.id,
  }));
});

// Determine default values - prioritizing provided initialValues
const defaultValues = {
  name: '',
  code: '',
  shortDescription: '',
  detailedDescription: '',
  requiredCredits: 120,
  durationInYears: 4,
  careerOpportunities: '',
  admissionRequirements: '',
  facultyId: '',
  ...props.initialValues,
};

// Form setup with VeeValidate
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(majorFormSchema),
  initialValues: defaultValues,
});

// Define form fields
const [name, nameProps] = defineField('name', naiveUiFormsConfig);
const [code, codeProps] = defineField('code', naiveUiFormsConfig);
const [facultyId, facultyIdProps] = defineField(
  'facultyId',
  naiveUiFormsConfig
);
const [shortDescription, shortDescriptionProps] = defineField(
  'shortDescription',
  naiveUiFormsConfig
);
const [detailedDescription, detailedDescriptionProps] = defineField(
  'detailedDescription',
  naiveUiFormsConfig
);
const [durationInYears, durationInYearsProps] = defineField(
  'durationInYears',
  naiveUiFormsConfig
);
const [requiredCredits, requiredCreditsProps] = defineField(
  'requiredCredits',
  naiveUiFormsConfig
);
const [careerOpportunities, careerOpportunitiesProps] = defineField(
  'careerOpportunities',
  naiveUiFormsConfig
);
const [admissionRequirements, admissionRequirementsProps] = defineField(
  'admissionRequirements',
  naiveUiFormsConfig
);

// Submit form handler
const onSubmit = handleSubmit((formValues) => {
  try {
    emit('submit', formValues as MajorFormSchema);
  } catch (error: any) {
    message.error(`An error occurred: ${error.message}`);
  }
});

// Initialize form
onMounted(() => {
  // If there's only one faculty and no faculty is selected, auto-select it
  if (facultyOptions.value.length === 1 && !facultyId.value) {
    facultyId.value = facultyOptions.value[0].value as string;
  }
});
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 0;
}

.form-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border, rgba(229, 231, 235, 0.2));
}

/* NaiveUI theming */
:deep(.n-form-item .n-form-item-label) {
  font-weight: 500;
}

:deep(.n-form-item-feedback-wrapper) {
  min-height: 20px;
}

:deep(.n-form-item) {
  margin-bottom: 16px;
}

:deep(.n-form-item:last-child) {
  margin-bottom: 0;
}

/* Make inputs better match screenshot */
:deep(.n-input .n-input__input-el) {
  height: 34px;
  padding: 0 12px;
}

:deep(.n-base-selection) {
  min-height: 34px;
}
</style>
