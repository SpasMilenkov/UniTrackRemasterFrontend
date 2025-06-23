<!-- components/academic/institution-settings/forms/GradingSystemForm.vue -->
<template>
  <div class="form-container">
    <n-form
      label-placement="left"
      :label-width="140"
      require-mark-placement="right-hanging"
      @submit.prevent="onSubmit"
    >
      <!-- Tab Navigation -->
      <div class="tabs-container mb-4">
        <n-tabs
          v-model:value="activeTab"
          type="segment"
          animated
          size="large"
          style="width: 100%"
        >
          <n-tab-pane name="basicInfo" tab="Basic Information">
            <!-- Tab content rendered below -->
          </n-tab-pane>
          <n-tab-pane name="gradingRange" tab="Grading Range">
            <!-- Tab content rendered below -->
          </n-tab-pane>
          <n-tab-pane name="gradeScales" tab="Grade Scales">
            <!-- Tab content rendered below -->
          </n-tab-pane>
        </n-tabs>
      </div>

      <!-- Basic Information Tab Content -->
      <div v-show="activeTab === 'basicInfo'" class="tab-content">
        <n-form-item label="Name" path="name" v-bind="nameProps" required>
          <n-input
            v-model:value="name"
            placeholder="Enter grading system name"
            :disabled="loading || (isEditing && !isCustomType)"
          >
            <template #prefix>
              <Icon name="ph:exam" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item
          label="Description"
          path="description"
          v-bind="descriptionProps"
        >
          <n-input
            v-model:value="description"
            type="textarea"
            placeholder="Enter description"
            :disabled="loading || (isEditing && !isCustomType)"
          />
        </n-form-item>

        <n-form-item label="Type" path="type" v-bind="typeProps" required>
          <n-select
            v-model:value="type"
            :options="gradingSystemTypeOptions"
            placeholder="Select type"
            :disabled="loading || isEditing"
          />
        </n-form-item>

        <n-form-item>
          <n-checkbox
            v-model:checked="isDefault"
            :disabled="loading || (isEditing && isDefaultValue)"
          >
            Set as default grading system
          </n-checkbox>
        </n-form-item>
      </div>

      <!-- Grading Range Tab Content -->
      <div v-show="activeTab === 'gradingRange'" class="tab-content">
        <n-form-item
          label="Minimum Passing"
          path="minimumPassingScore"
          v-bind="minimumPassingScoreProps"
          required
        >
          <n-input-number
            v-model:value="minimumPassingScore"
            placeholder="Enter minimum passing score"
            :min="0"
            :max="100"
            :disabled="loading || (isEditing && !isCustomType)"
            style="width: 200px"
          >
            <template #suffix> % </template>
          </n-input-number>
          <template #help>
            <div class="text-xs text-gray-500">
              Students must achieve this score to pass
            </div>
          </template>
        </n-form-item>

        <n-form-item
          label="Maximum Score"
          path="maximumScore"
          v-bind="maximumScoreProps"
          required
        >
          <n-input-number
            v-model:value="maximumScore"
            placeholder="Enter maximum score"
            :min="0"
            :max="100"
            :disabled="loading || (isEditing && !isCustomType)"
            style="width: 200px"
          >
            <template #suffix> % </template>
          </n-input-number>
          <template #help>
            <div class="text-xs text-gray-500">
              The highest possible score in this system
            </div>
          </template>
        </n-form-item>
      </div>

      <!-- Grade Scales Tab Content -->
      <div v-show="activeTab === 'gradeScales'" class="tab-content">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <h3 class="section-title mb-0 mr-4">Grade Scales</h3>
            <n-button
              v-if="isCustomType || (!isEditing && type === 'Custom')"
              size="small"
              type="primary"
              :disabled="loading"
              @click="addGradeScale"
            >
              <template #icon>
                <Icon name="ph:plus" />
              </template>
              Add Grade Scale
            </n-button>
          </div>
        </div>

        <div
          v-if="isCustomType || (!isEditing && type === 'Custom')"
          class="grade-scales-container"
        >
          <!-- Dynamic grade scales list -->
          <div
            v-for="(scale, index) in gradeScales"
            :key="index"
            class="bg-background-secondary p-3 rounded-md relative grade-scale-card pt-12"
          >
            <div class="absolute right-2 top-2">
              <n-button
                quaternary
                circle
                size="small"
                :disabled="loading"
                @click="removeGradeScale(index)"
              >
                <template #icon>
                  <Icon name="ph:x" />
                </template>
              </n-button>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <n-form-item
                label="Grade"
                :path="`gradeScales[${index}].grade`"
                v-bind="gradeScaleProps(index, 'grade')"
                required
              >
                <n-input
                  v-model:value="scale.grade"
                  placeholder="A, B, C, etc."
                  :disabled="loading"
                />
              </n-form-item>

              <n-form-item
                label="Description"
                :path="`gradeScales[${index}].description`"
                v-bind="gradeScaleProps(index, 'description')"
              >
                <n-input
                  v-model:value="scale.description"
                  placeholder="Excellent, Good, etc."
                  :disabled="loading"
                />
              </n-form-item>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <n-form-item
                label="Min Score"
                :path="`gradeScales[${index}].minimumScore`"
                v-bind="gradeScaleProps(index, 'minimumScore')"
                required
              >
                <n-input-number
                  v-model:value="scale.minimumScore"
                  placeholder="0"
                  :min="0"
                  :max="scale.maximumScore - 0.01"
                  :disabled="loading"
                >
                  <template #suffix> % </template>
                </n-input-number>
              </n-form-item>

              <n-form-item
                label="Max Score"
                :path="`gradeScales[${index}].maximumScore`"
                v-bind="gradeScaleProps(index, 'maximumScore')"
                required
              >
                <n-input-number
                  v-model:value="scale.maximumScore"
                  placeholder="100"
                  :min="scale.minimumScore + 0.01"
                  :max="maximumScore"
                  :disabled="loading"
                >
                  <template #suffix> % </template>
                </n-input-number>
              </n-form-item>

              <n-form-item
                label="GPA Value"
                :path="`gradeScales[${index}].gpaValue`"
                v-bind="gradeScaleProps(index, 'gpaValue')"
                required
              >
                <n-input-number
                  v-model:value="scale.gpaValue"
                  placeholder="4.0"
                  :min="0"
                  :max="4"
                  :step="0.1"
                  :disabled="loading"
                />
              </n-form-item>
            </div>
          </div>

          <!-- Empty state for grade scales -->
          <div
            v-if="gradeScales.length === 0"
            class="text-center py-6 border border-dashed rounded-md"
          >
            <Icon name="ph:scales" class="text-4xl text-text-secondary mb-2" />
            <p class="text-text-secondary">No grade scales defined</p>
            <n-button
              class="mt-2"
              size="small"
              type="primary"
              :disabled="loading"
              @click="addGradeScale"
            >
              Add Grade Scale
            </n-button>
          </div>
        </div>

        <!-- Display only view for predefined grade scales -->
        <div
          v-else-if="
            gradeScales.length > 0 &&
            ((!isCustomType && isEditing) || (!isEditing && type !== 'Custom'))
          "
          class="border rounded-md p-4"
        >
          <p class="text-text-secondary mb-4">
            Grade scales for predefined grading systems cannot be modified.
          </p>
          <n-table striped :single-line="false">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Description</th>
                <th>Min Score</th>
                <th>Max Score</th>
                <th>GPA Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(scale, index) in gradeScales" :key="index">
                <td>{{ scale.grade }}</td>
                <td>{{ scale.description || '-' }}</td>
                <td>{{ scale.minimumScore }}%</td>
                <td>{{ scale.maximumScore }}%</td>
                <td>{{ scale.gpaValue }}</td>
              </tr>
            </tbody>
          </n-table>
        </div>

        <!-- Empty state for grade scales when type is not yet selected -->
        <div v-else class="text-center py-6 border border-dashed rounded-md">
          <p class="text-text-secondary">
            Select a grading system type to see grade scales
          </p>
        </div>
      </div>

      <!-- Progress Indicator -->
      <div class="flex justify-center items-center space-x-2 mt-8 mb-4">
        <div
          class="h-2 w-12 rounded-full"
          :class="
            activeTab === 'basicInfo' ? 'bg-primary' : 'bg-gray-500 opacity-50'
          "
          style="cursor: pointer"
          @click="activeTab = 'basicInfo'"
        />
        <div
          class="h-2 w-12 rounded-full"
          :class="
            activeTab === 'gradingRange'
              ? 'bg-primary'
              : 'bg-gray-500 opacity-50'
          "
          style="cursor: pointer"
          @click="activeTab = 'gradingRange'"
        />
        <div
          class="h-2 w-12 rounded-full"
          :class="
            activeTab === 'gradeScales'
              ? 'bg-primary'
              : 'bg-gray-500 opacity-50'
          "
          style="cursor: pointer"
          @click="activeTab = 'gradeScales'"
        />
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <n-button :disabled="loading" size="medium" @click="emit('cancel')">
          Cancel
        </n-button>
        <n-button
          v-if="activeTab !== 'gradeScales'"
          type="primary"
          size="medium"
          @click="nextTab"
        >
          Continue →
        </n-button>
        <n-button
          v-if="activeTab === 'gradeScales'"
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
import { ref, computed, watch } from 'vue';
import { useForm, useFieldArray } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useMessage } from 'naive-ui';
import { GradingSystemType } from '~/enums/grading-system-type.enum';
import { completeGradingSystemSchema } from '~/schemas/grading-system.schema';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import { useToast } from '~/composables/useToast';

const props = defineProps<{
  initialValues?: any;
  isEditing?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: any): void;
  (e: 'cancel'): void;
}>();

const message = useMessage();
const toast = useToast();
const activeTab = ref('basicInfo');

// Tab navigation logic
function nextTab() {
  // First validate the current tab
  if (activeTab.value === 'basicInfo') {
    const basicInfoValid = validateBasicInfo();
    if (basicInfoValid) {
      activeTab.value = 'gradingRange';
    }
  } else if (activeTab.value === 'gradingRange') {
    const gradingRangeValid = validateGradingRange();
    if (gradingRangeValid) {
      activeTab.value = 'gradeScales';
    }
  }
}

// Validation for basic info tab
function validateBasicInfo() {
  const nameError = errors.value.name;
  const typeError = errors.value.type;

  if (nameError || typeError) {
    toast.error('Please fix the validation errors before continuing', {
      title: 'Validation Error',
      description:
        'Required fields are missing or invalid in Basic Information section',
      duration: 5000,
    });
    return false;
  }

  if (!name.value) {
    toast.error('Name is required', {
      title: 'Validation Error',
      description: 'Please enter a name for the grading system',
      duration: 5000,
    });
    return false;
  }

  return true;
}

// Validation for grading range tab
function validateGradingRange() {
  const minimumPassingScoreError = errors.value.minimumPassingScore;
  const maximumScoreError = errors.value.maximumScore;

  if (minimumPassingScoreError || maximumScoreError) {
    toast.error('Please fix the validation errors before continuing', {
      title: 'Validation Error',
      description:
        'Required fields are missing or invalid in Grading Range section',
      duration: 5000,
    });
    return false;
  }

  if (minimumPassingScore.value >= maximumScore.value) {
    toast.error('Invalid score range', {
      title: 'Validation Error',
      description: 'Minimum passing score must be less than maximum score',
      duration: 5000,
    });
    return false;
  }

  return true;
}

// Define default form values
const defaultValues = {
  name: '',
  description: '',
  type: GradingSystemType.American,
  isDefault: false,
  minimumPassingScore: 60,
  maximumScore: 100,
  gradeScales: [],
  ...(props.initialValues || {}),
};

// Form setup with VeeValidate
const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(completeGradingSystemSchema),
  initialValues: defaultValues,
});

// Define field array for grade scales
const { remove, push, fields } = useFieldArray('gradeScales');

// Define form fields
const [name, nameProps] = defineField('name', naiveUiFormsConfig);
const [description, descriptionProps] = defineField(
  'description',
  naiveUiFormsConfig
);
const [type, typeProps] = defineField('type', naiveUiFormsConfig);
const [isDefault, _isDefaultProps] = defineField(
  'isDefault',
  naiveUiFormsConfig
);
const [minimumPassingScore, minimumPassingScoreProps] = defineField(
  'minimumPassingScore',
  naiveUiFormsConfig
);
const [maximumScore, maximumScoreProps] = defineField(
  'maximumScore',
  naiveUiFormsConfig
);
const gradeScales = computed(() => fields.value);

// Define options for the grading system type dropdown
const gradingSystemTypeOptions = [
  { label: 'American', value: GradingSystemType.American },
  { label: 'European', value: GradingSystemType.European },
  { label: 'Bulgarian', value: GradingSystemType.Bulgarian },
  { label: 'Custom', value: GradingSystemType.Custom },
];

// Helpers
const isCustomType = computed(() => {
  return type.value === GradingSystemType.Custom;
});

const isDefaultValue = computed(() => {
  return props.initialValues?.isDefault || false;
});

// Method to get form properties for dynamic grade scale fields
function gradeScaleProps(index: number, field: string) {
  return {
    feedback: errors.value[`gradeScales.${index}.${field}`],
    showFeedback: !!errors.value[`gradeScales.${index}.${field}`],
    showRequireMark: true,
  };
}

// Add a new grade scale
function addGradeScale() {
  push({
    grade: '',
    description: '',
    minimumScore:
      gradeScales.value.length > 0
        ? gradeScales.value[gradeScales.value.length - 1].maximumScore + 0.01
        : 0,
    maximumScore: 100,
    gpaValue: 0,
  });
}

// Remove a grade scale
function removeGradeScale(index: number) {
  remove(index);
  toast.info(`Grade scale removed`, {
    title: 'Grade Scale Removed',
    duration: 3000,
  });
}

// Validate grade scales
function validateGradeScales() {
  if (gradeScales.value.length === 0 && isCustomType.value) {
    toast.error('At least one grade scale is required', {
      title: 'Validation Error',
      description: 'Please add at least one grade scale',
      duration: 5000,
    });
    return false;
  }

  // Check for errors in grade scales
  let hasErrors = false;
  for (let i = 0; i < gradeScales.value.length; i++) {
    if (
      errors.value[`gradeScales.${i}.grade`] ||
      errors.value[`gradeScales.${i}.minimumScore`] ||
      errors.value[`gradeScales.${i}.maximumScore`] ||
      errors.value[`gradeScales.${i}.gpaValue`]
    ) {
      hasErrors = true;
      break;
    }
  }

  if (hasErrors) {
    toast.error('Please fix the validation errors in grade scales', {
      title: 'Validation Error',
      description:
        'Required fields are missing or invalid in Grade Scales section',
      duration: 5000,
    });
    return false;
  }

  // Check for overlapping score ranges
  const sortedScales = [...gradeScales.value].sort(
    (a, b) => a.minimumScore - b.minimumScore
  );

  for (let i = 0; i < sortedScales.length - 1; i++) {
    if (sortedScales[i].maximumScore > sortedScales[i + 1].minimumScore) {
      toast.error('Overlapping score ranges detected', {
        title: 'Validation Error',
        description:
          'Grade scales have overlapping score ranges. Please adjust the minimum and maximum scores.',
        duration: 5000,
      });
      return false;
    }
  }

  // Check for gaps in score ranges
  for (let i = 0; i < sortedScales.length - 1; i++) {
    if (sortedScales[i].maximumScore < sortedScales[i + 1].minimumScore) {
      toast.warning('Gap detected in score ranges', {
        title: 'Warning',
        description:
          'There are gaps between some grade scales. Students with scores in these gaps will not receive a grade.',
        duration: 5000,
      });
      // Don't return false here, just warn the user
    }
  }

  // Check if all scores from 0 to max are covered
  if (sortedScales[0].minimumScore > 0) {
    toast.warning('Minimum score gap detected', {
      title: 'Warning',
      description:
        'The lowest grade scale does not start at 0. Students with scores below the minimum will not receive a grade.',
      duration: 5000,
    });
  }

  if (sortedScales[sortedScales.length - 1].maximumScore < maximumScore.value) {
    toast.warning('Maximum score gap detected', {
      title: 'Warning',
      description:
        'The highest grade scale does not reach the maximum score. Students with scores above the highest grade scale will not receive a grade.',
      duration: 5000,
    });
  }

  return true;
}

// Type watchers - when changing type, load default grade scales for that system
watch(type, (newType) => {
  if (props.isEditing) return; // Don't change scales when editing

  // Clear existing scales
  while (gradeScales.value.length > 0) {
    remove(0);
  }

  // If Custom, add one empty scale to start
  if (newType === GradingSystemType.Custom) {
    addGradeScale();
    return;
  }

  // For predefined systems, add default grade scales
  if (newType === GradingSystemType.American) {
    const americanScales = [
      {
        grade: 'A+',
        description: 'Outstanding',
        minimumScore: 97,
        maximumScore: 100,
        gpaValue: 4.0,
      },
      {
        grade: 'A',
        description: 'Excellent',
        minimumScore: 93,
        maximumScore: 96.99,
        gpaValue: 4.0,
      },
      {
        grade: 'A-',
        description: 'Very Good',
        minimumScore: 90,
        maximumScore: 92.99,
        gpaValue: 3.7,
      },
      {
        grade: 'B+',
        description: 'Good Plus',
        minimumScore: 87,
        maximumScore: 89.99,
        gpaValue: 3.3,
      },
      {
        grade: 'B',
        description: 'Good',
        minimumScore: 83,
        maximumScore: 86.99,
        gpaValue: 3.0,
      },
      {
        grade: 'B-',
        description: 'Good Minus',
        minimumScore: 80,
        maximumScore: 82.99,
        gpaValue: 2.7,
      },
      {
        grade: 'C+',
        description: 'Satisfactory Plus',
        minimumScore: 77,
        maximumScore: 79.99,
        gpaValue: 2.3,
      },
      {
        grade: 'C',
        description: 'Satisfactory',
        minimumScore: 73,
        maximumScore: 76.99,
        gpaValue: 2.0,
      },
      {
        grade: 'C-',
        description: 'Satisfactory Minus',
        minimumScore: 70,
        maximumScore: 72.99,
        gpaValue: 1.7,
      },
      {
        grade: 'D+',
        description: 'Poor Plus',
        minimumScore: 67,
        maximumScore: 69.99,
        gpaValue: 1.3,
      },
      {
        grade: 'D',
        description: 'Poor',
        minimumScore: 63,
        maximumScore: 66.99,
        gpaValue: 1.0,
      },
      {
        grade: 'D-',
        description: 'Poor Minus',
        minimumScore: 60,
        maximumScore: 62.99,
        gpaValue: 0.7,
      },
      {
        grade: 'F',
        description: 'Failing',
        minimumScore: 0,
        maximumScore: 59.99,
        gpaValue: 0.0,
      },
    ];

    americanScales.forEach((scale) => push(scale));
    toast.info('American grading system selected', {
      title: 'Grading System',
      description:
        'Default grade scales for the American system have been loaded',
      duration: 3000,
    });
  } else if (newType === GradingSystemType.European) {
    const europeanScales = [
      {
        grade: 'A',
        description:
          'EXCELLENT - outstanding performance with only minor errors',
        minimumScore: 90,
        maximumScore: 100,
        gpaValue: 4.0,
      },
      {
        grade: 'B',
        description:
          'VERY GOOD - above the average standard but with some errors',
        minimumScore: 80,
        maximumScore: 89.99,
        gpaValue: 3.5,
      },
      {
        grade: 'C',
        description:
          'GOOD - generally sound work with a number of notable errors',
        minimumScore: 70,
        maximumScore: 79.99,
        gpaValue: 3.0,
      },
      {
        grade: 'D',
        description: 'SATISFACTORY - fair but with significant shortcomings',
        minimumScore: 60,
        maximumScore: 69.99,
        gpaValue: 2.5,
      },
      {
        grade: 'E',
        description: 'SUFFICIENT - performance meets the minimum criteria',
        minimumScore: 50,
        maximumScore: 59.99,
        gpaValue: 2.0,
      },
      {
        grade: 'FX',
        description:
          'FAIL - some more work required before the credit can be awarded',
        minimumScore: 40,
        maximumScore: 49.99,
        gpaValue: 1.0,
      },
      {
        grade: 'F',
        description: 'FAIL - considerable further work is required',
        minimumScore: 0,
        maximumScore: 39.99,
        gpaValue: 0.0,
      },
    ];

    europeanScales.forEach((scale) => push(scale));
    toast.info('European grading system selected', {
      title: 'Grading System',
      description:
        'Default grade scales for the European system have been loaded',
      duration: 3000,
    });
  } else if (newType === GradingSystemType.Bulgarian) {
    const bulgarianScales = [
      {
        grade: '6.00',
        description: 'Excellent',
        minimumScore: 92,
        maximumScore: 100,
        gpaValue: 4.0,
      },
      {
        grade: '5.75',
        description: 'Very Good Plus',
        minimumScore: 88,
        maximumScore: 91.99,
        gpaValue: 3.8,
      },
      {
        grade: '5.50',
        description: 'Very Good',
        minimumScore: 83,
        maximumScore: 87.99,
        gpaValue: 3.7,
      },
      {
        grade: '5.25',
        description: 'Very Good Minus',
        minimumScore: 78,
        maximumScore: 82.99,
        gpaValue: 3.5,
      },
      {
        grade: '5.00',
        description: 'Good Plus',
        minimumScore: 73,
        maximumScore: 77.99,
        gpaValue: 3.3,
      },
      {
        grade: '4.75',
        description: 'Good',
        minimumScore: 68,
        maximumScore: 72.99,
        gpaValue: 3.0,
      },
      {
        grade: '4.50',
        description: 'Good Minus',
        minimumScore: 63,
        maximumScore: 67.99,
        gpaValue: 2.7,
      },
      {
        grade: '4.25',
        description: 'Average Plus',
        minimumScore: 58,
        maximumScore: 62.99,
        gpaValue: 2.3,
      },
      {
        grade: '4.00',
        description: 'Average',
        minimumScore: 53,
        maximumScore: 57.99,
        gpaValue: 2.0,
      },
      {
        grade: '3.75',
        description: 'Average Minus',
        minimumScore: 48,
        maximumScore: 52.99,
        gpaValue: 1.7,
      },
      {
        grade: '3.50',
        description: 'Poor Plus',
        minimumScore: 43,
        maximumScore: 47.99,
        gpaValue: 1.3,
      },
      {
        grade: '3.25',
        description: 'Poor',
        minimumScore: 38,
        maximumScore: 42.99,
        gpaValue: 1.0,
      },
      {
        grade: '3.00',
        description: 'Poor Minus',
        minimumScore: 30,
        maximumScore: 37.99,
        gpaValue: 0.7,
      },
      {
        grade: '2.50',
        description: 'Fail Plus',
        minimumScore: 25,
        maximumScore: 29.99,
        gpaValue: 0.3,
      },
      {
        grade: '2.00',
        description: 'Fail',
        minimumScore: 0,
        maximumScore: 24.99,
        gpaValue: 0.0,
      },
    ];

    bulgarianScales.forEach((scale) => push(scale));
    toast.info('Bulgarian grading system selected', {
      title: 'Grading System',
      description:
        'Default grade scales for the Bulgarian system have been loaded',
      duration: 3000,
    });
  }
});

// Submit form handler
const onSubmit = handleSubmit((formValues) => {
  try {
    // Validate the grade scales before submitting
    if (activeTab.value === 'gradeScales' && !validateGradeScales()) {
      return;
    }

    // Emit the form values
    emit('submit', formValues);

    // Show success toast
    toast.success(
      `Grading system ${props.isEditing ? 'updated' : 'created'} successfully`,
      {
        title: `Grading System ${props.isEditing ? 'Updated' : 'Created'}`,
        description: `Your ${type.value} grading system has been ${props.isEditing ? 'updated' : 'created'} successfully.`,
        duration: 5000,
      }
    );
  } catch (error: any) {
    toast.error(`An error occurred: ${error.message}`, {
      title: 'Error',
      description:
        'There was a problem processing your request. Please try again.',
      duration: 5000,
    });
    message.error(`An error occurred: ${error.message}`);
  }
});
</script>

<style scoped>
.form-container {
  width: 100%;
  max-width: 900px; /* Set a max width for the form */
  margin: 0 auto; /* Center the form */
  padding: 0;
  overflow-y: auto; /* Enable vertical scrolling if needed */
  max-height: calc(100vh - 120px); /* Limit height to prevent overflow */
}

.tabs-container {
  width: 100%;
}

.tab-content {
  padding: 16px 0;
  min-height: 350px; /* Ensure a minimum height for consistency */
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

.grade-scales-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grade-scale-card {
  margin-bottom: 16px;
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

/* Tab styling */
:deep(.n-tabs-tab) {
  font-weight: 500;
  font-size: 15px;
}

:deep(.n-tabs-tab.n-tabs-tab--active) {
  font-weight: 600;
}
</style>
