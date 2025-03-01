<template>
  <div class="min-h-screen bg-background text-text-primary relative">
    <div class="relative z-10">
      <div class="py-12">
        <div class="mx-auto max-w-2xl px-6 lg:px-8">
          <div
            v-motion
            class="feature-card backdrop-blur-sm rounded-xl p-12 flex flex-col items-center hover:border-primary/50 transition-all duration-300"
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="300"
          >
            <div class="mb-8">
              <div
                class="w-24 h-24 bg-status-approved rounded-full flex items-center justify-center transition-all duration-300"
                style="transition: all 0.3s ease;"
              >
                <Icon
                  name="ph:check-circle-fill"
                  class="text-status-approved text-5xl"
                />
              </div>
            </div>
            <TitleComponent
              :title="t('onboarding.success.title')"
              class="text-3xl font-bold tracking-tight gradient-text-approved mb-4"
            />
            <p style="color: var(--color-text-secondary); font-size: 1.125rem; margin-bottom: 2rem;">
              {{ t('onboarding.success.message') }}
            </p>
            <n-button
              type="primary"
              class="text-lg"
              style="padding-left: 3rem; padding-right: 3rem; transition: all 0.3s ease;"
              size="large"
              @click="navigateTo(localePath('/login'))"
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

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const localePath = useLocalePath();
</script>

<style scoped>
</style>