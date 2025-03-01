<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="isVisible && !hide"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="w-full max-w-4xl mx-auto p-4 animate-scale-in">
        <n-card class="bg-background-card border border-border">
          <n-space vertical>
            <div class="flex justify-between items-center mb-4">
              <div class="text-xl font-semibold text-text-primary">
                {{ title }}
              </div>
              <div class="flex items-center gap-4">
                <div class="text-sm text-text-secondary">
                  {{ currentStep + 1 }} / {{ steps.length }}
                </div>
                <n-button
                  text
                  type="primary"
                  size="small"
                  @click="isVisible = false"
                >
                  {{ skipButtonText }}
                </n-button>
              </div>
            </div>

            <div class="relative">
              <n-carousel
                v-model:current-index="currentStep"
                dot-placement="bottom"
                effect="fade"
                :show-arrow="false"
                :autoplay="false"
                :keyboard="true"
                class="min-h-[400px]"
                trigger="click"
              >
                <n-carousel-item v-for="(step, index) in steps" :key="index">
                  <div class="h-full p-6 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center gap-4 mb-4">
                        <div
                          class="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center"
                        >
                          <span class="text-primary text-xl font-bold">{{
                            index + 1
                          }}</span>
                        </div>
                        <h3 class="text-lg font-medium text-text-primary">
                          {{ step.title }}
                        </h3>
                      </div>

                      <!-- Icon section -->
                      <div class="flex justify-center my-6">
                        <NuxtPicture
                          format="avif,webp"
                          :src="stepImages[index]"
                          class="w-24 h-24 text-primary"
                        />
                      </div>

                      <p class="text-base text-text-secondary">
                        {{ step.description }}
                      </p>
                    </div>
                    <div class="mt-6">
                      <n-alert v-if="step.note" type="info" :show-icon="true">
                        {{ step.note }}
                      </n-alert>
                    </div>
                  </div>
                </n-carousel-item>
              </n-carousel>
            </div>

            <div class="mt-8 flex justify-between items-center px-4">
              <n-button
                secondary
                size="large"
                :disabled="currentStep === 0"
                @click="currentStep--"
              >
                {{ previousButtonText }}
              </n-button>
              <n-button
                v-if="currentStep !== steps.length - 1"
                secondary
                size="large"
                :disabled="currentStep === steps.length - 1"
                @click="currentStep++"
              >
                {{ nextButtonText }}
              </n-button>
              <n-button
                v-else
                type="primary"
                size="large"
                @click="isVisible = false"
              >
                {{ doneButtonText }}
              </n-button>
            </div>
          </n-space>
        </n-card>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Step {
  title: string;
  description: string;
  note?: string;
}

const stepImages = [
  '/images/onboarding/instructions/form.png', // Initial Application
  '/images/onboarding/instructions/email.png', // Email Verification
  '/images/onboarding/instructions/review.png', // Application Review
  '/images/onboarding/instructions/building.png', // Institution Details
  '/images/onboarding/instructions/setup.png', // Admin Account Setup
];

interface Props {
  title: string;
  steps: Step[];
  previousButtonText?: string;
  nextButtonText?: string;
  doneButtonText?: string;
  skipButtonText?: string;
  hide?: boolean;
}

const isVisible = ref(true);

withDefaults(defineProps<Props>(), {
  title: 'Instructions',
  previousButtonText: 'Previous',
  nextButtonText: 'Next',
  doneButtonText: 'Done',
  skipButtonText: 'Skip',
  hide: true,
});

const currentStep = ref(0);
</script>

<style scoped>
:deep(.n-carousel) {
  height: 100%;
}

:deep(.n-carousel .n-carousel__dots) {
  bottom: -24px;
}

:deep(.n-carousel .n-carousel__dot) {
  margin: 0 4px;
}

:deep(.n-alert) {
  background-color: var(--color-secondary-hover);
  border: 1px solid var(--color-secondary);
}

:deep(.n-alert .n-alert-body),
:deep(.n-alert .n-alert__description) {
  color: var(--color-text-primary);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
