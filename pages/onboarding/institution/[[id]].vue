<template>
  <n-space
    vertical
    :size="24"
    class="w-full max-w-[80rem] min-h-screen mx-auto px-4 py-16"
  >
    <h1 class="md:px-0 text-3xl text-center lg:text-left">
      {{ t('onboarding.title') }}
    </h1>
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
    <InstructionFlashCards
      v-if="isInstructionsVisible && onboardingStore.currentStep == null"
      :steps="steps"
      title="Signup form tutorial"
      skip-button-text="Skip Tutorial"
      @close="handleClose"
    />
    <InitialFormComponent v-if="currentStep === 1" />
    <ApprovalStatusComponent
      v-if="currentStep === 2"
      :status="
        onboardingStore.applicationData?.status ?? ApplicationStatus.Pending
      "
    />
    <SchoolInfoFormComponent
      v-if="
        currentStep === 3 &&
        onboardingStore.selectedInstitutionCategory === 'school'
      "
    />
    <UniversityInfoForm
      v-if="
        currentStep === 3 &&
        onboardingStore.selectedInstitutionCategory === 'higher-ed'
      "
    />
    <FinalizeCardComponent v-if="currentStep === 4" />
  </n-space>
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

const handleClose = () => {
  isInstructionsVisible.value = false;
};

const route = useRoute();
const onboardingStore = useOnboardingStore();
const { t } = useI18n();
const currentStep = ref(0);

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
  console.log(onboardingStore.selectedInstitutionCategory)
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
  if (!onboardingStore.checkAuthStatus()) {
    return navigateTo('/onboarding/auth');
  }

  if (id) {
    try {
      await onboardingStore.getApplicationById(id);
    } catch (error) {
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
