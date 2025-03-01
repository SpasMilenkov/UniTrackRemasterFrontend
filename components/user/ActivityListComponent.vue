<template>
  <div class="relative bg-background-secondary rounded-xl overflow-hidden mt-8">
    <!-- Gradient background effects -->
    <div class="absolute inset-0">
      <div
        class="absolute -left-20 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
      />
      <div
        class="absolute -right-20 bottom-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"
      />
    </div>
    <div class="relative p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-semibold text-gradient">
          {{ t('activityList.title') }}
        </h2>
        <n-button
          v-if="recentActivities.length > 0"
          text
          type="primary"
          class="text-base font-medium transition-colors duration-300"
        >
          {{ t('activityList.actionButton') }}
          <template #icon>
            <Icon
              name="ph:arrow-right-bold"
              class="ml-1 group-hover:translate-x-1 transition-transform duration-300"
            />
          </template>
        </n-button>
      </div>

      <!-- Empty State -->
      <div
        v-if="!recentActivities.length"
        class="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <div class="relative">
          <Icon
            name="ph:clock"
            class="text-6xl text-text-muted mb-4 animate-pulse"
          />
        </div>
        <h3 class="text-xl font-medium text-text-secondary mb-2">
          {{ t('activityList.emptyState.title') }}
        </h3>
        <p class="text-text-muted max-w-sm">
          {{ t('activityList.emptyState.description') }}
        </p>
      </div>

      <!-- Activity List -->
      <div v-else class="space-y-6">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="group relative bg-background rounded-xl p-6 hover:bg-background-card transition-all duration-300"
        >
          <!-- Subtle highlight on hover -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
          />
          <div class="relative flex items-center gap-6">
            <!-- Activity Icon Container -->
            <div class="p-4 rounded-xl transition-all duration-300 bg-primary/10 group-hover:bg-primary/20">
              <Icon
                :name="activity.icon"
                class="text-2xl transition-all duration-300 text-primary"
              />
            </div>
            <!-- Content -->
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <p
                  class="text-lg font-medium text-text-primary group-hover:text-primary transition-colors duration-300"
                >
                  {{ activity.title }}
                </p>
                <span class="text-text-secondary text-sm">{{
                  activity.timestamp
                }}</span>
              </div>
              <p class="text-text-secondary">{{ activity.description }}</p>
            </div>
            <!-- Optional action button or indicator -->
            <div class="shrink-0">
              <Icon
                name="ph:arrow-right"
                class="text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserActivity } from '~/interfaces/user/recent-activity.props';

const { t } = useI18n();

defineProps<{
  recentActivities: UserActivity[];
}>();
</script>

<style scoped>
.n-button {
  font-weight: 500;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>