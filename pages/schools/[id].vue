<template>
  <div class="min-h-screen bg-[#101014] text-white relative scroll-smooth">
    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
      <n-spin size="large" />
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="flex justify-center items-center min-h-screen"
    >
      <n-result status="error" title="Error" :description="error.message">
        <template #footer>
          <n-button color="#4ade80" @click="refresh()">Try Again</n-button>
        </template>
      </n-result>
    </div>

    <!-- Content -->
    <template v-else-if="school">
      <!-- Hero Section -->
      <div class="relative overflow-hidden py-24">
        <!-- Background decorations -->
        <div class="absolute inset-0 z-0">
          <div
            class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
          />
          <div
            class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500 rounded-full filter blur-3xl opacity-5 transform translate-x-1/2"
          />
        </div>

        <!-- Content wrapper -->
        <div class="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div class="mx-auto max-w-3xl text-center">
            <h1
              class="text-6xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text mb-6"
            >
              {{ school.name }}
            </h1>
            <p class="text-xl text-gray-300 mb-4 italic">
              "{{ school.motto }}"
            </p>
            <p class="text-lg text-gray-400">
              {{ school.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="py-24 bg-[#18181c] relative overflow-hidden">
        <div class="absolute inset-0">
          <div
            class="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
          />
          <div
            class="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-5 transform translate-x-1/2"
          />
        </div>

        <div class="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <!-- Image Carousel -->
          <n-carousel
            v-if="school.images?.length"
            autoplay
            draggable
            class="mx-auto rounded-xl overflow-hidden border border-gray-700/50 mb-12 max-w-4xl"
          >
            <img
              v-for="(image, index) in school.images"
              :key="index"
              :src="image"
              class="w-full max-h-[30rem] object-cover"
            >
          </n-carousel>

          <!-- Info Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <!-- General Info Card -->
            <n-card
              class="bg-[#262629] border border-gray-700 hover:border-emerald-400/50 transition-all duration-300"
            >
              <template #header>
                <div class="flex items-center gap-4 mb-4">
                  <div class="bg-emerald-400/10 p-3 rounded-xl">
                    <Icon
                      name="ph:info-bold"
                      class="text-3xl text-emerald-400"
                    />
                  </div>
                  <h3
                    class="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
                  >
                    General Information
                  </h3>
                </div>
              </template>
              <n-descriptions bordered>
                <n-descriptions-item label="Location">{{
                  school.location
                }}</n-descriptions-item>
                <n-descriptions-item label="Founded">{{
                  school.founded
                }}</n-descriptions-item>
                <n-descriptions-item label="Type">{{
                  school.type
                }}</n-descriptions-item>
                <n-descriptions-item label="Student Body">{{
                  school.studentCount
                }}</n-descriptions-item>
              </n-descriptions>
            </n-card>

            <!-- Contact Info Card -->
            <n-card
              class="bg-[#262629] border border-gray-700 hover:border-emerald-400/50 transition-all duration-300"
            >
              <template #header>
                <div class="flex items-center gap-4 mb-4">
                  <div class="bg-emerald-400/10 p-3 rounded-xl">
                    <Icon
                      name="ph:phone-bold"
                      class="text-3xl text-emerald-400"
                    />
                  </div>
                  <h3
                    class="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
                  >
                    Contact Information
                  </h3>
                </div>
              </template>
              <n-descriptions bordered>
                <n-descriptions-item label="Email">{{
                  school.email
                }}</n-descriptions-item>
                <n-descriptions-item label="Phone">{{
                  school.phone
                }}</n-descriptions-item>
                <n-descriptions-item label="Address">{{
                  school.address
                }}</n-descriptions-item>
              </n-descriptions>
            </n-card>
          </div>

          <!-- Description Section -->
          <n-card
            class="bg-[#262629] border border-gray-700 hover:border-emerald-400/50 transition-all duration-300 mb-12"
          >
            <template #header>
              <div class="flex items-center gap-4 mb-4">
                <div class="bg-emerald-400/10 p-3 rounded-xl">
                  <Icon
                    name="ph:book-open-bold"
                    class="text-3xl text-emerald-400"
                  />
                </div>
                <h3
                  class="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
                >
                  About the University
                </h3>
              </div>
            </template>
            <p class="text-gray-400 whitespace-pre-line">
              {{ school.description }}
            </p>
          </n-card>

          <!-- Programs Section -->
          <n-card
            class="bg-[#262629] border border-gray-700 hover:border-emerald-400/50 transition-all duration-300"
          >
            <template #header>
              <div class="flex items-center gap-4 mb-4">
                <div class="bg-emerald-400/10 p-3 rounded-xl">
                  <Icon
                    name="ph:graduation-cap-bold"
                    class="text-3xl text-emerald-400"
                  />
                </div>
                <h3
                  class="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
                >
                  Available Programs
                </h3>
              </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="program in school.programs"
                :key="program"
                class="p-4 bg-[#18181c] rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-all duration-300"
              >
                <div class="flex items-center gap-2">
                  <Icon name="ph:check-circle-fill" class="text-emerald-400" />
                  <span class="text-gray-300">{{ program }}</span>
                </div>
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { School } from '~/interfaces/organizations/school';

const route = useRoute();

const {
  data: school,
  pending,
  error,
  refresh,
} = await useAsyncData<School>(
  'school',
  async (): Promise<School> => {
    const schoolId = route.params.id as string;
    return await $fetch(`/api/schools/${schoolId}`);
  },
  {
    server: true,
    lazy: false,
  }
);

useHead(() => ({
  title: school.value?.name ?? 'Loading School...',
  meta: [
    {
      name: 'description',
      content: `Learn about ${school.value?.name} - ${school.value?.description}`,
    },
    {
      property: 'og:image',
      content: school.value?.images?.[0] ?? '',
    },
  ],
}));
</script>
