<template>
  <div class="space-y-6">
    <n-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="top"
      require-mark-placement="right-hanging"
      size="large"
    >
      <div class="grid grid-cols-1 gap-6">
        <!-- Occupation -->
        <n-form-item label="Occupation" path="occupation">
          <n-input
            v-model:value="formData.occupation"
            placeholder="Enter your occupation"
            maxlength="100"
            show-count
            :disabled="loading"
          >
            <template #prefix>
              <Icon name="ph:briefcase" />
            </template>
          </n-input>
        </n-form-item>

        <!-- Emergency Contact -->
        <n-form-item label="Emergency Contact Phone" path="emergencyContact">
          <n-input
            v-model:value="formData.emergencyContact"
            placeholder="Enter emergency contact number"
            maxlength="20"
            :disabled="loading"
          >
            <template #prefix>
              <Icon name="ph:phone" />
            </template>
          </n-input>
        </n-form-item>

        <!-- Notes -->
        <n-form-item label="Additional Notes" path="notes">
          <n-input
            v-model:value="formData.notes"
            type="textarea"
            placeholder="Any additional information you'd like to share..."
            :rows="4"
            maxlength="500"
            show-count
            :disabled="loading"
          />
        </n-form-item>
      </div>
    </n-form>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-3 pt-4 border-t border-border">
      <n-button :disabled="loading" size="large" @click="handleCancel">
        Cancel
      </n-button>
      <n-button
        type="primary"
        size="large"
        :loading="loading"
        @click="handleSubmit"
      >
        <template #icon>
          <Icon name="ph:check" />
        </template>
        Update Profile
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  type FormInst,
  type FormRules,
} from 'naive-ui';
import { Icon } from '#components';
import type { UpdateParentSchema } from '~/stores/parent';

interface Props {
  loading?: boolean;
  initialValues?: Partial<UpdateParentSchema>;
}

interface Emits {
  (e: 'submit', data: UpdateParentSchema): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  initialValues: () => ({}),
});

const emit = defineEmits<Emits>();

// Form reference
const formRef = ref<FormInst | null>(null);

// Form data
const formData = reactive<UpdateParentSchema>({
  occupation: '',
  emergencyContact: '',
  notes: '',
});

// Form validation rules
const formRules: FormRules = {
  occupation: [
    {
      max: 100,
      message: 'Occupation must be less than 100 characters',
      trigger: ['input', 'blur'],
    },
  ],
  emergencyContact: [
    {
      pattern: /^[\d\s\-\+\(\)]*$/,
      message: 'Please enter a valid phone number',
      trigger: ['input', 'blur'],
    },
    {
      max: 20,
      message: 'Phone number must be less than 20 characters',
      trigger: ['input', 'blur'],
    },
  ],
  notes: [
    {
      max: 500,
      message: 'Notes must be less than 500 characters',
      trigger: ['input', 'blur'],
    },
  ],
};

// Watch for initial values changes
watch(
  () => props.initialValues,
  (newValues) => {
    if (newValues) {
      formData.occupation = newValues.occupation || '';
      formData.emergencyContact = newValues.emergencyContact || '';
      formData.notes = newValues.notes || '';
    }
  },
  { immediate: true, deep: true }
);

// Event handlers
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    // Clean up the data - remove empty strings and convert to undefined
    const cleanData: UpdateParentSchema = {};

    if (formData.occupation?.trim()) {
      cleanData.occupation = formData.occupation.trim();
    }

    if (formData.emergencyContact?.trim()) {
      cleanData.emergencyContact = formData.emergencyContact.trim();
    }

    if (formData.notes?.trim()) {
      cleanData.notes = formData.notes.trim();
    }

    emit('submit', cleanData);
  } catch (error) {
    console.error('Form validation failed:', error);
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>
