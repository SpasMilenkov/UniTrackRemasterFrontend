<template>
  <div class="relative py-6 md:py-12 text-center lg:text-left">
    <div v-if="backgroundGradient" class="absolute inset-0 z-0">
      <div
        class="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
      />
      <div
        class="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-5 transform translate-x-1/2"
      />
    </div>
    <div class="relative z-10 mx-auto lg:px-8">
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
  backgroundGradient: {
    type: Boolean,
    default: true,
  },
});

const headingClass = computed(() => {
  return [
    'font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text',
    props.size === 'large'
      ? 'text-4xl'
      : props.size === 'medium'
        ? 'text-3xl'
        : 'text-2xl',
  ];
});
</script>

<style scoped></style>
