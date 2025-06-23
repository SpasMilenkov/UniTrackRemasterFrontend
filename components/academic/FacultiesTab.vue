<!-- components/academic/FacultiesTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Faculty Header with actions -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white"
        >
          <Icon name="ph:buildings" class="text-xl" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-text-primary m-0">
            Faculty Management
          </h2>
          <p class="text-sm text-text-secondary mt-1">
            Organize academic divisions within your university
          </p>
        </div>
      </div>

      <!-- Institution Type Indicator & Actions -->
      <div class="flex items-center gap-3">
        <n-tag type="info" size="medium" class="flex-shrink-0">
          <Icon name="ph:buildings" class="mr-1" />
          {{ institutionTypeLabel }}
        </n-tag>

        <n-button
          type="primary"
          :disabled="!canCreateFaculty"
          size="large"
          @click="handleAddFacultyClick"
        >
          <template #icon>
            <Icon name="ph:plus" />
          </template>
          Add Faculty
        </n-button>
      </div>
    </div>

    <!-- Prerequisites Warning -->
    <n-alert v-if="!canCreateFaculty" type="warning" class="mb-6">
      <template #icon>
        <Icon name="ph:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">Before managing faculties:</div>
        <div v-if="!hasActiveUniversity" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>You need to have an active university configured</span>
        </div>
      </div>
    </n-alert>

    <!-- Academic Hierarchy -->
    <AcademicHierarchy
      v-if="showHierarchy"
      :hierarchy="hierarchyData"
      title="Faculty Management Prerequisites"
      title-icon="ph:buildings"
      :global-action="!canCreateFaculty ? globalActionConfig : undefined"
      class="mb-8"
      @level-click="handleHierarchyLevelClick"
      @action-click="handleHierarchyActionClick"
      @global-action="navigateToPrerequisite"
    />

    <!-- Faculty Categories Tabs -->
    <n-tabs
      v-if="canCreateFaculty"
      v-model:value="activeTab"
      type="line"
      animated
      size="large"
      class="mb-6"
      @update:value="handleTabChange"
    >
      <n-tab-pane name="all" tab="All Faculties">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:list" />
            All Faculties
            <n-badge
              v-if="allFacultiesCount > 0"
              :value="allFacultiesCount"
              type="info"
              :max="99"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane name="active" tab="Active Faculties">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:check-circle" />
            Active
            <n-badge
              v-if="activeFacultiesCount > 0"
              :value="activeFacultiesCount"
              type="success"
              :max="99"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane name="review" tab="Under Review">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:clock" />
            Under Review
            <n-badge
              v-if="reviewFacultiesCount > 0"
              :value="reviewFacultiesCount"
              type="warning"
              :max="99"
            />
          </div>
        </template>
      </n-tab-pane>
    </n-tabs>

    <!-- Search and Filters -->
    <FacultyFilters
      v-if="canCreateFaculty"
      v-model:search="searchQuery"
      v-model:filters="filters"
      :loading="isSearchLoading"
      :active-tab="activeTab"
      class="mb-6"
      @search="handleSearch"
      @clear="handleClearSearch"
    />

    <!-- Faculties Data Table -->
    <div
      v-if="canCreateFaculty"
      class="bg-background-card rounded-xl shadow-sm border border-border overflow-hidden"
    >
      <n-data-table
        ref="facultyTable"
        :columns="facultyColumns"
        :data="tableData"
        :loading="isTableLoading"
        :pagination="paginationConfig"
        :row-key="(row) => row.id"
        :scroll-x="1200"
        class="min-h-[400px]"
      >
        <template #empty>
          <div class="text-center py-12">
            <Icon
              name="ph:buildings"
              class="text-6xl text-text-secondary mb-4 mx-auto"
            />
            <h3 class="text-lg font-medium text-text-primary mb-2">
              No faculties found
            </h3>
            <p class="text-text-secondary mb-4">
              {{
                searchQuery
                  ? `No results for "${searchQuery}"`
                  : 'Get started by creating your first faculty'
              }}
            </p>
            <n-button
              v-if="!searchQuery"
              type="primary"
              @click="handleAddFacultyClick"
            >
              <template #icon>
                <Icon name="ph:plus" />
              </template>
              Create Faculty
            </n-button>
          </div>
        </template>
      </n-data-table>
    </div>

    <!-- Faculty Modal -->
    <n-modal
      v-model:show="showFacultyModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      :title="editingFaculty ? 'Edit Faculty' : 'Create New Faculty'"
      :closable="!submittingFaculty"
      :mask-closable="!submittingFaculty"
    >
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <FacultyForm
          :loading="submittingFaculty"
          :initial-values="facultyForm"
          :is-editing="!!editingFaculty"
          @submit="handleSubmitFaculty"
          @cancel="handleCancelFaculty"
        />
      </div>
    </n-modal>

    <!-- Faculty Detail Modal -->
    <n-modal
      v-model:show="showDetailModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      title="Faculty Details"
    >
      <div v-if="selectedFaculty" class="max-h-[70vh] overflow-y-auto pr-2">
        <div class="mb-4">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-semibold text-text-primary">
                {{ selectedFaculty.name }}
              </h2>
              <p
                v-if="selectedFaculty.code"
                class="text-text-secondary text-sm mt-1"
              >
                Code: {{ selectedFaculty.code }}
              </p>
            </div>
            <n-tag
              :type="getStatusType(selectedFaculty.status)"
              :bordered="false"
            >
              {{ getFacultyStatusLabel(selectedFaculty.status) }}
            </n-tag>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">Description</h3>
          <p class="text-text-secondary">
            {{ selectedFaculty.shortDescription || 'No description provided' }}
          </p>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">Website</h3>
          <div class="text-text-secondary">
            <a
              v-if="selectedFaculty.website"
              :href="
                selectedFaculty.website.startsWith('http')
                  ? selectedFaculty.website
                  : `https://${selectedFaculty.website}`
              "
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              {{ selectedFaculty.website }}
            </a>
            <span v-else>No website provided</span>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">
            Contact Information
          </h3>
          <div class="text-text-secondary">
            <p v-if="selectedFaculty.contactEmail">
              <Icon name="ph:envelope" class="mr-1" />
              {{ selectedFaculty.contactEmail }}
            </p>
            <p v-if="selectedFaculty.contactPhone">
              <Icon name="ph:phone" class="mr-1" />
              {{ selectedFaculty.contactPhone }}
            </p>
            <p
              v-if="
                !selectedFaculty.contactEmail && !selectedFaculty.contactPhone
              "
            >
              No contact information provided
            </p>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">Departments</h3>
          <p class="text-text-secondary">
            {{ selectedFaculty.departmentsCount || 0 }} departments
          </p>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <n-button type="default" @click="showDetailModal = false">
            Close
          </n-button>
          <n-button type="primary" @click="openEditModal(selectedFaculty)">
            <template #icon>
              <Icon name="ph:pencil" />
            </template>
            Edit
          </n-button>
        </div>
      </div>
    </n-modal>

    <!-- Delete Confirmation Dialog -->
    <n-modal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      type="error"
      title="Confirm Faculty Deletion"
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="confirmDelete"
      @negative-click="cancelDelete"
    >
      <template #icon>
        <Icon name="ph:warning-diamond" class="text-red-500" />
      </template>
      <div class="py-2">
        <p class="mb-4">
          Are you sure you want to delete the faculty "{{
            itemToDelete?.name
          }}"?
        </p>

        <n-alert type="error" class="mb-4" title="Permanent Action">
          This action cannot be undone. All departments, majors, and related
          data will also be deleted.
        </n-alert>
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
  useMessage,
} from 'naive-ui';
import { Icon } from '#components';
import { useAcademicStore } from '~/stores/academic';
import { useFacultyStore, type Faculty } from '~/stores/faculty';
import { useInstitutionStore } from '~/stores/institution';
import { useUniversityStore } from '~/stores/university';
import { FacultyStatus } from '~/enums/faculty-status.enum';
import { isHigherEducation as checkIsHigherEducation } from '~/utils/institution-helper';
import FacultyForm from './forms/FacultyForm.vue';
import FacultyFilters from './filters/FacultyFilters.vue';
import AcademicHierarchy, {
  type HierarchyLevel,
} from '~/components/common/AcademicHierarchy.vue';
import { debounce } from 'lodash';

// Router for navigation
const router = useRouter();

// Stores and utilities
const academicStore = useAcademicStore();
const facultyStore = useFacultyStore();
const institutionStore = useInstitutionStore();
const universityStore = useUniversityStore();
const message = useMessage();

// Institution type detection
const activeInstitution = computed(() => institutionStore.activeInstitution);
const isHigherEducationComputed = computed(() =>
  checkIsHigherEducation(activeInstitution.value?.type)
);
const institutionTypeLabel = computed(() =>
  isHigherEducationComputed.value ? 'Higher Education' : 'K-12 School'
);

// Tab state
const activeTab = ref('all');

// Local state for search and filters
const searchQuery = ref('');
const filters = ref({
  status: null as string | null,
});

// Computed property to determine the university ID to use for APIs
const universityId = computed(() => {
  // If we have an active university, use its ID
  if (universityStore.activeUniversity?.id) {
    return universityStore.activeUniversity.id;
  }
  // Otherwise, try to use the institution ID if it's a university
  if (checkIsHigherEducation(institutionStore.activeInstitution?.type)) {
    return institutionStore.activeInstitution?.id;
  }
  return '';
});

// Pagination parameters
const paginationParams = ref({
  page: 1,
  pageSize: 15,
  query: '',
  universityId: universityId.value || null,
  institutionId: activeInstitution.value?.id || null,
  status: null as string | null,
});

// State for modals and forms
const showFacultyModal = ref(false);
const showDetailModal = ref(false);
const submittingFaculty = ref(false);
const editingFaculty = ref<Faculty | null>(null);
const selectedFaculty = ref<Faculty | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<Faculty | null>(null);

// Faculty form state
const facultyForm = ref<Partial<Faculty>>({});

// Prerequisites checks
const hasActiveUniversity = computed(() => !!universityId.value);

// Computed property to determine if faculties can be created
const canCreateFaculty = computed(() => {
  return (
    checkIsHigherEducation(institutionStore.activeInstitution?.type) &&
    !!universityId.value
  );
});

// Query for paginated data based on context
const currentPagedQuery = computed(() => {
  const institution = activeInstitution.value;

  if (institution?.id) {
    return facultyStore.pagedInstitutionFacultiesQuery(
      computed(() => institution.id),
      {
        ...paginationParams.value,
        institutionId: undefined,
      }
    );
  }

  return facultyStore.pagedFacultiesQuery(paginationParams);
});

// Table data and loading states
const tableData = computed(() => {
  return currentPagedQuery.value?.data.value?.items || [];
});

const isTableLoading = computed(() => {
  return currentPagedQuery.value?.isLoading.value || false;
});

const isSearchLoading = computed(() => {
  return currentPagedQuery.value?.isLoading.value || false;
});

// Pagination configuration for the table
const paginationConfig = computed(() => {
  const pagedData = currentPagedQuery.value?.data.value;

  return {
    page: paginationParams.value.page || 1,
    pageSize: paginationParams.value.pageSize || 15,
    pageCount: pagedData?.totalPages || 1,
    itemCount: pagedData?.totalCount || 0,
    showSizePicker: true,
    pageSizes: [10, 15, 25, 50],
    prefix: ({ itemCount }: { itemCount: number }) => `Total: ${itemCount}`,
    onChange: (page: number) => {
      paginationParams.value.page = page;
    },
    onUpdatePageSize: (pageSize: number) => {
      paginationParams.value.pageSize = pageSize;
      paginationParams.value.page = 1;
    },
  };
});

// Create a debounced search function
const debouncedSearch = debounce(() => {
  if (searchQuery.value.length > 2 || searchQuery.value === '') {
    paginationParams.value.query = searchQuery.value;
    paginationParams.value.page = 1; // Reset to first page on search
  }
}, 500);

// Watch for changes to searchQuery
watch(searchQuery, () => {
  debouncedSearch();
});

// Watch pagination params to refetch data
watch(
  () => paginationParams.value,
  () => {
    if (currentPagedQuery.value) {
      currentPagedQuery.value.refetch();
    }
  },
  { deep: true }
);

// Faculty counts for badges - using paginated data
const allFacultiesCount = computed(() => {
  if (activeTab.value === 'all') {
    return currentPagedQuery.value?.data.value?.totalCount || 0;
  }
  return facultyStore.faculties?.length || 0;
});

const activeFacultiesCount = computed(() => {
  if (activeTab.value === 'active') {
    return currentPagedQuery.value?.data.value?.totalCount || 0;
  }
  return (
    facultyStore.faculties?.filter((f) => f.status === FacultyStatus.Active)
      .length || 0
  );
});

const reviewFacultiesCount = computed(() => {
  if (activeTab.value === 'review') {
    return currentPagedQuery.value?.data.value?.totalCount || 0;
  }
  return (
    facultyStore.faculties?.filter(
      (f) => f.status === FacultyStatus.UnderReview
    ).length || 0
  );
});

// Show hierarchy logic
const showHierarchy = computed(() => {
  return !canCreateFaculty.value;
});

// Hierarchy data for the component
const hierarchyData = computed<HierarchyLevel[]>(() => [
  {
    id: 'university',
    title: 'University Configuration',
    description: 'Main educational institution setup and activation',
    icon: 'ph:graduation-cap',
    isCompleted: !!universityStore.activeUniversity?.id,
    isActive: false,
    count: universityStore.activeUniversity ? 1 : 0,
    actionRequired: !universityStore.activeUniversity?.id,
    navigateTo: '/institutions/universities',
    actionText: 'Configure University',
  },
  {
    id: 'faculties',
    title: 'Faculty Structure',
    description: 'Academic divisions and organizational units',
    icon: 'ph:buildings',
    isCompleted: facultyStore.faculties.length > 0,
    isActive: canCreateFaculty.value && facultyStore.faculties.length === 0,
    count: facultyStore.faculties.length,
    actionRequired: false, // This is the current page
  },
]);

// Global action for when prerequisites aren't met
const globalActionConfig = computed(() => {
  if (!universityStore.activeUniversity?.id) {
    return {
      text: 'Setup University',
      icon: 'ph:graduation-cap',
      type: 'primary' as const,
      disabled: false,
    };
  }
  return undefined;
});

// Status mappings
const statusTypeMap = {
  [FacultyStatus.Active]: 'success',
  [FacultyStatus.Inactive]: 'error',
  [FacultyStatus.UnderReview]: 'warning',
} as const;

const statusLabelMap = {
  [FacultyStatus.Active]: 'Active',
  [FacultyStatus.Inactive]: 'Inactive',
  [FacultyStatus.UnderReview]: 'Under Review',
} as const;

// Table columns
const facultyColumns = computed(() => [
  {
    title: 'Faculty',
    key: 'faculty',
    width: 200,
    render(row: Faculty) {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(
          'div',
          {
            class:
              'w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center',
          },
          [h(Icon, { name: 'ph:buildings', class: 'text-primary' })]
        ),
        h('div', {}, [
          h('div', { class: 'font-medium' }, row.name || '-'),
          h('div', { class: 'text-xs text-text-secondary' }, row.code || '-'),
        ]),
      ]);
    },
  },
  {
    title: 'Status',
    key: 'status',
    width: 120,
    render(row: Faculty) {
      return h(
        NTag,
        {
          type: getStatusType(row.status),
          size: 'small',
          bordered: false,
        },
        { default: () => getFacultyStatusLabel(row.status) }
      );
    },
  },
  {
    title: 'Website',
    key: 'website',
    width: 180,
    ellipsis: {
      tooltip: true,
    },
    render(row: Faculty) {
      if (!row.website) return h('span', { class: 'text-text-secondary' }, '-');

      return h(
        'a',
        {
          href: row.website.startsWith('http')
            ? row.website
            : `https://${row.website}`,
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'text-primary hover:underline',
        },
        row.website.replace(/^https?:\/\//, '')
      );
    },
  },
  {
    title: 'Contact',
    key: 'contact',
    width: 180,
    ellipsis: {
      tooltip: true,
    },
    render(row: Faculty) {
      return h('span', {}, row.contactEmail || '-');
    },
  },
  {
    title: 'Departments',
    key: 'departmentsCount',
    width: 120,
    render(row: Faculty) {
      return h(
        'div',
        { class: 'text-center font-medium' },
        String(row.departmentsCount || '0')
      );
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 160,
    render(row: Faculty) {
      return h(
        NSpace,
        { justify: 'center', size: 'small' },
        {
          default: () => [
            h(
              NButton,
              {
                quaternary: true,
                circle: true,
                type: 'info',
                size: 'small',
                onClick: (e: Event) => {
                  e.stopPropagation();
                  openFacultyDetail(row);
                },
              },
              { icon: () => h(Icon, { name: 'ph:eye' }) }
            ),
            h(
              NButton,
              {
                quaternary: true,
                circle: true,
                type: 'primary',
                size: 'small',
                onClick: (e: Event) => {
                  e.stopPropagation();
                  handleEditFaculty(row);
                },
              },
              { icon: () => h(Icon, { name: 'ph:pencil' }) }
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
              { icon: () => h(Icon, { name: 'ph:trash' }) }
            ),
          ],
        }
      );
    },
  },
]);

// Event handlers
function handleTabChange(tab: string) {
  activeTab.value = tab;
  searchQuery.value = '';
  resetFilters();

  // Update pagination params based on tab
  paginationParams.value.page = 1;
  paginationParams.value.query = '';

  if (tab === 'active') {
    paginationParams.value.status = FacultyStatus.Active;
  } else if (tab === 'review') {
    paginationParams.value.status = FacultyStatus.UnderReview;
  } else {
    paginationParams.value.status = null;
  }
}

function resetFilters() {
  filters.value = {
    status: null,
  };

  // Reset pagination params filters
  paginationParams.value.status = null;
}

async function handleSearch() {
  if (!canCreateFaculty.value) return;

  // Update pagination params with current filters
  paginationParams.value.query = searchQuery.value;
  paginationParams.value.status = filters.value.status;
  paginationParams.value.page = 1; // Reset to first page on search
}

function handleClearSearch() {
  searchQuery.value = '';
  resetFilters();
  paginationParams.value.query = '';
  paginationParams.value.page = 1;
}

function handleAddFacultyClick() {
  if (!canCreateFaculty.value) {
    message.warning('You need to have an active university first.');
    return;
  }

  editingFaculty.value = null;
  facultyForm.value = {
    universityId: universityId.value,
    institutionId: activeInstitution.value?.id,
  };
  showFacultyModal.value = true;
}

function openFacultyDetail(faculty: Faculty) {
  selectedFaculty.value = faculty;
  showDetailModal.value = true;
}

function openEditModal(faculty: Faculty) {
  editingFaculty.value = faculty;
  selectedFaculty.value = faculty;
  facultyForm.value = { ...faculty };
  showDetailModal.value = false;
  showFacultyModal.value = true;
}

function handleEditFaculty(faculty: Faculty) {
  editingFaculty.value = faculty;
  facultyForm.value = { ...faculty };
  showFacultyModal.value = true;
}

function handleCancelFaculty() {
  showFacultyModal.value = false;
  editingFaculty.value = null;
  facultyForm.value = {};
}

function handleDeleteItem(faculty: Faculty) {
  itemToDelete.value = faculty;
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    await facultyStore.deleteFaculty(itemToDelete.value.id);
    message.success('Faculty deleted successfully');

    // Refetch current page
    if (currentPagedQuery.value) {
      await currentPagedQuery.value.refetch();
    }
  } catch (error: any) {
    message.error('Error deleting faculty: ' + error.message);
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
}

function cancelDelete() {
  itemToDelete.value = null;
  showDeleteConfirm.value = false;
}

async function handleSubmitFaculty(validatedData: any) {
  try {
    submittingFaculty.value = true;

    if (editingFaculty.value) {
      await facultyStore.updateFaculty(editingFaculty.value.id, validatedData);
      message.success('Faculty updated successfully');
    } else {
      await facultyStore.createFaculty(validatedData);
      message.success('Faculty created successfully');
    }

    // Refetch current page
    if (currentPagedQuery.value) {
      await currentPagedQuery.value.refetch();
    }

    showFacultyModal.value = false;
  } catch (error: any) {
    message.error(
      `Failed to ${editingFaculty.value ? 'update' : 'create'} faculty: ${error.message}`
    );
  } finally {
    submittingFaculty.value = false;
  }
}

// Helper functions
function getFacultyStatusLabel(status: string): string {
  return statusLabelMap[status as FacultyStatus] || status;
}

function getStatusType(
  status: string
): 'success' | 'error' | 'warning' | 'info' | 'default' {
  return statusTypeMap[status as FacultyStatus] || 'default';
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
  router.push('/institutions/universities');
}

// Initialize data
onMounted(async () => {
  if (!academicStore.initialized) {
    await academicStore.initializeStore();
  }

  // First, try to load the university by institution ID if we have an active institution
  if (
    institutionStore.activeInstitution?.id &&
    checkIsHigherEducation(institutionStore.activeInstitution?.type)
  ) {
    try {
      await universityStore.fetchUniversityByInstitutionId(
        institutionStore.activeInstitution.id
      );
    } catch (error) {
      console.error('Error fetching university:', error);
    }
  }

  // Update pagination params with current IDs
  if (universityId.value) {
    paginationParams.value.universityId = universityId.value;
  }
  if (activeInstitution.value?.id) {
    paginationParams.value.institutionId = activeInstitution.value.id;
  }

  // Load non-paginated faculties for dropdowns/options
  await facultyStore.fetchFacultiesByInstitution(
    activeInstitution.value?.id || ''
  );
});

// Watch for institution/university changes
watch(
  () => [universityId.value, activeInstitution.value?.id],
  async ([newUniversityId, newInstitutionId]) => {
    if (newUniversityId || newInstitutionId) {
      // Update pagination params
      paginationParams.value.universityId = newUniversityId;
      paginationParams.value.institutionId = newInstitutionId;

      // Reload data when IDs change
      if (newInstitutionId) {
        await facultyStore.fetchFacultiesByInstitution(newInstitutionId);
      } else if (newUniversityId) {
        await facultyStore.fetchFacultiesByUniversity(newUniversityId);
      }
    }
  }
);
</script>

<style scoped>
.hover-elevate {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-elevate:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

:deep(.n-data-table-th) {
  background-color: var(--color-background-secondary);
  font-weight: 600;
}

:deep(.n-data-table-td) {
  border-bottom: 1px solid var(--border-color);
}

:deep(.n-data-table-tr:hover .n-data-table-td) {
  background-color: var(--color-background-hover);
}

/* Responsive design */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  :deep(.n-data-table) {
    font-size: 14px;
  }
}
</style>
