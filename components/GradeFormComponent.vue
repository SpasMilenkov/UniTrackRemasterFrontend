<template>
  <n-card
    :title="formType === 'create' ? 'Add Grade' : 'Edit Grade'"
    size="large"
    class="max-w-xl mx-auto p-4 flex"
  >
    <n-form @submit.prevent="onSubmit">
      <!-- Student Information Section -->
      <n-divider>Student Information</n-divider>
      <n-space vertical>
        <n-form-item
          label="Student number"
          v-bind="studentNumberProps"
          path="studentNumber"
        >
          <n-input v-model:value="studentNumber" readonly />
        </n-form-item>
        <n-form-item
          label="Student name"
          v-bind="studentNameProps"
          path="studentName"
        >
          <n-input v-model:value="studentName" readonly />
        </n-form-item>
      </n-space>
      <!-- Grading Section -->
      <n-divider>Grade Information</n-divider>
      <n-space vertical>
        <n-form-item label="Grade" v-bind="gradeProps" path="grade">
          <n-select v-model:value="grade" :options="gradeValueOptions" />
        </n-form-item>
        <n-form-item label="Type" v-bind="gradeTypeProps" path="gradeType">
          <n-select v-model:value="gradeType" :options="gradeTypeOptions" />
        </n-form-item>
        <n-form-item label="Date" v-bind="dateProps" path="date">
          <n-date-picker v-model:value="date" />
        </n-form-item>
        <n-form-item label="Material" v-bind="materialProps">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-input v-model:value="material" />
            </template>
            On what topic was the student examined.
          </n-tooltip>
        </n-form-item>
      </n-space>
      <!-- Submit Button -->
      <n-space justify="center">
        <n-button type="primary" attr-type="submit" size="large"
          >Submit</n-button
        >
      </n-space>
    </n-form>
  </n-card>
</template>
<script setup lang="ts">
import * as z from 'zod';
import { NDatePicker, type SelectOption, NIcon } from 'naive-ui';
import { GradeType } from '~/utils/grade-type.enum';
import {
  DocumentTextOutline,
  PencilOutline,
  FileTrayStackedOutline,
  ChatbubbleOutline,
} from '@vicons/ionicons5';

console.log('LOADING');

//Emits
const emit = defineEmits(['submitGrade', 'closeGradeForm']);

//Props
defineProps({
  formType: {
    type: Object as () => 'edit' | 'create',
    required: true,
  },
});

//Schema

const schema = z.object({
  studentId: z.string(), //hidden property from the form
  studentName: z.string(),
  studentNumber: z.string(),
  grade: z.string().min(2),
  gradeType: z.nativeEnum(GradeType),
  date: z.number(),
  material: z.string(),
});

//Form
const { defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
});

//Form Fields
const [studentNumber, studentNumberProps] = defineField(
  'studentNumber',
  naiveUiFormsConfig
);
const [studentName, studentNameProps] = defineField(
  'studentName',
  naiveUiFormsConfig
);
const [grade, gradeProps] = defineField('grade', naiveUiFormsConfig);
const [gradeType, gradeTypeProps] = defineField(
  'gradeType',
  naiveUiFormsConfig
);
const [date, dateProps] = defineField('date', naiveUiFormsConfig);
const [material, materialProps] = defineField('material', naiveUiFormsConfig);

//Variables
const gradeValueOptions: SelectOption[] = [
  { label: 'Excellent', value: 'excellent' },
  { label: 'Very Good', value: 'veryGood' },
  { label: 'Improvement Needed', value: 'improvementNeeded' },
  { label: 'Close To Fail', value: 'closeFail' },
  { label: 'Fail', value: 'Fail' },
];

const gradeTypeOptions: SelectOption[] = [
  {
    label: () => {
      return [
        h('div', { class: 'flex items-center space-x-2' }, [
          h(
            NIcon,
            { class: 'text-green-500 text-xl' },
            {
              default: () => h(ChatbubbleOutline),
            }
          ),
          h('span', { class: 'text-sm' }, 'Oral Examination'),
        ]),
      ];
    },
    value: GradeType.ORAL_EXAMINATION,
  },
  {
    label: () => {
      return [
        h('div', { class: 'flex items-center space-x-2' }, [
          h(
            NIcon,
            { class: 'text-blue-500 text-xl' },
            {
              default: () => h(DocumentTextOutline),
            }
          ),
          h('span', { class: 'text-sm' }, 'Written Examination'),
        ]),
      ];
    },
    value: GradeType.WRITTEN_EXAMINATION,
  },
  {
    label: () => {
      return [
        h('div', { class: 'flex items-center space-x-2' }, [
          h(
            NIcon,
            { class: 'text-orange-500 text-xl' },
            {
              default: () => h(PencilOutline),
            }
          ),
          h('span', { class: 'text-sm' }, 'Assignment'),
        ]),
      ];
    },
    value: GradeType.ASSIGNMENT,
  },
  {
    label: () => {
      return [
        h('div', { class: 'flex items-center space-x-2' }, [
          h(
            NIcon,
            { class: 'text-purple-500 text-xl' },
            {
              default: () => h(FileTrayStackedOutline),
            }
          ),
          h('span', { class: 'text-sm' }, 'Active Participation'),
        ]),
      ];
    },
    value: GradeType.ACTIVE_PARTICIPATION,
  },
];

//Methods
const onSubmit = handleSubmit((values) => {
  emit('submitGrade', values);
});
</script>
<style scoped></style>
