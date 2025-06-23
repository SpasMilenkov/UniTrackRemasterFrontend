<!-- components/academic/SemesterTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Header with Institution Context -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white"
        >
          <Icon name="carbon:calendar" class="text-xl" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-text-primary m-0">
            {{ termManagementTitle }}
          </h2>
          <p class="text-sm text-text-secondary mt-1">
            {{ termManagementDescription }}
          </p>
        </div>
      </div>
      <!-- Actions -->
      <div class="flex items-center gap-3">
        <n-tag
          :type="isHigherEducationComputed ? 'info' : 'success'"
          size="medium"
          class="flex-shrink-0"
        >
          <Icon
            :name="isHigherEducationComputed ? 'ph:university' : 'ph:student'"
            class="mr-1"
          />
          {{ institutionTypeLabel }}
        </n-tag>

        <n-button
          type="primary"
          :disabled="!canCreateSemester"
          size="large"
          @click="handleAddSemesterClick"
        >
          <template #icon>
            <Icon name="carbon:add" />
          </template>
          {{ createButtonText }}
        </n-button>
      </div>
    </div>

    <!-- Prerequisites Warning -->
    <n-alert v-if="!canCreateSemester" type="warning" class="mb-6">
      <template #icon>
        <Icon name="carbon:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">{{ prerequisiteWarningTitle }}:</div>
        <div v-if="!hasActiveInstitution" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>You need to have an active institution selected</span>
        </div>
        <div v-if="!hasAcademicYears" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>Create at least one academic year first</span>
        </div>
      </div>
    </n-alert>

    <!-- Academic Hierarchy -->
    <AcademicHierarchy
      v-if="showHierarchy"
      :hierarchy="hierarchyData"
      :title="hierarchyTitle"
      title-icon="carbon:calendar"
      :global-action="!canCreateSemester ? globalActionConfig : undefined"
      class="mb-8"
      @level-click="handleHierarchyLevelClick"
      @action-click="handleHierarchyActionClick"
      @global-action="navigateToPrerequisite"
    />

    <!-- Term Categories Tabs -->
    <n-tabs
      v-if="canCreateSemester"
      v-model:value="activeTab"
      type="line"
      animated
      size="large"
      class="mb-6"
      @update:value="handleTabChange"
    >
      <n-tab-pane name="all" :tab="allTermsTabText">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="carbon:calendar" />
            {{ allTermsTabText }}
            <n-badge
              v-if="totalSemestersCount > 0"
              :value="totalSemestersCount"
              type="info"
              :max="999"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane name="active" :tab="activeTermsTabText">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="carbon:checkmark-outline" />
            {{ activeTermsTabText }}
            <n-badge
              v-if="activeSemestersCount > 0"
              :value="activeSemestersCount"
              type="success"
              :max="999"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane name="upcoming" :tab="upcomingTermsTabText">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="carbon:time" />
            {{ upcomingTermsTabText }}
            <n-badge
              v-if="upcomingSemestersCount > 0"
              :value="upcomingSemestersCount"
              type="warning"
              :max="999"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane name="byYear" tab="By Academic Year">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="carbon:calendar-tools" />
            By Academic Year
            <n-badge
              v-if="academicYearStore.academicYears.length > 0"
              :value="academicYearStore.academicYears.length"
              type="warning"
              :max="99"
            />
          </div>
        </template>
      </n-tab-pane>
    </n-tabs>

    <!-- Search and Filters -->
    <div v-if="canCreateSemester" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Search Input -->
        <n-input-group>
          <n-input
            v-model:value="searchQuery"
            :placeholder="searchPlaceholder"
            clearable
            @update:value="handleSearchUpdate"
            @keydown.enter="handleSearch"
          >
            <template #prefix>
              <Icon name="carbon:search" />
            </template>
          </n-input>
          <n-button
            :loading="academicYearStore.loadingSemesters"
            type="primary"
            ghost
            @click="handleSearch"
          >
            Search
          </n-button>
        </n-input-group>

        <!-- Academic Year Filter -->
        <n-select
          v-model:value="academicYearFilter"
          placeholder="Filter by academic year"
          :options="academicYearOptions"
          clearable
          @update:value="handleFilterChange"
        >
          <template #prefix>
            <Icon name="carbon:calendar" />
          </template>
        </n-select>

        <!-- Status Filter -->
        <n-select
          v-model:value="statusFilter"
          placeholder="Filter by status"
          :options="statusOptions"
          clearable
          @update:value="handleFilterChange"
        >
          <template #prefix>
            <Icon name="carbon:status" />
          </template>
        </n-select>
      </div>

      <!-- Quick Actions Bar -->
      <div
        class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
      >
        <div class="flex items-center gap-4">
          <span class="text-sm text-text-secondary">
            {{ formatResultsText() }}
          </span>
          <n-button
            v-if="hasActiveFilters"
            size="small"
            @click="handleClearAllFilters"
          >
            <template #icon>
              <Icon name="carbon:reset" />
            </template>
            Clear Filters
          </n-button>
        </div>

        <div class="flex items-center gap-2">
          <n-button
            size="small"
            :disabled="!filteredSemesters.length"
            @click="handleExportSemesters"
          >
            <template #icon>
              <Icon name="carbon:download" />
            </template>
            Export
          </n-button>
        </div>
      </div>
    </div>

    <!-- Term Statistics -->
    <div
      v-if="canCreateSemester && totalSemestersCount > 0"
      class="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div class="text-blue-500 dark:text-blue-400 text-lg font-semibold">
          {{ totalSemestersCount }}
        </div>
        <div class="text-sm text-text-secondary">{{ totalStatsText }}</div>
      </div>

      <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <div class="text-green-500 dark:text-green-400 text-lg font-semibold">
          {{ activeSemestersCount }}
        </div>
        <div class="text-sm text-text-secondary">{{ activeStatsText }}</div>
      </div>

      <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
        <div class="text-amber-500 dark:text-amber-400 text-lg font-semibold">
          {{ upcomingSemestersCount }}
        </div>
        <div class="text-sm text-text-secondary">{{ upcomingStatsText }}</div>
      </div>

      <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
        <div class="text-purple-500 dark:text-purple-400 text-lg font-semibold">
          {{ completedSemestersCount }}
        </div>
        <div class="text-sm text-text-secondary">{{ completedStatsText }}</div>
      </div>
    </div>

    <!-- Terms Data Table -->
    <div
      v-if="canCreateSemester"
      class="bg-background-card rounded-xl shadow-sm border border-border overflow-hidden"
    >
      <n-data-table
        ref="semesterTable"
        :columns="semesterColumns"
        :data="filteredSemesters"
        :loading="academicYearStore.loadingSemesters || loadingData"
        :pagination="paginationConfig"
        :row-key="(row: Semester) => row.id"
        :scroll-x="1400"
        class="min-h-[400px]"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      >
        <template #empty>
          <div class="text-center py-12">
            <Icon
              name="carbon:calendar"
              class="text-6xl text-text-secondary mb-4 mx-auto"
            />
            <h3 class="text-lg font-medium text-text-primary mb-2">
              {{ emptyStateTitle }}
            </h3>
            <p class="text-text-secondary mb-4">
              {{ emptyStateDescription }}
            </p>
            <n-button
              v-if="!hasActiveFilters"
              type="primary"
              @click="handleAddSemesterClick"
            >
              <template #icon>
                <Icon name="carbon:add" />
              </template>
              {{ createButtonText }}
            </n-button>
          </div>
        </template>
      </n-data-table>
    </div>

    <!-- Term Form Modal -->
    <n-modal
      v-model:show="showSemesterModal"
      preset="card"
      style="width: 70rem; max-height: 90vh"
      :title="modalTitle"
      :closable="!submittingSemester"
      :mask-closable="!submittingSemester"
    >
      <div class="max-h-[75vh] overflow-y-auto overflow-x-hidden pr-2">
        <SemesterForm
          :loading="submittingSemester"
          :initial-values="semesterForm"
          :is-editing="!!editingSemester"
          @submit="handleSubmitSemester"
          @cancel="handleCancelSemester"
        />
      </div>
    </n-modal>

    <!-- Delete Confirmation Dialog -->
    <n-modal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      type="error"
      :title="deleteConfirmTitle"
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="confirmDelete"
      @negative-click="cancelDelete"
    >
      <template #icon>
        <Icon name="carbon:warning-filled" class="text-red-500" />
      </template>
      <div class="py-2">
        <p class="mb-4">
          {{ deleteConfirmMessage }}
          <strong>"{{ itemToDelete?.name }}"</strong>?
        </p>

        <n-alert type="error" class="mb-4" title="Permanent Action">
          {{ deleteWarningMessage }}
        </n-alert>
      </div>
    </n-modal>

    <!-- Term Detail Modal -->
    <n-modal
      v-model:show="showSemesterDetail"
      preset="card"
      style="width: 70rem"
      :title="detailModalTitle"
    >
      <div
        v-if="selectedSemesterDetail"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <!-- Basic Information -->
        <n-card title="Basic Information" class="col-span-full md:col-span-1">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-text-secondary">Academic Year:</span>
              <span class="font-medium">{{
                selectedSemesterDetail.academicYearName
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Type:</span>
              <n-tag
                :type="getTypeTagType(selectedSemesterDetail.type)"
                size="small"
              >
                {{ getTermDisplayNameLocal(selectedSemesterDetail.type) }}
              </n-tag>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Status:</span>
              <n-tag
                :type="getStatusTagType(selectedSemesterDetail.status)"
                size="small"
              >
                {{ selectedSemesterDetail.status }}
              </n-tag>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Duration:</span>
              <span class="font-medium"
                >{{ selectedSemesterDetail.weekCount }} weeks</span
              >
            </div>
          </div>
        </n-card>

        <!-- Important Dates -->
        <n-card
          :title="isHigherEducationComputed ? 'Important Dates' : 'Term Dates'"
          class="col-span-full md:col-span-1"
        >
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-text-secondary">{{ termText }} Period:</span>
              <span class="font-medium">
                {{ selectedSemesterDetail.startDate }} -
                {{ selectedSemesterDetail.endDate }}
              </span>
            </div>
            <div
              v-if="
                selectedSemesterDetail.registrationStartDate &&
                isHigherEducationComputed
              "
              class="flex justify-between"
            >
              <span class="text-text-secondary">Registration:</span>
              <span class="font-medium">
                {{ selectedSemesterDetail.registrationStartDate }} -
                {{ selectedSemesterDetail.registrationEndDate }}
              </span>
            </div>
            <div
              v-if="
                selectedSemesterDetail.addDropDeadline &&
                isHigherEducationComputed
              "
              class="flex justify-between"
            >
              <span class="text-text-secondary">Add/Drop:</span>
              <span class="font-medium">{{
                selectedSemesterDetail.addDropDeadline
              }}</span>
            </div>
            <div
              v-if="
                selectedSemesterDetail.finalExamStartDate &&
                isHigherEducationComputed
              "
              class="flex justify-between"
            >
              <span class="text-text-secondary">Final Exams:</span>
              <span class="font-medium">
                {{ selectedSemesterDetail.finalExamStartDate }} -
                {{ selectedSemesterDetail.finalExamEndDate }}
              </span>
            </div>
          </div>
        </n-card>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, watch } from 'vue';
import {
  NButton,
  NDataTable,
  NModal,
  NSpace,
  NAlert,
  NTabs,
  NTabPane,
  NTag,
  NBadge,
  NInput,
  NInputGroup,
  NSelect,
  NCard,
  useMessage,
  type DataTableColumns,
} from 'naive-ui';
import { Icon } from '#components';
import { useAcademicYearStore, type Semester } from '~/stores/academic-year';
import { useInstitutionStore } from '~/stores/institution';
import { isHigherEducation as checkIsHigherEducation } from '~/utils/institution-helper';
import { debounce } from 'lodash';
import {
  SemesterType as SemesterTypeEnum,
  SemesterStatus,
  getTermDisplayName,
  isK12Term,
} from '~/interfaces/academic/semester';
import SemesterForm from './forms/SemesterForm.vue';
import AcademicHierarchy, {
  type HierarchyLevel,
} from '~/components/common/AcademicHierarchy.vue';

// Stores and utilities
const academicYearStore = useAcademicYearStore();
const institutionStore = useInstitutionStore();
const message = useMessage();
const router = useRouter();

// Local loading state
const loadingData = ref(false);

// Institution type detection
const activeInstitution = computed(() => institutionStore.activeInstitution);
const isHigherEducationComputed = computed(() =>
  checkIsHigherEducation(activeInstitution.value?.type)
);
const institutionTypeLabel = computed(() =>
  isHigherEducationComputed.value ? 'Higher Education' : 'K-12 School'
);

// Dynamic terminology based on institution type
const termText = computed(() =>
  isHigherEducationComputed.value ? 'Semester' : 'Term'
);

const termManagementTitle = computed(() => `${termText.value} Management`);

const termManagementDescription = computed(() =>
  isHigherEducationComputed.value
    ? 'Manage academic semesters and important dates'
    : 'Manage academic terms (quarters/trimesters) and schedules'
);

const createButtonText = computed(() => `Create ${termText.value}`);

const prerequisiteWarningTitle = computed(
  () => `Before creating ${termText.value.toLowerCase()}s`
);

const hierarchyTitle = computed(
  () => `${termText.value} Management Prerequisites`
);

const allTermsTabText = computed(() => `All ${termText.value}s`);

const activeTermsTabText = computed(() => `Active ${termText.value}s`);

const upcomingTermsTabText = computed(() => `Upcoming ${termText.value}s`);

const searchPlaceholder = computed(
  () => `Search ${termText.value.toLowerCase()}s...`
);

const totalStatsText = computed(() => `Total ${termText.value}s`);

const activeStatsText = computed(() => `Active ${termText.value}s`);

const upcomingStatsText = computed(() => `Upcoming ${termText.value}s`);

const completedStatsText = computed(() => `Completed ${termText.value}s`);

const emptyStateTitle = computed(
  () => `No ${termText.value.toLowerCase()}s found`
);

const emptyStateDescription = computed(() => {
  if (hasActiveFilters.value) {
    return 'No results found for your search criteria';
  }
  return isHigherEducationComputed.value
    ? 'Get started by creating your first semester'
    : 'Get started by creating your first academic term';
});

const modalTitle = computed(() =>
  editingSemester.value
    ? `Edit ${termText.value}`
    : `Create New ${termText.value}`
);

const deleteConfirmTitle = computed(() => `Confirm ${termText.value} Deletion`);

const deleteConfirmMessage = computed(
  () => `Are you sure you want to delete the ${termText.value.toLowerCase()}`
);

const deleteWarningMessage = computed(() =>
  isHigherEducationComputed.value
    ? 'This action cannot be undone. All related semester data including course schedules, enrollments, and academic records will also be affected.'
    : 'This action cannot be undone. All related term data including schedules, grades, and academic records will also be affected.'
);

const detailModalTitle = computed(() =>
  selectedSemesterDetail.value
    ? `${selectedSemesterDetail.value.name} - ${termText.value} Details`
    : `${termText.value} Details`
);

// Tab state
const activeTab = ref('all');

// Search and filter state
const searchQuery = ref('');
const academicYearFilter = ref<string | null>(null);
const statusFilter = ref<SemesterStatus | null>(null);

// Pagination state
const currentPage = ref(1);
const pageSize = ref(20);

// State for modals and forms
const showSemesterModal = ref(false);
const submittingSemester = ref(false);
const editingSemester = ref<Semester | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<Semester | null>(null);
const showSemesterDetail = ref(false);
const selectedSemesterDetail = ref<Semester | null>(null);

// Semester form state
const semesterForm = ref<Record<string, any>>({});

// Hierarchy visibility control
const userDismissedHierarchy = ref(false);

// Computed properties for checking prerequisites
const hasActiveInstitution = computed(() => !!activeInstitution.value);
const hasAcademicYears = computed(
  () => academicYearStore.academicYears.length > 0
);

// Can create semester when we have an active institution and academic years
const canCreateSemester = computed(() => {
  return hasActiveInstitution.value && hasAcademicYears.value;
});

// Show hierarchy logic
const showHierarchy = computed(() => {
  return !canCreateSemester.value && !userDismissedHierarchy.value;
});

// Get total semesters count
const totalSemestersCount = computed(() => {
  return academicYearStore.allSemesters.length;
});

// Hierarchy data for the component
const hierarchyData = computed<HierarchyLevel[]>(() => [
  {
    id: 'institution',
    title: isHigherEducationComputed.value ? 'University' : 'School',
    description: 'Active educational institution',
    icon: isHigherEducationComputed.value ? 'ph:university' : 'ph:student',
    isCompleted: hasActiveInstitution.value,
    isActive: false,
    count: hasActiveInstitution.value ? 1 : 0,
    actionRequired: !hasActiveInstitution.value,
    navigateTo: '/institutions',
    actionText: 'Select Institution',
  },
  {
    id: 'academicYears',
    title: 'Academic Years',
    description: isHigherEducationComputed.value
      ? 'Academic year periods for semester organization'
      : 'Academic year periods for term organization',
    icon: 'carbon:calendar-tools',
    isCompleted: hasAcademicYears.value,
    isActive: hasActiveInstitution.value && !hasAcademicYears.value,
    count: academicYearStore.academicYears.length,
    actionRequired: hasActiveInstitution.value && !hasAcademicYears.value,
    navigateTo: '/academic/years',
    actionText: 'Create Academic Years',
  },
  {
    id: 'semesters',
    title: termText.value + 's',
    description: isHigherEducationComputed.value
      ? 'Semester management and scheduling'
      : 'Term management and scheduling (quarters/trimesters)',
    icon: 'carbon:calendar',
    isCompleted: totalSemestersCount.value > 0,
    isActive: canCreateSemester.value,
    count: totalSemestersCount.value,
    actionRequired: false, // This is the current page
  },
]);

// Global action for when prerequisites aren't met
const globalActionConfig = computed(() => {
  if (!hasActiveInstitution.value) {
    return {
      text: 'Select Active Institution',
      icon: isHigherEducationComputed.value ? 'ph:university' : 'ph:student',
      type: 'primary' as const,
      disabled: false,
    };
  }
  if (!hasAcademicYears.value) {
    return {
      text: 'Create Academic Years',
      icon: 'carbon:calendar-tools',
      type: 'primary' as const,
      disabled: false,
    };
  }
  return undefined;
});

// Filtered semesters based on tab and filters
const filteredSemesters = computed(() => {
  let semesters = [...academicYearStore.allSemesters];

  // Apply tab filtering
  switch (activeTab.value) {
    case 'active':
      semesters = academicYearStore.semestersByStatus(
        SemesterStatus.Active
      ).value;
      break;
    case 'upcoming':
      semesters = academicYearStore.upcomingSemesters;
      break;
    case 'byYear':
      // If academic year filter is set, filter by it
      if (academicYearFilter.value) {
        semesters = academicYearStore.getSemestersByAcademicYear(
          academicYearFilter.value
        ).value;
      }
      break;
    default:
      // 'all' - use all semesters
      break;
  }

  // Apply additional filters
  if (academicYearFilter.value && activeTab.value !== 'byYear') {
    semesters = semesters.filter(
      (s) => s.academicYearId === academicYearFilter.value
    );
  }

  if (statusFilter.value) {
    semesters = semesters.filter((s) => s.status === statusFilter.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    semesters = semesters.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.academicYearName?.toLowerCase().includes(query) ||
        (s.description && s.description.toLowerCase().includes(query))
    );
  }

  return semesters;
});

// Semester counts for badges
const activeSemestersCount = computed(() => {
  return academicYearStore.semestersByStatus(SemesterStatus.Active).value
    .length;
});

const upcomingSemestersCount = computed(() => {
  return academicYearStore.upcomingSemesters.length;
});

const completedSemestersCount = computed(() => {
  return academicYearStore.completedSemesters.length;
});

// Check if there are active filters
const hasActiveFilters = computed(() => {
  return !!(
    searchQuery.value ||
    academicYearFilter.value ||
    statusFilter.value
  );
});

// Options for filters
const academicYearOptions = computed(() => {
  return academicYearStore.academicYearOptions;
});

const statusOptions = computed(() => [
  { label: 'Upcoming', value: SemesterStatus.Upcoming },
  { label: 'Active', value: SemesterStatus.Active },
  { label: 'Completed', value: SemesterStatus.Completed },
  { label: 'Archived', value: SemesterStatus.Archived },
  { label: 'Cancelled', value: SemesterStatus.Cancelled },
]);

// Pagination configuration
const paginationConfig = computed(() => {
  const totalItems = filteredSemesters.value.length;

  if (totalItems <= pageSize.value) {
    return false;
  }

  return {
    page: currentPage.value,
    pageSize: pageSize.value,
    itemCount: totalItems,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
    showQuickJumper: true,
    prefix: (info: any) => `Total: ${info.itemCount ?? 0}`,
  };
});

// Format results text
function formatResultsText() {
  const total = filteredSemesters.value.length;
  const termType = termText.value.toLowerCase();
  return `Showing ${total} ${termType}${total !== 1 ? 's' : ''}`;
}

function getStatusTagType(status: SemesterStatus): string {
  switch (status) {
    case SemesterStatus.Active:
      return 'success';
    case SemesterStatus.Upcoming:
      return 'info';
    case SemesterStatus.Completed:
      return 'default';
    case SemesterStatus.Archived:
      return 'warning';
    case SemesterStatus.Cancelled:
      return 'error';
    default:
      return 'default';
  }
}

function getTypeTagType(type: SemesterTypeEnum): string {
  // K-12 terms get different colors
  if (isK12Term(type)) {
    switch (type) {
      case SemesterTypeEnum.FirstQuarter:
      case SemesterTypeEnum.FirstTrimester:
        return 'success';
      case SemesterTypeEnum.SecondQuarter:
      case SemesterTypeEnum.SecondTrimester:
        return 'info';
      case SemesterTypeEnum.ThirdQuarter:
      case SemesterTypeEnum.ThirdTrimester:
        return 'warning';
      case SemesterTypeEnum.FourthQuarter:
        return 'error';
      default:
        return 'default';
    }
  }

  // Higher-ed terms
  switch (type) {
    case SemesterTypeEnum.Fall:
      return 'warning';
    case SemesterTypeEnum.Spring:
      return 'success';
    case SemesterTypeEnum.Summer:
      return 'error';
    case SemesterTypeEnum.Winter:
      return 'info';
    case SemesterTypeEnum.Intersession:
      return 'default';
    default:
      return 'default';
  }
}

// Helper to get proper term display name
function getTermDisplayNameLocal(type: SemesterTypeEnum): string {
  return getTermDisplayName(type, isHigherEducationComputed.value);
}

// Dynamic table columns
const semesterColumns = computed<DataTableColumns<Semester>>(() => [
  {
    title: termText.value,
    key: 'name',
    width: 200,
    render(row: Semester) {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(
          'div',
          {
            class:
              'w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center',
          },
          [h(Icon, { name: 'carbon:calendar', class: 'text-primary' })]
        ),
        h('div', {}, [
          h('div', { class: 'font-medium' }, row.name),
          h(
            'div',
            { class: 'text-xs text-text-secondary' },
            row.academicYearName || 'Unknown Academic Year'
          ),
        ]),
      ]);
    },
  },
  {
    title: 'Type',
    key: 'type',
    width: 100,
    render(row: Semester) {
      return h(
        NTag,
        { type: getTypeTagType(row.type), size: 'small' },
        { default: () => getTermDisplayNameLocal(row.type) }
      );
    },
  },
  {
    title: 'Status',
    key: 'status',
    width: 120,
    render(row: Semester) {
      return h(
        NTag,
        { type: getStatusTagType(row.status), size: 'small' },
        { default: () => row.status }
      );
    },
  },
  {
    title: 'Period',
    key: 'period',
    width: 200,
    render(row: Semester) {
      return h('div', { class: 'space-y-1' }, [
        h('div', { class: 'text-sm' }, `${row.startDate} - ${row.endDate}`),
        h(
          'div',
          { class: 'text-xs text-text-secondary' },
          `${row.weekCount || 0} weeks`
        ),
      ]);
    },
  },
  {
    title: isHigherEducationComputed.value ? 'Important Dates' : 'Key Dates',
    key: 'dates',
    width: 180,
    render(row: Semester) {
      const dates = [];

      // Show different dates based on institution type
      if (isHigherEducationComputed.value) {
        if (row.registrationStartDate) {
          dates.push(`Reg: ${row.registrationStartDate}`);
        }
        if (row.addDropDeadline) {
          dates.push(`Add/Drop: ${row.addDropDeadline}`);
        }
      } else {
        // For K-12, focus on basic term dates
        if (row.startDate && row.endDate) {
          dates.push(`Start: ${row.startDate}`);
          dates.push(`End: ${row.endDate}`);
        }
      }

      if (dates.length === 0) {
        dates.push('No dates set');
      }

      return h(
        'div',
        { class: 'space-y-1' },
        dates.map((date) =>
          h('div', { class: 'text-xs text-text-secondary' }, date)
        )
      );
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 140,
    render(row: Semester) {
      const actions = [
        h(
          NButton,
          {
            quaternary: true,
            circle: true,
            type: 'info',
            size: 'small',
            onClick: (e: Event) => {
              e.stopPropagation();
              viewSemesterDetail(row);
            },
          },
          { icon: () => h(Icon, { name: 'carbon:view' }) }
        ),
        h(
          NButton,
          {
            quaternary: true,
            circle: true,
            type: 'warning',
            size: 'small',
            onClick: (e: Event) => {
              e.stopPropagation();
              handleEditSemester(row);
            },
          },
          { icon: () => h(Icon, { name: 'carbon:edit' }) }
        ),
        h(
          NButton,
          {
            quaternary: true,
            circle: true,
            type: 'error',
            size: 'small',
            onClick: (e: Event) => {
              e.stopPropagation();
              handleDeleteItem(row);
            },
          },
          { icon: () => h(Icon, { name: 'carbon:trash-can' }) }
        ),
      ];

      return h(
        NSpace,
        { justify: 'center', size: 'small' },
        { default: () => actions }
      );
    },
  },
]);

// Create a debounced search function
const debouncedSearch = debounce(() => {
  // Search is handled locally by computed property
}, 300);

// Event handlers
function handleTabChange(tab: string) {
  activeTab.value = tab;
  currentPage.value = 1;
}

function handleSearchUpdate(value: string) {
  searchQuery.value = value;
  debouncedSearch();
}

function handleSearch() {
  // Search is handled by reactive computed property
  currentPage.value = 1;
}

function handleFilterChange() {
  currentPage.value = 1;
}

function handleClearAllFilters() {
  searchQuery.value = '';
  academicYearFilter.value = null;
  statusFilter.value = null;
  currentPage.value = 1;
}

function handlePageChange(page: number) {
  currentPage.value = page;
}

function handlePageSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
}

// Hierarchy event handlers
function handleHierarchyLevelClick(level: HierarchyLevel) {
  console.log('Hierarchy level clicked:', level.title);
}

function handleHierarchyActionClick(level: HierarchyLevel) {
  console.log('Hierarchy action clicked:', level.title);
  if (level.navigateTo) {
    router.push(level.navigateTo);
  }
}

function navigateToPrerequisite() {
  if (!hasActiveInstitution.value) {
    router.push('/institutions');
  } else if (!hasAcademicYears.value) {
    router.push('/academic/years');
  }
}

// Semester management handlers
function handleAddSemesterClick() {
  if (!canCreateSemester.value) {
    message.warning(
      `You need to have an active institution and academic years first.`
    );
    return;
  }

  editingSemester.value = null;
  semesterForm.value = {};
  showSemesterModal.value = true;
}

function handleEditSemester(semester: Semester) {
  editingSemester.value = semester;
  semesterForm.value = {
    name: semester.name,
    startDate: new Date(semester.startDate),
    endDate: new Date(semester.endDate),
    academicYearId: semester.academicYearId,
    type: semester.type,
    status: semester.status,
    description: semester.description,
    weekCount: semester.weekCount,
    registrationStartDate: semester.registrationStartDate
      ? new Date(semester.registrationStartDate)
      : null,
    registrationEndDate: semester.registrationEndDate
      ? new Date(semester.registrationEndDate)
      : null,
    addDropDeadline: semester.addDropDeadline
      ? new Date(semester.addDropDeadline)
      : null,
    withdrawalDeadline: semester.withdrawalDeadline
      ? new Date(semester.withdrawalDeadline)
      : null,
    midtermStartDate: semester.midtermStartDate
      ? new Date(semester.midtermStartDate)
      : null,
    midtermEndDate: semester.midtermEndDate
      ? new Date(semester.midtermEndDate)
      : null,
    finalExamStartDate: semester.finalExamStartDate
      ? new Date(semester.finalExamStartDate)
      : null,
    finalExamEndDate: semester.finalExamEndDate
      ? new Date(semester.finalExamEndDate)
      : null,
    gradeSubmissionDeadline: semester.gradeSubmissionDeadline
      ? new Date(semester.gradeSubmissionDeadline)
      : null,
  };
  showSemesterModal.value = true;
}

function handleCancelSemester() {
  showSemesterModal.value = false;
  editingSemester.value = null;
  semesterForm.value = {};
}

function handleDeleteItem(semester: Semester) {
  itemToDelete.value = semester;
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    await academicYearStore.deleteSemester(
      itemToDelete.value.academicYearId,
      itemToDelete.value.id
    );
    message.success(`${termText.value} deleted successfully`);
  } catch (error: any) {
    message.error(
      `Error deleting ${termText.value.toLowerCase()}: ` + error.message
    );
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
}

function cancelDelete() {
  itemToDelete.value = null;
  showDeleteConfirm.value = false;
}

async function handleSubmitSemester(validatedData: any) {
  try {
    submittingSemester.value = true;

    if (editingSemester.value) {
      await academicYearStore.updateSemester(
        editingSemester.value.academicYearId,
        editingSemester.value.id,
        validatedData
      );
      message.success(`${termText.value} updated successfully`);
    } else {
      await academicYearStore.createSemester(validatedData);
      message.success(`${termText.value} created successfully`);
    }

    showSemesterModal.value = false;

    // Refresh semester data after successful operation
    await loadSemesterData();
  } catch (error: any) {
    message.error(
      `Failed to ${editingSemester.value ? 'update' : 'create'} ${termText.value.toLowerCase()}: ${error.message}`
    );
  } finally {
    submittingSemester.value = false;
  }
}

function viewSemesterDetail(semester: Semester) {
  selectedSemesterDetail.value = semester;
  showSemesterDetail.value = true;
}

function handleExportSemesters() {
  message.info('Export functionality coming soon');
}

// Load semester data function
async function loadSemesterData() {
  if (!activeInstitution.value?.id) return;

  try {
    loadingData.value = true;

    // Load academic years first
    await academicYearStore.fetchAcademicYearsByInstitution(
      activeInstitution.value.id
    );

    // Then load semesters for each academic year
    const academicYears = academicYearStore.academicYears;
    for (const academicYear of academicYears) {
      await academicYearStore.fetchSemestersByAcademicYear(academicYear.id);
    }
  } catch (error) {
    console.error('Error loading semester data:', error);
    message.error('Failed to load semester data');
  } finally {
    loadingData.value = false;
  }
}

// Initialize data
onMounted(async () => {
  await loadSemesterData();
});

// Watch for institution changes
watch(
  () => activeInstitution.value?.id,
  async (newInstitutionId) => {
    if (newInstitutionId) {
      await loadSemesterData();
    }
  }
);
</script>
