<template>
  <div
    :key="t(card.title)"
    class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 group hover:border-emerald-400/50 transition-all duration-300"
  >
    <div class="flex flex-col h-full">
      <!-- Icon -->
      <div class="mb-6">
        <div
          class="w-16 h-16 bg-emerald-400/10 rounded-full flex items-center justify-center group-hover:bg-emerald-400/20 transition-all duration-300"
        >
          <Icon :name="card.icon" class="text-emerald-400 text-3xl" />
        </div>
      </div>

      <!-- Title -->
      <h2
        class="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
      >
        {{ t(card.title) }}
      </h2>

      <!-- Description -->
      <p class="text-gray-400 mb-6 flex-grow">
        {{ t(card.description) }}
      </p>

      <!-- Features List -->
      <ul class="space-y-3 mb-8">
        <li
          v-for="feature in card.features"
          :key="t(feature)"
          class="flex items-center text-gray-300"
        >
          <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
          {{ t(feature) }}
        </li>
      </ul>

      <!-- Button -->
      <n-button
        type="primary"
        color="#4ade80"
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
<style scoped></style>
