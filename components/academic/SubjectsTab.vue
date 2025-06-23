<!-- components/academic/SubjectsTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Header with Institution Context -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white"
        >
          <Icon
            :name="
              isHigherEducationComputed ? 'ph:graduation-cap' : 'ph:student'
            "
            class="text-xl"
          />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-text-primary m-0">
            {{ isHigherEducationComputed ? 'Course' : 'Subject' }} Management
          </h2>
          <p class="text-sm text-text-secondary mt-1">
            Manage {{ institutionTypeLabel.toLowerCase() }}
            {{ isHigherEducationComputed ? 'courses' : 'subjects' }} and
            curriculum
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
              isHigherEducationComputed ? 'ph:graduation-cap' : 'ph:student'
            "
            class="mr-1"
          />
          {{ institutionTypeLabel }}
        </n-tag>

        <div class="flex gap-2">
          <n-button
            type="primary"
            :disabled="!canManageSubjects"
            size="large"
            @click="handleAddSubjectClick(false)"
          >
            <template #icon>
              <Icon name="ph:plus" />
            </template>
            Add {{ isHigherEducationComputed ? 'Course' : 'Subject' }}
          </n-button>
          <n-button
            type="info"
            :disabled="!canManageSubjects"
            size="large"
            @click="handleAddSubjectClick(true)"
          >
            <template #icon>
              <Icon name="ph:star" />
            </template>
            Add Elective
          </n-button>
        </div>
      </div>
    </div>

    <!-- Prerequisites Warning -->
    <n-alert v-if="!canManageSubjects" type="warning" class="mb-6">
      <template #icon>
        <Icon name="ph:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">
          Before managing
          {{ isHigherEducationComputed ? 'courses' : 'subjects' }}:
        </div>
        <div class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>
            You need to have an active institution and appropriate permissions
          </span>
        </div>
      </div>
    </n-alert>

    <!-- Subject Categories Tabs -->
    <n-tabs
      v-if="canManageSubjects"
      v-model:value="activeTab"
      type="line"
      animated
      size="large"
      class="mb-6"
      @update:value="handleTabChange"
    >
      <n-tab-pane
        name="all"
        :tab="`All ${isHigherEducationComputed ? 'Courses' : 'Subjects'}`"
      >
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:list" />
            All {{ isHigherEducationComputed ? 'Courses' : 'Subjects' }}
            <n-badge
              v-if="allSubjectsCount > 0"
              :value="allSubjectsCount"
              type="info"
              :max="99"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane
        name="mandatory"
        :tab="`Required ${isHigherEducationComputed ? 'Courses' : 'Subjects'}`"
      >
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:bookmark" />
            Required {{ isHigherEducationComputed ? 'Courses' : 'Subjects' }}
            <n-badge
              v-if="mandatorySubjectsCount > 0"
              :value="mandatorySubjectsCount"
              type="success"
              :max="99"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane
        name="elective"
        :tab="`Elective ${isHigherEducationComputed ? 'Courses' : 'Subjects'}`"
      >
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:star" />
            Elective {{ isHigherEducationComputed ? 'Courses' : 'Subjects' }}
            <n-badge
              v-if="electiveSubjectsCount > 0"
              :value="electiveSubjectsCount"
              type="warning"
              :max="99"
            />
          </div>
        </template>
      </n-tab-pane>
    </n-tabs>

    <!-- Search and Filters -->
    <SubjectFilters
      v-if="canManageSubjects"
      v-model:search="searchQuery"
      v-model:filters="filters"
      :loading="subjectsStore.searchLoading"
      :is-higher-education="isHigherEducationComputed"
      :active-tab="activeTab"
      class="mb-6"
      @search="handleSearch"
      @clear="handleClearSearch"
    />

    <!-- Subjects Data Table -->
    <div
      v-if="canManageSubjects"
      class="bg-background-card rounded-xl shadow-sm border border-border overflow-hidden"
    >
      <n-data-table
        ref="subjectsTable"
        :columns="subjectColumns"
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
              name="ph:books"
              class="text-6xl text-text-secondary mb-4 mx-auto"
            />
            <h3 class="text-lg font-medium text-text-primary mb-2">
              No {{ isHigherEducationComputed ? 'courses' : 'subjects' }} found
            </h3>
            <p class="text-text-secondary mb-4">
              {{
                searchQuery
                  ? `No results for "${searchQuery}"`
                  : `Get started by creating your first ${isHigherEducationComputed ? 'course' : 'subject'}`
              }}
            </p>
            <n-button
              v-if="!searchQuery"
              type="primary"
              @click="handleAddSubjectClick(false)"
            >
              <template #icon>
                <Icon name="ph:plus" />
              </template>
              Create {{ isHigherEducationComputed ? 'Course' : 'Subject' }}
            </n-button>
          </div>
        </template>
      </n-data-table>
    </div>

    <!-- Elective Enrollment Details Modal -->
    <n-modal
      v-model:show="showEnrollmentDetails"
      preset="card"
      style="width: 70rem"
      :title="`${selectedElective?.name} - Student Enrollments`"
    >
      <n-data-table
        :columns="enrollmentColumns"
        :data="subjectsStore.electiveEnrollments.slice()"
        :loading="subjectsStore.loadingEnrollments"
        :pagination="enrollmentPagination"
        :scroll-x="800"
      >
        <template #empty>
          <div class="text-center py-8">
            <Icon
              name="ph:user-plus"
              class="text-4xl text-text-secondary mb-3"
            />
            <p class="text-text-secondary">No students enrolled yet</p>
          </div>
        </template>
      </n-data-table>
    </n-modal>

    <!-- Subject Form Modal -->
    <n-modal
      v-model:show="showSubjectModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      :title="
        editingSubject
          ? `Edit ${isHigherEducationComputed ? 'Course' : 'Subject'}`
          : `Create New ${isElective ? 'Elective' : ''} ${isHigherEducationComputed ? 'Course' : 'Subject'}`
      "
      :closable="!submittingSubject"
      :mask-closable="!submittingSubject"
    >
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <SubjectForm
          :loading="submittingSubject"
          :initial-values="subjectForm"
          :is-editing="!!editingSubject"
          :is-elective="isElective"
          @submit="handleSubmitSubject"
          @cancel="handleCancelSubject"
        />
      </div>
    </n-modal>

    <!-- Delete Confirmation Dialog -->
    <n-modal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      type="error"
      :title="`Confirm ${isHigherEducationComputed ? 'Course' : 'Subject'} Deletion`"
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
          {{ isHigherEducationComputed ? 'course' : 'subject' }}
          <strong>"{{ itemToDelete?.name }}"</strong>?
        </p>

        <n-alert
          v-if="itemToDelete?.isElective"
          type="warning"
          class="mb-4"
          title="Elective Course Impact"
        >
          This will remove all student enrollments for this elective
          {{ isHigherEducationComputed ? 'course' : 'subject' }}.
        </n-alert>

        <n-alert v-else type="error" class="mb-4" title="Permanent Action">
          This action cannot be undone. Any related data, assignments, and
          student records will be affected.
        </n-alert>
      </div>
    </n-modal>

    <!-- Enrollment Management Modal -->
    <n-modal
      v-model:show="showEnrollmentModal"
      preset="dialog"
      :type="enrollingStudent ? 'success' : 'warning'"
      title="Manage Student Enrollment"
      :positive-text="enrollingStudent ? 'Enroll Student' : 'Remove Student'"
      negative-text="Cancel"
      @positive-click="confirmEnrollmentAction"
      @negative-click="cancelEnrollmentAction"
    >
      <template #icon>
        <Icon
          :name="enrollingStudent ? 'ph:user-plus' : 'ph:user-minus'"
          :class="enrollingStudent ? 'text-green-500' : 'text-orange-500'"
        />
      </template>
      <div class="py-2">
        <p v-if="enrollingStudent" class="mb-2">
          Enroll student
          <strong
            >{{ selectedStudent?.firstName }}
            {{ selectedStudent?.lastName }}</strong
          >
          in the elective
          {{ isHigherEducationComputed ? 'course' : 'subject' }}
          <strong>"{{ selectedElective?.name }}"</strong>?
        </p>
        <p v-else class="mb-2">
          Remove student
          <strong
            >{{ selectedStudent?.firstName }}
            {{ selectedStudent?.lastName }}</strong
          >
          from the elective
          {{ isHigherEducationComputed ? 'course' : 'subject' }}
          <strong>"{{ selectedElective?.name }}"</strong>?
        </p>
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
import { useSubjectStore, type Subject } from '~/stores/subject';
import { useInstitutionStore } from '~/stores/institution';
import { useDepartmentStore } from '~/stores/department';
import { useTeacherStore } from '~/stores/teacher';
import { SubjectType } from '~/enums/subject-type.enum';
import type { AcademicLevel } from '~/enums/academic-level.enum';
import type { ElectiveType } from '~/enums/elective-type.enum';
import { isHigherEducation as checkIsHigherEducation } from '~/utils/institution-helper';
import SubjectFilters from './filters/SubjectFilters.vue';
import SubjectForm from './forms/SubjectForm.vue';
import { debounce } from 'lodash';

// Router for navigation
const router = useRouter();

// Stores and utilities
const academicStore = useAcademicStore();
const subjectsStore = useSubjectStore();
const institutionStore = useInstitutionStore();
const departmentStore = useDepartmentStore();
const teacherStore = useTeacherStore();
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
  departmentId: null as string | null,
  academicLevel: null as AcademicLevel | null,
  electiveType: null as ElectiveType | null,
  hasLab: null as boolean | null,
});

// Pagination parameters
const paginationParams = ref({
  page: 1,
  pageSize: 15,
  query: '',
  isElective: null as boolean | null,
  departmentId: null as string | null,
  academicLevel: null as string | null,
  electiveType: null as string | null,
  hasLab: null as boolean | null,
});

// State for modals and forms
const showSubjectModal = ref(false);
const submittingSubject = ref(false);
const editingSubject = ref<Subject | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<Subject | null>(null);

// Elective enrollment state
const selectedElective = ref<Subject | null>(null);
const selectedStudent = ref<Student | null>(null);
const showEnrollmentModal = ref(false);
const showEnrollmentDetails = ref(false);
const enrollingStudent = ref(true);

// Subject form state
const isElective = ref(false);
const subjectForm = ref<Partial<Subject>>({});

// Query for paginated data based on context
const currentPagedQuery = computed(() => {
  if (activeInstitution.value?.id) {
    return subjectsStore.institutionSubjectsQuery(
      computed(() => ({
        institutionId: activeInstitution.value!.id,
        ...paginationParams.value,
      }))
    );
  }
  return subjectsStore.subjectsQuery(ref(paginationParams.value));
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

// Computed properties
const canManageSubjects = computed(() => {
  return !!activeInstitution.value?.id;
});

// Subject counts for badges - using paginated data
const allSubjectsCount = computed(() => {
  if (activeTab.value === 'all') {
    return currentPagedQuery.value?.data.value?.totalCount || 0;
  }
  return subjectsStore.subjects?.length || 0;
});

const mandatorySubjectsCount = computed(() => {
  if (activeTab.value === 'mandatory') {
    return currentPagedQuery.value?.data.value?.totalCount || 0;
  }
  return subjectsStore.subjects?.filter((s) => !s.isElective).length || 0;
});

const electiveSubjectsCount = computed(() => {
  if (activeTab.value === 'elective') {
    return currentPagedQuery.value?.data.value?.totalCount || 0;
  }
  return subjectsStore.subjects?.filter((s) => s.isElective).length || 0;
});
// Enrollment pagination settings
const enrollmentPagination = ref({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
});

// Dynamic table columns based on institution type
const subjectColumns = computed(() => {
  const baseColumns = [
    {
      title: isHigherEducationComputed.value ? 'Course Name' : 'Subject Name',
      key: 'name',
      width: 200,
      ellipsis: {
        tooltip: true,
      },
      render(row: Subject) {
        return h('span', {}, row.name || '-');
      },
    },
    {
      title: 'Code',
      key: 'code',
      width: 120,
    },
    {
      title: 'Type',
      key: 'type',
      width: 180,
      render(row: Subject) {
        let typeLabel = '';
        let typeClass:
          | 'default'
          | 'success'
          | 'error'
          | 'warning'
          | 'primary'
          | 'info';

        if (row.isElective) {
          typeLabel = `Elective${row.electiveType ? ` (${row.electiveType})` : ''}`;
          typeClass = 'info';
        } else {
          if (isHigherEducationComputed.value) {
            typeLabel =
              row.subjectType === SubjectType.UniversityCourse
                ? 'University Course'
                : 'Course';
          } else {
            typeLabel =
              row.subjectType === SubjectType.SchoolSubject
                ? 'School Subject'
                : 'Subject';
          }
          typeClass = 'success';
        }

        return h(
          NTag,
          { type: typeClass, size: 'small' },
          { default: () => typeLabel }
        );
      },
    },
    {
      title: 'Academic Level',
      key: 'academicLevel',
      width: 140,
    },
  ];

  // Add institution-specific columns
  if (isHigherEducationComputed.value) {
    baseColumns.push(
      {
        title: 'Department',
        key: 'departmentName',
        width: 160,
        render(row: Subject) {
          return h('span', {}, row.departmentName || '-');
        },
      },
      {
        title: 'Credits',
        key: 'credits',
        width: 100,
        render(row: Subject) {
          return h('span', {}, row.creditHours ? `${row.creditHours}h` : '-');
        },
      }
    );
  } else {
    baseColumns.push({
      title: 'Grade Range',
      key: 'gradeRange',
      width: 120,
      render(row: Subject) {
        const gradeText =
          row.minGradeLevel && row.maxGradeLevel
            ? `${row.minGradeLevel}-${row.maxGradeLevel}`
            : '-';
        return h('span', {}, gradeText);
      },
    });
  }

  baseColumns.push(
    {
      title: isHigherEducationComputed.value ? 'Instructor' : 'Teacher',
      key: 'primaryTeacherName',
      width: 150,
      ellipsis: {
        tooltip: true,
      },
      render(row: Subject) {
        return h('span', {}, row.primaryTeacherName || '-');
      },
    },
    {
      title: activeTab.value === 'elective' ? 'Enrollments' : 'Lab',
      key: 'statusInfo',
      width: 120,
      render(row: Subject) {
        if (row.isElective) {
          return h('div', { class: 'flex items-center gap-2' }, [
            h(
              'span',
              { class: 'text-sm' },
              String(row.enrollmentsCount || '0')
            ),
            h(
              NButton,
              {
                size: 'tiny',
                type: 'primary',
                quaternary: true,
                onClick: (e: Event) => {
                  e.stopPropagation();
                  viewElectiveEnrollments(row);
                },
              },
              { default: () => 'View' }
            ),
          ]);
        } else {
          return row.hasLab
            ? h(
                NTag,
                { type: 'warning', size: 'small' },
                { default: () => 'Lab' }
              )
            : h(
                NTag,
                { type: 'default', size: 'small' },
                { default: () => 'Theory' }
              );
        }
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render(row: Subject) {
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
                handleEditSubject(row);
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

        // For electives, add enrollment management button
        if (row.isElective) {
          actions.unshift(
            h(
              NButton,
              {
                quaternary: true,
                circle: true,
                type: 'success',
                size: 'small',
                onClick: (e: Event) => {
                  e.stopPropagation();
                  openEnrollmentManager(row);
                },
              },
              { icon: () => h(Icon, { name: 'ph:users-three' }) }
            )
          );
        }

        return h(
          NSpace,
          { justify: 'center', size: 'small' },
          { default: () => actions }
        );
      },
    }
  );

  return baseColumns;
});

// Enrollment columns for elective subjects
const enrollmentColumns = [
  {
    title: 'Student',
    key: 'studentName',
    render(row: any) {
      return h('div', { class: 'flex items-center gap-2' }, [
        h(
          'div',
          {
            class:
              'w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center',
          },
          [h(Icon, { name: 'ph:student', class: 'text-primary' })]
        ),
        h('span', {}, row.studentName),
      ]);
    },
  },
  {
    title: 'Enrollment Date',
    key: 'enrollmentDate',
    render(row: any) {
      return h('span', {}, new Date(row.enrollmentDate).toLocaleDateString());
    },
  },
  {
    title: 'Status',
    key: 'status',
    render(row: any) {
      return h(
        NTag,
        {
          type: row.status === 'Active' ? 'success' : 'warning',
          size: 'small',
        },
        { default: () => row.status }
      );
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    render(row: any) {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                quaternary: true,
                onClick: () => handleUnenrollStudent(row),
              },
              {
                icon: () => h(Icon, { name: 'ph:user-minus' }),
                default: () => 'Remove',
              }
            ),
          ],
        }
      );
    },
  },
];

// Event handlers
function handleTabChange(tab: string) {
  activeTab.value = tab;
  searchQuery.value = '';
  resetFilters();

  // Update pagination params based on tab
  paginationParams.value.page = 1;
  paginationParams.value.query = '';

  if (tab === 'elective') {
    paginationParams.value.isElective = true;
  } else if (tab === 'mandatory') {
    paginationParams.value.isElective = false;
  } else {
    paginationParams.value.isElective = null;
  }
}

function resetFilters() {
  filters.value = {
    departmentId: null,
    academicLevel: null,
    electiveType: null,
    hasLab: null,
  };

  // Reset pagination params filters
  paginationParams.value.departmentId = null;
  paginationParams.value.academicLevel = null;
  paginationParams.value.electiveType = null;
  paginationParams.value.hasLab = null;
}

async function handleSearch() {
  if (!canManageSubjects.value) return;

  // Update pagination params with current filters
  paginationParams.value.query = searchQuery.value;
  paginationParams.value.departmentId = filters.value.departmentId;
  paginationParams.value.academicLevel = filters.value.academicLevel as
    | string
    | null;
  paginationParams.value.electiveType = filters.value.electiveType as
    | string
    | null;
  paginationParams.value.hasLab = filters.value.hasLab;
  paginationParams.value.page = 1; // Reset to first page on search
}

function handleClearSearch() {
  searchQuery.value = '';
  resetFilters();
  paginationParams.value.query = '';
  paginationParams.value.page = 1;
}

function handleAddSubjectClick(elective: boolean) {
  if (!canManageSubjects.value) {
    message.warning('You need to have an active institution first.');
    return;
  }

  isElective.value = elective;
  editingSubject.value = null;
  subjectForm.value = {};
  showSubjectModal.value = true;
}

function handleEditSubject(subject: Subject) {
  editingSubject.value = subject;
  isElective.value = subject.isElective;
  subjectForm.value = { ...subject };
  showSubjectModal.value = true;
}

function handleCancelSubject() {
  showSubjectModal.value = false;
  editingSubject.value = null;
  subjectForm.value = {};
}

function handleDeleteItem(subject: Subject) {
  itemToDelete.value = subject;
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    await subjectsStore.deleteSubject(itemToDelete.value.id);
    message.success(
      `${isHigherEducationComputed.value ? 'Course' : 'Subject'} deleted successfully`
    );

    // Refetch current page
    if (currentPagedQuery.value) {
      await currentPagedQuery.value.refetch();
    }
  } catch (error: any) {
    message.error(
      `Error deleting ${isHigherEducationComputed.value ? 'course' : 'subject'}: ${error.message}`
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

async function handleSubmitSubject(validatedData: any) {
  try {
    submittingSubject.value = true;

    if (editingSubject.value) {
      await subjectsStore.updateSubject(editingSubject.value.id, validatedData);
      message.success(
        `${isHigherEducationComputed.value ? 'Course' : 'Subject'} updated successfully`
      );
    } else {
      await subjectsStore.createSubject(validatedData);
      message.success(
        `${isHigherEducationComputed.value ? 'Course' : 'Subject'} created successfully`
      );
    }

    // Refetch current page
    if (currentPagedQuery.value) {
      await currentPagedQuery.value.refetch();
    }

    showSubjectModal.value = false;
  } catch (error: any) {
    message.error(
      `Failed to ${editingSubject.value ? 'update' : 'create'} ${isHigherEducationComputed.value ? 'course' : 'subject'}: ${error.message}`
    );
  } finally {
    submittingSubject.value = false;
  }
}

// Elective enrollment management functions
async function viewElectiveEnrollments(subject: Subject) {
  selectedElective.value = subject;
  showEnrollmentDetails.value = true;

  try {
    await subjectsStore.fetchElectiveEnrollments(subject.id);
  } catch (error: any) {
    message.error('Error loading enrollments: ' + error.message);
  }
}

function openEnrollmentManager(subject: Subject) {
  selectedElective.value = subject;
  router.push(`/subjects/electives/${subject.id}/enrollments`);
}

function handleUnenrollStudent(enrollment: any) {
  if (!selectedElective.value) return;

  selectedStudent.value = {
    id: enrollment.studentId,
    firstName: enrollment.studentName.split(' ')[0],
    lastName: enrollment.studentName.split(' ').slice(1).join(' ') || '',
  } as Student;

  enrollingStudent.value = false;
  showEnrollmentModal.value = true;
}

async function confirmEnrollmentAction() {
  if (!selectedElective.value || !selectedStudent.value) return;

  try {
    if (enrollingStudent.value) {
      await subjectsStore.enrollStudentInElective(
        selectedElective.value.id,
        selectedStudent.value.id
      );
      message.success('Student enrolled successfully');
    } else {
      await subjectsStore.unenrollStudentFromElective(
        selectedElective.value.id,
        selectedStudent.value.id
      );
      message.success('Student removed successfully');
    }

    // Refresh enrollments
    if (selectedElective.value) {
      await subjectsStore.fetchElectiveEnrollments(selectedElective.value.id);
    }
  } catch (error: any) {
    message.error(
      `Error ${enrollingStudent.value ? 'enrolling' : 'removing'} student: ${error.message}`
    );
  } finally {
    showEnrollmentModal.value = false;
    selectedStudent.value = null;
  }
}

function cancelEnrollmentAction() {
  showEnrollmentModal.value = false;
  selectedStudent.value = null;
}

// Initialize data
onMounted(async () => {
  if (!academicStore.initialized) {
    await academicStore.initializeStore();
  }

  // Set institution ID in the store
  if (activeInstitution.value?.id) {
    subjectsStore.setInstitutionId(activeInstitution.value.id);

    if (isHigherEducationComputed.value) {
      // Load departments for higher education
      await departmentStore.fetchDepartments();
    }

    // Load teachers for both types
    await teacherStore.fetchTeachers();
  }

  // Load non-paginated subjects for dropdowns/options
  await subjectsStore.fetchSubjectsNonPaginated();
});

// Watch for institution changes
watch(
  () => activeInstitution.value?.id,
  async (newInstitutionId) => {
    if (newInstitutionId) {
      // Set institution ID in the store
      subjectsStore.setInstitutionId(newInstitutionId);

      // Reload data when institution changes
      if (isHigherEducationComputed.value) {
        await departmentStore.fetchDepartments();
      }
      await teacherStore.fetchTeachers();
      await subjectsStore.fetchSubjectsNonPaginated();
    }
  }
);
</script>
