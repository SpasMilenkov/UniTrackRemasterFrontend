<template>
  <div class="min-h-screen bg-background text-text-primary relative">
    <!-- Full-page background decorations -->
    <div class="fixed inset-0 z-0">
      <div
        class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
      />
      <div
        class="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-secondary rounded-full filter blur-3xl opacity-5 transform translate-x-1/2"
      />
      <div
        class="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-primary rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
      />
    </div>

    <!-- Content wrapper -->
    <div class="relative z-10">
      <!-- Header Section -->
      <div class="py-16">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gradient mb-6">
              {{ t('getStartedPage.title') }}
            </h1>
            <p class="text-text-secondary max-w-2xl mx-auto">
              {{ t('getStartedPage.description') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Cards Section -->
      <div class="py-12">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="grid md:grid-cols-2 gap-8">
            <InfoCard v-for="card in cards" :key="t(card.title)" :card="card" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoCard from '~/components/get-started/InfoCardComponent.vue';

// Localization
const { t } = useI18n();

const cards = [
  {
    icon: 'ph:student-bold',
    title: 'getStartedPage.cards.joinCard.title',
    description: 'getStartedPage.cards.joinCard.description',
    features: [
      'getStartedPage.cards.joinCard.features.records',
      'getStartedPage.cards.joinCard.features.progress',
      'getStartedPage.cards.joinCard.features.communication',
    ],
    buttonText: 'getStartedPage.cards.joinCard.buttonText',
    buttonRoute: '/login',
  },
  {
    icon: 'ph:buildings-bold',
    title: 'getStartedPage.cards.integrationCard.title',
    description: 'getStartedPage.cards.integrationCard.description',
    features: [
      'getStartedPage.cards.integrationCard.features.streamline',
      'getStartedPage.cards.integrationCard.features.dataManagement',
      'getStartedPage.cards.integrationCard.features.support',
    ],
    buttonText: 'getStartedPage.cards.integrationCard.buttonText',
    buttonRoute: '/onboarding/options',
  },
];
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
