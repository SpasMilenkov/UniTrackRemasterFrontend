<!-- components/academic/MajorsTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Major Header with actions -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white"
        >
          <Icon name="ph:graduation-cap" class="text-xl" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-text-primary m-0">
            Major Management
          </h2>
          <p class="text-sm text-text-secondary mt-1">
            Define academic programs and degree specializations
          </p>
        </div>
      </div>
      <n-button
        type="primary"
        :disabled="!canCreateMajor"
        size="large"
        @click="handleAddMajorClick"
      >
        <template #icon>
          <Icon name="ph:plus" />
        </template>
        Add Major
      </n-button>
    </div>

    <!-- Prerequisites Warning -->
    <n-alert v-if="!canCreateMajor" type="warning" class="mb-6">
      <template #icon>
        <Icon name="ph:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">Before managing majors:</div>
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
      title="Major Management Prerequisites"
      title-icon="ph:graduation-cap"
      :global-action="!canCreateMajor ? globalActionConfig : undefined"
      class="mb-8"
      @level-click="handleHierarchyLevelClick"
      @action-click="handleHierarchyActionClick"
      @global-action="navigateToPrerequisite"
    />

    <!-- Major Search - Only show when majors can be managed -->
    <div v-if="canCreateMajor" class="mb-6">
      <n-input-group>
        <n-input
          v-model:value="searchQuery"
          placeholder="Search by major name, code, or description..."
          clearable
          @update:value="handleSearchUpdate"
        >
          <template #prefix>
            <Icon name="ph:magnifying-glass" />
          </template>
        </n-input>
        <n-button
          :loading="majorStore.searchLoading"
          type="primary"
          ghost
          @click="handleMajorSearch"
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
            <Icon name="ph:x" />
          </template>
          Clear
        </n-button>
      </n-input-group>

      <!-- Faculty filter -->
      <div class="mt-3">
        <n-select
          v-model:value="selectedFaculty"
          placeholder="Filter by Faculty"
          clearable
          :options="facultyStore.facultyOptions"
          @update:value="handleFacultyFilterChange"
        />
      </div>

      <!-- Search tips -->
      <div class="text-text-secondary text-xs mt-2">
        <p>
          Search by: major name, major code, description. Example: "computer
          science", "CS-101", "software engineering"
        </p>
      </div>
    </div>

    <!-- Majors Data Table -->
    <div
      v-if="canCreateMajor"
      class="bg-background-card rounded-xl shadow-sm border border-border overflow-hidden"
    >
      <n-data-table
        ref="majorTable"
        :columns="majorColumns"
        :data="majorStore.filteredMajors"
        :loading="majorStore.loadingMajors || majorStore.searchLoading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        :scroll-x="1200"
        class="min-h-[400px]"
        @update:page="handlePageChange"
      >
        <template #empty>
          <div class="text-center py-12">
            <Icon
              name="ph:graduation-cap"
              class="text-6xl text-text-secondary mb-4 mx-auto"
            />
            <h3 class="text-lg font-medium text-text-primary mb-2">
              No majors found
            </h3>
            <p class="text-text-secondary mb-4">
              {{
                searchQuery
                  ? `No results for "${searchQuery}"`
                  : 'Get started by creating your first major program'
              }}
            </p>
            <n-button
              v-if="!searchQuery"
              type="primary"
              @click="handleAddMajorClick"
            >
              <template #icon>
                <Icon name="ph:plus" />
              </template>
              Create Major
            </n-button>
          </div>
        </template>
      </n-data-table>
    </div>

    <!-- Major Modal -->
    <n-modal
      v-model:show="showMajorModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      :title="editingMajor ? 'Edit Major' : 'Create New Major'"
      :closable="!submittingMajor"
      :mask-closable="!submittingMajor"
    >
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <MajorForm
          :loading="submittingMajor"
          :initial-values="majorForm"
          :is-editing="!!editingMajor"
          :faculties="facultyStore.faculties"
          @submit="handleSubmitMajor"
          @cancel="showMajorModal = false"
        />
      </div>
    </n-modal>

    <!-- Major Detail Modal -->
    <n-modal
      v-model:show="showDetailModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      title="Major Details"
    >
      <div v-if="selectedMajor" class="max-h-[70vh] overflow-y-auto pr-2">
        <div class="mb-4">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-semibold text-text-primary">
                {{ selectedMajor.name }}
              </h2>
              <p
                v-if="selectedMajor.code"
                class="text-text-secondary text-sm mt-1"
              >
                Code: {{ selectedMajor.code }}
              </p>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">Faculty</h3>
          <p class="text-text-secondary">
            {{ getFacultyName(selectedMajor.facultyId) }}
          </p>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">Duration</h3>
          <p class="text-text-secondary">
            {{ selectedMajor.durationInYears }} years
          </p>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">Credits Required</h3>
          <p class="text-text-secondary">
            {{ selectedMajor.requiredCredits }} credits
          </p>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">Short Description</h3>
          <p class="text-text-secondary">
            {{
              selectedMajor.shortDescription || 'No short description provided'
            }}
          </p>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">
            Detailed Description
          </h3>
          <p class="text-text-secondary">
            {{
              selectedMajor.detailedDescription ||
              'No detailed description provided'
            }}
          </p>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">
            Career Opportunities
          </h3>
          <p class="text-text-secondary">
            {{
              selectedMajor.careerOpportunities ||
              'No career opportunities information provided'
            }}
          </p>
        </div>

        <div class="mb-4">
          <h3 class="font-medium text-text-primary mb-1">
            Admission Requirements
          </h3>
          <p class="text-text-secondary">
            {{
              selectedMajor.admissionRequirements ||
              'No admission requirements specified'
            }}
          </p>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <n-button type="default" @click="showDetailModal = false">
            Close
          </n-button>
          <n-button type="primary" @click="openEditModal(selectedMajor)">
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
      v-model:show="showDeleteModal"
      preset="dialog"
      type="error"
      title="Confirm Major Deletion"
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="deleteSelectedMajor"
      @negative-click="cancelDelete"
    >
      <template #icon>
        <Icon name="ph:warning-diamond" class="text-red-500" />
      </template>
      <div class="py-2">
        <p class="mb-4">
          Are you sure you want to delete the major "{{ selectedMajor?.name }}"?
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
  useMessage,
} from 'naive-ui';
import { Icon } from '#components';
import { useAcademicStore } from '~/stores/academic';
import { useMajorStore, type Major } from '~/stores/major';
import { useFacultyStore } from '~/stores/faculty';
import { useInstitutionStore } from '~/stores/institution';
import { useUniversityStore } from '~/stores/university';
import AcademicHierarchy, {
  type HierarchyLevel,
} from '~/components/common/AcademicHierarchy.vue';
import { debounce } from 'lodash';
import MajorForm from './forms/MajorForm.vue';

// Router for navigation
const router = useRouter();

// Stores and utilities
const academicStore = useAcademicStore();
const majorStore = useMajorStore();
const facultyStore = useFacultyStore();
const institutionStore = useInstitutionStore();
const universityStore = useUniversityStore();
const message = useMessage();

// Local state for search
const searchQuery = ref('');
const selectedFaculty = ref(null);

// State for modals and forms
const showMajorModal = ref(false);
const showDetailModal = ref(false);
const showDeleteModal = ref(false);
const submittingMajor = ref(false);
const editingMajor = ref<Major | null>(null);
const selectedMajor = ref<Major | null>(null);

// Prerequisites checks
const hasFaculties = computed(() => facultyStore.faculties.length > 0);

// Computed property to determine if majors can be created
const canCreateMajor = computed(() => {
  return facultyStore.faculties.length > 0;
});

// Show hierarchy logic
const showHierarchy = computed(() => {
  return !canCreateMajor.value;
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
    id: 'majors',
    title: 'Major Programs',
    description: 'Academic degree programs and specializations',
    icon: 'ph:graduation-cap',
    isCompleted: majorStore.majors.length > 0,
    isActive: canCreateMajor.value && majorStore.majors.length === 0,
    count: majorStore.majors.length,
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

// Pagination settings
const pagination = ref({
  page: 1,
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [10, 15, 25, 50],
  onChange: (page: number) => {
    pagination.value.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize;
    pagination.value.page = 1;
  },
});

// Major form
const majorForm = ref({
  name: '',
  code: '',
  shortDescription: '',
  detailedDescription: '',
  requiredCredits: 120,
  durationInYears: 4,
  careerOpportunities: '',
  admissionRequirements: '',
  facultyId: '',
});

// Create a debounced search function
const debouncedSearch = debounce(async () => {
  if (canCreateMajor.value) {
    await majorStore.searchMajors(searchQuery.value, selectedFaculty.value);
  }
}, 500);

// Watch for changes to searchQuery
watch(searchQuery, () => {
  if (searchQuery.value.length > 2 || searchQuery.value === '') {
    debouncedSearch();
  }
});

// Table columns
const majorColumns = [
  {
    title: 'Major',
    key: 'major',
    width: 200,
    render(row: Major) {
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
          h('div', { class: 'text-xs text-text-secondary' }, row.code || '-'),
        ]),
      ]);
    },
  },
  {
    title: 'Faculty',
    key: 'facultyId',
    width: 180,
    render(row: Major) {
      return getFacultyName(row.facultyId);
    },
  },
  {
    title: 'Duration',
    key: 'durationInYears',
    width: 100,
    render(row: Major) {
      return h(
        'div',
        { class: 'text-center font-medium' },
        `${row.durationInYears} years`
      );
    },
    sorter: (a: Major, b: Major) => a.durationInYears - b.durationInYears,
  },
  {
    title: 'Credits',
    key: 'requiredCredits',
    width: 100,
    render(row: Major) {
      return h(
        'div',
        { class: 'text-center font-medium' },
        row.requiredCredits
      );
    },
    sorter: (a: Major, b: Major) => a.requiredCredits - b.requiredCredits,
  },
  {
    title: 'Students',
    key: 'studentCount',
    width: 100,
    render(row: Major) {
      return h(
        'div',
        { class: 'text-center font-medium' },
        row.studentCount || '0'
      );
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 160,
    render(row: Major) {
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
                onClick: () => openMajorDetail(row),
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
                onClick: () => openEditModal(row),
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
                onClick: () => confirmDelete(row),
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
function navigateToFaculties() {
  router.push('/academic/faculties');
}

function navigateToPrerequisite() {
  if (!universityStore.activeUniversity?.id) {
    router.push('/institutions/universities');
  } else {
    navigateToFaculties();
  }
}

// Event handlers for search
function handleSearchUpdate(value: string) {
  searchQuery.value = value;
}

function handleMajorSearch() {
  majorStore.searchMajors(searchQuery.value, selectedFaculty.value);
}

function handleClearSearch() {
  searchQuery.value = '';
  majorStore.clearSearch();
  majorStore.fetchMajors(selectedFaculty.value);
}

function handleFacultyFilterChange(facultyId: string | null) {
  majorStore.setFacultyFilter(facultyId);
  if (searchQuery.value) {
    majorStore.searchMajors(searchQuery.value, facultyId);
  } else {
    majorStore.fetchMajors(facultyId);
  }
}

// Other event handlers
function handlePageChange(page: number) {
  pagination.value.page = page;
}

function handleAddMajorClick() {
  if (canCreateMajor.value) {
    resetMajorForm();

    // If a faculty is selected in the filter, pre-select it in the form
    if (selectedFaculty.value) {
      majorForm.value.facultyId = selectedFaculty.value;
    } else if (facultyStore.faculties.length === 1) {
      // If there's only one faculty, pre-select it
      majorForm.value.facultyId = facultyStore.faculties[0].id;
    }

    showMajorModal.value = true;
  } else {
    message.warning('You need to have at least one faculty first.');
  }
}

function openMajorDetail(major: Major) {
  selectedMajor.value = major;
  showDetailModal.value = true;
}

function openEditModal(major: Major) {
  editingMajor.value = major;
  selectedMajor.value = major;

  majorForm.value = {
    name: major.name || '',
    code: major.code || '',
    shortDescription: major.shortDescription || '',
    detailedDescription: major.detailedDescription || '',
    requiredCredits: major.requiredCredits,
    durationInYears: major.durationInYears,
    careerOpportunities: major.careerOpportunities || '',
    admissionRequirements: major.admissionRequirements || '',
    facultyId: major.facultyId,
  };

  showDetailModal.value = false;
  showMajorModal.value = true;
}

function confirmDelete(major: Major) {
  selectedMajor.value = major;
  showDeleteModal.value = true;
}

function cancelDelete() {
  showDeleteModal.value = false;
  selectedMajor.value = null;
}

async function deleteSelectedMajor() {
  if (!selectedMajor.value) return;

  try {
    await majorStore.deleteMajor(selectedMajor.value.id);
    message.success('Major deleted successfully');
  } catch (error: any) {
    message.error('Error deleting major: ' + error.message);
  } finally {
    showDeleteModal.value = false;
    selectedMajor.value = null;
  }
}

async function handleSubmitMajor(validatedData: any) {
  try {
    submittingMajor.value = true;

    if (editingMajor.value) {
      await majorStore.updateMajor(editingMajor.value.id, validatedData);
      message.success('Major updated successfully');
    } else {
      await majorStore.createMajor(validatedData);
      message.success('Major created successfully');
    }

    showMajorModal.value = false;
    resetMajorForm();
  } catch (error: any) {
    message.error(
      `Failed to ${editingMajor.value ? 'update' : 'create'} major: ${error.message}`
    );
  } finally {
    submittingMajor.value = false;
  }
}

function resetMajorForm() {
  majorForm.value = {
    name: '',
    code: '',
    shortDescription: '',
    detailedDescription: '',
    requiredCredits: 120,
    durationInYears: 4,
    careerOpportunities: '',
    admissionRequirements: '',
    facultyId: selectedFaculty.value || '',
  };
  editingMajor.value = null;
}

function getFacultyName(facultyId: string): string {
  const faculty = facultyStore.faculties.find((f) => f.id === facultyId);
  return faculty ? faculty.name : 'Unknown Faculty';
}

// Initialize data
onMounted(async () => {
  if (!academicStore.initialized) {
    await academicStore.initializeStore();
  }

  // Fetch faculties if they're not already loaded
  if (facultyStore.faculties.length === 0) {
    await facultyStore.fetchFacultiesByUniversity(
      universityStore.activeUniversity?.id
    );
  }

  // Fetch majors
  await majorStore.fetchMajors();

  // Set faculty filter if there's only one faculty
  if (facultyStore.faculties.length === 1) {
    selectedFaculty.value = facultyStore.faculties[0].id;
    majorStore.setFacultyFilter(selectedFaculty.value);
  }
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
