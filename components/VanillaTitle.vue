<template>
  <div class="relative py-4 text-center lg:text-left">
    <div class="relative">
      <h1 :class="headingClass">{{ title }}</h1>
      <p v-if="subtitle" class="text-text-secondary mt-2">{{ subtitle }}</p>
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
  gradient: {
    type: Boolean,
    default: false,
  },
});

const headingClass = computed(() => {
  return [
    'font-bold text-text-primary transition-colors',
    props.gradient ? 'text-gradient' : '',
    props.size === 'large'
      ? 'text-4xl md:text-5xl'
      : props.size === 'medium'
        ? 'text-3xl md:text-4xl'
        : 'text-2xl md:text-3xl',
  ];
});
</script>
