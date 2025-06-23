<!-- components/analytics/RecommendationsSideBySide.vue -->
<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Institution 1 Recommendations -->
    <div>
      <div class="flex items-center space-x-2 mb-4">
        <h4 class="text-sm font-medium text-text-primary">
          {{ institution1.name }}
        </h4>
        <n-badge :value="institution1Recommendations.length" type="info" />
      </div>

      <div class="space-y-3 max-h-96 overflow-y-auto">
        <div
          v-for="recommendation in institution1Recommendations"
          :key="recommendation.title"
          class="border border-border rounded-lg p-4"
        >
          <div class="flex items-start justify-between mb-2">
            <h5 class="text-sm font-medium text-text-primary">
              {{ recommendation.title }}
            </h5>
            <n-tag
              :type="getPriorityType(recommendation.priority)"
              size="small"
            >
              {{ recommendation.priority }}
            </n-tag>
          </div>

          <p class="text-xs text-text-secondary mb-3">
            {{ recommendation.description }}
          </p>

          <div class="space-y-1">
            <div class="text-xs font-medium text-text-primary">
              Action Items:
            </div>
            <ul class="text-xs text-text-secondary space-y-1">
              <li
                v-for="item in recommendation.actionItems.slice(0, 2)"
                :key="item"
                class="flex items-start space-x-2"
              >
                <Icon
                  name="ph:check-circle"
                  class="text-success mt-0.5 flex-shrink-0"
                />
                <span>{{ item }}</span>
              </li>
            </ul>
            <div
              v-if="recommendation.actionItems.length > 2"
              class="text-xs text-text-tertiary"
            >
              +{{ recommendation.actionItems.length - 2 }} more items
            </div>
          </div>
        </div>

        <div
          v-if="institution1Recommendations.length === 0"
          class="text-center py-8"
        >
          <Icon name="ph:lightbulb" class="text-2xl text-text-secondary mb-2" />
          <p class="text-sm text-text-secondary">
            No recommendations available
          </p>
        </div>
      </div>
    </div>

    <!-- Institution 2 Recommendations -->
    <div>
      <div class="flex items-center space-x-2 mb-4">
        <h4 class="text-sm font-medium text-text-primary">
          {{ institution2.name }}
        </h4>
        <n-badge :value="institution2Recommendations.length" type="info" />
      </div>

      <div class="space-y-3 max-h-96 overflow-y-auto">
        <div
          v-for="recommendation in institution2Recommendations"
          :key="recommendation.title"
          class="border border-border rounded-lg p-4"
        >
          <div class="flex items-start justify-between mb-2">
            <h5 class="text-sm font-medium text-text-primary">
              {{ recommendation.title }}
            </h5>
            <n-tag
              :type="getPriorityType(recommendation.priority)"
              size="small"
            >
              {{ recommendation.priority }}
            </n-tag>
          </div>

          <p class="text-xs text-text-secondary mb-3">
            {{ recommendation.description }}
          </p>

          <div class="space-y-1">
            <div class="text-xs font-medium text-text-primary">
              Action Items:
            </div>
            <ul class="text-xs text-text-secondary space-y-1">
              <li
                v-for="item in recommendation.actionItems.slice(0, 2)"
                :key="item"
                class="flex items-start space-x-2"
              >
                <Icon
                  name="ph:check-circle"
                  class="text-success mt-0.5 flex-shrink-0"
                />
                <span>{{ item }}</span>
              </li>
            </ul>
            <div
              v-if="recommendation.actionItems.length > 2"
              class="text-xs text-text-tertiary"
            >
              +{{ recommendation.actionItems.length - 2 }} more items
            </div>
          </div>
        </div>

        <div
          v-if="institution2Recommendations.length === 0"
          class="text-center py-8"
        >
          <Icon name="ph:lightbulb" class="text-2xl text-text-secondary mb-2" />
          <p class="text-sm text-text-secondary">
            No recommendations available
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NTag, NBadge } from 'naive-ui';
import { Icon } from '#components';
import type {
  RecommendationDto,
  InstitutionSummaryDto,
} from '~/stores/analytics';

interface Props {
  institution1Recommendations: RecommendationDto[];
  institution2Recommendations: RecommendationDto[];
  institution1: InstitutionSummaryDto;
  institution2: InstitutionSummaryDto;
}

defineProps<Props>();

const getPriorityType = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};
</script>
