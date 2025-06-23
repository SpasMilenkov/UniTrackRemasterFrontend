<!-- components/academic/GradesTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Grade Header with actions -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white"
        >
          <Icon name="ph:graduation-cap" class="text-xl" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-text-primary m-0">
            Grade Management
          </h2>
          <p class="text-sm text-text-secondary mt-1">
            Organize students into grade levels and class structures
          </p>
        </div>
      </div>
      <n-button
        type="primary"
        :disabled="!canCreateGrade"
        size="large"
        @click="handleAddGradeClick"
      >
        <template #icon>
          <Icon name="ph:plus" />
        </template>
        Add Grade
      </n-button>
    </div>

    <!-- Prerequisites Warning -->
    <n-alert v-if="!canCreateGrade" type="warning" class="mb-6">
      <template #icon>
        <Icon name="ph:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">Before managing grades:</div>
        <div v-if="!hasActiveInstitution" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>You need to select an active institution</span>
        </div>
        <div v-if="!hasAcademicYears" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>You need to have academic years configured</span>
        </div>
      </div>
    </n-alert>

    <!-- Academic Hierarchy -->
    <AcademicHierarchy
      v-if="showHierarchy"
      :hierarchy="hierarchyData"
      title="Grade Management Prerequisites"
      title-icon="ph:graduation-cap"
      :global-action="!canCreateGrade ? globalActionConfig : undefined"
      class="mb-8"
      @level-click="handleHierarchyLevelClick"
      @action-click="handleHierarchyActionClick"
      @global-action="navigateToPrerequisite"
    />

    <!-- Filter controls -->
    <div v-if="canCreateGrade" class="mb-6 flex gap-4">
      <n-select
        v-model:value="selectedAcademicYear"
        :options="academicYearOptions"
        placeholder="Filter by Academic Year"
        clearable
        class="w-64"
        @update:value="handleAcademicYearFilter"
      />

      <n-input-group class="flex-1">
        <n-input
          v-model:value="searchQuery"
          placeholder="Search by grade name..."
          clearable
          @update:value="handleSearchUpdate"
        >
          <template #prefix>
            <Icon name="ph:magnifying-glass" />
          </template>
        </n-input>
        <n-button
          :loading="currentPagedQuery?.isLoading.value"
          type="primary"
          ghost
          @click="handleGradeSearch"
        >
          Search
        </n-button>
        <n-button
          v-if="searchQuery || selectedAcademicYear"
          type="default"
          ghost
          @click="handleClearFilters"
        >
          <template #icon>
            <Icon name="ph:x" />
          </template>
          Clear Filters
        </n-button>
      </n-input-group>
    </div>

    <!-- Grades Data Table -->
    <div
      v-if="canCreateGrade"
      class="bg-background-card rounded-xl shadow-sm border border-border overflow-hidden"
    >
      <n-data-table
        ref="gradeTable"
        :columns="gradeColumns"
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
              name="ph:graduation-cap"
              class="text-6xl text-text-secondary mb-4 mx-auto"
            />
            <h3 class="text-lg font-medium text-text-primary mb-2">
              No grades found
            </h3>
            <p class="text-text-secondary mb-4">
              {{
                searchQuery || selectedAcademicYear
                  ? 'No results found for your search criteria'
                  : 'Get started by creating your first grade level'
              }}
            </p>
            <n-button
              v-if="!searchQuery && !selectedAcademicYear"
              type="primary"
              @click="handleAddGradeClick"
            >
              <template #icon>
                <Icon name="ph:plus" />
              </template>
              Create Grade
            </n-button>
          </div>
        </template>
      </n-data-table>
    </div>

    <!-- Grade Modal -->
    <n-modal
      v-model:show="showGradeModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      :title="editingGrade ? 'Edit Grade' : 'Create New Grade'"
      :closable="!submittingGrade"
      :mask-closable="!submittingGrade"
    >
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <GradeForm
          :loading="submittingGrade"
          :initial-values="gradeForm"
          :is-editing="!!editingGrade"
          @submit="handleSubmitGrade"
          @cancel="showGradeModal = false"
        />
      </div>
    </n-modal>

    <!-- Delete Confirmation Dialog -->
    <n-modal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      type="error"
      title="Confirm Grade Deletion"
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
          Are you sure you want to delete the grade "{{ itemToDelete?.name }}"?
        </p>

        <n-alert type="error" class="mb-4" title="Permanent Action">
          This action cannot be undone. All students and related data will also
          be affected.
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
  NInput,
  NInputGroup,
  NSelect,
  useMessage,
} from 'naive-ui';
import { Icon } from '#components';
import { useAcademicStore } from '~/stores/academic';
import {
  useGradeStore,
  type Grade,
  type GradePaginationParams,
} from '~/stores/grade';
import { useInstitutionStore } from '~/stores/institution';
import { useAcademicYearStore } from '~/stores/academic-year';
import GradeForm from './forms/GradeForm.vue';
import AcademicHierarchy, {
  type HierarchyLevel,
} from '~/components/common/AcademicHierarchy.vue';
import { debounce } from 'lodash';
import type { GradeFormSchema } from '~/schemas/grade.schema';

// Router for navigation
const router = useRouter();

// Stores and utilities
const academicStore = useAcademicStore();
const gradeStore = useGradeStore();
const institutionStore = useInstitutionStore();
const academicYearStore = useAcademicYearStore();
const message = useMessage();

// Local state for search and filtering
const searchQuery = ref('');
const selectedAcademicYear = ref('');

// State for modals and forms
const showGradeModal = ref(false);
const submittingGrade = ref(false);
const editingGrade = ref<Grade | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<Grade | null>(null);

// Pagination parameters
const paginationParams = ref<GradePaginationParams>({
  page: 1,
  pageSize: 15,
  query: '',
  academicYearId: '',
});

// Query for paginated data based on context
const currentPagedQuery = computed(() => {
  if (institutionStore.activeInstitution?.id) {
    return gradeStore.pagedInstitutionGradesQuery(
      ref(institutionStore.activeInstitution.id),
      computed(() => ({
        query: paginationParams.value.query,
        academicYearId: paginationParams.value.academicYearId,
        page: paginationParams.value.page,
        pageSize: paginationParams.value.pageSize,
      }))
    );
  }
  return gradeStore.pagedGradesQuery(ref(paginationParams.value));
});

// Academic year options for filtering
const academicYearOptions = computed(() => {
  return academicYearStore.academicYears.map((year) => ({
    label: year.name,
    value: year.id,
  }));
});

// Prerequisites checks
const hasActiveInstitution = computed(
  () => !!institutionStore.activeInstitution?.id
);
const hasAcademicYears = computed(
  () => academicYearStore.academicYears.length > 0
);

// Computed property to determine if grades can be created
const canCreateGrade = computed(() => {
  return hasActiveInstitution.value && hasAcademicYears.value;
});

// Show hierarchy logic
const showHierarchy = computed(() => {
  return !canCreateGrade.value;
});

// Table data and loading states
const tableData = computed(() => {
  return currentPagedQuery.value?.data.value?.items || [];
});

const isTableLoading = computed(() => {
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

// Hierarchy data for the component
const hierarchyData = computed<HierarchyLevel[]>(() => [
  {
    id: 'institution',
    title: 'Institution Setup',
    description: 'Educational institution configuration and activation',
    icon: 'ph:building',
    isCompleted: !!institutionStore.activeInstitution?.id,
    isActive: false,
    count: institutionStore.activeInstitution ? 1 : 0,
    actionRequired: !institutionStore.activeInstitution?.id,
    navigateTo: '/institutions',
    actionText: 'Select Institution',
  },
  {
    id: 'academic-years',
    title: 'Academic Years',
    description: 'Calendar structure and academic periods setup',
    icon: 'ph:calendar',
    isCompleted: academicYearStore.academicYears.length > 0,
    isActive:
      hasActiveInstitution.value &&
      academicYearStore.academicYears.length === 0,
    count: academicYearStore.academicYears.length,
    actionRequired:
      hasActiveInstitution.value &&
      academicYearStore.academicYears.length === 0,
    navigateTo: '/academic/academic-years',
    actionText: 'Configure Academic Years',
  },
  {
    id: 'grades',
    title: 'Grade Levels',
    description: 'Student classification and class organization',
    icon: 'ph:graduation-cap',
    isCompleted: gradeStore.grades.length > 0,
    isActive: canCreateGrade.value && gradeStore.grades.length === 0,
    count: gradeStore.grades.length,
    actionRequired: false, // This is the current page
  },
]);

// Global action for when prerequisites aren't met
const globalActionConfig = computed(() => {
  if (!hasActiveInstitution.value) {
    return {
      text: 'Select Institution',
      icon: 'ph:building',
      type: 'primary' as const,
      disabled: false,
    };
  }
  if (!hasAcademicYears.value) {
    return {
      text: 'Configure Academic Years',
      icon: 'ph:calendar',
      type: 'primary' as const,
      disabled: false,
    };
  }
  return undefined;
});

// Grade form initial values
const gradeForm = ref({
  name: '',
  institutionId: institutionStore.activeInstitution?.id || '',
  academicYearId: '',
  homeRoomTeacherId: null as string | null,
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

// Table columns
const gradeColumns = [
  {
    title: 'Grade',
    key: 'grade',
    width: 200,
    render(row: Grade) {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(
          'div',
          {
            class:
              'w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center',
          },
          [h(Icon, { name: 'ph:graduation-cap', class: 'text-primary' })]
        ),
        h('div', {}, [
          h('div', { class: 'font-medium' }, row.name),
          h(
            'div',
            { class: 'text-xs text-text-secondary' },
            row.academicYearName || '-'
          ),
        ]),
      ]);
    },
  },
  {
    title: 'Academic Year',
    key: 'academicYearName',
    width: 180,
  },
  {
    title: 'Home Room Teacher',
    key: 'homeRoomTeacherName',
    width: 200,
    render(row: Grade) {
      return h('span', {}, row.homeRoomTeacherName || 'Not Assigned');
    },
  },
  {
    title: 'Students',
    key: 'studentsCount',
    width: 100,
    render(row: Grade) {
      return h(
        'div',
        { class: 'text-center font-medium' },
        row.studentsCount || '0'
      );
    },
  },
  {
    title: 'Created',
    key: 'createdAt',
    width: 120,
    render(row: Grade) {
      return new Date(row.createdAt).toLocaleDateString();
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 140,
    render(row: Grade) {
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
                onClick: () => handleEditGrade(row),
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
                onClick: () => handleDeleteItem(row),
              },
              { icon: () => h(Icon, { name: 'ph:trash' }) }
            ),
          ],
        }
      );
    },
  },
];

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

// Functions to handle navigation to prerequisite components
function navigateToAcademicYears() {
  router.push('/academic/academic-years');
}

function navigateToPrerequisite() {
  if (!hasActiveInstitution.value) {
    router.push('/institutions');
  } else {
    navigateToAcademicYears();
  }
}

// Event handlers for search and filtering
function handleSearchUpdate(value: string) {
  searchQuery.value = value;
}

function handleGradeSearch() {
  paginationParams.value.query = searchQuery.value;
  paginationParams.value.page = 1;
}

function handleAcademicYearFilter(value: string) {
  selectedAcademicYear.value = value;
  paginationParams.value.academicYearId = value;
  paginationParams.value.page = 1;
}

function handleClearFilters() {
  searchQuery.value = '';
  selectedAcademicYear.value = '';
  paginationParams.value.query = '';
  paginationParams.value.academicYearId = '';
  paginationParams.value.page = 1;
}

function handleAddGradeClick() {
  if (canCreateGrade.value) {
    // Default to active institution and first academic year
    gradeForm.value = {
      name: '',
      institutionId: institutionStore.activeInstitution?.id || '',
      academicYearId:
        academicYearStore.academicYears.length > 0
          ? academicYearStore.academicYears[0].id
          : '',
      homeRoomTeacherId: null,
    };
    editingGrade.value = null;
    showGradeModal.value = true;
  } else {
    message.warning(
      'You need an active institution and at least one academic year configured.'
    );
  }
}

function handleEditGrade(grade: Grade) {
  editingGrade.value = grade;
  gradeForm.value = {
    name: grade.name || '',
    institutionId: grade.institutionId,
    academicYearId: grade.academicYearId,
    homeRoomTeacherId: grade.homeRoomTeacherId || null,
  };
  showGradeModal.value = true;
}

function handleDeleteItem(grade: Grade) {
  itemToDelete.value = grade;
  showDeleteConfirm.value = true;
}

function cancelDelete() {
  itemToDelete.value = null;
  showDeleteConfirm.value = false;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    await gradeStore.deleteGrade(itemToDelete.value.id);
    message.success('Grade deleted successfully');

    // Refetch current page
    if (currentPagedQuery.value) {
      await currentPagedQuery.value.refetch();
    }
  } catch (error: any) {
    message.error('Error deleting grade: ' + error.message);
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
}

async function handleSubmitGrade(validatedData: GradeFormSchema) {
  try {
    submittingGrade.value = true;

    if (editingGrade.value) {
      await gradeStore.updateGrade(editingGrade.value.id, validatedData);
      message.success('Grade updated successfully');
    } else {
      await gradeStore.createGrade(validatedData);
      message.success('Grade created successfully');
    }

    // Refetch current page
    if (currentPagedQuery.value) {
      await currentPagedQuery.value.refetch();
    }

    showGradeModal.value = false;
  } catch (error: any) {
    message.error(
      `Failed to ${editingGrade.value ? 'update' : 'create'} grade: ${error.message}`
    );
  } finally {
    submittingGrade.value = false;
  }
}

// Initialize data
onMounted(async () => {
  if (!academicStore.initialized) {
    await academicStore.initializeStore();
  }

  // Load academic years for the active institution
  if (institutionStore.activeInstitution?.id) {
    await academicYearStore.fetchAcademicYearsByInstitution(
      institutionStore.activeInstitution.id
    );

    // Set initial pagination institution context
    paginationParams.value.institutionId =
      institutionStore.activeInstitution.id;
  }

  // Load non-paginated grades for dropdowns/options
  await gradeStore.fetchGrades();
});
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
