<template>
  <div
    class="min-h-screen bg-background text-text-primary py-16 relative overflow-hidden"
  >
    <!-- Floating Particles Background (consistent with landing page) -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="n in 30"
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

    <!-- Main Content Container -->
    <div
      class="w-full max-w-[80rem] min-h-screen mx-auto px-6 lg:px-8 relative z-10"
    >
      <!-- Page Title with gradient -->
      <h1
        v-motion
        class="text-3xl md:text-4xl font-bold text-center lg:text-left bg-gradient-primary mb-12"
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="200"
      >
        {{ t('onboarding.title') }}
      </h1>

      <!-- Steps Component -->
      <div
        v-motion
        class="mb-16 backdrop-blur-sm p-6 rounded-xl border border-primary-border"
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1 }"
        :delay="400"
      >
        <n-steps v-model:current="currentStep" :readonly="true">
          <n-step
            :title="t('onboarding.steps.initialData.title')"
            :description="t('onboarding.steps.initialData.description')"
            :disabled="currentStep !== 1"
          />
          <n-step
            :description="t('onboarding.steps.verification.description')"
            :disabled="currentStep !== 2"
          />
          <n-step
            :title="t('onboarding.steps.institutionInfo.title')"
            :description="t('onboarding.steps.institutionInfo.description')"
            :disabled="currentStep !== 3"
          />
          <n-step
            :description="t('onboarding.steps.finalize.description')"
            :disabled="currentStep !== 4"
          />
        </n-steps>
      </div>

      <!-- Instructions Flash Cards - keeping original behavior -->
      <InstructionFlashCards
        v-if="isInstructionsVisible && onboardingStore.currentStep == null"
        :steps="steps"
        title="Signup form tutorial"
        skip-button-text="Skip Tutorial"
        class="mb-8"
        @close="handleClose"
      />

      <!-- Form Components with Card Styling - preserving all original functionality -->
      <n-card
        v-if="currentStep === 1"
        v-motion
        class="feature-card backdrop-blur-sm mb-8"
        :bordered="false"
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="600"
      >
        <InitialFormComponent />
      </n-card>

      <n-card
        v-if="currentStep === 2"
        v-motion
        class="feature-card backdrop-blur-sm mb-8"
        :bordered="false"
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="600"
      >
        <ApprovalStatusComponent
          :status="
            onboardingStore.applicationData?.status ?? ApplicationStatus.Pending
          "
        />
      </n-card>

      <n-card
        v-if="
          currentStep === 3 &&
          onboardingStore.selectedInstitutionCategory === 'school'
        "
        v-motion
        class="feature-card backdrop-blur-sm mb-8"
        :bordered="false"
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="600"
      >
        <SchoolInfoFormComponent />
      </n-card>

      <n-card
        v-if="
          currentStep === 3 &&
          onboardingStore.selectedInstitutionCategory === 'higher-ed'
        "
        v-motion
        class="feature-card backdrop-blur-sm mb-8"
        :bordered="false"
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="600"
      >
        <UniversityInfoForm />
      </n-card>

      <n-card
        v-if="currentStep === 4"
        v-motion
        class="feature-card backdrop-blur-sm mb-8"
        :bordered="false"
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="600"
      >
        <FinalizeCardComponent />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import ApprovalStatusComponent from '~/components/onboarding/ApprovalStatusComponent.vue';
import InitialFormComponent from '~/components/onboarding/InitialFormComponent.vue';
import SchoolInfoFormComponent from '~/components/onboarding/SchoolInfoFormComponent.vue';
import FinalizeCardComponent from '~/components/onboarding/FinalizeCardComponent.vue';
import UniversityInfoForm from '~/components/onboarding/UniversityInfoFormComponent.vue';
import InstructionFlashCards from '~/components/InstructionCards.vue';
import { ApplicationStatus } from '~/enums/application-status.enum';

const isInstructionsVisible = ref(true);
const route = useRoute();
const onboardingStore = useOnboardingStore();
const { t } = useI18n();
const currentStep = ref(0);

const handleClose = () => {
  isInstructionsVisible.value = false;
};

const steps = computed(() => [
  {
    title: t('instructions.steps.initial.title'),
    description: t('instructions.steps.initial.description'),
    note: t('instructions.steps.initial.note'),
  },
  {
    title: t('instructions.steps.verification.title'),
    description: t('instructions.steps.verification.description'),
    note: t('instructions.steps.verification.note'),
  },
  {
    title: t('instructions.steps.review.title'),
    description: t('instructions.steps.review.description'),
    note: t('instructions.steps.review.note'),
  },
  {
    title: t('instructions.steps.details.title'),
    description: t('instructions.steps.details.description'),
    note: t('instructions.steps.details.note'),
  },
  {
    title: t('instructions.steps.setup.title'),
    description: t('instructions.steps.setup.description'),
    note: t('instructions.steps.setup.note'),
  },
]);

const statusToStep = (status: ApplicationStatus | null) => {
  console.log(onboardingStore.selectedInstitutionCategory);
  switch (status) {
    case ApplicationStatus.Pending:
      currentStep.value = 2;
      break;
    case ApplicationStatus.Denied:
      currentStep.value = 2;
      break;
    case ApplicationStatus.Approved:
      currentStep.value = 3;
      break;
    case ApplicationStatus.Verified:
      currentStep.value = 4;
      break;
    default:
      currentStep.value = 1;
  }
};

onMounted(async () => {
  const id = route.params.id as string;
  // if (!onboardingStore.checkAuthStatus()) {
  //   // return navigateTo('/onboarding/auth');
  // }

  if (id) {
    try {
      await onboardingStore.getApplicationById(id);
    } catch (error) {
      console.log('I AM FAILING TO FETCH');
      console.error('Failed to fetch application:', error);
      return navigateTo('/onboarding/auth');
    }
  }
  statusToStep(onboardingStore.currentStep);
  onboardingStore.setCategoryFromType();
});

// Watch for route changes
watch(
  () => route.params.id,
  async (newId) => {
    if (newId && onboardingStore.checkAuthStatus()) {
      try {
        await onboardingStore.getApplicationById(newId as string);
      } catch (error) {
        console.error('Failed to fetch application:', error);
        return navigateTo('/onboarding/auth');
      }
    }
    onboardingStore.currentStep = null;
  }
);
</script>

<style scoped>
/* Use CSS variables based on theme */
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

.feature-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.15);
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

.border-primary-border {
  border-color: rgba(var(--color-primary-rgb), 0.2);
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

/* Enhance step styles while preserving functionality */
:deep(.n-steps) {
  --n-description-text-color: var(--color-text-secondary);
  --n-title-text-color: var(--color-text-primary);
}

:deep(.n-step:not(.n-step--disabled) .n-step-indicator__slot) {
  color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
}

:deep(.n-step:not(.n-step--disabled) .n-step__content .n-step__title) {
  color: var(--color-primary) !important;
}

:deep(.n-step:not(.n-step--disabled) .n-step-indicator-slot) {
  border-color: var(--color-primary) !important;
}

/* Status colors for various states */
.text-status-pending {
  color: var(--color-yellow-400, #facc15);
}

.text-status-approved {
  color: var(--color-emerald-400, #34d399);
}

.text-status-rejected {
  color: var(--color-red-400, #f87171);
}

.bg-status-pending {
  background-color: rgba(var(--color-yellow-400-rgb, 250, 204, 21), 0.1);
}

.bg-status-approved {
  background-color: rgba(var(--color-emerald-400-rgb, 52, 211, 153), 0.1);
}

.bg-status-rejected {
  background-color: rgba(var(--color-red-400-rgb, 248, 113, 113), 0.1);
}

.gradient-text-pending {
  background-image: linear-gradient(
    to right,
    var(--color-yellow-400, #facc15),
    var(--color-yellow-600, #ca8a04)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.gradient-text-approved {
  background-image: linear-gradient(
    to right,
    var(--color-emerald-400, #34d399),
    var(--color-blue-500, #3b82f6)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.gradient-text-rejected {
  background-image: linear-gradient(
    to right,
    var(--color-red-400, #f87171),
    var(--color-red-600, #dc2626)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
</style>
