<!-- SuccessCard.vue -->
<template>
  <div class="min-h-screen bg-[#101014] text-white relative">
    <div class="relative z-10">
      <div class="py-12">
        <div class="mx-auto max-w-2xl px-6 lg:px-8">
          <div
            class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12 group hover:border-emerald-400/50 transition-all duration-300 flex flex-col items-center"
          >
            <div class="mb-8">
              <div
                class="w-24 h-24 bg-emerald-400/10 rounded-full flex items-center justify-center group-hover:bg-emerald-400/20 transition-all duration-300"
              >
                <Icon
                  name="ph:check-circle-fill"
                  class="text-emerald-400 text-5xl"
                />
              </div>
            </div>
            <TitleComponent
              :title="t('onboarding.success.title')"
              class="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text mb-4"
            />
            <p class="text-gray-400 text-lg mb-8">
              {{ t('onboarding.success.message') }}
            </p>
            <n-button
              type="primary"
              color="#4ade80"
              class="text-lg px-12"
              size="large"
            >
              {{ t('onboarding.success.button') }}
              <template #icon>
                <Icon name="ph:arrow-right-bold" />
              </template>
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lnag="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<style scoped></style>
