<!-- components/analytics/AnalyticsRefreshManager.vue -->
<template>
  <!-- This is an invisible component that manages background refresh -->
  <div/>
</template>

<script setup lang="ts">
import {
  useAnalyticsRefresh,
  useAnalyticsNotifications,
} from '~/composables/useAnalyticsPolling';
import { useAnalyticsStore } from '~/stores/analytics';

// Setup background refresh and notifications
const { setupBackgroundRefresh } = useAnalyticsRefresh();
const { handleApiError } = useAnalyticsNotifications();

const analyticsStore = useAnalyticsStore();

// Watch for errors and show notifications
watch(
  () => analyticsStore.error,
  (newError) => {
    if (newError) {
      handleApiError(new Error(newError), 'Background Refresh');
    }
  }
);

onMounted(() => {
  setupBackgroundRefresh();
});
</script>
