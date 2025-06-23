<template>
  <Field
    v-slot="{ field, errorMessage, handleBlur, handleChange }"
    :name="name"
  >
    <n-form-item
      :label="label"
      :validation-status="errorMessage ? 'error' : undefined"
      :feedback="errorMessage"
    >
      <slot
        :field="field"
        :error-message="errorMessage"
        :handle-blur="handleBlur"
        :handle-change="handleChange"
      />
    </n-form-item>
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate';
import { NFormItem } from 'naive-ui';

defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});
</script>
