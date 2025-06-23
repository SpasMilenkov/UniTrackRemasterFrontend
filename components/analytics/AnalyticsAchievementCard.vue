<!-- components/analytics/AnalyticsAchievementCard.vue -->
<template>
  <div
    class="achievement-card p-4 rounded-lg border border-border bg-background-card hover:bg-background-hover transition-colors"
  >
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0">
        <div
          class="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center"
        >
          <Icon
            :name="achievement.icon || 'ph:trophy'"
            class="text-white text-lg"
          />
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <h4 class="text-sm font-semibold text-text-primary truncate">
            {{ achievement.title }}
          </h4>
          <n-tag size="small" :type="getCategoryTagType(achievement.category)">
            {{ achievement.category }}
          </n-tag>
        </div>

        <p class="text-xs text-text-secondary mb-2 line-clamp-2">
          {{ achievement.description }}
        </p>

        <div class="flex items-center justify-between">
          <span class="text-xs text-text-secondary">
            {{ formatDate(achievement.achievedDate) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsFormatters } from '~/composables/useAnalyticsPolling';

interface Props {
  achievement: {
    title: string;
    description: string;
    category: string;
    achievedDate: string;
    icon?: string;
  };
}

defineProps<Props>();

const { formatDate } = useAnalyticsFormatters();

const getCategoryTagType = (category: string) => {
  switch (category.toLowerCase()) {
    case 'academic':
      return 'info';
    case 'innovation':
      return 'success';
    case 'community':
      return 'warning';
    default:
      return 'default';
  }
};
</script>

<style scoped>
.achievement-card {
  @apply transition-all duration-200;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
