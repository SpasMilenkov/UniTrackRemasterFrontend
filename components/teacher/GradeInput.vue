<!-- components/teacher/GradeInput.vue -->
<template>
  <div class="grade-input">
    <div v-if="showLabel" class="flex items-center gap-2 mb-2">
      <Icon name="ph:graduation-cap" class="text-lg text-primary" />
      <span class="text-sm font-medium text-text-primary">{{ label }}</span>
      <span v-if="required" class="text-red-500">*</span>
    </div>

    <!-- Input Mode Toggle -->
    <div class="flex items-center gap-2 mb-3">
      <n-radio-group v-model:value="inputMode" size="small">
        <n-radio value="grade">Grade</n-radio>
        <n-radio value="score">Score</n-radio>
      </n-radio-group>

      <n-button v-if="showSwapButton" text size="small" @click="swapInputMode">
        <Icon name="ph:arrows-horizontal" />
      </n-button>
    </div>

    <!-- Grade Input Mode -->
    <div v-if="inputMode === 'grade'" class="space-y-3">
      <n-select
        v-model:value="selectedGrade"
        :options="gradeOptions"
        :placeholder="gradePlaceholder"
        :loading="loading"
        :disabled="disabled"
        :size="size"
        clearable
        filterable
        @update:value="handleGradeChange"
      >
        <template #empty>
          <div class="text-center py-4 text-text-secondary">
            <Icon name="ph:graduation-cap" class="text-2xl mb-2" />
            <p class="text-sm">No grading system configured</p>
          </div>
        </template>
      </n-select>

      <!-- Grade Conversion Display -->
      <div
        v-if="selectedGrade && gradeConversion"
        class="p-3 rounded-lg bg-background-secondary border border-border"
      >
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p class="text-text-muted">Score Range</p>
            <p class="font-medium text-text-primary">
              {{ gradeConversion.minimumScore }}-{{
                gradeConversion.maximumScore
              }}
            </p>
          </div>
          <div>
            <p class="text-text-muted">GPA Points</p>
            <p class="font-medium text-text-primary">
              {{ gradeConversion.gpaValue }}
            </p>
          </div>
          <div>
            <p class="text-text-muted">Status</p>
            <n-tag
              :type="getStatusTagType(gradeConversion.description)"
              size="small"
            >
              {{ getGradeStatus(gradeConversion.description) }}
            </n-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- Score Input Mode -->
    <div v-else class="space-y-3">
      <n-input-number
        v-model:value="scoreValue"
        :placeholder="scorePlaceholder"
        :min="0"
        :max="100"
        :precision="precision"
        :loading="loading"
        :disabled="disabled"
        :size="size"
        class="w-full"
        @update:value="handleScoreChange"
      >
        <template #suffix>
          <span class="text-text-muted">/ 100</span>
        </template>
      </n-input-number>

      <!-- Score Conversion Display -->
      <div
        v-if="scoreValue !== null && scoreConversion"
        class="p-3 rounded-lg bg-background-secondary border border-border"
      >
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p class="text-text-muted">Grade</p>
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

    <!-- Validation Error Display -->
    <div v-if="errorMessage" class="mt-2 text-red-500 text-sm">
      {{ errorMessage }}
    </div>

    <!-- Help Text -->
    <div v-if="helpText" class="mt-2 text-text-muted text-xs">
      {{ helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import {
  NSelect,
  NInputNumber,
  NRadioGroup,
  NRadio,
  NButton,
  NTag,
  useNotification,
} from 'naive-ui';
import { useTeacherStore } from '@/stores/teacher';
import { useDebounceFn } from '@vueuse/core';
import type {
  GradeScaleDto,
  InstitutionGradingSystemDto,
} from '@/stores/teacher';

interface Props {
  modelValue?: {
    grade?: string;
    value?: number;
  } | null;
  institutionId: string;
  gradingSystem?: InstitutionGradingSystemDto | null;
  label?: string;
  gradePlaceholder?: string;
  scorePlaceholder?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  precision?: number;
  showLabel?: boolean;
  showSwapButton?: boolean;
  defaultMode?: 'grade' | 'score';
  helpText?: string;
  errorMessage?: string;
}

interface Emits {
  (
    e: 'update:modelValue',
    value: { grade?: string; value?: number } | null
  ): void;
  (
    e: 'change',
    value: {
      grade?: string;
      value?: number;
      gpaPoints?: number;
      status?: string;
    }
  ): void;
  (e: 'validation-error', error: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Grade/Score',
  gradePlaceholder: 'Select grade',
  scorePlaceholder: 'Enter score (0-100)',
  required: false,
  disabled: false,
  loading: false,
  size: 'medium',
  precision: 1,
  showLabel: true,
  showSwapButton: true,
  defaultMode: 'grade',
});

const emit = defineEmits<Emits>();

const teacherStore = useTeacherStore();
const notification = useNotification();

// Helper functions for status handling
const getGradeStatus = (description?: string): string => {
  if (!description) return 'pass';
  const desc = description.toLowerCase();
  if (desc.includes('fail')) return 'fail';
  if (desc.includes('conditional') || desc.includes('repeat'))
    return 'conditional';
  return 'pass';
};

const getStatusTagType = (
  description?: string
): 'success' | 'error' | 'warning' => {
  const status = getGradeStatus(description);
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

// Helper function to sort grades
const sortGradeScales = (scales: GradeScaleDto[]): GradeScaleDto[] => {
  return [...scales].sort((a, b) => {
    const gradeA = parseFloat(a.grade);
    const gradeB = parseFloat(b.grade);
    return gradeB - gradeA; // Descending order (6.00 -> 2.00)
  });
};

// Local state
const inputMode = ref<'grade' | 'score'>(props.defaultMode);
const selectedGrade = ref<string | null>(null);
const scoreValue = ref<number | null>(null);
const gradeConversion = ref<GradeScaleDto | null>(null);
const scoreConversion = ref<{
  grade: string;
  gpaPoints: number;
  status: string;
} | null>(null);
const conversionLoading = ref(false);
const isInitialized = ref(false);

// Queries - Only fetch if gradingSystem prop is not provided
const gradingSystemQuery = computed(() => {
  if (props.gradingSystem || !props.institutionId) return null;
  return teacherStore.institutionGradingSystemQuery(ref(props.institutionId));
});

// Computed properties
const gradingSystem = computed(() => {
  return props.gradingSystem || gradingSystemQuery.value?.data?.value || null;
});

const gradeOptions = computed(() => {
  if (!gradingSystem.value?.gradeScales) return [];

  const sortedScales = sortGradeScales(gradingSystem.value.gradeScales);

  return sortedScales.map((scale) => ({
    label: `${scale.grade} (${scale.minimumScore}-${scale.maximumScore}) - ${scale.gpaValue} GPA`,
    value: scale.grade,
    scale,
  }));
});

const loading = computed(
  () =>
    props.loading ||
    conversionLoading.value ||
    (!props.gradingSystem && gradingSystemQuery.value?.isLoading.value) ||
    false
);

// Debounced conversion functions
const debouncedGradeToScore = useDebounceFn(async (grade: string) => {
  if (!props.institutionId || !grade) return;

  try {
    conversionLoading.value = true;
    const conversion = await teacherStore.convertGradeToScore(
      grade,
      props.institutionId
    );

    // Update score value based on grade conversion
    scoreValue.value = (conversion.minScore + conversion.maxScore) / 2; // Use midpoint of range

    // Find the grade scale for additional info
    const scale = gradingSystem.value?.gradeScales.find(
      (s) => s.grade === grade
    );
    if (scale) {
      gradeConversion.value = scale;
    }

    // Emit changes after conversion
    emitChange();
  } catch (error: any) {
    console.error('Error converting grade to score:', error);
    emit('validation-error', error.message || 'Failed to convert grade');
  } finally {
    conversionLoading.value = false;
  }
}, 300);

const debouncedScoreToGrade = useDebounceFn(async (score: number) => {
  if (!props.institutionId || score === null || score === undefined) return;

  try {
    conversionLoading.value = true;
    const conversion = await teacherStore.convertScoreToGrade(
      score,
      props.institutionId
    );

    scoreConversion.value = conversion;
    selectedGrade.value = conversion.grade;

    // Emit changes after conversion
    emitChange();
  } catch (error: any) {
    console.error('Error converting score to grade:', error);
    emit('validation-error', error.message || 'Failed to convert score');
  } finally {
    conversionLoading.value = false;
  }
}, 500);


const handleGradeChange = (grade: string | null) => {
  selectedGrade.value = grade;

  if (grade) {
    // Find the grade scale
    const option = gradeOptions.value.find((opt) => opt.value === grade);
    if (option?.scale) {
      gradeConversion.value = option.scale;
      // Set score to midpoint of range
      scoreValue.value =
        (option.scale.minimumScore + option.scale.maximumScore) / 2;
    }

    // Only do conversion if we have an institution ID and this isn't an initial load
    if (props.institutionId && isInitialized.value) {
      debouncedGradeToScore(grade);
    } else {
      // Emit immediately for initial loads
      emitChange();
    }
  } else {
    gradeConversion.value = null;
    scoreValue.value = null;
    emitChange();
  }
};

const handleScoreChange = (score: number | null) => {
  scoreValue.value = score;

  if (score !== null && score >= 0 && score <= 100) {
    // Only do conversion if we have an institution ID and this isn't an initial load
    if (props.institutionId && isInitialized.value) {
      debouncedScoreToGrade(score);
    } else {
      // Emit immediately for initial loads
      emitChange();
    }
  } else {
    scoreConversion.value = null;
    selectedGrade.value = null;
    emitChange();
  }
};

const swapInputMode = () => {
  inputMode.value = inputMode.value === 'grade' ? 'score' : 'grade';
};


const emitChange = () => {
  const value = {
    grade: selectedGrade.value || undefined,
    value: scoreValue.value || undefined,
  };

  const changeData = {
    ...value,
    gpaPoints:
      gradeConversion.value?.gpaValue || scoreConversion.value?.gpaPoints,
    status: gradeConversion.value
      ? getGradeStatus(gradeConversion.value.description)
      : scoreConversion.value?.status,
  };

  // Only emit if there's actually a value
  const hasValue =
    value.grade || (value.value !== undefined && value.value !== null);

  emit('update:modelValue', hasValue ? value : null);
  emit('change', changeData);
};

const initializeFromModel = () => {
  if (!props.modelValue) {
    // Clear everything if modelValue is null
    selectedGrade.value = null;
    scoreValue.value = null;
    gradeConversion.value = null;
    scoreConversion.value = null;
    return;
  }

  // Set isInitialized to false during initialization to prevent unwanted API calls
  isInitialized.value = false;

  if (props.modelValue.grade) {
    selectedGrade.value = props.modelValue.grade;
    inputMode.value = 'grade';

    // Find the corresponding grade scale
    const option = gradeOptions.value.find(
      (opt) => opt.value === props.modelValue.grade
    );
    if (option?.scale) {
      gradeConversion.value = option.scale;
      scoreValue.value =
        (option.scale.minimumScore + option.scale.maximumScore) / 2;
    }
  } else if (
    props.modelValue.value !== undefined &&
    props.modelValue.value !== null
  ) {
    scoreValue.value = props.modelValue.value;
    inputMode.value = 'score';
  }

  // Set initialized flag after a tick to allow for proper DOM updates
  nextTick(() => {
    isInitialized.value = true;
  });
};

// Clear all values
const clearValues = () => {
  selectedGrade.value = null;
  scoreValue.value = null;
  gradeConversion.value = null;
  scoreConversion.value = null;
};

// Watchers
watch(() => props.modelValue, initializeFromModel, {
  deep: true,
  immediate: true,
});

watch(
  () => props.institutionId,
  async (newInstitutionId) => {
    // Only refetch if we're using the query (gradingSystem prop not provided)
    if (newInstitutionId && !props.gradingSystem) {
      await gradingSystemQuery.value?.refetch();
    }
  }
);

// Watch for grading system changes to initialize grade options
watch(
  gradingSystem,
  (newGradingSystem) => {
    if (newGradingSystem && props.modelValue) {
      // Re-initialize when grading system becomes available
      initializeFromModel();
    }
  },
  { immediate: true }
);

// Initialize on mount
onMounted(() => {
  // Initialize from model value if provided
  initializeFromModel();

  // Set initialized flag after mount
  nextTick(() => {
    isInitialized.value = true;
  });
});

// Expose methods for parent components if needed
defineExpose({
  clearValues,
  initializeFromModel,
});
</script>

<style scoped>
.grade-input {
  width: 100%;
}
</style>
