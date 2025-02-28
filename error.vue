<!-- error.vue -->
<template>
  <n-config-provider
    :theme="themeStore.naiveTheme"
    :theme-overrides="themeStore.naiveThemeOverrides"
  >
    <n-space align="center" justify="center" class="min-h-screen bg-background">
      <n-card class="w-full max-w-md mx-4 text-center themed-card">
        <template #header>
          <n-h1>
            <n-icon size="48" class="text-red-500">
              <Icon name="ion:warning-outline" />
            </n-icon>
          </n-h1>
        </template>
        <n-h2 class="mb-4 text-text-primary">{{ t('errorPage.title') }}</n-h2>
        <n-p v-if="error.statusCode === 404" class="mb-6 text-text-secondary">
          {{ t('errorPage.pageNotFoundMessage') }}
        </n-p>
        <n-p v-else class="mb-6 text-text-secondary">{{
          t('errorPage.errorMessage')
        }}</n-p>
        <n-p class="text-orange-600 text-xl">{{
          t('errorPage.errorText') + error.statusCode
        }}</n-p>
        <template #footer>
          <n-button type="primary" @click="handleError">
            {{ t('errorPage.buttonText') }}
          </n-button>
        </template>
      </n-card>
    </n-space>
  </n-config-provider>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import {
  NCard,
  NH1,
  NH2,
  NP,
  NButton,
  NIcon,
  NConfigProvider,
  NSpace,
} from 'naive-ui';
import { useThemeStore } from '~/stores/theme';

const { t } = useI18n();
const themeStore = useThemeStore();

defineProps<{
  error: NuxtError;
}>();

const handleError = () => {
  navigateTo('/');
};
</script>

<style scoped>
:deep(.themed-card) {
  background-color: var(--color-background-card) !important;
  border: 1px solid var(--color-border) !important;
}

:deep(.themed-card .n-card-header__main) {
  color: var(--color-text-primary) !important;
}

:deep(.n-h2) {
  color: var(--color-text-primary) !important;
}

:deep(.n-p) {
  color: var(--color-text-secondary) !important;
}
</style>
