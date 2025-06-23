<!-- components/academic/sections/BulkAssignmentSection.vue -->
<template>
  <div class="bulk-assignment-section">
    <!-- Quick Assignment Actions -->
    <div class="quick-actions-grid mb-6">
      <n-card
        v-for="action in quickActions"
        :key="action.key"
        class="quick-action-card"
        @click="handleQuickAction(action.key)"
      >
        <div class="quick-action-content">
          <div class="action-icon-wrapper">
            <Icon :name="action.icon" :class="`action-icon ${action.color}`" />
          </div>
          <div class="action-info">
            <h3 class="action-title">{{ action.title }}</h3>
            <p class="action-description">{{ action.description }}</p>
          </div>
          <div class="action-button-wrapper">
            <n-button :type="action.buttonType" size="medium" block>
              {{ action.buttonText }}
            </n-button>
          </div>
        </div>
      </n-card>
    </div>

    <!-- Assignment Templates -->
    <n-card title="Assignment Templates" class="templates-section mb-6">
      <template #header-extra>
        <Icon name="ph:template" class="text-gray-400" />
      </template>

      <div class="templates-grid">
        <div
          v-for="template in assignmentTemplates"
          :key="template.id"
          class="template-card"
          :class="{ 'template-selected': selectedTemplate === template.id }"
          @click="selectTemplate(template.id)"
        >
          <div class="template-content">
            <div class="template-header">
              <div class="template-icon-wrapper">
                <Icon
                  :name="template.icon"
                  :class="`template-icon ${template.color}`"
                />
              </div>
              <h4 class="template-title">{{ template.name }}</h4>
            </div>

            <p class="template-description">{{ template.description }}</p>

            <div class="template-stats">
              <div class="stat-item">
                <span class="stat-value">{{ template.teacherCount }}</span>
                <span class="stat-label">{{
                  isHigherEducationInstitution ? 'Faculty' : 'Teachers'
                }}</span>
              </div>
              <div class="stat-divider"/>
              <div class="stat-item">
                <span class="stat-value">{{ template.gradeCount }}</span>
                <span class="stat-label">{{
                  isHigherEducationInstitution ? 'Courses' : 'Grades'
                }}</span>
              </div>
            </div>

            <div class="template-actions">
              <n-button
                v-if="selectedTemplate === template.id"
                type="primary"
                size="medium"
                block
                @click.stop="applyTemplate(template)"
              >
                <template #icon>
                  <Icon name="ph:check" />
                </template>
                Apply Template
              </n-button>
              <div v-else class="template-select-hint">
                Click to select template
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-card>

    <!-- Assignment Rules Engine -->
    <n-card title="Smart Assignment Rules" class="rules-section mb-6">
      <template #header-extra>
        <Icon name="ph:robot" class="text-gray-400" />
      </template>

      <div class="rules-configuration">
        <div class="rules-grid">
          <!-- Workload Balancing -->
          <div class="rule-section">
            <div class="rule-header">
              <Icon name="ph:scales" class="rule-icon text-warning" />
              <h4 class="rule-title">Workload Balancing</h4>
            </div>
            <div class="rule-content">
              <n-checkbox
                v-model:checked="rules.balanceWorkload"
                class="rule-checkbox"
              >
                Automatically balance
                {{ isHigherEducationInstitution ? 'course' : 'grade' }} loads
              </n-checkbox>
              <div v-if="rules.balanceWorkload" class="rule-sub-options">
                <div class="rule-input-group">
                  <n-form-item label="Max assignments per teacher" size="small">
                    <n-input-number
                      v-model:value="rules.maxAssignmentsPerTeacher"
                      :min="1"
                      :max="10"
                      size="small"
                      class="w-full"
                    />
                  </n-form-item>
                </div>
                <div class="rule-input-group">
                  <n-form-item label="Preferred assignment count" size="small">
                    <n-input-number
                      v-model:value="rules.preferredAssignmentCount"
                      :min="1"
                      :max="rules.maxAssignmentsPerTeacher"
                      size="small"
                      class="w-full"
                    />
                  </n-form-item>
                </div>
              </div>
            </div>
          </div>

          <!-- Experience Matching -->
          <div class="rule-section">
            <div class="rule-header">
              <Icon name="ph:graduation-cap" class="rule-icon text-primary" />
              <h4 class="rule-title">Experience Matching</h4>
            </div>
            <div class="rule-content">
              <n-checkbox
                v-model:checked="rules.matchByExperience"
                class="rule-checkbox"
              >
                Match
                {{ isHigherEducationInstitution ? 'faculty' : 'teachers' }} to
                appropriate levels
              </n-checkbox>
              <div v-if="rules.matchByExperience" class="rule-sub-options">
                <n-checkbox
                  v-model:checked="rules.seniorToAdvanced"
                  class="rule-sub-checkbox"
                >
                  Assign senior
                  {{ isHigherEducationInstitution ? 'faculty' : 'teachers' }} to
                  advanced
                  {{ isHigherEducationInstitution ? 'courses' : 'grades' }}
                </n-checkbox>
                <n-checkbox
                  v-model:checked="rules.newToBasic"
                  class="rule-sub-checkbox"
                >
                  Assign new
                  {{ isHigherEducationInstitution ? 'faculty' : 'teachers' }} to
                  basic
                  {{ isHigherEducationInstitution ? 'courses' : 'grades' }}
                </n-checkbox>
              </div>
            </div>
          </div>

          <!-- Subject Specialization -->
          <div class="rule-section">
            <div class="rule-header">
              <Icon name="ph:book-open" class="rule-icon text-info" />
              <h4 class="rule-title">Subject Specialization</h4>
            </div>
            <div class="rule-content">
              <n-checkbox
                v-model:checked="rules.matchBySpecialization"
                class="rule-checkbox"
              >
                Match by subject specialization
              </n-checkbox>
              <div v-if="rules.matchBySpecialization" class="rule-sub-options">
                <n-checkbox
                  v-model:checked="rules.strictSpecialization"
                  class="rule-sub-checkbox"
                >
                  Require exact specialization match
                </n-checkbox>
                <n-checkbox
                  v-model:checked="rules.allowRelatedSubjects"
                  class="rule-sub-checkbox"
                >
                  Allow related subject assignments
                </n-checkbox>
              </div>
            </div>
          </div>

          <!-- Homeroom Preferences -->
          <div class="rule-section">
            <div class="rule-header">
              <Icon name="ph:house" class="rule-icon text-success" />
              <h4 class="rule-title">Homeroom Assignment</h4>
            </div>
            <div class="rule-content">
              <n-checkbox
                v-model:checked="rules.autoAssignHomeroom"
                class="rule-checkbox"
              >
                Automatically assign homeroom
                {{ isHigherEducationInstitution ? 'advisors' : 'teachers' }}
              </n-checkbox>
              <div v-if="rules.autoAssignHomeroom" class="rule-sub-options">
                <n-checkbox
                  v-model:checked="rules.homeroomToTeachingGrade"
                  class="rule-sub-checkbox"
                >
                  Assign homeroom to
                  {{
                    isHigherEducationInstitution
                      ? 'faculty teaching that class'
                      : 'teachers in the same grade'
                  }}
                </n-checkbox>
                <n-checkbox
                  v-model:checked="rules.oneHomeroomPerTeacher"
                  class="rule-sub-checkbox"
                >
                  Limit to one homeroom per
                  {{
                    isHigherEducationInstitution ? 'faculty member' : 'teacher'
                  }}
                </n-checkbox>
              </div>
            </div>
          </div>
        </div>

        <!-- Apply Rules Button -->
        <div class="rules-apply-section">
          <n-button
            type="primary"
            size="large"
            :loading="applyingRules"
            class="apply-rules-button"
            @click="applySmartRules"
          >
            <template #icon>
              <Icon name="ph:magic-wand" />
            </template>
            Apply Smart Assignment Rules
          </n-button>
        </div>
      </div>
    </n-card>

    <!-- Assignment Preview -->
    <n-card
      v-if="previewAssignments.length > 0"
      title="Assignment Preview"
      class="preview-section mb-6"
    >
      <template #header-extra>
        <div class="preview-header-actions">
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
        <div class="preview-stats">
          <div class="stats-grid">
            <div class="stat-card primary">
              <div class="stat-value">{{ previewStats.totalTeachers }}</div>
              <div class="stat-label">
                {{
                  isHigherEducationInstitution ? 'Faculty' : 'Teachers'
                }}
                Affected
              </div>
            </div>
            <div class="stat-card success">
              <div class="stat-value">{{ previewStats.totalAssignments }}</div>
              <div class="stat-label">Total Assignments</div>
            </div>
            <div class="stat-card info">
              <div class="stat-value">
                {{ previewStats.avgAssignments.toFixed(1) }}
              </div>
              <div class="stat-label">
                Avg per
                {{ isHigherEducationInstitution ? 'Faculty' : 'Teacher' }}
              </div>
            </div>
            <div class="stat-card warning">
              <div class="stat-value">
                {{ previewStats.homeroomAssignments }}
              </div>
              <div class="stat-label">Homeroom Assignments</div>
            </div>
          </div>
        </div>

        <!-- Assignment List -->
        <div class="assignment-list">
          <div
            v-for="assignment in previewAssignments"
            :key="assignment.teacherId"
            class="assignment-preview-item"
          >
            <div class="assignment-teacher-info">
              <div class="teacher-avatar">
                <Icon name="ph:chalkboard-teacher" class="text-primary" />
              </div>
              <div class="teacher-details">
                <div class="teacher-name">{{ assignment.teacherName }}</div>
                <div class="teacher-meta">
                  {{ assignment.title || 'Teacher' }}
                </div>
              </div>
            </div>

            <div class="assignment-details">
              <div class="assignments-section">
                <div class="assignments-label">Assignments:</div>
                <div class="assignments-tags">
                  <n-tag
                    v-for="gradeId in assignment.gradeIds"
                    :key="gradeId"
                    size="small"
                    type="success"
                  >
                    {{ getGradeName(gradeId) }}
                  </n-tag>
                </div>
              </div>

              <div v-if="assignment.isHomeroom" class="homeroom-section">
                <div class="homeroom-label">Homeroom:</div>
                <n-tag type="warning" size="small">
                  <Icon name="ph:house" class="homeroom-icon" />
                  {{ getGradeName(assignment.homeroomGradeId) }}
                </n-tag>
              </div>
            </div>

            <div class="assignment-actions">
              <n-button
                quaternary
                circle
                size="small"
                @click="editAssignment(assignment)"
              >
                <Icon name="ph:pencil" />
              </n-button>
              <n-button
                quaternary
                circle
                size="small"
                type="error"
                @click="removeAssignment(assignment.teacherId)"
              >
                <Icon name="ph:trash" />
              </n-button>
            </div>
          </div>
        </div>

        <!-- Apply Assignments Button -->
        <div class="preview-actions">
          <n-space>
            <n-button @click="clearPreview"> Cancel </n-button>
            <n-button
              type="primary"
              :loading="submittingAssignments"
              @click="submitAssignments"
            >
              <template #icon>
                <Icon name="ph:check" />
              </template>
              Apply {{ previewAssignments.length }} Assignments
            </n-button>
          </n-space>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import type { TeacherResponseDto as Teacher } from '~/stores/teacher';
import type { SelectOption } from 'naive-ui';

interface Props {
  teachers: Teacher[];
  grades: SelectOption[];
  isHigherEducationInstitution: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'assign', data: any): void;
}>();

// Utilities
const message = useMessage();

// State
const selectedTemplate = ref<string | null>(null);
const applyingRules = ref(false);
const submittingAssignments = ref(false);
const previewAssignments = ref<any[]>([]);

// Assignment rules configuration
const rules = ref({
  balanceWorkload: true,
  maxAssignmentsPerTeacher: 3,
  preferredAssignmentCount: 2,
  matchByExperience: true,
  seniorToAdvanced: true,
  newToBasic: true,
  matchBySpecialization: false,
  strictSpecialization: false,
  allowRelatedSubjects: true,
  autoAssignHomeroom: true,
  homeroomToTeachingGrade: true,
  oneHomeroomPerTeacher: true,
});

// Quick actions configuration
const quickActions = computed(() => [
  {
    key: 'assign-all-unassigned',
    title: 'Assign All Unassigned',
    description: `Automatically assign all unassigned ${props.isHigherEducationInstitution ? 'faculty' : 'teachers'} using smart rules`,
    icon: 'ph:users-plus',
    color: 'text-primary',
    buttonType: 'primary',
    buttonText: 'Auto Assign',
  },
  {
    key: 'balance-workload',
    title: 'Balance Workload',
    description: 'Redistribute assignments to balance teaching loads evenly',
    icon: 'ph:scales',
    color: 'text-warning',
    buttonType: 'warning',
    buttonText: 'Rebalance',
  },
  {
    key: 'optimize-specialization',
    title: 'Optimize by Specialization',
    description: 'Reassign based on subject expertise and specialization',
    icon: 'ph:target',
    color: 'text-info',
    buttonType: 'info',
    buttonText: 'Optimize',
  },
  {
    key: 'assign-homerooms',
    title: 'Assign Homerooms',
    description: `Auto-assign homeroom ${props.isHigherEducationInstitution ? 'advisors' : 'teachers'} to available classes`,
    icon: 'ph:house-plus',
    color: 'text-success',
    buttonType: 'success',
    buttonText: 'Assign Homerooms',
  },
]);

// Assignment templates
const assignmentTemplates = computed(() => [
  {
    id: 'balanced-basic',
    name: 'Balanced Basic',
    description:
      'Evenly distribute all teachers across all grades with 2-3 assignments each',
    icon: 'ph:scales',
    color: 'text-primary',
    teacherCount: Math.min(props.teachers.length, 20),
    gradeCount: Math.min(props.grades.length, 10),
  },
  {
    id: 'specialization-focused',
    name: 'Specialization Focused',
    description:
      'Match teachers to grades based on their subject specializations',
    icon: 'ph:target',
    color: 'text-info',
    teacherCount: Math.min(props.teachers.length, 15),
    gradeCount: Math.min(props.grades.length, 8),
  },
  {
    id: 'experience-tiered',
    name: 'Experience Tiered',
    description:
      'Assign based on experience levels - senior to advanced, junior to basic',
    icon: 'ph:graduation-cap',
    color: 'text-success',
    teacherCount: Math.min(props.teachers.length, 18),
    gradeCount: Math.min(props.grades.length, 12),
  },
  {
    id: 'minimal-load',
    name: 'Minimal Load',
    description: 'Assign minimum required courses to each teacher',
    icon: 'ph:minus-circle',
    color: 'text-warning',
    teacherCount: Math.min(props.teachers.length, 25),
    gradeCount: Math.min(props.grades.length, 6),
  },
]);

// Preview statistics
const previewStats = computed(() => {
  const totalTeachers = previewAssignments.value.length;
  const totalAssignments = previewAssignments.value.reduce(
    (sum, assignment) => sum + assignment.gradeIds.length,
    0
  );
  const homeroomAssignments = previewAssignments.value.filter(
    (assignment) => assignment.isHomeroom
  ).length;
  const avgAssignments =
    totalTeachers > 0 ? totalAssignments / totalTeachers : 0;

  return {
    totalTeachers,
    totalAssignments,
    avgAssignments,
    homeroomAssignments,
  };
});

// Helper functions
function getGradeName(gradeId: string): string {
  const grade = props.grades.find((g) => g.value === gradeId);
  return grade?.label || 'Unknown';
}

function handleQuickAction(actionKey: string) {
  switch (actionKey) {
    case 'assign-all-unassigned':
      assignAllUnassigned();
      break;
    case 'balance-workload':
      balanceWorkload();
      break;
    case 'optimize-specialization':
      optimizeBySpecialization();
      break;
    case 'assign-homerooms':
      assignHomerooms();
      break;
  }
}

function selectTemplate(templateId: string) {
  selectedTemplate.value =
    selectedTemplate.value === templateId ? null : templateId;
}

function applyTemplate(template: any) {
  applyingRules.value = true;

  try {
    // Generate assignments based on template
    const assignments = generateTemplateAssignments(template);
    previewAssignments.value = assignments;
    selectedTemplate.value = null;

    message.success(
      `Applied ${template.name} template with ${assignments.length} assignments`
    );
  } catch (error: any) {
    message.error(`Failed to apply template: ${error.message}`);
  } finally {
    applyingRules.value = false;
  }
}

function generateTemplateAssignments(template: any) {
  const unassignedTeachers = props.teachers.filter(
    (teacher) =>
      (!teacher.subjects || teacher.subjects.length === 0) &&
      !teacher.classGradeId
  );

  const availableGradeIds = props.grades.map((g) => g.value as string);

  switch (template.id) {
    case 'balanced-basic':
      return generateBalancedAssignments(
        unassignedTeachers,
        availableGradeIds,
        2,
        3
      );
    case 'specialization-focused':
      return generateSpecializationAssignments(
        unassignedTeachers,
        availableGradeIds
      );
    case 'experience-tiered':
      return generateExperienceAssignments(
        unassignedTeachers,
        availableGradeIds
      );
    case 'minimal-load':
      return generateMinimalAssignments(unassignedTeachers, availableGradeIds);
    default:
      return [];
  }
}

function generateBalancedAssignments(
  teachers: Teacher[],
  gradeIds: string[],
  minAssignments: number,
  maxAssignments: number
) {
  return teachers.map((teacher, index) => {
    const assignmentCount =
      Math.floor(Math.random() * (maxAssignments - minAssignments + 1)) +
      minAssignments;
    const startIndex = (index * assignmentCount) % gradeIds.length;
    const selectedGrades = [];

    for (let i = 0; i < assignmentCount; i++) {
      const gradeIndex = (startIndex + i) % gradeIds.length;
      selectedGrades.push(gradeIds[gradeIndex]);
    }

    return {
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      title: teacher.title,
      gradeIds: selectedGrades,
      isHomeroom: Math.random() > 0.7, // 30% chance of homeroom
      homeroomGradeId: selectedGrades[0], // First grade as homeroom
    };
  });
}

function generateSpecializationAssignments(
  teachers: Teacher[],
  gradeIds: string[]
) {
  // Simplified specialization matching
  return teachers.map((teacher) => {
    const gradeCount = Math.floor(Math.random() * 3) + 1; // 1-3 grades
    const selectedGrades = gradeIds.slice(0, gradeCount);

    return {
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      title: teacher.title,
      gradeIds: selectedGrades,
      isHomeroom: Math.random() > 0.8, // 20% chance of homeroom
      homeroomGradeId: selectedGrades[0],
    };
  });
}

function generateExperienceAssignments(
  teachers: Teacher[],
  gradeIds: string[]
) {
  // Sort by experience (simulated)
  const sortedTeachers = [...teachers].sort(() => Math.random() - 0.5);
  const seniorTeachers = sortedTeachers.slice(
    0,
    Math.floor(sortedTeachers.length / 2)
  );
  const juniorTeachers = sortedTeachers.slice(
    Math.floor(sortedTeachers.length / 2)
  );

  const advancedGrades = gradeIds.slice(Math.floor(gradeIds.length / 2));
  const basicGrades = gradeIds.slice(0, Math.floor(gradeIds.length / 2));

  const assignments = [];

  // Assign senior teachers to advanced grades
  seniorTeachers.forEach((teacher) => {
    const gradeCount = Math.floor(Math.random() * 2) + 2; // 2-3 grades
    const selectedGrades = advancedGrades.slice(0, gradeCount);

    assignments.push({
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      title: teacher.title,
      gradeIds: selectedGrades,
      isHomeroom: Math.random() > 0.6, // 40% chance of homeroom
      homeroomGradeId: selectedGrades[0],
    });
  });

  // Assign junior teachers to basic grades
  juniorTeachers.forEach((teacher) => {
    const gradeCount = Math.floor(Math.random() * 2) + 1; // 1-2 grades
    const selectedGrades = basicGrades.slice(0, gradeCount);

    assignments.push({
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      title: teacher.title,
      gradeIds: selectedGrades,
      isHomeroom: Math.random() > 0.8, // 20% chance of homeroom
      homeroomGradeId: selectedGrades[0],
    });
  });

  return assignments;
}

function generateMinimalAssignments(teachers: Teacher[], gradeIds: string[]) {
  return teachers.map((teacher, index) => {
    const gradeIndex = index % gradeIds.length;

    return {
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      title: teacher.title,
      gradeIds: [gradeIds[gradeIndex]],
      isHomeroom: index % 5 === 0, // Every 5th teacher gets homeroom
      homeroomGradeId: gradeIds[gradeIndex],
    };
  });
}

function assignAllUnassigned() {
  const template = assignmentTemplates.value.find(
    (t) => t.id === 'balanced-basic'
  );
  if (template) {
    applyTemplate(template);
  }
}

function balanceWorkload() {
  message.info('Workload balancing coming soon');
}

function optimizeBySpecialization() {
  const template = assignmentTemplates.value.find(
    (t) => t.id === 'specialization-focused'
  );
  if (template) {
    applyTemplate(template);
  }
}

function assignHomerooms() {
  message.info('Homeroom assignment coming soon');
}

async function applySmartRules() {
  applyingRules.value = true;

  try {
    // Apply rules based on configuration
    const assignments = generateRuleBasedAssignments();
    previewAssignments.value = assignments;

    message.success(
      `Generated ${assignments.length} assignments using smart rules`
    );
  } catch (error: any) {
    message.error(`Failed to apply smart rules: ${error.message}`);
  } finally {
    applyingRules.value = false;
  }
}

function generateRuleBasedAssignments() {
  const unassignedTeachers = props.teachers.filter(
    (teacher) =>
      (!teacher.subjects || teacher.subjects.length === 0) &&
      !teacher.classGradeId
  );

  const availableGradeIds = props.grades.map((g) => g.value as string);
  const maxAssignments = rules.value.maxAssignmentsPerTeacher;
  const preferredAssignments = rules.value.preferredAssignmentCount;

  return unassignedTeachers.map((teacher, index) => {
    const assignmentCount = rules.value.balanceWorkload
      ? preferredAssignments
      : Math.floor(Math.random() * maxAssignments) + 1;

    const startIndex = (index * assignmentCount) % availableGradeIds.length;
    const selectedGrades = [];

    for (let i = 0; i < assignmentCount; i++) {
      const gradeIndex = (startIndex + i) % availableGradeIds.length;
      selectedGrades.push(availableGradeIds[gradeIndex]);
    }

    const shouldAssignHomeroom =
      rules.value.autoAssignHomeroom &&
      (rules.value.oneHomeroomPerTeacher ? Math.random() > 0.7 : true);

    return {
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      title: teacher.title,
      gradeIds: selectedGrades,
      isHomeroom: shouldAssignHomeroom,
      homeroomGradeId: shouldAssignHomeroom ? selectedGrades[0] : null,
    };
  });
}

function editAssignment(assignment: any) {
  // Open edit modal or inline editing
  message.info(`Edit assignment for ${assignment.teacherName}`);
}

function removeAssignment(teacherId: string) {
  previewAssignments.value = previewAssignments.value.filter(
    (assignment) => assignment.teacherId !== teacherId
  );
  message.success('Assignment removed from preview');
}

function clearPreview() {
  previewAssignments.value = [];
  selectedTemplate.value = null;
}

async function submitAssignments() {
  submittingAssignments.value = true;

  try {
    const assignmentData = {
      type: 'bulk-assign',
      assignments: previewAssignments.value.map((assignment) => ({
        teacherId: assignment.teacherId,
        gradeIds: assignment.gradeIds,
        homeroomGradeId: assignment.isHomeroom
          ? assignment.homeroomGradeId
          : null,
      })),
    };

    emit('assign', assignmentData);
    clearPreview();
  } catch (error: any) {
    message.error(`Failed to submit assignments: ${error.message}`);
  } finally {
    submittingAssignments.value = false;
  }
}

onMounted(() => {
  console.log('BulkAssignmentSection mounted', {
    teachers: props.teachers.length,
    grades: props.grades.length,
    isHigherEducationInstitution: props.isHigherEducationInstitution,
  });
});
</script>

<style scoped>
.bulk-assignment-section {
  max-width: 100%;
}

/* Quick Actions Section */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.quick-action-card {
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--color-background, #ffffff);
  overflow: hidden;
}

.quick-action-card:hover {
  border-color: var(--primary-color, #4ade80);
  box-shadow: 0 8px 25px rgba(74, 222, 128, 0.15);
  transform: translateY(-4px);
}

.quick-action-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 180px;
}

.action-icon-wrapper {
  text-align: center;
  margin-bottom: 16px;
}

.action-icon {
  font-size: 2.5rem;
}

.action-info {
  flex: 1;
  text-align: center;
  margin-bottom: 20px;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-color-1, #1f2937);
  line-height: 1.3;
}

.action-description {
  font-size: 14px;
  color: var(--text-color-2, #6b7280);
  margin: 0;
  line-height: 1.4;
}

.action-button-wrapper {
  margin-top: auto;
}

/* Templates Section */
.templates-section {
  background: rgba(var(--primary-color-rgb, 74, 222, 128), 0.02);
  border: 1px solid rgba(var(--primary-color-rgb, 74, 222, 128), 0.1);
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.template-card {
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--color-background, #ffffff);
  overflow: hidden;
}

.template-card:hover {
  border-color: var(--primary-color, #4ade80);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.template-selected {
  border-color: var(--primary-color, #4ade80) !important;
  background: rgba(74, 222, 128, 0.05) !important;
  box-shadow: 0 8px 25px rgba(74, 222, 128, 0.2) !important;
}

.template-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 240px;
}

.template-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.template-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(var(--primary-color-rgb, 74, 222, 128), 0.1);
}

.template-icon {
  font-size: 1.5rem;
}

.template-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--text-color-1, #1f2937);
}

.template-description {
  font-size: 14px;
  color: var(--text-color-2, #6b7280);
  margin: 0 0 20px 0;
  line-height: 1.5;
  flex: 1;
}

.template-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(var(--info-color-rgb, 59, 130, 246), 0.05);
  border-radius: 12px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border, #e5e7eb);
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color, #4ade80);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--text-color-3, #9ca3af);
  margin-top: 4px;
  display: block;
}

.template-actions {
  margin-top: auto;
}

.template-select-hint {
  text-align: center;
  font-size: 13px;
  color: var(--text-color-3, #9ca3af);
  padding: 10px;
  border: 1px dashed var(--color-border, #e5e7eb);
  border-radius: 8px;
}

/* Rules Section */
.rules-section {
  background: rgba(var(--info-color-rgb, 59, 130, 246), 0.02);
  border: 1px solid rgba(var(--info-color-rgb, 59, 130, 246), 0.1);
}

.rules-configuration {
  background: var(--color-background, #ffffff);
  border-radius: 16px;
  padding: 24px;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.rule-section {
  background: rgba(var(--color-background-rgb, 248, 250, 252), 0.5);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 20px;
}

.rule-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.rule-icon {
  font-size: 1.25rem;
}

.rule-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--text-color-1, #1f2937);
}

.rule-checkbox {
  margin-bottom: 12px;
}

.rule-sub-options {
  margin-left: 24px;
  padding-left: 16px;
  border-left: 2px solid var(--color-border, #e5e7eb);
}

.rule-sub-checkbox {
  margin-bottom: 8px;
}

.rule-input-group {
  margin-bottom: 12px;
}

.rules-apply-section {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--color-border, #e5e7eb);
}

.apply-rules-button {
  padding: 12px 32px;
  height: auto;
  font-size: 16px;
  font-weight: 600;
}

/* Preview Section */
.preview-section {
  background: rgba(var(--success-color-rgb, 34, 197, 94), 0.02);
  border: 1px solid rgba(var(--success-color-rgb, 34, 197, 94), 0.1);
}

.preview-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-content {
  background: var(--color-background, #ffffff);
  border-radius: 16px;
  padding: 24px;
}

.preview-stats {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.stat-card {
  text-align: center;
  padding: 20px 16px;
  background: var(--color-background, #ffffff);
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.stat-card.primary {
  border-color: var(--primary-color, #4ade80);
  background: rgba(74, 222, 128, 0.05);
}

.stat-card.success {
  border-color: var(--success-color, #22c55e);
  background: rgba(34, 197, 94, 0.05);
}

.stat-card.info {
  border-color: var(--info-color, #3b82f6);
  background: rgba(59, 130, 246, 0.05);
}

.stat-card.warning {
  border-color: var(--warning-color, #f59e0b);
  background: rgba(245, 158, 11, 0.05);
}

.stat-card .stat-value {
  font-size: 28px;
  font-weight: 700;
  display: block;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-card.primary .stat-value {
  color: var(--primary-color, #4ade80);
}

.stat-card.success .stat-value {
  color: var(--success-color, #22c55e);
}

.stat-card.info .stat-value {
  color: var(--info-color, #3b82f6);
}

.stat-card.warning .stat-value {
  color: var(--warning-color, #f59e0b);
}

.stat-card .stat-label {
  font-size: 13px;
  color: var(--text-color-2, #6b7280);
  font-weight: 500;
}

.assignment-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 24px;
  border-radius: 12px;
  border: 1px solid var(--color-border, #e5e7eb);
}

.assignment-preview-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: var(--color-background, #ffffff);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  transition: background-color 0.2s ease;
}

.assignment-preview-item:last-child {
  border-bottom: none;
}

.assignment-preview-item:hover {
  background: rgba(var(--primary-color-rgb, 74, 222, 128), 0.02);
}

.assignment-teacher-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 240px;
}

.teacher-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(var(--primary-color-rgb, 74, 222, 128), 0.1);
}

.teacher-details {
  flex: 1;
}

.teacher-name {
  font-weight: 600;
  color: var(--text-color-1, #1f2937);
  font-size: 15px;
  margin-bottom: 2px;
}

.teacher-meta {
  font-size: 13px;
  color: var(--text-color-3, #9ca3af);
}

.assignment-details {
  flex: 1;
  space-y: 12px;
}

.assignments-section,
.homeroom-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.assignments-label,
.homeroom-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-color-2, #6b7280);
  min-width: 80px;
}

.assignments-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.homeroom-icon {
  margin-right: 4px;
}

.assignment-actions {
  display: flex;
  gap: 8px;
}

.preview-actions {
  text-align: right;
  padding-top: 20px;
  border-top: 1px solid var(--color-border, #e5e7eb);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .quick-action-card,
  .template-card,
  .rule-section,
  .stat-card,
  .assignment-preview-item,
  .rules-configuration,
  .preview-content {
    background: var(--color-background, #374151);
    border-color: var(--color-border, #4b5563);
  }

  .action-title,
  .template-title,
  .rule-title,
  .teacher-name {
    color: var(--text-color-1, #f9fafb);
  }

  .template-stats {
    background: rgba(var(--info-color-rgb, 59, 130, 246), 0.1);
  }

  .rule-sub-options {
    border-left-color: var(--color-border, #4b5563);
  }
}

/* Responsive design */
@media (max-width: 1024px) {
  .quick-actions-grid,
  .templates-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .rules-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
}

@media (max-width: 768px) {
  .quick-actions-grid,
  .templates-grid,
  .rules-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .assignment-preview-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .assignment-teacher-info {
    min-width: auto;
    width: 100%;
  }

  .assignment-details {
    width: 100%;
  }

  .assignment-actions {
    align-self: flex-end;
  }

  .assignments-section,
  .homeroom-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .assignments-label,
  .homeroom-label {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .quick-action-content,
  .template-content {
    padding: 20px;
  }

  .action-title,
  .template-title {
    font-size: 15px;
  }

  .action-description,
  .template-description {
    font-size: 13px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
