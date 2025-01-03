<template>
  <n-card
    class="relative overflow-hidden transition-all duration-300 bg-[#262629] hover:bg-[#2a2a2d] border border-gray-700/50 hover:border-emerald-400/30 dark:text-white rounded-xl"
    :title="data.title"
  >
    <!-- Gradient overlay effect on hover -->
    <div
      class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
    >
      <div
        class="absolute top-0 left-0 w-32 h-32 bg-emerald-500 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"
      />
      <div
        class="absolute bottom-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"
      />
    </div>

    <!-- Card Content -->
    <template #header>
      <div class="flex items-center justify-between mb-4">
        <h3
          class="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
        >
          {{ data.title }}
        </h3>
        <div
          class="w-12 h-12 bg-emerald-400/10 rounded-lg flex items-center justify-center group-hover:bg-emerald-400/20 transition-all duration-300"
        >
          <Icon
            :name="data.icon"
            class="text-emerald-400 transition-transform duration-300 group-hover:scale-110"
            :size="24"
          />
        </div>
      </div>
    </template>

    <!-- Description -->
    <p class="text-gray-400 mb-6">{{ data.description }}</p>

    <!-- Action Buttons -->
    <template #action>
      <n-space justify="end" align="center">
        <n-button
          v-if="data.hasSecondary"
          secondary
          class="hover:border-emerald-400/50"
          :render-icon="() => h(NIcon, { name: 'ph:upload-simple-bold' })"
        >
          {{ data.secondaryButtonButtonContent }}
        </n-button>

        <n-button
          type="primary"
          color="#4ade80"
          :render-icon="() => h(NIcon, { name: 'ph:arrow-right-bold' })"
          @click="data.primaryAction"
        >
          {{ data.primaryButtonContent }}
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui';
import { h } from 'vue';
import type { AdminActionCard } from '~/interfaces/admin-action-card.props';

// Props
defineProps({
  data: {
    type: Object as () => AdminActionCard,
    required: true,
  },
});
</script>

<style scoped>
.n-card {
  --n-border-radius: 1rem;
  --n-padding: 1.5rem;
  --n-title-font-size: 1.25rem;
  --n-title-font-weight: 600;
}

/* Ensure proper contrast for text */
:deep(.n-card-header__main) {
  color: white;
}

/* Customize button hover states */
:deep(.n-button) {
  transition: all 0.3s ease;
}

:deep(.n-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.1);
}
</style>
