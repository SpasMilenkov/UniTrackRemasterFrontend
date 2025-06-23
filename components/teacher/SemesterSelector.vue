<template>
  <div class="semester-selector">
    <div v-if="showLabel" class="flex items-center gap-2 mb-2">
      <Icon name="ph:calendar" class="text-lg text-primary" />
      <span class="text-sm font-medium text-text-primary">{{
        label || t('semesterSelector.defaultLabel')
      }}</span>
      <span v-if="required" class="text-red-500">*</span>
    </div>

    <div class="space-y-3">
      <n-select
        v-model:value="selectedSemesterId"
        :options="semesterOptions"
        :placeholder="placeholder || t('semesterSelector.placeholder')"
        :loading="loading"
        :disabled="disabled || autoSelectCurrent"
        :size="size"
        clearable
        filterable
        @update:value="handleSemesterChange"
      >
        <template #empty>
          <div class="text-center py-4 text-text-secondary">
            <Icon name="ph:calendar" class="text-2xl mb-2" />
            <p class="text-sm">
              {{ t('semesterSelector.noSemestersAvailable') }}
            </p>
          </div>
        </template>

        <!-- Custom display for selected value when disabled -->
        <template v-if="autoSelectCurrent && selectedSemesterId" #trigger>
          <div class="flex items-center gap-2">
            <Icon name="ph:calendar-check" class="text-primary" />
            <span>{{ getSelectedSemesterLabel }}</span>
          </div>
        </template>
      </n-select>

      <!-- Current Semester Button -->
      <div v-if="showCurrentButton && !autoSelectCurrent" class="flex gap-2">
        <n-button
          size="small"
          type="primary"
          ghost
          :disabled="
            !currentSemester || selectedSemesterId === currentSemester.id
          "
          @click="selectCurrentSemester"
        >
          <template #icon>
            <Icon name="ph:calendar-check" />
          </template>
          {{ t('semesterSelector.useCurrentSemester') }}
        </n-button>
      </div>

      <!-- Semester Info Display -->
      <div
        v-if="showSemesterInfo && selectedSemesterData"
        class="p-3 rounded-lg bg-background-secondary border border-border"
      >
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-text-muted">
              {{ t('semesterSelector.info.semester') }}
            </p>
            <p class="font-medium text-text-primary">
              {{ selectedSemesterData.name }}
            </p>
          </div>
          <div>
            <p class="text-text-muted">
              {{ t('semesterSelector.info.academicYear') }}
            </p>
            <p class="font-medium text-text-primary">
              {{ selectedSemesterData.academicYearName }}
            </p>
          </div>
          <div>
            <p class="text-text-muted">
              {{ t('semesterSelector.info.startDate') }}
            </p>
            <p class="font-medium text-text-primary">
              {{ formatDate(selectedSemesterData.startDate) }}
            </p>
          </div>
          <div>
            <p class="text-text-muted">
              {{ t('semesterSelector.info.endDate') }}
            </p>
            <p class="font-medium text-text-primary">
              {{ formatDate(selectedSemesterData.endDate) }}
            </p>
          </div>
        </div>
        <div v-if="selectedSemesterData.isCurrent" class="mt-2">
          <n-tag type="success" size="small">
            <Icon name="ph:check-circle" class="mr-1" />
            {{ t('semesterSelector.currentSemesterTag') }}
          </n-tag>
        </div>
      </div>

      <!-- Auto-select Info -->
      <div
        v-if="autoSelectCurrent && currentSemester"
        class="p-2 rounded-lg bg-primary/10 border border-primary/20"
      >
        <div class="flex items-center gap-2 text-sm text-primary">
          <Icon name="ph:info" />
          <span>{{
            t('semesterSelector.autoSelectInfo', {
              semesterName: currentSemester.name,
            })
          }}</span>
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
import { ref, computed, watch, onMounted } from 'vue';
import { NSelect, NButton, NTag } from 'naive-ui';
import { useTeacherStore } from '@/stores/teacher';
import type { SemesterResponseDto } from '@/stores/teacher';

const { t, locale } = useI18n();

interface Props {
  modelValue?: string | null;
  institutionId: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showCurrentButton?: boolean;
  showSemesterInfo?: boolean;
  autoSelectCurrent?: boolean;
  helpText?: string;
  errorMessage?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string | null): void;
  (e: 'change', semester: SemesterResponseDto | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  loading: false,
  size: 'medium',
  showLabel: true,
  showCurrentButton: true,
  showSemesterInfo: false,
  autoSelectCurrent: false,
});

const emit = defineEmits<Emits>();

const teacherStore = useTeacherStore();

const selectedSemesterId = ref<string | null>(props.modelValue || null);

// Queries
const semestersQuery = computed(() => {
  if (!props.institutionId) return null;
  return teacherStore.semestersQuery(ref(props.institutionId));
});

const currentSemesterQuery = computed(() => {
  if (!props.institutionId) return null;
  return teacherStore.currentSemesterQuery(ref(props.institutionId));
});

// Computed properties
const availableSemesters = computed(
  () => semestersQuery.value?.data?.value || []
);
const currentSemester = computed(
  () => currentSemesterQuery.value?.data?.value || null
);

const semesterOptions = computed(() => {
  console.log('available semesters', availableSemesters.value);
  console.log(
    'Semester options',
    availableSemesters.value.map((semester) => ({
      label: `${semester.name} (${semester.academicYearName})`,
      value: semester.id,
      semester,
    }))
  );
  return availableSemesters.value.map((semester) => ({
    label: `${semester.name} (${semester.academicYearName})`,
    value: semester.id,
    semester,
  }));
});

// Helper to get display label for selected semester
const getSelectedSemesterLabel = computed(() => {
  if (!selectedSemesterId.value) return null;
  const semester = availableSemesters.value.find(
    (s) => s.id === selectedSemesterId.value
  );
  return semester
    ? `${semester.name} (${semester.academicYearName})`
    : selectedSemesterId.value;
});

const selectedSemesterData = computed(() => {
  if (!selectedSemesterId.value) return null;
  return (
    availableSemesters.value.find((s) => s.id === selectedSemesterId.value) ||
    null
  );
});

const loading = computed(() => {
  return (
    props.loading ||
    semestersQuery.value?.isLoading?.value ||
    currentSemesterQuery.value?.isLoading?.value ||
    false
  );
});

// Methods
const handleSemesterChange = (semesterId: string | null) => {
  selectedSemesterId.value = semesterId;
  emit('update:modelValue', semesterId);

  const semesterData = semesterId
    ? availableSemesters.value.find((s) => s.id === semesterId) || null
    : null;

  emit('change', semesterData);
};

const selectCurrentSemester = () => {
  if (currentSemester.value) {
    handleSemesterChange(currentSemester.value.id);
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Use locale-aware formatting based on current i18n locale
  const localeString = locale.value === 'bg' ? 'bg-BG' : 'en-US';

  return date.toLocaleDateString(localeString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const autoSelectCurrentSemester = () => {
  if (
    props.autoSelectCurrent &&
    currentSemester.value &&
    !selectedSemesterId.value
  ) {
    handleSemesterChange(currentSemester.value.id);
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== selectedSemesterId.value) {
      selectedSemesterId.value = newValue || null;
    }
  },
  { immediate: true }
);

watch(
  currentSemester,
  (newCurrentSemester) => {
    if (
      newCurrentSemester &&
      props.autoSelectCurrent &&
      !selectedSemesterId.value
    ) {
      handleSemesterChange(newCurrentSemester.id);
    }
  },
  { immediate: true }
);

watch(
  () => props.institutionId,
  async (newInstitutionId, oldInstitutionId) => {
    if (newInstitutionId && newInstitutionId !== oldInstitutionId) {
      try {
        await Promise.all([
          semestersQuery.value?.refetch(),
          currentSemesterQuery.value?.refetch(),
        ]);
      } catch (error) {
        console.error('Error fetching semester data:', error);
      }
    }
  }
);

// Initialize on mount
onMounted(async () => {
  // If we have institutionId and no modelValue, try to auto-select current
  if (props.institutionId && !props.modelValue && props.autoSelectCurrent) {
    try {
      await Promise.all([
        semestersQuery.value?.refetch(),
        currentSemesterQuery.value?.refetch(),
      ]);
      autoSelectCurrentSemester();
    } catch (error) {
      console.error('Error initializing semester selector:', error);
    }
  }
});
</script>

<style scoped>
.semester-selector {
  width: 100%;
}
</style>
