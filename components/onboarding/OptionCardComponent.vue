<template>
  <div
    v-motion
    class="bg-background-card backdrop-blur-sm rounded-xl p-8 group shadow-[0_0_0_1px_rgba(var(--color-primary-rgb,74,222,128),0.1),0_8px_28px_rgba(var(--color-primary-rgb,74,222,128),0.15)] hover:shadow-[0_0_0_1px_rgba(var(--color-primary-rgb,74,222,128),0.2),0_12px_36px_rgba(var(--color-primary-rgb,74,222,128),0.25)] transition-all duration-300"
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0 }"
    :delay="300"
  >
    <div class="flex flex-col h-full">
      <!-- Icon -->
      <div class="mb-6">
        <div
          class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300"
        >
          <Icon :name="card.icon" class="text-primary text-3xl" />
        </div>
      </div>
      <!-- Title -->
      <h2 class="text-2xl font-bold mb-4 text-gradient">
        {{ t(card.title) }}
      </h2>
      <!-- Description -->
      <p class="text-text-secondary mb-6 flex-grow">
        {{ t(card.description) }}
      </p>
      <!-- Features List -->
      <ul class="space-y-3 mb-8">
        <li
          v-for="feature in card.features"
          :key="t(feature)"
          class="flex items-center text-text-primary"
        >
          <Icon name="ph:check-circle-fill" class="text-primary mr-2" />
          {{ t(feature) }}
        </li>
      </ul>
      <!-- Button -->
      <n-button
        type="primary"
        class="text-lg w-full"
        @click="card.buttonAction"
      >
        {{ t(card.buttonText) }}
        <template #icon>
          <Icon name="ph:arrow-right-bold" />
        </template>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
defineProps<{
  card: {
    icon: string;
    title: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonAction: () => void;
  };
}>();
</script>

<style scoped>
.text-gradient {
  background-image: linear-gradient(
    to right,
    var(--color-primary, #4ade80),
    var(--color-secondary, #3b82f6)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}
</style>