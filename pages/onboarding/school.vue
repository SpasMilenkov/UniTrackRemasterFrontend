<template>
  <n-space
    vertical
    :size="24"
    class="w-full max-w-[80rem] min-h-screen mx-auto px-4 py-16"
  >
    <h1 class="md:px-0 text-3xl text-center lg:text-left">School onboarding</h1>
    <n-steps v-model:current="onboardingStore.currentStep" :readonly="true">
      <n-step
        title="Add initial data"
        description="Give us your contact information so we can confirm your identity and begin your integration"
      />
      <n-step
        description="We are verifying the data you submitted, this page will update automatically and if we approved your application you will be moved to the next stage"
      />
      <n-step
        title="Add school information"
        description="Give us information about your school as an educational institution so that we can generate your unique school page on our platform"
      />
      <n-step
        description="Finish the project to setting up your integration for our platform"
      />
    </n-steps>
    <InitialFormComponent v-if="onboardingStore.currentStep === 1" />
    <ApprovalStatusComponent
      v-if="onboardingStore.currentStep === 2"
      title="Approval"
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
</script>
