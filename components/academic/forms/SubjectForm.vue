<!-- components/forms/SubjectForm.vue -->
<template>
  <div class="subject-form-container" :style="{ width: formWidth }">
    <!-- Header Section -->
    <div class="form-header">
      <div class="flex items-center gap-3 mb-2">
        <div class="header-icon">
          <Icon name="ph:book-open" class="text-xl" />
        </div>
        <div>
          <h2 class="form-title">
            {{ isEditing ? 'Edit' : 'Create' }}
            {{ isElectiveComputed ? 'Elective' : 'Subject' }}
          </h2>
          <p class="form-subtitle">
            {{
              isElectiveComputed
                ? 'Configure an elective course with specialized settings'
                : subjectType === SubjectType.UniversityCourse
                  ? 'Set up a university course with credit hours and academic details'
                  : 'Create a school subject with grade-level specifications'
            }}
          </p>
        </div>
      </div>

      <!-- Subject Type Indicator -->
      <div class="subject-type-indicator">
        <n-tag :type="getSubjectTypeColor()" size="small">
          <Icon :name="getSubjectTypeIcon()" class="mr-1" />
          {{ getSubjectTypeLabel() }}
        </n-tag>
      </div>
    </div>

    <n-divider class="my-6" />

    <!-- Form Content -->
    <n-form
      ref="formRef"
      label-placement="top"
      require-mark-placement="right-hanging"
      @submit.prevent="onSubmit"
    >
      <!-- Basic Information Card -->
      <n-card title="Basic Information" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:info" class="text-gray-400" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Subject Name -->
          <n-form-item
            label="Subject Name"
            path="name"
            v-bind="nameProps"
            required
            class="md:col-span-2"
          >
            <n-input
              v-model:value="name"
              placeholder="Enter subject name"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:book" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                The official name of the subject or course
              </div>
            </template>
          </n-form-item>

          <!-- Subject Code -->
          <n-form-item label="Subject Code" path="code" v-bind="codeProps">
            <n-input
              v-model:value="code"
              placeholder="Enter subject code"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:hash" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                Short identifier for the subject (e.g., MATH101, ENG201)
              </div>
            </template>
          </n-form-item>

          <!-- Short Description -->
          <n-form-item
            label="Short Description"
            path="shortDescription"
            v-bind="shortDescriptionProps"
          >
            <n-input
              v-model:value="shortDescription"
              placeholder="Brief description of the subject"
              :disabled="loading"
              size="large"
            >
              <template #prefix>
                <Icon name="ph:text-aa" class="text-gray-400" />
              </template>
            </n-input>
            <template #feedback>
              <div class="form-help-text">
                A concise overview for catalogs and listings
              </div>
            </template>
          </n-form-item>
        </div>

        <!-- Detailed Description -->
        <n-form-item
          label="Detailed Description"
          path="detailedDescription"
          v-bind="detailedDescriptionProps"
          class="mt-6"
        >
          <n-input
            v-model:value="detailedDescription"
            type="textarea"
            placeholder="Comprehensive description of the subject, its objectives, and curriculum"
            :autosize="{ minRows: 4, maxRows: 8 }"
            :disabled="loading"
            size="large"
          />
          <template #feedback>
            <div class="form-help-text">
              Detailed information about course content, learning objectives,
              and requirements
            </div>
          </template>
        </n-form-item>
      </n-card>

      <!-- Classification Card -->
      <n-card title="Classification & Assignment" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:tag" class="text-gray-400" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Subject Type -->
          <n-form-item
            label="Subject Type"
            path="subjectType"
            v-bind="subjectTypeProps"
          >
            <n-select
              v-model:value="subjectType"
              :options="subjectTypeOptions"
              placeholder="Select subject type"
              :disabled="loading || isElectiveComputed"
              size="large"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                {{
                  isElectiveComputed
                    ? 'Fixed as Elective Course'
                    : 'Type determines available fields and settings'
                }}
              </div>
            </template>
          </n-form-item>

          <!-- Academic Level -->
          <n-form-item
            label="Academic Level"
            path="academicLevel"
            v-bind="academicLevelProps"
          >
            <n-select
              v-model:value="academicLevel"
              :options="academicLevelOptions"
              placeholder="Select academic level"
              :disabled="loading"
              size="large"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                Target academic level for this subject
              </div>
            </template>
          </n-form-item>

          <!-- Department -->
          <n-form-item
            label="Department"
            path="departmentId"
            v-bind="departmentIdProps"
          >
            <n-select
              v-model:value="departmentId"
              :options="departmentOptions"
              placeholder="Select department (optional)"
              clearable
              :disabled="loading || loadingDepartments"
              :loading="loadingDepartments"
              size="large"
              remote
              @search="handleDepartmentSearch"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="ph:building-office"
                    class="text-2xl text-gray-400 mb-2"
                  />
                  <p class="text-gray-500">
                    {{
                      loadingDepartments
                        ? 'Loading departments...'
                        : 'No departments available'
                    }}
                  </p>
                  <p
                    v-if="!loadingDepartments && !currentInstitutionId"
                    class="text-xs text-gray-400 mt-1"
                  >
                    Please select an institution first
                  </p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                {{
                  !currentInstitutionId
                    ? 'Institution must be selected first'
                    : loadingDepartments
                      ? 'Loading departments for current institution...'
                      : departmentOptions.length === 0
                        ? 'No departments found for this institution'
                        : 'Organizational unit for this subject'
                }}
              </div>
            </template>
          </n-form-item>

          <!-- Primary Teacher -->
          <n-form-item
            label="Primary Teacher"
            path="primaryTeacherId"
            v-bind="primaryTeacherIdProps"
          >
            <n-select
              v-model:value="primaryTeacherId"
              :options="teacherOptions"
              placeholder="Select primary teacher"
              clearable
              :disabled="loading || loadingTeachers"
              :loading="loadingTeachers"
              size="large"
              remote
              @search="handleTeacherSearch"
            >
              <template #arrow>
                <Icon name="ph:caret-down" />
              </template>
              <template #empty>
                <div class="text-center py-4">
                  <Icon
                    name="ph:chalkboard-teacher"
                    class="text-2xl text-gray-400 mb-2"
                  />
                  <p class="text-gray-500">
                    {{
                      loadingTeachers
                        ? 'Loading teachers...'
                        : 'No teachers available'
                    }}
                  </p>
                  <p
                    v-if="!loadingTeachers && !currentInstitutionId"
                    class="text-xs text-gray-400 mt-1"
                  >
                    Please select an institution first
                  </p>
                </div>
              </template>
            </n-select>
            <template #feedback>
              <div class="form-help-text">
                {{
                  !currentInstitutionId
                    ? 'Institution must be selected first'
                    : loadingTeachers
                      ? 'Loading teachers for current institution...'
                      : teacherOptions.length === 0
                        ? 'No teachers found for this institution'
                        : 'Main instructor for this subject'
                }}
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Academic Details Card -->
      <n-card title="Academic Requirements" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:graduation-cap" class="text-gray-400" />
        </template>

        <!-- School Subject Details -->
        <div v-if="subjectType === SubjectType.SchoolSubject">
          <n-alert type="info" class="mb-6">
            <Icon name="ph:info" />
            Set the grade level range for this school subject. Students within
            this range can enroll.
          </n-alert>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <n-form-item
              label="Minimum Grade Level"
              path="minGradeLevel"
              v-bind="minGradeLevelProps"
            >
              <n-input-number
                v-model:value="minGradeLevel"
                :min="1"
                :max="12"
                placeholder="Minimum grade"
                clearable
                :disabled="loading"
                size="large"
              />
              <template #feedback>
                <div class="form-help-text">
                  Lowest grade level that can take this subject
                </div>
              </template>
            </n-form-item>

            <n-form-item
              label="Maximum Grade Level"
              path="maxGradeLevel"
              v-bind="maxGradeLevelProps"
            >
              <n-input-number
                v-model:value="maxGradeLevel"
                :min="1"
                :max="12"
                placeholder="Maximum grade"
                clearable
                :disabled="loading"
                size="large"
              />
              <template #feedback>
                <div class="form-help-text">
                  Highest grade level that can take this subject
                </div>
              </template>
            </n-form-item>
          </div>
        </div>

        <!-- University Course Details -->
        <div v-if="subjectType === SubjectType.UniversityCourse">
          <n-alert type="info" class="mb-6">
            <Icon name="ph:info" />
            Configure credit hours and academic value for this university
            course.
          </n-alert>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <n-form-item
              label="Credit Hours"
              path="creditHours"
              v-bind="creditHoursProps"
            >
              <n-input-number
                v-model:value="creditHours"
                :min="1"
                :max="12"
                placeholder="Credit hours"
                clearable
                :disabled="loading"
                size="large"
              />
              <template #feedback>
                <div class="form-help-text">
                  Number of credit hours for this course
                </div>
              </template>
            </n-form-item>

            <n-form-item
              label="Credit Value"
              path="creditValue"
              v-bind="creditValueProps"
            >
              <n-input-number
                v-model:value="creditValue"
                :min="0.5"
                :max="10"
                :step="0.5"
                placeholder="Credit value"
                clearable
                :disabled="loading"
                size="large"
              />
              <template #feedback>
                <div class="form-help-text">
                  Academic credit value for degree requirements
                </div>
              </template>
            </n-form-item>
          </div>
        </div>

        <!-- Elective Details -->
        <div v-if="isElectiveComputed">
          <n-alert type="success" class="mb-6">
            <Icon name="ph:star" />
            This is an elective course. Configure capacity and specialization
            details.
          </n-alert>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <n-form-item
              label="Elective Type"
              path="electiveType"
              v-bind="electiveTypeProps"
            >
              <n-select
                v-model:value="electiveType"
                :options="electiveTypeOptions"
                placeholder="Select elective type"
                :disabled="loading"
                size="large"
              >
                <template #arrow>
                  <Icon name="ph:caret-down" />
                </template>
              </n-select>
              <template #feedback>
                <div class="form-help-text">
                  Category of elective for organization purposes
                </div>
              </template>
            </n-form-item>

            <n-form-item
              label="Maximum Students"
              path="maxStudents"
              v-bind="maxStudentsProps"
            >
              <n-input-number
                v-model:value="maxStudents"
                :min="1"
                :max="100"
                placeholder="Maximum students"
                clearable
                :disabled="loading"
                size="large"
              />
              <template #feedback>
                <div class="form-help-text">
                  Enrollment capacity for this elective
                </div>
              </template>
            </n-form-item>
          </div>
        </div>

        <!-- Vocational Subject Notice -->
        <div v-if="subjectType === SubjectType.VocationalSubject">
          <n-alert type="warning" class="mb-6">
            <Icon name="ph:hammer" />
            Vocational subjects focus on practical skills and career
            preparation.
          </n-alert>
        </div>
      </n-card>

      <!-- Additional Features Card -->
      <n-card title="Additional Features" class="form-card mb-6">
        <template #header-extra>
          <Icon name="ph:gear" class="text-gray-400" />
        </template>

        <div class="feature-options">
          <n-form-item
            label="Laboratory Component"
            path="hasLab"
            v-bind="hasLabProps"
          >
            <div class="switch-container">
              <n-switch v-model:value="hasLab" :disabled="loading" size="large">
                <template #checked> Has Lab </template>
                <template #unchecked> No Lab </template>
              </n-switch>
            </div>
            <template #feedback>
              <div class="form-help-text">
                Enable if this subject includes laboratory or practical sessions
              </div>
            </template>
          </n-form-item>
        </div>
      </n-card>

      <!-- Form Actions -->
      <div class="form-actions">
        <n-space justify="end" size="medium" class="bg-card-color">
          <n-button
            size="large"
            :disabled="loading"
            class="cancel-button"
            @click="emit('cancel')"
          >
            <template #icon>
              <Icon name="ph:x" />
            </template>
            Cancel
          </n-button>
          <n-button
            type="primary"
            :loading="loading || isSubmitting"
            attr-type="submit"
            size="large"
            class="submit-button"
            :disabled="!currentInstitutionId"
          >
            <template #icon>
              <Icon :name="isEditing ? 'ph:pencil' : 'ph:plus'" />
            </template>
            {{ isEditing ? 'Update' : 'Create' }}
            {{ isElectiveComputed ? 'Elective' : 'Subject' }}
          </n-button>
        </n-space>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useMessage } from 'naive-ui';
import { SubjectType } from '~/enums/subject-type.enum';
import { AcademicLevel } from '~/enums/academic-level.enum';
import { ElectiveType } from '~/enums/elective-type.enum';
import { useInstitutionStore } from '~/stores/institution';
import { useDepartmentStore } from '~/stores/department';
import { useTeacherStore } from '~/stores/teacher';
import { useSubjectStore } from '~/stores/subject';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import {
  subjectFormSchema,
  type SubjectFormSchema,
} from '~/schemas/subject.schema';
import type { SelectOption } from 'naive-ui';

const props = defineProps<{
  initialValues?: Partial<SubjectFormSchema>;
  isEditing?: boolean;
  isElective?: boolean;
  loading?: boolean;
  width?: string;
}>();

// Allow controlling the form width from parent component
const formWidth = computed(() => props.width || '100%');

const emit = defineEmits<{
  (e: 'submit', data: SubjectFormSchema): void;
  (e: 'cancel'): void;
}>();

const message = useMessage();
const institutionStore = useInstitutionStore();
const departmentStore = useDepartmentStore();
const teacherStore = useTeacherStore();
const subjectStore = useSubjectStore();

// Form reference and loading states
const formRef = ref();
const isSubmitting = ref(false);
const loadingDepartments = ref(false);
const loadingTeachers = ref(false);

// Current institution from store
const currentInstitutionId = computed(
  () => institutionStore.activeInstitution?.id || null
);

// Computed property to get isElective even when the prop is not provided
const isElectiveComputed = computed(() => {
  return props.isElective || Boolean(props.initialValues?.isElective);
});

// Subject type options
const subjectTypeOptions = [
  { label: 'School Subject', value: SubjectType.SchoolSubject },
  { label: 'University Course', value: SubjectType.UniversityCourse },
  { label: 'Vocational Subject', value: SubjectType.VocationalSubject },
  { label: 'Elective Course', value: SubjectType.ElectiveCourse },
];

// Academic level options
const academicLevelOptions = [
  { label: 'Elementary', value: AcademicLevel.Elementary },
  { label: 'Middle School', value: AcademicLevel.MiddleSchool },
  { label: 'High School', value: AcademicLevel.HighSchool },
  { label: 'Undergraduate', value: AcademicLevel.Undergraduate },
  { label: 'Graduate', value: AcademicLevel.Graduate },
  { label: 'Doctoral', value: AcademicLevel.Doctoral },
  { label: 'Professional', value: AcademicLevel.Professional },
];

// Elective type options
const electiveTypeOptions = [
  { label: 'Academic', value: ElectiveType.Academic },
  { label: 'Arts', value: ElectiveType.Arts },
  { label: 'Sports', value: ElectiveType.Sports },
  { label: 'Technology', value: ElectiveType.Technology },
  { label: 'Language', value: ElectiveType.Language },
  { label: 'Professional', value: ElectiveType.Professional },
];

// Department options - filtered by institution
const departmentOptions = computed<SelectOption[]>(() => {
  if (!departmentStore.departments || !departmentStore.departments.length) {
    return [];
  }

  // Filter departments by current institution if available
  const filteredDepartments = currentInstitutionId.value
    ? departmentStore.departments.filter(
        (dept) => dept.institutionId === currentInstitutionId.value
      )
    : departmentStore.departments;

  return filteredDepartments.map((department) => ({
    label: department.name || 'Unnamed Department',
    value: department.id,
  }));
});

// Teacher options - filtered by institution
const teacherOptions = computed<SelectOption[]>(() => {
  if (!teacherStore.teachers || !teacherStore.teachers.length) {
    return [];
  }

  // Filter teachers by current institution if available
  const filteredTeachers = currentInstitutionId.value
    ? teacherStore.teachers.filter(
        (teacher) => teacher.institutionId === currentInstitutionId.value
      )
    : teacherStore.teachers;

  return filteredTeachers.map((teacher) => ({
    label:
      `${teacher.firstName || ''} ${teacher.lastName || ''} ${teacher.title ? `(${teacher.title})` : ''}`.trim(),
    value: teacher.id,
  }));
});

// Helper functions for header indicators
const getSubjectTypeColor = () => {
  if (isElectiveComputed.value) return 'success';
  switch (subjectType.value) {
    case SubjectType.UniversityCourse:
      return 'info';
    case SubjectType.SchoolSubject:
      return 'primary';
    case SubjectType.VocationalSubject:
      return 'warning';
    default:
      return 'default';
  }
};

const getSubjectTypeIcon = () => {
  if (isElectiveComputed.value) return 'ph:star';
  switch (subjectType.value) {
    case SubjectType.UniversityCourse:
      return 'ph:university';
    case SubjectType.SchoolSubject:
      return 'ph:student';
    case SubjectType.VocationalSubject:
      return 'ph:hammer';
    default:
      return 'ph:book';
  }
};

const getSubjectTypeLabel = () => {
  if (isElectiveComputed.value) return 'Elective Course';
  switch (subjectType.value) {
    case SubjectType.UniversityCourse:
      return 'University Course';
    case SubjectType.SchoolSubject:
      return 'School Subject';
    case SubjectType.VocationalSubject:
      return 'Vocational Subject';
    default:
      return 'General Subject';
  }
};

// Determine default values - prioritizing provided initialValues
const getDefaultSubjectType = () => {
  if (props.isElective) return SubjectType.ElectiveCourse;
  return institutionStore.activeInstitution?.type?.includes('University')
    ? SubjectType.UniversityCourse
    : SubjectType.SchoolSubject;
};

const defaultValues = {
  name: '',
  code: '',
  shortDescription: '',
  detailedDescription: '',
  subjectType: getDefaultSubjectType(),
  academicLevel: AcademicLevel.HighSchool,
  minGradeLevel: null,
  maxGradeLevel: null,
  creditHours: null,
  creditValue: null,
  isElective: props.isElective || false,
  electiveType: ElectiveType.Academic,
  maxStudents: null,
  hasLab: false,
  primaryTeacherId: null,
  departmentId: null,
  institutionId: currentInstitutionId.value ?? undefined,
  ...props.initialValues,
};

// Form setup with VeeValidate
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(subjectFormSchema),
  initialValues: defaultValues,
});

// Define form fields
const [name, nameProps] = defineField('name', naiveUiFormsConfig);
const [code, codeProps] = defineField('code', naiveUiFormsConfig);
const [shortDescription, shortDescriptionProps] = defineField(
  'shortDescription',
  naiveUiFormsConfig
);
const [detailedDescription, detailedDescriptionProps] = defineField(
  'detailedDescription',
  naiveUiFormsConfig
);
const [subjectType, subjectTypeProps] = defineField(
  'subjectType',
  naiveUiFormsConfig
);
const [academicLevel, academicLevelProps] = defineField(
  'academicLevel',
  naiveUiFormsConfig
);
const [minGradeLevel, minGradeLevelProps] = defineField(
  'minGradeLevel',
  naiveUiFormsConfig
);
const [maxGradeLevel, maxGradeLevelProps] = defineField(
  'maxGradeLevel',
  naiveUiFormsConfig
);
const [creditHours, creditHoursProps] = defineField(
  'creditHours',
  naiveUiFormsConfig
);
const [creditValue, creditValueProps] = defineField(
  'creditValue',
  naiveUiFormsConfig
);
const [isElective, isElectiveProps] = defineField(
  'isElective',
  naiveUiFormsConfig
);
const [electiveType, electiveTypeProps] = defineField(
  'electiveType',
  naiveUiFormsConfig
);
const [maxStudents, maxStudentsProps] = defineField(
  'maxStudents',
  naiveUiFormsConfig
);
const [hasLab, hasLabProps] = defineField('hasLab', naiveUiFormsConfig);
const [primaryTeacherId, primaryTeacherIdProps] = defineField(
  'primaryTeacherId',
  naiveUiFormsConfig
);
const [departmentId, departmentIdProps] = defineField(
  'departmentId',
  naiveUiFormsConfig
);

// Load institution-specific data
const loadInstitutionData = async () => {
  if (!currentInstitutionId.value) {
    return;
  }

  try {
    // Set the institution context in the subject store
    subjectStore.setInstitutionId(currentInstitutionId.value);

    // Load departments for this institution
    loadingDepartments.value = true;
    await departmentStore.fetchDepartmentsByInstitution(
      currentInstitutionId.value
    );

    // Load teachers for this institution
    loadingTeachers.value = true;
    await teacherStore.fetchTeachersByInstitution(currentInstitutionId.value);
  } catch (error: any) {
    message.error(`Failed to load institution data: ${error.message}`);
  } finally {
    loadingDepartments.value = false;
    loadingTeachers.value = false;
  }
};

// Search handlers for remote loading (if needed for large datasets)
const handleDepartmentSearch = async (searchQuery: string) => {
  if (!currentInstitutionId.value) return;

  if (searchQuery.length >= 2) {
    try {
      loadingDepartments.value = true;
      await departmentStore.searchDepartments({
        institutionId: currentInstitutionId.value,
        query: searchQuery,
      });
    } catch (error: any) {
      console.error('Error searching departments:', error);
    } finally {
      loadingDepartments.value = false;
    }
  }
};

const handleTeacherSearch = async (searchQuery: string) => {
  if (!currentInstitutionId.value) return;

  if (searchQuery.length >= 2) {
    try {
      loadingTeachers.value = true;
      await teacherStore.searchTeachers({
        institutionId: currentInstitutionId.value,
        query: searchQuery,
      });
    } catch (error: any) {
      console.error('Error searching teachers:', error);
    } finally {
      loadingTeachers.value = false;
    }
  }
};

// Submit form handler
const onSubmit = handleSubmit(async (formValues) => {
  if (!currentInstitutionId.value) {
    message.error('Please select an institution first');
    return;
  }

  try {
    isSubmitting.value = true;

    // If this is an elective, ensure the proper values are set
    if (isElectiveComputed.value) {
      formValues.isElective = true;
      formValues.subjectType = SubjectType.ElectiveCourse;
    }

    // Add institution context if needed (depending on your schema)
    const enrichedFormValues = {
      ...formValues,
      institutionId: currentInstitutionId.value,
    } as SubjectFormSchema;

    emit('submit', enrichedFormValues);
  } catch (error: any) {
    message.error(`An error occurred: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
});

// Watch for institution changes
watch(
  () => currentInstitutionId.value,
  async (newInstitutionId) => {
    if (newInstitutionId) {
      await loadInstitutionData();
    }
  },
  { immediate: true }
);

// Mount handler
onMounted(async () => {
  // Set isElective from props
  if (props.isElective !== undefined) {
    isElective.value = props.isElective;
  }

  // Load initial data if institution is already set
  if (currentInstitutionId.value) {
    await loadInstitutionData();
  }
});
</script>

<style scoped>
.subject-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0;
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
    var(--primary-color, #4ade80) 0%,
    var(--secondary-color, #3b82f6) 100%
  );
  color: white;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--text-color-1, #1f2937);
}

.form-subtitle {
  font-size: 14px;
  color: var(--text-color-2, #6b7280);
  margin: 4px 0 0 0;
}

.subject-type-indicator {
  flex-shrink: 0;
}

.form-card {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.form-card:hover {
  border-color: var(--primary-color, #4ade80);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.feature-options {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.switch-container {
  display: flex;
  align-items: center;
}

.form-help-text {
  font-size: 12px;
  color: var(--text-color-3, #9ca3af);
  margin-top: 4px;
}

.form-actions {
  background: var(--card-color);
  border-top: 1px solid var(--border-color);
  padding: 24px;
  margin: 0 -24px -24px -24px;
  border-radius: 0 0 12px 12px;
}

.cancel-button {
  min-width: 100px;
}

.submit-button {
  min-width: 140px;
  background: linear-gradient(
    135deg,
    var(--primary-color, #4ade80) 0%,
    var(--secondary-color, #3b82f6) 100%
  );
  border: none;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(
    135deg,
    var(--primary-color, #22c55e) 0%,
    var(--secondary-color, #2563eb) 100%
  );
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* NaiveUI theming */
:deep(.n-card .n-card-header) {
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid var(--border-color, #f3f4f6);
}

:deep(.n-card .n-card-header .n-card-header__main) {
  font-weight: 600;
  color: var(--text-color-1, #1f2937);
}

:deep(.n-card .n-card__content) {
  padding: 24px;
}

:deep(.n-form-item .n-form-item-label) {
  font-weight: 500;
  color: var(--text-color-1, #374151);
  margin-bottom: 8px;
}

:deep(.n-form-item-feedback-wrapper) {
  min-height: 24px;
}

:deep(.n-form-item) {
  margin-bottom: 20px;
}

:deep(.n-input.n-input--large .n-input-wrapper) {
  padding: 0 16px;
  min-height: 44px;
}

:deep(.n-base-selection.n-base-selection--large) {
  min-height: 44px;
}

:deep(.n-input .n-input__border) {
  border-radius: 8px;
}

:deep(.n-base-selection .n-base-selection__border) {
  border-radius: 8px;
}

:deep(.n-divider) {
  margin: 24px 0;
}

:deep(.n-switch.n-switch--large) {
  height: 28px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .form-title {
    color: var(--text-color-1, #f9fafb);
  }

  .form-subtitle {
    color: var(--text-color-2, #d1d5db);
  }

  .form-card {
    background: var(--card-color, #1f2937);
    border-color: var(--border-color, #374151);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .subject-type-indicator {
    align-self: flex-start;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  :deep(.n-card .n-card-header),
  :deep(.n-card .n-card__content) {
    padding: 16px;
  }

  .form-actions {
    padding: 16px;
    margin: 0 -16px -16px -16px;
  }
}
</style>
