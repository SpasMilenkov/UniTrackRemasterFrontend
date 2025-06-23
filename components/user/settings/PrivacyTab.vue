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
    <div v-if="privacyStore" class="space-y-6">
      <div>
        <h3 class="text-lg font-medium mb-3">
          {{ t('settings.privacy.dataUsage.title') }}
        </h3>
        <n-form-item>
          <n-switch
            :value="privacyStore.dataAnalytics"
            @update:value="handleUpdateSetting('dataAnalytics', $event)"
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
              :value="privacyStore.emailUpdates"
              @update:value="handleUpdateSetting('emailUpdates', $event)"
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
              :value="privacyStore.marketingEmails"
              @update:value="handleUpdateSetting('marketingEmails', $event)"
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
            :value="privacyStore.profileVisibility"
            :options="userStore.visibilityOptions"
            @update:value="handleUpdateSetting('profileVisibility', $event)"
          />
          <template #label>
            <span>{{
              t('settings.privacy.profileVisibility.description')
            }}</span>
          </template>
        </n-form-item>
      </div>
    </div>
    <div v-else class="flex justify-center items-center py-8">
      <n-spin size="large" />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';
import { computed, onMounted } from 'vue';
import { useNotification } from 'naive-ui';

const { t } = useI18n();
const userStore = useUserStore();
const notification = useNotification();

// Compute privacy settings from the store
const privacyStore = computed(() => userStore.privacySettings);

// Handle immediate updates for individual settings
async function handleUpdateSetting(field, value) {
  try {
    await userStore.updatePrivacySetting(field, value);
    notification.success({
      title: t('settings.privacy.notifications.settingUpdated'),
      content: t('settings.privacy.notifications.settingUpdatedMessage', {
        field,
      }),
      duration: 3000,
    });
  } catch (error) {
    notification.error({
      title: t('settings.privacy.notifications.error'),
      content:
        error.message || t('settings.privacy.notifications.genericError'),
      duration: 5000,
    });
  }
}

// Fetch privacy settings on component mount if not already loaded
onMounted(async () => {
  if (!privacyStore.value) {
    await userStore.fetchPrivacySettings();
  }
});
</script>
