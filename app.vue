<template>
  <VitePwaManifest />
  <n-config-provider :theme="theme" :theme-overrides="ssrSafeThemeOverrides">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NNotificationProvider,
  darkTheme,
} from 'naive-ui';
import { useThemeStore } from '~/stores/theme';
import { computed, ref, onMounted } from 'vue';
const themeStore = useThemeStore();
const isClient = ref(false);
// Base theme overrides for SSR
const baseThemeOverrides = computed(() => {
  try {
    return themeStore.getDefaultThemeOverrides
      ? themeStore.getDefaultThemeOverrides()
      : {};
  } catch (error) {
    console.error('Error getting default theme overrides:', error);
    return {};
  }
});
// for SSR, use default theme to avoid hydration mismatches
const theme = computed(() =>
  isClient.value ? themeStore.naiveTheme : darkTheme
);
const ssrSafeThemeOverrides = computed(() =>
  isClient.value ? themeStore.naiveThemeOverrides : baseThemeOverrides.value
);
// Initialize theme when component mounts (client-side only)
onMounted(() => {
  themeStore.initTheme();
  isClient.value = true;
});
</script>
