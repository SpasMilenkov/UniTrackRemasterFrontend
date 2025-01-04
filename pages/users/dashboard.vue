<template>
  <n-space vertical :size="12" class="min-h-screen md:px-6 px-2 py-4">
    <UserBanner :user="user" />
    <!-- Refined Quick Actions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
      <UserQuickActionCard
        v-for="action in quickActions"
        :key="action.title"
        :action="action"
      />
    </div>

    <ActivityList :recent-activities="recentActivities" />
  </n-space>
</template>

<script setup lang="ts">
import ActivityList from '~/components/user/ActivityListComponent.vue';
import UserQuickActionCard from '~/components/user/UserQuickActionCard.vue';
import UserBanner from '~/components/user/UserBannerComponent.vue';
import type { UserQuickAction } from '~/interfaces/user/quick-action.props';
import type { User } from '~/interfaces/user/user';

definePageMeta({
  layout: 'dashboard-layout',
});

const recentActivities = [
  {
    id: 1,
    title: 'Profile linked with University of Example',
    description:
      'Successfully connected your profile with the university system.',
    timestamp: '2 hours ago',
    icon: 'ph:link-bold',
    type: 'emerald',
  },
  {
    id: 2,
    title: 'Updated academic records',
    description: 'New grades and attendance records have been synchronized.',
    timestamp: '1 day ago',
    icon: 'ph:notebook-bold',
    type: 'blue',
  },
  {
    id: 3,
    title: 'New document uploaded',
    description: 'Added "Final Project Submission" to your document center.',
    timestamp: '2 days ago',
    icon: 'ph:file-plus-bold',
    type: 'purple',
  },
  {
    id: 4,
    title: 'Calendar sync completed',
    description: 'Your academic calendar has been updated with latest events.',
    timestamp: '3 days ago',
    icon: 'ph:calendar-check-bold',
    type: 'indigo',
  },
];

const user: User = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  isLinked: true,
};

const quickActions: UserQuickAction[] = [
  {
    title: 'quickActions.academicTools.title',
    description: 'quickActions.academicTools.description',
    buttonText: 'quickActions.academicTools.buttonText',
    icon: 'ph:graduation-cap',
    link: '/tools/academic',
  },
  {
    title: 'quickActions.institutionManager.title',
    description: 'quickActions.institutionManager.description',
    buttonText: 'quickActions.institutionManager.buttonText',
    icon: 'ph:buildings',
    link: '/institutions',
  },
  {
    title: 'quickActions.performanceAnalytics.title',
    description: 'quickActions.performanceAnalytics.description',
    buttonText: 'quickActions.performanceAnalytics.buttonText',
    icon: 'ph:chart-line',
    link: '/analytics',
  },
  {
    title: 'quickActions.calendar.title',
    description: 'quickActions.calendar.description',
    buttonText: 'quickActions.calendar.buttonText',
    icon: 'ph:calendar',
    link: '/calendar',
  },
  {
    title: 'quickActions.documentCenter.title',
    description: 'quickActions.documentCenter.description',
    buttonText: 'quickActions.documentCenter.buttonText',
    icon: 'ph:files',
    link: '/documents',
  },
  {
    title: 'quickActions.settings.title',
    description: 'quickActions.settings.description',
    buttonText: 'quickActions.settings.buttonText',
    icon: 'ph:gear',
    link: '/settings',
  },
];
</script>

<style scoped>
.n-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.n-button {
  font-weight: 500;
}

.n-button:hover .icon {
  transform: translateX(4px);
}

.n-button {
  font-weight: 500;
}
</style>
