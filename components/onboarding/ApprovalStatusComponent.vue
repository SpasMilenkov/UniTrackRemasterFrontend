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
                    'bg-yellow-400/10': onboardingStatus === 'pending',
                    'bg-emerald-400/10': onboardingStatus === 'approved',
                    'bg-red-400/10': onboardingStatus === 'rejected',
                  }"
                >
                  <Icon
                    v-if="onboardingStatus === 'pending'"
                    name="eos-icons:three-dots-loading"
                    class="text-yellow-400 text-5xl"
                  />
                  <Icon
                    v-else-if="onboardingStatus === 'approved'"
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
                      onboardingStatus === 'pending',
                    'from-emerald-400 to-blue-500':
                      onboardingStatus === 'approved',
                    'from-red-400 to-red-600': onboardingStatus === 'rejected',
                  }"
                >
                  {{ t(`onboarding.approval.status.${onboardingStatus}`) }}
                </h2>

                <p
                  v-if="onboardingStatus === 'pending'"
                  class="text-gray-400 mb-6"
                >
                  {{ t('onboarding.approval.messages.pending') }}
                </p>
                <div
                  v-if="onboardingStatus === 'approved'"
                  class="flex flex-col items-center gap-6"
                >
                  <p class="text-gray-400">
                    {{ t('onboarding.approval.messages.approved') }}
                  </p>
                  <n-button type="primary" color="#4ade80" class="text-lg px-8">
                    {{ t('onboarding.approval.buttons.continue') }}
                    <template #icon>
                      <Icon name="ph:arrow-right-bold" />
                    </template>
                  </n-button>
                </div>
                <div
                  v-if="onboardingStatus === 'rejected'"
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
import type { Ref } from 'vue';
import { ref, watch } from 'vue';

// Localization
const { t } = useI18n();

// Define the prop with validation
const props = defineProps<{
  statusNumber: number;
}>();

// Validate that the number is between 0 and 3
const isValidStatus = (num: number) => num >= 0 && num <= 3;

// Define the status mapping function
const mapNumberToStatus = (
  num: number
): 'pending' | 'approved' | 'rejected' => {
  const incrementedNum = num + 1;
  switch (incrementedNum) {
    case 1:
      return 'pending';
    case 2:
      return 'approved';
    case 3:
      return 'rejected';
    default:
      return 'pending';
  }
};

// Create the status ref with the initial mapped value
const onboardingStatus: Ref<'pending' | 'approved' | 'rejected'> = ref(
  isValidStatus(props.statusNumber)
    ? mapNumberToStatus(props.statusNumber)
    : 'pending'
);

// Watch for changes to the prop and update the status
watch(
  () => props.statusNumber,
  (newValue) => {
    if (isValidStatus(newValue)) {
      onboardingStatus.value = mapNumberToStatus(newValue);
    }
  }
);
</script>

<style scoped></style>
