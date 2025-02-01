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

    <InitialFormComponent v-if="currentStep === 1" />
    <ApprovalStatusComponent
      v-if="currentStep === 2"
      :status-number="onboardingStore.applicationData?.status ?? 0"
    />
    <SchoolInfoFormComponent
      v-if="
        currentStep === 3 &&
        onboardingStore.institutionType !== InstitutionType.UNIVERSITY
      "
    />
    <UniversityInfoForm
      v-if="
        currentStep === 3 &&
        onboardingStore.institutionType === InstitutionType.UNIVERSITY
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
import { InstitutionType } from '~/enums/institution-type.enum';
import UniversityInfoForm from '~/components/onboarding/UniversityInfoFormComponent.vue';

const route = useRoute();
const onboardingStore = useOnboardingStore();
const { t } = useI18n();
const currentStep = ref(0);

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
  currentStep.value = onboardingStore.currentStep
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
    onboardingStore.currentStep = 0;
  }
);
</script>
