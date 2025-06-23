<template>
  <div class="relative inline-block">
    <!-- Slot for the content (usually a button or nav item) -->
    <slot />

    <!-- Badge indicator -->
    <Transition name="badge" mode="out-in">
      <div v-if="showBadge" :class="badgeClasses">
        <span v-if="showCount" class="text-xs font-medium">
          {{ displayCount }}
        </span>
        <div v-else class="w-1.5 h-1.5 rounded-full bg-current" />
      </div>
    </Transition>

    <!-- Pulse animation for new notifications -->
    <div
      v-if="showPulse && showBadge"
      class="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping"
      :style="{ backgroundColor: pulseColor }"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number;
  showCount?: boolean;
  maxCount?: number;
  showPulse?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
  size?: 'small' | 'medium' | 'large';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  showCount: true,
  maxCount: 99,
  showPulse: false,
  color: 'primary',
  size: 'medium',
  position: 'top-right',
});

// Computed properties
const showBadge = computed(() => props.count > 0);

const displayCount = computed(() => {
  if (props.count > props.maxCount) {
    return `${props.maxCount}+`;
  }
  return props.count.toString();
});

const badgeClasses = computed(() => {
  const baseClasses = [
    'absolute rounded-full flex items-center justify-center',
    'transform transition-all duration-200 ease-in-out',
    'shadow-md border border-background',
  ];

  // Size classes
  const sizeClasses = {
    small: props.showCount ? 'min-w-[16px] h-4 px-1' : 'w-3 h-3',
    medium: props.showCount ? 'min-w-[20px] h-5 px-1.5' : 'w-4 h-4',
    large: props.showCount ? 'min-w-[24px] h-6 px-2' : 'w-5 h-5',
  };

  // Position classes
  const positionClasses = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1',
  };

  // Color classes based on theme
  const colorClasses = {
    primary: 'bg-primary text-background',
    secondary: 'bg-secondary text-background',
    error: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-background',
    success: 'bg-green-500 text-background',
  };

  return [
    ...baseClasses,
    sizeClasses[props.size],
    positionClasses[props.position],
    colorClasses[props.color],
  ];
});

const pulseColor = computed(() => {
  const colors = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
  };
  return colors[props.color];
});
</script>

<style scoped>
.badge-enter-active,
.badge-leave-active {
  transition: all 0.3s ease;
}

.badge-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.badge-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.badge-enter-to,
.badge-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
