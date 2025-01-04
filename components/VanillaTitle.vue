<template>
  <div class="relative py-4 text-center lg:text-left">
    <div class="relative">
      <h1 :class="headingClass">{{ title }}</h1>
      <p v-if="subtitle" class="text-gray-400 mt-2">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  size: {
    type: String as () => 'large' | 'medium' | 'small',
    default: 'large',
  },
});

const headingClass = computed(() => {
  return [
    'font-bold text-gray-100',
    props.size === 'large'
      ? 'text-4xl'
      : props.size === 'medium'
        ? 'text-3xl'
        : 'text-2xl',
  ];
});
</script>
