<template>
  <div
    class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 group hover:border-emerald-400/50 transition-all duration-300 h-full"
  >
    <div class="flex flex-col h-full">
      <!-- Image Section -->
      <div
        class="relative aspect-video mb-6 rounded-lg overflow-hidden group-hover:shadow-lg transition-all duration-300"
      >
        <img
          :src="school.images[0]"
          :alt="school.name"
          class="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-300"
        >
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#18181c]/80 to-transparent opacity-60"
        />
        <div class="absolute bottom-3 right-3">
          <n-tag
            type="success"
            round
            size="small"
            class="bg-emerald-400/20 border-emerald-400/50 text-emerald-400"
          >
            {{ school.motto }}
          </n-tag>
        </div>
      </div>

      <!-- Content Section -->
      <div class="flex-grow">
        <h3
          class="text-2xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text line-clamp-1"
        >
          {{ school.name }}
        </h3>
        <p class="text-gray-400 text-sm line-clamp-3 mb-6">
          {{ school.shortDescription }}
        </p>
      </div>

      <!-- Footer Section -->
      <div class="mt-auto pt-4 border-t border-gray-700/50">
        <n-button
          type="primary"
          color="#4ade80"
          class="w-full text-lg group-hover:shadow-emerald-400/20 group-hover:shadow-lg transition-all duration-300"
          @click="navigateToSchool(school.id)"
        >
          Learn More
          <template #icon>
            <Icon name="ph:arrow-right-bold" class="ml-1" />
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'nuxt/app';
import type { School } from '~/interfaces/organizations/school';

const router = useRouter();

defineProps<{
  school: School;
}>();

const navigateToSchool = (schoolId: string) => {
  router.push(`/schools/${schoolId}`);
};
</script>

<style scoped>
/* Remove old styles as they're now handled by Tailwind classes */
</style>
