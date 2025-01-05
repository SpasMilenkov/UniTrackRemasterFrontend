<template>
  <n-space
    vertical
    :size="24"
    class="w-full max-w-[80rem] min-h-screen mx-auto px-4 py-16"
  >
    <h1 class="md:px-0 text-3xl text-center lg:text-left">
      {{ t('onboarding.title') }}
    </h1>
    <n-steps v-model:current="onboardingStore.currentStep" :readonly="true">
      <n-step
        :title="t('onboarding.steps.initialData.title')"
        :description="t('onboarding.steps.initialData.description')"
      />
      <n-step :description="t('onboarding.steps.verification.description')" />
      <n-step
        :title="t('onboarding.steps.schoolInfo.title')"
        :description="t('onboarding.steps.schoolInfo.description')"
      />
      <n-step :description="t('onboarding.steps.finalize.description')" />
    </n-steps>
    <InitialFormComponent v-if="onboardingStore.currentStep === 1" />
    <ApprovalStatusComponent
      v-if="onboardingStore.currentStep === 2"
      :title="t('onboarding.steps.approval.title')"
      :status-number="onboardingStore.applicationData?.status ?? 0"
    />
    <SchoolInfoFormComponent v-if="onboardingStore.currentStep === 3" />
    <FinalizeCardComponent v-if="onboardingStore.currentStep === 4" />
  </n-space>
</template>

<script setup lang="ts">
import ApprovalStatusComponent from '~/components/onboarding/ApprovalStatusComponent.vue';
import InitialFormComponent from '~/components/onboarding/InitialFormComponent.vue';
import SchoolInfoFormComponent from '~/components/onboarding/SchoolInfoFormComponent.vue';
import FinalizeCardComponent from '~/components/onboarding/FinalizeCardComponent.vue';

const onboardingStore = useSchoolOnboardingStore();
const { t } = useI18n();
</script>
