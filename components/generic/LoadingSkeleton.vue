<!-- components/ui/LoadingSkeleton.vue -->
<template>
  <div 
    class="skeleton-base"
    :class="[
      shapeClass,
      sizeClass,
      { 'animate-pulse': animated }
    ]"
    :style="customStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  width?: string | number;
  height?: string | number;
  shape?: 'rectangle' | 'circle' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  shape: 'rectangle',
  size: 'md',
  animated: true,
});

const shapeClass = computed(() => {
  switch (props.shape) {
    case 'circle':
      return 'rounded-full';
    case 'text':
      return 'rounded-md';
    default:
      return 'rounded-lg';
  }
});

const sizeClass = computed(() => {
  if (props.width || props.height) return '';
  
  switch (props.size) {
    case 'sm':
      return 'w-16 h-4';
    case 'lg':
      return 'w-32 h-8';
    case 'xl':
      return 'w-48 h-12';
    default:
      return 'w-24 h-6';
  }
});

const customStyle = computed(() => {
  const style: Record<string, string> = {};
  
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  }
  
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  }
  
  return style;
});
</script>

<style scoped>
.skeleton-base {
  @apply bg-gray-200 dark:bg-gray-700;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>







