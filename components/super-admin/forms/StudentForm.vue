<!-- components/forms/StudentForm.vue -->
<template>
  <div>
    <ZodForm
      :schema="studentSchema"
      :initial-values="initialValues"
      :loading="loading"
      @submit="onSubmit"
      @cancel="onCancel"
      label-placement="left"
      label-width="120"
      require-mark-placement="right-hanging"
    >
      <template v-slot="{ errors }">
        <!-- Personal Information Section -->
        <div class="form-section">
          <h3 class="text-lg font-medium mb-4">Personal Information</h3>

          <n-form-item
            label="First Name"
            path="firstName"
            :validation-status="errors.firstName ? 'error' : undefined"
            :feedback="errors.firstName"
          >
            <n-input
              v-model:value="form.firstName"
              placeholder="Enter first name"
              :disabled="loading"
            >
              <template #prefix>
                <Icon name="ph:user" />
              </template>
            </n-input>
          </n-form-item>

          <n-form-item
            label="Last Name"
            path="lastName"
            :validation-status="errors.lastName ? 'error' : undefined"
            :feedback="errors.lastName"
          >
            <n-input
              v-model:value="form.lastName"
              placeholder="Enter last name"
              :disabled="loading"
            >
              <template #prefix>
                <Icon name="ph:user" />
              </template>
            </n-input>
          </n-form-item>

          <n-form-item
            label="Email"
            path="email"
            :validation-status="errors.email ? 'error' : undefined"
            :feedback="errors.email"
          >
            <n-input
              v-model:value="form.email"
              placeholder="Enter email address"
              :disabled="loading || (isEditing && !canEditEmail)"
            >
              <template #prefix>
                <Icon name="ph:envelope" />
              </template>
            </n-input>
          </n-form-item>

          <n-form-item
            label="Password"
            path="password"
            :validation-status="errors.password ? 'error' : undefined"
            :feedback="errors.password"
          >
            <n-input
              v-model:value="form.password"
              type="password"
              placeholder="Enter password"
              :disabled="loading"
              show-password-on="click"
            >
              <template #prefix>
                <Icon name="ph:lock" />
              </template>
            </n-input>
            <template v-if="isEditing" #help>
              <div class="text-xs text-gray-500">
                Leave empty to keep current password
              </div>
            </template>
          </n-form-item>
        </div>

        <!-- Student Type & Institution Section -->
        <div class="form-section mt-6">
          <h3 class="text-lg font-medium mb-4">Student Type & Institution</h3>

          <n-form-item
            label="Student Type"
            class="mb-2"
            :validation-status="errors.studentType ? 'error' : undefined"
            :feedback="errors.studentType"
          >
            <div class="flex flex-col gap-2">
              <n-checkbox
                v-model:checked="form.isSchoolStudent"
                @update:checked="handleSchoolStudentChange"
              >
                School Student
              </n-checkbox>

              <n-checkbox
                v-model:checked="form.isUniversityStudent"
                @update:checked="handleUniversityStudentChange"
              >
                University Student
              </n-checkbox>
            </div>
          </n-form-item>

          <n-form-item
            v-if="form.isSchoolStudent"
            label="School"
            path="schoolId"
            :validation-status="errors.schoolId ? 'error' : undefined"
            :feedback="errors.schoolId"
          >
            <n-select
              v-model:value="form.schoolId"
              :options="schoolOptions"
              placeholder="Select school"
              :disabled="loading || schoolOptions.length === 0"
              @update:value="loadGradesForSchool"
            />
            <template v-if="schoolOptions.length === 0" #help>
              <div class="text-xs text-orange-500">
                No schools available. Please create a school first.
              </div>
            </template>
          </n-form-item>

          <n-form-item
            v-if="form.isUniversityStudent"
            label="University"
            path="universityId"
            :validation-status="errors.universityId ? 'error' : undefined"
            :feedback="errors.universityId"
          >
            <n-select
              v-model:value="form.universityId"
              :options="universityOptions"
              placeholder="Select university"
              :disabled="loading || universityOptions.length === 0"
              @update:value="loadGradesForUniversity"
            />
            <template v-if="universityOptions.length === 0" #help>
              <div class="text-xs text-orange-500">
                No universities available. Please create a university first.
              </div>
            </template>
          </n-form-item>

          <n-form-item
            label="Grade/Class"
            path="gradeId"
            :validation-status="errors.gradeId ? 'error' : undefined"
            :feedback="errors.gradeId"
          >
            <n-select
              v-model:value="form.gradeId"
              :options="gradeOptions"
              placeholder="Select grade or class"
              :disabled="
                loading || gradeOptions.length === 0 || !canSelectGrade
              "
            />
            <template v-if="gradeOptions.length === 0" #help>
              <div class="text-xs text-orange-500">
                No grades available. Please create grades first.
              </div>
            </template>
          </n-form-item>
        </div>
      </template>

      <template #actions="{ handleSubmit }">
        <n-button @click="onCancel">Cancel</n-button>
        <n-button
          type="primary"
          :loading="loading"
          @click="() => handleSubmit(onSubmit)"
        >
          {{ isEditing ? 'Update Student' : 'Create Student' }}
        </n-button>
      </template>
    </ZodForm>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { z } from 'zod';
import { useMessage } from 'naive-ui';
import { useInstitutionStore } from '~/stores/institution';
import { useGradeStore } from '~/stores/grade';
import { isHigherEducation, isSchool } from '~/utils/institution-helper';
import ZodForm from '~/components/generic/ZodForm.vue';

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  canEditEmail: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit', 'cancel']);
const message = useMessage();
const institutionStore = useInstitutionStore();
const gradeStore = useGradeStore();

// Define the student form schema with zod
const studentSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: props.isEditing
      ? z.string().optional()
      : z.string().min(8, 'Password must be at least 8 characters'),
    isSchoolStudent: z.boolean().default(false),
    isUniversityStudent: z.boolean().default(false),
    schoolId: z.string().nullable().optional(),
    universityId: z.string().nullable().optional(),
    gradeId: z.string().min(1, 'Grade/Class is required'),
  })
  .refine((data) => data.isSchoolStudent || data.isUniversityStudent, {
    message: 'Student must be enrolled in at least one institution type',
    path: ['studentType'],
  })
  .refine((data) => !data.isSchoolStudent || data.schoolId, {
    message: 'School is required for school students',
    path: ['schoolId'],
  })
  .refine((data) => !data.isUniversityStudent || data.universityId, {
    message: 'University is required for university students',
    path: ['universityId'],
  });

// Form state with reactive data binding
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  isSchoolStudent: false,
  isUniversityStudent: false,
  schoolId: null,
  universityId: null,
  gradeId: '',
});

// Computed properties
const initialValues = computed(() => {
  // Use props.initialValues if editing, otherwise use defaults
  if (props.isEditing && props.initialValues) {
    return {
      ...props.initialValues,
      // Don't include password when editing
      password: '',
    };
  }

  // Default values
  return {
    ...form,
  };
});

const schoolOptions = computed(() => {
  if (!institutionStore.institutions) return [];
    
  return institutionStore.institutions
    .filter((inst) => isSchool(inst.type))
    .map((school) => ({
      label: school.name,
      value: school.id,
    }));
});

const universityOptions = computed(() => {
  if (!institutionStore.institutions) return [];

  return institutionStore.institutions
    .filter((inst) => isHigherEducation(inst.type))
    .map((uni) => ({
      label: uni.name,
      value: uni.id,
    }));
});

const gradeOptions = computed(() => {
  return gradeStore.grades.map((grade) => ({
    label: grade.name || `Grade ${grade.id.substring(0, 4)}`,
    value: grade.id,
  }));
});

const canSelectGrade = computed(() => {
  return (
    (form.isSchoolStudent && form.schoolId) ||
    (form.isUniversityStudent && form.universityId)
  );
});

// Methods
function handleSchoolStudentChange(checked: boolean) {
  form.isSchoolStudent = checked;

  // If unchecking, clear the school ID
  if (!checked) {
    form.schoolId = null;
  }

  // If this is the only active type, ensure at least one grade option is available
  if (checked && !form.isUniversityStudent) {
    loadGradesForSchool(form.schoolId);
  }
}

function handleUniversityStudentChange(checked: boolean) {
  form.isUniversityStudent = checked;

  // If unchecking, clear the university ID
  if (!checked) {
    form.universityId = null;
  }

  // If this is the only active type, ensure at least one grade option is available
  if (checked && !form.isSchoolStudent) {
    loadGradesForUniversity(form.universityId);
  }
}

async function loadGradesForSchool(schoolId: string) {
  if (!schoolId) return;

  try {
    await gradeStore.fetchGradesByInstitution(schoolId);

    // Set the first grade as default if none is selected yet
    if (!form.gradeId && gradeStore.grades.length > 0) {
      form.gradeId = gradeStore.grades[0].id;
    }
  } catch () {
    message.error('Failed to load grades for selected school');
  }
}

async function loadGradesForUniversity(universityId: string) {
  if (!universityId) return;

  try {
    await gradeStore.fetchGradesByInstitution(universityId);

    // Set the first grade as default if none is selected yet
    if (!form.gradeId && gradeStore.grades.length > 0) {
      form.gradeId = gradeStore.grades[0].id;
    }
  } catch () {
    message.error('Failed to load grades for selected university');
  }
}

function onSubmit(values: any) {
  // If editing and password field is empty, remove it
  if (props.isEditing && (!values.password || values.password.trim() === '')) {
    const { password, ...restValues } = values;
    emit('submit', restValues);
  } else {
    emit('submit', values);
  }
}

function onCancel() {
  emit('cancel');
}

// Initialize form with initial values
onMounted(() => {
  // If editing, populate the form with initial values
  if (props.initialValues) {
    Object.assign(form, props.initialValues);

    // If we have a school or university ID, load the grades
    if (form.isSchoolStudent && form.schoolId) {
      loadGradesForSchool(form.schoolId);
    }

    if (form.isUniversityStudent && form.universityId) {
      loadGradesForUniversity(form.universityId);
    }
  }

  // If we have an active institution, set the appropriate defaults
  if (institutionStore.activeInstitution) {
    const activeInst = institutionStore.activeInstitution;

    if (isSchool(activeInst.type) && !form.schoolId) {
      form.isSchoolStudent = true;
      form.schoolId = activeInst.id;
      loadGradesForSchool(activeInst.id);
    } else if (isHigherEducation(activeInst.type) && !form.universityId) {
      form.isUniversityStudent = true;
      form.universityId = activeInst.id;
      loadGradesForUniversity(activeInst.id);
    }
  }

  // Fetch grades if not already loaded
  if (gradeStore.grades.length === 0) {
    gradeStore.fetchGrades();
  }
});
</script>

<style scoped>
.form-section {
  margin-bottom: 24px;
}
</style>
'
