<!-- components/academic/TeacherGradeAssignmentsTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Header with Institution Context -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white"
        >
          <Icon name="ph:graduation-cap" class="text-xl" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-text-primary m-0">
            Teacher Grade Assignments
          </h2>
          <p class="text-sm text-text-secondary mt-1">
            Manage
            {{
              isHigherEducationInstitution ? 'faculty' : 'teacher'
            }}
            assignments to
            {{ isHigherEducationInstitution ? 'courses' : 'grade levels' }} and
            homeroom classes
          </p>
        </div>
      </div>
      <!-- Institution Type Indicator & Actions -->
      <div class="flex items-center gap-3">
        <n-tag
          :type="isHigherEducationInstitution ? 'info' : 'success'"
          size="medium"
          class="flex-shrink-0"
        >
          <Icon
            :name="
              isHigherEducationInstitution
                ? 'ph:university'
                : 'ph:chalkboard-teacher'
            "
            class="mr-1"
          />
          {{ institutionTypeLabel }}
        </n-tag>

        <n-button
          type="primary"
          :disabled="!canManageAssignments"
          size="large"
          @click="handleBulkAssignClick"
        >
          <template #icon>
            <Icon name="ph:users-three" />
          </template>
          Bulk Assign
        </n-button>
      </div>
    </div>

    <!-- Prerequisites Warning -->
    <n-alert v-if="!canManageAssignments" type="warning" class="mb-6">
      <template #icon>
        <Icon name="ph:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">Before managing assignments:</div>
        <div v-if="!hasActiveInstitution" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>You need to have an active institution selected</span>
        </div>
        <div v-if="!hasTeachers" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span>You need to have teachers in the system</span>
        </div>
        <div v-if="!hasGrades" class="flex items-center gap-2">
          <Icon name="ph:x-circle" class="text-red-500 flex-shrink-0" />
          <span
            >You need to have
            {{ isHigherEducationInstitution ? 'courses' : 'grades' }} in the
            system</span
          >
        </div>
      </div>
    </n-alert>

    <!-- Assignment Overview Cards -->
    <div
      v-if="canManageAssignments"
      class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
    >
      <n-card size="small" class="text-center">
        <div class="flex flex-col items-center">
          <Icon
            name="ph:chalkboard-teacher"
            class="text-2xl text-primary mb-2"
          />
          <div class="text-lg font-semibold">{{ totalTeachers }}</div>
          <div class="text-sm text-text-secondary">
            Total {{ isHigherEducationInstitution ? 'Faculty' : 'Teachers' }}
          </div>
        </div>
      </n-card>

      <n-card size="small" class="text-center">
        <div class="flex flex-col items-center">
          <Icon name="ph:graduation-cap" class="text-2xl text-warning mb-2" />
          <div class="text-lg font-semibold">{{ totalGrades }}</div>
          <div class="text-sm text-text-secondary">
            {{ isHigherEducationInstitution ? 'Courses' : 'Grade Levels' }}
          </div>
        </div>
      </n-card>

      <n-card size="small" class="text-center">
        <div class="flex flex-col items-center">
          <Icon name="ph:link" class="text-2xl text-success mb-2" />
          <div class="text-lg font-semibold">{{ assignedTeachers }}</div>
          <div class="text-sm text-text-secondary">
            Assigned {{ isHigherEducationInstitution ? 'Faculty' : 'Teachers' }}
          </div>
        </div>
      </n-card>

      <n-card size="small" class="text-center">
        <div class="flex flex-col items-center">
          <Icon name="ph:house" class="text-2xl text-info mb-2" />
          <div class="text-lg font-semibold">{{ homeroomTeachers }}</div>
          <div class="text-sm text-text-secondary">
            Homeroom {{ isHigherEducationInstitution ? 'Advisors' : 'Teachers' }}
          </div>
        </div>
      </n-card>
    </div>

    <!-- Assignment Management Tabs -->
    <n-tabs
      v-if="canManageAssignments"
      v-model:value="activeTab"
      type="line"
      animated
      size="large"
      class="mb-6"
      @update:value="handleTabChange"
    >
      <n-tab-pane name="assignments" tab="Current Assignments">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:list" />
            Current Assignments
            <n-badge
              v-if="currentAssignments.length > 0"
              :value="currentAssignments.length"
              type="info"
              :max="999"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane name="unassigned" tab="Unassigned">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:user-minus" />
            Unassigned {{ isHigherEducationInstitution ? 'Faculty' : 'Teachers' }}
            <n-badge
              v-if="unassignedTeachers.length > 0"
              :value="unassignedTeachers.length"
              type="warning"
              :max="99"
            />
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane name="bulk" tab="Bulk Operations">
        <template #tab>
          <div class="flex items-center gap-2">
            <Icon name="ph:users-three" />
            Bulk Operations
          </div>
        </template>
      </n-tab-pane>
    </n-tabs>

    <!-- Search and Filters -->
    <div v-if="canManageAssignments" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Search Input -->
        <n-input-group>
          <n-input
            v-model:value="searchQuery"
            placeholder="Search teachers or grades..."
            clearable
            @update:value="handleSearchUpdate"
          >
            <template #prefix>
              <Icon name="ph:magnifying-glass" />
            </template>
          </n-input>
          <n-button
            :loading="isLoadingTeachers"
            type="primary"
            ghost
            @click="handleSearch"
          >
            Search
          </n-button>
        </n-input-group>

        <!-- Assignment Status Filter -->
        <n-select
          v-model:value="assignmentStatusFilter"
          placeholder="Filter by assignment status"
          :options="assignmentStatusOptions"
          clearable
          @update:value="handleFilterChange"
        >
          <template #prefix>
            <Icon name="ph:funnel" />
          </template>
        </n-select>

        <!-- Grade Filter -->
        <n-select
          v-model:value="gradeFilter"
          :placeholder="`Filter by ${isHigherEducationInstitution ? 'course' : 'grade'}`"
          :options="gradeFilterOptions"
          clearable
          @update:value="handleFilterChange"
        >
          <template #prefix>
            <Icon name="ph:graduation-cap" />
          </template>
        </n-select>
      </div>

      <!-- Quick Actions Bar -->
      <div
        class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
      >
        <div v-if="!hasActiveFilters" class="flex items-center gap-4">
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
            :disabled="selectedTeachers.length === 0"
            @click="handleBulkUnassign"
          >
            <template #icon>
              <Icon name="ph:user-minus" />
            </template>
            Unassign Selected
          </n-button>

          <n-button size="small" @click="handleExportAssignments">
            <template #icon>
              <Icon name="ph:download" />
            </template>
            Export
          </n-button>
        </div>
      </div>
    </div>

    <!-- Assignment Content Based on Active Tab -->
    <div v-if="canManageAssignments">
      <!-- Current Assignments Tab -->
      <div
        v-if="activeTab === 'assignments'"
        class="bg-background-card rounded-xl shadow-sm border border-border overflow-hidden"
      >
        <n-data-table
          ref="assignmentsTable"
          :columns="assignmentColumns"
          :data="filteredAssignments"
          :loading="isLoadingAssignments"
          :row-key="(row) => row.teacherId"
          :scroll-x="1400"
          class="min-h-[400px]"
          :row-props="assignmentRowProps"
          @update:checked-row-keys="handleTeacherSelection"
        >
          <template #empty>
            <div class="text-center py-12">
              <Icon
                name="ph:clipboard-text"
                class="text-6xl text-text-secondary mb-4 mx-auto"
              />
              <h3 class="text-lg font-medium text-text-primary mb-2">
                No
                {{
                  isHigherEducationInstitution ? 'faculty' : 'teachers'
                }}
                found
              </h3>
              <p class="text-text-secondary mb-4">
                {{
                  hasActiveFilters
                    ? `No results found for your search criteria`
                    : `No ${isHigherEducationInstitution ? 'faculty' : 'teacher'} assignments exist yet`
                }}
              </p>
            </div>
          </template>
        </n-data-table>
      </div>

      <!-- Unassigned Teachers Tab -->
      <div
        v-else-if="activeTab === 'unassigned'"
        class="bg-background-card rounded-xl shadow-sm border border-border overflow-hidden"
      >
        <n-data-table
          ref="unassignedTable"
          :columns="unassignedColumns"
          :data="filteredUnassignedTeachers"
          :loading="isLoadingTeachers"
          :row-key="(row) => row.id"
          :scroll-x="1200"
          class="min-h-[400px]"
        >
          <template #empty>
            <div class="text-center py-12">
              <Icon
                name="ph:check-circle"
                class="text-6xl text-success mb-4 mx-auto"
              />
              <h3 class="text-lg font-medium text-text-primary mb-2">
                All
                {{ isHigherEducationInstitution ? 'faculty' : 'teachers' }} are
                assigned!
              </h3>
              <p class="text-text-secondary mb-4">
                Every
                {{
                  isHigherEducationInstitution ? 'faculty member' : 'teacher'
                }}
                has at least one
                {{
                  isHigherEducationInstitution ? 'course' : 'grade'
                }}
                assignment.
              </p>
            </div>
          </template>
        </n-data-table>
      </div>

      <!-- Bulk Operations Tab -->
      <div v-else-if="activeTab === 'bulk'" class="space-y-6">
        <BulkAssignmentSection
          :teachers="allTeachers"
          :grades="allGrades"
          :is-higher-education="isHigherEducationInstitution"
          @assign="handleBulkAssignment"
        />
      </div>
    </div>

    <!-- Single Assignment Modal -->
    <n-modal
      v-model:show="showAssignmentModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      :title="`Manage Assignments - ${selectedTeacherForAssignment?.firstName} ${selectedTeacherForAssignment?.lastName}`"
      :closable="!submittingAssignment"
      :mask-closable="!submittingAssignment"
    >
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <TeacherAssignmentForm
          :loading="submittingAssignment"
          :teacher="selectedTeacherForAssignment"
          :current-assignments="currentTeacherAssignments"
          :available-grades="availableGrades"
          :is-higher-education="isHigherEducationInstitution"
          @submit="handleSubmitAssignment"
          @cancel="handleCancelAssignment"
        />
      </div>
    </n-modal>

    <!-- Bulk Assignment Modal -->
    <n-modal
      v-model:show="showBulkModal"
      preset="card"
      style="width: 70rem; max-height: 90vh"
      title="Bulk Assignment Operations"
      :closable="!submittingBulkAssignment"
      :mask-closable="!submittingBulkAssignment"
    >
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <BulkAssignmentForm
          :loading="submittingBulkAssignment"
          :teachers="selectedTeachersForBulk"
          :available-grades="availableGrades"
          :is-higher-education="isHigherEducationInstitution"
          @submit="handleSubmitBulkAssignment"
          @cancel="handleCancelBulkAssignment"
        />
      </div>
    </n-modal>

    <!-- Unassign Confirmation Dialog -->
    <n-modal
      v-model:show="showUnassignConfirm"
      preset="dialog"
      type="warning"
      title="Confirm Grade Unassignment"
      positive-text="Unassign"
      negative-text="Cancel"
      @positive-click="confirmUnassign"
      @negative-click="cancelUnassign"
    >
      <template #icon>
        <Icon name="ph:warning-diamond" class="text-warning" />
      </template>
      <div class="py-2">
        <p class="mb-4">
          Are you sure you want to unassign the selected
          {{ isHigherEducationInstitution ? 'faculty' : 'teacher' }}(s) from
          their
          {{ isHigherEducationInstitution ? 'course' : 'grade' }} assignments?
        </p>

        <n-alert type="warning" class="mb-4" title="Important">
          This will remove their teaching responsibilities for the selected
          {{ isHigherEducationInstitution ? 'courses' : 'grades' }}. Students in
          those {{ isHigherEducationInstitution ? 'courses' : 'grades' }} will
          temporarily have no assigned
          {{ isHigherEducationInstitution ? 'instructor' : 'teacher' }}.
        </n-alert>

        <div
          v-if="itemsToUnassign.length > 0"
          class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
        >
          <div class="text-sm font-medium mb-2">Affected assignments:</div>
          <div class="space-y-1">
            <div
              v-for="item in itemsToUnassign.slice(0, 5)"
              :key="`${item.teacherId}-${item.gradeId}`"
              class="text-sm text-text-secondary"
            >
              {{ item.teacherName }} → {{ item.gradeName }}
            </div>
            <div
              v-if="itemsToUnassign.length > 5"
              class="text-sm text-text-secondary italic"
            >
              ... and {{ itemsToUnassign.length - 5 }} more
            </div>
          </div>
        </div>
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
  type GradeAssignmentResponseDto,
} from '~/stores/teacher';
import { useInstitutionStore } from '~/stores/institution';
import { useGradeStore } from '~/stores/grade';
import { isHigherEducation as checkIsHigherEducation } from '~/utils/institution-helper';
import TeacherAssignmentForm from './forms/TeacherAssignmentForm.vue';
import BulkAssignmentForm from './forms/BulkAssignmentForm.vue';
import BulkAssignmentSection from './sections/BulkAssignmentSection.vue';

// Stores and utilities
const academicStore = useAcademicStore();
const teacherStore = useTeacherStore();
const institutionStore = useInstitutionStore();
const gradeStore = useGradeStore();
const message = useMessage();

// Institution type detection
const activeInstitution = computed(() => institutionStore.activeInstitution);
const isHigherEducationInstitution = computed(() =>
  checkIsHigherEducation(activeInstitution.value?.type)
);
const institutionTypeLabel = computed(() =>
  isHigherEducationInstitution.value ? 'Higher Education' : 'K-12 School'
);

// Tab state
const activeTab = ref('assignments');

// Search and filter state
const searchQuery = ref('');
const assignmentStatusFilter = ref<string | null>(null);
const gradeFilter = ref<string | null>(null);
const selectedTeachers = ref<string[]>([]);

// State for modals and forms
const showAssignmentModal = ref(false);
const submittingAssignment = ref(false);
const selectedTeacherForAssignment = ref<Teacher | null>(null);
const currentTeacherAssignments = ref<GradeAssignmentResponseDto[]>([]);

const showBulkModal = ref(false);
const submittingBulkAssignment = ref(false);
const selectedTeachersForBulk = ref<Teacher[]>([]);

const showUnassignConfirm = ref(false);
const itemsToUnassign = ref<
  {
    teacherId: string;
    teacherName: string;
    gradeId: string;
    gradeName: string;
  }[]
>([]);

// Data from stores
const teachersQuery = teacherStore.teachersByInstitutionQuery(
  computed(() => activeInstitution.value?.id || null)
);
const allTeachers = computed(() => teachersQuery?.data.value || []);
const allGrades = computed(() => gradeStore.grades || []);

// Loading states
const isLoadingTeachers = computed(
  () => teachersQuery?.isLoading.value || false
);
const isLoadingAssignments = ref(false);

// Prerequisites checks
const hasActiveInstitution = computed(() => !!activeInstitution.value);
const hasTeachers = computed(() => allTeachers.value.length > 0);
const hasGrades = computed(() => allGrades.value.length > 0);

const canManageAssignments = computed(() => {
  return hasActiveInstitution.value && hasTeachers.value && hasGrades.value;
});

// Assignment data computation
const currentAssignments = computed(() => {
  return allTeachers.value
    .filter((teacher) => {
      // A teacher has assignments if they have:
      // 1. Subjects/courses assigned, OR
      // 2. A homeroom class (classGradeId), OR
      // 3. A department (for higher education)
      const hasSubjects = teacher.subjects?.length > 0;
      const hasHomeroom = !!teacher.classGradeId;
      const hasDepartment = !!teacher.departmentId;

      return hasSubjects || hasHomeroom || hasDepartment;
    })
    .map((teacher) => {
      // Get the grade name for homeroom
      const homeroomGrade = teacher.classGradeId
        ? allGrades.value.find((g) => g.id === teacher.classGradeId)
        : null;

      return {
        teacherId: teacher.id,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        email: teacher.email,
        title: teacher.title,
        assignments: teacher.subjects || [],
        homeroomClass: teacher.classGradeId,
        homeroomClassName: homeroomGrade?.name || null,
        department: teacher.departmentId,
        totalStudents: teacher.students?.length || 0,
        // Calculate total assignments including homeroom
        totalAssignmentCount:
          (teacher.subjects?.length || 0) + (teacher.classGradeId ? 1 : 0),
      };
    });
});

const unassignedTeachers = computed(() => {
  return allTeachers.value.filter((teacher) => {
    const hasSubjects = teacher.subjects?.length > 0;
    const hasHomeroom = !!teacher.classGradeId;
    const hasDepartment = !!teacher.departmentId;

    // Teacher is unassigned if they have none of the above
    return !hasSubjects && !hasHomeroom && !hasDepartment;
  });
});

// Statistics
const totalTeachers = computed(() => allTeachers.value.length);
const totalGrades = computed(() => allGrades.value.length);
const assignedTeachers = computed(() => currentAssignments.value.length);
const homeroomTeachers = computed(
  () => allTeachers.value.filter((t) => t.classGradeId).length
);

// Filter options
const assignmentStatusOptions = computed(() => [
  { label: 'Fully Assigned', value: 'fully-assigned' },
  { label: 'Partially Assigned', value: 'partially-assigned' },
  { label: 'Unassigned', value: 'unassigned' },
  { label: 'Homeroom Only', value: 'homeroom-only' },
]);

const gradeFilterOptions = computed(() => {
  return allGrades.value.map((grade) => ({
    label: grade.name || `Grade ${grade.id.substring(0, 4)}`,
    value: grade.id,
  }));
});

const availableGrades = computed(() => {
  return allGrades.value.map((grade) => ({
    label: grade.name || `Grade ${grade.id.substring(0, 4)}`,
    value: grade.id,
    disabled: false, // Could add logic for already assigned grades
  }));
});

// Filtered data
const hasActiveFilters = computed(() => {
  return !!(
    searchQuery.value ||
    assignmentStatusFilter.value ||
    gradeFilter.value
  );
});

const filteredAssignments = computed(() => {
  let assignments = [...currentAssignments.value];

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    assignments = assignments.filter(
      (assignment) =>
        assignment.teacherName.toLowerCase().includes(query) ||
        assignment.email?.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (assignmentStatusFilter.value) {
    assignments = assignments.filter((assignment) => {
      const status = assignmentStatusFilter.value;
      switch (status) {
        case 'fully-assigned':
          return assignment.assignments.length > 2;
        case 'partially-assigned':
          return (
            assignment.assignments.length > 0 &&
            assignment.assignments.length <= 2
          );
        case 'unassigned':
          return assignment.assignments.length === 0;
        case 'homeroom-only':
          return (
            assignment.homeroomClass && assignment.assignments.length === 0
          );
        default:
          return true;
      }
    });
  }

  return assignments;
});

const filteredUnassignedTeachers = computed(() => {
  let teachers = [...unassignedTeachers.value];

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    teachers = teachers.filter(
      (teacher) =>
        teacher.firstName?.toLowerCase().includes(query) ||
        teacher.lastName?.toLowerCase().includes(query) ||
        teacher.email?.toLowerCase().includes(query)
    );
  }

  return teachers;
});

// Table columns
const assignmentColumns = computed(() => [
  {
    type: 'selection',
    width: 50,
  },
  {
    title: isHigherEducationInstitution.value ? 'Faculty Member' : 'Teacher',
    key: 'teacher',
    width: 200,
    render(row: any) {
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
          h('div', { class: 'font-medium' }, row.teacherName),
          h('div', { class: 'text-xs text-text-secondary' }, row.email || '-'),
        ]),
      ]);
    },
  },
  {
    title: 'Title',
    key: 'title',
    width: 120,
    render(row: any) {
      return h(
        NTag,
        { type: 'info', size: 'small' },
        { default: () => row.title || 'N/A' }
      );
    },
  },
  {
    title: isHigherEducationInstitution.value
      ? 'Course Assignments'
      : 'Grade Assignments',
    key: 'assignments',
    width: 300,
    render(row: any) {
      const regularAssignments = row.assignments || [];
      const hasHomeroom = row.homeroomClass;
      const totalAssignments =
        regularAssignments.length + (hasHomeroom ? 1 : 0);

      if (totalAssignments === 0) {
        return h(
          NTag,
          { type: 'warning', size: 'small' },
          { default: () => 'No assignments' }
        );
      }

      const assignmentTags = [];

      // Add regular subject/course assignments
      regularAssignments.slice(0, 2).forEach((assignment: any) => {
        assignmentTags.push(
          h(
            NTag,
            { type: 'success', size: 'small', class: 'mb-1 mr-1' },
            {
              default: () => assignment.name || assignment.code || 'Assignment',
            }
          )
        );
      });

      // Add homeroom assignment if exists
      if (hasHomeroom) {
        assignmentTags.push(
          h(
            NTag,
            { type: 'warning', size: 'small', class: 'mb-1 mr-1' },
            {
              default: () =>
                h('div', { class: 'flex items-center gap-1' }, [
                  h(Icon, { name: 'ph:house', class: 'text-xs' }),
                  row.homeroomClassName || 'Homeroom',
                ]),
            }
          )
        );
      }

      // Add "more" indicator if there are additional assignments
      if (regularAssignments.length > 2) {
        assignmentTags.push(
          h(
            NTag,
            { type: 'info', size: 'small' },
            { default: () => `+${regularAssignments.length - 2} more` }
          )
        );
      }

      return h('div', { class: 'flex flex-wrap gap-1' }, assignmentTags);
    },
  },
  {
    title: 'Homeroom',
    key: 'homeroom',
    width: 150,
    render(row: any) {
      if (row.homeroomClass && row.homeroomClassName) {
        return h(
          NTag,
          { type: 'warning', size: 'small' },
          {
            default: () =>
              h('div', { class: 'flex items-center gap-1' }, [
                h(Icon, { name: 'ph:house', class: 'text-xs' }),
                row.homeroomClassName,
              ]),
          }
        );
      }
      return h(
        NTag,
        { type: 'default', size: 'small' },
        { default: () => 'None' }
      );
    },
  },
  {
    title: 'Students',
    key: 'students',
    width: 100,
    render(row: any) {
      return h(
        'div',
        { class: 'text-center font-medium' },
        row.totalStudents || 0
      );
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 160,
    render(row: any) {
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
              handleViewAssignments(row);
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
              handleEditAssignments(row);
            },
          },
          { icon: () => h(Icon, { name: 'ph:pencil' }) }
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
              handleUnassignTeacher(row);
            },
          },
          { icon: () => h(Icon, { name: 'ph:minus-circle' }) }
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

const unassignedColumns = computed(() => [
  {
    title: isHigherEducationInstitution.value ? 'Faculty Member' : 'Teacher',
    key: 'teacher',
    width: 250,
    render(row: Teacher) {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(
          'div',
          {
            class:
              'w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center',
          },
          [h(Icon, { name: 'ph:user-minus', class: 'text-warning' })]
        ),
        h('div', {}, [
          h(
            'div',
            { class: 'font-medium' },
            `${row.firstName} ${row.lastName}`
          ),
          h('div', { class: 'text-xs text-text-secondary' }, row.email || '-'),
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
    title: 'Status',
    key: 'status',
    width: 150,
    render() {
      return h(
        NTag,
        { type: 'warning', size: 'small' },
        {
          default: () =>
            `No ${isHigherEducationInstitution.value ? 'course' : 'grade'} assignments`,
        }
      );
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    render(row: Teacher) {
      return h(
        NButton,
        {
          type: 'primary',
          size: 'small',
          onClick: () => handleAssignTeacher(row),
        },
        {
          icon: () => h(Icon, { name: 'ph:plus' }),
          default: () => 'Assign',
        }
      );
    },
  },
]);

// Event handlers
function handleTabChange(tab: string) {
  activeTab.value = tab;
  searchQuery.value = '';
  assignmentStatusFilter.value = null;
  gradeFilter.value = null;
}

function handleSearchUpdate(value: string) {
  searchQuery.value = value;
}

function handleSearch() {
  // Search is reactive, no additional action needed
}

function handleFilterChange() {
  // Filters are reactive, no additional action needed
}

function handleClearAllFilters() {
  searchQuery.value = '';
  assignmentStatusFilter.value = null;
  gradeFilter.value = null;
}

function handleTeacherSelection(keys: string[]) {
  selectedTeachers.value = keys;
}

function assignmentRowProps(row: any) {
  return {
    onClick: () => handleViewAssignments(row),
    style: 'cursor: pointer;',
  };
}

function formatResultsText() {
  const total =
    activeTab.value === 'assignments'
      ? filteredAssignments.value.length
      : filteredUnassignedTeachers.value.length;

  const type =
    activeTab.value === 'assignments' ? 'assignments' : 'unassigned teachers';

  return `Showing ${total} ${type}`;
}

// Assignment management functions
async function handleViewAssignments(assignment: any) {
  try {
    const teacher = allTeachers.value.find(
      (t) => t.id === assignment.teacherId
    );
    if (!teacher) return;

    const assignments = await teacherStore.getTeacherAssignedGrades(teacher.id);

    selectedTeacherForAssignment.value = teacher;
    currentTeacherAssignments.value = assignments || [];
    showAssignmentModal.value = true;
  } catch (error: any) {
    message.error(`Failed to load assignments: ${error.message}`);
  }
}

async function handleEditAssignments(assignment: any) {
  try {
    const teacher = allTeachers.value.find(
      (t) => t.id === assignment.teacherId
    );
    if (!teacher) return;

    const assignments = await teacherStore.getTeacherAssignedGrades(teacher.id);

    selectedTeacherForAssignment.value = teacher;
    currentTeacherAssignments.value = assignments || [];
    showAssignmentModal.value = true;
  } catch (error: any) {
    message.error(`Failed to load assignments: ${error.message}`);
  }
}

function handleAssignTeacher(teacher: Teacher) {
  selectedTeacherForAssignment.value = teacher;
  currentTeacherAssignments.value = [];
  showAssignmentModal.value = true;
}

function handleUnassignTeacher(assignment: any) {
  itemsToUnassign.value = assignment.assignments.map((grade: any) => ({
    teacherId: assignment.teacherId,
    teacherName: assignment.teacherName,
    gradeId: grade.id,
    gradeName: grade.name,
  }));
  showUnassignConfirm.value = true;
}

function handleBulkAssignClick() {
  selectedTeachersForBulk.value = [];
  showBulkModal.value = true;
}

function handleBulkUnassign() {
  if (selectedTeachers.value.length === 0) {
    message.warning('Please select teachers to unassign');
    return;
  }

  itemsToUnassign.value = selectedTeachers.value.flatMap((teacherId) => {
    const assignment = currentAssignments.value.find(
      (a) => a.teacherId === teacherId
    );
    if (!assignment) return [];

    return assignment.assignments.map((grade: any) => ({
      teacherId,
      teacherName: assignment.teacherName,
      gradeId: grade.id,
      gradeName: grade.name,
    }));
  });

  showUnassignConfirm.value = true;
}

async function handleSubmitAssignment(assignmentData: any) {
  if (!selectedTeacherForAssignment.value) return;

  try {
    submittingAssignment.value = true;

    await teacherStore.updateTeacherGradeAssignments(
      selectedTeacherForAssignment.value.id,
      { gradeIds: assignmentData.gradeIds }
    );

    message.success('Assignments updated successfully');
    showAssignmentModal.value = false;

    // Refresh data
    await teachersQuery?.refetch();
  } catch (error: any) {
    message.error(`Failed to update assignments: ${error.message}`);
  } finally {
    submittingAssignment.value = false;
  }
}

function handleCancelAssignment() {
  showAssignmentModal.value = false;
  selectedTeacherForAssignment.value = null;
  currentTeacherAssignments.value = [];
}

async function handleSubmitBulkAssignment(bulkData: any) {
  try {
    submittingBulkAssignment.value = true;

    // Process bulk assignments
    for (const assignment of bulkData.assignments) {
      await teacherStore.assignTeacherToGrades(assignment.teacherId, {
        gradeIds: assignment.gradeIds,
      });
    }

    message.success(
      `Bulk assignment completed for ${bulkData.assignments.length} teachers`
    );
    showBulkModal.value = false;

    // Refresh data
    await teachersQuery?.refetch();
  } catch (error: any) {
    message.error(`Failed to complete bulk assignment: ${error.message}`);
  } finally {
    submittingBulkAssignment.value = false;
  }
}

function handleCancelBulkAssignment() {
  showBulkModal.value = false;
  selectedTeachersForBulk.value = [];
}

async function confirmUnassign() {
  try {
    // Group by teacher ID
    const unassignmentsByTeacher = itemsToUnassign.value.reduce(
      (acc, item) => {
        if (!acc[item.teacherId]) {
          acc[item.teacherId] = [];
        }
        acc[item.teacherId].push(item.gradeId);
        return acc;
      },
      {} as Record<string, string[]>
    );

    // Process unassignments
    for (const [teacherId, gradeIds] of Object.entries(
      unassignmentsByTeacher
    )) {
      await teacherStore.unassignTeacherFromGrades(teacherId, { gradeIds });
    }

    message.success('Teachers unassigned successfully');
    showUnassignConfirm.value = false;
    itemsToUnassign.value = [];

    // Refresh data
    await teachersQuery?.refetch();
  } catch (error: any) {
    message.error(`Failed to unassign teachers: ${error.message}`);
  }
}

function cancelUnassign() {
  showUnassignConfirm.value = false;
  itemsToUnassign.value = [];
}

function handleBulkAssignment(data: any) {
  // Handle bulk assignment from section component
  console.log('Bulk assignment data:', data);
}

function handleExportAssignments() {
  message.info('Export functionality coming soon');
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

  // Load teachers
  if (canManageAssignments.value) {
    await teachersQuery?.refetch();
  }
});

// Watch for institution changes
watch(
  () => activeInstitution.value?.id,
  async (newInstitutionId) => {
    if (newInstitutionId) {
      await gradeStore.fetchGradesByInstitution(newInstitutionId);
      await teachersQuery?.refetch();
    }
  }
);
</script>

<style scoped>
/* Same styling patterns as TeachersTab.vue */
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
