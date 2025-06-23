<!-- components/academic/MarksTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Marks Header with actions -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white"
        >
          <Icon name="ph:chart-bar" class="text-xl" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-text-primary m-0">
            Mark Management
          </h2>
          <p class="text-sm text-text-secondary mt-1">
            Record and manage student academic performance and assessments
          </p>
        </div>
      </div>
      <n-button
        type="primary"
        :disabled="!canCreateMark"
        size="large"
        @click="handleAddMarkClick"
      >
        <template #icon>
          <Icon name="ph:plus" />
        </template>
        Record Mark
      </n-button>
    </div>

    <!-- Prerequisites Warning -->
    <n-alert v-if="!canCreateMark" type="warning" class="mb-6">
      <template #icon>
        <Icon name="ph:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">Before recording marks:</div>
        <div v-if="!hasStudents" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>You need to have students in the system</span>
        </div>
        <div v-if="!hasTeachers" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>You need to have teachers in the system</span>
        </div>
        <div v-if="!hasSubjects" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>You need to have subjects configured</span>
        </div>
      </div>
    </n-alert>

    <!-- Academic Hierarchy -->
    <AcademicHierarchy
      v-if="showHierarchy"
      :hierarchy="hierarchyData"
      title="Mark Management Prerequisites"
      title-icon="ph:chart-bar"
      :global-action="!canCreateMark ? globalActionConfig : undefined"
      class="mb-8"
      @level-click="handleHierarchyLevelClick"
      @action-click="handleHierarchyActionClick"
      @global-action="navigateToPrerequisite"
    />

    <!-- Mark Filters and Search -->
    <div
      v-if="canCreateMark"
      class="mb-6 bg-background-card rounded-xl shadow-sm border border-border p-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <!-- Student filter -->
        <n-select
          v-model:value="filterParams.studentId"
          filterable
          clearable
          placeholder="Filter by student"
          :options="studentOptions"
          @update:value="handleFilterChange"
        >
          <template #prefix>
            <Icon name="ph:student" />
          </template>
        </n-select>

        <!-- Teacher filter -->
        <n-select
          v-model:value="filterParams.teacherId"
          filterable
          clearable
          placeholder="Filter by teacher"
          :options="teacherOptions"
          @update:value="handleFilterChange"
        >
          <template #prefix>
            <Icon name="ph:chalkboard-teacher" />
          </template>
        </n-select>

        <!-- Subject filter -->
        <n-select
          v-model:value="filterParams.subjectId"
          filterable
          clearable
          placeholder="Filter by subject"
          :options="subjectOptions"
          @update:value="handleFilterChange"
        >
          <template #prefix>
            <Icon name="ph:book" />
          </template>
        </n-select>

        <!-- Mark Type filter -->
        <n-select
          v-model:value="filterParams.type"
          clearable
          placeholder="Filter by mark type"
          :options="markTypeOptions"
          @update:value="handleFilterChange"
        >
          <template #prefix>
            <Icon name="ph:list-bullets" />
          </template>
        </n-select>
      </div>

      <!-- Date range filter -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <n-date-picker
          v-model:value="filterParams.fromDate"
          type="date"
          clearable
          placeholder="From date"
          @update:value="handleFilterChange"
        />
        <n-date-picker
          v-model:value="filterParams.toDate"
          type="date"
          clearable
          placeholder="To date"
          @update:value="handleFilterChange"
        />
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end gap-2">
        <n-button
          type="default"
          :disabled="!hasActiveFilters"
          @click="resetFilters"
        >
          <template #icon>
            <Icon name="ph:arrow-clockwise" />
          </template>
          Reset Filters
        </n-button>
        <n-button
          type="primary"
          :loading="markStore.searchLoading"
          @click="applyFilters"
        >
          <template #icon>
            <Icon name="ph:magnifying-glass" />
          </template>
          Apply Filters
        </n-button>
      </div>
    </div>

    <!-- Marks Statistics Card -->
    <div
      v-if="canCreateMark && markStore.marks.length > 0"
      class="mb-6 bg-background-card rounded-xl shadow-sm border border-border p-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total marks count -->
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div class="text-blue-500 dark:text-blue-400 text-lg font-semibold">
            {{ markStore.marks.length }}
          </div>
          <div class="text-sm text-text-secondary">Total Marks</div>
        </div>

        <!-- Average mark -->
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="text-green-500 dark:text-green-400 text-lg font-semibold">
            {{ averageMark.toFixed(2) }}
          </div>
          <div class="text-sm text-text-secondary">Average Mark</div>
        </div>

        <!-- Highest mark -->
        <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div
            class="text-purple-500 dark:text-purple-400 text-lg font-semibold"
          >
            {{ highestMark.toFixed(2) }}
          </div>
          <div class="text-sm text-text-secondary">Highest Mark</div>
        </div>

        <!-- Mark distribution -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <div
                class="text-amber-500 dark:text-amber-400 text-lg font-semibold"
              >
                {{ markDistribution.excellent }}
              </div>
              <div class="text-sm text-text-secondary">Excellent Marks</div>
            </div>
            <div>
              <div class="text-red-500 dark:text-red-400 text-lg font-semibold">
                {{ markDistribution.failing }}
              </div>
              <div class="text-sm text-text-secondary">Failing Marks</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Marks Data Table -->
    <div
      v-if="canCreateMark"
      class="bg-background-card rounded-xl shadow-sm border border-border overflow-hidden"
    >
      <n-data-table
        ref="markTable"
        :columns="markColumns"
        :data="markStore.marks"
        :loading="markStore.loadingMarks || markStore.searchLoading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        :scroll-x="1400"
        class="min-h-[400px]"
        @update:page="handlePageChange"
      >
        <template #empty>
          <div class="text-center py-12">
            <Icon
              name="ph:chart-bar"
              class="text-6xl text-text-secondary mb-4 mx-auto"
            />
            <h3 class="text-lg font-medium text-text-primary mb-2">
              No marks found
            </h3>
            <p class="text-text-secondary mb-4">
              {{
                hasActiveFilters
                  ? 'No results found for your search criteria'
                  : 'Get started by recording your first mark'
              }}
            </p>
            <n-button
              v-if="!hasActiveFilters"
              type="primary"
              @click="handleAddMarkClick"
            >
              <template #icon>
                <Icon name="ph:plus" />
              </template>
              Record Mark
            </n-button>
          </div>
        </template>
      </n-data-table>
    </div>

    <!-- Mark Modal -->
    <n-modal
      v-model:show="showMarkModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      :title="editingMark ? 'Edit Mark' : 'Record New Mark'"
      :closable="!submittingMark"
      :mask-closable="!submittingMark"
    >
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <MarkForm
          :loading="submittingMark"
          :initial-values="markForm"
          :is-editing="!!editingMark"
          @submit="handleSubmitMark"
          @cancel="showMarkModal = false"
        />
      </div>
    </n-modal>

    <!-- Delete Confirmation Dialog -->
    <n-modal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      type="error"
      title="Confirm Mark Deletion"
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
          Are you sure you want to delete this mark for "{{
            itemToDelete?.topic
          }}"?
        </p>

        <n-alert type="error" class="mb-4" title="Permanent Action">
          This action cannot be undone. The mark will be permanently removed.
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
  NSelect,
  NDatePicker,
  useMessage,
} from 'naive-ui';
import { Icon } from '#components';
import { useMarkStore, type Mark } from '~/stores/mark';
import { useAcademicStore } from '~/stores/academic';
import { useStudentStore } from '~/stores/student';
import { useTeacherStore } from '~/stores/teacher';
import { useSubjectStore } from '~/stores/subject';
import { MarkType } from '~/enums/mark-type.enum';
import AcademicHierarchy, {
  type HierarchyLevel,
} from '~/components/common/AcademicHierarchy.vue';
import MarkForm from './forms/MarkForm.vue';
import { debounce } from 'lodash';

// Router for navigation
const router = useRouter();

// Stores and utilities
const academicStore = useAcademicStore();
const markStore = useMarkStore();
const studentStore = useStudentStore();
const teacherStore = useTeacherStore();
const subjectStore = useSubjectStore();
const message = useMessage();

// State for filters
const filterParams = ref({
  studentId: null as string | null,
  teacherId: null as string | null,
  subjectId: null as string | null,
  type: null as MarkType | null,
  fromDate: null as Date | null,
  toDate: null as Date | null,
});

// State for modals and forms
const showMarkModal = ref(false);
const submittingMark = ref(false);
const editingMark = ref<Mark | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<Mark | null>(null);

// Prerequisites checks
const hasStudents = computed(() => studentStore.students.length > 0);
const hasTeachers = computed(() => teacherStore.teachers.length > 0);
const hasSubjects = computed(() => subjectStore.subjects.length > 0);

// Computed properties
const canCreateMark = computed(() => {
  return hasStudents.value && hasTeachers.value && hasSubjects.value;
});

// Show hierarchy logic
const showHierarchy = computed(() => {
  return !canCreateMark.value;
});

// Hierarchy data for the component
const hierarchyData = computed<HierarchyLevel[]>(() => [
  {
    id: 'students',
    title: 'Student Records',
    description: 'Student enrollment and registration management',
    icon: 'ph:student',
    isCompleted: studentStore.students.length > 0,
    isActive: false,
    count: studentStore.students.length,
    actionRequired: studentStore.students.length === 0,
    navigateTo: '/academic/students',
    actionText: 'Add Students',
  },
  {
    id: 'teachers',
    title: 'Teaching Staff',
    description: 'Faculty and instructor management',
    icon: 'ph:chalkboard-teacher',
    isCompleted: teacherStore.teachers.length > 0,
    isActive: hasStudents.value && teacherStore.teachers.length === 0,
    count: teacherStore.teachers.length,
    actionRequired: hasStudents.value && teacherStore.teachers.length === 0,
    navigateTo: '/academic/teachers',
    actionText: 'Add Teachers',
  },
  {
    id: 'subjects',
    title: 'Academic Subjects',
    description: 'Course and subject curriculum setup',
    icon: 'ph:book',
    isCompleted: subjectStore.subjects.length > 0,
    isActive:
      hasStudents.value &&
      hasTeachers.value &&
      subjectStore.subjects.length === 0,
    count: subjectStore.subjects.length,
    actionRequired:
      hasStudents.value &&
      hasTeachers.value &&
      subjectStore.subjects.length === 0,
    navigateTo: '/academic/subjects',
    actionText: 'Configure Subjects',
  },
  {
    id: 'marks',
    title: 'Student Assessment',
    description: 'Academic performance recording and tracking',
    icon: 'ph:chart-bar',
    isCompleted: markStore.marks.length > 0,
    isActive: canCreateMark.value && markStore.marks.length === 0,
    count: markStore.marks.length,
    actionRequired: false, // This is the current page
  },
]);

// Global action for when prerequisites aren't met
const globalActionConfig = computed(() => {
  if (!hasStudents.value) {
    return {
      text: 'Add Students',
      icon: 'ph:student',
      type: 'primary' as const,
      disabled: false,
    };
  }
  if (!hasTeachers.value) {
    return {
      text: 'Add Teachers',
      icon: 'ph:chalkboard-teacher',
      type: 'primary' as const,
      disabled: false,
    };
  }
  if (!hasSubjects.value) {
    return {
      text: 'Configure Subjects',
      icon: 'ph:book',
      type: 'primary' as const,
      disabled: false,
    };
  }
  return undefined;
});

const hasActiveFilters = computed(() => {
  return (
    filterParams.value.studentId !== null ||
    filterParams.value.teacherId !== null ||
    filterParams.value.subjectId !== null ||
    filterParams.value.type !== null ||
    filterParams.value.fromDate !== null ||
    filterParams.value.toDate !== null
  );
});

// Options for selects
const studentOptions = computed(() => {
  return studentStore.students.map((student) => ({
    label: `${student.firstName} ${student.lastName}`,
    value: student.id,
  }));
});

const teacherOptions = computed(() => {
  return teacherStore.teachers.map((teacher) => ({
    label: `${teacher.firstName} ${teacher.lastName}`,
    value: teacher.id,
  }));
});

const subjectOptions = computed(() => {
  return subjectStore.subjects.map((subject) => ({
    label: subject.name,
    value: subject.id,
  }));
});

const markTypeOptions = computed(() => [
  { label: 'Written Exam', value: MarkType.WrittenExamination },
  { label: 'Oral Exam', value: MarkType.OralExamination },
  { label: 'Assignment', value: MarkType.Assignment },
  { label: 'Participation', value: MarkType.ActiveParticipation },
]);

// Mark form
const markForm = ref({
  value: 0,
  topic: '',
  description: '',
  type: MarkType.WrittenExamination,
  subjectId: '',
  teacherId: '',
  studentId: '',
});

// Statistics computations
const averageMark = computed(() => {
  if (markStore.marks.length === 0) return 0;
  const sum = markStore.marks.reduce((acc, mark) => acc + mark.value, 0);
  return sum / markStore.marks.length;
});

const highestMark = computed(() => {
  if (markStore.marks.length === 0) return 0;
  return Math.max(...markStore.marks.map((mark) => mark.value));
});

const markDistribution = computed(() => {
  const excellent = markStore.marks.filter((mark) => mark.value >= 5.5).length;
  const failing = markStore.marks.filter((mark) => mark.value < 3).length;
  return { excellent, failing };
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

// Table columns
const markColumns = [
  {
    title: 'Student',
    key: 'student',
    width: 200,
    render(row: Mark) {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(
          'div',
          {
            class:
              'w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center',
          },
          [h(Icon, { name: 'ph:student', class: 'text-primary' })]
        ),
        h('div', {}, [
          h('div', { class: 'font-medium' }, row.studentName || 'Unknown'),
          h('div', { class: 'text-xs text-text-secondary' }, 'Student'),
        ]),
      ]);
    },
    sorter: 'default',
  },
  {
    title: 'Subject',
    key: 'subjectName',
    width: 180,
    render(row: Mark) {
      return row.subjectName || 'Unknown';
    },
  },
  {
    title: 'Mark',
    key: 'value',
    width: 100,
    render(row: Mark) {
      const value = parseFloat(row.value.toString());
      let colorClass =
        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100';

      if (value < 3) {
        colorClass =
          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100';
      } else if (value < 4) {
        colorClass =
          'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100';
      } else if (value < 5) {
        colorClass =
          'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100';
      }

      return h(
        'div',
        {
          class: `px-3 py-1 rounded-full text-center font-medium ${colorClass}`,
        },
        value.toFixed(2)
      );
    },
  },
  {
    title: 'Type',
    key: 'type',
    width: 150,
    render(row: Mark) {
      const type = markTypeOptions.value.find((t) => t.value === row.type);
      return type ? type.label : 'Unknown';
    },
  },
  {
    title: 'Topic',
    key: 'topic',
    width: 180,
    render(row: Mark) {
      return row.topic || '-';
    },
  },
  {
    title: 'Teacher',
    key: 'teacherName',
    width: 150,
    render(row: Mark) {
      return row.teacherName || 'Unknown';
    },
  },
  {
    title: 'Date',
    key: 'createdAt',
    width: 120,
    render(row: Mark) {
      const date = new Date(row.createdAt);
      return date.toLocaleDateString();
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 140,
    render(row: Mark) {
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
                onClick: () => handleEditMark(row),
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

// Debounced filter function
const debouncedFilter = debounce(async () => {
  if (canCreateMark.value) {
    await applyFilters();
  }
}, 500);

// Watch for filter changes
watch(
  () => filterParams.value,
  () => {
    debouncedFilter();
  },
  { deep: true }
);

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
function navigateToPrerequisite() {
  if (!hasStudents.value) {
    router.push('/academic/students');
  } else if (!hasTeachers.value) {
    router.push('/academic/teachers');
  } else if (!hasSubjects.value) {
    router.push('/academic/subjects');
  }
}

// Event handlers for filters
function handleFilterChange() {
  // Filter change is handled by the debounced function
}

function resetFilters() {
  filterParams.value = {
    studentId: null,
    teacherId: null,
    subjectId: null,
    type: null,
    fromDate: null,
    toDate: null,
  };
  markStore.fetchAllMarks();
}

async function applyFilters() {
  await markStore.getMarksByFilter(filterParams.value);
}

// Other event handlers
function handlePageChange(page: number) {
  pagination.value.page = page;
}

function handleAddMarkClick() {
  if (canCreateMark.value) {
    resetMarkForm();
    showMarkModal.value = true;
  } else {
    message.warning(
      'You need to have students, teachers, and subjects configured in the system first.'
    );
  }
}

function handleEditMark(mark: Mark) {
  editingMark.value = mark;
  markForm.value = {
    value: mark.value,
    topic: mark.topic || '',
    description: mark.description || '',
    type: mark.type,
    subjectId: mark.subjectId,
    teacherId: mark.teacherId,
    studentId: mark.studentId,
  };
  showMarkModal.value = true;
}

function handleDeleteItem(mark: Mark) {
  itemToDelete.value = mark;
  showDeleteConfirm.value = true;
}

function cancelDelete() {
  itemToDelete.value = null;
  showDeleteConfirm.value = false;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    await markStore.deleteMark(itemToDelete.value.id);
    message.success('Mark deleted successfully');
  } catch (error: any) {
    message.error('Error deleting mark: ' + error.message);
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
}

async function handleSubmitMark(validatedData: any) {
  try {
    submittingMark.value = true;

    if (editingMark.value) {
      await markStore.updateMark(editingMark.value.id, validatedData);
      message.success('Mark updated successfully');
    } else {
      await markStore.createMark(validatedData);
      message.success('Mark created successfully');
    }

    showMarkModal.value = false;
    resetMarkForm();
  } catch (error: any) {
    message.error(
      `Failed to ${editingMark.value ? 'update' : 'create'} mark: ${error.message}`
    );
  } finally {
    submittingMark.value = false;
  }
}

function resetMarkForm() {
  markForm.value = {
    value: 0,
    topic: '',
    description: '',
    type: MarkType.WrittenExamination,
    subjectId: '',
    teacherId: '',
    studentId: '',
  };
  editingMark.value = null;
}

// Initialize data
onMounted(async () => {
  if (!academicStore.initialized) {
    await academicStore.initializeStore();
  }

  // Fetch required data
  if (academicStore.isHigherEd) {
    await studentStore.fetchStudentsByUniversity(
      academicStore.institutionIdentifier
    );
  }
  await teacherStore.fetchTeachers();
  // await subjectStore.fetchSubjects();
  await markStore.fetchAllMarks();
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
