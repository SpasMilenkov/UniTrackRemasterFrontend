<!-- components/academic/forms/TeacherAssignmentForm.vue -->
<template>
  <div class="teacher-assignment-form-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="flex items-center gap-3 mb-2">
        <div class="header-icon">
          <Icon name="ph:graduation-cap" class="text-xl" />
        </div>
        <div>
          <h2 class="form-title">
            Manage
            {{ isHigherEducationInstitution ? 'Course' : 'Grade' }} Assignments
          </h2>
          <p class="form-subtitle">
            Assign {{ teacher?.firstName }} {{ teacher?.lastName }} to
            {{ isHigherEducationInstitution ? 'courses' : 'grade levels' }} and
            homeroom responsibilities
          </p>
        </div>
      </div>

      <!-- Teacher Info Display -->
      <div class="teacher-info">
        <n-tag type="info" size="medium">
          <Icon name="ph:chalkboard-teacher" class="mr-1" />
          {{ teacher?.firstName }} {{ teacher?.lastName }}
        </n-tag>
      </div>
    </div>

    <n-divider class="my-6" />

    <!-- Form Content -->
    <n-form @submit.prevent="onSubmit">
      <!-- Current Assignments Overview -->
      <n-card
        v-if="currentAssignments.length > 0"
        title="Current Assignments"
        class="form-card mb-6"
      >
        <template #header-extra>
          <Icon name="ph:list" class="text-gray-400" />
        </template>

        <div class="current-assignments-grid">
          <div
            v-for="assignment in currentAssignments"
            :key="assignment.id"
            class="assignment-card"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon
                  :name="assignment.isHomeroom ? 'ph:house' : 'ph:book-open'"
                  :class="
                    assignment.isHomeroom ? 'text-warning' : 'text-primary'
                  "
                />
                <div>
                  <div class="font-medium">{{ assignment.name }}</div>
                  <div class="text-xs text-text-secondary">
                    {{ assignment.studentCount }} students
                    {{ assignment.isHomeroom ? '(Homeroom)' : '' }}
                  </div>
                </div>
              </div>
              <n-tag
                :type="assignment.isHomeroom ? 'warning' : 'success'"
                size="small"
              >
                {{
                  assignment.isHomeroom
                    ? 'Homeroom'
                    : isHigherEducationInstitution
                      ? 'Course'
                      : 'Grade'
                }}
              </n-tag>
            </div>
          </div>
        </div>
      </n-card>

      <!-- Assignment Selection Card -->
      <n-card title="Assignment Configuration" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:gear" class="text-gray-400" />
        </template>

        <div class="space-y-6">
          <!-- Grade/Course Assignments -->
          <n-form-item
            :label="`${isHigherEducationInstitution ? 'Course' : 'Grade'} Assignments`"
            path="gradeIds"
            v-bind="gradeIdsProps"
            class="themed-form-item"
          >
            <n-select
              v-model:value="gradeIds"
              :options="availableGradeOptions"
              multiple
              :placeholder="`Select ${isHigherEducationInstitution ? 'courses' : 'grades'} to assign`"
              clearable
              :disabled="loading"
              size="large"
              class="themed-select"
              :max-tag-count="3"
              filterable
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
                      isHigherEducationInstitution ? 'courses' : 'grades'
                    }}
                    available
                  </p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Select multiple
                {{ isHigherEducationInstitution ? 'courses' : 'grades' }} that
                this
                {{
                  isHigherEducationInstitution ? 'faculty member' : 'teacher'
                }}
                will be responsible for
              </div>
            </template>
          </n-form-item>

          <!-- Homeroom Assignment -->
          <n-form-item
            label="Homeroom Assignment (Optional)"
            path="homeroomGradeId"
            v-bind="homeroomGradeIdProps"
            class="themed-form-item"
          >
            <n-select
              v-model:value="homeroomGradeId"
              :options="homeroomOptions"
              :placeholder="`Select homeroom ${isHigherEducationInstitution ? 'class' : 'grade'}`"
              clearable
              :disabled="loading"
              size="large"
              class="themed-select"
              filterable
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon name="ph:house-x" class="text-2xl text-gray-400 mb-2" />
                  <p class="text-gray-500">No homeroom positions available</p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Optional: Assign as homeroom
                {{ isHigherEducationInstitution ? 'advisor' : 'teacher' }} for a
                specific
                {{ isHigherEducationInstitution ? 'class' : 'grade' }}
              </div>
            </template>
          </n-form-item>

          <!-- Assignment Summary -->
          <div
            v-if="selectedAssignmentSummary.total > 0"
            class="assignment-summary"
          >
            <n-alert type="info" title="Assignment Summary">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                <div class="text-center">
                  <div class="text-lg font-semibold text-primary">
                    {{ selectedAssignmentSummary.total }}
                  </div>
                  <div class="text-sm text-text-secondary">
                    Total Assignments
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-semibold text-success">
                    {{ selectedAssignmentSummary.regular }}
                  </div>
                  <div class="text-sm text-text-secondary">
                    {{ isHigherEducationInstitution ? 'Courses' : 'Grades' }}
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-semibold text-warning">
                    {{ selectedAssignmentSummary.homeroom }}
                  </div>
                  <div class="text-sm text-text-secondary">Homeroom</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-semibold text-info">
                    {{ selectedAssignmentSummary.estimatedStudents }}
                  </div>
                  <div class="text-sm text-text-secondary">Est. Students</div>
                </div>
              </div>
            </n-alert>
          </div>
        </div>
      </n-card>

      <!-- Assignment Rules & Guidelines -->
      <n-card title="Assignment Guidelines" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:info" class="text-gray-400" />
        </template>

        <div class="guidelines-content">
          <div class="guideline-item">
            <Icon name="ph:check-circle" class="text-success" />
            <span
              >{{
                isHigherEducationInstitution ? 'Faculty members' : 'Teachers'
              }}
              can be assigned to multiple
              {{ isHigherEducationInstitution ? 'courses' : 'grades' }}</span
            >
          </div>
          <div class="guideline-item">
            <Icon name="ph:check-circle" class="text-success" />
            <span
              >Only one
              {{
                isHigherEducationInstitution ? 'faculty member' : 'teacher'
              }}
              can be homeroom
              {{ isHigherEducationInstitution ? 'advisor' : 'teacher' }} per
              {{ isHigherEducationInstitution ? 'class' : 'grade' }}</span
            >
          </div>
          <div class="guideline-item">
            <Icon name="ph:warning" class="text-warning" />
            <span
              >Removing assignments may affect student records and
              gradebooks</span
            >
          </div>
          <div class="guideline-item">
            <Icon name="ph:info" class="text-info" />
            <span
              >Changes take effect immediately and will notify affected
              students</span
            >
          </div>
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
            :disabled="!hasChanges"
          >
            <template #icon>
              <Icon name="ph:check" />
            </template>
            Update Assignments
          </n-button>
        </n-space>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useMessage } from 'naive-ui';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import * as z from 'zod';
import type { SelectOption } from 'naive-ui';
import type {
  TeacherResponseDto as Teacher,
  GradeAssignmentResponseDto,
} from '~/stores/teacher';

interface Props {
  teacher: Teacher | null;
  currentAssignments: GradeAssignmentResponseDto[];
  availableGrades: SelectOption[];
  isHigherEducationInstitution: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  (e: 'submit', data: any): void;
  (e: 'cancel'): void;
}>();

// Utilities
const message = useMessage();

// Create local schema that includes both fields
const localFormSchema = z.object({
  gradeIds: z.array(z.string()).default([]),
  homeroomGradeId: z.string().nullable().default(null),
});

type FormData = z.infer<typeof localFormSchema>;

// Get currently assigned grade IDs
const currentlyAssignedGradeIds = computed(() =>
  props.currentAssignments.map((assignment) => assignment.id)
);

const currentHomeroomGradeId = computed(
  () =>
    props.currentAssignments.find((assignment) => assignment.isHomeroom)?.id ||
    null
);

// Form setup with VeeValidate
const { handleSubmit, defineField, setFieldValue } = useForm<FormData>({
  validationSchema: toTypedSchema(localFormSchema),
  initialValues: {
    gradeIds: currentlyAssignedGradeIds.value,
    homeroomGradeId: currentHomeroomGradeId.value,
  },
});

// Define form fields
const [gradeIds, gradeIdsProps] = defineField('gradeIds', naiveUiFormsConfig);
const [homeroomGradeId, homeroomGradeIdProps] = defineField(
  'homeroomGradeId',
  naiveUiFormsConfig
);

// Available options (excluding currently assigned homeroom from regular assignments)
const availableGradeOptions = computed(() => {
  return props.availableGrades.map((grade) => ({
    ...grade,
    disabled: false, // Could add logic for already assigned grades by other teachers
  }));
});

// Homeroom options (only grades that are in the regular assignment list or available)
const homeroomOptions = computed(() => {
  const selectedGradeIds = gradeIds.value || [];

  return props.availableGrades
    .filter((grade) => selectedGradeIds.includes(grade.value as string))
    .map((grade) => ({
      ...grade,
      label: `${grade.label} (Homeroom)`,
    }));
});

// Assignment summary computation
const selectedAssignmentSummary = computed(() => {
  const selectedGrades = gradeIds.value || [];
  const hasHomeroom = !!homeroomGradeId.value;

  // Estimate students based on grade assignments (placeholder logic)
  const estimatedStudents = selectedGrades.length * 25 + (hasHomeroom ? 30 : 0);

  return {
    total: selectedGrades.length + (hasHomeroom ? 1 : 0),
    regular: selectedGrades.length,
    homeroom: hasHomeroom ? 1 : 0,
    estimatedStudents,
  };
});

// Check if there are changes from current state
const hasChanges = computed(() => {
  const currentGradeIds = new Set(currentlyAssignedGradeIds.value);
  const selectedGradeIds = new Set(gradeIds.value || []);

  // Check if grade assignments changed
  const gradeAssignmentsChanged =
    currentGradeIds.size !== selectedGradeIds.size ||
    [...currentGradeIds].some((id) => !selectedGradeIds.has(id)) ||
    [...selectedGradeIds].some((id) => !currentGradeIds.has(id));

  // Check if homeroom assignment changed
  const homeroomChanged =
    currentHomeroomGradeId.value !== homeroomGradeId.value;

  return gradeAssignmentsChanged || homeroomChanged;
});

// Handle form submission
const onSubmit = handleSubmit(async (values) => {
  try {
    console.log('Assignment form submitted with values:', values);

    // Prepare submission data
    const submissionData = {
      gradeIds: values.gradeIds || [],
      homeroomGradeId: values.homeroomGradeId || null,
    };

    console.log('Final assignment submission data:', submissionData);
    emit('submit', submissionData);
  } catch (error: any) {
    console.error('Assignment form submission error:', error);
    message.error(`An error occurred: ${error.message}`);
  }
});

// Watch for homeroom selection changes
watch(homeroomGradeId, (newHomeroomId: string | null) => {
  if (
    newHomeroomId &&
    gradeIds.value &&
    !gradeIds.value.includes(newHomeroomId)
  ) {
    // If homeroom is selected but not in regular assignments, add it
    setFieldValue('gradeIds', [...(gradeIds.value || []), newHomeroomId]);
  }
});

// Initialize form when props change
watch(
  () => [props.currentAssignments, props.teacher],
  () => {
    if (props.teacher) {
      setFieldValue('gradeIds', currentlyAssignedGradeIds.value);
      setFieldValue('homeroomGradeId', currentHomeroomGradeId.value);
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  console.log('TeacherAssignmentForm mounted', {
    teacher: props.teacher,
    currentAssignments: props.currentAssignments,
    availableGrades: props.availableGrades,
  });
});
</script>

<style scoped>
.teacher-assignment-form-container {
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
    var(--color-secondary, #4ade80) 0%,
    var(--color-primary, #3b82f6) 100%
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

.teacher-info {
  flex-shrink: 0;
}

.form-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.form-card:hover {
  border-color: var(--primary-color, #4ade80);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.current-assignments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.assignment-card {
  padding: 16px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  background: var(--color-background, #ffffff);
  transition: all 0.2s ease;
}

.assignment-card:hover {
  border-color: var(--primary-color, #4ade80);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.assignment-summary {
  background: rgba(var(--info-color-rgb, 59, 130, 246), 0.05);
  border: 1px solid rgba(var(--info-color-rgb, 59, 130, 246), 0.2);
  border-radius: 8px;
  padding: 16px;
}

.guidelines-content {
  display: grid;
  gap: 12px;
}

.guideline-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-color-muted, #6b7280);
}

.form-help-text {
  font-size: 12px;
  color: var(--text-color-3, #9ca3af);
  margin-top: 4px;
}

.form-actions {
  background: var(--color-card);
  border-top: 1px solid var(--color-border);
  padding: 24px;
  margin: 0 -24px -24px -24px;
  border-radius: 0 0 12px 12px;
}

.cancel-button {
  min-width: 100px;
}

.submit-button {
  min-width: 180px;
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

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Same theming pattern as other forms */
:deep(.themed-form-item .n-form-item-label) {
  color: var(--color-text-primary) !important;
  font-weight: 600;
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
  border-bottom: 1px solid var(--color-border, #f3f4f6);
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
  color: var(--color-text-primary, #374151);
  margin-bottom: 8px;
}

:deep(.n-form-item-feedback-wrapper) {
  min-height: 24px;
}

:deep(.n-form-item) {
  margin-bottom: 20px;
}

:deep(.n-base-selection.n-base-selection--large) {
  min-height: 44px;
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
    color: var(--text-color-muted, #d1d5db);
  }

  .form-card {
    background: var(--color-card, #1f2937);
    border-color: var(--color-border, #374151);
  }

  .assignment-card {
    background: var(--color-background, #374151);
    border-color: var(--color-border, #4b5563);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .teacher-info {
    align-self: flex-start;
  }

  .current-assignments-grid {
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
