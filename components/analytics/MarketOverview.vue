<!-- components/analytics/MarketOverview.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Institutions -->
    <n-card class="border-l-4 border-l-primary">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-text-secondary">
            Total Institutions
          </p>
          <p class="text-2xl font-bold text-text-primary">
            {{ formatNumber(overview.totalInstitutions) }}
          </p>
        </div>
        <div class="p-3 bg-primary/10 rounded-lg">
          <Icon name="ph:buildings" class="text-2xl text-primary" />
        </div>
      </div>
    </n-card>

    <!-- Total Students -->
    <n-card class="border-l-4 border-l-info">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-text-secondary">Total Students</p>
          <p class="text-2xl font-bold text-text-primary">
            {{ formatNumber(overview.totalStudents) }}
          </p>
        </div>
        <div class="p-3 bg-info/10 rounded-lg">
          <Icon name="ph:users" class="text-2xl text-info" />
        </div>
      </div>
    </n-card>

    <!-- Average Score -->
    <n-card class="border-l-4 border-l-success">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-text-secondary">
            Market Average Score
          </p>
          <p class="text-2xl font-bold text-text-primary">
            {{ formatScore(overview.averageScore) }}
          </p>
        </div>
        <div class="p-3 bg-success/10 rounded-lg">
          <Icon name="ph:chart-line-up" class="text-2xl text-success" />
        </div>
      </div>
    </n-card>

    <!-- Market Growth -->
    <n-card class="border-l-4 border-l-warning">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-text-secondary">
            Market Growth Rate
          </p>
          <p class="text-2xl font-bold text-text-primary">
            {{ formatPercentage(overview.marketGrowthRate) }}
          </p>
          <div class="flex items-center mt-1">
            <Icon
              :name="
                overview.marketGrowthRate >= 0 ? 'ph:trend-up' : 'ph:trend-down'
              "
              :class="
                overview.marketGrowthRate >= 0 ? 'text-success' : 'text-error'
              "
            />
            <span class="text-xs text-text-secondary ml-1">vs last period</span>
          </div>
        </div>
        <div class="p-3 bg-warning/10 rounded-lg">
          <Icon name="ph:trending-up" class="text-2xl text-warning" />
        </div>
      </div>
    </n-card>
  </div>

  <!-- Institution Types Breakdown -->
  <n-card title="Institution Types Distribution" class="mt-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div
          v-for="(count, type) in overview.institutionsByType"
          :key="type"
          class="flex items-center justify-between p-3 bg-background-secondary rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div :class="getTypeIconClass(type)">
              <Icon :name="getTypeIcon(type)" class="text-lg" />
            </div>
            <span class="font-medium text-text-primary">{{
              formatTypeName(type)
            }}</span>
          </div>
          <div class="text-right">
            <p class="font-semibold text-text-primary">
              {{ formatNumber(count) }}
            </p>
            <p class="text-xs text-text-secondary">
              {{ formatPercentage((count / overview.totalInstitutions) * 100) }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center">
        <InstitutionTypesDonutChart :data="overview.institutionsByType" />
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NCard } from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsFormatters } from '~/composables/useAnalyticsPolling';
import type { MarketOverviewDto } from '~/stores/analytics';

// Props
interface Props {
  overview: MarketOverviewDto;
}

const props = defineProps<Props>();

// Composables
const { formatNumber, formatScore, formatPercentage } =
  useAnalyticsFormatters();

// Helper methods
const getTypeIcon = (type: string) => {
  const typeMap: Record<string, string> = {
    School: 'ph:chalkboard-teacher',
    University: 'ph:university',
    College: 'ph:graduation-cap',
    Institute: 'ph:building-office',
  };
  return typeMap[type] || 'ph:building';
};

const getTypeIconClass = (type: string) => {
  const colorMap: Record<string, string> = {
    School: 'p-2 bg-primary/10 text-primary rounded-lg',
    University: 'p-2 bg-info/10 text-info rounded-lg',
    College: 'p-2 bg-success/10 text-success rounded-lg',
    Institute: 'p-2 bg-warning/10 text-warning rounded-lg',
  };
  return colorMap[type] || 'p-2 bg-gray-100 text-gray-600 rounded-lg';
};

const formatTypeName = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1) + 's';
};
</script>
