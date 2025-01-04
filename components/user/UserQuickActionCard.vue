<template>
  <div
    class="group relative bg-[#262629] rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 min-h-[16rem]"
  >
    <!-- Gradient border effect -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />

    <!-- Glowing orb effect -->
    <div
      class="absolute -right-20 -top-20 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl group-hover:bg-emerald-400/10 transition-all duration-300"
    />

    <div class="relative p-8 flex flex-col h-full">
      <!-- Header -->
      <div class="mb-6">
        <div
          class="bg-emerald-400/10 p-4 rounded-xl w-fit mb-6 group-hover:bg-emerald-400/20 transition-all duration-300"
        >
          <Icon
            :name="action.icon"
            class="text-3xl text-emerald-400 group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h3
          class="text-xl font-semibold text-white mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent"
        >
          {{ t(action.title) }}
        </h3>
        <p class="text-gray-400 text-lg leading-relaxed">
          {{ t(action.description) }}
        </p>
      </div>

      <!-- Features List -->
      <div class="space-y-4 flex-grow mb-8">
        <div
          v-for="feature in action.features"
          :key="feature"
          class="flex items-center text-base text-gray-300"
        >
          <Icon
            name="ph:check-circle-fill"
            class="text-emerald-400 mr-3 text-lg shrink-0"
          />
          <span>{{ feature }}</span>
        </div>
      </div>

      <div class="relative mt-auto flex flex-row-reverse">
        <n-button
          type="primary"
          color="#4ade80"
          class="min-w-[13.125rem] h-14 text-base font-medium group-hover:shadow-lg group-hover:shadow-emerald-400/20 transition-all duration-300"
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
