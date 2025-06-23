<!-- components/academic/StudentsTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Header with Institution Context -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white"
        >
          <Icon name="ph:student" class="text-xl" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-text-primary m-0">
            Student Management
          </h2>
          <p class="text-sm text-text-secondary mt-1">
            Manage {{ institutionTypeLabel.toLowerCase() }} students and
            enrollment
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
            :name="isHigherEducationComputed ? 'ph:university' : 'ph:student'"
            class="mr-1"
          />
          {{ institutionTypeLabel }}
        </n-tag>

        <n-button
          type="primary"
          :disabled="!canCreateStudent"
          size="large"
          @click="handleAddStudentClick"
        >
          <template #icon>
            <Icon name="ph:user-plus" />
          </template>
          Add Student
        </n-button>
      </div>
    </div>

    <!-- Prerequisites Warning -->
    <n-alert v-if="!canCreateStudent" type="warning" class="mb-6">
      <template #icon>
        <Icon name="ph:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">Before adding students:</div>
        <div v-if="!hasActiveInstitution" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span> You need to have an active institution selected </span>
        </div>
        <div v-if="!hasGrades" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>
            Create at least one
            {{ isHigherEducationComputed ? 'class' : 'grade' }} level first
          </span>
        </div>
      </div>
    </n-alert>

    <!-- Academic Hierarchy -->
    <AcademicHierarchy
      v-if="showHierarchy"
      :hierarchy="hierarchyData"
      title="Student Management Prerequisites"
      title-icon="ph:student"
      :global-action="!canCreateStudent ? globalActionConfig : undefined"
      class="mb-8"
      @level-click="handleHierarchyLevelClick"
      @action-click="handleHierarchyActionClick"
      @global-action="navigateToPrerequisite"
    />

    <!-- Student Categories Tabs -->
    <n-tabs
      v-if="canCreateStudent"
      v-model:value="activeTab"
      type="line"
      animated
      size="large"
      class="mb-6"
      @update:value="handleTabChange"
    >
      <n-tab-pane name="all" tab="All Students">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:users" />
            All Students
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
        name="active"
        tab="Active Students"
      >
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:check-circle" />
            Active Students
            <n-badge
              v-if="activeStudentsCount > 0"
              :value="activeStudentsCount"
              type="success"
              :max="999"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane
        name="byGrade"
        :tab="`By ${isHigherEducationComputed ? 'Class' : 'Grade'}`"
      >
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:graduation-cap" />
            By {{ isHigherEducationComputed ? 'Class' : 'Grade' }}
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
    <div v-if="canCreateStudent" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Search Input -->
        <n-input-group>
          <n-input
            v-model:value="searchQuery"
            placeholder="Search by name or email..."
            clearable
            @update:value="handleSearchUpdate"
            @keydown.enter="handleStudentSearch"
          >
            <template #prefix>
              <Icon name="ph:magnifying-glass" />
            </template>
          </n-input>
          <n-button
            :loading="isLoadingStudents"
            type="primary"
            ghost
            @click="handleStudentSearch"
          >
            Search
          </n-button>
        </n-input-group>

        <!-- Grade Filter -->
        <n-select
          v-model:value="gradeFilter"
          :placeholder="`Filter by ${isHigherEducationComputed ? 'class' : 'grade'}`"
          :options="gradeOptions"
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
            @click="handleExportStudents"
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
            @click="handleBulkEnrollment"
          >
            <template #icon>
              <Icon name="ph:users-three" />
            </template>
            Bulk Enroll
          </n-button>
        </div>
      </div>
    </div>

    <!-- Students Data Table -->
    <div
      v-if="canCreateStudent"
      class="bg-background-card rounded-xl shadow-sm border border-border overflow-hidden"
    >
      <n-data-table
        ref="studentsTable"
        :columns="studentColumns"
        :data="currentStudents"
        :loading="isLoadingStudents"
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
              name="ph:user-plus"
              class="text-6xl text-text-secondary mb-4 mx-auto"
            />
            <h3 class="text-lg font-medium text-text-primary mb-2">
              No students found
            </h3>
            <p class="text-text-secondary mb-4">
              {{
                hasActiveFilters
                  ? `No results found for your search criteria`
                  : `Get started by adding your first student`
              }}
            </p>
            <n-button
              v-if="!hasActiveFilters"
              type="primary"
              @click="handleAddStudentClick"
            >
              <template #icon>
                <Icon name="ph:user-plus" />
              </template>
              Add Student
            </n-button>
          </div>
        </template>
      </n-data-table>
    </div>

    <!-- Student Form Modal -->
    <n-modal
      v-model:show="showStudentModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      :title="editingStudent ? 'Edit Student' : 'Create New Student'"
      :closable="!submittingStudent"
      :mask-closable="!submittingStudent"
    >
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <StudentForm
          :loading="submittingStudent"
          :initial-values="studentForm"
          :is-editing="!!editingStudent"
          @submit="handleSubmitStudent"
          @cancel="handleCancelStudent"
        />
      </div>
    </n-modal>

    <!-- Delete Confirmation Dialog -->
    <n-modal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      type="error"
      title="Confirm Student Deletion"
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
          Are you sure you want to delete the student
          <strong
            >"{{ itemToDelete?.firstName }}
            {{ itemToDelete?.lastName }}"</strong
          >?
        </p>

        <n-alert type="error" class="mb-4" title="Permanent Action">
          This action cannot be undone. All related student data including
          grades, attendance records, and
          {{
            isHigherEducationComputed
              ? 'course enrollments'
              : 'activity participations'
          }}
          will also be deleted.
        </n-alert>
      </div>
    </n-modal>

    <!-- Student Detail Modal -->
    <n-modal
      v-model:show="showStudentDetail"
      preset="card"
      style="width: 70rem"
      :title="`${selectedStudentDetail?.firstName} ${selectedStudentDetail?.lastName} - Student Profile`"
    >
      <div
        v-if="selectedStudentDetail"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <!-- Basic Information -->
        <n-card title="Basic Information" class="col-span-full md:col-span-1">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-text-secondary">Student ID:</span>
              <span class="font-medium">{{ selectedStudentDetail.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Email:</span>
              <span class="font-medium">{{ selectedStudentDetail.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary"
                >{{ isHigherEducationComputed ? 'Class' : 'Grade' }}:</span
              >
              <span class="font-medium">{{
                selectedStudentDetail.gradeName
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Enrollment Date:</span>
              <span class="font-medium">{{
                formatDate(selectedStudentDetail.createdAt)
              }}</span>
            </div>
          </div>
        </n-card>

        <!-- Academic Performance -->
        <n-card
          title="Academic Performance"
          class="col-span-full md:col-span-1"
        >
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-text-secondary">Total Marks:</span>
              <span class="font-medium">{{
                selectedStudentDetail.markCount || 0
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Attendance Records:</span>
              <span class="font-medium">{{
                selectedStudentDetail.attendanceCount || 0
              }}</span>
            </div>
            <div v-if="isHigherEducationComputed" class="flex justify-between">
              <span class="text-text-secondary">Course Enrollments:</span>
              <span class="font-medium">{{
                selectedStudentDetail.electivesCount || 0
              }}</span>
            </div>
            <div v-else class="flex justify-between">
              <span class="text-text-secondary">Club Memberships:</span>
              <span class="font-medium">{{
                selectedStudentDetail.clubMembershipsCount || 0
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
  useStudentStore,
  type Student,
  type StudentSearchParams,
} from '~/stores/student';
import { useInstitutionStore } from '~/stores/institution';
import { useGradeStore } from '~/stores/grade';
import { isHigherEducation as checkIsHigherEducation } from '~/utils/institution-helper';
import { debounce } from 'lodash';
import StudentForm from './forms/StudentForm.vue';
import AcademicHierarchy, {
  type HierarchyLevel,
} from '~/components/common/AcademicHierarchy.vue';

// Stores and utilities
const academicStore = useAcademicStore();
const studentStore = useStudentStore();
const institutionStore = useInstitutionStore();
const gradeStore = useGradeStore();
const message = useMessage();
const router = useRouter();

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
const searchParams = ref<StudentSearchParams>({
  pageNumber: 1,
  pageSize: 20,
  sortBy: 'FirstName',
  ascending: true,
});

// Local state for search and filters
const searchQuery = ref('');
const gradeFilter = ref<string | null>(null);
const sortBy = ref('FirstName');

// State for modals and forms
const showStudentModal = ref(false);
const submittingStudent = ref(false);
const editingStudent = ref<Student | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<Student | null>(null);
const showStudentDetail = ref(false);
const selectedStudentDetail = ref<Student | null>(null);

// Student form state
const studentForm = ref<Partial<Student>>({});

// Hierarchy visibility control
const userDismissedHierarchy = ref(false);

// Reactive search parameters for the query
const reactiveSearchParams = computed<StudentSearchParams>(() => {
  const params: StudentSearchParams = {
    pageNumber: searchParams.value.pageNumber,
    pageSize: searchParams.value.pageSize,
    sortBy: searchParams.value.sortBy,
    ascending: searchParams.value.ascending,
  };

  if (searchQuery.value.trim()) {
    params.query = searchQuery.value.trim();
  }

  if (gradeFilter.value) {
    params.gradeId = gradeFilter.value;
  }

  // Set institution-specific filters based on tab and institution type
  if (activeInstitution.value?.id) {
    if (activeTab.value === 'active' && isHigherEducationComputed.value) {
      params.isUniversityStudent = true;
      params.universityId = activeInstitution.value.id;
    } else if (activeTab.value === 'all') {
      if (isHigherEducationComputed.value) {
        params.isUniversityStudent = true;
        params.universityId = activeInstitution.value.id;
      } else {
        params.isSchoolStudent = true;
        params.schoolId = activeInstitution.value.id;
      }
    } else if (activeTab.value === 'byGrade') {
      if (isHigherEducationComputed.value) {
        params.isUniversityStudent = true;
        params.universityId = activeInstitution.value.id;
      } else {
        params.isSchoolStudent = true;
        params.schoolId = activeInstitution.value.id;
      }
    }
  }

  return params;
});

// Use the students query from the store
const studentsQuery = studentStore.studentsQuery(reactiveSearchParams);

// Extract reactive properties from the query
const studentsQueryData = computed(() => studentsQuery?.data.value);
const isLoadingStudents = computed(() => studentsQuery?.isLoading.value);
const studentsQueryError = computed(() => studentsQuery?.error.value);

// Create a debounced search function
const debouncedSearch = debounce(async () => {
  if (canCreateStudent.value) {
    await studentsQuery?.refetch();
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
const hasGrades = computed(() => gradeStore.grades.length > 0);

// Can create student when we have an active institution and grades
const canCreateStudent = computed(() => {
  return hasActiveInstitution.value && hasGrades.value;
});

// Show hierarchy logic
const showHierarchy = computed(() => {
  return (
    (!canCreateStudent.value || activeTab.value === 'setup') &&
    !userDismissedHierarchy.value
  );
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
    id: 'grades',
    title: isHigherEducationComputed.value ? 'Classes' : 'Grades',
    description: `${isHigherEducationComputed.value ? 'Class' : 'Grade'} levels for student assignment`,
    icon: 'ph:graduation-cap',
    isCompleted: hasGrades.value,
    isActive: hasActiveInstitution.value && !hasGrades.value,
    count: gradeStore.grades.length,
    actionRequired: hasActiveInstitution.value && !hasGrades.value,
    navigateTo: '/academic/grades',
    actionText: 'Create Grades',
  },
  {
    id: 'students',
    title: 'Students',
    description: 'Student enrollment and management',
    icon: 'ph:user-multiple',
    isCompleted: (currentStudents.value?.length || 0) > 0,
    isActive: canCreateStudent.value,
    count: currentStudents.value?.length || 0,
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
  if (!hasGrades.value) {
    return {
      text: `Create ${isHigherEducationComputed.value ? 'Classes' : 'Grades'}`,
      icon: 'ph:graduation-cap',
      type: 'primary' as const,
      disabled: false,
    };
  }
  return undefined;
});

// Current students from query data
const currentStudents = computed(() => {
  return studentsQueryData.value?.students || [];
});

// Pagination metadata from query data
const paginationMetadata = computed(() => {
  if (!studentsQueryData.value) return null;

  return {
    totalCount: studentsQueryData.value.totalCount,
    pageNumber: studentsQueryData.value.pageNumber,
    pageSize: studentsQueryData.value.pageSize,
    totalPages: studentsQueryData.value.totalPages,
    hasPreviousPage: studentsQueryData.value.hasPreviousPage,
    hasNextPage: studentsQueryData.value.hasNextPage,
  };
});

// Student counts for badges
const activeStudentsCount = computed(() => {
  if (isHigherEducationComputed.value) {
    return currentStudents.value.filter((s) => s.isUniversityStudent).length;
  } else {
    return currentStudents.value.filter((s) => s.isSchoolStudent).length;
  }
});

// Check if there are active filters
const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || gradeFilter.value);
});

// Options for filters
const gradeOptions = computed(() => {
  return gradeStore.grades.map((grade) => ({
    label:
      grade.name ||
      `${isHigherEducationComputed.value ? 'Class' : 'Grade'} ${grade.id.substring(0, 4)}`,
    value: grade.id,
  }));
});

const sortOptions = computed(() => [
  { label: 'First Name (A-Z)', value: 'FirstName' },
  { label: 'Last Name (A-Z)', value: 'LastName' },
  { label: 'Email (A-Z)', value: 'Email' },
  { label: 'Grade', value: 'Grade' },
  { label: 'Newest First', value: 'CreatedAt' },
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
  if (!paginationMetadata.value) return 'No students found';

  const { pageNumber, pageSize, totalCount } = paginationMetadata.value;
  const start = (pageNumber - 1) * pageSize + 1;
  const end = Math.min(pageNumber * pageSize, totalCount);

  return `Showing ${start}-${end} of ${totalCount} students`;
}

// Dynamic table columns based on institution type
const studentColumns = computed(() => {
  const baseColumns = [
    {
      title: 'Student',
      key: 'name',
      width: 200,
      render(row: Student) {
        return h('div', { class: 'flex items-center gap-3' }, [
          h(
            'div',
            {
              class:
                'w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center',
            },
            [h(Icon, { name: 'ph:user', class: 'text-primary' })]
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
      title: isHigherEducationComputed.value ? 'Student ID' : 'Grade',
      key: isHigherEducationComputed.value ? 'studentId' : 'gradeName',
      width: 120,
      render(row: Student) {
        if (isHigherEducationComputed.value) {
          return h(
            'span',
            { class: 'font-mono text-sm' },
            row.id?.substring(0, 8) || '-'
          );
        } else {
          return h(
            NTag,
            { type: 'info', size: 'small' },
            { default: () => row.gradeName || '-' }
          );
        }
      },
    },
    {
      title: isHigherEducationComputed.value ? 'Status' : 'Type',
      key: 'status',
      width: 140,
      render(row: Student) {
        if (isHigherEducationComputed.value) {
          return h(
            NTag,
            { type: 'success', size: 'small' },
            { default: () => 'Active' }
          );
        } else {
          return h(
            NTag,
            { type: row.isSchoolStudent ? 'success' : 'info', size: 'small' },
            { default: () => (row.isSchoolStudent ? 'School' : 'Other') }
          );
        }
      },
    },
    {
      title: 'Academic Performance',
      key: 'performance',
      width: 160,
      render(row: Student) {
        const markCount = row.markCount || 0;
        const attendanceCount = row.attendanceCount || 0;

        return h('div', { class: 'space-y-1' }, [
          h(
            'div',
            { class: 'text-xs text-text-secondary' },
            `${markCount} marks`
          ),
          h(
            'div',
            { class: 'text-xs text-text-secondary' },
            `${attendanceCount} attendance`
          ),
        ]);
      },
    },
    {
      title: 'Activities',
      key: 'activities',
      width: 120,
      render(row: Student) {
        const count = isHigherEducationComputed.value
          ? row.electivesCount || 0
          : row.clubMembershipsCount || 0;
        const label = isHigherEducationComputed.value ? 'courses' : 'clubs';

        return h('span', {}, `${count} ${label}`);
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render(row: Student) {
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
                viewStudentDetail(row);
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
                handleEditStudent(row);
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
  } else if (!hasGrades.value) {
    router.push('/academic/grades');
  }
}

// Event handlers
function handleTabChange(tab: string) {
  activeTab.value = tab;
  searchQuery.value = '';
  resetFilters();
  searchParams.value.pageNumber = 1;
}

function resetFilters() {
  gradeFilter.value = null;
  sortBy.value = 'FirstName';
  searchParams.value.sortBy = 'FirstName';
  searchParams.value.ascending = true;
}

function handleSearchUpdate(value: string) {
  searchQuery.value = value;
}

function handleStudentSearch() {
  searchParams.value.pageNumber = 1;
  studentsQuery?.refetch();
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

function handleAddStudentClick() {
  if (!canCreateStudent.value) {
    message.warning('You need to have an active institution and grades first.');
    return;
  }

  editingStudent.value = null;
  studentForm.value = {};
  showStudentModal.value = true;
}

function handleEditStudent(student: Student) {
  editingStudent.value = student;
  studentForm.value = { ...student };
  showStudentModal.value = true;
}

function handleCancelStudent() {
  showStudentModal.value = false;
  editingStudent.value = null;
  studentForm.value = {};
}

function handleDeleteItem(student: Student) {
  itemToDelete.value = student;
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    await studentStore.deleteStudent(itemToDelete.value.id);
    message.success('Student deleted successfully');
    await studentsQuery?.refetch(); // Refresh the list
  } catch (error: any) {
    message.error('Error deleting student: ' + error.message);
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
}

function cancelDelete() {
  itemToDelete.value = null;
  showDeleteConfirm.value = false;
}

async function handleSubmitStudent(validatedData: any) {
  try {
    submittingStudent.value = true;

    if (editingStudent.value) {
      await studentStore.updateStudent(editingStudent.value.id, validatedData);
      message.success('Student updated successfully');
    } else {
      await studentStore.createStudent(validatedData);
      message.success('Student created successfully');
    }

    showStudentModal.value = false;
    await studentsQuery?.refetch(); // Refresh the list
  } catch (error: any) {
    message.error(
      `Failed to ${editingStudent.value ? 'update' : 'create'} student: ${error.message}`
    );
  } finally {
    submittingStudent.value = false;
  }
}

function viewStudentDetail(student: Student) {
  selectedStudentDetail.value = student;
  showStudentDetail.value = true;
}

function handleExportStudents() {
  // Implementation for exporting students data
  message.info('Export functionality coming soon');
}

function handleBulkEnrollment() {
  // Implementation for bulk enrollment in courses
  message.info('Bulk enrollment functionality coming soon');
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

// Function to load students based on current tab and filters
function loadStudentsBasedOnTab() {
  if (canCreateStudent.value) {
    studentsQuery?.refetch();
  }
}

// Initialize data
onMounted(async () => {
  if (!academicStore.initialized) {
    await academicStore.initializeStore();
  }

  // Load grades for the current institution
  if (activeInstitution.value?.id) {
    await gradeStore.fetchGradesByInstitution(activeInstitution.value.id);
  }

  // Initial load of students
  loadStudentsBasedOnTab();
});

// Watch for institution changes
watch(
  () => activeInstitution.value?.id,
  async (newInstitutionId) => {
    if (newInstitutionId) {
      // Reload grades and students when institution changes
      await gradeStore.fetchGradesByInstitution(newInstitutionId);
      loadStudentsBasedOnTab();
    }
  }
);

// Watch for errors from the students query
watch(studentsQueryError, (error) => {
  if (error) {
    message.error('Failed to load students: ' + error.message);
  }
});
</script>
