<template>
  <div class="py-6 px-4">
    <!-- Academic Year Header with actions -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-xl font-semibold m-0">Academic Years Management</h2>
      <n-button
        type="primary"
        :disabled="!canCreateAcademicYear"
        @click="handleAddAcademicYearClick"
      >
        <template #icon>
          <Icon name="carbon:add" />
        </template>
        Add Academic Year
      </n-button>
    </div>

    <!-- Academic Year prerequisites alert -->
    <n-alert v-if="!canCreateAcademicYear" type="warning" class="mb-6">
      <template #icon>
        <Icon name="carbon:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">Before creating academic years:</div>
        <div class="flex items-center gap-2">
          <Icon name="carbon:checkmark-outline" class="text-red-500" />
          <span>
            You need to select an active institution.
            <n-button text type="info" @click="navigateToInstitutions">
              Select Institution
            </n-button>
          </span>
        </div>
      </div>
    </n-alert>

    <!-- Current Academic Year highlight -->
    <div v-if="academicYearStore.currentAcademicYear" class="mb-6">
      <n-card title="Current Academic Year" class="border-l-4 border-l-primary">
        <div
          class="flex flex-col md:flex-row gap-4 items-start md:items-center"
        >
          <div class="flex-grow">
            <h3 class="text-lg font-semibold m-0">
              {{ academicYearStore.currentAcademicYear.name }}
            </h3>
            <p class="text-text-secondary">
              {{ formatDate(academicYearStore.currentAcademicYear.startDate) }}
              -
              {{ formatDate(academicYearStore.currentAcademicYear.endDate) }}
            </p>
          </div>
          <div class="flex gap-2">
            <n-tag type="success" size="medium">Active</n-tag>
            <n-button
              size="small"
              @click="
                handleEditAcademicYear(academicYearStore.currentAcademicYear)
              "
            >
              <template #icon>
                <Icon name="carbon:edit" />
              </template>
              Edit
            </n-button>
          </div>
        </div>
      </n-card>
    </div>

    <!-- Search -->
    <div v-if="canCreateAcademicYear" class="mb-6">
      <n-input-group>
        <n-input
          v-model:value="searchQuery"
          placeholder="Search by academic year name..."
          clearable
          @update:value="handleSearchUpdate"
        >
          <template #prefix>
            <Icon name="carbon:search" />
          </template>
        </n-input>
        <n-button
          :loading="academicYearStore.searchLoading"
          type="primary"
          ghost
          @click="handleAcademicYearSearch"
        >
          Search
        </n-button>
        <n-button
          v-if="searchQuery"
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
    </div>

    <!-- View Toggle -->
    <div v-if="canCreateAcademicYear" class="flex justify-center mb-6">
      <n-button-group>
        <n-button
          :type="!showCalendarView ? 'primary' : 'default'"
          @click="showCalendarView = false"
        >
          <template #icon>
            <Icon name="carbon:table" />
          </template>
          Table View
        </n-button>
        <n-button
          :type="showCalendarView ? 'primary' : 'default'"
          @click="showCalendarView = true"
        >
          <template #icon>
            <Icon name="carbon:calendar" />
          </template>
          Calendar View
        </n-button>
      </n-button-group>
    </div>

    <!-- Academic Years List View -->
    <div v-if="canCreateAcademicYear && !showCalendarView" class="mb-6">
      <n-data-table
        ref="academicYearTable"
        :columns="academicYearColumns"
        :data="academicYearStore.academicYears"
        :loading="
          academicYearStore.loadingAcademicYears ||
          academicYearStore.searchLoading
        "
        :pagination="paginationConfig"
        :row-key="(row) => row.id"
        class="bg-background-card rounded-lg shadow p-4"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>

    <!-- Academic Years Calendar View -->
    <div
      v-if="canCreateAcademicYear && showCalendarView"
      class="mb-6 bg-background-card rounded-lg shadow p-4"
    >
      <div class="space-y-4">
        <div
          v-for="year in academicYearStore.academicYears"
          :key="year.id"
          class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          :class="
            isCurrentAcademicYear(year) ? 'border-primary' : 'border-border'
          "
        >
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-semibold">{{ year.name }}</h3>
                <n-tag
                  v-if="isCurrentAcademicYear(year)"
                  type="success"
                  size="small"
                  >Active</n-tag
                >
              </div>
              <div class="text-text-secondary text-sm mt-1">
                {{ formatDateRange(year.startDate, year.endDate) }}
              </div>
            </div>
            <div class="flex gap-2 mt-2 md:mt-0">
              <n-button size="small" @click="handleEditAcademicYear(year)">
                <template #icon>
                  <Icon name="carbon:edit" />
                </template>
                Edit
              </n-button>
              <n-button
                size="small"
                type="error"
                ghost
                :disabled="isCurrentAcademicYear(year)"
                @click="handleDeleteItem(year)"
              >
                <template #icon>
                  <Icon name="carbon:trash-can" />
                </template>
                Delete
              </n-button>
            </div>
          </div>

          <!-- Timeline visualization -->
          <div
            class="mt-4 relative h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
          >
            <div
              class="absolute top-0 h-full bg-primary bg-opacity-20 rounded-lg"
              :style="getTimelineStyle(year)"
            >
              <div
                v-if="isCurrentAcademicYear(year)"
                class="absolute top-0 h-full w-1 bg-primary"
                :style="getCurrentDateIndicatorStyle(year)"
              />
            </div>
            <div
              class="flex justify-between text-xs px-2 pt-1 text-text-secondary"
            >
              <span>{{ formatDate(year.startDate, 'short') }}</span>
              <span>{{ formatDate(year.endDate, 'short') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination for calendar view -->
      <div
        v-if="academicYearStore.academicYearsPagedResult"
        class="mt-6 flex justify-center"
      >
        <n-pagination
          v-model:page="currentPage"
          :page-count="academicYearStore.academicYearsPagedResult.totalPages"
          :page-size="currentPageSize"
          :item-count="academicYearStore.academicYearsPagedResult.totalCount"
          show-size-picker
          :page-sizes="[10, 20, 50]"
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
        />
      </div>
    </div>

    <!-- Search results info -->
    <div
      v-if="
        searchQuery &&
        !academicYearStore.searchLoading &&
        academicYearStore.academicYears.length === 0
      "
      class="text-center py-4 text-text-secondary"
    >
      No academic years found matching "{{ searchQuery }}". Try a different
      search term.
    </div>

    <!-- Loading state for academic years -->
    <div
      v-if="academicYearStore.loadingAcademicYears"
      class="flex justify-center items-center py-16"
    >
      <n-spin size="large" />
    </div>

    <!-- Academic Year Modal -->
    <n-modal
      v-model:show="showAcademicYearModal"
      preset="card"
      style="width: 37.5rem"
      :title="
        editingAcademicYear ? 'Edit Academic Year' : 'Create New Academic Year'
      "
    >
      <AcademicYearForm
        :loading="submittingAcademicYear"
        :initial-values="academicYearForm"
        :is-editing="!!editingAcademicYear"
        @submit="handleSubmitAcademicYear"
        @cancel="showAcademicYearModal = false"
      />
    </n-modal>

    <!-- Delete Confirmation Dialog -->
    <n-modal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      title="Confirm Deletion"
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="confirmDelete"
      @negative-click="cancelDelete"
    >
      <template #icon>
        <n-icon color="warning">
          <Icon name="carbon:warning-filled" />
        </n-icon>
      </template>
      <div class="py-2">
        Are you sure you want to delete the academic year "{{
          itemToDelete?.name
        }}"?
        <n-alert type="warning" class="mt-4">
          This action cannot be undone. All grades, courses, and related data
          may also be affected.
        </n-alert>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, watch } from 'vue';
import {
  NButton,
  NButtonGroup,
  NDataTable,
  NModal,
  NSpace,
  NIcon,
  NAlert,
  NSpin,
  NInput,
  NInputGroup,
  NCard,
  NTag,
  NPagination,
  useMessage,
} from 'naive-ui';
import { Icon } from '#components';
import { useAcademicStore } from '~/stores/academic';
import {
  useAcademicYearStore,
  type AcademicYear,
} from '~/stores/academic-year';
import { useInstitutionStore } from '~/stores/institution';
import AcademicYearForm from './forms/AcademicYearForm.vue';
import { debounce } from 'lodash';
import type { AcademicYearFormSchema } from '~/schemas/academic-year.schema';
import { format } from 'date-fns';

// Router for navigation
const router = useRouter();

// Stores and utilities
const academicStore = useAcademicStore();
const academicYearStore = useAcademicYearStore();
const institutionStore = useInstitutionStore();
const message = useMessage();

// Local state for search and views
const searchQuery = ref('');
const showCalendarView = ref(true);

// Pagination state
const currentPage = ref(1);
const currentPageSize = ref(10);

// State for modals and forms
const showAcademicYearModal = ref(false);
const submittingAcademicYear = ref(false);
const editingAcademicYear = ref<AcademicYear | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<AcademicYear | null>(null);

// Computed property to determine if academic years can be created
const canCreateAcademicYear = computed(() => {
  return !!institutionStore.activeInstitution?.id;
});

// Academic year form initial values
const academicYearForm = ref({
  name: '',
  startDate: '',
  endDate: '',
  institutionId: institutionStore.activeInstitution?.id || '',
});

// Create a debounced search function
const debouncedSearch = debounce(async () => {
  if (searchQuery.value.length > 2 || searchQuery.value === '') {
    academicYearStore.searchAcademicYears(searchQuery.value);
  }
}, 500);

// Watch for changes to searchQuery
watch(searchQuery, () => {
  debouncedSearch();
});

// Pagination configuration for data table
const paginationConfig = computed(() => {
  const pagedResult = academicYearStore.academicYearsPagedResult;
  if (!pagedResult) {
    return {
      page: currentPage.value,
      pageSize: currentPageSize.value,
      showSizePicker: true,
      pageSizes: [10, 20, 50],
    };
  }

  return {
    page: pagedResult.currentPage,
    pageSize: pagedResult.pageSize,
    pageCount: pagedResult.totalPages,
    itemCount: pagedResult.totalCount,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
    showQuickJumper: true,
  };
});

// Date formatting functions
function formatDate(dateString: string, type: 'short' | 'full' = 'full') {
  const date = new Date(dateString);
  return type === 'short'
    ? format(date, 'MMM d, yyyy')
    : format(date, 'MMMM d, yyyy');
}

function formatDateRange(startDate: string, endDate: string) {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

// Check if a year is the current academic year
function isCurrentAcademicYear(year: AcademicYear) {
  const current = academicYearStore.currentAcademicYear;
  return current ? current.id === year.id : false;
}

// Timeline visualization helpers
function getTimelineStyle(year: AcademicYear) {
  const startDate = new Date(year.startDate).getTime();
  const endDate = new Date(year.endDate).getTime();
  const duration = endDate - startDate;

  // Calculate width
  const width = '100%';

  return {
    width,
    left: '0%',
  };
}

function getCurrentDateIndicatorStyle(year: AcademicYear) {
  if (!isCurrentAcademicYear(year)) return { left: '0%' };

  const now = new Date().getTime();
  const startDate = new Date(year.startDate).getTime();
  const endDate = new Date(year.endDate).getTime();
  const duration = endDate - startDate;

  // Calculate position
  const position = Math.min(
    100,
    Math.max(0, ((now - startDate) / duration) * 100)
  );

  return {
    left: `${position}%`,
  };
}

// Table columns
const academicYearColumns = [
  {
    title: 'Name',
    key: 'name',
    sorter: 'default',
  },
  {
    title: 'Start Date',
    key: 'startDate',
    render(row: AcademicYear) {
      return formatDate(row.startDate);
    },
  },
  {
    title: 'End Date',
    key: 'endDate',
    render(row: AcademicYear) {
      return formatDate(row.endDate);
    },
  },
  {
    title: 'Status',
    key: 'status',
    render(row: AcademicYear) {
      const current = isCurrentAcademicYear(row);
      const now = new Date();
      const start = new Date(row.startDate);
      const end = new Date(row.endDate);

      let status = '';
      let type: 'success' | 'warning' | 'info' | 'error' = 'info';

      if (current) {
        status = 'Active';
        type = 'success';
      } else if (now < start) {
        status = 'Upcoming';
        type = 'info';
      } else if (now > end) {
        status = 'Past';
        type = 'warning';
      }

      return h(NTag, { type, size: 'small' }, { default: () => status });
    },
  },
  {
    title: 'Created At',
    key: 'createdAt',
    render(row: AcademicYear) {
      return formatDate(row.createdAt);
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    render(row: AcademicYear) {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                quaternary: true,
                circle: true,
                type: 'info',
                onClick: () => handleEditAcademicYear(row),
              },
              { icon: () => h(Icon, { name: 'carbon:edit' }) }
            ),
            h(
              NButton,
              {
                quaternary: true,
                circle: true,
                type: 'error',
                onClick: () => handleDeleteItem(row),
                disabled: isCurrentAcademicYear(row),
              },
              { icon: () => h(Icon, { name: 'carbon:trash-can' }) }
            ),
          ],
        }
      );
    },
  },
];

// Functions to handle navigation to prerequisite components
function navigateToInstitutions() {
  router.push('/institutions');
}

// Event handlers for search
function handleSearchUpdate(value: string) {
  searchQuery.value = value;
}

function handleAcademicYearSearch() {
  academicYearStore.searchAcademicYears(searchQuery.value);
}

function handleClearSearch() {
  searchQuery.value = '';
  academicYearStore.clearSearch();

  if (institutionStore.activeInstitution?.id) {
    academicYearStore.fetchAcademicYearsByInstitution(
      institutionStore.activeInstitution.id,
      currentPage.value,
      currentPageSize.value
    );
  }
}

// Pagination event handlers
function handlePageChange(page: number) {
  currentPage.value = page;

  if (institutionStore.activeInstitution?.id) {
    academicYearStore.fetchAcademicYearsByInstitution(
      institutionStore.activeInstitution.id,
      page,
      currentPageSize.value
    );
  }
}

function handlePageSizeChange(pageSize: number) {
  currentPageSize.value = pageSize;
  currentPage.value = 1; // Reset to first page when changing page size

  if (institutionStore.activeInstitution?.id) {
    academicYearStore.fetchAcademicYearsByInstitution(
      institutionStore.activeInstitution.id,
      1,
      pageSize
    );
  }
}

function handleAddAcademicYearClick() {
  if (canCreateAcademicYear.value) {
    // Default to active institution
    academicYearForm.value = {
      name: '',
      startDate: '',
      endDate: '',
      institutionId: institutionStore.activeInstitution?.id || '',
    };
    editingAcademicYear.value = null;
    showAcademicYearModal.value = true;
  } else {
    message.warning(
      'You need an active institution before creating academic years.'
    );
  }
}

function handleEditAcademicYear(academicYear: AcademicYear) {
  editingAcademicYear.value = academicYear;
  academicYearForm.value = {
    name: academicYear.name || '',
    startDate: academicYear.startDate,
    endDate: academicYear.endDate,
    institutionId: academicYear.institutionId,
  };
  showAcademicYearModal.value = true;
}

function handleDeleteItem(academicYear: AcademicYear) {
  if (isCurrentAcademicYear(academicYear)) {
    message.warning('You cannot delete the current active academic year.');
    return;
  }

  itemToDelete.value = academicYear;
  showDeleteConfirm.value = true;
}

function cancelDelete() {
  itemToDelete.value = null;
  showDeleteConfirm.value = false;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    await academicYearStore.deleteAcademicYear(
      itemToDelete.value.institutionId,
      itemToDelete.value.id
    );
    message.success('Academic year deleted successfully');
  } catch (error: any) {
    message.error('Error deleting academic year: ' + error.message);
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
}

async function handleSubmitAcademicYear(validatedData: AcademicYearFormSchema) {
  try {
    submittingAcademicYear.value = true;

    if (editingAcademicYear.value) {
      await academicYearStore.updateAcademicYear(
        validatedData.institutionId,
        editingAcademicYear.value.id,
        validatedData
      );
      message.success('Academic year updated successfully');
    } else {
      await academicYearStore.createAcademicYear(validatedData);
      message.success('Academic year created successfully');
    }

    showAcademicYearModal.value = false;

    // Refresh the data after successful operation
    if (institutionStore.activeInstitution?.id) {
      await academicYearStore.fetchAcademicYearsByInstitution(
        institutionStore.activeInstitution.id,
        currentPage.value,
        currentPageSize.value
      );
    }
  } catch (error: any) {
    message.error(
      `Failed to ${editingAcademicYear.value ? 'update' : 'create'} academic year: ${error.message}`
    );
  } finally {
    submittingAcademicYear.value = false;
  }
}
</script>
