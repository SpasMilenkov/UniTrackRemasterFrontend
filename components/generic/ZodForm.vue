<template>
  <Form
    v-slot="{ errors, handleSubmit }"
    :validation-schema="validationSchema"
    :initial-values="initialValues"
  >
    <n-form
      ref="formRef"
      :show-require-mark="showRequireMark"
      :label-placement="labelPlacement"
      :label-width="labelWidth"
      :require-mark-placement="requireMarkPlacement"
    >
      <slot :errors="errors" />
      <div v-if="$slots.actions" class="flex justify-end gap-2 mt-4">
        <slot name="actions" :handle-submit="handleSubmit" :errors="errors" />
      </div>
      <div v-else class="flex justify-end gap-2 mt-4">
        <n-button @click="onCancel">{{ cancelText }}</n-button>
        <n-button
          type="primary"
          :loading="loading"
          :disabled="disableSubmit && Object.keys(errors).length > 0"
          @click="() => handleSubmit(onSubmit)"
        >
          {{ submitText }}
        </n-button>
      </div>
    </n-form>
  </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import { NForm, NButton } from 'naive-ui';
import type { PropType } from 'vue';
import type { ZodSchema } from 'zod';
import { toFormValidator } from '@vee-validate/zod';

const props = defineProps({
  schema: {
    type: Object as PropType<ZodSchema<any>>,
    required: true,
  },
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  submitText: {
    type: String,
    default: 'Submit',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  showRequireMark: {
    type: Boolean,
    default: true,
  },
  labelPlacement: {
    type: String as PropType<'left' | 'top'>,
    default: 'left',
  },
  labelWidth: {
    type: [String, Number],
    default: 120,
  },
  requireMarkPlacement: {
    type: String as PropType<'right' | 'left' | 'right-hanging'>,
    default: 'right-hanging',
  },
  disableSubmit: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['cancel', 'submit']);
const formRef = ref(null);

const validationSchema = computed(() => {
  return toFormValidator(props.schema);
});

const onCancel = () => {
  emit('cancel');
};

const onSubmit = (values: any) => {
  emit('submit', values);
};
</script>
