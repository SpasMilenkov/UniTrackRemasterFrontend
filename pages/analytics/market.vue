<!-- pages/analytics/market.vue -->
<template>
  <div class="p-6 space-y-6">
    <!-- Market Analytics Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-text-primary mb-2">
          Market Analytics
        </h2>
        <p class="text-text-secondary">
          Educational market insights and performance rankings
        </p>
      </div>

      <div class="flex items-center space-x-3">
        <n-select
          v-model:value="selectedPeriod"
          :options="periodOptions"
          style="width: 150px"
          @update:value="handlePeriodChange"
        />

        <n-button
          type="primary"
          :loading="loadingMarket"
          @click="refreshMarketData"
        >
          <template #icon>
            <Icon name="ph:arrow-clockwise" />
          </template>
          Refresh
        </n-button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loadingMarket" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <n-skeleton v-for="i in 4" :key="i" height="120px" />
      </div>
      <n-skeleton height="400px" />
    </div>

    <!-- Market Data Content -->
    <div v-else-if="marketData" class="space-y-6">
      <!-- Market Overview Cards -->
      <MarketOverview :overview="marketData.overview" />

      <!-- Top Performers and Trending Majors -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Performers -->
        <n-card title="Top Performing Institutions" class="h-96">
          <template #header-extra>
            <n-badge :value="marketData.topPerformers.length" type="info" />
          </template>
          <TopPerformersTable :performers="marketData.topPerformers" />
        </n-card>

        <!-- Trending Majors -->
        <n-card title="Trending Academic Programs" class="h-96">
          <TrendingMajorsChart :trends="marketData.majorTrends" />
        </n-card>
      </div>

      <!-- Regional Analysis -->
      <n-card title="Regional Performance Analysis">
        <RegionalBreakdown :regional-data="marketData.regionalData" />
      </n-card>

      <!-- Market Insights -->
      <n-card title="AI Market Insights">
        <div class="prose max-w-none dark:prose-invert">
          <p class="text-text-secondary leading-relaxed">
            {{ marketData.marketInsights }}
          </p>
        </div>

        <template #footer>
          <div
            class="flex items-center justify-between text-sm text-text-secondary"
          >
            <span>Generated: {{ formatDateTime(marketData.generatedAt) }}</span>
            <span>Period: {{ marketData.reportPeriod }}</span>
          </div>
        </template>
      </n-card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Icon
        name="ph:chart-bar"
        class="text-6xl text-text-secondary mb-4 mx-auto"
      />
      <h3 class="text-lg font-medium text-text-primary mb-2">
        No Market Data Available
      </h3>
      <p class="text-text-secondary mb-4">
        Unable to load market analytics data.
      </p>
      <n-button type="primary" @click="retryFetch">
        <template #icon>
          <Icon name="ph:arrow-clockwise" />
        </template>
        Retry
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { NCard, NButton, NBadge, NSkeleton, NSelect } from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsStore } from '~/stores/analytics';
import {
  useAnalyticsFormatters,
  useAnalyticsNotifications,
} from '~/composables/useAnalyticsPolling';

// Stores and composables
const analyticsStore = useAnalyticsStore();
const { formatDateTime } = useAnalyticsFormatters();
const { showSuccessNotification } = useAnalyticsNotifications();

// State
const selectedPeriod = ref('Quarterly');

// Computed
const marketData = computed(() => analyticsStore.marketData);
const loadingMarket = computed(() => analyticsStore.loadingMarket);

const periodOptions = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Yearly', value: 'Yearly' },
];

// Methods
const handlePeriodChange = async () => {
  await analyticsStore.fetchMarketData(selectedPeriod.value);
  showSuccessNotification(
    `Market data updated for ${selectedPeriod.value} period`
  );
};

const refreshMarketData = async () => {
  await analyticsStore.fetchMarketData(selectedPeriod.value);
  showSuccessNotification('Market data refreshed');
};

const retryFetch = async () => {
  await analyticsStore.fetchMarketData(selectedPeriod.value);
};

// Initialize
onMounted(async () => {
  if (!marketData.value) {
    await analyticsStore.fetchMarketData(selectedPeriod.value);
  }
});

// SEO
useHead({
  title: 'Market Analytics',
  meta: [
    {
      name: 'description',
      content:
        'Educational market insights, performance rankings, and industry trends analysis.',
    },
  ],
});

definePageMeta({
  layout: 'default',
});
</script>
