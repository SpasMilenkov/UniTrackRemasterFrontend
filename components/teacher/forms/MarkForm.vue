<!-- components/teacher/forms/MarkForm.vue - SIMPLIFIED ALL-IN-ONE VERSION -->
<template>
  <div class="mark-form-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="flex items-center gap-3 mb-2">
        <div class="header-icon">
          <Icon name="ph:check-square" class="text-xl" />
        </div>
        <div>
          <h2 class="form-title">{{ isEditing ? 'Edit' : 'Add' }} Mark</h2>
          <p class="form-subtitle">
            Record a new mark with institutional grading system support
          </p>
        </div>
      </div>

      <!-- Mark Type Indicator -->
      <div class="mark-indicator">
        <n-tag type="success" size="small">
          <Icon name="ph:graduation-cap" class="mr-1" />
          Academic Assessment
        </n-tag>
      </div>
    </div>

    <n-divider class="my-6" />

    <!-- Form Content -->
    <n-form
      ref="formRef"
      :model="formModel"
      label-placement="top"
      require-mark-placement="right-hanging"
      @submit.prevent="onSubmit"
    >
      <!-- Semester Context Card (Auto-selected and locked) -->
      <n-card title="Semester Context" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:calendar" class="text-text-secondary" />
        </template>

        <div class="grid grid-cols-1 gap-6">
          <n-form-item label="Academic Semester" path="semesterId">
            <n-select
              v-model:value="formModel.semesterId"
              :options="semesterOptions"
              placeholder="Current semester"
              disabled
              size="large"
            >
              <template #arrow>
                <Icon name="ph:lock" class="text-text-muted" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Automatically selected current semester
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Assignment Details Card -->
      <n-card title="Assignment Details" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:clipboard-text" class="text-text-secondary" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Teacher (Read-only) -->
          <n-form-item label="Teacher" class="md:col-span-2">
            <n-select
              :value="teacherId"
              :options="[teacherOption]"
              disabled
              size="large"
              placeholder="Teacher assignment"
            >
              <template #arrow>
                <Icon name="ph:lock" class="text-text-muted" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Automatically assigned to current teacher
              </div>
            </template>
          </n-form-item>

          <!-- Subject -->
          <n-form-item label="Subject" path="subjectId" required>
            <n-select
              v-model:value="formModel.subjectId"
              :options="subjectOptions"
              placeholder="Select subject"
              :disabled="loading || subjectOptions.length === 0"
              :loading="loadingSubjects"
              size="large"
              filterable
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="ph:book-x"
                    class="text-2xl text-text-secondary mb-2"
                  />
                  <p class="text-text-secondary">No subjects available</p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Select the subject for this assessment
              </div>
            </template>
          </n-form-item>

          <!-- Student -->
          <n-form-item label="Student" path="studentId" required>
            <n-select
              v-model:value="formModel.studentId"
              :options="studentOptions"
              placeholder="Select student"
              :disabled="loading || studentOptions.length === 0"
              :loading="loadingStudents"
              size="large"
              filterable
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="ph:user-x"
                    class="text-2xl text-text-secondary mb-2"
                  />
                  <p class="text-text-secondary">No students available</p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">Select the student to assess</div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Grade/Score Assessment Card -->
      <n-card title="Grade Assessment" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:graduation-cap" class="text-text-secondary" />
        </template>

        <div class="space-y-6">
          <!-- Input Mode Toggle -->
          <div class="flex items-center gap-2 mb-3">
            <n-radio-group v-model:value="inputMode" size="small">
              <n-radio value="grade">Grade</n-radio>
              <n-radio value="score">Score</n-radio>
            </n-radio-group>
          </div>

          <!-- Grade Input Mode -->
          <div v-if="inputMode === 'grade'">
            <n-form-item label="Grade" path="grade" required>
              <n-select
                v-model:value="formModel.grade"
                :options="gradeOptions"
                placeholder="Select grade"
                :loading="loading"
                :disabled="loading || gradeOptions.length === 0"
                size="large"
                filterable
                clearable
                @update:value="handleGradeChange"
              >
                <template #empty>
                  <div class="text-center py-4 text-text-secondary">
                    <Icon name="ph:graduation-cap" class="text-2xl mb-2" />
                    <p class="text-sm">No grading system configured</p>
                  </div>
                </template>
              </n-select>
              <template #feedback>
                <div class="form-help-text">
                  Select a grade from your institution's grading system
                </div>
              </template>
            </n-form-item>

            <!-- Grade Conversion Display -->
            <div
              v-if="formModel.grade && selectedGradeInfo"
              class="p-3 rounded-lg bg-background-secondary border border-border"
            >
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p class="text-text-muted">Score Range</p>
                  <p class="font-medium text-text-primary">
                    {{ selectedGradeInfo.minimumScore }}-{{
                      selectedGradeInfo.maximumScore
                    }}
                  </p>
                </div>
                <div>
                  <p class="text-text-muted">GPA Points</p>
                  <p class="font-medium text-text-primary">
                    {{ selectedGradeInfo.gpaValue }}
                  </p>
                </div>
                <div>
                  <p class="text-text-muted">Status</p>
                  <n-tag
                    :type="getStatusTagType(selectedGradeInfo.description)"
                    size="small"
                  >
                    {{ getGradeStatus(selectedGradeInfo.description) }}
                  </n-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- Score Input Mode -->
          <div v-else>
            <n-form-item label="Score" path="score" required>
              <n-input-number
                v-model:value="formModel.score"
                placeholder="Enter score (0-100)"
                :min="0"
                :max="100"
                :precision="1"
                :loading="loading"
                :disabled="loading"
                size="large"
                class="w-full"
                @update:value="handleScoreChange"
              >
                <template #suffix>
                  <span class="text-text-muted">/ 100</span>
                </template>
              </n-input-number>
              <template #feedback>
                <div class="form-help-text">
                  Enter a numerical score between 0 and 100
                </div>
              </template>
            </n-form-item>

            <!-- Score Conversion Display -->
            <div
              v-if="formModel.score !== null && scoreConversion"
              class="p-3 rounded-lg bg-background-secondary border border-border"
            >
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p class="text-text-muted">Equivalent Grade</p>
                  <p class="font-medium text-text-primary">
                    {{ scoreConversion.grade }}
                  </p>
                </div>
                <div>
                  <p class="text-text-muted">GPA Points</p>
                  <p class="font-medium text-text-primary">
                    {{ scoreConversion.gpaPoints }}
                  </p>
                </div>
                <div>
                  <p class="text-text-muted">Status</p>
                  <n-tag
                    :type="getStatusTagType(scoreConversion.status)"
                    size="small"
                  >
                    {{ scoreConversion.status }}
                  </n-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- Mark Type and Topic -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Mark Type -->
            <n-form-item label="Assessment Type" path="type" required>
              <n-select
                v-model:value="formModel.type"
                :options="markTypeOptions"
                placeholder="Select assessment type"
                :disabled="loading"
                size="large"
                clearable
              >
                <template #arrow>
                  <Icon name="ph:caret-down" />
                </template>
              </n-select>
              <template #feedback>
                <div class="form-help-text">
                  Choose the type of assessment being graded
                </div>
              </template>
            </n-form-item>

            <!-- Topic -->
            <n-form-item label="Topic" path="topic" required>
              <n-input
                v-model:value="formModel.topic"
                placeholder="Enter assessment topic"
                :disabled="loading"
                size="large"
                :maxlength="100"
                show-count
              >
                <template #prefix>
                  <Icon name="ph:text-aa" class="text-text-secondary" />
                </template>
              </n-input>
              <template #feedback>
                <div class="form-help-text">
                  Brief description of what is being assessed
                </div>
              </template>
            </n-form-item>
          </div>

          <!-- Description -->
          <n-form-item label="Description" path="description">
            <n-input
              v-model:value="formModel.description"
              type="textarea"
              placeholder="Enter additional details about the assessment (optional)"
              :disabled="loading"
              :rows="4"
              :maxlength="500"
              show-count
            />
            <template #feedback>
              <div class="form-help-text">
                Optional detailed description or notes about the assessment
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Grading System Reference -->
      <n-card
        v-if="gradingSystem && gradingSystem.gradeScales"
        title="Grading System Reference"
        class="form-card mb-6"
      >
        <template #header-extra>
          <Icon name="ph:chart-line" class="text-text-secondary" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="scale in sortedGradeScales"
            :key="scale.id"
            class="text-center p-3 rounded-lg border border-border bg-background-secondary"
          >
            <div class="text-lg font-bold text-text-primary">
              {{ scale.grade }}
            </div>
            <div class="text-sm text-text-secondary">
              {{ scale.minimumScore }}-{{ scale.maximumScore }}
            </div>
            <div class="text-xs text-text-muted">{{ scale.gpaValue }} GPA</div>
            <n-tag
              :type="getGradeStatusTagType(scale.description)"
              size="tiny"
              class="mt-1"
            >
              {{ getGradeStatusText(scale.description) }}
            </n-tag>
          </div>
        </div>

        <n-alert type="info" class="mt-4">
          <Icon name="ph:info" class="mr-2" />
          Use your institution's grading system for consistent evaluation.
        </n-alert>
      </n-card>

      <!-- Form Actions -->
      <div class="form-actions">
        <!-- Debug Info -->
        <div class="mb-4 p-3 rounded bg-gray-800 text-xs text-white">
          <p><strong>Debug Info:</strong></p>
          <p>Input Mode: "{{ inputMode }}"</p>
          <p>Grade: "{{ formModel.grade || 'null' }}"</p>
          <p>Score: "{{ formModel.score || 'null' }}"</p>
          <p>Type: "{{ formModel.type || 'null' }}"</p>
          <p>Semester ID: "{{ formModel.semesterId || 'null' }}"</p>
          <p>Teacher ID: "{{ formModel.teacherId || 'null' }}"</p>
          <p>Validation Errors: {{ JSON.stringify(validationErrors) }}</p>
          <p>Has Grading System: {{ !!gradingSystem }}</p>
          <p>Grade Options: {{ gradeOptions.length }}</p>
          <p>Selected Grade Info: {{ !!selectedGradeInfo }}</p>
          <p>Score Conversion: {{ !!scoreConversion }}</p>
        </div>

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
            {{ isEditing ? 'Update' : 'Add' }} Mark
          </n-button>
        </n-space>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useNotification } from 'naive-ui';
import type { SelectOption } from 'naive-ui';
import { useAuthStore } from '@/stores/auth';
import { useTeacherStore } from '@/stores/teacher';
import type {
  CreateMarkDto,
  UpdateMarkDto,
  InstitutionGradingSystemDto,
  GradeScaleDto,
} from '@/stores/teacher';
import { MarkType } from '~/enums/mark-type.enum';

// Helper functions
const getGradeStatusText = (description?: string): string => {
  if (!description) return 'pass';
  const desc = description.toLowerCase();
  if (desc.includes('fail')) return 'fail';
  if (desc.includes('conditional') || desc.includes('repeat'))
    return 'conditional';
  return 'pass';
};

const getGradeStatusTagType = (
  description?: string
): 'success' | 'error' | 'warning' => {
  const status = getGradeStatusText(description);
  switch (status) {
    case 'pass':
      return 'success';
    case 'fail':
      return 'error';
    case 'conditional':
      return 'warning';
    default:
      return 'success';
  }
};

const getStatusTagType = (status?: string): 'success' | 'error' | 'warning' => {
  switch (status) {
    case 'pass':
      return 'success';
    case 'fail':
      return 'error';
    case 'conditional':
      return 'warning';
    default:
      return 'success';
  }
};

const getGradeStatus = (description?: string): string => {
  return getGradeStatusText(description);
};

const sortGradeScales = (scales: GradeScaleDto[]): GradeScaleDto[] => {
  return [...scales].sort((a, b) => {
    const gradeA = parseFloat(a.grade);
    const gradeB = parseFloat(b.grade);
    return gradeB - gradeA;
  });
};

interface Props {
  loading?: boolean;
  isEditing?: boolean;
  initialValues?: any;
  teacherId?: string;
  teacherName?: string;
  subjectOptions?: Array<{ label: string; value: string }>;
  studentOptions?: Array<{ label: string; value: string }>;
  semesterOptions?: Array<{ label: string; value: string }>;
  loadingSubjects?: boolean;
  loadingStudents?: boolean;
  loadingSemesters?: boolean;
  gradingSystem?: InstitutionGradingSystemDto | null;
  semesterId?: string | null;
  institutionId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  loading: false,
  loadingSubjects: false,
  loadingStudents: false,
  loadingSemesters: false,
  subjectOptions: () => [],
  studentOptions: () => [],
  semesterOptions: () => [],
});

const emit = defineEmits<{
  (e: 'submit', data: CreateMarkDto | UpdateMarkDto): void;
  (e: 'cancel'): void;
}>();

// Utilities
const notification = useNotification();
const authStore = useAuthStore();
const teacherStore = useTeacherStore();

// Form reference
const formRef = ref();

// Form state
const inputMode = ref<'grade' | 'score'>('grade');
const selectedGradeInfo = ref<GradeScaleDto | null>(null);
const scoreConversion = ref<{
  grade: string;
  gpaPoints: number;
  status: string;
} | null>(null);
const validationErrors = ref<Record<string, string>>({});

// Form model
const formModel = ref({
  grade: null as string | null,
  score: null as number | null,
  topic: '',
  description: '',
  type: MarkType.Assignment,
  subjectId: '',
  teacherId: props.teacherId || '',
  studentId: '',
  semesterId: props.semesterId || null,
});

// Computed properties
const institutionId = computed(() => {
  return props.institutionId || authStore.user?.institutionId || '';
});

const gradingSystem = computed(() => props.gradingSystem);

const sortedGradeScales = computed(() => {
  if (!gradingSystem.value?.gradeScales) return [];
  return sortGradeScales(gradingSystem.value.gradeScales);
});

const gradeOptions = computed(() => {
  if (!gradingSystem.value?.gradeScales) return [];
  return sortedGradeScales.value.map((scale) => ({
    label: `${scale.grade} (${scale.minimumScore}-${scale.maximumScore}) - ${scale.gpaValue} GPA`,
    value: scale.grade,
    scale,
  }));
});

const teacherOption = computed(() => ({
  label: props.teacherName || 'Current Teacher',
  value: props.teacherId || '',
  disabled: true,
}));

const markTypeOptions = computed<SelectOption[]>(() => [
  { label: 'Written Examination', value: MarkType.WrittenExamination },
  { label: 'Oral Examination', value: MarkType.OralExamination },
  { label: 'Assignment', value: MarkType.Assignment },
  { label: 'Project', value: MarkType.Project },
  { label: 'Quiz', value: MarkType.Quiz },
  { label: 'Active Participation', value: MarkType.ActiveParticipation },
  { label: 'Homework', value: MarkType.Homework },
  { label: 'Lab Work', value: MarkType.LabWork },
  { label: 'Presentation', value: MarkType.Presentation },
  { label: 'Other', value: MarkType.Other },
]);

// Methods
const handleGradeChange = (grade: string | null) => {
  formModel.value.grade = grade;
  formModel.value.score = null; // Clear score when grade is selected

  if (grade) {
    const option = gradeOptions.value.find((opt) => opt.value === grade);
    if (option?.scale) {
      selectedGradeInfo.value = option.scale;
    }
  } else {
    selectedGradeInfo.value = null;
  }

  clearValidationError('grade');
  clearValidationError('score');
};

const handleScoreChange = async (score: number | null) => {
  formModel.value.score = score;
  formModel.value.grade = null; // Clear grade when score is entered

  if (score !== null && score >= 0 && score <= 100 && institutionId.value) {
    try {
      const conversion = await teacherStore.convertScoreToGrade(
        score,
        institutionId.value
      );
      scoreConversion.value = conversion;
    } catch (error) {
      console.error('Score conversion failed:', error);
      scoreConversion.value = null;
    }
  } else {
    scoreConversion.value = null;
  }

  clearValidationError('grade');
  clearValidationError('score');
};

const validateForm = (): boolean => {
  validationErrors.value = {};

  // Validate required fields
  if (!formModel.value.subjectId) {
    validationErrors.value.subjectId = 'Subject is required';
  }
  if (!formModel.value.studentId) {
    validationErrors.value.studentId = 'Student is required';
  }
  if (!formModel.value.topic.trim()) {
    validationErrors.value.topic = 'Topic is required';
  }
  if (!formModel.value.type) {
    validationErrors.value.type = 'Assessment type is required';
  }

  // Validate either grade or score
  const hasGrade =
    formModel.value.grade && formModel.value.grade.trim().length > 0;
  const hasScore =
    formModel.value.score !== null && formModel.value.score !== undefined;

  if (!hasGrade && !hasScore) {
    validationErrors.value.grade = 'Either grade or score must be provided';
  }

  return Object.keys(validationErrors.value).length === 0;
};

const clearValidationError = (field: string) => {
  if (validationErrors.value[field]) {
    delete validationErrors.value[field];
  }
};

const onSubmit = () => {
  if (!validateForm()) {
    notification.error({
      title: 'Validation Error',
      content: 'Please check the form for errors',
      duration: 5000,
    });
    return;
  }

  // Prepare submission data
  const submissionData: CreateMarkDto | UpdateMarkDto = {
    topic: formModel.value.topic,
    description: formModel.value.description || undefined,
    type: formModel.value.type,
    subjectId: formModel.value.subjectId,
    teacherId: formModel.value.teacherId,
    studentId: formModel.value.studentId,
    ...(formModel.value.semesterId
      ? { semesterId: formModel.value.semesterId }
      : {}),
  };

  // Add either grade or score
  if (formModel.value.grade) {
    submissionData.grade = formModel.value.grade;
  } else if (formModel.value.score !== null) {
    submissionData.score = formModel.value.score;
  }

  console.log('Submitting mark data:', submissionData);
  emit('submit', submissionData);
};

const resetForm = () => {
  formModel.value = {
    grade: null,
    score: null,
    topic: '',
    description: '',
    type: MarkType.Assignment,
    subjectId: '',
    teacherId: props.teacherId || '',
    studentId: '',
    semesterId: props.semesterId || null,
  };
  selectedGradeInfo.value = null;
  scoreConversion.value = null;
  validationErrors.value = {};
  inputMode.value = 'grade';
};

// Watch for props changes
watch(
  () => props.teacherId,
  (newTeacherId) => {
    if (newTeacherId) {
      formModel.value.teacherId = newTeacherId;
    }
  }
);

watch(
  () => props.semesterId,
  (newSemesterId) => {
    if (newSemesterId && !props.isEditing) {
      formModel.value.semesterId = newSemesterId;
    }
  }
);

watch(
  () => props.initialValues,
  (newValues) => {
    if (newValues && props.isEditing) {
      Object.assign(formModel.value, newValues);

      if (newValues.grade) {
        inputMode.value = 'grade';
        handleGradeChange(newValues.grade);
      } else if (newValues.score !== undefined) {
        inputMode.value = 'score';
        handleScoreChange(newValues.score);
      }
    }
  },
  { deep: true, immediate: true }
);

// Initialize on mount
onMounted(() => {
  // Auto-select current semester and lock it
  if (props.semesterId && !props.isEditing) {
    formModel.value.semesterId = props.semesterId;
  }

  // Set teacher ID
  if (props.teacherId) {
    formModel.value.teacherId = props.teacherId;
  }

  // Initialize from initial values if editing
  if (props.isEditing && props.initialValues) {
    Object.assign(formModel.value, props.initialValues);

    if (props.initialValues.grade) {
      inputMode.value = 'grade';
      handleGradeChange(props.initialValues.grade);
    } else if (props.initialValues.score !== undefined) {
      inputMode.value = 'score';
      handleScoreChange(props.initialValues.score);
    }
  }
});

// Expose methods
defineExpose({
  resetForm,
});
</script>

<style scoped>
.mark-form-container {
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
    var(--color-primary, #4ade80) 0%,
    var(--color-secondary, #3b82f6) 100%
  );
  color: white;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary, #f5f5f5);
}

.form-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary, #9ca3af);
  margin: 4px 0 0 0;
}

.mark-indicator {
  flex-shrink: 0;
}

.form-card {
  background: var(--color-background-card, #18181c);
  border: 1px solid var(--color-border, #374151);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.form-card:hover {
  border-color: var(--color-primary, #4ade80);
}

.form-help-text {
  font-size: 12px;
  color: var(--color-text-muted, rgba(156, 163, 175, 0.7));
  margin-top: 4px;
}

.form-actions {
  background: var(--color-background-card, #18181c);
  border-top: 1px solid var(--color-border, #374151);
  padding: 24px;
  margin: 0 -24px -24px -24px;
  border-radius: 0 0 12px 12px;
}

.cancel-button {
  min-width: 100px;
  color: var(--color-text-secondary, #9ca3af);
}

.submit-button {
  min-width: 140px;
  background: linear-gradient(
    135deg,
    var(--color-primary, #4ade80) 0%,
    var(--color-secondary, #3b82f6) 100%
  );
  border: none;
}

.submit-button:hover {
  background: linear-gradient(
    135deg,
    var(--color-primary-dark, #22c55e) 0%,
    var(--color-secondary-dark, #2563eb) 100%
  );
}

/* NaiveUI theming */
:deep(.n-card .n-card-header) {
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid var(--color-border, #374151);
}

:deep(.n-card .n-card-header .n-card-header__main) {
  font-weight: 600;
  color: var(--color-text-primary, #f5f5f5);
}

:deep(.n-card .n-card__content) {
  padding: 24px;
}

:deep(.n-form-item .n-form-item-label) {
  font-weight: 500;
  color: var(--color-text-primary, #f5f5f5);
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

  .mark-indicator {
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
