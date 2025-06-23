<!-- components/common/AcademicHierarchy.vue -->
<template>
  <div class="bg-background-card rounded-xl shadow-sm border border-border p-6">
    <h3
      class="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2"
    >
      <Icon :name="titleIcon" class="text-primary" />
      {{ title }}
    </h3>

    <div class="relative">
      <div
        v-for="(level, index) in hierarchy"
        :key="level.id || index"
        class="flex items-start mb-6 last:mb-0"
      >
        <!-- Tree structure lines -->
        <div class="relative flex flex-col items-center mr-4">
          <div
            :class="[
              'w-10 h-10 rounded-full border-3 flex items-center text-text-primary justify-center text-sm font-bold transition-all duration-200',
              getNodeClasses(level),
            ]"
          >
            {{ index + 1 }}
          </div>

          <!-- Connecting line -->
          <div
            v-if="index < hierarchy.length - 1"
            :class="[
              'w-0.5 h-12 mt-2 transition-colors duration-200',
              level.isCompleted ? 'bg-success/40' : 'bg-border',
            ]"
          />
        </div>

        <!-- Content Card -->
        <div
          :class="[
            'flex-1 p-4 rounded-lg border transition-all duration-200 hover-elevate',
            getCardClasses(level),
          ]"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-semibold text-text-primary">
                  {{ level.title }}
                </h4>
                <Icon
                  v-if="level.icon"
                  :name="level.icon"
                  class="text-text-secondary"
                />
              </div>
              <p class="text-sm text-text-secondary mb-2">
                {{ level.description }}
              </p>

              <!-- Status indicator -->
              <div
                v-if="level.count !== undefined"
                class="flex items-center gap-2"
              >
                <span class="text-xs text-text-secondary">Status:</span>
                <n-tag
                  :type="level.count > 0 ? 'success' : 'warning'"
                  size="small"
                  :bordered="false"
                >
                  {{ formatStatusText(level) }}
                </n-tag>
              </div>

              <!-- Custom status content -->
              <div v-if="level.customStatus" class="mt-2">
                <component
                  :is="level.customStatus.component"
                  v-bind="level.customStatus.props"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui';
import { Icon } from '#components';

// TypeScript interfaces
export interface HierarchyLevel {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  isCompleted: boolean;
  isActive: boolean;
  count?: number;
  actionRequired: boolean;
  actionText?: string;
  sectionKey?: string;
  navigateTo?: string;
  customStatus?: {
    component: any;
    props?: Record<string, any>;
  };
  metadata?: Record<string, any>;
}

export interface GlobalAction {
  text: string;
  icon?: string;
  type?: 'primary' | 'default' | 'success' | 'warning' | 'error' | 'info';
  disabled?: boolean;
  sectionKey?: string;
  action?: () => void;
}

// Props
interface Props {
  hierarchy: HierarchyLevel[];
  title?: string;
  titleIcon?: string;
  globalAction?: GlobalAction;
  useTabNavigation?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: 'Prerequisites',
  titleIcon: 'ph:tree-structure',
  useTabNavigation: false,
});

// Emits
defineEmits<{
  levelClick: [level: HierarchyLevel];
  actionClick: [level: HierarchyLevel];
  globalAction: [];
}>();

// Computed classes for styling
const getNodeClasses = (level: HierarchyLevel) => {
  if (level.isCompleted) {
    return 'bg-success border-success text-white shadow-sm';
  } else if (level.isActive) {
    return 'bg-primary border-primary text-white shadow-md';
  } else {
    return 'bg-background-card border-border text-text-secondary';
  }
};

const getCardClasses = (level: HierarchyLevel) => {
  const baseClasses = 'hover:shadow-md';

  if (level.isCompleted) {
    return `${baseClasses} bg-background-card border-success/20 shadow-sm`;
  } else if (level.actionRequired) {
    return `${baseClasses} bg-background-card border-primary/20 shadow-sm`;
  } else {
    return `${baseClasses} bg-background-card border-border hover:border-primary/20`;
  }
};

// Helper function to format status text
const formatStatusText = (level: HierarchyLevel): string => {
  if (level.count === undefined) return 'Unknown';

  if (level.count > 0) {
    return `${level.count} item${level.count === 1 ? '' : 's'}`;
  } else {
    return 'Needs setup';
  }
};
</script>

<style scoped>
.hover-elevate {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-elevate:hover {
  transform: translateY(-1px);
}

/* Custom border width for better visual hierarchy */
.border-3 {
  border-width: 3px;
}
</style>
