<template>
  <div class="bg-background-card rounded-lg p-8 border border-border">
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">
        {{ t('settings.privacy.title') }}
      </h2>
      <p class="text-text-secondary text-sm">
        {{ t('settings.privacy.subtitle') }}
      </p>
    </div>
    <div class="space-y-6">
      <div>
        <h3 class="text-lg font-medium mb-3">
          {{ t('settings.privacy.dataUsage.title') }}
        </h3>
        <n-form-item>
          <n-switch
            :value="privacySettings.dataAnalytics"
            @update:value="updatePrivacySetting('dataAnalytics', $event)"
          />
          <template #label>
            <div class="ml-2">
              <span class="font-medium">{{
                t('settings.privacy.dataUsage.analytics.title')
              }}</span>
              <p class="text-text-secondary text-xs mt-1">
                {{ t('settings.privacy.dataUsage.analytics.description') }}
              </p>
            </div>
          </template>
        </n-form-item>
      </div>
      <div>
        <h3 class="text-lg font-medium mb-3">
          {{ t('settings.privacy.communications.title') }}
        </h3>
        <n-space vertical>
          <n-form-item>
            <n-switch
              :value="privacySettings.emailUpdates"
              @update:value="updatePrivacySetting('emailUpdates', $event)"
            />
            <template #label>
              <div class="ml-2">
                <span class="font-medium">{{
                  t('settings.privacy.communications.emailUpdates.title')
                }}</span>
                <p class="text-text-secondary text-xs mt-1">
                  {{
                    t(
                      'settings.privacy.communications.emailUpdates.description'
                    )
                  }}
                </p>
              </div>
            </template>
          </n-form-item>
          <n-form-item>
            <n-switch
              :value="privacySettings.marketingEmails"
              @update:value="updatePrivacySetting('marketingEmails', $event)"
            />
            <template #label>
              <div class="ml-2">
                <span class="font-medium">{{
                  t('settings.privacy.communications.marketingEmails.title')
                }}</span>
                <p class="text-text-secondary text-xs mt-1">
                  {{
                    t(
                      'settings.privacy.communications.marketingEmails.description'
                    )
                  }}
                </p>
              </div>
            </template>
          </n-form-item>
        </n-space>
      </div>
      <div>
        <h3 class="text-lg font-medium mb-3">
          {{ t('settings.privacy.profileVisibility.title') }}
        </h3>
        <n-form-item>
          <n-select
            :value="privacySettings.profileVisibility"
            :options="visibilityOptions"
            @update:value="updatePrivacySetting('profileVisibility', $event)"
          />
          <template #label>
            <span>{{
              t('settings.privacy.profileVisibility.description')
            }}</span>
          </template>
        </n-form-item>
      </div>
      <div class="flex justify-end mt-6">
        <n-button
          type="primary"
          :loading="isSaving.privacy"
          class="transform hover:scale-105 transition-all duration-300"
          @click="$emit('savePrivacySettings')"
        >
          {{ t('settings.privacy.saveButton') }}
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  privacySettings: {
    type: Object,
    required: true,
  },
  visibilityOptions: {
    type: Array,
    required: true,
  },
  isSaving: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
const emit = defineEmits(['savePrivacySettings', 'updatePrivacySetting']);

function updatePrivacySetting(field, value) {
  emit('updatePrivacySetting', { field, value });
}
</script>
