<template>
  <div class="min-h-screen bg-background text-text-primary scroll-smooth">
    <!-- Enhanced Hero Section (adjusted for navbar) -->
    <div class="relative h-[calc(100vh-4rem)] overflow-hidden">
      <!-- Video Background with Fallback -->
      <div class="absolute inset-0 z-0">
        <video
          class="absolute w-full h-full object-cover opacity-15"
          autoplay
          loop
          muted
          playsinline
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <!-- <source src="/videos/hero.webm" type="video/webm" /> -->
        </video>
      </div>

      <!-- Hero Content -->
      <div
        v-motion
        class="relative z-10 h-full flex items-center justify-center"
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="200"
      >
        <div class="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1
            v-motion
            class="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-primary mb-6"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="400"
          >
            {{ t('indexPage.title') }}
          </h1>
          <p
            v-motion
            class="text-xl md:text-2xl text-text-secondary mb-8"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="600"
          >
            {{ t('indexPage.subtitle') }}
          </p>
          <n-button
            v-motion
            type="primary"
            class="text-lg transform hover:scale-105 transition-all duration-300"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="800"
            @click="navigateTo(localePath('/get-started'))"
          >
            {{ t('indexPage.getStarted') }}
            <template #icon>
              <Icon name="ph:arrow-right-bold" />
            </template>
          </n-button>
        </div>
      </div>

      <!-- Animated Scroll Indicator -->
      <div
        v-motion
        class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1 }"
        :delay="1200"
      >
        <Icon
          name="ph:arrow-down-bold"
          class="text-4xl text-primary cursor-pointer"
          @click="scrollToFeatures"
        />
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="py-24 bg-background relative overflow-hidden">
      <!-- Enhanced Floating Particles -->
      <div v-if="isClient" class="absolute inset-0 overflow-hidden">
        <div
          v-for="n in 50"
          :key="n"
          class="absolute w-1 h-1 bg-primary opacity-20 rounded-full animate-float"
          :style="getParticleStyle()"
        />
      </div>
      <div class="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <!-- Section Title -->
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4 bg-gradient-primary">
            {{ t('indexPage.featuresTitle') }}
          </h2>
          <p class="text-text-secondary text-lg max-w-2xl mx-auto">
            {{ t('indexPage.featuresSubtitle') }}
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <n-card
            v-for="(feature, index) in features"
            :key="t(feature.title)"
            v-motion
            class="feature-card backdrop-blur-sm relative overflow-hidden"
            :bordered="false"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="index * 200"
          >
            <!-- Card content remains the same -->
            <div class="flex flex-col items-center text-center">
              <!-- Icon Container -->
              <div class="relative mb-8">
                <div
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"
                />
                <div
                  class="relative w-16 h-16 bg-background-card rounded-full flex items-center justify-center"
                >
                  <Icon :name="feature.icon" class="text-primary w-7 h-7" />
                </div>
              </div>

              <!-- Rest of the card content -->
              <h3 class="text-2xl font-semibold text-text-primary mb-4">
                {{ t(feature.title) }}
              </h3>
              <p class="text-text-secondary text-lg mb-8">
                {{ t(feature.description) }}
              </p>
              <div class="space-y-4 w-full text-left">
                <div
                  v-for="(subFeature, subIndex) in feature.subFeatures"
                  :key="subFeature"
                  v-motion
                  class="flex items-center gap-3 text-text-secondary"
                  :initial="{ opacity: 0, x: -20 }"
                  :enter="{ opacity: 1, x: 0 }"
                  :delay="index * 100 + subIndex * 100"
                >
                  <Icon
                    name="ph:check-circle-fill"
                    class="text-primary flex-shrink-0"
                    size="22"
                  />
                  <span class="text-base">{{ t(subFeature) }}</span>
                </div>
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </div>
    <div class="py-24 bg-background relative overflow-hidden">
      <!-- Continued Floating Particles -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          v-for="n in 50"
          :key="n"
          class="absolute w-1 h-1 bg-primary opacity-20 rounded-full animate-float"
          :style="{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            '--tx': Math.random() * 200 - 100 + 'px',
            '--ty': Math.random() * 200 - 100 + 'px',
            '--scale': 0.5 + Math.random() * 1,
            animationDelay: Math.random() * 10 + 's',
            animationDuration: 10 + Math.random() * 20 + 's',
          }"
        />
      </div>

      <div class="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <!-- Section Title -->
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4 bg-gradient-primary">
            {{ t('indexPage.contacts.title') }}
          </h2>
          <p class="text-text-secondary text-lg max-w-2xl mx-auto">
            {{ t('indexPage.contacts.subtitle') }}
          </p>
        </div>

        <!-- Contact Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <n-card
            v-for="(card, index) in cards"
            :key="index"
            v-motion
            class="feature-card backdrop-blur-sm relative overflow-hidden"
            :bordered="false"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="index * 200"
          >
            <div class="flex flex-col items-center text-center h-full">
              <!-- Icon Container -->
              <div class="relative mb-8">
                <div
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"
                />
                <div
                  class="relative w-16 h-16 bg-background-card rounded-full flex items-center justify-center"
                >
                  <Icon :name="card.icon" class="text-primary w-7 h-7" />
                </div>
              </div>

              <!-- Content -->
              <h3 class="text-2xl font-semibold text-text-primary mb-4">
                {{ t(card.title) }}
              </h3>
              <p class="text-text-secondary text-lg mb-8 flex-grow">
                {{ t(card.description) }}
              </p>

              <!-- Button -->
              <n-button
                type="primary"
                class="w-full text-base transform hover:scale-105 transition-all duration-300"
                @click="navigateTo(card.link)"
              >
                {{ t(card.buttonText) }}
                <template #icon>
                  <Icon name="ph:arrow-right-bold" />
                </template>
              </n-button>
            </div>
          </n-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

// Smooth scroll to features
const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
};

const isClient = ref(false);

// Function to generate particle styles
// prevents hydration issues!!!
const getParticleStyle = () => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    '--tx': `${Math.random() * 200 - 100}px`,
    '--ty': `${Math.random() * 200 - 100}px`,
    '--scale': 0.5 + Math.random() * 1,
    'animation-delay': `${Math.random() * 10}s`,
    'animation-duration': `${10 + Math.random() * 20}s`,
  };
};

onMounted(() => {
  isClient.value = true;
});

// Features data
const features = [
  {
    title: 'indexPage.features[0].title',
    description: 'indexPage.features[0].description',
    badge: 'indexPage.features[0].badge',
    icon: 'ph:medal-bold',
    subFeatures: [
      'indexPage.features[0].subFeatures[0]',
      'indexPage.features[0].subFeatures[1]',
      'indexPage.features[0].subFeatures[2]',
      'indexPage.features[0].subFeatures[3]',
    ],
  },
  {
    title: 'indexPage.features[1].title',
    description: 'indexPage.features[1].description',
    icon: 'ph:calendar-bold',
    subFeatures: [
      'indexPage.features[1].subFeatures[0]',
      'indexPage.features[1].subFeatures[1]',
      'indexPage.features[1].subFeatures[2]',
      'indexPage.features[1].subFeatures[3]',
    ],
  },
  {
    title: 'indexPage.features[2].title',
    description: 'indexPage.features[2].description',
    badge: 'indexPage.features[2].badge',
    icon: 'ph:chart-line-up-bold',
    subFeatures: [
      'indexPage.features[2].subFeatures[0]',
      'indexPage.features[2].subFeatures[1]',
      'indexPage.features[2].subFeatures[2]',
      'indexPage.features[2].subFeatures[3]',
    ],
  },
  {
    title: 'indexPage.features[3].title',
    description: 'indexPage.features[3].description',
    icon: 'ph:buildings-bold',
    subFeatures: [
      'indexPage.features[3].subFeatures[0]',
      'indexPage.features[3].subFeatures[1]',
      'indexPage.features[3].subFeatures[2]',
      'indexPage.features[3].subFeatures[3]',
    ],
  },
];

const cards = [
  {
    icon: 'ph:headset-bold',
    title: 'indexPage.contacts.cards[0].title',
    description: 'indexPage.contacts.cards[0].description',
    buttonText: 'indexPage.contacts.cards[0].buttonText',
    link: localePath('/support'),
  },
  {
    icon: 'ph:currency-circle-dollar-bold',
    title: 'indexPage.contacts.cards[1].title',
    description: 'indexPage.contacts.cards[1].description',
    buttonText: 'indexPage.contacts.cards[1].buttonText',
    link: localePath('/sales'),
  },
  {
    icon: 'ph:handshake-bold',
    title: 'indexPage.contacts.cards[2].title',
    description: 'indexPage.contacts.cards[2].description',
    buttonText: 'indexPage.contacts.cards[2].buttonText',
    link: localePath('/partnerships'),
  },
];
</script>

<style scoped>
.feature-card {
  border-radius: 12px;
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.15);
}

.bg-gradient-primary {
  background-image: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
}

:deep(.n-card) {
  background-color: var(--color-background-card, #18181c) !important;
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.15);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

:deep(.n-card:hover) {
  transform: translateY(-4px);
  border-color: rgba(var(--color-primary-rgb), 0.3);
  box-shadow:
    0 0 30px rgba(var(--color-primary-rgb), 0.1),
    0 0 2px rgba(var(--color-primary-rgb), 0.3);
}

:deep(.n-card-header) {
  padding: 1.5rem !important;
}

:deep(.n-card__content) {
  padding: 1.5rem 2rem 2rem !important;
}

:deep(.n-card__content-inner) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-card:hover::before {
  opacity: 1;
}

@keyframes float {
  0% {
    transform: translate(0, 0) scale(var(--scale));
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(var(--scale));
    opacity: 0;
  }
}

.animate-float {
  animation: float var(--duration, 15s) ease-in-out infinite alternate;
}
</style>
