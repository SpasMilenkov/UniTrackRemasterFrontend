<!-- components/academic/AbsenceTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Absences Header with actions -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-xl font-semibold m-0">Absence Management</h2>
      <n-button
        type="primary"
        :disabled="!canCreateAbsence"
        @click="handleAddAbsenceClick"
      >
        <template #icon>
          <Icon name="carbon:add" />
        </template>
        Record Absence
      </n-button>
    </div>

    <!-- Hierarchy guidance - Displayed when prerequisites are missing -->
    <n-alert v-if="!canCreateAbsence" type="warning" class="mb-6">
      <template #icon>
        <Icon name="carbon:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">Before recording absences:</div>
        <div class="flex items-center gap-2">
          <Icon name="carbon:checkmark-outline" class="text-red-500" />
          <span>
            You need to have students and subjects configured in the system.
          </span>
        </div>
      </div>
    </n-alert>

    <!-- Absence Filters and Search -->
    <div
      v-if="canCreateAbsence"
      class="mb-6 bg-background-card rounded-lg shadow p-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
            <Icon name="carbon:user-profile" />
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
            <Icon name="carbon:book" />
          </template>
        </n-select>

        <!-- Status filter -->
        <n-select
          v-model:value="filterParams.status"
          clearable
          placeholder="Filter by status"
          :options="statusOptions"
          @update:value="handleFilterChange"
        >
          <template #prefix>
            <Icon name="carbon:category" />
          </template>
        </n-select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Date range filter -->
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
        <!-- Excused filter -->
        <n-select
          v-model:value="filterParams.isExcused"
          clearable
          placeholder="Excused status"
          :options="excusedOptions"
          @update:value="handleFilterChange"
        >
          <template #prefix>
            <Icon name="carbon:checkbox-checked" />
          </template>
        </n-select>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end gap-2">
        <n-button
          type="default"
          :disabled="!hasActiveFilters"
          @click="resetFilters"
        >
          <template #icon>
            <Icon name="carbon:reset" />
          </template>
          Reset Filters
        </n-button>
        <n-button
          type="primary"
          :loading="absenceStore.searchLoading"
          @click="applyFilters"
        >
          <template #icon>
            <Icon name="carbon:search" />
          </template>
          Apply Filters
        </n-button>
      </div>
    </div>

    <!-- Absence Statistics Card -->
    <div
      v-if="canCreateAbsence && absenceStore.absences.length > 0"
      class="mb-6 bg-background-card rounded-lg shadow p-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total absences count -->
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div class="text-blue-500 dark:text-blue-400 text-lg font-semibold">
            {{ absenceStore.absences.length }}
          </div>
          <div class="text-sm text-text-secondary">Total Absences</div>
        </div>

        <!-- Excused absences -->
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="text-green-500 dark:text-green-400 text-lg font-semibold">
            {{ excusedCount }}
          </div>
          <div class="text-sm text-text-secondary">Excused Absences</div>
        </div>

        <!-- Unexcused absences -->
        <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div class="text-red-500 dark:text-red-400 text-lg font-semibold">
            {{ unexcusedCount }}
          </div>
          <div class="text-sm text-text-secondary">Unexcused Absences</div>
        </div>

        <!-- Status distribution -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <div
                class="text-amber-500 dark:text-amber-400 text-lg font-semibold"
              >
                {{ absenceDistribution.absent }}
              </div>
              <div class="text-sm text-text-secondary">Absent</div>
            </div>
            <div>
              <div
                class="text-yellow-500 dark:text-yellow-400 text-lg font-semibold"
              >
                {{ absenceDistribution.late }}
              </div>
              <div class="text-sm text-text-secondary">Late</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Absences Table -->
    <div
      v-if="canCreateAbsence"
      class="bg-background-card rounded-lg shadow p-4 mb-6"
    >
      <n-data-table
        ref="absenceTable"
        :columns="absenceColumns"
        :data="absenceStore.absences"
        :loading="absenceStore.loadingAbsences || absenceStore.searchLoading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        class="mt-2"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Search results info -->
    <div
      v-if="
        hasActiveFilters &&
        !absenceStore.searchLoading &&
        absenceStore.absences.length === 0
      "
      class="text-center py-4 text-text-secondary"
    >
      No absences found matching your filter criteria. Try adjusting your
      filters.
    </div>

    <!-- Loading state for absences -->
    <div
      v-if="absenceStore.loadingAbsences"
      class="flex justify-center items-center py-16"
    >
      <n-spin size="large" />
    </div>

    <!-- Absence Modal -->
    <n-modal
      v-model:show="showAbsenceModal"
      preset="card"
      style="width: 37.5rem"
      :title="editingAbsence ? 'Edit Absence Record' : 'Record New Absence'"
    >
      <AbsenceForm
        :loading="submittingAbsence"
        :initial-values="absenceForm"
        :is-editing="!!editingAbsence"
        @submit="handleSubmitAbsence"
        @cancel="showAbsenceModal = false"
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
        Are you sure you want to delete this absence record for "{{
          itemToDelete?.studentName
        }}"?
        <n-alert type="warning" class="mt-4">
          This action cannot be undone. The absence record will be permanently
          removed.
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
  NIcon,
  NAlert,
  NSpin,
  NSelect,
  NDatePicker,
  type FormInst,
} from 'naive-ui';
import { useMessage } from 'naive-ui';
import { Icon } from '#components';
import { useAbsenceStore, type Absence } from '~/stores/absence';
import { useAcademicStore } from '~/stores/academic';
import { useStudentStore } from '~/stores/student';
import { useSubjectStore } from '~/stores/subject';
import { AbsenceStatus } from '~/enums/absence-status.enum';
import AbsenceForm from './forms/AbsenceForm.vue';
import { debounce } from 'lodash';

// Stores and utilities
const academicStore = useAcademicStore();
const absenceStore = useAbsenceStore();
const studentStore = useStudentStore();
const subjectStore = useSubjectStore();
const message = useMessage();

// State for filters
const filterParams = ref({
  studentId: null as string | null,
  subjectId: null as string | null,
  status: null as AbsenceStatus  | null,
  isExcused: null as boolean | null,
  fromDate: null as Date | null,
  toDate: null as Date | null,
});

// State for modals and forms
const showAbsenceModal = ref(false);
const submittingAbsence = ref(false);
const editingAbsence = ref<Absence | null>(null);
const absenceFormRef = ref<FormInst | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<Absence | null>(null);

// Options for selects
const studentOptions = computed(() => {
  return studentStore.students.map((student) => ({
    label: `${student.firstName} ${student.lastName}`,
    value: student.id,
  }));
});

const subjectOptions = computed(() => {
  return subjectStore.subjects.map((subject) => ({
    label: subject.name,
    value: subject.id,
  }));
});

const statusOptions = computed(() => [
  { label: 'Absent', value: AbsenceStatus.Absent },
  { label: 'Late', value: AbsenceStatus.Late },
  { label: 'Unexcused Absence', value: AbsenceStatus.UnexcusedAbsence },
]);

const excusedOptions = computed(() => [
  { label: 'Excused', value: true },
  { label: 'Not Excused', value: false },
]);

// Absence form
const absenceForm = ref({
  date: new Date(),
  status: AbsenceStatus.Absent,
  reason: '',
  isExcused: false,
  studentId: '',
  subjectId: null as string | null,
});

// Computed properties
const canCreateAbsence = computed(() => {
  return studentStore.students.length > 0 && subjectStore.subjects.length > 0;
});

const hasActiveFilters = computed(() => {
  return (
    filterParams.value.studentId !== null ||
    filterParams.value.subjectId !== null ||
    filterParams.value.status !== null ||
    filterParams.value.isExcused !== null ||
    filterParams.value.fromDate !== null ||
    filterParams.value.toDate !== null
  );
});

// Statistics computations
const excusedCount = computed(() => {
  return absenceStore.absences.filter((absence) => absence.isExcused).length;
});

const unexcusedCount = computed(() => {
  return absenceStore.absences.filter((absence) => !absence.isExcused).length;
});

const absenceDistribution = computed(() => {
  const absent = absenceStore.absences.filter(
    (absence) =>
      absence.status === AbsenceStatus.Absent ||
      absence.status === AbsenceStatus.UnexcusedAbsence
  ).length;

  const late = absenceStore.absences.filter(
    (absence) => absence.status === AbsenceStatus.Late
  ).length;

  return { absent, late };
});

// Pagination settings
const pagination = ref({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    pagination.value.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize;
    pagination.value.page = 1;
  },
});

// Helper function to get status badge
function getStatusBadge(status: AbsenceStatus) {
  let colorClass = '';
  let icon = '';

  switch (status) {
    case AbsenceStatus.Absent:
      colorClass = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100';
      icon = 'carbon:close-outline';
      break;
    case AbsenceStatus.Late:
      colorClass =
        'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100';
      icon = 'carbon:time';
      break;
    case AbsenceStatus.UnexcusedAbsence:
      colorClass =
        'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100';
      icon = 'carbon:warning';
      break;
    default:
      colorClass =
        'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100';
      icon = 'carbon:help';
  }

  return { colorClass, icon };
}

// Table columns
const absenceColumns = [
  {
    title: 'Student',
    key: 'studentName',
    sorter: 'default',
    render(row: Absence) {
      return row.studentName || 'Unknown';
    },
  },
  {
    title: 'Date',
    key: 'date',
    render(row: Absence) {
      const date = new Date(row.date);
      return date.toLocaleDateString();
    },
    sorter: (a: Absence, b: Absence) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    },
  },
  {
    title: 'Status',
    key: 'status',
    render(row: Absence) {
      const { colorClass, icon } = getStatusBadge(row.status);
      return h(
        'div',
        {
          class: `px-3 py-1 rounded-full text-center font-medium ${colorClass} flex items-center justify-center gap-1`,
        },
        [h(Icon, { name: icon, class: 'text-sm' }), h('span', {}, row.status)]
      );
    },
  },
  {
    title: 'Excused',
    key: 'isExcused',
    render(row: Absence) {
      return h(
        'div',
        {
          class: 'flex justify-center',
        },
        row.isExcused
          ? h(Icon, {
              name: 'carbon:checkmark-filled',
              class: 'text-green-500',
            })
          : h(Icon, { name: 'carbon:close-filled', class: 'text-red-500' })
      );
    },
  },
  {
    title: 'Subject',
    key: 'subjectName',
    render(row: Absence) {
      return row.subjectName || '-';
    },
  },
  {
    title: 'Reason',
    key: 'reason',
    render(row: Absence) {
      if (!row.reason) return '-';
      if (row.reason.length > 30) {
        return row.reason.substring(0, 30) + '...';
      }
      return row.reason;
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    render(row: Absence) {
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
                onClick: () => handleEditAbsence(row),
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
              },
              { icon: () => h(Icon, { name: 'carbon:trash-can' }) }
            ),
          ],
        }
      );
    },
  },
];

// Debounced filter function
const debouncedFilter = debounce(async () => {
  if (canCreateAbsence.value) {
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

// Event handlers for filters
function handleFilterChange() {
  // Filter change is handled by the debounced function
}

function resetFilters() {
  filterParams.value = {
    studentId: null,
    subjectId: null,
    status: null,
    isExcused: null,
    fromDate: null,
    toDate: null,
  };
  absenceStore.fetchAllAbsences();
}

async function applyFilters() {
  await absenceStore.getAbsencesByFilter(filterParams.value);
}

// Other event handlers
function handlePageChange(page: number) {
  pagination.value.page = page;
}

function handleAddAbsenceClick() {
  if (canCreateAbsence.value) {
    resetAbsenceForm();
    showAbsenceModal.value = true;
  } else {
    message.warning(
      'You need to have students and subjects configured in the system first.'
    );
  }
}

function handleEditAbsence(absence: Absence) {
  editingAbsence.value = absence;
  absenceForm.value = {
    date: new Date(absence.date),
    status: absence.status,
    reason: absence.reason || '',
    isExcused: absence.isExcused,
    studentId: absence.studentId,
    subjectId: absence.subjectId,
  };
  showAbsenceModal.value = true;
}

function handleDeleteItem(absence: Absence) {
  itemToDelete.value = absence;
  showDeleteConfirm.value = true;
}

function cancelDelete() {
  itemToDelete.value = null;
  showDeleteConfirm.value = false;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    await absenceStore.deleteAbsence(itemToDelete.value.id);
    message.success('Absence record deleted successfully');
  } catch (error: any) {
    message.error('Error deleting absence record: ' + error.message);
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
}

async function handleSubmitAbsence(validatedData: any) {
  try {
    submittingAbsence.value = true;

    if (editingAbsence.value) {
      await absenceStore.updateAbsence(editingAbsence.value.id, validatedData);
      message.success('Absence record updated successfully');
    } else {
      await absenceStore.createAbsence(validatedData);
      message.success('Absence record created successfully');
    }

    showAbsenceModal.value = false;
    resetAbsenceForm();
  } catch (error: any) {
    message.error(
      `Failed to ${editingAbsence.value ? 'update' : 'create'} absence record: ${error.message}`
    );
  } finally {
    submittingAbsence.value = false;
  }
}

function resetAbsenceForm() {
  absenceForm.value = {
    date: new Date(),
    status: AbsenceStatus.Absent,
    reason: '',
    isExcused: false,
    studentId: '',
    subjectId: null,
  };
  editingAbsence.value = null;
  if (absenceFormRef.value) {
    absenceFormRef.value.restoreValidation();
  }
}

// Initialize data
onMounted(async () => {
  if (!academicStore.initialized) {
    // Let the academic store coordinate initialization
    await academicStore.initializeStore();
  }

  // Fetch required data
  if (academicStore.isHigherEd)
    await studentStore.fetchStudentsByUniversity(
      academicStore.institutionIdentifier
    );
  // await subjectStore.fetchSubjects();
  await absenceStore.fetchAllAbsences();
});
</script>
