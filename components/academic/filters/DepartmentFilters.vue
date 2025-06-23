<!-- components/academic/filters/DepartmentFilters.vue -->
<template>
  <div class="space-y-4">
    <!-- Search Input -->
    <n-input-group>
      <n-input
        :value="search"
        placeholder="Search by department name, code, or location..."
        clearable
        @update:value="handleSearchUpdate"
        @keyup.enter="$emit('search')"
      >
        <template #prefix>
          <Icon name="ph:magnifying-glass" />
        </template>
      </n-input>
      <n-button
        :loading="loading"
        type="primary"
        ghost
        @click="$emit('search')"
      >
        Search
      </n-button>
      <n-button
        v-if="search || hasActiveFilters"
        type="default"
        ghost
        @click="handleClear"
      >
        <template #icon>
          <Icon name="ph:x" />
        </template>
        Clear
      </n-button>
    </n-input-group>

    <!-- Advanced Filters -->
    <n-collapse>
      <n-collapse-item title="Advanced Filters" name="filters">
        <template #header-extra>
          <n-badge
            v-if="activeFilterCount > 0"
            :value="activeFilterCount"
            type="info"
            :max="99"
          />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Faculty Filter -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Faculty
            </label>
            <n-select
              :value="filters.facultyId"
              placeholder="Filter by Faculty"
              clearable
              :options="facultyOptions"
              @update:value="updateFilter('facultyId', $event)"
            />
          </div>

          <!-- Department Type Filter -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Department Type
            </label>
            <n-select
              :value="filters.type"
              placeholder="Filter by Type"
              clearable
              :options="typeOptions"
              @update:value="updateFilter('type', $event)"
            />
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Status
            </label>
            <n-select
              :value="filters.status"
              placeholder="Filter by Status"
              clearable
              :options="statusOptions"
              @update:value="updateFilter('status', $event)"
            />
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="flex justify-between items-center mt-6">
          <div class="text-text-secondary text-sm">
            {{
              activeFilterCount > 0
                ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied`
                : 'No filters applied'
            }}
          </div>
          <div class="flex gap-2">
            <n-button
              v-if="hasActiveFilters"
              size="small"
              @click="clearFilters"
            >
              Clear Filters
            </n-button>
            <n-button type="primary" size="small" @click="$emit('search')">
              Apply Filters
            </n-button>
          </div>
        </div>
      </n-collapse-item>
    </n-collapse>

    <!-- Search Tips -->
    <div class="text-text-secondary text-xs">
      <p>
        <strong>Search tips:</strong> Use keywords like department name (e.g.,
        "Computer Science"), department code (e.g., "CS"), or location (e.g.,
        "Building A").
        {{
          activeTab === 'academic' ? 'Showing only academic departments.' : ''
        }}
        {{
          activeTab === 'administrative'
            ? 'Showing only administrative departments.'
            : ''
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  NInput,
  NInputGroup,
  NButton,
  NSelect,
  NCollapse,
  NCollapseItem,
  NBadge,
} from 'naive-ui';
import { Icon } from '#components';
import { DepartmentType } from '~/enums/department-type.enum';
import { DepartmentStatus } from '~/enums/department-status.enum';
import type { Faculty } from '~/stores/faculty';

// Props
interface Props {
  search: string;
  filters: {
    facultyId: string | null;
    type: string | null;
    status: string | null;
  };
  loading?: boolean;
  activeTab?: string;
  faculties: Faculty[];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  activeTab: 'all',
});

// Emits
interface Emits {
  (e: 'update:search', value: string): void;
  (e: 'update:filters', value: typeof props.filters): void;
  (e: 'search'): void;
  (e: 'clear'): void;
}

const emit = defineEmits<Emits>();

// Faculty options for dropdown
const facultyOptions = computed(() => {
  return props.faculties.map((faculty) => ({
    label: `${faculty.name}${faculty.code ? ` (${faculty.code})` : ''}`,
    value: faculty.id,
  }));
});

// Department type options
const typeOptions = computed(() => [
  { label: 'Academic', value: DepartmentType.Academic },
  { label: 'Administrative', value: DepartmentType.Administrative },
  { label: 'Research', value: DepartmentType.Research },
  { label: 'Support', value: DepartmentType.Support },
]);

// Status options
const statusOptions = computed(() => [
  { label: 'Active', value: DepartmentStatus.Active },
  { label: 'Inactive', value: DepartmentStatus.Inactive },
  { label: 'Under Review', value: DepartmentStatus.UnderReview },
  { label: 'Restructuring', value: DepartmentStatus.Restructuring },
]);

// Computed properties for filter states
const hasActiveFilters = computed(() => {
  return Object.values(props.filters).some((value) => value !== null);
});

const activeFilterCount = computed(() => {
  return Object.values(props.filters).filter((value) => value !== null).length;
});

// Event handlers
function handleSearchUpdate(value: string) {
  emit('update:search', value);
}

function updateFilter(key: keyof typeof props.filters, value: any) {
  const newFilters = { ...props.filters, [key]: value };
  emit('update:filters', newFilters);
}

function clearFilters() {
  const clearedFilters = {
    facultyId: null,
    type: null,
    status: null,
  };
  emit('update:filters', clearedFilters);
}

function handleClear() {
  emit('update:search', '');
  clearFilters();
  emit('clear');
}
</script>

<style scoped>
:deep(.n-collapse .n-collapse-item .n-collapse-item__header) {
  padding: 12px 0;
}

:deep(
  .n-collapse
    .n-collapse-item
    .n-collapse-item__content-wrapper
    .n-collapse-item__content-inner
) {
  padding-top: 0;
}
</style>
