<!-- components/academic/sections/BulkUnassignmentSection.vue -->
<template>
  <div class="bulk-unassignment-section">
    <!-- Section Header -->
    <div class="section-header mb-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="header-icon">
          <Icon name="ph:user-minus" class="text-xl" />
        </div>
        <div>
          <h3 class="text-lg font-semibold">Bulk Unassignment Operations</h3>
          <p class="text-sm text-text-secondary">
            Remove
            {{ isHigherEducationInstitution ? 'faculty' : 'teachers' }} from
            multiple
            {{
              isHigherEducationInstitution ? 'courses' : 'grades'
            }}
            simultaneously
          </p>
        </div>
      </div>

      <!-- Warning Alert -->
      <n-alert type="warning" title="Important Warning" class="mb-4">
        <div class="space-y-2">
          <p>
            Bulk unassignment operations will affect multiple
            {{
              isHigherEducationInstitution ? 'faculty members' : 'teachers'
            }}
            and their
            {{
              isHigherEducationInstitution ? 'course' : 'grade'
            }}
            responsibilities.
          </p>
          <ul class="text-sm list-disc list-inside space-y-1 ml-4">
            <li>
              Students may temporarily lose assigned
              {{ isHigherEducationInstitution ? 'instructors' : 'teachers' }}
            </li>
            <li>Homeroom assignments will also be removed</li>
            <li>This action affects gradebooks and attendance records</li>
            <li>
              Consider reassigning
              {{ isHigherEducationInstitution ? 'faculty' : 'teachers' }} before
              removing them
            </li>
          </ul>
        </div>
      </n-alert>
    </div>

    <!-- Unassignment Strategy Selection -->
    <n-card title="Unassignment Strategy" class="mb-6">
      <template #header-extra>
        <Icon name="ph:strategy" class="text-gray-400" />
      </template>

      <div class="strategy-selection">
        <n-radio-group v-model:value="unassignmentStrategy" size="medium">
          <n-space vertical>
            <n-radio value="by-teacher">
              <div class="strategy-option">
                <div class="strategy-header">
                  <Icon name="ph:user-focus" class="text-primary" />
                  <span class="strategy-title"
                    >By
                    {{
                      isHigherEducationInstitution ? 'Faculty' : 'Teacher'
                    }}</span
                  >
                </div>
                <p class="strategy-description">
                  Select
                  {{
                    isHigherEducationInstitution
                      ? 'faculty members'
                      : 'teachers'
                  }}
                  and remove them from specific
                  {{ isHigherEducationInstitution ? 'courses' : 'grades' }}
                </p>
              </div>
            </n-radio>

            <n-radio value="by-grade">
              <div class="strategy-option">
                <div class="strategy-header">
                  <Icon name="ph:graduation-cap" class="text-info" />
                  <span class="strategy-title"
                    >By
                    {{
                      isHigherEducationInstitution ? 'Course' : 'Grade'
                    }}</span
                  >
                </div>
                <p class="strategy-description">
                  Select
                  {{ isHigherEducationInstitution ? 'courses' : 'grades' }} and
                  remove all assigned
                  {{ isHigherEducationInstitution ? 'faculty' : 'teachers' }}
                </p>
              </div>
            </n-radio>

            <n-radio value="by-criteria">
              <div class="strategy-option">
                <div class="strategy-header">
                  <Icon name="ph:funnel" class="text-warning" />
                  <span class="strategy-title">By Criteria</span>
                </div>
                <p class="strategy-description">
                  Use filters to automatically select
                  {{
                    isHigherEducationInstitution ? 'faculty' : 'teachers'
                  }}
                  and
                  {{ isHigherEducationInstitution ? 'courses' : 'grades' }} for
                  unassignment
                </p>
              </div>
            </n-radio>

            <n-radio value="homeroom-only">
              <div class="strategy-option">
                <div class="strategy-header">
                  <Icon name="ph:house-line" class="text-error" />
                  <span class="strategy-title">Homeroom Only</span>
                </div>
                <p class="strategy-description">
                  Remove only homeroom assignments while keeping
                  {{
                    isHigherEducationInstitution ? 'course' : 'grade'
                  }}
                  teaching responsibilities
                </p>
              </div>
            </n-radio>
          </n-space>
        </n-radio-group>
      </div>
    </n-card>

    <!-- Strategy-specific Content -->
    <div class="strategy-content">
      <!-- By Teacher Strategy -->
      <n-card
        v-if="unassignmentStrategy === 'by-teacher'"
        title="Select Teachers and Grades"
        class="mb-6"
      >
        <div class="space-y-6">
          <!-- Teacher Selection -->
          <n-form-item
            :label="`Select ${isHigherEducationInstitution ? 'Faculty Members' : 'Teachers'}`"
            class="themed-form-item"
          >
            <n-select
              v-model:value="selectedTeachers"
              :options="teacherOptions"
              multiple
              :placeholder="`Choose ${isHigherEducationInstitution ? 'faculty' : 'teachers'} to unassign`"
              clearable
              size="large"
              class="themed-select"
              :max-tag-count="3"
              filterable
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
            </n-select>
          </n-form-item>

          <!-- Grade Selection for Selected Teachers -->
          <div
            v-if="selectedTeachers.length > 0"
            class="teacher-grade-assignments"
          >
            <div
              v-for="teacherId in selectedTeachers"
              :key="teacherId"
              class="teacher-assignment-card"
            >
              <div class="teacher-assignment-header">
                <div class="teacher-info">
                  <Icon name="ph:chalkboard-teacher" class="text-primary" />
                  <span class="teacher-name">{{
                    getTeacherName(teacherId)
                  }}</span>
                  <n-tag size="small" type="info">
                    {{ getTeacherCurrentAssignments(teacherId).length }}
                    assignments
                  </n-tag>
                </div>
              </div>

              <div class="assignment-selection">
                <n-checkbox-group
                  v-model:value="teacherGradeSelections[teacherId]"
                >
                  <n-space>
                    <n-checkbox
                      v-for="gradeId in getTeacherCurrentAssignments(teacherId)"
                      :key="gradeId"
                      :value="gradeId"
                      :label="getGradeName(gradeId)"
                    >
                      <div class="grade-checkbox-content">
                        <span>{{ getGradeName(gradeId) }}</span>
                        <n-tag
                          v-if="isTeacherHomeroomForGrade(teacherId, gradeId)"
                          size="tiny"
                          type="warning"
                        >
                          <Icon name="ph:house" />
                        </n-tag>
                      </div>
                    </n-checkbox>
                  </n-space>
                </n-checkbox-group>
              </div>
            </div>
          </div>
        </div>
      </n-card>

      <!-- By Grade Strategy -->
      <n-card
        v-else-if="unassignmentStrategy === 'by-grade'"
        :title="`Select ${isHigherEducationInstitution ? 'Courses' : 'Grades'}`"
        class="mb-6"
      >
        <div class="space-y-6">
          <!-- Grade Selection -->
          <n-form-item
            :label="`Select ${isHigherEducationInstitution ? 'Courses' : 'Grades'}`"
            class="themed-form-item"
          >
            <n-select
              v-model:value="selectedGrades"
              :options="gradeOptions"
              multiple
              :placeholder="`Choose ${isHigherEducationInstitution ? 'courses' : 'grades'} to clear`"
              clearable
              size="large"
              class="themed-select"
              :max-tag-count="3"
              filterable
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
            </n-select>
          </n-form-item>

          <!-- Teachers for Selected Grades -->
          <div
            v-if="selectedGrades.length > 0"
            class="grade-teacher-assignments"
          >
            <div
              v-for="gradeId in selectedGrades"
              :key="gradeId"
              class="grade-assignment-card"
            >
              <div class="grade-assignment-header">
                <div class="grade-info">
                  <Icon name="ph:graduation-cap" class="text-info" />
                  <span class="grade-name">{{ getGradeName(gradeId) }}</span>
                  <n-tag size="small" type="info">
                    {{ getGradeAssignedTeachers(gradeId).length }}
                    {{ isHigherEducationInstitution ? 'faculty' : 'teachers' }}
                  </n-tag>
                </div>
              </div>

              <div class="teachers-list">
                <div class="teachers-grid">
                  <div
                    v-for="teacherId in getGradeAssignedTeachers(gradeId)"
                    :key="teacherId"
                    class="teacher-item"
                  >
                    <div class="teacher-item-content">
                      <Icon name="ph:chalkboard-teacher" class="text-primary" />
                      <span class="teacher-name">{{
                        getTeacherName(teacherId)
                      }}</span>
                      <n-tag
                        v-if="isTeacherHomeroomForGrade(teacherId, gradeId)"
                        size="tiny"
                        type="warning"
                      >
                        <Icon name="ph:house" />
                      </n-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-card>

      <!-- By Criteria Strategy -->
      <n-card
        v-else-if="unassignmentStrategy === 'by-criteria'"
        title="Unassignment Criteria"
        class="mb-6"
      >
        <div class="criteria-configuration">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Teacher Criteria -->
            <div class="criteria-section">
              <h4 class="criteria-title">
                <Icon name="ph:chalkboard-teacher" class="text-primary" />
                {{
                  isHigherEducationInstitution ? 'Faculty' : 'Teacher'
                }}
                Criteria
              </h4>
              <div class="space-y-3">
                <n-checkbox v-model:checked="criteria.unassignNewTeachers">
                  New
                  {{
                    isHigherEducationInstitution ? 'faculty' : 'teachers'
                  }}
                  (less than 6 months)
                </n-checkbox>
                <n-checkbox
                  v-model:checked="criteria.unassignOverloadedTeachers"
                >
                  Overloaded
                  {{
                    isHigherEducationInstitution ? 'faculty' : 'teachers'
                  }}
                  ({{ maxAssignmentsThreshold }}+ assignments)
                </n-checkbox>
                <n-checkbox
                  v-model:checked="criteria.unassignUnqualifiedTeachers"
                >
                  {{
                    isHigherEducationInstitution ? 'Faculty' : 'Teachers'
                  }}
                  without required qualifications
                </n-checkbox>
                <div v-if="isHigherEducationInstitution" class="ml-6">
                  <n-checkbox v-model:checked="criteria.unassignByDepartment">
                    Specific department
                    {{ isHigherEducationInstitution ? 'faculty' : 'teachers' }}
                  </n-checkbox>
                  <n-select
                    v-if="criteria.unassignByDepartment"
                    v-model:value="criteria.targetDepartmentId"
                    :options="departmentOptions"
                    placeholder="Select department"
                    class="mt-2"
                    size="small"
                  />
                </div>
              </div>
            </div>

            <!-- Grade Criteria -->
            <div class="criteria-section">
              <h4 class="criteria-title">
                <Icon name="ph:graduation-cap" class="text-info" />
                {{ isHigherEducationInstitution ? 'Course' : 'Grade' }} Criteria
              </h4>
              <div class="space-y-3">
                <n-checkbox v-model:checked="criteria.unassignEmptyGrades">
                  {{ isHigherEducationInstitution ? 'Courses' : 'Grades' }} with
                  no students
                </n-checkbox>
                <n-checkbox v-model:checked="criteria.unassignInactiveGrades">
                  Inactive
                  {{ isHigherEducationInstitution ? 'courses' : 'grades' }} (no
                  recent activity)
                </n-checkbox>
                <n-checkbox
                  v-model:checked="criteria.unassignOverstaffedGrades"
                >
                  Overstaffed
                  {{ isHigherEducationInstitution ? 'courses' : 'grades' }} ({{
                    maxTeachersPerGrade
                  }}+
                  {{ isHigherEducationInstitution ? 'faculty' : 'teachers' }})
                </n-checkbox>
                <n-checkbox
                  v-model:checked="criteria.unassignSpecificGradeTypes"
                >
                  Specific
                  {{ isHigherEducationInstitution ? 'course' : 'grade' }} types
                </n-checkbox>
                <div v-if="criteria.unassignSpecificGradeTypes" class="ml-6">
                  <n-checkbox-group v-model:value="criteria.targetGradeTypes">
                    <n-space vertical>
                      <n-checkbox value="elective"
                        >Elective
                        {{
                          isHigherEducationInstitution ? 'courses' : 'classes'
                        }}</n-checkbox
                      >
                      <n-checkbox value="advanced"
                        >Advanced
                        {{
                          isHigherEducationInstitution ? 'courses' : 'classes'
                        }}</n-checkbox
                      >
                      <n-checkbox value="remedial"
                        >Remedial
                        {{
                          isHigherEducationInstitution ? 'courses' : 'classes'
                        }}</n-checkbox
                      >
                    </n-space>
                  </n-checkbox-group>
                </div>
              </div>
            </div>
          </div>

          <!-- Criteria Thresholds -->
          <div class="criteria-thresholds mt-6">
            <h4 class="criteria-title">
              <Icon name="ph:sliders" class="text-warning" />
              Threshold Settings
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <n-form-item label="Max assignments per teacher" size="small">
                <n-input-number
                  v-model:value="maxAssignmentsThreshold"
                  :min="1"
                  :max="10"
                  size="small"
                />
              </n-form-item>
              <n-form-item
                :label="`Max ${isHigherEducationInstitution ? 'faculty' : 'teachers'} per ${isHigherEducationInstitution ? 'course' : 'grade'}`"
                size="small"
              >
                <n-input-number
                  v-model:value="maxTeachersPerGrade"
                  :min="1"
                  :max="10"
                  size="small"
                />
              </n-form-item>
              <n-form-item label="Inactive days threshold" size="small">
                <n-input-number
                  v-model:value="inactiveDaysThreshold"
                  :min="7"
                  :max="365"
                  size="small"
                />
              </n-form-item>
            </div>
          </div>

          <!-- Apply Criteria Button -->
          <div class="mt-6 text-center">
            <n-button
              type="warning"
              size="large"
              :loading="applyingCriteria"
              @click="applyCriteria"
            >
              <template #icon>
                <Icon name="ph:funnel" />
              </template>
              Apply Criteria & Preview
            </n-button>
          </div>
        </div>
      </n-card>

      <!-- Homeroom Only Strategy -->
      <n-card
        v-else-if="unassignmentStrategy === 'homeroom-only'"
        title="Homeroom Unassignment"
        class="mb-6"
      >
        <div class="space-y-6">
          <n-alert type="info" title="Homeroom Unassignment">
            This will remove homeroom assignments only, leaving
            {{ isHigherEducationInstitution ? 'course' : 'grade' }} teaching
            responsibilities intact.
          </n-alert>

          <!-- Homeroom Assignment Selection -->
          <div class="homeroom-assignments">
            <h4 class="mb-4">Current Homeroom Assignments</h4>
            <div class="homeroom-list">
              <div
                v-for="assignment in currentHomeroomAssignments"
                :key="`${assignment.teacherId}-${assignment.gradeId}`"
                class="homeroom-assignment-item"
              >
                <n-checkbox
                  :checked="
                    selectedHomeroomAssignments.includes(
                      `${assignment.teacherId}-${assignment.gradeId}`
                    )
                  "
                  @update:checked="
                    (checked) => toggleHomeroomSelection(assignment, checked)
                  "
                >
                  <div class="homeroom-assignment-content">
                    <div class="assignment-info">
                      <Icon name="ph:house" class="text-warning" />
                      <span class="teacher-name">{{
                        assignment.teacherName
                      }}</span>
                      <Icon name="ph:arrow-right" class="text-gray-400" />
                      <span class="grade-name">{{ assignment.gradeName }}</span>
                    </div>
                    <div class="assignment-meta">
                      <span class="student-count"
                        >{{ assignment.studentCount }} students</span
                      >
                    </div>
                  </div>
                </n-checkbox>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </div>

    <!-- Unassignment Preview -->
    <n-card
      v-if="unassignmentPreview.length > 0"
      title="Unassignment Preview"
      class="mb-6"
    >
      <template #header-extra>
        <div class="flex items-center gap-2">
          <Icon name="ph:eye" class="text-gray-400" />
          <n-button size="small" @click="clearPreview">
            <template #icon>
              <Icon name="ph:x" />
            </template>
            Clear
          </n-button>
        </div>
      </template>

      <div class="preview-content">
        <!-- Preview Statistics -->
        <div class="preview-stats mb-4">
          <div class="stats-grid">
            <div class="stat-card warning">
              <div class="stat-value">{{ previewStats.affectedTeachers }}</div>
              <div class="stat-label">
                {{
                  isHigherEducationInstitution ? 'Faculty' : 'Teachers'
                }}
                Affected
              </div>
            </div>
            <div class="stat-card error">
              <div class="stat-value">
                {{ previewStats.totalUnassignments }}
              </div>
              <div class="stat-label">Total Unassignments</div>
            </div>
            <div class="stat-card warning">
              <div class="stat-value">{{ previewStats.homeroomRemovals }}</div>
              <div class="stat-label">Homeroom Removals</div>
            </div>
            <div class="stat-card info">
              <div class="stat-value">{{ previewStats.affectedStudents }}</div>
              <div class="stat-label">Students Affected</div>
            </div>
          </div>
        </div>

        <!-- Unassignment Details -->
        <div class="unassignment-details">
          <div class="details-list max-h-64 overflow-y-auto">
            <div
              v-for="item in unassignmentPreview"
              :key="`${item.teacherId}-${item.gradeId}`"
              class="unassignment-item"
            >
              <div class="unassignment-info">
                <Icon name="ph:minus-circle" class="text-error" />
                <span class="teacher-name">{{ item.teacherName }}</span>
                <Icon name="ph:arrow-right" class="text-gray-400" />
                <span class="grade-name">{{ item.gradeName }}</span>
              </div>
              <div class="unassignment-tags">
                <n-tag size="small" type="error"> Remove Assignment </n-tag>
                <n-tag
                  v-if="item.isHomeroomRemoval"
                  size="small"
                  type="warning"
                >
                  <Icon name="ph:house" class="mr-1" />
                  Remove Homeroom
                </n-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirmation and Apply -->
        <div class="mt-6">
          <n-alert type="error" title="Confirmation Required" class="mb-4">
            <div class="space-y-2">
              <p>
                You are about to remove
                {{ previewStats.totalUnassignments }} assignments affecting
                {{ previewStats.affectedTeachers }}
                {{
                  isHigherEducationInstitution ? 'faculty members' : 'teachers'
                }}.
              </p>
              <n-checkbox v-model:checked="confirmUnassignment">
                I understand this action will affect student access to
                {{
                  isHigherEducationInstitution ? 'instructors' : 'teachers'
                }}
                and cannot be easily undone.
              </n-checkbox>
            </div>
          </n-alert>

          <div class="text-right">
            <n-space>
              <n-button @click="clearPreview"> Cancel </n-button>
              <n-button
                type="error"
                :loading="submittingUnassignment"
                :disabled="!confirmUnassignment"
                @click="submitUnassignment"
              >
                <template #icon>
                  <Icon name="ph:trash" />
                </template>
                Remove {{ previewStats.totalUnassignments }} Assignments
              </n-button>
            </n-space>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import type { TeacherResponseDto as Teacher } from '~/stores/teacher';

interface Props {
  teachers: Teacher[];
  isHigherEducationInstitution: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:selection', selection: any): void;
}>();

// Utilities
const message = useMessage();

// State
const unassignmentStrategy = ref<
  'by-teacher' | 'by-grade' | 'by-criteria' | 'homeroom-only'
>('by-teacher');
const selectedTeachers = ref<string[]>([]);
const selectedGrades = ref<string[]>([]);
const teacherGradeSelections = ref<Record<string, string[]>>({});
const selectedHomeroomAssignments = ref<string[]>([]);
const unassignmentPreview = ref<any[]>([]);
const confirmUnassignment = ref(false);
const submittingUnassignment = ref(false);
const applyingCriteria = ref(false);

// Criteria configuration
const criteria = ref({
  unassignNewTeachers: false,
  unassignOverloadedTeachers: false,
  unassignUnqualifiedTeachers: false,
  unassignByDepartment: false,
  targetDepartmentId: null,
  unassignEmptyGrades: false,
  unassignInactiveGrades: false,
  unassignOverstaffedGrades: false,
  unassignSpecificGradeTypes: false,
  targetGradeTypes: [],
});

const maxAssignmentsThreshold = ref(5);
const maxTeachersPerGrade = ref(4);
const inactiveDaysThreshold = ref(30);

// Mock data for demonstration
const mockGrades = ref([
  {
    value: 'grade-1',
    label: props.isHigherEducationInstitution
      ? 'Computer Science 101'
      : 'Grade 1',
  },
  {
    value: 'grade-2',
    label: props.isHigherEducationInstitution ? 'Mathematics 201' : 'Grade 2',
  },
  {
    value: 'grade-3',
    label: props.isHigherEducationInstitution ? 'Physics 301' : 'Grade 3',
  },
  {
    value: 'grade-4',
    label: props.isHigherEducationInstitution ? 'Chemistry 401' : 'Grade 4',
  },
]);

const mockAssignments = ref<Record<string, string[]>>({
  // teacherId -> gradeIds
});

const mockHomeroomAssignments = ref<Record<string, string>>({
  // gradeId -> teacherId
});

// Initialize mock data
onMounted(() => {
  // Create some mock assignments
  props.teachers.forEach((teacher, index) => {
    const assignmentCount = Math.floor(Math.random() * 3) + 1;
    const assignments = [];
    for (let i = 0; i < assignmentCount; i++) {
      const gradeIndex = (index + i) % mockGrades.value.length;
      assignments.push(mockGrades.value[gradeIndex].value);
    }
    mockAssignments.value[teacher.id] = assignments;

    // Some homeroom assignments
    if (index % 3 === 0 && assignments.length > 0) {
      mockHomeroomAssignments.value[assignments[0]] = teacher.id;
    }
  });
});

// Computed options
const teacherOptions = computed(() => {
  return props.teachers
    .filter((teacher) => mockAssignments.value[teacher.id]?.length > 0)
    .map((teacher) => ({
      label: `${teacher.firstName} ${teacher.lastName}`,
      value: teacher.id,
    }));
});

const gradeOptions = computed(() => {
  return mockGrades.value.filter(
    (grade) => getGradeAssignedTeachers(grade.value).length > 0
  );
});

const departmentOptions = computed(() => [
  { label: 'Computer Science', value: 'cs' },
  { label: 'Mathematics', value: 'math' },
  { label: 'Physics', value: 'physics' },
]);

const currentHomeroomAssignments = computed(() => {
  return Object.entries(mockHomeroomAssignments.value).map(
    ([gradeId, teacherId]) => {
      const teacher = props.teachers.find((t) => t.id === teacherId);
      const grade = mockGrades.value.find((g) => g.value === gradeId);
      return {
        teacherId,
        gradeId,
        teacherName: teacher
          ? `${teacher.firstName} ${teacher.lastName}`
          : 'Unknown',
        gradeName: grade?.label || 'Unknown',
        studentCount: Math.floor(Math.random() * 30) + 15, // Mock student count
      };
    }
  );
});

// Preview statistics
const previewStats = computed(() => {
  const affectedTeachers = new Set(
    unassignmentPreview.value.map((item) => item.teacherId)
  ).size;
  const totalUnassignments = unassignmentPreview.value.length;
  const homeroomRemovals = unassignmentPreview.value.filter(
    (item) => item.isHomeroomRemoval
  ).length;
  const affectedStudents = unassignmentPreview.value.reduce(
    (sum, item) => sum + (item.studentCount || 25),
    0
  );

  return {
    affectedTeachers,
    totalUnassignments,
    homeroomRemovals,
    affectedStudents,
  };
});

// Helper functions
function getTeacherName(teacherId: string): string {
  const teacher = props.teachers.find((t) => t.id === teacherId);
  return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
}

function getGradeName(gradeId: string): string {
  const grade = mockGrades.value.find((g) => g.value === gradeId);
  return grade?.label || 'Unknown';
}

function getTeacherCurrentAssignments(teacherId: string): string[] {
  return mockAssignments.value[teacherId] || [];
}

function getGradeAssignedTeachers(gradeId: string): string[] {
  return Object.entries(mockAssignments.value)
    .filter(([_, gradeIds]) => gradeIds.includes(gradeId))
    .map(([teacherId]) => teacherId);
}

function isTeacherHomeroomForGrade(
  teacherId: string,
  gradeId: string
): boolean {
  return mockHomeroomAssignments.value[gradeId] === teacherId;
}

function toggleHomeroomSelection(assignment: any, checked: boolean) {
  const key = `${assignment.teacherId}-${assignment.gradeId}`;
  if (checked) {
    if (!selectedHomeroomAssignments.value.includes(key)) {
      selectedHomeroomAssignments.value.push(key);
    }
  } else {
    selectedHomeroomAssignments.value =
      selectedHomeroomAssignments.value.filter((k) => k !== key);
  }
  updatePreview();
}

function updatePreview() {
  const preview = [];

  if (unassignmentStrategy.value === 'by-teacher') {
    selectedTeachers.value.forEach((teacherId) => {
      const selectedGradeIds = teacherGradeSelections.value[teacherId] || [];
      selectedGradeIds.forEach((gradeId) => {
        preview.push({
          teacherId,
          gradeId,
          teacherName: getTeacherName(teacherId),
          gradeName: getGradeName(gradeId),
          isHomeroomRemoval: isTeacherHomeroomForGrade(teacherId, gradeId),
          studentCount: Math.floor(Math.random() * 30) + 15,
        });
      });
    });
  } else if (unassignmentStrategy.value === 'by-grade') {
    selectedGrades.value.forEach((gradeId) => {
      const assignedTeachers = getGradeAssignedTeachers(gradeId);
      assignedTeachers.forEach((teacherId) => {
        preview.push({
          teacherId,
          gradeId,
          teacherName: getTeacherName(teacherId),
          gradeName: getGradeName(gradeId),
          isHomeroomRemoval: isTeacherHomeroomForGrade(teacherId, gradeId),
          studentCount: Math.floor(Math.random() * 30) + 15,
        });
      });
    });
  } else if (unassignmentStrategy.value === 'homeroom-only') {
    selectedHomeroomAssignments.value.forEach((key) => {
      const [teacherId, gradeId] = key.split('-');
      preview.push({
        teacherId,
        gradeId,
        teacherName: getTeacherName(teacherId),
        gradeName: getGradeName(gradeId),
        isHomeroomRemoval: true,
        studentCount: Math.floor(Math.random() * 30) + 15,
      });
    });
  }

  unassignmentPreview.value = preview;
}

async function applyCriteria() {
  applyingCriteria.value = true;

  try {
    // Apply criteria-based selection
    const preview = [];

    // Mock criteria application
    props.teachers.forEach((teacher) => {
      const assignments = mockAssignments.value[teacher.id] || [];

      assignments.forEach((gradeId) => {
        let shouldUnassign = false;

        if (
          criteria.value.unassignOverloadedTeachers &&
          assignments.length >= maxAssignmentsThreshold.value
        ) {
          shouldUnassign = true;
        }

        if (criteria.value.unassignEmptyGrades && Math.random() > 0.7) {
          // Mock empty grade check
          shouldUnassign = true;
        }

        if (shouldUnassign) {
          preview.push({
            teacherId: teacher.id,
            gradeId,
            teacherName: `${teacher.firstName} ${teacher.lastName}`,
            gradeName: getGradeName(gradeId),
            isHomeroomRemoval: isTeacherHomeroomForGrade(teacher.id, gradeId),
            studentCount: Math.floor(Math.random() * 30) + 15,
          });
        }
      });
    });

    unassignmentPreview.value = preview;
    message.success(
      `Applied criteria and found ${preview.length} unassignments`
    );
  } catch (error: any) {
    message.error(`Failed to apply criteria: ${error.message}`);
  } finally {
    applyingCriteria.value = false;
  }
}

function clearPreview() {
  unassignmentPreview.value = [];
  confirmUnassignment.value = false;
}

async function submitUnassignment() {
  submittingUnassignment.value = true;

  try {
    const unassignmentData = {
      type: 'bulk-unassign',
      unassignments: unassignmentPreview.value.map((item) => ({
        teacherId: item.teacherId,
        gradeId: item.gradeId,
        isHomeroomRemoval: item.isHomeroomRemoval,
      })),
      strategy: unassignmentStrategy.value,
    };

    emit('update:selection', unassignmentData);
    clearPreview();

    message.success(
      `Successfully removed ${unassignmentPreview.value.length} assignments`
    );
  } catch (error: any) {
    message.error(`Failed to submit unassignment: ${error.message}`);
  } finally {
    submittingUnassignment.value = false;
  }
}

// Watch for selection changes
watch(
  [selectedTeachers, selectedGrades, teacherGradeSelections],
  () => {
    updatePreview();
  },
  { deep: true }
);

onMounted(() => {
  console.log('BulkUnassignmentSection mounted', {
    teachers: props.teachers.length,
    isHigherEducationInstitution: props.isHigherEducationInstitution,
  });
});
</script>

<style scoped>
.bulk-unassignment-section {
  max-width: 100%;
}

.section-header {
  margin-bottom: 24px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    var(--error-color, #ef4444) 0%,
    var(--warning-color, #f59e0b) 100%
  );
  color: white;
}

.strategy-selection {
  background: rgba(var(--warning-color-rgb, 245, 158, 11), 0.05);
  border: 1px solid rgba(var(--warning-color-rgb, 245, 158, 11), 0.1);
  border-radius: 12px;
  padding: 20px;
}

.strategy-option {
  padding: 8px 0;
}

.strategy-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.strategy-title {
  font-weight: 600;
  color: var(--text-color-1, #1f2937);
}

.strategy-description {
  font-size: 14px;
  color: var(--text-color-2, #6b7280);
  margin: 0;
  line-height: 1.4;
}

.teacher-assignment-card,
.grade-assignment-card {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: var(--background-color, #ffffff);
}

.teacher-assignment-header,
.grade-assignment-header {
  margin-bottom: 12px;
}

.teacher-info,
.grade-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.teacher-name,
.grade-name {
  font-weight: 600;
  color: var(--text-color-1, #1f2937);
}

.assignment-selection {
  background: rgba(var(--info-color-rgb, 59, 130, 246), 0.05);
  border-radius: 6px;
  padding: 12px;
}

.grade-checkbox-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.teacher-item {
  background: rgba(var(--primary-color-rgb, 74, 222, 128), 0.05);
  border: 1px solid rgba(var(--primary-color-rgb, 74, 222, 128), 0.1);
  border-radius: 6px;
  padding: 8px;
}

.teacher-item-content {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.criteria-configuration {
  background: rgba(var(--error-color-rgb, 239, 68, 68), 0.05);
  border: 1px solid rgba(var(--error-color-rgb, 239, 68, 68), 0.1);
  border-radius: 12px;
  padding: 20px;
}

.criteria-section {
  background: var(--background-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  padding: 16px;
}

.criteria-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-color-1, #1f2937);
}

.criteria-thresholds {
  background: rgba(var(--warning-color-rgb, 245, 158, 11), 0.05);
  border: 1px solid rgba(var(--warning-color-rgb, 245, 158, 11), 0.1);
  border-radius: 8px;
  padding: 16px;
}

.homeroom-assignments {
  background: rgba(var(--warning-color-rgb, 245, 158, 11), 0.05);
  border-radius: 8px;
  padding: 16px;
}

.homeroom-list {
  max-height: 300px;
  overflow-y: auto;
}

.homeroom-assignment-item {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  background: var(--background-color, #ffffff);
}

.homeroom-assignment-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assignment-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.assignment-meta {
  font-size: 12px;
  color: var(--text-color-3, #9ca3af);
}

.preview-content {
  background: rgba(var(--error-color-rgb, 239, 68, 68), 0.05);
  border: 1px solid rgba(var(--error-color-rgb, 239, 68, 68), 0.1);
  border-radius: 12px;
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: var(--background-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
}

.stat-card.warning {
  border-color: var(--warning-color, #f59e0b);
}

.stat-card.error {
  border-color: var(--error-color, #ef4444);
}

.stat-card.info {
  border-color: var(--info-color, #3b82f6);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  display: block;
}

.stat-card.warning .stat-value {
  color: var(--warning-color, #f59e0b);
}

.stat-card.error .stat-value {
  color: var(--error-color, #ef4444);
}

.stat-card.info .stat-value {
  color: var(--info-color, #3b82f6);
}

.stat-label {
  font-size: 12px;
  color: var(--text-color-3, #9ca3af);
  margin-top: 4px;
}

.unassignment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--background-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  margin-bottom: 8px;
}

.unassignment-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unassignment-tags {
  display: flex;
  gap: 4px;
}

.student-count {
  font-size: 12px;
  color: var(--text-color-3, #9ca3af);
}

/* Same theming as other components */
:deep(.themed-form-item .n-form-item-label) {
  color: var(--color-text-primary) !important;
  font-weight: 600;
}

:deep(.themed-select .n-base-selection) {
  background-color: var(--color-background-secondary) !important;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .teacher-assignment-card,
  .grade-assignment-card,
  .criteria-section,
  .stat-card,
  .homeroom-assignment-item,
  .unassignment-item {
    background: var(--background-color, #374151);
    border-color: var(--border-color, #4b5563);
  }

  .strategy-title,
  .criteria-title,
  .teacher-name,
  .grade-name {
    color: var(--text-color-1, #f9fafb);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .teachers-grid {
    grid-template-columns: 1fr;
  }

  .unassignment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .unassignment-tags {
    align-self: flex-end;
  }
}
</style>
