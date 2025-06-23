<!-- components/forms/MarkForm.vue -->
<template>
  <div class="form-container">
    <n-form
      label-placement="left"
      :label-width="140"
      require-mark-placement="right-hanging"
      @submit.prevent="onSubmit"
    >
      <!-- Basic Information Section -->
      <div class="form-section">
        <h3 class="section-title">Basic Information</h3>
        <div class="section-content">
          <div class="grid-2-columns">
            <n-form-item
              label="Student"
              path="studentId"
              v-bind="studentIdProps"
              required
            >
              <n-select
                v-model:value="studentId"
                :options="studentOptions"
                placeholder="Select student"
                filterable
                :disabled="loading"
              >
                <template #prefix>
                  <Icon name="carbon:user-profile" />
                </template>
              </n-select>
            </n-form-item>

            <n-form-item
              label="Subject"
              path="subjectId"
              v-bind="subjectIdProps"
              required
            >
              <n-select
                v-model:value="subjectId"
                :options="subjectOptions"
                placeholder="Select subject"
                filterable
                :disabled="loading"
              >
                <template #prefix>
                  <Icon name="carbon:book" />
                </template>
              </n-select>
            </n-form-item>
          </div>

          <div class="grid-2-columns">
            <n-form-item
              label="Teacher"
              path="teacherId"
              v-bind="teacherIdProps"
              required
            >
              <n-select
                v-model:value="teacherId"
                :options="teacherOptions"
                placeholder="Select teacher"
                filterable
                :disabled="loading"
              >
                <template #prefix>
                  <Icon name="carbon:education" />
                </template>
              </n-select>
            </n-form-item>

            <n-form-item
              label="Mark Type"
              path="type"
              v-bind="typeProps"
              required
            >
              <n-select
                v-model:value="type"
                :options="markTypeOptions"
                placeholder="Select mark type"
                :disabled="loading"
              >
                <template #prefix>
                  <Icon name="carbon:category" />
                </template>
              </n-select>
            </n-form-item>
          </div>
        </div>
      </div>

      <!-- Mark Details Section -->
      <div class="form-section">
        <h3 class="section-title">Mark Details</h3>
        <div class="section-content">
          <div class="grid-2-columns">
            <n-form-item
              label="Mark Value"
              path="value"
              v-bind="valueProps"
              required
            >
              <n-input-number
                v-model:value="value"
                :min="2"
                :max="6"
                :step="0.25"
                :precision="2"
                placeholder="Mark value (2-6)"
                clearable
                :disabled="loading"
              >
                <template #prefix>
                  <Icon name="carbon:number" />
                </template>
              </n-input-number>
              <template #feedback>
                <div v-if="value && value > 0" class="text-xs mt-1">
                  <span
                    :class="{
                      'text-red-500': value < 3,
                      'text-orange-500': value >= 3 && value < 4,
                      'text-yellow-500': value >= 4 && value < 5,
                      'text-green-500': value >= 5,
                    }"
                  >
                    {{ getMarkDescription(value) }}
                  </span>
                </div>
              </template>
            </n-form-item>

            <n-form-item label="Topic" path="topic" v-bind="topicProps">
              <n-input
                v-model:value="topic"
                placeholder="Topic covered by this mark"
                :disabled="loading"
              >
                <template #prefix>
                  <Icon name="carbon:text-creation" />
                </template>
              </n-input>
            </n-form-item>
          </div>

          <n-form-item
            label="Description"
            path="description"
            v-bind="descriptionProps"
          >
            <n-input
              v-model:value="description"
              type="textarea"
              placeholder="Additional notes or feedback for the student"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :disabled="loading"
            />
          </n-form-item>
        </div>
      </div>

      <!-- Mark Visualization Section -->
      <div class="form-section">
        <h3 class="section-title">Mark Visualization</h3>
        <div class="section-content">
          <div class="mb-4">
            <div class="flex flex-col gap-2">
              <div class="text-sm text-text-secondary mb-2">
                Visual representation of the mark
              </div>
              <div
                class="h-8 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
              >
                <div
                  v-if="value"
                  class="h-full rounded-full"
                  :class="{
                    'bg-red-500': value < 3,
                    'bg-orange-500': value >= 3 && value < 4,
                    'bg-yellow-500': value >= 4 && value < 5,
                    'bg-green-500': value >= 5,
                  }"
                  :style="{
                    width: getPercentage(value) + '%',
                  }"
                />
              </div>
              <div
                class="flex justify-between text-xs text-text-secondary mt-1"
              >
                <span>2.00</span>
                <span>3.00</span>
                <span>4.00</span>
                <span>5.00</span>
                <span>6.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <n-button :disabled="loading" @click="emit('cancel')">Cancel</n-button>
        <n-button type="primary" :loading="loading" attr-type="submit">
          {{ isEditing ? 'Update' : 'Create' }}
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useMessage } from 'naive-ui';
import { MarkType } from '~/enums/mark-type.enum';
import { useStudentStore } from '~/stores/student';
import { useTeacherStore } from '~/stores/teacher';
import { useSubjectStore } from '~/stores/subject';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import { markFormSchema, type MarkFormSchema } from '~/schemas/mark.schema';

const props = defineProps<{
  initialValues?: Partial<MarkFormSchema>;
  isEditing?: boolean;
  loading?: boolean;
  width?: string;
}>();

const emit = defineEmits<{
  (e: 'submit', data: MarkFormSchema): void;
  (e: 'cancel'): void;
}>();

const message = useMessage();
const studentStore = useStudentStore();
const teacherStore = useTeacherStore();
const subjectStore = useSubjectStore();

// Allow controlling the form width from parent component
const formWidth = computed(() => props.width || '100%');

// Mark Type options
const markTypeOptions = computed(() => [
  { label: 'Written Exam', value: MarkType.WrittenExamination },
  { label: 'Oral Exam', value: MarkType.OralExamination },
  { label: 'Assignment', value: MarkType.Assignment },
  { label: 'Participation', value: MarkType.ActiveParticipation },
]);

// Options from stores
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

// Determine default values
const defaultValues = {
  topic: '',
  description: '',
  type: MarkType.WrittenExamination,
  subjectId: '',
  teacherId: '',
  studentId: '',
  ...props.initialValues,
  value: !props.initialValues?.value ? props.initialValues?.value : 6.0,
};

// Form setup with VeeValidate
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(markFormSchema),
  initialValues: defaultValues,
});

// Define form fields
const [value, valueProps] = defineField('value', naiveUiFormsConfig);
const [topic, topicProps] = defineField('topic', naiveUiFormsConfig);
const [description, descriptionProps] = defineField(
  'description',
  naiveUiFormsConfig
);
const [type, typeProps] = defineField('type', naiveUiFormsConfig);
const [subjectId, subjectIdProps] = defineField(
  'subjectId',
  naiveUiFormsConfig
);
const [teacherId, teacherIdProps] = defineField(
  'teacherId',
  naiveUiFormsConfig
);
const [studentId, studentIdProps] = defineField(
  'studentId',
  naiveUiFormsConfig
);

// Helper functions for mark visualization
function getMarkDescription(markValue: number): string {
  if (markValue < 3) return 'Failing';
  if (markValue < 4) return 'Satisfactory';
  if (markValue < 5) return 'Good';
  if (markValue < 5.5) return 'Very Good';
  return 'Excellent';
}

function getPercentage(markValue: number): number {
  // Convert mark on scale 2-6 to percentage 0-100
  return Math.min(Math.max(((markValue - 2) / 4) * 100, 0), 100);
}

// Submit form handler
const onSubmit = handleSubmit((formValues) => {
  try {
    emit('submit', formValues as MarkFormSchema);
  } catch (error: any) {
    message.error(`An error occurred: ${error.message}`);
  }
});
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 0;
  max-width: 100%;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--color-text-primary, #1f2937);
  border-bottom: none;
}

.section-content {
  padding: 0;
}

.grid-2-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .grid-2-columns {
    grid-template-columns: 1fr;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  border-top: 1px solid var(--color-border, rgba(229, 231, 235, 0.2));
  padding-top: 16px;
}

:deep(.n-form-item) {
  margin-bottom: 12px;
}

:deep(.n-form-item:last-child) {
  margin-bottom: 0;
}

/* Make inputs better match screenshot */
:deep(.n-input) {
  border-radius: 4px;
}

:deep(.n-input .n-input__input-el) {
  height: 36px;
  padding: 0 12px;
}

:deep(.n-input-number) {
  width: 100%;
}

:deep(.n-base-selection) {
  min-height: 36px;
}

:deep(.n-form-item-label) {
  font-size: 14px;
}

:deep(.n-form-item-label__asterisk) {
  color: #e53935;
}
</style>
