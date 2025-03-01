<template>
  <div class="py-12">
    <div class="mx-auto max-w-2xl px-6 lg:px-8">
      <div
        v-motion
        class="feature-card backdrop-blur-sm rounded-xl p-8 group hover:border-primary/50 transition-all duration-300"
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="300"
      >
        <div class="flex flex-col items-center">
          <div class="mb-6">
            <div
              class="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300"
              :class="{
                'bg-status-pending': displayStatus === 'pending',
                'bg-status-approved': displayStatus === 'approved',
                'bg-status-rejected': displayStatus === 'rejected',
              }"
            >
              <Icon
                v-if="displayStatus === 'pending'"
                name="eos-icons:three-dots-loading"
                class="text-status-pending text-5xl"
              />
              <Icon
                v-else-if="displayStatus === 'approved'"
                name="ic:baseline-check-circle-outline"
                class="text-status-approved text-5xl"
              />
              <Icon
                v-else
                name="material-symbols:check-circle"
                class="text-status-rejected text-5xl"
              />
            </div>
          </div>
          <div class="w-3/4 h-px bg-gray-700/50 my-6" />
          <div class="text-center">
            <h2
              class="text-2xl font-bold mb-4 capitalize"
              :class="{
                'gradient-text-pending': displayStatus === 'pending',
                'gradient-text-approved': displayStatus === 'approved',
                'gradient-text-rejected': displayStatus === 'rejected',
              }"
            >
              {{ t(`onboarding.approval.status.${displayStatus}`) }}
            </h2>

            <p
              v-if="displayStatus === 'pending'"
              class="text-text-secondary mb-6"
            >
              {{ t('onboarding.approval.messages.pending') }}
            </p>
            <div
              v-if="displayStatus === 'approved'"
              class="flex flex-col items-center gap-6"
            >
              <p class="text-text-secondary">
                {{ t('onboarding.approval.messages.approved') }}
              </p>
              <n-button
                type="primary"
                class="text-lg px-8 transform hover:scale-105 transition-all duration-300"
                @click="moveToNextStep"
              >
                {{ t('onboarding.approval.buttons.continue') }}
                <template #icon>
                  <Icon name="ph:arrow-right-bold" />
                </template>
              </n-button>
            </div>
            <div
              v-if="displayStatus === 'rejected'"
              class="flex flex-col items-center gap-6"
            >
              <p class="text-text-secondary">
                {{ t('onboarding.approval.messages.rejected') }}
              </p>
              <n-button
                type="primary"
                class="text-lg px-8 transform hover:scale-105 transition-all duration-300"
              >
                {{ t('onboarding.approval.buttons.applyAgain') }}
                <template #icon>
                  <Icon name="ph:arrow-right-bold" />
                </template>
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ApplicationStatus } from '~/enums/application-status.enum';

// Stores
const onboardingStore = useOnboardingStore();

// Localization
const { t } = useI18n();

// Define the prop with validation
const props = defineProps<{
  status: ApplicationStatus;
}>();

// Map the ApplicationStatus enum to display status
const displayStatus = computed((): 'pending' | 'approved' | 'rejected' => {
  switch (props.status) {
    case ApplicationStatus.Pending:
      return 'pending';
    case ApplicationStatus.Approved:
    case ApplicationStatus.Verified:
      return 'approved';
    case ApplicationStatus.Denied:
      return 'rejected';
    default:
      return 'pending';
  }
});

const moveToNextStep = () => {
  if (onboardingStore.applicationData?.status === ApplicationStatus.Approved) {
    onboardingStore.currentStep = ApplicationStatus.Approved;
  }
};
</script>

<style scoped>
</style>
