<!-- components/academic/forms/BulkAssignmentForm.vue -->
<template>
  <div class="bulk-assignment-form-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="flex items-center gap-3 mb-2">
        <div class="header-icon">
          <Icon name="ph:users-three" class="text-xl" />
        </div>
        <div>
          <h2 class="form-title">Bulk Assignment Operations</h2>
          <p class="form-subtitle">
            Assign multiple
            {{
              isHigherEducationInstitution ? 'faculty members' : 'teachers'
            }}
            to multiple
            {{
              isHigherEducationInstitution ? 'courses' : 'grades'
            }}
            simultaneously
          </p>
        </div>
      </div>

      <!-- Operation Type Selector -->
      <div class="operation-selector">
        <n-select
          v-model:value="operationType"
          :options="operationTypeOptions"
          size="medium"
          class="w-48"
        >
          <template #prefix>
            <Icon name="ph:gear" />
          </template>
        </n-select>
      </div>
    </div>

    <n-divider class="my-6" />

    <!-- Form Content -->
    <n-form @submit.prevent="onSubmit">
      <!-- Operation Type Content -->
      <div v-if="operationType === 'assign'" class="space-y-6">
        <!-- Teacher Selection Card -->
        <n-card title="Select Teachers" class="form-card">
          <template #header-extra>
            <Icon name="ph:chalkboard-teacher" class="text-gray-400" />
          </template>

          <div class="space-y-4">
            <!-- Teacher Selection Method -->
            <n-radio-group v-model:value="teacherSelectionMethod" size="medium">
              <n-space>
                <n-radio value="select">
                  <Icon name="ph:hand-pointing" class="mr-1" />
                  Select Individually
                </n-radio>
                <n-radio value="filter">
                  <Icon name="ph:funnel" class="mr-1" />
                  Filter by Criteria
                </n-radio>
                <n-radio value="all">
                  <Icon name="ph:users" class="mr-1" />
                  All Unassigned
                </n-radio>
              </n-space>
            </n-radio-group>

            <!-- Individual Teacher Selection -->
            <n-form-item
              v-if="teacherSelectionMethod === 'select'"
              label="Select Teachers"
              path="selectedTeachers"
              v-bind="selectedTeachersProps"
              class="themed-form-item"
            >
              <n-select
                v-model:value="selectedTeachers"
                :options="teacherOptions"
                multiple
                placeholder="Choose teachers to assign"
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
                      name="ph:user-x"
                      class="text-2xl text-gray-400 mb-2"
                    />
                    <p class="text-gray-500">No teachers available</p>
                  </div>
                </template>
              </n-select>
              <template #feedback>
                <div class="form-help-text">
                  Select
                  {{
                    isHigherEducationInstitution
                      ? 'faculty members'
                      : 'teachers'
                  }}
                  to include in the bulk assignment
                </div>
              </template>
            </n-form-item>

            <!-- Filter-based Selection -->
            <div v-if="teacherSelectionMethod === 'filter'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <n-form-item
                  v-if="isHigherEducationInstitution"
                  label="Filter by Department"
                  class="themed-form-item"
                >
                  <n-select
                    v-model:value="filterDepartment"
                    :options="departmentOptions"
                    placeholder="Select department"
                    clearable
                    size="large"
                    class="themed-select"
                  />
                </n-form-item>

                <n-form-item label="Filter by Status" class="themed-form-item">
                  <n-select
                    v-model:value="filterStatus"
                    :options="statusFilterOptions"
                    placeholder="Select assignment status"
                    clearable
                    size="large"
                    class="themed-select"
                  />
                </n-form-item>
              </div>

              <!-- Filtered Results Preview -->
              <div v-if="filteredTeachers.length > 0" class="filtered-preview">
                <n-alert
                  type="info"
                  :title="`${filteredTeachers.length} teachers match your criteria`"
                >
                  <div class="mt-2 max-h-32 overflow-y-auto">
                    <div class="flex flex-wrap gap-1">
                      <n-tag
                        v-for="teacher in filteredTeachers.slice(0, 10)"
                        :key="teacher.id"
                        size="small"
                        type="info"
                      >
                        {{ teacher.firstName }} {{ teacher.lastName }}
                      </n-tag>
                      <n-tag
                        v-if="filteredTeachers.length > 10"
                        size="small"
                        type="default"
                      >
                        +{{ filteredTeachers.length - 10 }} more
                      </n-tag>
                    </div>
                  </div>
                </n-alert>
              </div>
            </div>

            <!-- All Unassigned Info -->
            <div
              v-if="teacherSelectionMethod === 'all'"
              class="unassigned-info"
            >
              <n-alert type="warning" title="All Unassigned Teachers">
                <p>
                  This will affect all
                  {{ unassignedTeachers.length }} unassigned
                  {{
                    isHigherEducationInstitution
                      ? 'faculty members'
                      : 'teachers'
                  }}
                  in the system.
                </p>
                <div
                  v-if="unassignedTeachers.length > 0"
                  class="mt-2 max-h-32 overflow-y-auto"
                >
                  <div class="flex flex-wrap gap-1">
                    <n-tag
                      v-for="teacher in unassignedTeachers.slice(0, 8)"
                      :key="teacher.id"
                      size="small"
                      type="warning"
                    >
                      {{ teacher.firstName }} {{ teacher.lastName }}
                    </n-tag>
                    <n-tag
                      v-if="unassignedTeachers.length > 8"
                      size="small"
                      type="default"
                    >
                      +{{ unassignedTeachers.length - 8 }} more
                    </n-tag>
                  </div>
                </div>
              </n-alert>
            </div>
          </div>
        </n-card>

        <!-- Grade/Course Assignment Card -->
        <n-card
          :title="`${isHigherEducationInstitution ? 'Course' : 'Grade'} Assignment`"
          class="form-card"
        >
          <template #header-extra>
            <Icon name="ph:graduation-cap" class="text-gray-400" />
          </template>

          <div class="space-y-4">
            <!-- Assignment Strategy -->
            <n-form-item label="Assignment Strategy" class="themed-form-item">
              <n-radio-group v-model:value="assignmentStrategy" size="medium">
                <n-space vertical>
                  <n-radio value="same">
                    <div class="flex items-center gap-2">
                      <Icon name="ph:copy" />
                      <div>
                        <div class="font-medium">Same Assignment</div>
                        <div class="text-xs text-text-secondary">
                          Assign all teachers to the same
                          {{
                            isHigherEducationInstitution ? 'courses' : 'grades'
                          }}
                        </div>
                      </div>
                    </div>
                  </n-radio>
                  <n-radio value="distribute">
                    <div class="flex items-center gap-2">
                      <Icon name="ph:shuffle" />
                      <div>
                        <div class="font-medium">Distribute Evenly</div>
                        <div class="text-xs text-text-secondary">
                          Automatically distribute teachers across available
                          {{
                            isHigherEducationInstitution ? 'courses' : 'grades'
                          }}
                        </div>
                      </div>
                    </div>
                  </n-radio>
                  <n-radio value="custom">
                    <div class="flex items-center gap-2">
                      <Icon name="ph:gear" />
                      <div>
                        <div class="font-medium">Custom Assignment</div>
                        <div class="text-xs text-text-secondary">
                          Manually configure each teacher's assignments
                        </div>
                      </div>
                    </div>
                  </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>

            <!-- Same Assignment Selection -->
            <n-form-item
              v-if="assignmentStrategy === 'same'"
              :label="`Select ${isHigherEducationInstitution ? 'Courses' : 'Grades'}`"
              path="bulkGradeIds"
              v-bind="bulkGradeIdsProps"
              class="themed-form-item"
            >
              <n-select
                v-model:value="bulkGradeIds"
                :options="availableGrades"
                multiple
                :placeholder="`Select ${isHigherEducationInstitution ? 'courses' : 'grades'} for bulk assignment`"
                clearable
                :disabled="loading"
                size="large"
                class="themed-select"
                :max-tag-count="4"
                filterable
              >
                <template #arrow>
                  <Icon name="ph:caret-down" />
                </template>
              </n-select>
              <template #feedback>
                <div class="form-help-text">
                  All selected teachers will be assigned to these
                  {{ isHigherEducationInstitution ? 'courses' : 'grades' }}
                </div>
              </template>
            </n-form-item>

            <!-- Distribution Settings -->
            <div
              v-if="assignmentStrategy === 'distribute'"
              class="distribution-settings"
            >
              <n-form-item
                :label="`Maximum ${isHigherEducationInstitution ? 'Courses' : 'Grades'} per ${isHigherEducationInstitution ? 'Faculty' : 'Teacher'}`"
                class="themed-form-item"
              >
                <n-input-number
                  v-model:value="maxAssignmentsPerTeacher"
                  :min="1"
                  :max="10"
                  size="large"
                  placeholder="e.g., 3"
                  class="w-full"
                />
                <template #feedback>
                  <div class="form-help-text">
                    Limit the number of
                    {{
                      isHigherEducationInstitution ? 'courses' : 'grades'
                    }}
                    each
                    {{
                      isHigherEducationInstitution
                        ? 'faculty member'
                        : 'teacher'
                    }}
                    can be assigned
                  </div>
                </template>
              </n-form-item>

              <n-form-item label="Priority Strategy" class="themed-form-item">
                <n-select
                  v-model:value="distributionPriority"
                  :options="priorityOptions"
                  size="large"
                  class="themed-select"
                />
              </n-form-item>
            </div>

            <!-- Custom Assignment Matrix -->
            <div
              v-if="assignmentStrategy === 'custom'"
              class="custom-assignment-matrix"
            >
              <CustomAssignmentMatrix
                :teachers="getSelectedTeachers()"
                :grades="availableGrades"
                :assignments="customAssignments"
                :is-higher-education-institution="isHigherEducationInstitution"
                @update:assignments="updateCustomAssignments"
              />
            </div>
          </div>
        </n-card>

        <!-- Assignment Preview Card -->
        <n-card
          v-if="assignmentPreview.length > 0"
          title="Assignment Preview"
          class="form-card"
        >
          <template #header-extra>
            <Icon name="ph:eye" class="text-gray-400" />
          </template>

          <div class="preview-content">
            <div
              class="preview-stats grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
            >
              <div class="stat-item">
                <div class="stat-value">{{ assignmentPreview.length }}</div>
                <div class="stat-label">
                  {{ isHigherEducationInstitution ? 'Faculty' : 'Teachers' }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ totalAssignments }}</div>
                <div class="stat-label">Total Assignments</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ avgAssignmentsPerTeacher.toFixed(1) }}
                </div>
                <div class="stat-label">
                  Avg per
                  {{ isHigherEducationInstitution ? 'Faculty' : 'Teacher' }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ uniqueGrades }}</div>
                <div class="stat-label">
                  {{
                    isHigherEducationInstitution ? 'Courses' : 'Grades'
                  }}
                  Affected
                </div>
              </div>
            </div>

            <div class="preview-list max-h-64 overflow-y-auto">
              <div
                v-for="assignment in assignmentPreview"
                :key="assignment.teacherId"
                class="preview-item"
              >
                <div class="teacher-info">
                  <Icon name="ph:chalkboard-teacher" class="text-primary" />
                  <span class="font-medium">{{ assignment.teacherName }}</span>
                </div>
                <div class="assignment-info">
                  <div class="flex flex-wrap gap-1">
                    <n-tag
                      v-for="gradeId in assignment.gradeIds"
                      :key="gradeId"
                      size="small"
                      type="success"
                    >
                      {{ getGradeName(gradeId) }}
                    </n-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-card>
      </div>

      <!-- Unassignment Operations -->
      <div v-else-if="operationType === 'unassign'" class="space-y-6">
        <BulkUnassignmentSection
          :teachers="teachers"
          :is-higher-education-institution="isHigherEducationInstitution"
          @update:selection="updateUnassignmentSelection"
        />
      </div>

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
            :disabled="!canSubmit"
          >
            <template #icon>
              <Icon
                :name="
                  operationType === 'assign' ? 'ph:check' : 'ph:minus-circle'
                "
              />
            </template>
            {{
              operationType === 'assign'
                ? 'Apply Assignments'
                : 'Remove Assignments'
            }}
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
import { z } from 'zod';
import type { SelectOption } from 'naive-ui';
import type { TeacherResponseDto as Teacher } from '~/stores/teacher';
import CustomAssignmentMatrix from '../sections/CustomAssignmentMatrix.vue';
import BulkUnassignmentSection from '../sections/BulkUnassignmentSection.vue';

interface Props {
  teachers: Teacher[];
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

// Form validation schema
const bulkAssignmentSchema = z.object({
  selectedTeachers: z.array(z.string()).optional(),
  bulkGradeIds: z.array(z.string()).optional(),
});

// Utilities
const message = useMessage();

// Form state
const operationType = ref<'assign' | 'unassign'>('assign');
const teacherSelectionMethod = ref<'select' | 'filter' | 'all'>('select');
const assignmentStrategy = ref<'same' | 'distribute' | 'custom'>('same');
const filterDepartment = ref<string | null>(null);
const filterStatus = ref<string | null>(null);
const maxAssignmentsPerTeacher = ref(3);
const distributionPriority = ref('balanced');
const customAssignments = ref<Record<string, string[]>>({});

// Form setup with VeeValidate
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(bulkAssignmentSchema),
  initialValues: {
    selectedTeachers: [],
    bulkGradeIds: [],
  },
});

// Define form fields
const [selectedTeachers, selectedTeachersProps] = defineField(
  'selectedTeachers',
  naiveUiFormsConfig
);
const [bulkGradeIds, bulkGradeIdsProps] = defineField(
  'bulkGradeIds',
  naiveUiFormsConfig
);

// Computed options
const operationTypeOptions = computed(() => [
  { label: 'Assign Teachers', value: 'assign', icon: 'ph:plus' },
  { label: 'Unassign Teachers', value: 'unassign', icon: 'ph:minus' },
]);

const teacherOptions = computed(() => {
  return props.teachers.map((teacher) => ({
    label: `${teacher.firstName} ${teacher.lastName}`,
    value: teacher.id,
    disabled: false,
  }));
});

const departmentOptions = computed(() => [
  { label: 'Computer Science', value: 'cs' },
  { label: 'Mathematics', value: 'math' },
  { label: 'Physics', value: 'physics' },
]);

const statusFilterOptions = computed(() => [
  { label: 'Unassigned', value: 'unassigned' },
  { label: 'Partially Assigned', value: 'partial' },
  { label: 'Full Load', value: 'full' },
]);

const priorityOptions = computed(() => [
  { label: 'Balanced Distribution', value: 'balanced' },
  { label: 'Experience Based', value: 'experience' },
  { label: 'Random', value: 'random' },
]);

// Filtered teachers based on criteria
const filteredTeachers = computed(() => {
  let filtered = [...props.teachers];

  if (filterDepartment.value) {
    filtered = filtered.filter(
      (teacher) => teacher.departmentId === filterDepartment.value
    );
  }

  if (filterStatus.value) {
    filtered = filtered.filter((teacher) => {
      const assignmentCount = teacher.subjects?.length || 0;
      switch (filterStatus.value) {
        case 'unassigned':
          return assignmentCount === 0;
        case 'partial':
          return assignmentCount > 0 && assignmentCount < 3;
        case 'full':
          return assignmentCount >= 3;
        default:
          return true;
      }
    });
  }

  return filtered;
});

const unassignedTeachers = computed(() => {
  return props.teachers.filter(
    (teacher) =>
      (!teacher.subjects || teacher.subjects.length === 0) &&
      !teacher.classGradeId
  );
});

// Get selected teachers based on method
function getSelectedTeachers(): Teacher[] {
  switch (teacherSelectionMethod.value) {
    case 'select':
      return props.teachers.filter((teacher) =>
        selectedTeachers.value?.includes(teacher.id)
      );
    case 'filter':
      return filteredTeachers.value;
    case 'all':
      return unassignedTeachers.value;
    default:
      return [];
  }
}

// Assignment preview computation
const assignmentPreview = computed(() => {
  const teachers = getSelectedTeachers();

  if (assignmentStrategy.value === 'same' && bulkGradeIds.value?.length) {
    return teachers.map((teacher) => ({
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      gradeIds: bulkGradeIds.value || [],
    }));
  }

  if (assignmentStrategy.value === 'distribute' && teachers.length > 0) {
    return distributeTeachersToGrades(teachers);
  }

  if (assignmentStrategy.value === 'custom') {
    return Object.entries(customAssignments.value).map(
      ([teacherId, gradeIds]) => {
        const teacher = props.teachers.find((t) => t.id === teacherId);
        return {
          teacherId,
          teacherName: teacher
            ? `${teacher.firstName} ${teacher.lastName}`
            : 'Unknown',
          gradeIds,
        };
      }
    );
  }

  return [];
});

// Assignment statistics
const totalAssignments = computed(() =>
  assignmentPreview.value.reduce(
    (sum, assignment) => sum + assignment.gradeIds.length,
    0
  )
);

const avgAssignmentsPerTeacher = computed(() =>
  assignmentPreview.value.length > 0
    ? totalAssignments.value / assignmentPreview.value.length
    : 0
);

const uniqueGrades = computed(() => {
  const allGradeIds = new Set();
  assignmentPreview.value.forEach((assignment) => {
    assignment.gradeIds.forEach((gradeId) => allGradeIds.add(gradeId));
  });
  return allGradeIds.size;
});

// Form validation
const canSubmit = computed(() => {
  if (operationType.value === 'assign') {
    const teachers = getSelectedTeachers();
    return teachers.length > 0 && assignmentPreview.value.length > 0;
  }
  return true; // For unassignment, validation handled by child component
});

// Helper functions
function distributeTeachersToGrades(teachers: Teacher[]) {
  // Simple distribution algorithm
  const availableGradeIds = props.availableGrades.map((g) => g.value as string);
  const maxPerTeacher = maxAssignmentsPerTeacher.value;

  return teachers.map((teacher, index) => {
    const startIndex = (index * maxPerTeacher) % availableGradeIds.length;
    const endIndex = Math.min(
      startIndex + maxPerTeacher,
      availableGradeIds.length
    );
    const gradeIds = availableGradeIds.slice(startIndex, endIndex);

    return {
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      gradeIds,
    };
  });
}

function getGradeName(gradeId: string): string {
  const grade = props.availableGrades.find((g) => g.value === gradeId);
  // Handle case where label might be a function or string
  if (grade && grade.label) {
    return typeof grade.label === 'string' ? grade.label : String(grade.label);
  }
  return 'Unknown';
}

function updateCustomAssignments(assignments: Record<string, string[]>) {
  customAssignments.value = assignments;
}

function updateUnassignmentSelection(selection: any) {
  // Handle unassignment selection updates
  console.log('Unassignment selection updated:', selection);
}

// Handle form submission
const onSubmit = handleSubmit(async (values) => {
  try {
    console.log('Bulk assignment form submitted:', values);

    if (operationType.value === 'assign') {
      const assignments = assignmentPreview.value.map((assignment) => ({
        teacherId: assignment.teacherId,
        gradeIds: assignment.gradeIds,
      }));

      emit('submit', {
        type: 'assign',
        assignments,
      });
    } else {
      emit('submit', {
        type: 'unassign',
      });
    }
  } catch (error: any) {
    console.error('Bulk assignment form submission error:', error);
    message.error(`An error occurred: ${error.message}`);
  }
});

// Reset form when operation type changes
watch(operationType, () => {
  selectedTeachers.value = [];
  bulkGradeIds.value = [];
  customAssignments.value = {};
});

onMounted(() => {
  console.log('BulkAssignmentForm mounted', {
    teachers: props.teachers,
    availableGrades: props.availableGrades,
    isHigherEducationInstitution: props.isHigherEducationInstitution,
  });
});
</script>

<style scoped>
/* Same styling patterns as other forms */
.bulk-assignment-form-container {
  max-width: 900px;
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
    var(--color-text-primary, #4ade80) 0%,
    var(--secondary-color, #3b82f6) 100%
  );
  color: white;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--text-color-primary, #1f2937);
}

.form-subtitle {
  font-size: 14px;
  color: var(--color-text-muted, #6b7280);
  margin: 4px 0 0 0;
}

.operation-selector {
  flex-shrink: 0;
}

.form-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.form-card:hover {
  border-color: var(--color-text-primary, #4ade80);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.filtered-preview,
.unassigned-info {
  background: rgba(var(--info-color-rgb, 59, 130, 246), 0.05);
  border-radius: 8px;
  padding: 16px;
}

.distribution-settings {
  background: rgba(var(--warning-color-rgb, 245, 158, 11), 0.05);
  border: 1px solid rgba(var(--warning-color-rgb, 245, 158, 11), 0.2);
  border-radius: 8px;
  padding: 16px;
}

.custom-assignment-matrix {
  background: var(--color-background-secondary, #f8fafc);
  border-radius: 8px;
  padding: 16px;
}

.preview-content {
  background: rgba(var(--success-color-rgb, 34, 197, 94), 0.05);
  border: 1px solid rgba(var(--success-color-rgb, 34, 197, 94), 0.2);
  border-radius: 8px;
  padding: 16px;
}

.preview-stats {
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary, #4ade80);
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-muted, #9ca3af);
  margin-top: 4px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  margin-bottom: 8px;
  background: var(--color-background, #ffffff);
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
}

.assignment-info {
  flex: 1;
  margin-left: 16px;
}

.form-help-text {
  font-size: 12px;
  color: var(--color-text-muted, #9ca3af);
  margin-top: 4px;
}

.form-actions {
  background: var(--card-color);
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
    var(--color-text-primary, #4ade80) 0%,
    var(--secondary-color, #3b82f6) 100%
  );
  border: none;
}

.submit-button:hover {
  background: linear-gradient(
    135deg,
    var(--color-text-primary, #22c55e) 0%,
    var(--secondary-color, #2563eb) 100%
  );
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Themed form components */
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
  color: var(--text-color-primary, #1f2937);
}

:deep(.n-card .n-card__content) {
  padding: 24px;
}

:deep(.n-form-item .n-form-item-label) {
  font-weight: 500;
  color: var(--text-color-primary, #374151);
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

:deep(.n-radio .n-radio__label) {
  display: flex;
  align-items: center;
}

:deep(.n-input-number) {
  width: 100%;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .form-title {
    color: var(--text-color-primary, #f9fafb);
  }

  .form-subtitle {
    color: var(--color-text-muted, #d1d5db);
  }

  .form-card {
    background: var(--card-color, #1f2937);
    border-color: var(--color-border, #374151);
  }

  .preview-item {
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

  .operation-selector {
    align-self: flex-start;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .preview-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .teacher-info {
    min-width: auto;
    margin-bottom: 8px;
  }

  .assignment-info {
    margin-left: 0;
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
