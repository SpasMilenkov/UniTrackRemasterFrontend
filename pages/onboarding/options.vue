<template>
  <div class="min-h-screen bg-background text-text-primary relative">
    <!-- Full-page background decorations with theme variables -->
    <div class="fixed inset-0 z-0">
      <div
        class="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full filter blur-3xl transform -translate-x-1/2"
        style="background-color: var(--color-primary); opacity: 0.05"
      />
      <div
        class="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full filter blur-3xl transform translate-x-1/2"
        style="background-color: var(--color-secondary, #3b82f6); opacity: 0.05"
      />
      <div
        class="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full filter blur-3xl transform -translate-x-1/2"
        style="background-color: var(--color-primary); opacity: 0.05"
      />
    </div>

    <!-- Floating Particles Background (consistent with other pages) -->
    <div class="fixed inset-0 overflow-hidden z-0">
      <div
        v-for="n in 15"
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

    <!-- Content wrapper -->
    <div class="relative z-10">
      <!-- Header Section -->
      <div
        v-motion
        class="py-16"
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="200"
      >
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <h1
              class="text-4xl font-bold tracking-tight bg-gradient-primary mb-6"
            >
              {{
                t(
                  `institutionSelection.headers.${showSchoolOptions ? 'schoolOptions' : 'institutionType'}`
                )
              }}
            </h1>
            <p
              style="
                color: var(--color-text-secondary);
                max-width: 32rem;
                margin-left: auto;
                margin-right: auto;
              "
            >
              {{
                t(
                  `institutionSelection.headers.${showSchoolOptions ? 'schoolOptionsDesc' : 'institutionTypeDesc'}`
                )
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Cards Section -->
      <div class="py-12">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            v-motion
            class="grid md:grid-cols-2 gap-8"
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="400"
          >
            <template v-if="!showSchoolOptions">
              <OptionCard
                v-for="(card, index) in institutionCards.main"
                :key="index"
                :card="{
                  ...card,
                  title: t(
                    `institutionSelection.cards.${index === 0 ? 'school' : 'university'}.title`
                  ),
                  description: t(
                    `institutionSelection.cards.${index === 0 ? 'school' : 'university'}.description`
                  ),
                  features: [
                    t(
                      `institutionSelection.cards.${index === 0 ? 'school' : 'university'}.features.${index === 0 ? 'curriculum' : 'credits'}`
                    ),
                    t(
                      `institutionSelection.cards.${index === 0 ? 'school' : 'university'}.features.${index === 0 ? 'communication' : 'research'}`
                    ),
                    t(
                      `institutionSelection.cards.${index === 0 ? 'school' : 'university'}.features.${index === 0 ? 'tracking' : 'collaboration'}`
                    ),
                  ],
                  buttonText: t(
                    `institutionSelection.cards.${index === 0 ? 'school' : 'university'}.button`
                  ),
                }"
              />
            </template>
            <template v-else>
              <OptionCard
                v-for="(card, index) in institutionCards.school"
                :key="index"
                :card="{
                  ...card,
                  title: t(
                    `institutionSelection.cards.${index === 0 ? 'newApplication' : 'checkStatus'}.title`
                  ),
                  description: t(
                    `institutionSelection.cards.${index === 0 ? 'newApplication' : 'checkStatus'}.description`
                  ),
                  features: [
                    t(
                      `institutionSelection.cards.${index === 0 ? 'newApplication' : 'checkStatus'}.features.${index === 0 ? 'setup' : 'updates'}`
                    ),
                    t(
                      `institutionSelection.cards.${index === 0 ? 'newApplication' : 'checkStatus'}.features.${index === 0 ? 'options' : 'timeline'}`
                    ),
                    t(
                      `institutionSelection.cards.${index === 0 ? 'newApplication' : 'checkStatus'}.features.support`
                    ),
                  ],
                  buttonText: t(
                    `institutionSelection.cards.${index === 0 ? 'newApplication' : 'checkStatus'}.button`
                  ),
                }"
              />
            </template>
          </div>

          <!-- Back Button -->
          <div
            v-if="showSchoolOptions"
            v-motion
            class="text-center mt-8"
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="600"
          >
            <n-button
              style="color: var(--color-text-secondary)"
              @click="showSchoolOptions = false"
            >
              <template #icon>
                <Icon name="ph:arrow-left-bold" />
              </template>
              {{ t('institutionSelection.backButton') }}
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OptionCard from '~/components/onboarding/OptionCardComponent.vue';
import { InstitutionType } from '~/enums/institution-type.enum';

const { t } = useI18n();
const showSchoolOptions = ref(false);
const localePath = useLocalePath();
const onboardingStore = useOnboardingStore();
const institutionCards = {
  main: [
    {
      icon: 'ph:book-open-bold',
      buttonAction: () => {
        onboardingStore.setInstitutionCategory('school');
        showSchoolOptions.value = true;
      },
    },
    {
      icon: 'ph:graduation-cap-bold',
      buttonAction: () => {
        onboardingStore.setInstitutionCategory('higher-ed');
        showSchoolOptions.value = true;
      },
    },
  ],
  school: [
    {
      icon: 'ph:plus-circle-bold',
      buttonAction: () => {
        onboardingStore.institutionType = InstitutionType.HighSchool;
        navigateTo(localePath('/onboarding/institution'));
      },
    },
    {
      icon: 'ph:clock-bold',
      buttonAction: () => navigateTo(localePath('/onboarding/auth')),
    },
  ],
};
</script>

<style scoped>
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

.bg-primary {
  background-color: var(--color-primary);
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
