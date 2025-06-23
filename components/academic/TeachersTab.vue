<!-- components/academic/TeachersTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Header with Institution Context -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white"
        >
          <Icon name="ph:chalkboard-teacher" class="text-xl" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-text-primary m-0">
            {{ isHigherEducationComputed ? 'Faculty' : 'Teacher' }} Management
          </h2>
          <p class="text-sm text-text-secondary mt-1">
            Manage {{ institutionTypeLabel.toLowerCase() }}
            {{ isHigherEducationComputed ? 'faculty members' : 'teachers' }} and
            assignments
          </p>
        </div>
      </div>
      <!-- Institution Type Indicator & Actions -->
      <div class="flex items-center gap-3">
        <n-tag
          :type="isHigherEducationComputed ? 'info' : 'success'"
          size="medium"
          class="flex-shrink-0"
        >
          <Icon
            :name="
              isHigherEducationComputed
                ? 'ph:university'
                : 'ph:chalkboard-teacher'
            "
            class="mr-1"
          />
          {{ institutionTypeLabel }}
        </n-tag>

        <n-button
          type="primary"
          :disabled="!canCreateTeacher"
          size="large"
          @click="handleAddTeacherClick"
        >
          <template #icon>
            <Icon name="ph:user-plus" />
          </template>
          Add {{ isHigherEducationComputed ? 'Faculty' : 'Teacher' }}
        </n-button>
      </div>
    </div>

    <!-- Prerequisites Warning -->
    <n-alert v-if="!canCreateTeacher" type="warning" class="mb-6">
      <template #icon>
        <Icon name="ph:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">
          Before adding
          {{ isHigherEducationComputed ? 'faculty' : 'teachers' }}:
        </div>
        <div v-if="!hasActiveInstitution" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span> You need to have an active institution selected </span>
        </div>
      </div>
    </n-alert>

    <!-- Teacher Categories Tabs -->
    <n-tabs
      v-if="canCreateTeacher"
      v-model:value="activeTab"
      type="line"
      animated
      size="large"
      class="mb-6"
      @update:value="handleTabChange"
    >
      <n-tab-pane name="all" tab="All Teachers">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:users" />
            All {{ isHigherEducationComputed ? 'Faculty' : 'Teachers' }}
            <n-badge
              v-if="paginationMetadata && paginationMetadata.totalCount > 0"
              :value="paginationMetadata.totalCount"
              type="info"
              :max="999"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane
        v-if="isHigherEducationComputed"
        name="byDepartment"
        tab="By Department"
      >
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:buildings" />
            By Department
            <n-badge
              v-if="departmentOptions.length > 0"
              :value="departmentOptions.length"
              type="warning"
              :max="99"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane v-else name="byGrade" tab="By Homeroom">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:graduation-cap" />
            By Homeroom
            <n-badge
              v-if="gradeOptions.length > 0"
              :value="gradeOptions.length"
              type="warning"
              :max="99"
            />
          </div>
        </template>
      </n-tab-pane>
    </n-tabs>

    <!-- Search and Filters -->
    <div v-if="canCreateTeacher" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Search Input -->
        <n-input-group>
          <n-input
            v-model:value="searchQuery"
            placeholder="Search by name, email, or title..."
            clearable
            @update:value="handleSearchUpdate"
            @keydown.enter="handleTeacherSearch"
          >
            <template #prefix>
              <Icon name="ph:magnifying-glass" />
            </template>
          </n-input>
          <n-button
            :loading="isLoadingTeachers"
            type="primary"
            ghost
            @click="handleTeacherSearch"
          >
            Search
          </n-button>
        </n-input-group>

        <!-- Department/Grade Filter -->
        <n-select
          v-model:value="filterValue"
          :placeholder="
            isHigherEducationComputed
              ? 'Filter by department'
              : 'Filter by homeroom'
          "
          :options="filterOptions"
          clearable
          @update:value="handleFilterChange"
        >
          <template #prefix>
            <Icon name="ph:funnel" />
          </template>
        </n-select>

        <!-- Sort Options -->
        <n-select
          v-model:value="sortBy"
          placeholder="Sort by..."
          :options="sortOptions"
          @update:value="handleSortChange"
        >
          <template #prefix>
            <Icon name="ph:sort-ascending" />
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
              <Icon name="ph:x" />
            </template>
            Clear Filters
          </n-button>
        </div>

        <div class="flex items-center gap-2">
          <n-button
            size="small"
            :disabled="!paginationMetadata?.totalCount"
            @click="handleExportTeachers"
          >
            <template #icon>
              <Icon name="ph:download" />
            </template>
            Export
          </n-button>

          <n-button
            v-if="isHigherEducationComputed"
            size="small"
            :disabled="!paginationMetadata?.totalCount"
            @click="handleBulkAssignment"
          >
            <template #icon>
              <Icon name="ph:users-three" />
            </template>
            Bulk Assign
          </n-button>
        </div>
      </div>
    </div>

    <!-- Teachers Data Table -->
    <div
      v-if="canCreateTeacher"
      class="bg-background-card rounded-xl shadow-sm border border-border overflow-hidden"
    >
      <n-data-table
        ref="teachersTable"
        :columns="teacherColumns"
        :data="currentTeachers"
        :loading="isLoadingTeachers"
        :pagination="paginationConfig"
        :row-key="(row) => row.id"
        :scroll-x="1200"
        class="min-h-[400px]"
        remote
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      >
        <template #empty>
          <div class="text-center py-12">
            <Icon
              name="ph:chalkboard-teacher"
              class="text-6xl text-text-secondary mb-4 mx-auto"
            />
            <h3 class="text-lg font-medium text-text-primary mb-2">
              No {{ isHigherEducationComputed ? 'faculty' : 'teachers' }} found
            </h3>
            <p class="text-text-secondary mb-4">
              {{
                hasActiveFilters
                  ? `No results found for your search criteria`
                  : `Get started by adding your first ${isHigherEducationComputed ? 'faculty member' : 'teacher'}`
              }}
            </p>
            <n-button
              v-if="!hasActiveFilters"
              type="primary"
              @click="handleAddTeacherClick"
            >
              <template #icon>
                <Icon name="ph:user-plus" />
              </template>
              Add {{ isHigherEducationComputed ? 'Faculty' : 'Teacher' }}
            </n-button>
          </div>
        </template>
      </n-data-table>
    </div>

    <!-- Teacher Form Modal -->
    <n-modal
      v-model:show="showTeacherModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      :title="
        editingTeacher
          ? `Edit ${isHigherEducationComputed ? 'Faculty Member' : 'Teacher'}`
          : `Create New ${isHigherEducationComputed ? 'Faculty Member' : 'Teacher'}`
      "
      :closable="!submittingTeacher"
      :mask-closable="!submittingTeacher"
    >
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <TeacherForm
          :loading="submittingTeacher"
          :initial-values="teacherForm"
          :is-editing="!!editingTeacher"
          @submit="handleSubmitTeacher"
          @cancel="handleCancelTeacher"
        />
      </div>
    </n-modal>

    <!-- Delete Confirmation Dialog -->
    <n-modal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      type="error"
      title="Confirm Teacher Deletion"
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
          Are you sure you want to delete the
          {{ isHigherEducationComputed ? 'faculty member' : 'teacher' }}
          <strong
            >"{{ itemToDelete?.firstName }}
            {{ itemToDelete?.lastName }}"</strong
          >?
        </p>

        <n-alert type="error" class="mb-4" title="Permanent Action">
          This action cannot be undone. All related
          {{
            isHigherEducationComputed
              ? 'course assignments'
              : 'class assignments'
          }}, grades, and attendance records associated with this
          {{ isHigherEducationComputed ? 'faculty member' : 'teacher' }}
          will also be affected.
        </n-alert>
      </div>
    </n-modal>

    <!-- Teacher Detail Modal -->
    <n-modal
      v-model:show="showTeacherDetail"
      preset="card"
      style="width: 70rem"
      :title="`${selectedTeacherDetail?.firstName} ${selectedTeacherDetail?.lastName} - ${isHigherEducationComputed ? 'Faculty' : 'Teacher'} Profile`"
    >
      <div
        v-if="selectedTeacherDetail"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <!-- Basic Information -->
        <n-card title="Basic Information" class="col-span-full md:col-span-1">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-text-secondary">
                {{ isHigherEducationComputed ? 'Faculty' : 'Employee' }} ID:
              </span>
              <span class="font-medium">{{ selectedTeacherDetail.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Email:</span>
              <span class="font-medium">{{ selectedTeacherDetail.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Title:</span>
              <span class="font-medium">{{
                selectedTeacherDetail.title || 'N/A'
              }}</span>
            </div>
            <div v-if="isHigherEducationComputed" class="flex justify-between">
              <span class="text-text-secondary">Department:</span>
              <span class="font-medium">{{
                getDepartmentName(selectedTeacherDetail.departmentId) ||
                'Unassigned'
              }}</span>
            </div>
            <div v-else class="flex justify-between">
              <span class="text-text-secondary">Homeroom Class:</span>
              <span class="font-medium">{{
                getGradeName(selectedTeacherDetail.classGradeId) || 'None'
              }}</span>
            </div>
          </div>
        </n-card>

        <!-- Academic Information -->
        <n-card
          :title="
            isHigherEducationComputed ? 'Academic Details' : 'Teaching Details'
          "
          class="col-span-full md:col-span-1"
        >
          <div class="space-y-3">
            <div
              v-if="selectedTeacherDetail.subjects?.length"
              class="flex justify-between"
            >
              <span class="text-text-secondary">
                {{
                  isHigherEducationComputed ? 'Courses' : 'Subjects'
                }}
                Teaching:
              </span>
              <span class="font-medium">{{
                selectedTeacherDetail.subjects.length
              }}</span>
            </div>
            <div
              v-if="selectedTeacherDetail.students?.length"
              class="flex justify-between"
            >
              <span class="text-text-secondary">Total Students:</span>
              <span class="font-medium">{{
                selectedTeacherDetail.students.length
              }}</span>
            </div>
            <div
              v-if="selectedTeacherDetail.marksGiven"
              class="flex justify-between"
            >
              <span class="text-text-secondary">Grades Given:</span>
              <span class="font-medium">{{
                selectedTeacherDetail.marksGiven
              }}</span>
            </div>
            <div
              v-if="selectedTeacherDetail.attendanceRecords"
              class="flex justify-between"
            >
              <span class="text-text-secondary">Attendance Records:</span>
              <span class="font-medium">{{
                selectedTeacherDetail.attendanceRecords
              }}</span>
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
} from 'naive-ui';
import { Icon } from '#components';
import { useAcademicStore } from '@/stores/academic';
import {
  useTeacherStore,
  type TeacherResponseDto as Teacher,
} from '~/stores/teacher';
import { useInstitutionStore } from '~/stores/institution';
import { useGradeStore } from '~/stores/grade';
import { useDepartmentStore } from '~/stores/department';
import { isHigherEducation as checkIsHigherEducation } from '~/utils/institution-helper';
import { debounce } from 'lodash';
import TeacherForm from './forms/TeacherForm.vue';

// Stores and utilities
const academicStore = useAcademicStore();
const teacherStore = useTeacherStore();
const institutionStore = useInstitutionStore();
const gradeStore = useGradeStore();
const departmentStore = useDepartmentStore();
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

// Search and pagination state
const searchParams = ref({
  pageNumber: 1,
  pageSize: 20,
  sortBy: 'firstName',
  ascending: true,
});

// Local state for search and filters
const searchQuery = ref('');
const filterValue = ref<string | null>(null);
const sortBy = ref('firstName');

// State for modals and forms
const showTeacherModal = ref(false);
const submittingTeacher = ref(false);
const editingTeacher = ref<Teacher | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<Teacher | null>(null);
const showTeacherDetail = ref(false);
const selectedTeacherDetail = ref<Teacher | null>(null);

// Teacher form state
const teacherForm = ref<Partial<Teacher>>({});

// Create computed reactive search parameters
const reactiveSearchParams = computed(() => {
  const params: any = {
    pageNumber: searchParams.value.pageNumber,
    pageSize: searchParams.value.pageSize,
    sortBy: searchParams.value.sortBy,
    ascending: searchParams.value.ascending,
  };

  if (searchQuery.value.trim()) {
    params.query = searchQuery.value.trim();
  }

  if (filterValue.value) {
    if (isHigherEducationComputed.value) {
      params.departmentId = filterValue.value;
    } else {
      params.classGradeId = filterValue.value;
    }
  }

  // Always include institution filter
  if (activeInstitution.value?.id) {
    params.institutionId = activeInstitution.value.id;
  }

  return params;
});

// Use the teachers query from the store
const teachersQuery = teacherStore.teachersByInstitutionQuery(
  computed(() => activeInstitution.value?.id || null)
);

// Extract reactive properties from the query
const teachersQueryData = computed(() => teachersQuery?.data.value);
const isLoadingTeachers = computed(() => teachersQuery?.isLoading.value);
const teachersQueryError = computed(() => teachersQuery?.error.value);

// Create a debounced search function
const debouncedSearch = debounce(async () => {
  if (canCreateTeacher.value) {
    await teachersQuery?.refetch();
  }
}, 500);

// Watch for changes to searchQuery
watch(searchQuery, () => {
  if (searchQuery.value.length > 2 || searchQuery.value === '') {
    debouncedSearch();
  }
});

// Computed properties for checking prerequisites
const hasActiveInstitution = computed(() => !!activeInstitution.value);

// Can create teacher when we have an active institution
const canCreateTeacher = computed(() => {
  return hasActiveInstitution.value;
});

// Current teachers from query data (with local filtering for search/filters)
const currentTeachers = computed(() => {
  let teachers = teachersQueryData.value || [];

  // Apply local search filtering
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    teachers = teachers.filter(
      (teacher) =>
        (teacher.firstName &&
          teacher.firstName.toLowerCase().includes(query)) ||
        (teacher.lastName && teacher.lastName.toLowerCase().includes(query)) ||
        (teacher.email && teacher.email.toLowerCase().includes(query)) ||
        (teacher.title && teacher.title.toLowerCase().includes(query))
    );
  }

  // Apply local filter
  if (filterValue.value) {
    if (isHigherEducationComputed.value) {
      teachers = teachers.filter(
        (teacher) => teacher.departmentId === filterValue.value
      );
    } else {
      teachers = teachers.filter(
        (teacher) => teacher.classGradeId === filterValue.value
      );
    }
  }

  // Apply local sorting
  teachers.sort((a, b) => {
    let aValue = '';
    let bValue = '';

    switch (sortBy.value) {
      case 'firstName':
        aValue = a.firstName || '';
        bValue = b.firstName || '';
        break;
      case 'lastName':
        aValue = a.lastName || '';
        bValue = b.lastName || '';
        break;
      case 'email':
        aValue = a.email || '';
        bValue = b.email || '';
        break;
      case 'title':
        aValue = a.title || '';
        bValue = b.title || '';
        break;
      default:
        aValue = a.firstName || '';
        bValue = b.firstName || '';
    }

    const result = aValue.localeCompare(bValue);
    return searchParams.value.ascending ? result : -result;
  });

  return teachers;
});

// Create pagination metadata from current teachers
const paginationMetadata = computed(() => {
  const totalCount = currentTeachers.value.length;
  const pageSize = searchParams.value.pageSize;
  const pageNumber = searchParams.value.pageNumber;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    totalCount,
    pageNumber,
    pageSize,
    totalPages,
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber < totalPages,
  };
});

// Check if there are active filters
const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || filterValue.value);
});

// Options for filters
const gradeOptions = computed(() => {
  return gradeStore.grades.map((grade) => ({
    label: grade.name || `Grade ${grade.id.substring(0, 4)}`,
    value: grade.id,
  }));
});

const departmentOptions = computed(() => {
  return departmentStore.departments.map((dept) => ({
    label: dept.name || `Department ${dept.id.substring(0, 4)}`,
    value: dept.id,
  }));
});

const filterOptions = computed(() => {
  return isHigherEducationComputed.value
    ? departmentOptions.value
    : gradeOptions.value;
});

const sortOptions = computed(() => [
  { label: 'First Name (A-Z)', value: 'firstName' },
  { label: 'Last Name (A-Z)', value: 'lastName' },
  { label: 'Email (A-Z)', value: 'email' },
  { label: 'Title (A-Z)', value: 'title' },
]);

// Pagination configuration for n-data-table
const paginationConfig = computed(() => {
  if (!paginationMetadata.value) {
    return false;
  }

  return {
    page: paginationMetadata.value.pageNumber,
    pageSize: paginationMetadata.value.pageSize,
    itemCount: paginationMetadata.value.totalCount,
    showSizePicker: true,
    pageSizes: [10, 20, 50, 100],
    showQuickJumper: true,
    prefix: (info: {
      startIndex: number;
      endIndex: number;
      page: number;
      pageSize: number;
      pageCount: number;
      itemCount: number | undefined;
    }) => `Total: ${info.itemCount ?? 0}`,
  };
});

// Format results text
function formatResultsText() {
  if (!paginationMetadata.value) return 'No teachers found';

  const { pageNumber, pageSize, totalCount } = paginationMetadata.value;
  const start = (pageNumber - 1) * pageSize + 1;
  const end = Math.min(pageNumber * pageSize, totalCount);

  return `Showing ${start}-${end} of ${totalCount} ${isHigherEducationComputed.value ? 'faculty members' : 'teachers'}`;
}

// Helper functions to get names from IDs
function getDepartmentName(departmentId: string | null | undefined) {
  if (!departmentId) return null;
  const dept = departmentStore.departments.find((d) => d.id === departmentId);
  return dept?.name || null;
}

function getGradeName(gradeId: string | null | undefined) {
  if (!gradeId) return null;
  const grade = gradeStore.grades.find((g) => g.id === gradeId);
  return grade?.name || null;
}

// Dynamic table columns based on institution type
const teacherColumns = computed(() => {
  const baseColumns = [
    {
      title: isHigherEducationComputed.value ? 'Faculty Member' : 'Teacher',
      key: 'name',
      width: 200,
      render(row: Teacher) {
        return h('div', { class: 'flex items-center gap-3' }, [
          h(
            'div',
            {
              class:
                'w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center',
            },
            [h(Icon, { name: 'ph:chalkboard-teacher', class: 'text-primary' })]
          ),
          h('div', {}, [
            h(
              'div',
              { class: 'font-medium' },
              `${row.firstName || ''} ${row.lastName || ''}`.trim()
            ),
            h(
              'div',
              { class: 'text-xs text-text-secondary' },
              row.email || '-'
            ),
          ]),
        ]);
      },
    },
    {
      title: 'Title',
      key: 'title',
      width: 120,
      render(row: Teacher) {
        return h(
          NTag,
          { type: 'info', size: 'small' },
          { default: () => row.title || 'N/A' }
        );
      },
    },
    {
      title: isHigherEducationComputed.value ? 'Department' : 'Homeroom',
      key: 'assignment',
      width: 160,
      render(row: Teacher) {
        if (isHigherEducationComputed.value) {
          const deptName = getDepartmentName(row.departmentId);
          return h(
            NTag,
            { type: deptName ? 'success' : 'warning', size: 'small' },
            { default: () => deptName || 'Unassigned' }
          );
        } else {
          const gradeName = getGradeName(row.classGradeId);
          return h(
            NTag,
            { type: gradeName ? 'success' : 'warning', size: 'small' },
            { default: () => gradeName || 'No Homeroom' }
          );
        }
      },
    },
    {
      title: 'Teaching Load',
      key: 'load',
      width: 140,
      render(row: Teacher) {
        const subjectCount = row.subjects?.length || 0;
        const studentCount = row.students?.length || 0;

        return h('div', { class: 'space-y-1' }, [
          h(
            'div',
            { class: 'text-xs text-text-secondary' },
            `${subjectCount} ${isHigherEducationComputed.value ? 'courses' : 'subjects'}`
          ),
          h(
            'div',
            { class: 'text-xs text-text-secondary' },
            `${studentCount} students`
          ),
        ]);
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render(row: Teacher) {
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
                viewTeacherDetail(row);
              },
            },
            { icon: () => h(Icon, { name: 'ph:eye' }) }
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
                handleEditTeacher(row);
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
        ];

        return h(
          NSpace,
          { justify: 'center', size: 'small' },
          { default: () => actions }
        );
      },
    },
  ];

  return baseColumns;
});

// Event handlers
function handleTabChange(tab: string) {
  activeTab.value = tab;
  searchQuery.value = '';
  resetFilters();
  searchParams.value.pageNumber = 1;
}

function resetFilters() {
  filterValue.value = null;
  sortBy.value = 'firstName';
  searchParams.value.sortBy = 'firstName';
  searchParams.value.ascending = true;
}

function handleSearchUpdate(value: string) {
  searchQuery.value = value;
}

function handleTeacherSearch() {
  searchParams.value.pageNumber = 1;
  teachersQuery?.refetch();
}

function handleFilterChange() {
  searchParams.value.pageNumber = 1;
}

function handleSortChange() {
  searchParams.value.sortBy = sortBy.value;
  searchParams.value.pageNumber = 1;
}

function handleClearAllFilters() {
  searchQuery.value = '';
  resetFilters();
  searchParams.value.pageNumber = 1;
}

function handlePageChange(page: number) {
  searchParams.value.pageNumber = page;
}

function handlePageSizeChange(pageSize: number) {
  searchParams.value.pageSize = pageSize;
  searchParams.value.pageNumber = 1;
}

function handleAddTeacherClick() {
  if (!canCreateTeacher.value) {
    message.warning('You need to have an active institution first.');
    return;
  }

  editingTeacher.value = null;
  teacherForm.value = {};
  showTeacherModal.value = true;
}

function handleEditTeacher(teacher: Teacher) {
  editingTeacher.value = teacher;
  teacherForm.value = { ...teacher };
  showTeacherModal.value = true;
}

function handleCancelTeacher() {
  showTeacherModal.value = false;
  editingTeacher.value = null;
  teacherForm.value = {};
}

function handleDeleteItem(teacher: Teacher) {
  itemToDelete.value = teacher;
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    await teacherStore.deleteTeacher(itemToDelete.value.id);
    message.success(
      `${isHigherEducationComputed.value ? 'Faculty member' : 'Teacher'} deleted successfully`
    );
    await teachersQuery?.refetch(); // Refresh the list
  } catch (error: any) {
    message.error(
      `Error deleting ${isHigherEducationComputed.value ? 'faculty member' : 'teacher'}: ` +
        error.message
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

async function handleSubmitTeacher(validatedData: any) {
  try {
    submittingTeacher.value = true;

    if (editingTeacher.value) {
      await teacherStore.updateTeacher(editingTeacher.value.id, validatedData);
      message.success(
        `${isHigherEducationComputed.value ? 'Faculty member' : 'Teacher'} updated successfully`
      );
    } else {
      await teacherStore.createTeacher(validatedData);
      message.success(
        `${isHigherEducationComputed.value ? 'Faculty member' : 'Teacher'} created successfully`
      );
    }

    showTeacherModal.value = false;
    await teachersQuery?.refetch(); // Refresh the list
  } catch (error: any) {
    message.error(
      `Failed to ${editingTeacher.value ? 'update' : 'create'} ${isHigherEducationComputed.value ? 'faculty member' : 'teacher'}: ${error.message}`
    );
  } finally {
    submittingTeacher.value = false;
  }
}

function viewTeacherDetail(teacher: Teacher) {
  selectedTeacherDetail.value = teacher;
  showTeacherDetail.value = true;
}

function handleExportTeachers() {
  // Implementation for exporting teachers data
  message.info('Export functionality coming soon');
}

function handleBulkAssignment() {
  // Implementation for bulk assignment to courses/departments
  message.info('Bulk assignment functionality coming soon');
}

// Function to load teachers based on current tab and filters
function loadTeachersBasedOnTab() {
  if (canCreateTeacher.value) {
    teachersQuery?.refetch();
  }
}

// Initialize data
onMounted(async () => {
  if (!academicStore.initialized) {
    await academicStore.initializeStore();
  }

  // Load dependent data for the current institution
  if (activeInstitution.value?.id) {
    if (isHigherEducationComputed.value) {
      await departmentStore.fetchDepartments();
    } else {
      await gradeStore.fetchGradesByInstitution(activeInstitution.value.id);
    }
  }

  // Initial load of teachers
  loadTeachersBasedOnTab();
});

// Watch for institution changes
watch(
  () => activeInstitution.value?.id,
  async (newInstitutionId) => {
    if (newInstitutionId) {
      // Reload dependent data when institution changes
      if (isHigherEducationComputed.value) {
        await departmentStore.fetchDepartments();
      } else {
        await gradeStore.fetchGradesByInstitution(newInstitutionId);
      }
      loadTeachersBasedOnTab();
    }
  }
);

// Watch for errors from the teachers query
watch(teachersQueryError, (error) => {
  if (error) {
    message.error(
      `Failed to load ${isHigherEducationComputed.value ? 'faculty' : 'teachers'}: ` +
        error.message
    );
  }
});
</script>
