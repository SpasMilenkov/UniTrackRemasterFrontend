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
        <n-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
        >
          <n-form-item
            path="currentPassword"
            :label="t('settings.security.password.currentPassword')"
          >
            <n-input
              :value="passwordForm.currentPassword"
              type="password"
              :placeholder="
                t('settings.security.password.currentPasswordPlaceholder')
              "
              :disabled="isSaving.password"
              @update:value="updatePasswordField('currentPassword', $event)"
            />
          </n-form-item>
          <n-form-item
            path="newPassword"
            :label="t('settings.security.password.newPassword')"
          >
            <n-input
              :value="passwordForm.newPassword"
              type="password"
              :placeholder="
                t('settings.security.password.newPasswordPlaceholder')
              "
              :disabled="isSaving.password"
              @update:value="updatePasswordField('newPassword', $event)"
            />
          </n-form-item>
          <n-form-item
            path="confirmPassword"
            :label="t('settings.security.password.confirmPassword')"
          >
            <n-input
              :value="passwordForm.confirmPassword"
              type="password"
              :placeholder="
                t('settings.security.password.confirmPasswordPlaceholder')
              "
              :disabled="isSaving.password"
              @update:value="updatePasswordField('confirmPassword', $event)"
            />
          </n-form-item>
          <div class="flex justify-end mt-4">
            <n-button
              type="primary"
              :loading="isSaving.password"
              class="transform hover:scale-105 transition-all duration-300"
              @click="$emit('changePassword')"
            >
              {{ t('settings.security.password.updateButton') }}
            </n-button>
          </div>
        </n-form>
      </div>
    </div>
    <div>
      <h3 class="text-lg font-medium mb-4">
        {{ t('settings.security.twoFactor.title') }}
      </h3>
      <p class="text-text-secondary mb-4">
        {{ t('settings.security.twoFactor.description') }}
      </p>
      <n-button
        type="primary"
        class="transform hover:scale-105 transition-all duration-300"
      >
        <template #icon>
          <Icon name="mdi:shield-lock-outline" class="mr-1" />
        </template>
        {{ t('settings.security.twoFactor.enableButton') }}
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '#components';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  passwordForm: {
    type: Object,
    required: true,
  },
  passwordFormRef: {
    type: Object,
    required: true,
  },
  passwordRules: {
    type: Object,
    required: true,
  },
  isSaving: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['changePassword', 'updatePasswordField']);

function updatePasswordField(field, value) {
  emit('updatePasswordField', { field, value });
}
</script>