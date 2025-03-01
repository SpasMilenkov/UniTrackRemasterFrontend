<template>
  <div
    class="group relative bg-background-secondary rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 min-h-[14rem]"
  >
    <!-- Gradient border effect -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />
    <!-- Glowing orb effect -->
    <div
      class="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-300"
    />
    <div class="relative p-5 flex flex-col h-full">
      <!-- Header -->
      <div class="mb-4">
        <div
          class="bg-primary/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-all duration-300"
        >
          <Icon
            :name="action.icon"
            class="text-2xl text-primary group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h3 class="text-lg font-semibold text-gradient mb-2">
          {{ t(action.title) }}
        </h3>
        <p class="text-text-secondary text-base leading-relaxed">
          {{ t(action.description) }}
        </p>
      </div>
      <!-- Features List -->
      <div class="space-y-2 flex-grow mb-4">
        <div
          v-for="feature in action.features"
          :key="feature"
          class="flex items-center text-sm text-text-secondary"
        >
          <Icon
            name="ph:check-circle-fill"
            class="text-primary mr-2 text-base shrink-0"
          />
          <span>{{ feature }}</span>
        </div>
      </div>
      <div class="relative mt-auto flex flex-row-reverse">
        <n-button
          type="primary"
          class="min-w-[12rem] h-12 text-base font-medium group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
          @click="navigateTo(action.link)"
        >
          <span class="mr-2">{{ t(action.buttonText) }}</span>
          <Icon
            name="ph:arrow-right-bold"
            class="text-lg group-hover:translate-x-1 transition-transform duration-300"
          />
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserQuickAction } from '~/interfaces/user/quick-action.props';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
defineProps<{
  action: UserQuickAction;
}>();
</script>

<style scoped></style>
