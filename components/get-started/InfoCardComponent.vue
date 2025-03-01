<template>
  <div
    :key="t(card.title)"
    class="bg-background-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-8 group hover:border-primary/50 transition-all duration-300"
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
        @click="navigateTo(localePath(card.buttonRoute))"
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
interface infoCard {
  icon: string;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonRoute: string;
}

const { t } = useI18n();
const localePath = useLocalePath();

defineProps<{
  card: infoCard;
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
