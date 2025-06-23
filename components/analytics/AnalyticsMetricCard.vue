<!-- components/analytics/AnalyticsMetricCard.vue -->
<template>
  <n-card class="metric-card">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-3 mb-2">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-lg"
            :class="iconBgClass"
          >
            <Icon :name="icon" class="text-lg text-white" />
          </div>
          <div>
            <p class="text-sm font-medium text-text-secondary">{{ title }}</p>
            <p class="text-2xl font-bold text-text-primary">{{ value }}</p>
          </div>
        </div>

        <div v-if="trend" class="flex items-center space-x-1">
          <Icon
            :name="trend.direction === 'up' ? 'ph:trend-up' : 'ph:trend-down'"
            :class="[
              'text-sm',
              trend.direction === 'up' ? 'text-success' : 'text-error',
            ]"
          />
          <span
            :class="[
              'text-xs font-medium',
              trend.direction === 'up' ? 'text-success' : 'text-error',
            ]"
          >
            {{ trend.value }}
          </span>
          <span class="text-xs text-text-secondary">vs last period</span>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NCard } from 'naive-ui';
import { Icon } from '#components';

interface Props {
  title: string;
  value: string;
  icon: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
});

const iconBgClass = computed(() => {
  switch (props.color) {
    case 'success':
      return 'bg-gradient-to-br from-green-500 to-green-600';
    case 'warning':
      return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
    case 'error':
      return 'bg-gradient-to-br from-red-500 to-red-600';
    case 'info':
      return 'bg-gradient-to-br from-blue-500 to-blue-600';
    default:
      return 'bg-gradient-to-br from-primary to-secondary';
  }
});
</script>

<style scoped>
.metric-card {
  @apply transition-all duration-200 hover:shadow-lg;
}
</style>

