<!-- components/analytics/AnalyticsRecommendationCard.vue -->
<template>
  <div
    class="recommendation-card p-4 rounded-lg border-2 transition-all duration-200"
    :class="borderClass"
  >
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="iconBgClass"
        >
          <Icon name="ph:lightbulb" class="text-white text-lg" />
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-semibold text-text-primary">
            {{ recommendation.title }}
          </h4>
          <n-tag
            size="small"
            :type="getPriorityTagType(recommendation.priority)"
          >
            {{ recommendation.priority }}
          </n-tag>
        </div>

        <p class="text-xs text-text-secondary mb-3 line-clamp-2">
          {{ recommendation.description }}
        </p>

        <div v-if="recommendation.actionItems.length > 0" class="mb-3">
          <p class="text-xs font-medium text-text-primary mb-1">
            Action Items:
          </p>
          <ul class="space-y-1">
            <li
              v-for="(item, index) in recommendation.actionItems.slice(0, 2)"
              :key="index"
              class="text-xs text-text-secondary flex items-start"
            >
              <Icon name="ph:circle" class="w-2 h-2 mt-1 mr-2 flex-shrink-0" />
              {{ item }}
            </li>
          </ul>
          <button
            v-if="recommendation.actionItems.length > 2"
            class="text-xs text-primary hover:underline mt-1"
            @click="showAllActions = !showAllActions"
          >
            {{
              showAllActions
                ? 'Show less'
                : `+${recommendation.actionItems.length - 2} more`
            }}
          </button>
        </div>

        <div v-if="recommendation.expectedOutcome" class="mb-3">
          <p class="text-xs font-medium text-text-primary mb-1">
            Expected Outcome:
          </p>
          <p class="text-xs text-success">
            {{ recommendation.expectedOutcome }}
          </p>
        </div>

        <div class="flex items-center justify-between">
          <n-tag size="small" type="info">
            {{ recommendation.category }}
          </n-tag>

          <n-button
            size="tiny"
            quaternary
            type="primary"
            @click="handleActionTaken"
          >
            Mark as Actioned
          </n-button>
        </div>
      </div>
    </div>

    <!-- Expanded Action Items -->
    <div
      v-if="showAllActions && recommendation.actionItems.length > 2"
      class="mt-3 pl-13"
    >
      <ul class="space-y-1">
        <li
          v-for="(item, index) in recommendation.actionItems.slice(2)"
          :key="index + 2"
          class="text-xs text-text-secondary flex items-start"
        >
          <Icon name="ph:circle" class="w-2 h-2 mt-1 mr-2 flex-shrink-0" />
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NTag, NButton } from 'naive-ui';
import { Icon } from '#components';

interface Props {
  recommendation: {
    title: string;
    description: string;
    category: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    actionItems: string[];
    expectedOutcome?: string;
  };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  actionTaken: [recommendation: Props['recommendation']];
}>();

const showAllActions = ref(false);

const borderClass = computed(() => {
  switch (props.recommendation.priority) {
    case 'Critical':
      return 'border-red-500 bg-red-50 dark:bg-red-950/20';
    case 'High':
      return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20';
    case 'Medium':
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
    default:
      return 'border-border bg-background-card';
  }
});

const iconBgClass = computed(() => {
  switch (props.recommendation.priority) {
    case 'Critical':
      return 'bg-gradient-to-br from-red-500 to-red-600';
    case 'High':
      return 'bg-gradient-to-br from-orange-500 to-orange-600';
    case 'Medium':
      return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
    default:
      return 'bg-gradient-to-br from-blue-500 to-blue-600';
  }
});

const getPriorityTagType = (priority: string) => {
  switch (priority) {
    case 'Critical':
      return 'error';
    case 'High':
      return 'warning';
    case 'Medium':
      return 'info';
    default:
      return 'default';
  }
};

const handleActionTaken = () => {
  emit('actionTaken', props.recommendation);
};
</script>

<style scoped>
.recommendation-card {
  @apply transition-all duration-200;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>