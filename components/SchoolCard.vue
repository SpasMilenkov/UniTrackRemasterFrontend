<template>
  <div
    class="bg-background-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-6 group hover:border-primary/50 transition-all duration-300 h-full feature-card"
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
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-background-card/80 to-transparent opacity-60"
        />
        <div class="absolute bottom-3 right-3">
          <n-tag
            type="success"
            round
            size="small"
            class="bg-primary/20 border-primary/50 text-primary"
          >
            {{ school.motto }}
          </n-tag>
        </div>
      </div>
      <!-- Content Section -->
      <div class="flex-grow">
        <h3 class="text-2xl font-bold mb-3 text-gradient line-clamp-1">
          {{ school.name }}
        </h3>
        <p class="text-text-muted text-sm line-clamp-3 mb-6">
          {{ school.description }}
        </p>
      </div>
      <!-- Footer Section -->
      <div class="mt-auto pt-4 border-t border-border/50">
        <n-button
          type="primary"
          class="w-full text-lg group-hover:shadow-primary/20 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105"
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
.feature-card {
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.15);
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: rgba(var(--color-primary-rgb), 0.3);
  box-shadow:
    0 0 30px rgba(var(--color-primary-rgb), 0.1),
    0 0 2px rgba(var(--color-primary-rgb), 0.3);
  transform: translateY(-4px);
}

.text-gradient {
  background-image: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
}
</style>
