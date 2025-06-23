<!-- components/forms/AbsenceForm.vue -->
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

            <n-form-item label="Date" path="date" v-bind="dateProps" required>
              <n-date-picker
                v-model="date"
                type="date"
                clearable
                placeholder="Select date"
                :disabled="loading"
                :is-date-disabled="
                  (timestamp: number) => timestamp > Date.now()
                "
              >
                <template #prefix>
                  <Icon name="carbon:calendar" />
                </template>
              </n-date-picker>
            </n-form-item>
          </div>

          <div class="grid-2-columns">
            <n-form-item
              label="Status"
              path="status"
              v-bind="statusProps"
              required
            >
              <n-select
                v-model:value="status"
                :options="statusOptions"
                placeholder="Select attendance status"
                :disabled="loading"
              >
                <template #prefix>
                  <Icon name="carbon:status" />
                </template>
              </n-select>
            </n-form-item>

            <n-form-item
              label="Subject"
              path="subjectId"
              v-bind="subjectIdProps"
            >
              <n-select
                v-model:value="subjectId"
                :options="subjectOptions"
                placeholder="Select subject (optional)"
                filterable
                clearable
                :disabled="loading"
              >
                <template #prefix>
                  <Icon name="carbon:book" />
                </template>
              </n-select>
            </n-form-item>
          </div>

          <div class="grid-2-columns">
            <n-form-item label="Is Excused" path="isExcused">
              <n-switch v-model:value="isExcused" :disabled="loading">
                <template #checked>Yes</template>
                <template #unchecked>No</template>
              </n-switch>
            </n-form-item>
          </div>

          <n-form-item label="Reason" path="reason" v-bind="reasonProps">
            <n-input
              v-model:value="reason"
              type="textarea"
              placeholder="Reason for absence"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :disabled="loading"
            />
          </n-form-item>
        </div>
      </div>

      <!-- Absence Visualization Section -->
      <div class="form-section">
        <h3 class="section-title">Absence Visualization</h3>
        <div class="section-content">
          <div class="mb-4">
            <div class="flex flex-col gap-2">
              <div class="text-sm text-text-secondary mb-2">
                Attendance status:
              </div>
              <div
                class="h-12 flex items-center justify-center rounded-lg font-semibold"
                :class="{
                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200':
                    isAbsentStatus(status),
                  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200':
                    status === AbsenceStatus.Late,
                  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200':
                    status === AbsenceStatus.ExcusedAbsence ||
                    status === AbsenceStatus.RemoteLearning,
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200':
                    status === AbsenceStatus.ExcusedAbsence,
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200':
                    status === AbsenceStatus.Absent,
                  'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200':
                    !status,
                }"
              >
                {{ status || 'No status selected' }}
                <Icon
                  v-if="status"
                  :name="getStatusIcon(status)"
                  class="ml-2"
                />
              </div>

              <div
                v-if="isExcused"
                class="mt-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded text-sm text-green-700 dark:text-green-300 flex items-center"
              >
                <Icon name="carbon:checkmark-outline" class="mr-2" />
                This absence is marked as excused
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
import { AbsenceStatus } from '~/enums/absence-status.enum';
import { useStudentStore } from '~/stores/student';
import { useSubjectStore } from '~/stores/subject';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import {
  absenceFormSchema,
  type AbsenceFormSchema,
} from '~/schemas/absence.schema';

const props = defineProps<{
  initialValues?: Partial<AbsenceFormSchema>;
  isEditing?: boolean;
  loading?: boolean;
  width?: string;
}>();

const emit = defineEmits<{
  (e: 'submit', data: AbsenceFormSchema): void;
  (e: 'cancel'): void;
}>();

const message = useMessage();
const studentStore = useStudentStore();
const subjectStore = useSubjectStore();

// Status options
const statusOptions = computed(() => [
  { label: 'Absent', value: AbsenceStatus.Absent },
  { label: 'Late', value: AbsenceStatus.Late },
  { label: 'Unexcused Absence', value: AbsenceStatus.UnexcusedAbsence },
]);

// Options from stores
const studentOptions = computed(() => {
  return studentStore.students.map((student) => ({
    label: `${student.firstName} ${student.lastName}`,
    value: student.id,
    type: 'group',
  }));
});

const subjectOptions = computed(() => {
  return subjectStore.subjects.map((subject) => ({
    label: subject.name,
    value: subject.id,
    type: 'group',
  }));
});

// Determine default values
const defaultValues = {
  date: new Date(),
  status: AbsenceStatus.Absent,
  reason: '',
  isExcused: false,
  studentId: '',
  subjectId: null,
  ...props.initialValues,
};

// Form setup with VeeValidate
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(absenceFormSchema),
  initialValues: defaultValues,
});

// Define form fields
const [date, dateProps] = defineField('date', naiveUiFormsConfig);
const [status, statusProps] = defineField('status', naiveUiFormsConfig);
const [reason, reasonProps] = defineField('reason', naiveUiFormsConfig);
const [isExcused, isExcusedProps] = defineField(
  'isExcused',
  naiveUiFormsConfig
);
const [studentId, studentIdProps] = defineField(
  'studentId',
  naiveUiFormsConfig
);
const [subjectId, subjectIdProps] = defineField(
  'subjectId',
  naiveUiFormsConfig
);

// Helper functions
function isAbsentStatus(status: AbsenceStatus | null | undefined): boolean {
  if (!status) return false;
  return [AbsenceStatus.Absent, AbsenceStatus.UnexcusedAbsence].includes(
    status
  );
}

function getStatusIcon(status: AbsenceStatus): string {
  switch (status) {
    case AbsenceStatus.Absent:
      return 'carbon:close-outline';
    case AbsenceStatus.Late:
      return 'carbon:time';
    case AbsenceStatus.UnexcusedAbsence:
      return 'carbon:warning';
    default:
      return 'carbon:help';
  }
}

// Submit form handler
const onSubmit = handleSubmit((formValues) => {
  try {
    emit('submit', formValues as AbsenceFormSchema);
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

:deep(.n-date-picker) {
  width: 100%;
}

:deep(.n-switch) {
  margin-top: 6px;
}
</style>
