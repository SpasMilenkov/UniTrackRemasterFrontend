<template>
  <n-form @submit.prevent="handleSubmit">
    <n-space vertical size="large">
      <n-form-item
        :label="t('forgotPassword.emailLabel')"
        path="email"
        label-style="color: var(--color-text-primary); font-weight: 600;"
        v-bind="emailProps"
      >
        <n-input
          v-model:value="email"
          :placeholder="t('forgotPassword.emailPlaceholder')"
          class="themed-input"
        >
          <template #prefix>
            <Icon name="ph:envelope" />
          </template>
        </n-input>
      </n-form-item>

      <n-button
        type="primary"
        attr-type="submit"
        size="large"
        class="w-full"
        :loading="isLoading"
      >
        {{ t('forgotPassword.continueButton') }}
      </n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { useNotification } from 'naive-ui';

const emit = defineEmits(['success']);
const { t } = useI18n();
const notification = useNotification();
const authStore = useAuthStore();
const isLoading = ref(false);

const schema = z.object({
  email: z.string().email(),
});

const { handleSubmit: formSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

const [email, emailProps] = defineField('email', naiveUiFormsConfig);

const handleSubmit = formSubmit(async (values) => {
  isLoading.value = true;
  try {
    await authStore.forgotPassword(values.email);
    emit('success');
  } catch (error: any) {
    notification.error({
      title: t('errors.emailVerificationFailed'),
      content: error.message || t('errors.defaultError'),
      duration: 5000,
      closable: true,
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.themed-input :deep(.n-input__input) {
  background-color: var(--color-background-secondary) !important;
  color: var(--color-text-primary) !important;
}

.themed-input :deep(.n-input__placeholder) {
  color: var(--color-text-muted) !important;
}

.themed-input :deep(.n-input__border),
.themed-input :deep(.n-input__state-border) {
  border-color: var(--color-border) !important;
}

.themed-input:hover :deep(.n-input__border),
.themed-input:hover :deep(.n-input__state-border) {
  border-color: var(--color-primary) !important;
  opacity: 0.5;
}

.themed-input:focus-within :deep(.n-input__border),
.themed-input:focus-within :deep(.n-input__state-border) {
  border-color: var(--color-primary) !important;
}
</style>
