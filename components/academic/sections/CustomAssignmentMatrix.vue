<!-- components/academic/sections/CustomAssignmentMatrix.vue -->
<template>
  <div class="custom-assignment-matrix">
    <!-- Matrix Header -->
    <div class="matrix-header">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold">Custom Assignment Matrix</h3>
          <p class="text-sm text-text-secondary">
            Manually configure each
            {{
              isHigherEducationInstitution ? "faculty member's" : "teacher's"
            }}
            {{ isHigherEducationInstitution ? 'course' : 'grade' }} assignments
          </p>
        </div>
        <div class="flex items-center gap-2">
          <n-button size="small" @click="selectAllTeachers">
            <template #icon>
              <Icon name="ph:check-square" />
            </template>
            Select All
          </n-button>
          <n-button size="small" @click="clearAllAssignments">
            <template #icon>
              <Icon name="ph:x-square" />
            </template>
            Clear All
          </n-button>
          <n-button size="small" @click="autoFillSuggestions">
            <template #icon>
              <Icon name="ph:magic-wand" />
            </template>
            Auto Fill
          </n-button>
        </div>
      </div>

      <!-- Matrix Controls -->
      <div class="matrix-controls mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <n-form-item label="Filter Teachers" size="small">
            <n-input
              v-model:value="teacherFilter"
              placeholder="Search teachers..."
              clearable
              size="small"
            >
              <template #prefix>
                <Icon name="ph:magnifying-glass" />
              </template>
            </n-input>
          </n-form-item>

          <n-form-item
            :label="`Filter ${isHigherEducationInstitution ? 'Courses' : 'Grades'}`"
            size="small"
          >
            <n-input
              v-model:value="gradeFilter"
              :placeholder="`Search ${isHigherEducationInstitution ? 'courses' : 'grades'}...`"
              clearable
              size="small"
            >
              <template #prefix>
                <Icon name="ph:graduation-cap" />
              </template>
            </n-input>
          </n-form-item>

          <n-form-item label="Assignment Mode" size="small">
            <n-select
              v-model:value="assignmentMode"
              :options="assignmentModeOptions"
              size="small"
            />
          </n-form-item>
        </div>
      </div>
    </div>

    <!-- Assignment Statistics -->
    <div class="assignment-stats mb-4">
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-label">Total Assignments:</span>
          <span class="stat-value">{{ totalAssignments }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label"
            >Assigned
            {{ isHigherEducationInstitution ? 'Faculty' : 'Teachers' }}:</span
          >
          <span class="stat-value">{{ assignedTeachersCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label"
            >Avg per
            {{ isHigherEducationInstitution ? 'Faculty' : 'Teacher' }}:</span
          >
          <span class="stat-value">{{ averageAssignments.toFixed(1) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Homeroom Assignments:</span>
          <span class="stat-value">{{ homeroomAssignments }}</span>
        </div>
      </div>
    </div>

    <!-- Assignment Matrix Table -->
    <div class="matrix-container">
      <div class="matrix-table-wrapper">
        <table class="assignment-matrix-table">
          <!-- Table Header -->
          <thead>
            <tr>
              <th class="teacher-header-cell">
                <div class="header-content">
                  <span>{{
                    isHigherEducationInstitution ? 'Faculty' : 'Teacher'
                  }}</span>
                  <div class="header-actions">
                    <n-button
                      quaternary
                      circle
                      size="tiny"
                      @click="toggleTeacherSort"
                    >
                      <Icon
                        :name="
                          teacherSortAsc
                            ? 'ph:sort-ascending'
                            : 'ph:sort-descending'
                        "
                      />
                    </n-button>
                  </div>
                </div>
              </th>
              <th
                v-for="grade in filteredGrades"
                :key="grade.value"
                class="grade-header-cell"
              >
                <div class="grade-header-content">
                  <div class="grade-name">{{ grade.label }}</div>
                  <div class="grade-actions">
                    <n-button
                      quaternary
                      circle
                      size="tiny"
                      :type="
                        isGradeFullyAssigned(grade.value as string)
                          ? 'success'
                          : 'default'
                      "
                      @click="toggleGradeAssignment(grade.value as string)"
                    >
                      <Icon name="ph:users" />
                    </n-button>
                    <n-popover trigger="hover" placement="top">
                      <template #trigger>
                        <n-button quaternary circle size="tiny">
                          <Icon name="ph:info" />
                        </n-button>
                      </template>
                      <div class="grade-info-popover">
                        <div>
                          <strong>{{ grade.label }}</strong>
                        </div>
                        <div class="text-sm text-text-secondary mt-1">
                          Assigned to
                          {{ getGradeAssignmentCount(grade.value as string) }}
                          {{
                            isHigherEducationInstitution
                              ? 'faculty'
                              : 'teachers'
                          }}
                        </div>
                      </div>
                    </n-popover>
                  </div>
                </div>
              </th>
              <th class="actions-header-cell">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody>
            <tr
              v-for="teacher in filteredTeachers"
              :key="teacher.id"
              class="teacher-row"
              :class="{
                'teacher-highlighted': isTeacherHighlighted(teacher.id),
              }"
            >
              <!-- Teacher Info Cell -->
              <td class="teacher-info-cell">
                <div class="teacher-info">
                  <div class="teacher-avatar">
                    <Icon name="ph:chalkboard-teacher" class="text-primary" />
                  </div>
                  <div class="teacher-details">
                    <div class="teacher-name">
                      {{ teacher.firstName }} {{ teacher.lastName }}
                    </div>
                    <div class="teacher-meta">
                      {{
                        teacher.title ||
                        (isHigherEducationInstitution ? 'Faculty' : 'Teacher')
                      }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Assignment Cells -->
              <td
                v-for="grade in filteredGrades"
                :key="`${teacher.id}-${grade.value}`"
                class="assignment-cell"
              >
                <div class="assignment-controls">
                  <!-- Regular Assignment Checkbox -->
                  <n-checkbox
                    :checked="
                      isTeacherAssignedToGrade(
                        teacher.id,
                        grade.value as string
                      )
                    "
                    @update:checked="
                      (checked) =>
                        toggleAssignment(
                          teacher.id,
                          grade.value as string,
                          checked
                        )
                    "
                  />

                  <!-- Homeroom Assignment Button -->
                  <n-button
                    quaternary
                    circle
                    size="tiny"
                    :type="
                      isTeacherHomeroomForGrade(
                        teacher.id,
                        grade.value as string
                      )
                        ? 'warning'
                        : 'default'
                    "
                    :disabled="
                      !isTeacherAssignedToGrade(
                        teacher.id,
                        grade.value as string
                      )
                    "
                    @click="
                      toggleHomeroomAssignment(
                        teacher.id,
                        grade.value as string
                      )
                    "
                  >
                    <Icon name="ph:house" />
                  </n-button>
                </div>
              </td>

              <!-- Teacher Actions Cell -->
              <td class="teacher-actions-cell">
                <div class="teacher-actions">
                  <n-dropdown
                    :options="getTeacherActionOptions(teacher)"
                    @select="(key) => handleTeacherAction(key, teacher)"
                  >
                    <n-button quaternary circle size="small">
                      <Icon name="ph:dots-three-vertical" />
                    </n-button>
                  </n-dropdown>
                  <div class="assignment-count">
                    {{ getTeacherAssignmentCount(teacher.id) }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Assignment Summary -->
    <div class="assignment-summary mt-6">
      <n-card title="Assignment Summary" size="small">
        <div class="summary-content">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Teachers Summary -->
            <div class="summary-section">
              <h4 class="summary-title">
                <Icon name="ph:chalkboard-teacher" class="text-primary" />
                {{
                  isHigherEducationInstitution ? 'Faculty' : 'Teacher'
                }}
                Summary
              </h4>
              <div class="summary-list">
                <div
                  v-for="teacher in teachersWithAssignments"
                  :key="teacher.id"
                  class="summary-item"
                >
                  <span class="summary-name"
                    >{{ teacher.firstName }} {{ teacher.lastName }}</span
                  >
                  <div class="summary-tags">
                    <n-tag
                      v-for="gradeId in localAssignments[teacher.id] || []"
                      :key="gradeId"
                      size="small"
                      :type="
                        isTeacherHomeroomForGrade(teacher.id, gradeId)
                          ? 'warning'
                          : 'success'
                      "
                    >
                      {{ getGradeName(gradeId) }}
                      <Icon
                        v-if="isTeacherHomeroomForGrade(teacher.id, gradeId)"
                        name="ph:house"
                        class="ml-1"
                      />
                    </n-tag>
                  </div>
                </div>
              </div>
            </div>

            <!-- Grades Summary -->
            <div class="summary-section">
              <h4 class="summary-title">
                <Icon name="ph:graduation-cap" class="text-info" />
                {{ isHigherEducationInstitution ? 'Course' : 'Grade' }} Summary
              </h4>
              <div class="summary-list">
                <div
                  v-for="grade in gradesWithAssignments"
                  :key="grade.value"
                  class="summary-item"
                >
                  <span class="summary-name">{{ grade.label }}</span>
                  <div class="summary-info">
                    <span class="assignment-count"
                      >{{ getGradeAssignmentCount(grade.value as string) }}
                      {{
                        isHigherEducationInstitution ? 'faculty' : 'teachers'
                      }}</span
                    >
                    <n-tag
                      v-if="getGradeHomeroomTeacher(grade.value as string)"
                      size="small"
                      type="warning"
                    >
                      <Icon name="ph:house" class="mr-1" />
                      Homeroom
                    </n-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import type { TeacherResponseDto as Teacher } from '~/stores/teacher';
import type { SelectOption, DropdownOption } from 'naive-ui';
import { Icon } from '#components';

interface Props {
  teachers: Teacher[];
  grades: SelectOption[];
  assignments: Record<string, string[]>;
  isHigherEducationInstitution: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:assignments', assignments: Record<string, string[]>): void;
}>();

// Utilities
const message = useMessage();

// Local state
const teacherFilter = ref('');
const gradeFilter = ref('');
const assignmentMode = ref<'single' | 'multiple' | 'homeroom'>('multiple');
const teacherSortAsc = ref(true);
const localAssignments = ref<Record<string, string[]>>({
  ...props.assignments,
});
const homeroomAssignments = ref<Record<string, string>>({}); // gradeId -> teacherId

// Helper function to safely remove property from reactive object
function removeProperty<T extends Record<string, any>>(obj: T, key: string): T {
  const { [key]: _, ...rest } = obj;
  return rest as T;
}

// Assignment mode options
const assignmentModeOptions = computed(() => [
  { label: 'Multiple Assignments', value: 'multiple' },
  { label: 'Single Assignment', value: 'single' },
  { label: 'Homeroom Only', value: 'homeroom' },
]);

// Filtered data
const filteredTeachers = computed(() => {
  let filtered = [...props.teachers];

  if (teacherFilter.value) {
    const query = teacherFilter.value.toLowerCase();
    filtered = filtered.filter(
      (teacher) =>
        teacher.firstName?.toLowerCase().includes(query) ||
        teacher.lastName?.toLowerCase().includes(query) ||
        teacher.email?.toLowerCase().includes(query)
    );
  }

  // Sort teachers
  filtered.sort((a, b) => {
    const aName = `${a.firstName} ${a.lastName}`;
    const bName = `${b.firstName} ${b.lastName}`;
    const result = aName.localeCompare(bName);
    return teacherSortAsc.value ? result : -result;
  });

  return filtered;
});

const filteredGrades = computed(() => {
  let filtered = [...props.grades];

  if (gradeFilter.value) {
    const query = gradeFilter.value.toLowerCase();
    filtered = filtered.filter((grade) =>
      grade.label.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Assignment statistics
const totalAssignments = computed(() => {
  return Object.values(localAssignments.value).reduce(
    (sum, assignments) => sum + assignments.length,
    0
  );
});

const assignedTeachersCount = computed(() => {
  return Object.values(localAssignments.value).filter(
    (assignments) => assignments.length > 0
  ).length;
});

const averageAssignments = computed(() => {
  const teachersWithAssignments = assignedTeachersCount.value;
  return teachersWithAssignments > 0
    ? totalAssignments.value / teachersWithAssignments
    : 0;
});

const teachersWithAssignments = computed(() => {
  return props.teachers.filter(
    (teacher) => localAssignments.value[teacher.id]?.length > 0
  );
});

const gradesWithAssignments = computed(() => {
  return props.grades.filter(
    (grade) => getGradeAssignmentCount(grade.value as string) > 0
  );
});

// Helper functions
function getGradeName(gradeId: string): string {
  const grade = props.grades.find((g) => g.value === gradeId);
  return grade?.label || 'Unknown';
}

function isTeacherAssignedToGrade(teacherId: string, gradeId: string): boolean {
  return localAssignments.value[teacherId]?.includes(gradeId) || false;
}

function isTeacherHomeroomForGrade(
  teacherId: string,
  gradeId: string
): boolean {
  return homeroomAssignments.value[gradeId] === teacherId;
}

function isGradeFullyAssigned(gradeId: string): boolean {
  return getGradeAssignmentCount(gradeId) >= 3; // Assuming 3+ teachers is "fully assigned"
}

function isTeacherHighlighted(teacherId: string): boolean {
  // Highlight teachers with no assignments
  return (
    !localAssignments.value[teacherId] ||
    localAssignments.value[teacherId].length === 0
  );
}

function getGradeAssignmentCount(gradeId: string): number {
  return Object.values(localAssignments.value).filter((assignments) =>
    assignments.includes(gradeId)
  ).length;
}

function getTeacherAssignmentCount(teacherId: string): number {
  return localAssignments.value[teacherId]?.length || 0;
}

function getGradeHomeroomTeacher(gradeId: string): Teacher | null {
  const teacherId = homeroomAssignments.value[gradeId];
  if (!teacherId) return null;
  return props.teachers.find((t) => t.id === teacherId) || null;
}

function getTeacherActionOptions(teacher: Teacher): DropdownOption[] {
  const assignmentCount = getTeacherAssignmentCount(teacher.id);

  return [
    {
      label: 'Assign to All',
      key: 'assign-all',
      icon: () => h(Icon, { name: 'ph:check-square' }),
    },
    {
      label: 'Clear All',
      key: 'clear-all',
      icon: () => h(Icon, { name: 'ph:x-square' }),
    },
    {
      type: 'divider',
      key: 'divider1',
    },
    {
      label: 'Copy Assignments',
      key: 'copy',
      icon: () => h(Icon, { name: 'ph:copy' }),
      disabled: assignmentCount === 0,
    },
    {
      label: 'Paste Assignments',
      key: 'paste',
      icon: () => h(Icon, { name: 'ph:clipboard' }),
    },
    {
      type: 'divider',
      key: 'divider2',
    },
    {
      label: 'Smart Suggest',
      key: 'suggest',
      icon: () => h(Icon, { name: 'ph:magic-wand' }),
    },
  ];
}

// Assignment management functions
function toggleAssignment(
  teacherId: string,
  gradeId: string,
  checked: boolean
) {
  if (!localAssignments.value[teacherId]) {
    localAssignments.value[teacherId] = [];
  }

  if (checked) {
    // Add assignment
    if (!localAssignments.value[teacherId].includes(gradeId)) {
      if (assignmentMode.value === 'single') {
        // Single assignment mode - replace existing
        localAssignments.value[teacherId] = [gradeId];
      } else {
        // Multiple assignment mode - add to existing
        localAssignments.value[teacherId].push(gradeId);
      }
    }
  } else {
    // Remove assignment
    localAssignments.value[teacherId] = localAssignments.value[
      teacherId
    ].filter((id) => id !== gradeId);

    // Also remove homeroom if no longer assigned to grade
    if (homeroomAssignments.value[gradeId] === teacherId) {
      homeroomAssignments.value = removeProperty(
        homeroomAssignments.value,
        gradeId
      );
    }
  }

  emitAssignmentsUpdate();
}

function toggleHomeroomAssignment(teacherId: string, gradeId: string) {
  if (isTeacherHomeroomForGrade(teacherId, gradeId)) {
    // Remove homeroom assignment
    homeroomAssignments.value = removeProperty(
      homeroomAssignments.value,
      gradeId
    );
  } else {
    // Assign homeroom (remove from any other teacher first)
    const currentHomeroomTeacher = homeroomAssignments.value[gradeId];
    if (currentHomeroomTeacher) {
      homeroomAssignments.value = removeProperty(
        homeroomAssignments.value,
        gradeId
      );
    }
    homeroomAssignments.value[gradeId] = teacherId;
  }

  emitAssignmentsUpdate();
}

function toggleGradeAssignment(gradeId: string) {
  const currentCount = getGradeAssignmentCount(gradeId);

  if (currentCount === 0) {
    // Assign all teachers to this grade
    props.teachers.forEach((teacher) => {
      if (!localAssignments.value[teacher.id]) {
        localAssignments.value[teacher.id] = [];
      }
      if (!localAssignments.value[teacher.id].includes(gradeId)) {
        localAssignments.value[teacher.id].push(gradeId);
      }
    });
    message.success(
      `Assigned all ${props.isHigherEducationInstitution ? 'faculty' : 'teachers'} to ${getGradeName(gradeId)}`
    );
  } else {
    // Unassign all teachers from this grade
    Object.keys(localAssignments.value).forEach((teacherId) => {
      localAssignments.value[teacherId] = localAssignments.value[
        teacherId
      ].filter((id) => id !== gradeId);
    });
    // Remove homeroom assignment
    homeroomAssignments.value = removeProperty(
      homeroomAssignments.value,
      gradeId
    );
    message.success(
      `Unassigned all ${props.isHigherEducationInstitution ? 'faculty' : 'teachers'} from ${getGradeName(gradeId)}`
    );
  }

  emitAssignmentsUpdate();
}

function toggleTeacherSort() {
  teacherSortAsc.value = !teacherSortAsc.value;
}

function selectAllTeachers() {
  props.teachers.forEach((teacher) => {
    if (!localAssignments.value[teacher.id]) {
      localAssignments.value[teacher.id] = [];
    }
    props.grades.forEach((grade) => {
      const gradeId = grade.value as string;
      if (!localAssignments.value[teacher.id].includes(gradeId)) {
        localAssignments.value[teacher.id].push(gradeId);
      }
    });
  });

  emitAssignmentsUpdate();
  message.success('Assigned all teachers to all grades');
}

function clearAllAssignments() {
  localAssignments.value = {};
  homeroomAssignments.value = {};
  emitAssignmentsUpdate();
  message.success('Cleared all assignments');
}

function autoFillSuggestions() {
  // Simple auto-fill algorithm
  const unassignedTeachers = props.teachers.filter(
    (teacher) =>
      !localAssignments.value[teacher.id] ||
      localAssignments.value[teacher.id].length === 0
  );

  unassignedTeachers.forEach((teacher, index) => {
    const maxAssignments = 3;
    const startGradeIndex = index % props.grades.length;
    const assignments = [];

    for (let i = 0; i < Math.min(maxAssignments, props.grades.length); i++) {
      const gradeIndex = (startGradeIndex + i) % props.grades.length;
      assignments.push(props.grades[gradeIndex].value as string);
    }

    localAssignments.value[teacher.id] = assignments;

    // Assign homeroom to some teachers
    if (index % 3 === 0 && assignments.length > 0) {
      const homeroomGradeId = assignments[0];
      if (!homeroomAssignments.value[homeroomGradeId]) {
        homeroomAssignments.value[homeroomGradeId] = teacher.id;
      }
    }
  });

  emitAssignmentsUpdate();
  message.success(
    `Auto-filled assignments for ${unassignedTeachers.length} ${props.isHigherEducationInstitution ? 'faculty' : 'teachers'}`
  );
}

function handleTeacherAction(key: string, teacher: Teacher) {
  switch (key) {
    case 'assign-all':
      assignTeacherToAllGrades(teacher);
      break;
    case 'clear-all':
      clearTeacherAssignments(teacher);
      break;
    case 'copy':
      copyTeacherAssignments(teacher);
      break;
    case 'paste':
      pasteTeacherAssignments(teacher);
      break;
    case 'suggest':
      suggestTeacherAssignments(teacher);
      break;
  }
}

function assignTeacherToAllGrades(teacher: Teacher) {
  localAssignments.value[teacher.id] = props.grades.map(
    (g) => g.value as string
  );
  emitAssignmentsUpdate();
  message.success(
    `Assigned ${teacher.firstName} ${teacher.lastName} to all ${props.isHigherEducationInstitution ? 'courses' : 'grades'}`
  );
}

function clearTeacherAssignments(teacher: Teacher) {
  localAssignments.value[teacher.id] = [];
  // Remove any homeroom assignments
  const gradesToRemove: string[] = [];
  Object.entries(homeroomAssignments.value).forEach(([gradeId, teacherId]) => {
    if (teacherId === teacher.id) {
      gradesToRemove.push(gradeId);
    }
  });

  gradesToRemove.forEach((gradeId) => {
    homeroomAssignments.value = removeProperty(
      homeroomAssignments.value,
      gradeId
    );
  });

  emitAssignmentsUpdate();
  message.success(
    `Cleared assignments for ${teacher.firstName} ${teacher.lastName}`
  );
}

let copiedAssignments: string[] = [];

function copyTeacherAssignments(teacher: Teacher) {
  copiedAssignments = [...(localAssignments.value[teacher.id] || [])];
  message.success(
    `Copied assignments for ${teacher.firstName} ${teacher.lastName}`
  );
}

function pasteTeacherAssignments(teacher: Teacher) {
  if (copiedAssignments.length === 0) {
    message.warning('No assignments to paste');
    return;
  }
  localAssignments.value[teacher.id] = [...copiedAssignments];
  emitAssignmentsUpdate();
  message.success(
    `Pasted assignments to ${teacher.firstName} ${teacher.lastName}`
  );
}

function suggestTeacherAssignments(teacher: Teacher) {
  // Simple suggestion algorithm based on specialization
  const suggestions = [];
  const maxSuggestions = 3;

  // For demo purposes, randomly select grades
  const availableGrades = props.grades.map((g) => g.value as string);
  const startIndex = Math.floor(Math.random() * availableGrades.length);

  for (let i = 0; i < Math.min(maxSuggestions, availableGrades.length); i++) {
    const gradeIndex = (startIndex + i) % availableGrades.length;
    suggestions.push(availableGrades[gradeIndex]);
  }

  localAssignments.value[teacher.id] = suggestions;
  emitAssignmentsUpdate();
  message.success(
    `Applied smart suggestions for ${teacher.firstName} ${teacher.lastName}`
  );
}

function emitAssignmentsUpdate() {
  emit('update:assignments', { ...localAssignments.value });
}

// Watch for props changes
watch(
  () => props.assignments,
  (newAssignments) => {
    localAssignments.value = { ...newAssignments };
  },
  { deep: true }
);

onMounted(() => {
  console.log('CustomAssignmentMatrix mounted', {
    teachers: props.teachers.length,
    grades: props.grades.length,
    initialAssignments: props.assignments,
  });
});
</script>

<style scoped>
.custom-assignment-matrix {
  background: var(--background-color, #ffffff);
  border-radius: 12px;
  padding: 20px;
}

.matrix-header h3 {
  margin: 0;
  color: var(--text-color-1, #1f2937);
}

.matrix-controls {
  background: rgba(var(--primary-color-rgb, 74, 222, 128), 0.05);
  border: 1px solid rgba(var(--primary-color-rgb, 74, 222, 128), 0.1);
  border-radius: 8px;
  padding: 16px;
}

.assignment-stats {
  background: rgba(var(--info-color-rgb, 59, 130, 246), 0.05);
  border: 1px solid rgba(var(--info-color-rgb, 59, 130, 246), 0.1);
  border-radius: 8px;
  padding: 12px;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: var(--text-color-3, #9ca3af);
  display: block;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color, #4ade80);
  display: block;
}

.matrix-container {
  background: var(--background-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
}

.matrix-table-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 600px;
}

.assignment-matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.assignment-matrix-table th,
.assignment-matrix-table td {
  border: 1px solid var(--border-color, #e5e7eb);
  padding: 8px;
  text-align: center;
  vertical-align: middle;
}

.teacher-header-cell {
  position: sticky;
  left: 0;
  background: var(--background-color-secondary, #f8fafc);
  min-width: 200px;
  z-index: 10;
}

.grade-header-cell {
  background: var(--background-color-secondary, #f8fafc);
  min-width: 120px;
  position: sticky;
  top: 0;
  z-index: 5;
}

.actions-header-cell {
  background: var(--background-color-secondary, #f8fafc);
  min-width: 80px;
  position: sticky;
  top: 0;
  right: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.grade-header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.grade-name {
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  line-height: 1.3;
}

.grade-actions {
  display: flex;
  gap: 2px;
}

.teacher-info-cell {
  position: sticky;
  left: 0;
  background: var(--background-color, #ffffff);
  z-index: 5;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
}

.teacher-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(var(--primary-color-rgb, 74, 222, 128), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.teacher-details {
  flex: 1;
  min-width: 0;
}

.teacher-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-color-1, #1f2937);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.teacher-meta {
  font-size: 11px;
  color: var(--text-color-3, #9ca3af);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.assignment-cell {
  background: var(--background-color, #ffffff);
  width: 120px;
}

.assignment-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.teacher-actions-cell {
  position: sticky;
  right: 0;
  background: var(--background-color, #ffffff);
  z-index: 5;
}

.teacher-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.assignment-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-color, #4ade80);
  background: rgba(var(--primary-color-rgb, 74, 222, 128), 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 20px;
  text-align: center;
}

.teacher-row:hover {
  background: rgba(var(--primary-color-rgb, 74, 222, 128), 0.02);
}

.teacher-highlighted {
  background: rgba(var(--warning-color-rgb, 245, 158, 11), 0.05);
}

.grade-info-popover {
  max-width: 200px;
}

.assignment-summary {
  margin-top: 24px;
}

.summary-content {
  max-height: 300px;
  overflow-y: auto;
}

.summary-section {
  background: rgba(var(--background-color-rgb, 248, 250, 252), 0.5);
  border-radius: 8px;
  padding: 16px;
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-color-1, #1f2937);
}

.summary-list {
  space-y: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color, #f3f4f6);
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-name {
  font-weight: 500;
  color: var(--text-color-1, #374151);
  font-size: 13px;
}

.summary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.summary-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .custom-assignment-matrix {
    background: var(--background-color, #1f2937);
  }

  .assignment-matrix-table th {
    background: var(--background-color-secondary, #374151);
  }

  .teacher-info-cell,
  .assignment-cell,
  .teacher-actions-cell {
    background: var(--background-color, #1f2937);
  }

  .teacher-highlighted {
    background: rgba(var(--warning-color-rgb, 245, 158, 11), 0.1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .matrix-table-wrapper {
    font-size: 12px;
  }

  .teacher-header-cell {
    min-width: 150px;
  }

  .grade-header-cell {
    min-width: 100px;
  }

  .grade-name {
    font-size: 11px;
  }

  .teacher-name {
    font-size: 12px;
  }

  .teacher-meta {
    font-size: 10px;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
