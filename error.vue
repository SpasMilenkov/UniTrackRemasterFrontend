<!-- error.vue -->
<template>
  <n-config-provider :theme="darkTheme">
    <n-space
      align="center"
      justify="center"
      class="min-h-screen bg-[hsl(240,8%,5%)]"
    >
      <n-card class="w-full max-w-md mx-4 text-center">
        <template #header>
          <n-h1>
            <n-icon size="48" class="text-red-500">
              <Icon name="ion:warning-outline" />
            </n-icon>
          </n-h1>
        </template>
        <n-h2 class="mb-4">Oops! Something went wrong</n-h2>
        <n-p v-if="error.statusCode === 404" class="mb-6">
          We're sorry, but the page you tried to access does not exist.</n-p
        >
        <n-p v-else class="mb-6"
          >We're sorry, but an error occurred while processing your
          request.</n-p
        >
        <n-p class="text-orange-600 text-xl">Error: {{ error.statusCode }}</n-p>
        <template #footer>
          <n-button type="primary" @click="handleError">
            Go back home
          </n-button>
        </template>
      </n-card>
    </n-space>
  </n-config-provider>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import { NCard, NH1, NH2, NP, NButton, NIcon, darkTheme } from 'naive-ui';

defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true,
  },
});

const handleError = () => {
  navigateTo('/');
};
</script>
