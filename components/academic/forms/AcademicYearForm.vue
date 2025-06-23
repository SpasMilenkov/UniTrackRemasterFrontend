<template>
  <n-form
    label-placement="left"
    label-width="150px"
    require-mark-placement="right-hanging"
    @submit.prevent="onSubmit"
  >
    <n-form-item label="Name" path="name" v-bind="nameProps">
      <n-input
        v-model:value="name"
        placeholder="Enter academic year name (e.g., 2024-2025)"
        :disabled="loading"
      >
        <template #prefix>
          <Icon name="carbon:text-creation" />
        </template>
      </n-input>
    </n-form-item>

    <n-form-item
      label="Institution"
      path="institutionId"
      v-bind="institutionIdProps"
    >
      <n-select
        v-model:value="institutionId"
        :options="institutionOptions"
        placeholder="Select institution"
        :disabled="loading || isEditing"
      />
    </n-form-item>

    <n-form-item label="Date Range" v-bind="{ mergedRequired: true }">
      <n-date-picker
        v-model:value="dateRange"
        type="daterange"
        clearable
        start-placeholder="Start Date"
        end-placeholder="End Date"
        :disabled="loading"
        @update:value="handleDateRangeChange"
      />
      <template #feedback>
        <div v-if="startDateError || endDateError" class="text-red-500 text-sm">
          {{ startDateError || endDateError }}
        </div>
      </template>
    </n-form-item>

    <n-divider orientation="left">Create Predefined Academic Year</n-divider>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <n-card
        title="School Year Template"
        class="hover:shadow-md cursor-pointer"
        @click="useSchoolYearTemplate"
      >
        <div class="flex items-center">
          <Icon name="carbon:calendar" class="text-primary text-xl mr-2" />
          <span>Standard school year (Sep-Jun)</span>
        </div>
      </n-card>

      <n-card
        title="Calendar Year Template"
        class="hover:shadow-md cursor-pointer"
        @click="useCalendarYearTemplate"
      >
        <div class="flex items-center">
          <Icon
            name="carbon:calendar-heat-map"
            class="text-primary text-xl mr-2"
          />
          <span>Calendar year (Jan-Dec)</span>
        </div>
      </n-card>
    </div>

    <div class="flex justify-end gap-2 mt-6">
      <n-button :disabled="loading" @click="emit('cancel')">Cancel</n-button>
      <n-button type="primary" :loading="loading" attr-type="submit">
        {{ isEditing ? 'Update' : 'Create' }}
      </n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useMessage } from 'naive-ui';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import {
  createAcademicYearSchema,
  updateAcademicYearSchema,
  type AcademicYearFormSchema,
  type CreateAcademicYearSchema,
  type UpdateAcademicYearSchema,
} from '~/schemas/academic-year.schema';
import { useInstitutionStore } from '~/stores/institution';

const props = defineProps<{
  initialValues?: Partial<AcademicYearFormSchema>;
  isEditing?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (
    e: 'submit',
    data: CreateAcademicYearSchema | UpdateAcademicYearSchema
  ): void;
  (e: 'cancel'): void;
}>();

const message = useMessage();
const institutionStore = useInstitutionStore();

// For date picker
const dateRange = ref<[number, number] | null>(null);
const startDateError = ref('');
const endDateError = ref('');

// Determine default values - prioritizing provided initialValues
const defaultValues = {
  name: '',
  startDate: '',
  endDate: '',
  institutionId: institutionStore.activeInstitution?.id || '',
  ...props.initialValues,
};

// Initialize dateRange if we have initial values
if (props.initialValues?.startDate && props.initialValues?.endDate) {
  dateRange.value = [
    new Date(props.initialValues.startDate).getTime(),
    new Date(props.initialValues.endDate).getTime(),
  ];
}

// Use the appropriate schema based on editing mode
const validationSchema = computed(() => {
  return props.isEditing ? updateAcademicYearSchema : createAcademicYearSchema;
});

// Form setup with VeeValidate
const { handleSubmit, defineField, setFieldValue, errors } = useForm({
  validationSchema: toTypedSchema(validationSchema.value),
  initialValues: defaultValues,
});

// Define only the fields we directly use in the template
const [name, nameProps] = defineField('name', naiveUiFormsConfig);
const [institutionId, institutionIdProps] = defineField(
  'institutionId',
  naiveUiFormsConfig
);

// Watch for errors in startDate and endDate
watch(
  () => errors.value.startDate,
  (val) => {
    startDateError.value = (val as string) || '';
  }
);

watch(
  () => errors.value.endDate,
  (val) => {
    endDateError.value = (val as string) || '';
  }
);

// Institution options from store
const institutionOptions = computed(() => {
  // For simplicity, we'll just use the active institution
  if (institutionStore.activeInstitution) {
    return [
      {
        label: institutionStore.activeInstitution.name,
        value: institutionStore.activeInstitution.id,
      },
    ];
  }
  return [];
});

// Handle date range changes
function handleDateRangeChange(value: [number, number] | null) {
  if (value) {
    const [start, end] = value;
    setFieldValue('startDate', new Date(start).toISOString());
    setFieldValue('endDate', new Date(end).toISOString());
  } else {
    setFieldValue('startDate', '');
    setFieldValue('endDate', '');
  }
}

// Templates for common academic year patterns
function useSchoolYearTemplate() {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 8, 1); // September 1st
  const endDate = new Date(currentYear + 1, 5, 30); // June 30th of next year

  dateRange.value = [startDate.getTime(), endDate.getTime()];
  handleDateRangeChange(dateRange.value);

  // Set a default name if not already set
  if (!name.value) {
    name.value = `${currentYear}-${currentYear + 1}`;
  }
}

function useCalendarYearTemplate() {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1); // January 1st
  const endDate = new Date(currentYear, 11, 31); // December 31st

  dateRange.value = [startDate.getTime(), endDate.getTime()];
  handleDateRangeChange(dateRange.value);

  // Set a default name if not already set
  if (!name.value) {
    name.value = `${currentYear}`;
  }
}

// Submit form handler
const onSubmit = handleSubmit((formValues) => {
  try {
    // Validate with the appropriate schema and emit the validated data
    const validatedData = validationSchema.value.parse(formValues);
    emit('submit', validatedData);
  } catch (error: any) {
    message.error(`An error occurred: ${error.message}`);
  }
});
</script>

<style scoped>
:deep(.themed-form-item .n-form-item-label) {
  color: var(--color-text-primary) !important;
  font-weight: 500;
}

:deep(.themed-input .n-input__input) {
  background-color: var(--color-background-secondary);
  color: var(--color-text-primary);
}

:deep(.themed-input .n-input__placeholder) {
  color: var(--color-text-muted);
}
</style>
