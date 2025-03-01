<template>
  <n-form @submit.prevent="handleSubmit">
    <n-space vertical size="large">
      <n-form-item
        :label="t('forgotPassword.newPasswordLabel')"
        path="password"
        v-bind="passwordProps"
      >
        <n-input
          v-model:value="password"
          type="password"
          :placeholder="t('forgotPassword.newPasswordPlaceholder')"
          show-password-on="click"
        >
          <template #prefix>
            <Icon name="ph:lock-simple" class="text-text-secondary" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item
        :label="t('forgotPassword.confirmPasswordLabel')"
        path="confirmPassword"
        v-bind="confirmPasswordProps"
      >
        <n-input
          v-model:value="confirmPassword"
          type="password"
          :placeholder="t('forgotPassword.confirmPasswordPlaceholder')"
          show-password-on="click"
        >
          <template #prefix>
            <Icon name="ph:lock-simple" class="text-text-secondary" />
          </template>
        </n-input>
      </n-form-item>
      <n-button
        type="primary"
        attr-type="submit"
        size="large"
        class="w-full transform hover:scale-105 transition-all duration-300"
        :loading="isLoading"
      >
        {{ t('forgotPassword.resetButton') }}
      </n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { useNotification } from 'naive-ui';
import { useRoute } from 'vue-router';
import { resetPasswordSchema } from '~/schemas/reset-password.schema';

const emit = defineEmits(['success']);
const { t } = useI18n();
const notification = useNotification();
const authStore = useAuthStore();
const route = useRoute();
const isLoading = ref(false);
const email = route.query.email as string;
const token = route.query.token as string;

const schema = resetPasswordSchema();
const { handleSubmit: formSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

const [password, passwordProps] = defineField('password', naiveUiFormsConfig);
const [confirmPassword, confirmPasswordProps] = defineField(
  'confirmPassword',
  naiveUiFormsConfig
);

const handleSubmit = formSubmit(async (values) => {
  if (!email || !token) {
    notification.error({
      title: t('errors.passwordResetFailed'),
      content: t('errors.missingParameters'),
      duration: 5000,
      closable: true,
    });
    return;
  }

  isLoading.value = true;

  try {
    await authStore.resetPassword({
      email,
      token,
      password: values.password,
    });

    if (authStore.error) {
      notification.error({
        title: t('errors.passwordResetFailed'),
        content: authStore.error || t('errors.defaultError'),
        duration: 5000,
        closable: true,
      });
      return;
    }

    emit('success');
  } catch (error: any) {
    notification.error({
      title: t('errors.passwordResetFailed'),
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
:deep(.n-form-item-label) {
  color: var(--color-text-primary) !important;
  font-weight: 600;
}

:deep(.n-button) {
  background-color: var(--color-primary) !important;
}

:deep(.n-button:hover) {
  background-color: var(--color-primary-hover) !important;
}

:deep(.n-input) {
  background-color: var(--color-background-secondary) !important;
}

:deep(.n-input__input) {
  color: var(--color-text-primary) !important;
}

:deep(.n-input__placeholder) {
  color: var(--color-text-muted) !important;
}
</style>
