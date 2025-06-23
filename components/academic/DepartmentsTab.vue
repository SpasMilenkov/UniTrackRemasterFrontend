<!-- components/academic/DepartmentsTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Department Header with actions -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white"
        >
          <Icon name="ph:office-chair" class="text-xl" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-text-primary m-0">
            Department Management
          </h2>
          <p class="text-sm text-text-secondary mt-1">
            Organize academic and administrative departments within faculties
          </p>
        </div>
      </div>
      <n-button
        type="primary"
        :disabled="!canCreateDepartment"
        size="large"
        @click="handleAddDepartmentClick"
      >
        <template #icon>
          <Icon name="ph:plus" />
        </template>
        Add Department
      </n-button>
    </div>

    <!-- Prerequisites Warning -->
    <n-alert v-if="!canCreateDepartment" type="warning" class="mb-6">
      <template #icon>
        <Icon name="ph:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">Before managing departments:</div>
        <div v-if="!hasFaculties" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>You need to have at least one faculty configured</span>
        </div>
      </div>
    </n-alert>

    <!-- Academic Hierarchy -->
    <AcademicHierarchy
      v-if="showHierarchy"
      :hierarchy="hierarchyData"
      title="Department Management Prerequisites"
      title-icon="ph:office-chair"
      :global-action="!canCreateDepartment ? globalActionConfig : undefined"
      class="mb-8"
      @level-click="handleHierarchyLevelClick"
      @action-click="handleHierarchyActionClick"
      @global-action="navigateToPrerequisite"
    />

    <!-- Department Search and Filters -->
    <div v-if="canCreateDepartment" class="mb-6">
      <n-input-group>
        <n-input
          v-model:value="searchQuery"
          placeholder="Search by department name, code, or location..."
          clearable
          @update:value="handleSearchUpdate"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <Icon name="ph:magnifying-glass" />
          </template>
        </n-input>
        <n-button
          :loading="isSearchLoading"
          type="primary"
          ghost
          @click="handleSearch"
        >
          Search
        </n-button>
        <n-button
          v-if="searchQuery || selectedFaculty"
          type="default"
          ghost
          @click="handleClearSearch"
        >
          <template #icon>
            <Icon name="ph:x" />
          </template>
          Clear
        </n-button>
      </n-input-group>

      <!-- Faculty filter -->
      <div class="mt-3">
        <n-select
          v-model:value="selectedFaculty"
          placeholder="Filter by Faculty (optional)"
          clearable
          :options="facultyOptions"
          @update:value="handleFacultyFilterChange"
        />
      </div>

      <!-- Search tips -->
      <div class="text-text-secondary text-xs mt-2">
        <p>
          Search by: department name, department code, location. Example:
          "computer science", "CS-101", "building A"
        </p>
      </div>
    </div>

    <!-- Departments Data Table -->
    <div
      v-if="canCreateDepartment"
      class="bg-background-card rounded-xl shadow-sm border border-border overflow-hidden"
    >
      <n-data-table
        ref="departmentTable"
        :columns="departmentColumns"
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
              name="ph:office-chair"
              class="text-6xl text-text-secondary mb-4 mx-auto"
            />
            <h3 class="text-lg font-medium text-text-primary mb-2">
              No departments found
            </h3>
            <p class="text-text-secondary mb-4">
              {{
                searchQuery
                  ? `No results for "${searchQuery}"`
                  : 'Get started by creating your first department'
              }}
            </p>
            <n-button
              v-if="!searchQuery"
              type="primary"
              @click="handleAddDepartmentClick"
            >
              <template #icon>
                <Icon name="ph:plus" />
              </template>
              Create Department
            </n-button>
          </div>
        </template>
      </n-data-table>
    </div>

    <!-- Department Modal -->
    <n-modal
      v-model:show="showDepartmentModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      :title="editingDepartment ? 'Edit Department' : 'Create New Department'"
      :closable="!submittingDepartment"
      :mask-closable="!submittingDepartment"
    >
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <DepartmentForm
          :loading="submittingDepartment"
          :initial-values="departmentForm"
          :is-editing="!!editingDepartment"
          :faculties="facultyStore.faculties"
          @submit="handleSubmitDepartment"
          @cancel="handleCancelDepartment"
        />
      </div>
    </n-modal>

    <!-- Department Detail Modal -->
    <n-modal
      v-model:show="showDetailModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      title="Department Details"
    >
      <div v-if="selectedDepartment" class="max-h-[70vh] overflow-y-auto pr-2">
        <div class="mb-4">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-semibold text-text-primary">
                {{ selectedDepartment.name }}
              </h2>
              <p
                v-if="selectedDepartment.code"
                class="text-text-secondary text-sm mt-1"
              >
                Code: {{ selectedDepartment.code }}
              </p>
            </div>
            <n-tag
              :type="getStatusType(selectedDepartment.status)"
              :bordered="false"
            >
              {{ getDepartmentStatusLabel(selectedDepartment.status) }}
            </n-tag>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">Faculty</h3>
          <p class="text-text-secondary">
            {{ getFacultyName(selectedDepartment.facultyId) }}
          </p>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">Type</h3>
          <p class="text-text-secondary">
            {{ getDepartmentTypeLabel(selectedDepartment.type) }}
          </p>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">Description</h3>
          <p class="text-text-secondary">
            {{ selectedDepartment.description || 'No description provided' }}
          </p>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">
            Contact Information
          </h3>
          <div class="text-text-secondary">
            <p v-if="selectedDepartment.contactEmail">
              <Icon name="ph:envelope" class="mr-1" />
              {{ selectedDepartment.contactEmail }}
            </p>
            <p v-if="selectedDepartment.contactPhone">
              <Icon name="ph:phone" class="mr-1" />
              {{ selectedDepartment.contactPhone }}
            </p>
            <p
              v-if="
                !selectedDepartment.contactEmail &&
                !selectedDepartment.contactPhone
              "
            >
              No contact information provided
            </p>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">Location</h3>
          <p class="text-text-secondary">
            {{ selectedDepartment.location || 'No location specified' }}
          </p>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <n-button type="default" @click="showDetailModal = false">
            Close
          </n-button>
          <n-button type="primary" @click="openEditModal(selectedDepartment)">
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
      title="Confirm Department Deletion"
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
          Are you sure you want to delete the department "{{
            itemToDelete?.name
          }}"?
        </p>

        <n-alert type="error" class="mb-4" title="Permanent Action">
          This action cannot be undone. All related data will also be deleted.
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
  NTag,
  useMessage,
} from 'naive-ui';
import { Icon } from '#components';
import { useAcademicStore } from '~/stores/academic';
import { useDepartmentStore, type Department } from '~/stores/department';
import { useFacultyStore } from '~/stores/faculty';
import { useInstitutionStore } from '~/stores/institution';
import { useUniversityStore } from '~/stores/university';
import { DepartmentStatus } from '~/enums/department-status.enum';
import { DepartmentType } from '~/enums/department-type.enum';
import AcademicHierarchy, {
  type HierarchyLevel,
} from '~/components/common/AcademicHierarchy.vue';
import { debounce } from 'lodash';
import DepartmentForm from './forms/DepartmentForm.vue';

// Router for navigation
const router = useRouter();

// Stores and utilities
const academicStore = useAcademicStore();
const departmentStore = useDepartmentStore();
const facultyStore = useFacultyStore();
const institutionStore = useInstitutionStore();
const universityStore = useUniversityStore();
const message = useMessage();

// Local state for search and filters
const searchQuery = ref('');
const selectedFaculty = ref<string | null>(null);

// State for modals and forms
const showDepartmentModal = ref(false);
const showDetailModal = ref(false);
const showDeleteConfirm = ref(false);
const submittingDepartment = ref(false);
const editingDepartment = ref<Department | null>(null);
const selectedDepartment = ref<Department | null>(null);
const itemToDelete = ref<Department | null>(null);

// Prerequisites checks
const hasFaculties = computed(() => facultyStore.faculties.length > 0);

// Computed property to determine if departments can be created
const canCreateDepartment = computed(() => {
  return facultyStore.faculties.length > 0;
});

// Table data and loading states - following SubjectsTab pattern
const tableData = computed(() => {
  return departmentStore.filteredDepartments || [];
});

const isTableLoading = computed(() => {
  return departmentStore.loadingDepartments;
});

const isSearchLoading = computed(() => {
  return departmentStore.searchLoading;
});

// Faculty options for dropdown
const facultyOptions = computed(() => {
  return facultyStore.faculties.map((faculty) => ({
    label: `${faculty.name}${faculty.code ? ` (${faculty.code})` : ''}`,
    value: faculty.id,
  }));
});

// Pagination configuration
const paginationConfig = computed(() => {
  const data = tableData.value;
  const pageSize = 15;

  return {
    page: 1,
    pageSize: pageSize,
    pageCount: Math.ceil(data.length / pageSize) || 1,
    itemCount: data.length,
    showSizePicker: true,
    pageSizes: [10, 15, 25, 50],
    prefix: ({ itemCount }: { itemCount: number }) => `Total: ${itemCount}`,
    onChange: (page: number) => {
      // Could implement client-side pagination if needed
    },
    onUpdatePageSize: (pageSize: number) => {
      // Could implement client-side page size changes if needed
    },
  };
});

// Create a debounced search function
const debouncedSearch = debounce(async () => {
  if (canCreateDepartment.value) {
    if (searchQuery.value.length > 2 || searchQuery.value === '') {
      await departmentStore.searchDepartments(
        searchQuery.value,
        selectedFaculty.value
      );
    }
  }
}, 500);

// Watch for changes to searchQuery
watch(searchQuery, () => {
  debouncedSearch();
});

// Show hierarchy logic
const showHierarchy = computed(() => {
  return !canCreateDepartment.value;
});

// Hierarchy data for the component
const hierarchyData = computed<HierarchyLevel[]>(() => [
  {
    id: 'university',
    title: 'University Configuration',
    description: 'Main educational institution setup and activation',
    icon: 'ph:building',
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
    isActive:
      !!universityStore.activeUniversity?.id &&
      facultyStore.faculties.length === 0,
    count: facultyStore.faculties.length,
    actionRequired:
      !!universityStore.activeUniversity?.id &&
      facultyStore.faculties.length === 0,
    navigateTo: '/academic/faculties',
    actionText: 'Configure Faculties',
  },
  {
    id: 'departments',
    title: 'Department Organization',
    description: 'Academic and administrative department structure',
    icon: 'ph:office-chair',
    isCompleted: departmentStore.departments.length > 0,
    isActive:
      canCreateDepartment.value && departmentStore.departments.length === 0,
    count: departmentStore.departments.length,
    actionRequired: false, // This is the current page
  },
]);

// Global action for when prerequisites aren't met
const globalActionConfig = computed(() => {
  if (!universityStore.activeUniversity?.id) {
    return {
      text: 'Setup University',
      icon: 'ph:building',
      type: 'primary' as const,
      disabled: false,
    };
  }
  if (!hasFaculties.value) {
    return {
      text: 'Configure Faculties',
      icon: 'ph:buildings',
      type: 'primary' as const,
      disabled: false,
    };
  }
  return undefined;
});

// Department form
const departmentForm = ref<Partial<Department>>({});

// Status and type mappings
const statusTypeMap = {
  [DepartmentStatus.Active]: 'success',
  [DepartmentStatus.Inactive]: 'error',
  [DepartmentStatus.UnderReview]: 'warning',
  [DepartmentStatus.Restructuring]: 'info',
} as const;

const statusLabelMap = {
  [DepartmentStatus.Active]: 'Active',
  [DepartmentStatus.Inactive]: 'Inactive',
  [DepartmentStatus.UnderReview]: 'Under Review',
  [DepartmentStatus.Restructuring]: 'Restructuring',
} as const;

const typeLabelMap = {
  [DepartmentType.Academic]: 'Academic',
  [DepartmentType.Research]: 'Research',
  [DepartmentType.Administrative]: 'Administrative',
  [DepartmentType.Support]: 'Support',
} as const;

// Table columns
const departmentColumns = [
  {
    title: 'Department',
    key: 'department',
    width: 200,
    render(row: Department) {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(
          'div',
          {
            class:
              'w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center',
          },
          [h(Icon, { name: 'ph:office-chair', class: 'text-primary' })]
        ),
        h('div', {}, [
          h('div', { class: 'font-medium' }, row.name || '-'),
          h('div', { class: 'text-xs text-text-secondary' }, row.code || '-'),
        ]),
      ]);
    },
  },
  {
    title: 'Faculty',
    key: 'facultyId',
    width: 180,
    ellipsis: {
      tooltip: true,
    },
    render(row: Department) {
      return h('span', {}, getFacultyName(row.facultyId));
    },
  },
  {
    title: 'Type',
    key: 'type',
    width: 120,
    render(row: Department) {
      return h('span', {}, getDepartmentTypeLabel(row.type));
    },
  },
  {
    title: 'Status',
    key: 'status',
    width: 120,
    render(row: Department) {
      return h(
        NTag,
        {
          type: getStatusType(row.status),
          size: 'small',
          bordered: false,
        },
        { default: () => getDepartmentStatusLabel(row.status) }
      );
    },
  },
  {
    title: 'Location',
    key: 'location',
    width: 150,
    ellipsis: {
      tooltip: true,
    },
    render(row: Department) {
      return h('span', {}, row.location || '-');
    },
  },
  {
    title: 'Contact',
    key: 'contact',
    width: 180,
    ellipsis: {
      tooltip: true,
    },
    render(row: Department) {
      return h('span', {}, row.contactEmail || '-');
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 160,
    render(row: Department) {
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
                  openDepartmentDetail(row);
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
                  openEditModal(row);
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
];

// Event handlers for search
function handleSearchUpdate(value: string) {
  searchQuery.value = value;
}

async function handleSearch() {
  if (!canCreateDepartment.value) return;

  await departmentStore.searchDepartments(
    searchQuery.value,
    selectedFaculty.value
  );
}

async function handleClearSearch() {
  searchQuery.value = '';
  selectedFaculty.value = null;
  departmentStore.clearSearch();
  departmentStore.setFacultyFilter(null);
  await departmentStore.fetchDepartments(null);
}

async function handleFacultyFilterChange(facultyId: string | null) {
  selectedFaculty.value = facultyId;
  departmentStore.setFacultyFilter(facultyId);

  if (searchQuery.value) {
    await departmentStore.searchDepartments(searchQuery.value, facultyId);
  } else {
    await departmentStore.fetchDepartments(facultyId);
  }
}

function handleAddDepartmentClick() {
  if (!canCreateDepartment.value) {
    message.warning('You need to have at least one faculty first.');
    return;
  }

  editingDepartment.value = null;
  departmentForm.value = {
    facultyId: selectedFaculty.value || '',
  };
  showDepartmentModal.value = true;
}

function openDepartmentDetail(department: Department) {
  selectedDepartment.value = department;
  showDetailModal.value = true;
}

function openEditModal(department: Department) {
  editingDepartment.value = department;
  selectedDepartment.value = department;
  departmentForm.value = { ...department };
  showDetailModal.value = false;
  showDepartmentModal.value = true;
}

function handleCancelDepartment() {
  showDepartmentModal.value = false;
  editingDepartment.value = null;
  departmentForm.value = {};
}

function handleDeleteItem(department: Department) {
  itemToDelete.value = department;
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    await departmentStore.deleteDepartment(itemToDelete.value.id);
    message.success('Department deleted successfully');
  } catch (error: any) {
    message.error('Error deleting department: ' + error.message);
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
}

function cancelDelete() {
  showDeleteConfirm.value = false;
  itemToDelete.value = null;
}

async function handleSubmitDepartment(validatedData: any) {
  try {
    submittingDepartment.value = true;

    if (editingDepartment.value) {
      await departmentStore.updateDepartment(
        editingDepartment.value.id,
        validatedData
      );
      message.success('Department updated successfully');
    } else {
      await departmentStore.createDepartment(validatedData);
      message.success('Department created successfully');
    }

    showDepartmentModal.value = false;
  } catch (error: any) {
    message.error(
      `Failed to ${editingDepartment.value ? 'update' : 'create'} department: ${error.message}`
    );
  } finally {
    submittingDepartment.value = false;
  }
}

// Helper functions
function getFacultyName(facultyId: string): string {
  const faculty = facultyStore.faculties.find((f) => f.id === facultyId);
  return faculty?.name || 'Unknown Faculty';
}

function getDepartmentStatusLabel(status: string): string {
  return statusLabelMap[status as DepartmentStatus] || status;
}

function getDepartmentTypeLabel(type: string): string {
  return typeLabelMap[type as DepartmentType] || type;
}

function getStatusType(
  status: string
): 'success' | 'error' | 'warning' | 'info' | 'default' {
  return statusTypeMap[status as DepartmentStatus] || 'default';
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
  if (!universityStore.activeUniversity?.id) {
    router.push('/institutions/universities');
  } else {
    router.push('/academic/faculties');
  }
}

// Initialize data
onMounted(async () => {
  if (!academicStore.initialized) {
    await academicStore.initializeStore();
  }

  // Fetch faculties if they're not already loaded
  if (facultyStore.faculties.length === 0) {
    const universityId =
      universityStore.activeUniversity?.id ||
      institutionStore.activeInstitution?.id;
    if (universityId) {
      await facultyStore.fetchFacultiesByUniversity(universityId);
    }
  }

  // Fetch departments
  await departmentStore.fetchDepartments();

  // Set faculty filter if there's only one faculty
  if (facultyStore.faculties.length === 1) {
    selectedFaculty.value = facultyStore.faculties[0].id;
    departmentStore.setFacultyFilter(selectedFaculty.value);
  }
});

// Watch for faculty changes to refetch departments
watch(
  () => facultyStore.faculties.length,
  async (newLength) => {
    if (newLength > 0 && departmentStore.departments.length === 0) {
      await departmentStore.fetchDepartments();
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
