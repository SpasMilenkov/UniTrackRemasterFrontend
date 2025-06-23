<template>
  <div class="bg-background-card rounded-lg p-8 border border-border">
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">
        {{ t('settings.security.title') }}
      </h2>
      <p class="text-text-secondary text-sm">
        {{ t('settings.security.subtitle') }}
      </p>
    </div>
    <div class="mb-8">
      <h3 class="text-lg font-medium mb-4">
        {{ t('settings.security.password.title') }}
      </h3>
      <div class="max-w-md">
        <n-form @submit.prevent="submitPasswordChange">
          <n-form-item
            :label="t('settings.security.password.currentPassword')"
            v-bind="currentPasswordProps"
            path="currentPassword"
          >
            <n-input
              v-model:value="currentPassword"
              type="password"
              :placeholder="
                t('settings.security.password.currentPasswordPlaceholder')
              "
              :disabled="isSubmitting"
            />
          </n-form-item>
          <n-form-item
            :label="t('settings.security.password.newPassword')"
            v-bind="newPasswordProps"
            path="newPassword"
          >
            <n-input
              v-model:value="newPassword"
              type="password"
              :placeholder="
                t('settings.security.password.newPasswordPlaceholder')
              "
              :disabled="isSubmitting"
            />
          </n-form-item>
          <n-form-item
            :label="t('settings.security.password.confirmPassword')"
            v-bind="confirmPasswordProps"
            path="confirmPassword"
          >
            <n-input
              v-model:value="confirmPassword"
              type="password"
              :placeholder="
                t('settings.security.password.confirmPasswordPlaceholder')
              "
              :disabled="isSubmitting"
            />
          </n-form-item>
          <div class="flex justify-end mt-4">
            <n-button
              type="primary"
              attr-type="submit"
              :loading="isSubmitting"
              class="transform hover:scale-105 transition-all duration-300"
            >
              {{ t('settings.security.password.updateButton') }}
            </n-button>
          </div>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { changePasswordSchema } from '~/schemas/change-password.schema';
import { useMessage } from 'naive-ui';

const { t } = useI18n();
const authStore = useAuthStore();
const message = useMessage();

const isSubmitting = ref(false);

const { handleSubmit, resetForm, defineField } = useForm({
  validationSchema: toTypedSchema(changePasswordSchema()),
});

const [currentPassword, currentPasswordProps] = defineField(
  'currentPassword',
  naiveUiFormsConfig
);
const [newPassword, newPasswordProps] = defineField(
  'newPassword',
  naiveUiFormsConfig
);
const [confirmPassword, confirmPasswordProps] = defineField(
  'confirmPassword',
  naiveUiFormsConfig
);

const submitPasswordChange = handleSubmit(async (values) => {
  try {
    isSubmitting.value = true;
    await authStore.changePassword(values);
    // Reset form
    resetForm();
    message.success(t('settings.security.passwordChangeSuccess'));
  } catch (err: any) {
    console.error(err);
    message.error(err.message || t('settings.security.passwordChangeError'));
  } finally {
    isSubmitting.value = false;
  }
});
</script>
