<template>
  <n-space vertical :size="12" class="min-h-screen md:px-6 px-2 py-4">


    <!-- Refined Quick Actions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
      
    </div>

    <ActivityListComponent />
  </n-space>
</template>

<script setup lang="ts">
import ActivityListComponent from '~/components/user/ActivityListComponent.vue';
definePageMeta({
  layout: 'dashboard-layout',
});

const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  isLinked: true,
};

const quickActions = [
  {
    title: 'Academic Tools',
    description:
      'Access grade calculators, attendance trackers, and study planners',
    icon: 'ph:graduation-cap',
    link: '/tools/academic',
    buttonText: 'Access Tools',
  },
  {
    title: 'Institution Manager',
    description: 'Manage your institutional connections and permissions',
    icon: 'ph:buildings',
    link: '/institutions',
    buttonText: 'Manage Institutions',
  },
  {
    title: 'Performance Analytics',
    description: 'View detailed insights about your academic performance',
    icon: 'ph:chart-line',
    link: '/analytics',
    buttonText: 'View Analytics',
  },
  {
    title: 'Calendar',
    description: 'Track important dates, assignments, and schedules',
    icon: 'ph:calendar',
    link: '/calendar',
    buttonText: 'Open Calendar',
  },
  {
    title: 'Document Center',
    description: 'Access and manage your academic documents',
    icon: 'ph:files',
    link: '/documents',
    buttonText: 'View Documents',
  },
  {
    title: 'Settings',
    description: 'Customize your profile and application preferences',
    icon: 'ph:gear',
    link: '/settings',
    buttonText: 'Open Settings',
  },
];

const navigateToInstitutions = () => {
  navigateTo('/institutions');
};
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
