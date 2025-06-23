<template>
  <NBadge
    :type="badgeType"
    :size="size"
    :processing="status === ProfileStatus.Pending"
    :class="badgeClasses"
  >
    <template #icon>
      <Icon :name="statusIcon" :class="iconClasses" />
    </template>
    {{ statusLabel }}
  </NBadge>
</template>

<script setup lang="ts">
import { NBadge } from 'naive-ui';
import { ProfileStatus } from '~/interfaces/invitation';

interface Props {
  status: ProfileStatus;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  variant?: 'default' | 'subtle' | 'outline';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  showIcon: true,
  variant: 'default',
});

// Status configurations
const statusConfig = {
  [ProfileStatus.Pending]: {
    label: 'Pending',
    type: 'warning' as const,
    icon: 'mdi:clock-outline',
    color: 'text-amber-600',
  },
  [ProfileStatus.Active]: {
    label: 'Active',
    type: 'success' as const,
    icon: 'mdi:check-circle',
    color: 'text-green-600',
  },
  [ProfileStatus.Rejected]: {
    label: 'Rejected',
    type: 'error' as const,
    icon: 'mdi:close-circle',
    color: 'text-red-600',
  },
  [ProfileStatus.Inactive]: {
    label: 'Inactive',
    type: 'default' as const,
    icon: 'mdi:pause-circle',
    color: 'text-gray-500',
  },
  [ProfileStatus.Suspended]: {
    label: 'Suspended',
    type: 'error' as const,
    icon: 'mdi:alert-circle',
    color: 'text-red-700',
  },
};

// Computed properties
const config = computed(
  () => statusConfig[props.status] || statusConfig[ProfileStatus.Inactive]
);

const statusLabel = computed(() => config.value.label);
const badgeType = computed(() => config.value.type);
const statusIcon = computed(() => config.value.icon);

const badgeClasses = computed(() => {
  const baseClasses = ['inline-flex items-center gap-1'];

  if (props.variant === 'subtle') {
    baseClasses.push('bg-opacity-10');
  } else if (props.variant === 'outline') {
    baseClasses.push('border', 'bg-transparent');
  }

  return baseClasses;
});

const iconClasses = computed(() => {
  const classes = ['w-4 h-4'];

  if (props.variant === 'outline' || props.variant === 'subtle') {
    classes.push(config.value.color);
  }

  return classes;
});
</script>

<style scoped>
/* Additional custom styling if needed */
</style>
