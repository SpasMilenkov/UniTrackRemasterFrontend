<template>
  <n-form @submit.prevent="handleSubmit">
    <n-space vertical size="large">
      <n-form-item
        :label="t('forgotPassword.newPasswordLabel')"
        path="password"
        label-style="text-gray-300 font-semibold"
        v-bind="passwordProps"
      >
        <n-input
          v-model:value="password"
          type="password"
          :placeholder="t('forgotPassword.newPasswordPlaceholder')"
          show-password-on="click"
          class="bg-[#303035] text-white placeholder-gray-500"
        >
          <template #prefix>
            <Icon name="ph:lock-simple" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item
        :label="t('forgotPassword.confirmPasswordLabel')"
        path="confirmPassword"
        label-style="text-gray-300 font-semibold"
        v-bind="confirmPasswordProps"
      >
        <n-input
          v-model:value="confirmPassword"
          type="password"
          :placeholder="t('forgotPassword.confirmPasswordPlaceholder')"
          show-password-on="click"
          class="bg-[#303035] text-white placeholder-gray-500"
        >
          <template #prefix>
            <Icon name="ph:lock-simple" />
          </template>
        </n-input>
      </n-form-item>
      <n-button
        type="primary"
        attr-type="submit"
        size="large"
        class="w-full"
        :color="isLoading ? undefined : '#4ade80'"
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
