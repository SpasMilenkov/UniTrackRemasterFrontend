<!-- components/academic/filters/SubjectFilters.vue -->
<template>
  <div class="mb-6">
    <n-input-group>
      <n-input
        v-model:value="localSearch"
        placeholder="Search by subject name, code, or description..."
        clearable
        @update:value="handleSearchUpdate"
      >
        <template #prefix>
          <Icon name="carbon:search" />
        </template>
      </n-input>
      <n-button :loading="loading" type="primary" ghost @click="emit('search')">
        Search
      </n-button>
      <n-button
        v-if="localSearch"
        type="default"
        ghost
        @click="handleClearSearch"
      >
        <template #icon>
          <Icon name="carbon:close" />
        </template>
        Clear
      </n-button>
    </n-input-group>

    <!-- Search tips -->
    <div class="text-text-secondary text-xs mt-2 mb-4">
      <p>
        Search by: subject name, subject code, or description. Example:
        "mathematics", "MATH-101", "algebra"
      </p>
    </div>

    <!-- Advanced filters -->
    <div class="mt-4">
      <n-collapse>
        <n-collapse-item title="Advanced Filters" name="1">
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2"
          >
            <!-- Department Filter -->
            <n-form-item label="Department" label-placement="left">
              <n-select
                v-model:value="localFilters.departmentId"
                :options="departmentOptions"
                placeholder="Filter by department"
                clearable
                @update:value="handleFilterChange"
              />
            </n-form-item>

            <!-- Academic Level Filter -->
            <n-form-item label="Academic Level" label-placement="left">
              <n-select
                v-model:value="localFilters.academicLevel"
                :options="academicLevelOptions"
                placeholder="Filter by level"
                clearable
                @update:value="handleFilterChange"
              />
            </n-form-item>

            <!-- Elective Type Filter (only visible in Electives tab) -->
            <n-form-item
              v-if="showElectiveTypeFilter"
              label="Elective Type"
              label-placement="left"
            >
              <n-select
                v-model:value="localFilters.electiveType"
                :options="electiveTypeOptions"
                placeholder="Filter by type"
                clearable
                @update:value="handleFilterChange"
              />
            </n-form-item>

            <!-- Has Lab Filter -->
            <n-form-item label="Lab Component" label-placement="left">
              <n-select
                v-model:value="labFilterValue"
                :options="labOptions"
                placeholder="Has lab component"
                clearable
                @update:value="handleLabFilterChange"
              />
            </n-form-item>
          </div>

          <div class="flex justify-end mt-4">
            <n-button size="small" @click="clearAllFilters">
              Clear All Filters
            </n-button>
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useDepartmentStore } from '~/stores/department';
import { AcademicLevel } from '~/enums/academic-level.enum';
import { ElectiveType } from '~/enums/elective-type.enum';
import { debounce } from 'lodash';

interface SubjectFilters {
  departmentId: string | null;
  academicLevel: AcademicLevel | null;
  electiveType: ElectiveType | null;
  hasLab: boolean | null;
}

const props = defineProps<{
  search: string;
  filters: SubjectFilters;
  loading?: boolean;
  showElectiveTypeFilter?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:search', value: string): void;
  (e: 'update:filters', value: SubjectFilters): void;
  (e: 'search'): void;
  (e: 'clear'): void;
}>();

// Local state that will be synced with parent
const localSearch = ref(props.search || '');
const localFilters = ref<SubjectFilters>({
  departmentId: props.filters?.departmentId || null,
  academicLevel: props.filters?.academicLevel || null,
  electiveType: props.filters?.electiveType || null,
  hasLab: props.filters?.hasLab || null,
});

// Lab filter value - convert between boolean and string for n-select
const labFilterValue = computed({
  get() {
    if (localFilters.value.hasLab === true) return 'true';
    if (localFilters.value.hasLab === false) return 'false';
    return null;
  },
  set(value: string | null) {
    if (value === 'true') {
      localFilters.value.hasLab = true;
    } else if (value === 'false') {
      localFilters.value.hasLab = false;
    } else {
      localFilters.value.hasLab = null;
    }
  },
});

// Department options from store
const departmentStore = useDepartmentStore();
const departmentOptions = computed(() => {
  return departmentStore.departments.map((department) => ({
    label: department.name || 'Unnamed Department',
    value: department.id,
  }));
});

// Academic level options
const academicLevelOptions = [
  { label: 'Elementary', value: AcademicLevel.Elementary },
  { label: 'Middle School', value: AcademicLevel.MiddleSchool },
  { label: 'High School', value: AcademicLevel.HighSchool },
  { label: 'Undergraduate', value: AcademicLevel.Undergraduate },
  { label: 'Graduate', value: AcademicLevel.Graduate },
  { label: 'Doctoral', value: AcademicLevel.Doctoral },
  { label: 'Professional', value: AcademicLevel.Professional },
];

// Elective type options
const electiveTypeOptions = [
  { label: 'Academic', value: ElectiveType.Academic },
  { label: 'Arts', value: ElectiveType.Arts },
  { label: 'Sports', value: ElectiveType.Sports },
  { label: 'Technology', value: ElectiveType.Technology },
  { label: 'Language', value: ElectiveType.Language },
  { label: 'Professional', value: ElectiveType.Professional },
];

// Lab options - using string values instead of boolean for n-select compatibility
const labOptions = [
  { label: 'With Lab Component', value: 'true' },
  { label: 'Without Lab Component', value: 'false' },
];

// Watch for changes in props
watch(
  () => props.search,
  (newVal) => {
    localSearch.value = newVal;
  }
);

watch(
  () => props.filters,
  (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(localFilters.value)) {
      localFilters.value = { ...newVal };
    }
  },
  { deep: true }
);

// Create a debounced handler for search updates
const debouncedSearchEmit = debounce((value: string) => {
  emit('update:search', value);
  if (value.length > 2 || value === '') {
    emit('search');
  }
}, 300);

// Event handlers
function handleSearchUpdate(value: string) {
  localSearch.value = value;
  debouncedSearchEmit(value);
}

function handleFilterChange() {
  emit('update:filters', { ...localFilters.value });
  emit('search');
}

function handleLabFilterChange(value: string | null) {
  // The computed property will handle the conversion
  labFilterValue.value = value;
  handleFilterChange();
}

function handleClearSearch() {
  localSearch.value = '';
  emit('update:search', '');
  emit('clear');
}

function clearAllFilters() {
  localFilters.value = {
    departmentId: null,
    academicLevel: null,
    electiveType: null,
    hasLab: null,
  };
  emit('update:filters', { ...localFilters.value });
  emit('search');
}
</script>
