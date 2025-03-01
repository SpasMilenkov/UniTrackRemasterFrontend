<template>
  <div class="relative py-6 md:py-12 text-center lg:text-left">
    <!-- Background gradient blobs -->
    <div v-if="backgroundGradient" class="absolute inset-0 z-0">
      <div
        class="absolute top-0 left-1/4 w-64 h-64 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
        :style="{ backgroundColor: 'var(--color-primary)' }"
      />
      <div
        class="absolute bottom-0 right-1/4 w-64 h-64 rounded-full filter blur-3xl opacity-5 transform translate-x-1/2"
        :style="{ backgroundColor: 'var(--color-secondary)' }"
      />
    </div>
    <div class="relative z-10 mx-auto lg:px-8">
      <h1 :class="headingClass">{{ title }}</h1>
      <p v-if="subtitle" class="text-text-secondary mt-2 transition-colors">
        {{ subtitle }}
      </p>
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
  plainText: {
    type: Boolean,
    default: false,
  },
});

const headingClass = computed(() => {
  return [
    'font-bold transition-colors',
    // Use plain text or gradient based on prop
    props.plainText ? 'text-text-primary' : 'text-gradient',
    // Responsive sizing
    props.size === 'large'
      ? 'text-4xl md:text-5xl lg:text-6xl'
      : props.size === 'medium'
        ? 'text-3xl md:text-4xl lg:text-5xl'
        : 'text-2xl md:text-3xl',
  ];
});
</script>
