<!-- layouts/analytics.vue -->
<template>
  <div class="min-h-screen bg-background">
    <!-- Analytics Header -->
    <div class="bg-background-card border-b border-border sticky top-0 z-40">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Navigation & Title -->
          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-3">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary text-white"
              >
                <Icon name="ph:chart-line" class="text-xl" />
              </div>
              <div>
                <h1 class="text-xl font-semibold text-text-primary">
                  Analytics Dashboard
                </h1>
                <p class="text-sm text-text-secondary">
                  {{ currentInstitution?.name || 'No institution selected' }}
                </p>
              </div>
            </div>

            <!-- Navigation Tabs -->
            <nav class="hidden md:flex space-x-1">
              <NuxtLink
                v-for="tab in navigationTabs"
                :key="tab.path"
                :to="tab.path"
                class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="
                  isActiveTab(tab.path)
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background'
                "
              >
                <Icon :name="tab.icon" class="mr-2" />
                {{ tab.label }}
              </NuxtLink>
            </nav>
          </div>

          <!-- Actions & Status -->
          <div class="flex items-center space-x-3">
            <!-- Data Refresh Status -->
            <div
              class="flex items-center space-x-2 text-xs text-text-secondary"
            >
              <Icon
                :name="isLoading ? 'ph:spinner' : 'ph:check-circle'"
                :class="[
                  'text-sm',
                  isLoading ? 'animate-spin text-primary' : 'text-success',
                ]"
              />
              <span>{{ refreshStatusText }}</span>
            </div>

            <!-- Manual Refresh Button -->
            <n-button
              quaternary
              circle
              size="medium"
              :loading="isRefreshing"
              @click="handleRefresh"
            >
              <template #icon>
                <Icon name="ph:arrow-clockwise" />
              </template>
            </n-button>

            <!-- Institution Selector (SuperAdmin only) -->
            <n-select
              v-if="canSwitchInstitution"
              v-model:value="selectedInstitutionId"
              :options="institutionOptions"
              placeholder="Select Institution"
              class="w-64"
              @update:value="handleInstitutionChange"
            />

            <!-- Actions Menu -->
            <n-dropdown
              :options="actionMenuOptions"
              @select="handleActionSelect"
            >
              <n-button quaternary circle size="medium">
                <template #icon>
                  <Icon name="ph:dots-three-outline" />
                </template>
              </n-button>
            </n-dropdown>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="md:hidden mt-4">
          <n-tabs
            v-model:value="currentTab"
            type="line"
            size="small"
            @update:value="handleTabChange"
          >
            <n-tab-pane
              v-for="tab in navigationTabs"
              :key="tab.path"
              :name="tab.path"
              :tab="tab.label"
            />
          </n-tabs>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="p-6">
      <n-alert type="error" :title="errorTitle" closable @close="clearError">
        {{ error }}
      </n-alert>
    </div>

    <!-- Main Content -->
    <main class="flex-1">
      <NuxtPage />
    </main>

    <!-- Background Data Refresh -->
    <AnalyticsRefreshManager />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  NButton,
  NSelect,
  NTabs,
  NTabPane,
  NDropdown,
  NAlert,
  useMessage,
} from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsRefresh } from '~/composables/useAnalyticsPolling';
import { useAnalyticsStore } from '~/stores/analytics';

// Stores and composables
const analyticsStore = useAnalyticsStore();
const institutionStore = useInstitutionStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const message = useMessage();

// Data refresh composable
const { setupBackgroundRefresh } = useAnalyticsRefresh();

// State
const isRefreshing = ref(false);
const selectedInstitutionId = ref<string | null>(null);

// Navigation configuration
const navigationTabs = [
  {
    path: '/analytics',
    label: 'Dashboard',
    icon: 'ph:chart-pie',
  },
  {
    path: '/analytics/market',
    label: 'Market',
    icon: 'ph:trend-up',
  },
  {
    path: '/analytics/compare',
    label: 'Compare',
    icon: 'ph:arrows-left-right',
  },
  {
    path: '/analytics/reports',
    label: 'Reports',
    icon: 'ph:file-text',
  },
];

// Computed properties
const currentInstitution = computed(() => institutionStore.activeInstitution);
const isLoading = computed(() => analyticsStore.isLoading);
const error = computed(() => analyticsStore.error);

const currentTab = computed(() => route.path);

const canSwitchInstitution = computed(() => {
  return userStore.userDetails?.role === 'SuperAdmin';
});

const institutionOptions = computed(() => {
  return institutionStore.institutions.map((inst) => ({
    label: inst.name,
    value: inst.id,
  }));
});

const refreshStatusText = computed(() => {
  if (isLoading.value) return 'Refreshing...';
  if (error.value) return 'Error occurred';
  return 'Data up to date';
});

const errorTitle = computed(() => {
  if (error.value?.includes('permission')) return 'Access Denied';
  if (error.value?.includes('network')) return 'Network Error';
  return 'Analytics Error';
});

const actionMenuOptions = computed(() => [
  {
    label: 'Export Dashboard',
    key: 'export',
    icon: () => h(Icon, { name: 'ph:download' }),
  },
  {
    label: 'Share Analytics',
    key: 'share',
    icon: () => h(Icon, { name: 'ph:share' }),
  },
  {
    type: 'divider',
    key: 'divider1',
  },
  {
    label: 'Settings',
    key: 'settings',
    icon: () => h(Icon, { name: 'ph:gear' }),
  },
]);

// Methods
const isActiveTab = (path: string): boolean => {
  if (path === '/analytics') {
    return route.path === '/analytics' || route.path === '/analytics/';
  }
  return route.path.startsWith(path);
};

const handleTabChange = (tabPath: string) => {
  router.push(tabPath);
};

const handleRefresh = async () => {
  isRefreshing.value = true;
  try {
    await analyticsStore.refreshDashboard();
    message.success('Analytics data refreshed successfully');
  } catch (err: any) {
    message.error('Failed to refresh analytics data');
  } finally {
    isRefreshing.value = false;
  }
};

const handleInstitutionChange = (institutionId: string) => {
  const institution = institutionStore.institutions.find(
    (inst) => inst.id === institutionId
  );
  if (institution) {
    institutionStore.setActiveInstitution(institution);
    message.info(`Switched to ${institution.name}`);
  }
};

const handleActionSelect = (key: string) => {
  switch (key) {
    case 'export':
      message.info('Export functionality coming soon');
      break;
    case 'share':
      message.info('Share functionality coming soon');
      break;
    case 'settings':
      router.push('/analytics/settings');
      break;
  }
};

const clearError = () => {
  // Clear error from store if needed
  message.info('Error dismissed');
};

// Initialize
onMounted(() => {
  // Set selected institution
  if (currentInstitution.value) {
    selectedInstitutionId.value = currentInstitution.value.id;
  }

  // Setup background refresh
  setupBackgroundRefresh();

  // Initial data fetch if needed
  if (!analyticsStore.dashboard && currentInstitution.value) {
    analyticsStore.fetchDashboard();
  }
});

// Watch for institution changes
watch(
  () => currentInstitution.value,
  (newInstitution) => {
    if (newInstitution) {
      selectedInstitutionId.value = newInstitution.id;
      // Refresh analytics data for new institution
      analyticsStore.refreshDashboard();
    }
  }
);

// SEO and meta
useHead({
  title: 'Analytics Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Comprehensive analytics dashboard for educational institutions',
    },
  ],
});

definePageMeta({
  layout: false,
});
</script>

<style scoped>
.analytics-nav-transition {
  transition: all 0.2s ease-in-out;
}
</style>
