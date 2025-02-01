<template>
  <div class="min-h-screen bg-[#101014] text-white relative">
    <!-- Full-page background decorations -->
    <div class="fixed inset-0 z-0">
      <div
        class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
      />
      <div
        class="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-500 rounded-full filter blur-3xl opacity-5 transform translate-x-1/2"
      />
      <div
        class="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-emerald-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
      />
    </div>

    <!-- Content wrapper -->
    <div class="relative z-10">
      <!-- Header Section -->
      <div class="py-16">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <h1
              class="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text mb-6"
            >
              {{
                t(
                  `institutionSelection.headers.${showSchoolOptions ? 'schoolOptions' : 'institutionType'}`
                )
              }}
            </h1>
            <p class="text-gray-400 max-w-2xl mx-auto">
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
          <div class="grid md:grid-cols-2 gap-8">
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
          <div v-if="showSchoolOptions" class="text-center mt-8">
            <n-button class="text-gray-400" @click="showSchoolOptions = false">
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
      buttonAction: () => (showSchoolOptions.value = true),
    },
    {
      icon: 'ph:graduation-cap-bold',
      buttonAction: () => (showSchoolOptions.value = true),
    },
  ],
  school: [
    {
      icon: 'ph:plus-circle-bold',
      buttonAction: () => {
        onboardingStore.institutionType = InstitutionType.HIGH_SCHOOL;
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
