<!-- components/academic/filters/FacultyFilters.vue -->
<template>
  <div class="space-y-4">
    <!-- Search Input -->
    <n-input-group>
      <n-input
        :value="search"
        placeholder="Search by faculty name, code, or website..."
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Faculty Status
            </label>
            <n-select
              :value="filters.status"
              placeholder="Filter by Status"
              clearable
              :options="statusOptions"
              @update:value="updateFilter('status', $event)"
            />
          </div>

          <!-- Has Departments Filter -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Department Status
            </label>
            <n-select
              :value="filters.hasDepartments"
              placeholder="Filter by Department Status"
              clearable
              :options="departmentStatusOptions"
              @update:value="updateFilter('hasDepartments', $event)"
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
        <strong>Search tips:</strong> Use keywords like faculty name (e.g.,
        "Engineering"), faculty code (e.g., "ENG"), or website URL (e.g.,
        "engineering.university.edu").
        {{ activeTab === 'active' ? 'Showing only active faculties.' : '' }}
        {{
          activeTab === 'review' ? 'Showing only faculties under review.' : ''
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
import { FacultyStatus } from '~/enums/faculty-status.enum';

// Props
interface Props {
  search: string;
  filters: {
    status: string | null;
    hasDepartments?: boolean | null;
  };
  loading?: boolean;
  activeTab?: string;
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

// Status options
const statusOptions = computed(() => [
  { label: 'Active', value: FacultyStatus.Active },
  { label: 'Inactive', value: FacultyStatus.Inactive },
  { label: 'Under Review', value: FacultyStatus.UnderReview },
]);

// Department status options
const departmentStatusOptions = computed(() => [
  { label: 'Has Departments', value: true },
  { label: 'No Departments', value: false },
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
    status: null,
    hasDepartments: null,
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
