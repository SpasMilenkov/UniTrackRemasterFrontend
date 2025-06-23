<template>
  <div class="flex flex-wrap gap-4 items-center">
    <!-- Academic Year Selector -->
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium text-text-secondary whitespace-nowrap">
        Academic Year:
      </label>
      <n-select
        v-model:value="selectedAcademicYear"
        :options="academicYearOptions"
        placeholder="Select Academic Year"
        :style="{ width: compact ? '160px' : '200px' }"
        :size="compact ? 'small' : 'medium'"
        @update:value="onAcademicYearChange"
      />
    </div>

    <!-- Semester Type Selector -->
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium text-text-secondary whitespace-nowrap">
        Semester:
      </label>
      <n-select
        v-model:value="selectedSemesterType"
        :options="semesterTypeOptions"
        placeholder="Select Semester"
        :style="{ width: compact ? '120px' : '150px' }"
        :size="compact ? 'small' : 'medium'"
        @update:value="onSemesterTypeChange"
      />
    </div>

    <div
      v-if="availableSpecificSemesters.length > 1"
      class="flex items-center gap-2"
    >
      <label class="text-sm font-medium text-text-secondary whitespace-nowrap">
        Specific:
      </label>
      <n-select
        v-model:value="selectedSemesterId"
        :options="specificSemesterOptions"
        placeholder="Select Specific Semester"
        :style="{ width: compact ? '140px' : '180px' }"
        :size="compact ? 'small' : 'medium'"
        @update:value="onSpecificSemesterChange"
      />
    </div>

    <!-- Current Semester Indicator -->
    <div
      v-if="showCurrentIndicator && isCurrentSemester"
      class="flex items-center gap-1"
    >
      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span class="text-xs text-green-600 font-medium">Current</span>
    </div>

    <!-- Quick Actions -->
    <div v-if="showQuickActions" class="flex gap-1">
      <n-button
        v-if="canGoToCurrent"
        quaternary
        size="small"
        @click="goToCurrentSemester"
      >
        <template #icon>
          <Icon name="ph:calendar-check" />
        </template>
        Current
      </n-button>

      <n-button quaternary size="small" :loading="loading" @click="refreshData">
        <template #icon>
          <Icon name="ph:arrows-clockwise" />
        </template>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick, onMounted } from 'vue';
import { useAcademicYearStore } from '~/stores/academic-year';
import { useStudentStore } from '~/stores/student';
import type { SemesterType } from '~/interfaces/student/analytics/semester-type';
import type { SemesterSummaryDto } from '~/interfaces/student/analytics/semester-summary.dto';

interface Props {
  modelValue?: {
    academicYear?: string | null;
    term?: SemesterType | null;
    semesterId?: string | null;
  };
  availableSemesters?: SemesterSummaryDto[];
  compact?: boolean;
  showCurrentIndicator?: boolean;
  showQuickActions?: boolean;
  loading?: boolean;
}

interface Emits {
  (
    e: 'update:modelValue' | 'change',
    value: {
      academicYear?: string | null;
      term?: SemesterType | null;
      semesterId?: string | null;
    }
  ): void;
  (e: 'refresh'): void;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showCurrentIndicator: true,
  showQuickActions: true,
  loading: false,
  availableSemesters: () => [],
});

const emit = defineEmits<Emits>();

// Stores
const academicYearStore = useAcademicYearStore();
const studentStore = useStudentStore();

// Local state
const selectedAcademicYear = ref<string | null>(null);
const selectedSemesterType = ref<SemesterType | null>(null);
const selectedSemesterId = ref<string | null>(null);
const isInitialized = ref(false);

// Ensure we have a proper default for availableSemesters
const safeAvailableSemesters = computed(() => {
  return Array.isArray(props.availableSemesters)
    ? props.availableSemesters
    : [];
});

// Academic year options - ensure we always have a valid array
const academicYearOptions = computed(() => {
  const options = [{ label: 'Current Academic Year', value: null }];

  // Add academic years from store if available
  if (academicYearStore.academicYears?.length) {
    options.push(
      ...academicYearStore.academicYears.map((year) => ({
        label: year.name || year.year || 'Unnamed Academic Year',
        value: year.id,
      }))
    );
  }

  // Add academic years from available semesters if not already included
  const uniqueYears = new Set();
  safeAvailableSemesters.value.forEach((semester) => {
    if (semester.academicYear && !uniqueYears.has(semester.academicYear)) {
      uniqueYears.add(semester.academicYear);
      // Only add if not already in options
      const existsInOptions = options.some(
        (opt) => opt.value === semester.academicYear
      );
      if (!existsInOptions) {
        options.push({
          label: semester.academicYear,
          value: semester.academicYear,
        });
      }
    }
  });

  return options;
});

// Semester type options
const semesterTypeOptions = computed(() =>
  studentStore.VALID_SEMESTER_TYPES.map((type) => ({
    label: type,
    value: type,
  }))
);

// Available semesters filtered by current selections
const availableSpecificSemesters = computed(() => {
  if (!safeAvailableSemesters.value.length) return [];

  let filtered = [...safeAvailableSemesters.value];

  // Filter by academic year if selected
  if (selectedAcademicYear.value) {
    filtered = filtered.filter(
      (s) => s.academicYear === selectedAcademicYear.value
    );
  }

  // Filter by semester type if selected
  if (selectedSemesterType.value) {
    filtered = filtered.filter(
      (s) => s.semesterType === selectedSemesterType.value
    );
  }

  return filtered;
});

// Specific semester options (for when there are multiple semesters of same type)
const specificSemesterOptions = computed(() =>
  availableSpecificSemesters.value.map((semester) => ({
    label: `${semester.semesterName} (${semester.credits || 0} credits)`,
    value: semester.semesterId,
  }))
);

// Current semester detection
const currentSemester = computed(() => studentStore.currentSemester);

const isCurrentSemester = computed(() => {
  if (!currentSemester.value || !selectedSemesterId.value) return false;
  return currentSemester.value.semesterId === selectedSemesterId.value;
});

const canGoToCurrent = computed(() => {
  return currentSemester.value && !isCurrentSemester.value;
});

// Current model value
const currentValue = computed(() => ({
  academicYear: selectedAcademicYear.value,
  term: selectedSemesterType.value,
  semesterId: selectedSemesterId.value,
}));

// Initialize with current semester or first available
const initializeSelector = async () => {
  if (isInitialized.value) return;

  await nextTick();

  console.log('Initializing semester selector...');
  console.log('Available semesters:', safeAvailableSemesters.value);
  console.log('Model value:', props.modelValue);
  console.log('Current semester:', currentSemester.value);

  // Priority 1: Use modelValue if provided and valid
  if (props.modelValue?.semesterId && props.modelValue.term) {
    console.log('Using modelValue');
    selectedAcademicYear.value = props.modelValue.academicYear || null;
    selectedSemesterType.value = props.modelValue.term;
    selectedSemesterId.value = props.modelValue.semesterId;
    isInitialized.value = true;
    return;
  }

  // Priority 2: Use current semester if available
  if (currentSemester.value) {
    console.log('Using current semester');
    selectedAcademicYear.value = currentSemester.value.academicYear;
    selectedSemesterType.value = currentSemester.value
      .semesterType as SemesterType;
    selectedSemesterId.value = currentSemester.value.semesterId;
    isInitialized.value = true;
    emitChange();
    return;
  }

  // Priority 3: Use first available semester
  if (safeAvailableSemesters.value.length > 0) {
    console.log('Using first available semester');
    const firstSemester = safeAvailableSemesters.value[0];
    selectedAcademicYear.value = firstSemester.academicYear;
    selectedSemesterType.value = firstSemester.semesterType as SemesterType;
    selectedSemesterId.value = firstSemester.semesterId;
    isInitialized.value = true;
    emitChange();
    return;
  }

  // Priority 4: Set defaults if nothing available
  console.log('No semesters available, setting defaults');
  selectedAcademicYear.value = null; // Current academic year
  selectedSemesterType.value = 'Fall'; // Default to Fall
  selectedSemesterId.value = null;
  isInitialized.value = true;
  emitChange();
};

// Event handlers
const onAcademicYearChange = (value: string | null) => {
  console.log('Academic year changed:', value);
  selectedAcademicYear.value = value;

  // Reset semester selections when academic year changes
  selectedSemesterType.value = null;
  selectedSemesterId.value = null;

  // Auto-select if only one semester type available for this year
  const availableTypes = [
    ...new Set(
      safeAvailableSemesters.value
        ?.filter((s) => !value || s.academicYear === value)
        .map((s) => s.semesterType) || []
    ),
  ];

  if (availableTypes.length === 1) {
    selectedSemesterType.value = availableTypes[0] as SemesterType;
    onSemesterTypeChange(selectedSemesterType.value);
    return;
  }

  emitChange();
};

const onSemesterTypeChange = (value: SemesterType | null) => {
  console.log('Semester type changed:', value);
  selectedSemesterType.value = value;

  // Reset specific semester when type changes
  selectedSemesterId.value = null;

  // Auto-select if only one semester of this type exists
  if (value && availableSpecificSemesters.value.length === 1) {
    selectedSemesterId.value = availableSpecificSemesters.value[0].semesterId;
  } else if (value && availableSpecificSemesters.value.length > 0) {
    // Select the first one by default
    selectedSemesterId.value = availableSpecificSemesters.value[0].semesterId;
  }

  emitChange();
};

const onSpecificSemesterChange = (value: string | null) => {
  console.log('Specific semester changed:', value);
  selectedSemesterId.value = value;

  // Auto-fill academic year and semester type if not set
  if (value && safeAvailableSemesters.value.length > 0) {
    const selectedSemester = safeAvailableSemesters.value.find(
      (s) => s.semesterId === value
    );
    if (selectedSemester) {
      if (!selectedAcademicYear.value) {
        selectedAcademicYear.value = selectedSemester.academicYear;
      }
      if (!selectedSemesterType.value) {
        selectedSemesterType.value =
          selectedSemester.semesterType as SemesterType;
      }
    }
  }

  emitChange();
};

const goToCurrentSemester = () => {
  if (!currentSemester.value) return;

  console.log('Going to current semester:', currentSemester.value);
  selectedAcademicYear.value = currentSemester.value.academicYear;
  selectedSemesterType.value = currentSemester.value
    .semesterType as SemesterType;
  selectedSemesterId.value = currentSemester.value.semesterId;
  emitChange();
};

const refreshData = () => {
  emit('refresh');
};

const emitChange = () => {
  if (!isInitialized.value) return;

  const value = currentValue.value;
  console.log('Emitting change:', value);

  emit('update:modelValue', value);
  emit('change', value);
};

// Watch for external prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue || !isInitialized.value) return;

    const currentVal = currentValue.value;
    const hasChanged =
      newValue.academicYear !== currentVal.academicYear ||
      newValue.term !== currentVal.term ||
      newValue.semesterId !== currentVal.semesterId;

    if (hasChanged) {
      console.log('External modelValue changed:', newValue);
      selectedAcademicYear.value = newValue.academicYear || null;
      selectedSemesterType.value = newValue.term || null;
      selectedSemesterId.value = newValue.semesterId || null;
    }
  },
  { deep: true }
);

// Watch available semesters to re-initialize if needed
watch(
  () => safeAvailableSemesters.value,
  (newSemesters, oldSemesters) => {
    console.log('Available semesters changed:', newSemesters);

    // Only re-initialize if we had no semesters before and now we have some
    if (
      (!oldSemesters || oldSemesters.length === 0) &&
      newSemesters.length > 0
    ) {
      if (!selectedSemesterId.value) {
        console.log('Re-initializing due to new semesters');
        isInitialized.value = false;
        initializeSelector();
      }
    }
  },
  { immediate: false, deep: true }
);

// Watch current semester changes
watch(
  currentSemester,
  (newCurrent) => {
    console.log('Current semester changed:', newCurrent);

    // Only auto-select current semester if we haven't initialized yet
    if (!isInitialized.value && newCurrent) {
      initializeSelector();
    }
  },
  { immediate: false }
);

// Initialize when component mounts
onMounted(() => {
  console.log('SemesterSelector mounted');
  nextTick(() => {
    initializeSelector();
  });
});
</script>

<style scoped>
@media (max-width: 768px) {
  .flex {
    gap: 0.5rem;
  }

  .flex-wrap > div {
    flex-shrink: 0;
  }
}
</style>
