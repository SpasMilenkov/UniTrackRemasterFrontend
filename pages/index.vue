<template>
  <div class="min-h-screen bg-[#101014] text-white scroll-smooth">
    <!-- Hero Section -->
    <div class="relative overflow-hidden py-24">
      <div class="absolute inset-0 z-0">
        <img
          src="/img/seaweed.svg"
          alt="UniTrack Logo Background"
          class="w-full h-full object-cover opacity-10 mix-blend-darken"
        />
      </div>
      <div class="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div class="mx-auto max-w-2xl text-center">
          <h1
            class="text-6xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text mb-6"
          >
            {{ t('indexPage.title') }}
          </h1>
          <p class="text-xl text-gray-300 mb-8">
            {{ t('indexPage.subtitle') }}
          </p>
          <n-button
            type="primary"
            class="text-lg"
            color="#4ade80"
            @click="navigateTo(localePath('/get-started'))"
          >
            {{ t('indexPage.getStarted') }}
            <template #icon>
              <Icon name="ph:arrow-right-bold" />
            </template>
          </n-button>
        </div>
      </div>
    </div>

    <div id="features" class="py-24 bg-[#18181c] relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0">
        <div
          class="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
        />
        <div
          class="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-5 transform translate-x-1/2"
        />
      </div>

      <div class="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <!-- Header -->
        <div class="text-center mb-16">
          <h2
            class="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
          >
            {{ t('indexPage.featuresTitle') }}
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto">
            {{ t('indexPage.featuresSubtitle') }}
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <n-card
            v-for="feature in features"
            :key="t(feature.title)"
            class="feature-card bg-[#262629] hover:transform hover:scale-105 transition-all duration-300 hover:shadow-xl pt-4"
            :class="feature.activeClass"
          >
            <template #cover>
              <div class="relative pt-8 pb-4">
                <!-- Background circle -->
                <div
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-400/5 rounded-full"
                />
                <!-- Icon -->
                <div class="relative flex justify-center">
                  <Icon
                    :name="feature.icon"
                    class="text-emerald-400 transform transition-all duration-500 hover:scale-110"
                    size="48"
                  />
                </div>
              </div>
            </template>

            <template #header>
              <div class="relative">
                <!-- Title -->
                <div class="text-xl font-semibold text-center mb-2">
                  {{ t(feature.title) }}
                </div>
                <!-- Badge -->
                <div v-if="feature.badge" class="absolute -top-12 right-0">
                  <span
                    class="px-3 py-1 text-sm rounded-full bg-emerald-400/10 text-emerald-400"
                  >
                    {{ t(feature.badge) }}
                  </span>
                </div>
              </div>
            </template>

            <!-- Description -->
            <div class="text-gray-400 text-center mb-4">
              {{ t(feature.description) }}
            </div>

            <!-- Feature List -->
            <div class="space-y-2">
              <div
                v-for="subFeature in feature.subFeatures"
                :key="subFeature"
                class="flex items-center text-sm text-gray-400"
              >
                <Icon
                  name="ph:check-circle-fill"
                  class="text-emerald-400 mr-2"
                  size="16"
                />
                {{ t(subFeature) }}
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </div>

    <div class="py-24 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        />
        <div
          class="absolute top-1/2 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div id="roadmap" class="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <!-- Header -->
        <div class="text-center mb-16">
          <h2
            class="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
          >
            {{ t('indexPage.roadmap.title') }}
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto">
            {{ t('indexPage.roadmap.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Timeline -->
          <div class="relative">
            <n-timeline>
              <n-timeline-item
                v-for="(step, index) in roadmapSteps"
                :key="t(step.title)"
                :title="t(step.title)"
                :content="t(step.description)"
                color="#4ade80"
                :class="[
                  'cursor-pointer transform transition-all duration-300',
                ]"
                @mouseenter="hoveredStep = index"
                @mouseleave="hoveredStep = null"
              >
                <template #icon>
                  <div
                    :class="[
                      'rounded-full p-3 transition-all duration-300 border-2',
                      hoveredStep === index
                        ? 'bg-emerald-400/20 border-emerald-400'
                        : 'bg-emerald-400/10 border-emerald-400/50',
                    ]"
                  >
                    <Icon
                      :name="step.icon"
                      :class="[
                        'text-2xl transition-all duration-30е 0',
                        hoveredStep === index
                          ? 'text-emerald-400'
                          : 'text-emerald-400/70',
                      ]"
                    />
                  </div>
                </template>
                <template #header>
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'text-lg font-semibold transition-all duration-300',
                        hoveredStep === index
                          ? 'text-emerald-400'
                          : 'text-white',
                      ]"
                    >
                      {{ t(step.title) }}
                    </span>
                    <span
                      class="text-sm font-medium px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400"
                    >
                      {{ t(step.status) }}
                    </span>
                  </div>
                </template>
              </n-timeline-item>
            </n-timeline>
          </div>

          <!-- Info Panel -->
          <div class="h-full flex items-center">
            <div class="w-full min-h-[300px] relative">
              <transition-group name="fade">
                <div
                  v-if="hoveredStep !== null"
                  :key="roadmapSteps[hoveredStep].title"
                  class="absolute inset-0 bg-[#262629] p-8 rounded-xl border border-gray-700 hover:border-emerald-400/50 transition-all duration-300"
                >
                  <div class="flex items-center gap-4 mb-6">
                    <div class="bg-emerald-400/10 p-3 rounded-xl">
                      <Icon
                        :name="roadmapSteps[hoveredStep].icon"
                        class="text-3xl text-emerald-400"
                      />
                    </div>
                    <h3
                      class="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
                    >
                      {{ t(roadmapSteps[hoveredStep].heading) }}
                    </h3>
                  </div>
                  <p class="text-gray-400 mb-6">
                    {{ t(roadmapSteps[hoveredStep].details) }}
                  </p>
                  <div class="flex flex-wrap gap-3">
                    <span
                      v-for="feature in roadmapSteps[hoveredStep].keyFeatures"
                      :key="t(feature)"
                      class="px-3 py-1 rounded-full text-sm bg-emerald-400/10 text-emerald-400"
                    >
                      {{ t(feature) }}
                    </span>
                  </div>
                </div>
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-24 bg-[#18181c] relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        />
        <div
          class="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"
        />
      </div>

      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="relative z-10">
          <!-- Header -->
          <div class="text-center mb-12">
            <h2
              class="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
            >
              {{ t('indexPage.contacts.title') }}
            </h2>
            <p class="text-gray-400 max-w-2xl mx-auto">
              {{ t('indexPage.contacts.subtitle') }}
            </p>
          </div>

          <!-- Contact Cards Container -->
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div
              v-for="(card, index) in cards"
              :key="index"
              class="bg-[#262629] p-6 rounded-xl border border-gray-700 hover:border-emerald-400/50 transition-all duration-300 group"
            >
              <div class="flex flex-col items-center justify-between h-full">
                <div
                  class="w-16 h-16 bg-emerald-400/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-400/20 transition-all duration-300"
                >
                  <Icon :name="card.icon" class="text-emerald-400 text-2xl" />
                </div>
                <h3 class="text-xl font-semibold mb-2">{{ t(card.title) }}</h3>
                <p class="text-gray-400 text-center mb-4">
                  {{ t(card.description) }}
                </p>
                <n-button
                  type="primary"
                  color="#4ade80"
                  class="w-full"
                  @click="navigateTo(localePath(card.link))"
                >
                  {{ t(card.buttonText) }}
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const hoveredStep = ref<number | null>(null);

const { t } = useI18n();
const localePath = useLocalePath();
const features = [
  {
    title: 'indexPage.features[0].title',
    description: 'indexPage.features[0].description',
    badge: 'indexPage.features[0].badge',
    icon: 'ph:medal-bold',
    activeClass: 'border-emerald-400/30',
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
    activeClass: 'border-emerald-400/30',
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
    activeClass: 'border-emerald-400/30',
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

const roadmapSteps = [
  {
    title: 'indexPage.roadmap.roadmapSteps[0].title',
    description: 'indexPage.roadmap.roadmapSteps[0].description',
    icon: 'ph:rocket-launch-bold',
    heading: 'indexPage.roadmap.roadmapSteps[0].heading',
    details: 'indexPage.roadmap.roadmapSteps[0].details',
    status: 'indexPage.roadmap.roadmapSteps[0].status',
    keyFeatures: [
      'indexPage.roadmap.roadmapSteps[0].keyFeatures[0]',
      'indexPage.roadmap.roadmapSteps[0].keyFeatures[1]',
      'indexPage.roadmap.roadmapSteps[0].keyFeatures[2]',
      'indexPage.roadmap.roadmapSteps[0].keyFeatures[3]',
    ],
  },
  {
    title: 'indexPage.roadmap.roadmapSteps[1].title',
    description: 'indexPage.roadmap.roadmapSteps[1].description',
    icon: 'ph:brain-bold',
    heading: 'indexPage.roadmap.roadmapSteps[1].heading',
    details: 'indexPage.roadmap.roadmapSteps[1].details',
    status: 'indexPage.roadmap.roadmapSteps[1].status',
    keyFeatures: [
      'indexPage.roadmap.roadmapSteps[1].keyFeatures[0]',
      'indexPage.roadmap.roadmapSteps[1].keyFeatures[1]',
      'indexPage.roadmap.roadmapSteps[1].keyFeatures[2]',
      'indexPage.roadmap.roadmapSteps[1].keyFeatures[3]',
    ],
  },
  {
    title: 'indexPage.roadmap.roadmapSteps[2].title',
    description: 'indexPage.roadmap.roadmapSteps[2].description',
    icon: 'ph:users-bold',
    heading: 'indexPage.roadmap.roadmapSteps[2].heading',
    details: 'indexPage.roadmap.roadmapSteps[2].details',
    status: 'indexPage.roadmap.roadmapSteps[2].status',
    keyFeatures: [
      'indexPage.roadmap.roadmapSteps[2].keyFeatures[0]',
      'indexPage.roadmap.roadmapSteps[2].keyFeatures[1]',
      'indexPage.roadmap.roadmapSteps[2].keyFeatures[2]',
      'indexPage.roadmap.roadmapSteps[2].keyFeatures[3]',
    ],
  },
  {
    title: 'indexPage.roadmap.roadmapSteps[3].title',
    description: 'indexPage.roadmap.roadmapSteps[3].description',
    icon: 'ph:globe-bold',
    heading: 'indexPage.roadmap.roadmapSteps[3].heading',
    details: 'indexPage.roadmap.roadmapSteps[3].details',
    status: 'indexPage.roadmap.roadmapSteps[3].status',
    keyFeatures: [
      'indexPage.roadmap.roadmapSteps[3].keyFeatures[0]',
      'indexPage.roadmap.roadmapSteps[3].keyFeatures[1]',
      'indexPage.roadmap.roadmapSteps[3].keyFeatures[2]',
      'indexPage.roadmap.roadmapSteps[3].keyFeatures[3]',
    ],
  },
];

const cards = [
  {
    icon: 'ph:headset-bold',
    title: t('indexPage.contacts.cards[0].title'),
    description: t('indexPage.contacts.cards[0].description'),
    buttonText: t('indexPage.contacts.cards[0].buttonText'),
    link: localePath('/support'),
  },
  {
    icon: 'ph:currency-circle-dollar-bold',
    title: t('indexPage.contacts.cards[1].title'),
    description: t('indexPage.contacts.cards[1].description'),
    buttonText: t('indexPage.contacts.cards[1].buttonText'),
    link: localePath('/sales'),
  },
  {
    icon: 'ph:handshake-bold',
    title: t('indexPage.contacts.cards[2].title'),
    description: t('indexPage.contacts.cards[2].description'),
    buttonText: t('indexPage.contacts.cards[2].buttonText'),
    link: localePath('/partnerships'),
  },
];
</script>

<style scoped>
/* Custom card styling for the features section*/
:deep(.n-card) {
  background-color: #262629 !important;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

:deep(.n-card:hover) {
  border-color: rgba(74, 222, 128, 0.5);
  box-shadow: 0 0 30px rgba(74, 222, 128, 0.1);
  transform: translateY(-5px);
}

/* Custom button styling */
:deep(.n-button) {
  background-color: #4ade80 !important;
}

:deep(.n-button:hover) {
  background-color: #22c55e !important;
}

/* Card content padding */
:deep(.n-card-header) {
  padding: 1rem !important;
}

:deep(.n-card__content) {
  padding: 1.5rem !important;
}

.feature-card {
  border-radius: 1rem;
}

/* Roadmap related */
:deep(.n-timeline) {
  --n-line-color: rgba(74, 222, 128, 0.2);
  --n-line-type: dotted;
}

:deep(.n-timeline-item::before) {
  border-left: 2px dotted rgba(74, 222, 128, 0.2);
}

/* Fix timeline content cutting into the icon */
:deep(.n-timeline-item-content) {
  margin-left: 3rem !important;
}

:deep(.n-timeline-item) {
  margin-left: 0.5rem;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Fix panel width changing when fading in and out */
.fade-enter-from,
.fade-enter-to,
.fade-leave-from,
.fade-leave-to {
  position: absolute;
  width: 100%;
}
</style>
