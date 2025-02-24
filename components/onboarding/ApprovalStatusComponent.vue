<template>
  <div class="min-h-screen bg-[#101014] text-white relative">
    <div class="relative z-10">
      <div class="py-12">
        <div class="mx-auto max-w-2xl px-6 lg:px-8">
          <div
            class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 group hover:border-emerald-400/50 transition-all duration-300"
          >
            <div class="flex flex-col items-center">
              <div class="mb-6">
                <div
                  class="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300"
                  :class="{
                    'bg-yellow-400/10': displayStatus === 'pending',
                    'bg-emerald-400/10': displayStatus === 'approved',
                    'bg-red-400/10': displayStatus === 'rejected',
                  }"
                >
                  <Icon
                    v-if="displayStatus === 'pending'"
                    name="eos-icons:three-dots-loading"
                    class="text-yellow-400 text-5xl"
                  />
                  <Icon
                    v-else-if="displayStatus === 'approved'"
                    name="ic:baseline-check-circle-outline"
                    class="text-emerald-400 text-5xl"
                  />
                  <Icon
                    v-else
                    name="material-symbols:check-circle"
                    class="text-red-400 text-5xl"
                  />
                </div>
              </div>
              <div class="w-3/4 h-px bg-gray-700/50 my-6" />
              <div class="text-center">
                <h2
                  class="text-2xl font-bold mb-4 bg-gradient-to-r text-transparent bg-clip-text capitalize"
                  :class="{
                    'from-yellow-400 to-yellow-600':
                      displayStatus === 'pending',
                    'from-emerald-400 to-blue-500':
                      displayStatus === 'approved',
                    'from-red-400 to-red-600': displayStatus === 'rejected',
                  }"
                >
                  {{ t(`onboarding.approval.status.${displayStatus}`) }}
                </h2>

                <p
                  v-if="displayStatus === 'pending'"
                  class="text-gray-400 mb-6"
                >
                  {{ t('onboarding.approval.messages.pending') }}
                </p>
                <div
                  v-if="displayStatus === 'approved'"
                  class="flex flex-col items-center gap-6"
                >
                  <p class="text-gray-400">
                    {{ t('onboarding.approval.messages.approved') }}
                  </p>
                  <n-button
                    type="primary"
                    color="#4ade80"
                    class="text-lg px-8"
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
                  <p class="text-gray-400">
                    {{ t('onboarding.approval.messages.rejected') }}
                  </p>
                  <n-button type="primary" color="#4ade80" class="text-lg px-8">
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
    onboardingStore.currentStep = 3;
  }
};
</script>

<style scoped></style>
