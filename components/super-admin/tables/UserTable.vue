<template>
  <div class="users-tab-container">
    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div class="flex flex-wrap gap-3">
          <!-- Search Input Group -->
          <n-input-group class="search-group">
            <n-input
              v-model:value="filters.searchTerm"
              placeholder="Search by name or email..."
              @keyup.enter="handleSearch"
              class="themed-input search-input"
              size="medium"
            >
              <template #prefix>
                <Icon name="ph:magnifying-glass" class="text-text-secondary" />
              </template>
            </n-input>
            <n-button
              @click="handleSearch"
              class="search-button"
              type="primary"
              size="medium"
            >
              <Icon name="ph:magnifying-glass" />
            </n-button>
          </n-input-group>

          <!-- Role Filter -->
          <n-select
            v-model:value="filters.role"
            placeholder="Filter by role"
            :options="roleOptions"
            clearable
            size="medium"
            class="role-filter themed-select"
            @update:value="handleRoleFilter"
          />

          <!-- Clear All Filters Button -->
          <n-button
            :disabled="!hasActiveFilters"
            secondary
            @click="clearAllFilters"
            class="clear-filters-button"
            size="medium"
          >
            <div class="flex items-center gap-2">
              <Icon name="ph:eraser" />
              <span>Clear Filters</span>
            </div>
          </n-button>
        </div>

        <div class="flex gap-3 items-center">
          <!-- Sort Controls -->
          <n-select
            v-model:value="filters.sortBy"
            placeholder="Sort by"
            :options="sortOptions"
            @update:value="handleSearch"
            size="medium"
            class="sort-select themed-select"
          />

          <n-button
            quaternary
            circle
            :class="{ 'rotate-180': !filters.ascending }"
            @click="toggleSortDirection"
            class="sort-direction-button"
            size="medium"
          >
            <Icon name="ph:sort-ascending" />
          </n-button>

          <n-button
            type="primary"
            @click="refreshData"
            class="refresh-button"
            size="medium"
          >
            <Icon name="ph:arrows-clockwise" />
          </n-button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <n-spin size="large" class="themed-spinner" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="flex items-center gap-3">
        <Icon name="ph:warning-circle" class="text-red-400" />
        <p class="text-red-400">{{ error }}</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="content-section">
      <!-- Custom Pagination Above Table -->
      <div class="pagination-header">
        <div
          v-if="paginationMeta && paginationMeta.totalCount > 0"
          class="flex items-center gap-3"
        >
          <span class="pagination-info">
            Total: {{ paginationMeta.totalCount }}
          </span>
          <n-pagination
            v-model:page="filters.pageNumber"
            v-model:page-size="filters.pageSize"
            :item-count="paginationMeta.totalCount"
            :show-size-picker="true"
            :page-sizes="[10, 20, 50]"
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
            class="themed-pagination"
          />
        </div>
      </div>

      <!-- User Table -->
      <div class="table-container">
        <n-data-table
          :columns="columns"
          :data="userData"
          :loading="isLoading"
          :row-key="(row: UserData) => row.id"
          class="themed-table"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, watch, onUnmounted } from 'vue';
import {
  NButton,
  NDataTable,
  NInput,
  NInputGroup,
  NSelect,
  NSpin,
  NTag,
  NAvatar,
  NPagination,
  useMessage,
  type DataTableColumns,
} from 'naive-ui';
import type { UserPaginationParams } from '~/stores/user';
import { useUserStore } from '~/stores/user';

// Define user data interface
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  allRoles?: UserRole[];
  institutionName?: string;
  profileImageUrl?: string;
}

// Define role type
type UserRole =
  | 'admin'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'guest'
  | 'superadmin';

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});

const userStore = useUserStore();
const message = useMessage();

// Local state for filters - will be used for API requests
const filters = reactive({
  searchTerm: '',
  sortBy: 'lastName',
  ascending: true,
  pageNumber: 1,
  pageSize: 10,
  role: null as string | null,
});

// Computed properties
const userData = computed(() => userStore.getPaginatedUsers?.users || []);
const isLoading = computed(() => userStore.isPaginatedUsersLoading);
const error = computed(() => userStore.error);
const paginationMeta = computed(() => userStore.getPaginationMetadata);

// Computed property to check if any filters are active
const hasActiveFilters = computed(() => {
  return (
    filters.searchTerm !== '' ||
    filters.role !== null ||
    filters.sortBy !== 'lastName' ||
    !filters.ascending
  );
});

// Role options for dropdown
const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Teacher', value: 'teacher' },
  { label: 'Student', value: 'student' },
  { label: 'Parent', value: 'parent' },
];

// Sort options
const sortOptions = [
  { label: 'First Name', value: 'firstName' },
  { label: 'Last Name', value: 'lastName' },
  { label: 'Email', value: 'email' },
];

// Role color mapping with proper typing
const roleColorMap: Record<
  UserRole,
  'default' | 'error' | 'primary' | 'info' | 'success' | 'warning'
> = {
  admin: 'primary',
  teacher: 'warning',
  student: 'success',
  guest: 'default',
  superadmin: 'error',
  parent: 'info',
} as const;

// Table columns with proper typing
const columns: DataTableColumns<UserData> = [
  {
    title: 'User',
    key: 'user',
    render(row: UserData) {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(NAvatar, {
          src: row.profileImageUrl || '',
          fallbackSrc: '/images/default-avatar.png',
          round: true,
          size: 'small',
        }),
        h('div', [
          h(
            'div',
            { class: 'font-medium text-text-primary' },
            `${row.firstName} ${row.lastName}`
          ),
          h('div', { class: 'text-xs text-text-secondary' }, row.email),
        ]),
      ]);
    },
  },
  {
    title: 'Role',
    key: 'role',
    render(row: UserData) {
      // Check if user has multiple roles and display badges for each
      if (row.allRoles && row.allRoles.length > 1) {
        return h('div', { class: 'flex flex-wrap gap-1' }, [
          // Primary role with larger badge
          h(
            NTag,
            {
              type: roleColorMap[row.role] || 'default',
              size: 'small',
              round: true,
            },
            {
              default: () =>
                row.role.charAt(0).toUpperCase() + row.role.slice(1),
            }
          ),
          // Additional roles with smaller badges
          ...row.allRoles
            .filter((r: UserRole) => r !== row.role) // Skip primary role as it's already displayed
            .map((role: UserRole) =>
              h(
                NTag,
                {
                  type: roleColorMap[role] || 'default',
                  size: 'tiny',
                  round: true,
                  class: 'opacity-70',
                },
                {
                  default: () => role.charAt(0).toUpperCase() + role.slice(1),
                }
              )
            ),
        ]);
      } else {
        // Single role display
        return h(
          NTag,
          {
            type: roleColorMap[row.role] || 'default',
            size: 'small',
            round: true,
          },
          {
            default: () => row.role.charAt(0).toUpperCase() + row.role.slice(1),
          }
        );
      }
    },
  },
  {
    title: 'Institution',
    key: 'institution',
    render(row: UserData) {
      return h(
        'span',
        { class: 'text-text-primary' },
        row.institutionName || 'N/A'
      );
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    render(row: UserData) {
      return h('div', { class: 'flex gap-2' }, [
        h(
          NButton,
          {
            size: 'small',
            quaternary: true,
            onClick: () => handleViewUser(row.id),
            class: 'action-button',
          },
          { default: () => 'View' }
        ),
        h(
          NButton,
          {
            size: 'small',
            quaternary: true,
            onClick: () => handleEditUser(row.id),
            class: 'action-button',
          },
          { default: () => 'Edit' }
        ),
      ]);
    },
  },
];

// Methods
function toggleSortDirection() {
  filters.ascending = !filters.ascending;
  handleSearch();
}

function handleSearch() {
  // Reset to first page on new search
  filters.pageNumber = 1;
  loadUsers();
}

function handleRoleFilter(role: string | null) {
  filters.role = role;
  filters.pageNumber = 1;
  loadUsers();
}

function handlePageChange(page: number) {
  filters.pageNumber = page;
  loadUsers();
}

function handlePageSizeChange(pageSize: number) {
  filters.pageSize = pageSize;
  // Reset to page 1 when changing page size
  filters.pageNumber = 1;
  loadUsers();
}

function clearAllFilters() {
  filters.searchTerm = '';
  filters.role = null;
  filters.sortBy = 'lastName';
  filters.ascending = true;
  handleSearch();
}

function handleViewUser(id: string) {
  // Implement view user details logic
  message.info(`Viewing user with ID: ${id}`);
}

function handleEditUser(id: string) {
  // Implement edit user logic
  message.info(`Editing user with ID: ${id}`);
}

// Main function to load users, always keeping filters intact
async function loadUsers() {
  try {
    // Create params object with all current filters
    const params: UserPaginationParams = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      searchTerm: filters.searchTerm,
      sortBy: filters.sortBy,
      ascending: filters.ascending,
    };

    // Only add role if it's not null
    if (filters.role !== null) {
      params.role = filters.role;
    }

    // Debug log
    console.log('Fetching users with params:', JSON.stringify(params, null, 2));

    // Make API call with all filters
    await userStore.fetchPaginatedUsers(params);
  } catch (err: any) {
    message.error(`Failed to load users: ${err.message}`);
  }
}

function refreshData() {
  message.info('Refreshing user data...');
  // Use current filters when refreshing
  loadUsers();
}

// Initial data loading
onMounted(() => {
  loadUsers();

  // Listen for refresh events from parent component
  window.addEventListener('refresh-user-table', refreshData);
});

// Clean up event listener when component is unmounted
onUnmounted(() => {
  window.removeEventListener('refresh-user-table', refreshData);
});

// Watch for active prop changes (when tab becomes active)
watch(
  () => props.active,
  (isActive) => {
    if (isActive) {
      loadUsers();
    }
  }
);

// Watch for store data changes to update local pagination state
watch(
  () => userStore.paginatedUsers,
  (newValue) => {
    if (newValue) {
      // Update filters object from server response
      filters.pageNumber = newValue.pageNumber;
      filters.pageSize = newValue.pageSize;
      // Don't update other filters as they may have been changed by the user
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.users-tab-container {
  min-height: 400px;
  background: var(--color-background, #101014);
  color: var(--color-text-primary, #f5f5f5);
}

/* Filters Section */
.filters-section {
  background: var(--color-background-card, #18181c);
  border: 1px solid var(--color-border, #374151);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.search-group {
  min-width: 300px;
}

.search-input {
  background: var(--color-background-secondary, #262629) !important;
  border-color: var(--color-border, #374151) !important;
  color: var(--color-text-primary, #f5f5f5) !important;
}

.search-input input {
  background: transparent !important;
  color: var(--color-text-primary, #f5f5f5) !important;
}

.search-input input::placeholder {
  color: var(--color-text-secondary, #9ca3af) !important;
}

.search-button {
  background: linear-gradient(135deg, var(--color-primary, #4ade80), var(--color-secondary, #3b82f6)) !important;
  border: none !important;
  color: white !important;
}

.search-button:hover {
  background: linear-gradient(135deg, var(--color-primary-dark, #22c55e), var(--color-secondary-dark, #2563eb)) !important;
}

.role-filter {
  min-width: 160px;
}

.sort-select {
  min-width: 140px;
}

.themed-select {
  background: var(--color-background-secondary, #262629) !important;
  border-color: var(--color-border, #374151) !important;
  color: var(--color-text-primary, #f5f5f5) !important;
}

.clear-filters-button {
  background: var(--color-background-secondary, #262629) !important;
  border: 1px solid var(--color-border, #374151) !important;
  color: var(--color-text-secondary, #9ca3af) !important;
  transition: all 0.2s ease;
}

.clear-filters-button:hover:not(:disabled) {
  border-color: var(--color-border-hover, rgba(74, 222, 128, 0.5)) !important;
  color: var(--color-text-primary, #f5f5f5) !important;
}

.clear-filters-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sort-direction-button {
  background: var(--color-background-secondary, #262629) !important;
  border: 1px solid var(--color-border, #374151) !important;
  color: var(--color-text-secondary, #9ca3af) !important;
  transition: all 0.2s ease;
}

.sort-direction-button:hover {
  border-color: var(--color-border-hover, rgba(74, 222, 128, 0.5)) !important;
  color: var(--color-primary, #4ade80) !important;
}

.refresh-button {
  background: linear-gradient(135deg, var(--color-primary, #4ade80), var(--color-secondary, #3b82f6)) !important;
  border: none !important;
  color: white !important;
}

.refresh-button:hover {
  background: linear-gradient(135deg, var(--color-primary-dark, #22c55e), var(--color-secondary-dark, #2563eb)) !important;
}

/* Loading and Error States */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: var(--color-background-card, #18181c);
  border: 1px solid var(--color-border, #374151);
  border-radius: 12px;
}

.themed-spinner {
  color: var(--color-primary, #4ade80) !important;
}

.error-container {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

/* Content Section */
.content-section {
  background: var(--color-background-card, #18181c);
  border: 1px solid var(--color-border, #374151);
  border-radius: 12px;
  overflow: hidden;
}

.pagination-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border, #374151);
  display: flex;
}

.pagination-info {
  color: var(--color-text-secondary, #9ca3af);
  font-size: 14px;
}

.themed-pagination {
  --n-item-color: var(--color-background-secondary, #262629);
  --n-item-color-hover: var(--color-primary, #4ade80);
  --n-item-color-pressed: var(--color-primary-dark, #22c55e);
  --n-item-text-color: var(--color-text-primary, #f5f5f5);
  --n-item-text-color-hover: white;
  --n-item-text-color-pressed: white;
  --n-item-border: 1px solid var(--color-border, #374151);
  --n-item-border-hover: 1px solid var(--color-primary, #4ade80);
  --n-item-border-pressed: 1px solid var(--color-primary-dark, #22c55e);
}

.table-container {
  background: var(--color-background-card, #18181c);
}

.themed-table {
  --n-th-color: var(--color-background-secondary, #262629);
  --n-td-color: var(--color-background-card, #18181c);
  --n-th-text-color: var(--color-text-primary, #f5f5f5);
  --n-td-text-color: var(--color-text-primary, #f5f5f5);
  --n-border-color: var(--color-border, #374151);
  --n-th-font-weight: 600;
}

.action-button {
  color: var(--color-text-secondary, #9ca3af) !important;
  transition: all 0.2s ease;
}

.action-button:hover {
  color: var(--color-primary, #4ade80) !important;
  background: rgba(var(--color-primary-rgb, 74, 222, 128), 0.1) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-group {
    min-width: auto;
    width: 100%;
  }

  .role-filter,
  .sort-select {
    min-width: auto;
    flex: 1;
  }

  .pagination-header {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
}

/* Animation Classes */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

/* Focus States */
.themed-input:focus-within,
.themed-select:focus-within {
  border-color: var(--color-primary, #4ade80) !important;
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 74, 222, 128), 0.2) !important;
}
</style>
